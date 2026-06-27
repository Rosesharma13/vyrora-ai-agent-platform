from services.groq_service import ask_llm


def analyze_document(text):
    """
    Analyzes raw document text and returns a structured summary,
    key points, and answers a question if one is provided.
    """
    truncated = text[:12000]  # keep prompt within safe token limits

    prompt = f"""
You are a document analysis assistant. Read the document below and respond
in this exact structure:

1. Summary (3-4 sentences)
2. Key Points (5 bullet points)
3. Notable Entities (names, dates, numbers worth flagging)

Document:
{truncated}
"""

    return ask_llm(prompt)


def answer_question_on_document(text, question):
    """
    Answers a specific question using only the provided document text.
    """
    truncated = text[:12000]

    prompt = f"""
Answer the question using ONLY the information in the document below.
If the answer is not in the document, say so clearly instead of guessing.

Document:
{truncated}

Question: {question}
"""

    return ask_llm(prompt)
