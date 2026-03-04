"""
Scaffold Router
================

SSE streaming endpoint for running project scaffold commands.
Supports templated project creation (e.g., Next.js agentic starter).
"""

import asyncio
import json
import logging
import shutil
import subprocess
import sys
from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .filesystem import is_path_blocked

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/scaffold", tags=["scaffold"])

# Hardcoded templates — no arbitrary commands allowed
TEMPLATES: dict[str, list[str]] = {
    "agentic-starter": ["npx", "create-agentic-app@latest", ".", "-y", "-p", "npm", "--skip-git"],
}


class ScaffoldRequest(BaseModel):
    template: str
    target_path: str


def _sse_event(data: dict) -> str:
    """Format a dict as an SSE data line."""
    return f"data: {json.dumps(data)}\n\n"


async def _stream_scaffold(template: str, target_path: str, request: Request):
    """Run the scaffold command and yield SSE events."""
    # Validate template
    if template not in TEMPLATES:
        yield _sse_event({"type": "error", "message": f"Unknown template: {template}"})
        return

    # Validate path
    path = Path(target_path)
    try:
        path = path.resolve()
    except (OSError, ValueError) as e:
        yield _sse_event({"type": "error", "message": f"Invalid path: {e}"})
        return

    if is_path_blocked(path):
        yield _sse_event({"type": "error", "message": "Access to this directory is not allowed"})
        return

    if not path.exists() or not path.is_dir():
        yield _sse_event({"type": "error", "message": "Target directory does not exist"})
        return

    # Check npx is available
    npx_name = "npx"
    if sys.platform == "win32":
        npx_name = "npx.cmd"

    if not shutil.which(npx_name):
        yield _sse_event({"type": "error", "message": "npx is not available. Please install Node.js."})
        return

    # Build command
    argv = list(TEMPLATES[template])
    if sys.platform == "win32" and not argv[0].lower().endswith(".cmd"):
        argv[0] = argv[0] + ".cmd"

    process = None
    try:
        popen_kwargs: dict = {
            "stdout": subprocess.PIPE,
            "stderr": subprocess.STDOUT,
            "stdin": subprocess.DEVNULL,
            "cwd": str(path),
        }
        if sys.platform == "win32":
            popen_kwargs["creationflags"] = subprocess.CREATE_NO_WINDOW

        process = subprocess.Popen(argv, **popen_kwargs)
        logger.info("Scaffold process started: pid=%s, template=%s, path=%s", process.pid, template, target_path)

        # Stream stdout lines
        assert process.stdout is not None
        for raw_line in iter(process.stdout.readline, b""):
            # Check if client disconnected
            if await request.is_disconnected():
                logger.info("Client disconnected during scaffold, terminating process")
                break

            line = raw_line.decode("utf-8", errors="replace").rstrip("\n\r")
            yield _sse_event({"type": "output", "line": line})
            # Yield control to event loop so disconnect checks work
            await asyncio.sleep(0)

        process.wait()
        exit_code = process.returncode
        success = exit_code == 0
        logger.info("Scaffold process completed: exit_code=%s, template=%s", exit_code, template)
        yield _sse_event({"type": "complete", "success": success, "exit_code": exit_code})

    except Exception as e:
        logger.error("Scaffold error: %s", e)
        yield _sse_event({"type": "error", "message": str(e)})

    finally:
        if process and process.poll() is None:
            try:
                process.terminate()
                process.wait(timeout=5)
            except Exception:
                process.kill()


@router.post("/run")
async def run_scaffold(body: ScaffoldRequest, request: Request):
    """Run a scaffold template command with SSE streaming output."""
    return StreamingResponse(
        _stream_scaffold(body.template, body.target_path, request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
