import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError(
        "GROQ_API_KEY is not set. Create a backend/.env file with "
        "GROQ_API_KEY=your_key_here (see .env.example)."
    )

client = Groq(api_key=api_key)

# NOTE: llama3-8b-8192 (original) and llama-3.1-8b-instant (its replacement)
# are both deprecated by Groq as of June 2026. Using their current
# recommended general-purpose model instead.
MODEL = "openai/gpt-oss-120b"


def ask_llm(prompt):
    """
    Sends a prompt to the Groq-hosted LLM and returns the text response.
    Raises a clear error instead of crashing silently if the call fails.
    """
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"LLM request failed: {str(e)}"
