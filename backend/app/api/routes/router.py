from fastapi import APIRouter
from app.api.routes.endpoints.optimize import router as optimize_router
from app.api.routes.endpoints.status import router as status_router
from app.api.routes.endpoints.chat import router as chat_router

router = APIRouter()

router.include_router(optimize_router, tags=["Optimization"])
router.include_router(status_router, tags=["Status"])
router.include_router(chat_router, tags=["Chat"])
