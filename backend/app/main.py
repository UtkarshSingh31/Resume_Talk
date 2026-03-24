from fastapi import FastAPI
from app.core.config import settings 
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.router import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for resume optimization + RAG chat",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    debug=settings.DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
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