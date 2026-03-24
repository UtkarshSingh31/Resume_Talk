from langgraph.graph import StateGraph, START, END
from app.core.models.resume_state import ResumeState
from app.core.graph.nodes import (
    ingest_resume, detect_sections, extract_entities, infer_signals,
    evaluate_resume, ats_scoring, refine_resume, fetch_job_openings,
    draft_email, generate_final_output
)
from app.core.graph.supervisor import supervisor_node

def build_graph():
    graph = StateGraph(ResumeState)

    graph.add_node("ingest", ingest_resume)
    graph.add_node("sections", detect_sections)
    graph.add_node("entities", extract_entities)
    graph.add_node("signals", infer_signals)
    graph.add_node("evaluate", evaluate_resume)
    graph.add_node("ats", ats_scoring)
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("refine_resume", refine_resume)
    graph.add_node("fetch_job_openings", fetch_job_openings)
    graph.add_node("draft_email", draft_email)
    graph.add_node("final", generate_final_output)

    graph.set_entry_point("ingest")

    graph.add_edge("ingest", "sections")
    graph.add_edge("sections", "entities")
    graph.add_edge("entities", "signals")
    graph.add_edge("signals", "evaluate")
    graph.add_edge("evaluate", "ats")
    graph.add_edge("ats", "supervisor")

    graph.add_conditional_edges(
        "supervisor",
        lambda s: s["next_action"],
        {
            "REFINE": "refine_resume",
            "JOBS": "fetch_job_openings",
            "EMAIL": "draft_email",
            "FINAL": "final"
        }
    )

    graph.add_edge("refine_resume", "ats")
    graph.add_edge("fetch_job_openings", "draft_email")
    graph.add_edge("draft_email", "final")
    graph.add_edge("final", END)

    return graph
