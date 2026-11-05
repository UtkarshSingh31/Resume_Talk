from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.rag.service import RAGSERVICE
from app.core.config import settings
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None

rag_services = {}

def get_rag_service(thread_id: str):
    pdf_files = list(settings.TEMP_UPLOAD_DIR.glob(f"{thread_id}_*.pdf"))
    if not pdf_files:
        raise HTTPException(status_code=404, detail="Resume not found for this thread")
    
    from app.api.routes.endpoints.optimize import get_compiled_app

    config = {"configurable": {"thread_id": thread_id}}
    workflow_state = get_compiled_app().get_state(config).values
    cached = rag_services.get(thread_id)
    if cached is None or str(cached.data_path) != str(pdf_files[0]):
        llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", temperature=0.0, api_key=settings.GOOGLE_API_KEY)
        cached = RAGSERVICE(pdf_files[0], llm, workflow_state=workflow_state)
        cached.build()
        rag_services[thread_id] = cached
    else:
        cached.workflow_state = workflow_state
    return cached

@router.post("/chat")
async def chat_with_resume(request: ChatRequest):
    if not request.thread_id:
        raise HTTPException(status_code=400, detail="thread_id is required")
        
    rag = get_rag_service(request.thread_id)
    answer = rag.query(request.message)
    return {"answer": answer}
