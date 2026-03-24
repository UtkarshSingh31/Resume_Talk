from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks
from typing import Dict, Any
import shutil
import uuid
import os
from pathlib import Path
from app.core.config import settings
from app.core.models.responses import AnalyzeResponse
from app.core.graph.builder import build_graph
from app.persistence.checkpointer import get_checkpointer

router = APIRouter()

# Global checkpointer and compiled app, these should ideally be initialized at startup or lazily
compiled_app = None

def get_compiled_app():
    global compiled_app
    if compiled_app is None:
        graph = build_graph()
        checkpointer = get_checkpointer()
        compiled_app = graph.compile(checkpointer=checkpointer)
    return compiled_app

def background_optimize_task(thread_id: str, pdf_path: str, job_role: str, job_level: str):
    app = get_compiled_app()
    config = {"configurable": {"thread_id": thread_id}}
    initial_input = {
        "raw_pdf_path": pdf_path,
        "job_role": job_role,
        "job_level": job_level,
    }

    # Execute graph
    for event in app.stream(initial_input, config, stream_mode="updates"):
        pass

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    job_role: str = Form(...),
    job_level: str = Form(...)
):
    thread_id = str(uuid.uuid4())
    
    file_path = settings.TEMP_UPLOAD_DIR / f"{thread_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Start the task in background
    background_tasks.add_task(background_optimize_task, thread_id, str(file_path), job_role, job_level)
    
    return AnalyzeResponse(thread_id=thread_id, status="processing")
