"""
Agent Router
============

API endpoints for agent control (start/stop/pause/resume).
Uses project registry for path lookups.
"""

import re
from pathlib import Path

from fastapi import APIRouter, HTTPException

from ..schemas import (
    AgentActionResponse,
    AgentStartRequest,
    AgentStatus,
    ResearchActionResponse,
    ResearchStartRequest,
    ResearchStatus,
)
from ..services.process_manager import get_manager, get_research_manager


def _get_project_path(project_name: str) -> Path | None:
    """Get project path from registry."""
    import sys
    root = Path(__file__).parent.parent.parent
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))

    from registry import get_project_path
    return get_project_path(project_name)


def _get_settings_defaults() -> tuple[bool, str, int]:
    """Get defaults from global settings.

    Returns:
        Tuple of (yolo_mode, model, testing_agent_ratio)
    """
    import sys
    root = Path(__file__).parent.parent.parent
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))

    from registry import DEFAULT_MODEL, get_all_settings

    settings = get_all_settings()
    yolo_mode = (settings.get("yolo_mode") or "false").lower() == "true"
    model = settings.get("model", DEFAULT_MODEL)

    # Parse testing agent settings with defaults
    try:
        testing_agent_ratio = int(settings.get("testing_agent_ratio", "1"))
    except (ValueError, TypeError):
        testing_agent_ratio = 1

    return yolo_mode, model, testing_agent_ratio


router = APIRouter(prefix="/api/projects/{project_name}/agent", tags=["agent"])

# Root directory for process manager
ROOT_DIR = Path(__file__).parent.parent.parent


def validate_project_name(name: str) -> str:
    """Validate and sanitize project name to prevent path traversal."""
    if not re.match(r'^[a-zA-Z0-9_-]{1,50}$', name):
        raise HTTPException(
            status_code=400,
            detail="Invalid project name"
        )
    return name


def get_project_manager(project_name: str):
    """Get the process manager for a project."""
    project_name = validate_project_name(project_name)
    project_dir = _get_project_path(project_name)

    if not project_dir:
        raise HTTPException(status_code=404, detail=f"Project '{project_name}' not found in registry")

    if not project_dir.exists():
        raise HTTPException(status_code=404, detail=f"Project directory not found: {project_dir}")

    return get_manager(project_name, project_dir, ROOT_DIR)


@router.get("/status", response_model=AgentStatus)
async def get_agent_status(project_name: str):
    """Get the current status of the agent for a project."""
    manager = get_project_manager(project_name)

    # Run healthcheck to detect crashed processes
    await manager.healthcheck()

    return AgentStatus(
        status=manager.status,
        pid=manager.pid,
        started_at=manager.started_at.isoformat() if manager.started_at else None,
        yolo_mode=manager.yolo_mode,
        model=manager.model,
        parallel_mode=manager.parallel_mode,
        max_concurrency=manager.max_concurrency,
        testing_agent_ratio=manager.testing_agent_ratio,
    )


@router.post("/start", response_model=AgentActionResponse)
async def start_agent(
    project_name: str,
    request: AgentStartRequest = AgentStartRequest(),
):
    """Start the agent for a project."""
    manager = get_project_manager(project_name)

    # Get defaults from global settings if not provided in request
    default_yolo, default_model, default_testing_ratio = _get_settings_defaults()

    yolo_mode = request.yolo_mode if request.yolo_mode is not None else default_yolo
    model = request.model if request.model else default_model
    max_concurrency = request.max_concurrency or 1
    testing_agent_ratio = request.testing_agent_ratio if request.testing_agent_ratio is not None else default_testing_ratio

    success, message = await manager.start(
        yolo_mode=yolo_mode,
        model=model,
        max_concurrency=max_concurrency,
        testing_agent_ratio=testing_agent_ratio,
    )

    # Notify scheduler of manual start (to prevent auto-stop during scheduled window)
    if success:
        from ..services.scheduler_service import get_scheduler
        project_dir = _get_project_path(project_name)
        if project_dir:
            get_scheduler().notify_manual_start(project_name, project_dir)

    return AgentActionResponse(
        success=success,
        status=manager.status,
        message=message,
    )


@router.post("/stop", response_model=AgentActionResponse)
async def stop_agent(project_name: str):
    """Stop the agent for a project."""
    manager = get_project_manager(project_name)

    success, message = await manager.stop()

    # Notify scheduler of manual stop (to prevent auto-start during scheduled window)
    if success:
        from ..services.scheduler_service import get_scheduler
        project_dir = _get_project_path(project_name)
        if project_dir:
            get_scheduler().notify_manual_stop(project_name, project_dir)

    return AgentActionResponse(
        success=success,
        status=manager.status,
        message=message,
    )


@router.post("/pause", response_model=AgentActionResponse)
async def pause_agent(project_name: str):
    """Pause the agent for a project."""
    manager = get_project_manager(project_name)

    success, message = await manager.pause()

    return AgentActionResponse(
        success=success,
        status=manager.status,
        message=message,
    )


@router.post("/resume", response_model=AgentActionResponse)
async def resume_agent(project_name: str):
    """Resume a paused agent."""
    manager = get_project_manager(project_name)

    success, message = await manager.resume()

    return AgentActionResponse(
        success=success,
        status=manager.status,
        message=message,
    )


# ============================================================================
# Research Agent Endpoints
# ============================================================================


def get_research_project_manager(project_name: str):
    """Get the research process manager for a project."""
    project_name = validate_project_name(project_name)
    project_dir = _get_project_path(project_name)

    if not project_dir:
        raise HTTPException(status_code=404, detail=f"Project '{project_name}' not found in registry")

    if not project_dir.exists():
        raise HTTPException(status_code=404, detail=f"Project directory not found: {project_dir}")

    return get_research_manager(project_name, project_dir, ROOT_DIR)


def _get_research_progress(project_dir: Path) -> dict:
    """Get research progress from the database.

    Returns:
        Dictionary with phase, files_scanned, findings_count, finalized, finalized_at
    """
    import sys
    root = Path(__file__).parent.parent.parent
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))

    from api.research_database import (
        ResearchProgress,
        get_research_database_path,
        get_research_session,
    )

    db_path = get_research_database_path(project_dir)
    if not db_path.exists():
        return {
            "phase": None,
            "files_scanned": 0,
            "findings_count": 0,
            "finalized": False,
            "finalized_at": None,
        }

    try:
        session = get_research_session(db_path)
        try:
            progress = session.query(ResearchProgress).first()
            if progress:
                return {
                    "phase": progress.phase,
                    "files_scanned": progress.files_scanned,
                    "findings_count": progress.findings_count,
                    "finalized": progress.is_complete(),
                    "finalized_at": progress.completed_at,
                }
            return {
                "phase": None,
                "files_scanned": 0,
                "findings_count": 0,
                "finalized": False,
                "finalized_at": None,
            }
        finally:
            session.close()
    except Exception:
        return {
            "phase": None,
            "files_scanned": 0,
            "findings_count": 0,
            "finalized": False,
            "finalized_at": None,
        }


@router.get("/research/status", response_model=ResearchStatus)
async def get_research_status(project_name: str):
    """Get the current status of the research agent for a project."""
    manager = get_research_project_manager(project_name)
    project_dir = _get_project_path(project_name)

    # Run healthcheck to detect crashed processes
    await manager.healthcheck()

    # Get research progress from database
    progress = _get_research_progress(project_dir)

    return ResearchStatus(
        status=manager.status,
        pid=manager.pid,
        started_at=manager.started_at.isoformat() if manager.started_at else None,
        model=manager.model,
        phase=progress["phase"],
        files_scanned=progress["files_scanned"],
        findings_count=progress["findings_count"],
        finalized=progress["finalized"],
        finalized_at=progress["finalized_at"],
    )


@router.post("/start-research", response_model=ResearchActionResponse)
async def start_research_agent(
    project_name: str,
    request: ResearchStartRequest = ResearchStartRequest(),
):
    """Start the research agent for a project.

    The research agent analyzes the codebase structure and documents findings
    in the .planning/codebase/ directory. This is typically run before adding
    new features to an existing codebase.
    """
    manager = get_research_project_manager(project_name)

    # Get default model from global settings if not provided
    _, default_model, _ = _get_settings_defaults()
    model = request.model if request.model else default_model

    success, message = await manager.start(model=model)

    return ResearchActionResponse(
        success=success,
        status=manager.status,
        message=message,
    )


@router.post("/research/stop", response_model=ResearchActionResponse)
async def stop_research_agent(project_name: str):
    """Stop the research agent for a project."""
    manager = get_research_project_manager(project_name)

    success, message = await manager.stop()

    return ResearchActionResponse(
        success=success,
        status=manager.status,
        message=message,
    )
