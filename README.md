
# Vyrora AI

[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)](https://vitejs.dev/)
[![LLM](https://img.shields.io/badge/LLM-Groq-orange)](https://groq.com/)
[![Deployed on Render](https://img.shields.io/badge/backend%20deploy-Render-46E3B7)](https://render.com/)
[![Deployed on Vercel](https://img.shields.io/badge/frontend%20deploy-Vercel-000000)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](#license)

A multi-agent AI platform with a FastAPI backend and a React frontend. A lightweight router directs each request to one of four specialized agents, all powered by Groq's LLM API.

**Live App:** _add Vercel frontend URL here_
**Backend API:** _add Render backend URL here_

---

## Overview

Vyrora AI demonstrates a practical, production-deployable multi-agent architecture without unnecessary complexity. Instead of a heavyweight orchestration framework, a simple keyword-based supervisor routes requests — appropriate for four independent agents with no shared state between them.

## Features

| Agent | Description |
|---|---|
| **Research Agent** | Takes a topic or question and returns a structured overview, key points, and relevant trends |
| **Document Agent** | Accepts a PDF or text file upload, extracts the content, returns a summary and key points, and answers follow-up questions about the document |
| **Planning Agent** | Takes a goal and returns a concrete, numbered action plan with a flagged risk or blocker |
| **Presentation Agent** | Takes a topic and returns a structured slide-by-slide outline (title + bullet points per slide) |

## Scope & Design Decisions

Documenting what was intentionally left out, and why:

- **No vector database / RAG pipeline.** Document Q&A passes extracted text directly into the prompt. This is sufficient for typical resume- or report-length documents and avoids the operational overhead of a vector store on free-tier infrastructure, where persistent storage isn't reliably available.
- **No LangGraph or multi-step agent orchestration.** With four independent agents and no shared state, a keyword-based router achieves the same routing outcome with significantly less complexity and fewer failure points.
- **No authentication or persistent storage.** Every request is stateless by design. This keeps the project lightweight and appropriate for its current scope as a demonstration platform.

## Tech Stack

**Backend**
- FastAPI
- Groq API (`openai/gpt-oss-120b`)
- pypdf (PDF text extraction)

**Frontend**
- React (Vite)
- Axios

**Deployment**
- Render (backend)
- Vercel (frontend)

## Project Structure
```
vyrora-ai-agent-platform/

├── backend/
│   ├── agents/
│   │   ├── research_agent.py
│   │   ├── document_agent.py
│   │   ├── task_agent.py                 # planning agent
│   │   ├── presentation_agent.py
│   │   └── supervisor.py                 # keyword-based router
│   ├── api/
│   │   └── routes.py                     # all API endpoints
│   ├── services/
│   │   └── groq_service.py               # LLM API wrapper
│   ├── main.py                           # FastAPI app entrypoint
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx                       # full UI, tabbed by agent
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── .env.example
├── render.yaml
└── README.md
```

## Getting Started Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- A free [Groq API key](https://console.groq.com/keys)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your real GROQ_API_KEY to .env
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`. Interactive API docs available at `/docs`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://127.0.0.1:8000 for local development
npm run dev
```

## Deployment

### Backend → Render

1. Push this repository to GitHub.
2. On Render: **New +** → **Web Service** → connect this repo.
3. **Language:** Python 3
4. **Root Directory:** `backend`
5. **Build Command:** `pip install -r requirements.txt`
6. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variable: `GROQ_API_KEY`
8. After the frontend is deployed, also add `FRONTEND_ORIGIN` set to the Vercel URL to restrict CORS.

A `render.yaml` is included at the repo root for Render's Infrastructure-as-Code import.

### Frontend → Vercel

1. On Vercel: **Add New** → **Project** → import this repo.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite (auto-detected via `vercel.json`)
4. Add environment variable: `VITE_API_URL` set to the deployed Render backend URL
5. Deploy.

> **Note:** Render's free tier spins the backend down after inactivity. The first request after idling can take 30–50 seconds to respond — this is a platform limitation, not an application bug.

## API Reference

| Endpoint | Method | Request Body | Response |
|---|---|---|---|
| `/research` | POST | `{"question": "..."}` | `{"response": "..."}` |
| `/plan` | POST | `{"goal": "..."}` | `{"response": "..."}` |
| `/presentation` | POST | `{"topic": "..."}` | `{"slides": [{"title", "bullets"}]}` |
| `/document/upload` | POST | multipart file | `{"analysis": "...", "extracted_text": "..."}` |
| `/document/ask` | POST | `{"text": "...", "question": "..."}` | `{"response": "..."}` |
| `/route` | POST | `{"question": "..."}` | `{"agent": "agent_name"}` |
| `/health` | GET | — | `{"status": "ok"}` |

## Roadmap

Potential future directions, not yet implemented:

- [ ] Persistent vector storage for document Q&A across larger files
- [ ] User authentication and saved session history
- [ ] Streaming responses for long-form agent output

## License

MIT

## Author

**Rose Sharma**
- [GitHub](https://github.com/Rosesharma13) 
- [LinkedIn](https://linkedin.com/in/rose-sharma13) 
- [Portfolio](https://rosesharma13.github.io)
