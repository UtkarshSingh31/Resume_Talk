from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class AnalyzeResponse(BaseModel):
    thread_id: str
    status: str

class StatusResponse(BaseModel):
    thread_id: str
    status: str
    current_state: Dict[str, Any]
    details: Optional[Dict[str, Any]] = None
