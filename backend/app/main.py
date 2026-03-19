from fastapi import FastAPI
from app.core.config import settings 

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for resume optimization + RAG chat",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    debug=settings.DEBUG,
)

@app.get("/")
async def root():
    return {
        "message": "Resume Optimizer API is running",
        "settings_loaded": {
            "project_name": settings.PROJECT_NAME,
            "debug": settings.DEBUG,
            "google_api_key_set": bool(settings.GOOGLE_API_KEY),
            "groq_api_key_set": bool(settings.GROQ_API_KEY),
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}