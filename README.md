# Resume Talk

Resume Talk is an AI career copilot for resume analysis, ATS optimization, job discovery, outreach drafting, and resume-grounded chat.

The application accepts a PDF resume and a target profile, then runs a stateful LangGraph workflow behind a FastAPI API. The React frontend streams workflow progress and renders the final state as an ATS report.

## Features

- PDF text extraction with `pypdf`
- Resume section detection and entity extraction
- Candidate signal and resume quality analysis
- Role- and seniority-aware ATS scoring
- Iterative resume refinement through a supervisor-controlled loop
- Live job discovery through RapidAPI JSearch
- Automatically generated outreach email
- SQLite-backed LangGraph checkpoints
- Resume-specific RAG chat using FAISS and `all-MiniLM-L6-v2`
- Server-Sent Events for live pipeline progress
- React UI with workflow monitor, report view, job links, email draft, and RAG copilot

## High-level architecture

```text
┌──────────────────────┐
│ React + Vite frontend│
│ frontend_react/      │
└──────────┬───────────┘
           │ HTTP multipart upload / SSE / JSON chat
           ▼
┌──────────────────────┐
│ FastAPI application   │
│ backend/app/main.py   │
└──────────┬───────────┘
           │
           ├── Upload and thread management
           ├── LangGraph stream endpoint
           └── Resume RAG chat endpoint
           ▼
┌──────────────────────────────────────────┐
│ LangGraph StateGraph                     │
│ backend/app/core/graph/builder.py        │
│                                          │
│ pypdf → Gemini → Groq → Supervisor       │
│                          ├─ refine loop  │
│                          ├─ jobs         │
│                          ├─ email        │
│                          └─ final        │
└──────────┬───────────────────┬───────────┘
           │                   │
           ▼                   ▼
┌──────────────────┐  ┌────────────────────┐
│ SQLite checkpoints│  │ temp uploaded PDFs│
│ checkpoints/      │  │ temp_uploads/     │
└──────────────────┘  └────────────────────┘
```

## Repository structure

```text
resume_talk/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── graph/
│   │   │   │   ├── builder.py
│   │   │   │   ├── nodes.py
│   │   │   │   └── supervisor.py
│   │   │   ├── models/
│   │   │   │   ├── requests.py
│   │   │   │   ├── responses.py
│   │   │   │   └── resume_state.py
│   │   │   ├── rag/
│   │   │   │   ├── service.py
│   │   │   │   ├── retriever.py
│   │   │   │   └── prompts.py
│   │   │   └── utils/
│   │   │       ├── pdf.py
│   │   │       └── prompts.py
│   │   ├── api/routes/
│   │   │   ├── router.py
│   │   │   └── endpoints/
│   │   │       ├── optimize.py
│   │   │       ├── chat.py
│   │   │       └── status.py
│   │   └── persistence/
│   │       └── checkpointer.py
│   ├── requirements.txt
│   └── run.py
├── frontend_react/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── hooks/useAnalysis.js
│   ├── package.json
│   └── vite.config.js
├── checkpoints/
├── temp_uploads/
├── pyproject.toml
└── README.md
```

## LangGraph workflow

The graph is built in [backend/app/core/graph/builder.py](backend/app/core/graph/builder.py). Every node receives the current `ResumeState` and returns a partial state update.

### Linear analysis path

```text
START
  │
  ▼
ingest
  │
  ▼
sections
  │
  ▼
entities
  │
  ▼
signals
  │
  ▼
evaluate
  │
  ▼
ats
  │
  ▼
supervisor
```

### Node responsibilities

| Node | Responsibility | Main provider/output |
|---|---|---|
| `ingest` | Reads the uploaded PDF and extracts text; identifies basic candidate profile fields | `pypdf`, local parsing |
| `sections` | Splits the resume into header, skills, experience, projects, education, and certifications | Gemini |
| `entities` | Extracts languages, frameworks, tools, databases, and domains | Gemini |
| `signals` | Infers seniority, role bias, project quality, and impact strength | Gemini |
| `evaluate` | Produces strengths, weaknesses, missing elements, and advice | Gemini |
| `ats` | Scores resume fit for the requested role and level from 0 to 100 | Groq |
| `supervisor` | Chooses the next branch based on score and workflow state | Python condition |
| `refine_resume` | Rewrites resume text to address ATS gaps | Groq |
| `fetch_job_openings` | Retrieves up to three matching jobs | RapidAPI JSearch |
| `draft_email` | Creates a role-specific outreach message | Groq |
| `final` | Creates the final optimization report | Gemini |

### Supervisor branching

The supervisor is implemented in [backend/app/core/graph/supervisor.py](backend/app/core/graph/supervisor.py).

```text
                         ┌───────────────┐
                         │ supervisor    │
                         └───────┬───────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
       REFINE                  JOBS                  EMAIL
          │                      │                      │
          ▼                      ▼                      ▼
   refine_resume          fetch_job_openings       draft_email
          │                      │                      │
          └───────► ats ◄────────┘                      │
                                  │                      ▼
                                  └──────────────► final

                         FINAL ───────────────────► final
```

Branch rules:

1. If `iteration >= 3`, stop refinement and go to `FINAL`.
2. A score of at least `80` passes immediately.
3. A score of at least `70` passes after the second iteration.
4. A passing score with no jobs goes to `JOBS`.
5. Jobs already fetched but no email goes to `EMAIL`.
6. Otherwise, the graph goes to `REFINE`, which loops back to `ats`.

The current threshold is enforced by the backend supervisor at 80. The frontend slider is used as a display/configuration control; if a different threshold is required, the supervisor rule must also be made configurable in the backend.

## Resume state

The shared state is defined in [backend/app/core/models/resume_state.py](backend/app/core/models/resume_state.py).

Important fields include:

```text
raw_pdf_path       temporary source PDF
raw_text           extracted or refined resume text
candidate_name     locally extracted candidate name
candidate_email    locally extracted email
candidate_phone    locally extracted phone
sections           structured resume sections
entities           technologies, tools, databases, and domains
signals            inferred seniority and impact signals
evaluation         strengths, weaknesses, and advice
ats_score          integer score from 0 to 100
ats_breakdown      score details and missing keywords
job_role           requested target role
job_level          requested seniority level
job_openings       RapidAPI results
email_draft        generated outreach text
iteration          refinement iteration counter
next_action        supervisor branch
final_output       final markdown report
```

## Request lifecycle

### 1. Start analysis

The frontend sends a multipart request:

```http
POST /api/v1/analyze
Content-Type: multipart/form-data
```

Form fields:

```text
file      PDF resume
job_role  target role, for example "AI engineer/ml engineer"
job_level seniority, for example "Fresher"
```

The endpoint saves the upload as:

```text
temp_uploads/{thread_id}_{original_filename}
```

It returns immediately:

```json
{
  "thread_id": "uuid",
  "status": "processing"
}
```

### 2. Stream progress

The frontend opens:

```http
GET /api/v1/stream/{thread_id}
Accept: text/event-stream
```

Each node event is formatted as:

```text
data: {"status":"processing","node":"ats","node_label":"ATS scoring","message":"Score the resume against the requested role and seniority.","update":{"ats_score":82},"details":{...}}
```

The endpoint preserves the node name and update returned by `app.stream(...)`, reads the checkpointed state after each update, and sends both the machine-readable update and a user-facing explanation. The UI uses those fields to show the active node, what it is doing, and which state fields changed. Possible node events include `ingest`, `sections`, `entities`, `signals`, `evaluate`, `ats`, `supervisor`, `refine_resume`, `fetch_job_openings`, `draft_email`, and `final`.

The final event is:

```json
{
  "status": "completed",
  "details": {
    "candidate_name": "Candidate",
    "ats_score": 82,
    "job_openings": [],
    "final_output": "..."
  }
}
```

Errors are sent as:

```json
{
  "status": "error",
  "message": "description of the failure"
}
```

Node/provider failures are not converted into fake empty results or a default ATS score. The stream reports the exception type, failing node when available, and message. Optional job-search failures are recorded as warnings and the workflow can still produce a report without jobs.

### 3. Resume chat

The chat endpoint is implemented in [backend/app/api/routes/endpoints/chat.py](backend/app/api/routes/endpoints/chat.py):

```http
POST /api/v1/chat
Content-Type: application/json
```

```json
{
  "thread_id": "analysis-thread-uuid",
  "message": "What are my strongest skills?"
}
```

The service locates the PDF using the thread ID, loads its pages, splits them into chunks, embeds them with `sentence-transformers/all-MiniLM-L6-v2`, stores them in FAISS, retrieves the five nearest chunks, and asks Gemini to answer only from that context.

## Persistence and SQLite

LangGraph uses `SqliteSaver` in [backend/app/persistence/checkpointer.py](backend/app/persistence/checkpointer.py). The default database is:

```text
checkpoints/resume_checkpoints.db
```

The `thread_id` is passed to LangGraph as:

```python
{
    "configurable": {
        "thread_id": thread_id
    }
}
```

SQLite stores graph checkpoints and state history. It does not store the uploaded PDF or API keys. PDFs are stored separately in `temp_uploads/`.

SQLite is suitable for local development and a single backend process. A multi-instance deployment needs a shared database/checkpointer; separate containers would otherwise have separate local SQLite files. The database, WAL files, and uploaded PDFs are ignored by Git.

## RAG pipeline

The RAG implementation is under `backend/app/core/rag/`:

1. `load_documents` loads PDF pages.
2. `sectionize_documents` groups text by detected resume section.
3. `RecursiveCharacterTextSplitter` creates chunks of approximately 600 characters with 100-character overlap.
4. `HuggingFaceEmbeddings` creates local embeddings with `all-MiniLM-L6-v2`.
5. FAISS indexes the chunks.
6. The retriever returns the five nearest chunks.
7. Gemini answers using retrieved resume context plus a safe projection of the completed LangGraph checkpoint.

Simple profile questions such as name, email, and phone are answered from locally extracted profile data before vector retrieval.

The graph and RAG service remain separate execution paths. They are joined through `thread_id`: chat locates the PDF and reads the same thread's SQLite checkpoint. RAG receives selected fields such as `ats_score`, `ats_breakdown`, `evaluation`, `recommendations`, branch iteration, jobs, and warnings; it does not receive internal paths, API keys, or the full checkpoint blindly. This allows questions such as “Why was my ATS score low?” and “Did the supervisor refine my resume?” to be grounded in the actual run.

## Frontend

The main UI is [frontend_react/src/App.jsx](frontend_react/src/App.jsx). It contains:

- Overview and architecture landing page
- PDF upload and target profile form
- Live LangGraph workflow monitor
- ATS score and job report
- Outreach email modal
- Resume-grounded RAG copilot

The frontend uses `VITE_API_BASE_URL` when provided. The production fallback is the deployed Hugging Face Space:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For local backend development, set `VITE_API_BASE_URL=http://127.0.0.1:8000`. If it is not set, the frontend uses:

```text
https://utkarshsingh0013-resume-talk.hf.space
```

After changing this value, rebuild and redeploy the frontend. A previously deployed static bundle will continue using its old API URL until rebuilt.

The landing page also contains a visual graph simulation button. That demo is intentionally separate from the real upload flow; the real workflow starts from the PDF upload form and calls the FastAPI endpoints.

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

Provider usage:

| Variable | Used by |
|---|---|
| `GOOGLE_API_KEY` | Gemini 3.5 Flash-Lite parsing, evaluation, final report, and RAG answers |
| `GROQ_API_KEY` | ATS scoring, resume refinement, and email drafting |
| `RAPID_API_KEY` | JSearch job discovery |
| `BASE_ROOT` | Project-relative storage paths |
| `SQLITE_DB_NAME` | SQLite filename under `checkpoints/` |
| `DEBUG` | Development logging/config output |

Never commit `.env`, API keys, generated databases, uploaded resumes, or model caches.

### Hugging Face Spaces secrets

For the deployed backend, add the variables in the Space's **Settings → Variables and secrets → Secrets** section:

```text
GOOGLE_API_KEY
GROQ_API_KEY
RAPID_API_KEY
```

Paste only the raw key value. Do not include surrounding quotes, backticks, spaces, or the variable name. For example, use `AIza...`, not `"AIza..."` or `GOOGLE_API_KEY=AIza...`. The backend trims whitespace and accidental surrounding quotes, but the secret should still be entered as a raw value.

After changing a secret, restart or redeploy the Space so the running container receives the new environment value. The `/` endpoint only reports whether a value is present; `google_api_key_set: true` does not prove that Google accepts the key.

If Gemini returns `400 API_KEY_INVALID`, the key is invalid, revoked, copied incorrectly, belongs to a different provider, or was not updated in the running Space. Create a new Gemini API key in Google AI Studio, replace the `GOOGLE_API_KEY` Space secret, restart the Space, and test again. If a key has ever been exposed in logs, screenshots, commits, or chat, revoke it and create a replacement immediately.

## Installation

### Backend

From the repository root:

```powershell
uv sync
```

The dependency declarations are in [pyproject.toml](pyproject.toml). A legacy [backend/requirements.txt](backend/requirements.txt) is also provided for environments that use pip.

### Frontend

```powershell
cd frontend_react
npm install
```

## Run locally

Start the backend from the repository root:

```powershell
uv run uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

Start the frontend in a second terminal:

```powershell
cd frontend_react
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/redoc
```

## API reference

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | API status and non-secret configuration status |
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/analyze` | Upload PDF and create an analysis thread |
| `GET` | `/api/v1/stream/{thread_id}` | Stream LangGraph updates and final result |
| `POST` | `/api/v1/chat` | Ask a question grounded in the uploaded resume |

Example upload with PowerShell:

```powershell
$form = @{
  file = Get-Item .\utkarsh_cv.pdf
  job_role = "AI engineer/ml engineer"
  job_level = "Fresher"
}
Invoke-RestMethod `
  -Uri http://127.0.0.1:8000/api/v1/analyze `
  -Method Post `
  -Form $form
```

## Validation and testing

Frontend lint and production build:

```powershell
cd frontend_react
npm run lint
npm run build
```

Backend syntax and import validation:

```powershell
uv run python -m compileall -q backend/app backend/run.py
uv run python -c "import sys; sys.path.insert(0, 'backend'); import app.main; print('BACKEND_OK')"
```

Health check:

```text
GET http://127.0.0.1:8000/health
```

For a complete manual test, upload a real PDF, select a role and level, wait for the `completed` SSE event, open the report, and ask a question in the RAG copilot using the returned `thread_id`.

## Troubleshooting

### Backend cannot import FastAPI or Uvicorn

Use the project environment:

```powershell
uv sync
uv run uvicorn app.main:app --app-dir backend --port 8000
```

### Browser reports a CORS error

The backend allows the deployed frontend plus local `localhost:5173` and `127.0.0.1:5173` origins. Make sure the frontend URL matches one of those origins, or configure the allowed origin before deployment.

### Stream says job not found

The stream endpoint consumes a pending job once. Use the `thread_id` returned by the most recent `/analyze` request and open the stream only once.

### RAG chat cannot find the resume

Chat requires the same `thread_id` returned by analysis. The corresponding UUID-prefixed PDF must still exist in `temp_uploads/`.

### Provider quota or model errors

Check the provider dashboard and key permissions. A valid key can still return quota errors such as HTTP 429. Groq model availability can change; keep the configured model aligned with one returned by the Groq models API.

## Deployment notes

- Set secrets through the deployment platform, not in source files.
- Set `DEBUG=false` in production.
- Use a persistent volume for `checkpoints/` if SQLite state must survive restarts.
- Use shared production persistence when running multiple backend replicas.
- Configure the production frontend origin in FastAPI CORS.
- Treat uploaded resumes as sensitive user data and define an explicit retention/cleanup policy.
