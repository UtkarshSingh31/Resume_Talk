from app.core.models.resume_state import ResumeState

def supervisor_node(state: ResumeState):
    score = state.get("ats_score", 0)
    iteration = state.get("iteration", 0)
    jobs_fetched = state.get("jobs_fetched", False)
    emails_drafted = state.get("emails_drafted", 0)
    
    # 1. Force Stop Condition
    if iteration >= 3:
        return {"next_action": "FINAL"}
    
    # 2. Success / "Good Enough" Conditions
    # Score >= 80 OR (Score >= 70 after 2 attempts)
    is_passing_score = score >= 80 or (score >= 70 and iteration >= 2)
    
    if is_passing_score:
        if not jobs_fetched:
            return {"next_action": "JOBS"}
        elif emails_drafted >= 1:
            return {"next_action": "FINAL"}
        else:
            return {"next_action": "EMAIL"}

    # 3. Default fallback: Refine the resume
    return {"next_action": "REFINE"}
