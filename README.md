---
title: Resume Talk
emoji: 📝
colorFrom: blue
colorTo: indigo
sdk: docker
app_file: Dockerfile
pinned: false
---

# Resume Talk

Resume Talk is an AI career copilot that analyzes a PDF resume for a target role and seniority level. It combines FastAPI, LangGraph, Gemini, Groq, RapidAPI JSearch, SQLite checkpoints, and resume-grounded RAG chat.

## What happens during an analysis

1. The React frontend sends the PDF, `job_role`, and `job_level` to `POST /api/v1/analyze`.
2. FastAPI saves the PDF under `temp_uploads/` with a UUID-based filename and returns a `thread_id`.
3. The frontend connects to `GET /api/v1/stream/{thread_id}`.
4. LangGraph runs the workflow:
   - extract PDF text with `pypdf`
   - detect sections, entities, signals, and evaluation data with Gemini
   - calculate ATS score with Groq
   - let the supervisor choose refinement, jobs, email, or final output
   - fetch up to three jobs through RapidAPI JSearch
   - generate the final report and outreach draft
5. The final state is streamed to the browser through Server-Sent Events.
6. `POST /api/v1/chat` uses the same `thread_id` to answer questions from the uploaded resume through FAISS and `sentence-transformers/all-MiniLM-L6-v2`.

## SQLite checkpointing

The LangGraph workflow uses a disk-backed SQLite checkpointer, not an in-memory store. The implementation is in [backend/app/persistence/checkpointer.py](backend/app/persistence/checkpointer.py).

By default, the database is:

```text
checkpoints/resume_checkpoints.db
```

The path is controlled by:

```text
BASE_ROOT=E:/resume_talk
SQLITE_DB_NAME=resume_checkpoints.db
```

Each analysis receives a UUID `thread_id`. LangGraph stores the workflow state and checkpoints under that thread, allowing the stream endpoint and later resume chat to refer to the same analysis session.

SQLite is appropriate for local development and a single backend instance. For a multi-instance production deployment, use a shared production checkpointer/database because a local SQLite file is not automatically shared between containers or replicas. Uploaded PDFs are temporary files in `temp_uploads/`; the SQLite database stores workflow checkpoints, not the PDF itself.

The generated database and temporary uploads should not be committed to Git.

## Requirements

- Python 3.10+
- Node.js and npm
- API keys for Gemini, Groq, and RapidAPI JSearch

## Configuration

Create `.env` in the repository root:

```env
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
RAPID_API_KEY=your_rapid_api_key
BASE_ROOT=E:/resume_talk
DEBUG=true
SQLITE_DB_NAME=resume_checkpoints.db
```

Never commit `.env` or expose API key values in frontend code.

## Run locally

Install backend dependencies from the repository root:

```powershell
uv sync
```

Start the backend:

```powershell
uv run uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

Start the frontend in a second terminal:

```powershell
cd frontend_react
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

The frontend uses `VITE_API_BASE_URL` when set; otherwise it defaults to `http://127.0.0.1:8000`.

## Validation

Frontend:

```powershell
cd frontend_react
npm run lint
npm run build
```

Backend:

```powershell
uv run python -m compileall -q backend/app backend/run.py
```

Health check:

```text
GET http://127.0.0.1:8000/health
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Backend health check |
| `POST` | `/api/v1/analyze` | Upload a PDF and create an analysis thread |
| `GET` | `/api/v1/stream/{thread_id}` | Stream LangGraph progress and final state |
| `POST` | `/api/v1/chat` | Ask a question grounded in the uploaded resume |

The chat request body is:

```json
{
  "thread_id": "analysis-thread-uuid",
  "message": "What are my strongest skills?"
}
```
