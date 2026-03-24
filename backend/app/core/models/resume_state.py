from typing import TypedDict, Dict, Any, List

class ResumeState(TypedDict):
    raw_pdf_path: str
    raw_text: str
    sections: Dict[str, str]
    entities: Dict[str, Any]
    signals: Dict[str, Any]
    evaluation: Dict[str, Any]
    ats_score: int
    ats_breakdown: Dict[str, Any]
    final_output: str
    job_role: str
    job_level: str
    current_date: str
    iteration: int
    recommendations: List[str]
    job_openings: List[dict]
    email_draft: str
    next_action: str
    jobs_fetched: bool
    emails_drafted: int