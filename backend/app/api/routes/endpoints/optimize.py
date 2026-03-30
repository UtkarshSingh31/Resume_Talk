from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from typing import Dict, Any
import shutil
import uuid
import os
import json
from pathlib import Path
from app.core.config import settings
from app.core.models.responses import AnalyzeResponse
from app.core.graph.builder import build_graph
from app.persistence.checkpointer import get_checkpointer

router = APIRouter()

# Global checkpointer and compiled app
compiled_app = None
pending_jobs = {}

def get_compiled_app():
    global compiled_app
    if compiled_app is None:
        graph = build_graph()
        checkpointer = get_checkpointer()
        compiled_app = graph.compile(checkpointer=checkpointer)
    return compiled_app

def sse_event(data_dict):
    """Format a dict as a proper SSE event with real newlines."""
    line = "data: " + json.dumps(data_dict)
    return line + "\n\n"

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form(...),
    job_level: str = Form(...)
):
    thread_id = str(uuid.uuid4())
    
    file_path = settings.TEMP_UPLOAD_DIR / f"{thread_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pending_jobs[thread_id] = {
        "pdf_path": str(file_path),
        "job_role": job_role,
        "job_level": job_level
    }
    
    return AnalyzeResponse(thread_id=thread_id, status="processing")

@router.get("/stream/{thread_id}")
async def stream_analysis(thread_id: str):
    job = pending_jobs.pop(thread_id, None)
    if not job:
        return StreamingResponse(
            iter([sse_event({"status": "error", "message": "Job not found or already running."})]),
            media_type="text/event-stream"
        )
    
    def event_generator():
        app = get_compiled_app()
        config = {"configurable": {"thread_id": thread_id}}
        initial_input = {
            "raw_pdf_path": job["pdf_path"],
            "job_role": job["job_role"],
            "job_level": job["job_level"],
        }
        
        yield sse_event({"status": "processing", "details": {"start": True}})
        
        try:
            for event in app.stream(initial_input, config, stream_mode="updates"):
                state_snapshot = app.get_state(config)
                val = state_snapshot.values
                yield sse_event({"status": "processing", "details": val})
            
            final_snapshot = app.get_state(config)
            yield sse_event({"status": "completed", "details": final_snapshot.values})
        except Exception as e:
            import traceback
            traceback.print_exc()
            yield sse_event({"status": "error", "message": str(e)})

    return StreamingResponse(event_generator(), media_type="text/event-stream")
