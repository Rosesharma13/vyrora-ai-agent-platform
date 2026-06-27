# Vyrora AI

A multi-agent AI platform with a FastAPI backend and React frontend. A lightweight supervisor routes requests to one of four specialized agents, each powered by Groq's LLM API.

**Live demo:** _add your deployed frontend URL here after deployment_

---

## What it actually does

| Agent | What it does |
|---|---|
| **Research Agent** | Takes a topic/question and returns a structured overview, key points, and trends |
| **Document Agent** | Accepts a PDF or text file upload, extracts the text, returns a summary + key points, and answers follow-up questions about the document |
| **Planning Agent** | Takes a goal and returns a concrete numbered action plan with a flagged risk |
| **Presentation Agent** | Takes a topic and returns a structured slide-by-slide outline (title + bullets per slide) |

A simple keyword-based **Supervisor** decides which agent handles a request. This is intentionally a plain router, not a graph-based orchestrator — with 4 independent agents and no shared state between them, a framework like LangGraph would add complexity without adding capability.

## What it does NOT do (yet)

Being upfront about scope, since an oversold README is worse than an honest one:

- No vector database / RAG pipeline. Document Q&A works by passing extracted text directly into the prompt (works well for typical resume/report-length documents, not for huge multi-hundred-page files).
- No persistent storage. Nothing is saved between requests — every upload/question is stateless.
- No authentication or user accounts.
- No meeting/transcript agent (was a stub in earlier versions, removed rather than left broken).

## Tech stack

- **Backend:** FastAPI, Groq API (`openai/gpt-oss-120b`), pypdf
- **Frontend:** React (Vite), Axios
- **Deployment:** Render (backend), Vercel (frontend)

## Project structure

```
backend/
  agents/          # research, document, task (planning), presentation, supervisor
  api/routes.py    # all API endpoints
  services/        # groq_service.py - LLM wrapper
  main.py          # FastAPI app entrypoint
frontend/
  src/App.jsx      # full UI - tabs for each agent
```

## Running locally

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # then add your real GROQ_API_KEY
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`. Visit `/docs` for interactive API docs.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://127.0.0.1:8000 for local dev
npm run dev
```

## Deployment

### Backend (Render)

1. Push this repo to GitHub.
2. On Render: New → Web Service → connect this repo.
3. Root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `GROQ_API_KEY` (your real key)
7. After the frontend is deployed, also add `FRONTEND_ORIGIN` set to your Vercel URL (restricts CORS to your real frontend instead of `*`).

A `render.yaml` is included at the repo root for Render's "Infrastructure as Code" import option.

### Frontend (Vercel)

1. On Vercel: New Project → import this repo.
2. Root directory: `frontend`
3. Framework preset: Vite (auto-detected via `vercel.json`)
4. Add environment variable: `VITE_API_URL` set to your deployed Render backend URL (e.g. `https://vyrora-ai-backend.onrender.com`)
5. Deploy.

**Note on free-tier Render:** the backend will spin down after inactivity and take ~30-50 seconds to wake up on the first request after idling. This is a Render free-tier limitation, not a bug in this project.

## API Reference

| Endpoint | Method | Body | Returns |
|---|---|---|---|
| `/research` | POST | `{"question": "..."}` | `{"response": "..."}` |
| `/plan` | POST | `{"goal": "..."}` | `{"response": "..."}` |
| `/presentation` | POST | `{"topic": "..."}` | `{"slides": [{"title", "bullets"}]}` |
| `/document/upload` | POST | multipart file | `{"analysis": "...", "extracted_text": "..."}` |
| `/document/ask` | POST | `{"text": "...", "question": "..."}` | `{"response": "..."}` |
| `/route` | POST | `{"question": "..."}` | `{"agent": "agent_name"}` |
| `/health` | GET | — | `{"status": "ok"}` |

## License

MIT
