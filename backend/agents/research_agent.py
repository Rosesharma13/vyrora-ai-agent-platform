from services.groq_service import ask_llm

def research(topic):

    prompt = f"""
    Research the topic:

    {topic}

    Give:
    1. Overview
    2. Key Points
    3. Latest Trends
    4. Conclusion
    """

    return ask_llm(prompt)