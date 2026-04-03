import json
import re
import os
import requests
from datetime import datetime
from app.core.models.resume_state import ResumeState
from app.core.utils.pdf import extract_text_from_pdf
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from app.core.config import settings

# Lazy-load LLMs to avoid blocking app startup
_llm_google = None
_llm_groq = None

def get_llm_google():
    global _llm_google
    if _llm_google is None:
        _llm_google = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.0,
            api_key=settings.GOOGLE_API_KEY
        )
    return _llm_google

def get_llm_groq():
    global _llm_groq
    if _llm_groq is None:
        _llm_groq = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.0,
            api_key=settings.GROQ_API_KEY
        )
    return _llm_groq

def ingest_resume(state: ResumeState):
    text = extract_text_from_pdf(state["raw_pdf_path"])
    return {
        "raw_text": text,
        "iteration": 0,
        "current_date": datetime.now().strftime("%Y-%m-%d"),
        "recommendations": [],
        "job_openings": [],
        "email_draft": ""
    }

def detect_sections(state: ResumeState):
    prompt = """
Split the resume into sections: header, skills, experience, projects, education, certifications.
Resume:
{raw_text}

Return JSON only.
""".format(raw_text=state.get("raw_text", ""))
    resp = get_llm_google().invoke(prompt)
    try:
        sections = json.loads(resp.content.strip("```json\n\r "))
    except:
        sections = {}
    return {"sections": sections}

def extract_entities(state: ResumeState):
    prompt = """
Extract entities: languages, frameworks, tools, databases, domains.
Sections:
{sections}

Return JSON only.
""".format(sections=state.get("sections", {}))
    resp = get_llm_google().invoke(prompt)
    try:
        entities = json.loads(resp.content.strip("```json\n\r "))
    except:
        entities = {}
    return {"entities": entities}

def infer_signals(state: ResumeState):
    prompt = """
Infer signals: seniority_level, role_bias, project_quality, impact_strength.
Entities: {entities}
Sections: {sections}

Return JSON only.
""".format(entities=state.get("entities", {}), sections=state.get("sections", {}))
    resp = get_llm_google().invoke(prompt)
    try:
        signals = json.loads(resp.content.strip("```json\n\r "))
    except:
        signals = {}
    return {"signals": signals}

def evaluate_resume(state: ResumeState):
    prompt = """
Critically evaluate.
Signals: {signals}
Return JSON: strengths, weaknesses, missing_elements, improvement_advice
""".format(signals=state.get("signals", {}))
    resp = get_llm_google().invoke(prompt)
    try:
        eval_data = json.loads(resp.content.strip("```json\n\r "))
    except:
        eval_data = {}
    return {"evaluation": eval_data}

def ats_scoring(state: ResumeState):
    prompt = """
    You are a strict ATS scoring engine.

    Job role: {job_role}
    Level: {job_level}
    Current date: {current_date}

    Resume text:
    {raw_text}

    Score 0-100. Be harsh.
    Return ONLY JSON:
    {{
      "score": <int 0-100>,
      "breakdown": {{"skills": <0-40>, "domain": <0-20>, "role": <0-20>, "completeness": <0-10>}},
      "missing_keywords": ["..."],
      "penalty_reason": "short reason or empty"
    }}
    """.format(
        job_role=state.get("job_role", ""),
        job_level=state.get("job_level", ""),
        current_date=state.get("current_date", ""),
        raw_text=state.get("raw_text", "")
    )

    resp = get_llm_groq().invoke(prompt)
    raw = resp.content.strip()
    cleaned = re.sub(r'^(```|json|\s*)+', '', raw)
    cleaned = re.sub(r'(```|json|\s*)+$', '', cleaned)
    cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
        score = int(data.get("score", 0))
        if score < 0 or score > 100:
            score = 50
        return {
            "ats_score": score,
            "ats_breakdown": data
        }
    except Exception as e:
        return {
            "ats_score": 50,
            "ats_breakdown": {
                "error": "JSON parse failed",
                "raw": raw[:300],
                "cleaned_snippet": cleaned[:200]
            }
        }

def refine_resume(state: ResumeState):
    iteration = state.get("iteration", 0) + 1
    max_iter = 3
    if iteration > max_iter:
        return {
            "iteration": iteration,
            "next_action": "FINAL"   
        }

    prompt = """
Improve resume for {job_role} {job_level}.
Score: {ats_score}
Breakdown: {ats_breakdown}

Rewrite raw text to fix gaps.
Return only the new raw_text string.
""".format(
        job_role=state.get("job_role", ""),
        job_level=state.get("job_level", ""),
        ats_score=state.get("ats_score", 0),
        ats_breakdown=state.get("ats_breakdown", {})
    )
    new_text = get_llm_groq().invoke(prompt).content.strip()
    return {
        "raw_text": new_text,
        "iteration": iteration,
        "recommendations": state.get("recommendations", []) + [f"Refined iteration {iteration}"]
    }

def fetch_job_openings(state: ResumeState):
    url = "https://jsearch.p.rapidapi.com/search"
    query = f"{state.get('job_role', '')} {state.get('job_level', '')} India"
    params = {"query": query, "page": "1", "num_pages": "3"}
    headers = {
        "X-RapidAPI-Key": settings.RAPID_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    try:
        r = requests.get(url, headers=headers, params=params).json()
        jobs = r.get("data", [])[:3]
        formatted = [{"title": j.get("job_title"), "company": j.get("employer_name"), "link": j.get("job_apply_link")} for j in jobs]
        return {"job_openings": formatted, "jobs_fetched": True}
    except:
        return {"job_openings": [], "jobs_fetched": True}

def draft_email(state: ResumeState):
    if state.get("ats_score", 0) < 80 or not state.get("job_openings"):
        return {"email_draft": "Score too low or no jobs — no draft", "emails_drafted": state.get("emails_drafted", 0) + 1}
    
    job = state.get("job_openings")[0]
    prompt = """
Draft short email for {job_role} at {company}.

Subject, greeting, 2-3 sentences why fit, attach resume, closing.
""".format(job_role=state.get('job_role', ''), company=job.get('company', 'this company'))
    resp = get_llm_groq().invoke(prompt)
    return {"email_draft": resp.content.strip(), "emails_drafted": state.get("emails_drafted", 0) + 1}

def generate_final_output(state: ResumeState):
    prompt = """
Summarize resume optimization.

Score: {ats_score}
Breakdown: {ats_breakdown}
Recommendations: {recommendations}
Jobs: {job_openings}
Email draft: {email_draft}

Return concise markdown report.
""".format(
        ats_score=state.get("ats_score", 0),
        ats_breakdown=state.get("ats_breakdown", {}),
        recommendations=state.get("recommendations", []),
        job_openings=state.get("job_openings", []),
        email_draft=state.get("email_draft", "none")
    )
    resp = get_llm_google().invoke(prompt)
    return {"final_output": resp.content.strip()}
