from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from io import BytesIO
from pypdf import PdfReader

from agents.research_agent import research
from agents.document_agent import analyze_document, answer_question_on_document
from agents.task_agent import create_plan
from agents.presentation_agent import generate_ppt
from agents.supervisor import route_task

router = APIRouter()


class Query(BaseModel):
    question: str


class PlanRequest(BaseModel):
    goal: str


class PresentationRequest(BaseModel):
    topic: str


class DocumentQuestionRequest(BaseModel):
    text: str
    question: str


@router.post("/research")
def run_research(query: Query):
    result = research(query.question)
    return {"response": result}


@router.post("/plan")
def run_plan(req: PlanRequest):
    result = create_plan(req.goal)
    return {"response": result}


@router.post("/presentation")
def run_presentation(req: PresentationRequest):
    result = generate_ppt(req.topic)
    return {"slides": result}


@router.post("/document/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts a PDF or plain text file, extracts the text, and returns
    a structured analysis. The extracted text is also returned so the
    frontend can ask follow-up questions without re-uploading.
    """
    contents = await file.read()

    if file.filename.lower().endswith(".pdf"):
        reader = PdfReader(BytesIO(contents))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
    else:
        text = contents.decode("utf-8", errors="ignore")

    if not text.strip():
        return {"error": "Could not extract any text from this file."}

    analysis = analyze_document(text)
    return {"analysis": analysis, "extracted_text": text}


@router.post("/document/ask")
def ask_document(req: DocumentQuestionRequest):
    result = answer_question_on_document(req.text, req.question)
    return {"response": result}


@router.post("/route")
def run_router(query: Query):
    """
    Returns which agent the supervisor would pick for a given task
    description. Useful for debugging/demoing the routing logic.
    """
    agent_name = route_task(query.question)
    return {"agent": agent_name}
