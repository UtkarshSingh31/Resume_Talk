from fastapi import APIRouter
from app.core.models.responses import StatusResponse
from app.api.routes.endpoints.optimize import get_compiled_app

router = APIRouter()

@router.get("/status/{thread_id}", response_model=StatusResponse)
async def get_status(thread_id: str):
    app = get_compiled_app()
    config = {"configurable": {"thread_id": thread_id}}
    
    # get_state returns StateSnapshot
    state_snapshot = app.get_state(config)
    
    if not state_snapshot.values:
        return StatusResponse(
            thread_id=thread_id,
            status="not_found",
            current_state={}
        )

    val = state_snapshot.values
    is_finished = val.get("next_action") == "FINAL" or "final_output" in val
    
    return StatusResponse(
        thread_id=thread_id,
        status="completed" if is_finished else "processing",
        current_state={
            "score": val.get("ats_score", 0),
            "next_action": val.get("next_action", "INGEST"),
            "iteration": val.get("iteration", 0)
        },
        details=val
    )
