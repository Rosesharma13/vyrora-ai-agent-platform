from services.groq_service import ask_llm


def create_plan(goal):
    """
    Generates a concrete, numbered action plan for the given goal using the LLM,
    instead of a fixed generic template.
    """
    prompt = f"""
You are a planning assistant. Create a concrete, actionable plan to achieve
the following goal. Respond with:

1. A one-sentence summary of the approach
2. A numbered list of 5-8 specific steps (each step should be a real action,
   not a generic placeholder like "learn fundamentals")
3. One realistic risk or blocker to watch for

Goal: {goal}
"""

    return ask_llm(prompt)
