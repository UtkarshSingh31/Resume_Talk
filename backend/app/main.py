from fastapi import FastAPI
from app.api.routes.router import api_router

app = FastAPI(
    title="Resume Optimizer API",
    description="AI-powered resume optimization & job application assistant",
    version="0.1.0",
)

app.include_router(api_router, prefix="/api/routes")