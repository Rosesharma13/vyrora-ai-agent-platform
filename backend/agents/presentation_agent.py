import json
from services.groq_service import ask_llm


def generate_ppt(topic):
    """
    Generates a presentation outline tailored to the topic using the LLM.
    Returns a list of slide objects: {"title": ..., "bullets": [...]}.
    Falls back to a minimal structure if the model output can't be parsed.
    """
    prompt = f"""
Create a presentation outline for the topic: "{topic}".

Return ONLY valid JSON, no preamble, no markdown fences, in this exact format:
[
  {{"title": "Slide title", "bullets": ["point 1", "point 2", "point 3"]}},
  ...
]

Include 5 to 7 slides, ending with a conclusion slide.
"""

    raw = ask_llm(prompt)

    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]

    try:
        slides = json.loads(cleaned)
        return slides
    except json.JSONDecodeError:
        return [
            {"title": f"Introduction to {topic}", "bullets": [raw[:300]]}
        ]
