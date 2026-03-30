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

global_rag_service = None

def get_rag_service(thread_id: str):
    global global_rag_service
    pdf_files = list(settings.TEMP_UPLOAD_DIR.glob(f"{thread_id}_*.pdf"))
    if not pdf_files:
        raise HTTPException(status_code=404, detail="Resume not found for this thread")
    
    if global_rag_service is None or str(global_rag_service.data_path) != str(pdf_files[0]):
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.0, api_key=settings.GOOGLE_API_KEY)
        global_rag_service = RAGSERVICE(pdf_files[0], llm)
        global_rag_service.build()
        
    return global_rag_service

@router.post("/chat")
async def chat_with_resume(request: ChatRequest):
    if not request.thread_id:
        raise HTTPException(status_code=400, detail="thread_id is required")
        
    rag = get_rag_service(request.thread_id)
    answer = rag.query(request.message)
    return {"answer": answer}
