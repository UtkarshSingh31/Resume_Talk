# Resume Optimizer & Job Application Agent

AI-powered tool that analyzes, optimizes, and tailors your resume for specific job roles — then helps you apply by finding relevant openings and drafting personalized emails.

Built with **LangGraph**, **Groq**, **Gemini**, **FAISS/RAG**, and **FastAPI**.

<p align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Resume+Optimizer+Workflow" alt="Workflow Diagram" />
  <!-- Replace with real screenshot / mermaid diagram later -->
</p>

## What it does

1. Ingests your resume (PDF)
2. Extracts profile, sections, entities, seniority signals
3. Scores ATS compatibility for a target role/level (0–100, strict)
4. Iteratively refines content using LLM until good enough (or max iterations)
5. Fetches real job openings (via RapidAPI JSearch)
6. Drafts short, personalized application emails
7. Produces a markdown report with score, improvements, jobs & email preview
8. Offers conversational Q&A over original + refined resume versions (RAG)

## Core Technologies

- **Agent orchestration** — LangGraph (stateful graph with supervisor routing)
- **LLMs** — Groq (Llama 3.3 70B / 8B) + Google Gemini Flash
- **Vector search / RAG** — FAISS + sentence-transformers/all-MiniLM-L6-v2
- **PDF processing** — PyMuPDF / PyPDFLoader
- **Persistence** — LangGraph checkpointer (MemorySaver → SqliteSaver)
- **API layer** — FastAPI (planned / partial)
- **Job search** — RapidAPI JSearch endpoint


## Current Status (March 2026)

✅ Fully working LangGraph workflow with refinement loop + supervisor  
✅ Checkpointing / resumability (MemorySaver + SqliteSaver)  
✅ ATS scoring (LLM-based, with parsing robustness fixes)  
✅ Job fetching (JSearch API)  
✅ Basic RAG chat over resume (original + refined versions)  
⚙️ FastAPI backend scaffolding started  
⏳ Multi-turn conversation memory in RAG  
⏳ Better intent classification & metadata filtering in retrieval  
⏳ Frontend (Streamlit / React / whatever) — out of scope for now

## How to Run (notebook mode)

1. Install dependencies
   ```bash
   pip install -r requirements.txt
   # or use poetry / uv / pixi
