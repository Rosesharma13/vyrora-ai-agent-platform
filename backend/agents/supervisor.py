def route_task(task):
    """
    Lightweight keyword-based router that decides which agent should
    handle a given task description. This is intentionally simple —
    a full graph-based orchestrator (e.g. LangGraph) would be overkill
    for 4 agents with no shared state between them.
    """
    task = task.lower()

    if "plan" in task or "goal" in task or "roadmap" in task:
        return "task_agent"

    if "present" in task or "slide" in task or "deck" in task:
        return "presentation_agent"

    if "document" in task or "pdf" in task or "summarize" in task:
        return "document_agent"

    return "research_agent"
