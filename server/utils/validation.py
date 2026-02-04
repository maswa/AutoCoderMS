"""
Shared Validation Utilities
============================

Project name validation used across REST endpoints and WebSocket handlers.
Two variants are provided:

* ``is_valid_project_name`` -- returns ``bool``, suitable for WebSocket
  handlers where raising an HTTPException is not appropriate.
* ``validate_project_name`` -- raises ``HTTPException(400)`` on failure,
  suitable for REST endpoint handlers.
"""

import re

from fastapi import HTTPException

# Compiled once; reused by both variants.
_PROJECT_NAME_RE = re.compile(r'^[a-zA-Z0-9_-]{1,50}$')


def is_valid_project_name(name: str) -> bool:
    """Check whether *name* is a valid project name.

    Allows only ASCII letters, digits, hyphens, and underscores (1-50 chars).
    Returns ``True`` if valid, ``False`` otherwise.

    Use this in WebSocket handlers where you need to close the socket
    yourself rather than raise an HTTP error.
    """
    return bool(_PROJECT_NAME_RE.match(name))


def validate_project_name(name: str) -> str:
    """Validate and return *name*, or raise ``HTTPException(400)``.

    Suitable for REST endpoint handlers where FastAPI will convert the
    exception into an HTTP 400 response automatically.

    Args:
        name: Project name to validate.

    Returns:
        The validated project name (unchanged).

    Raises:
        HTTPException: If *name* is invalid.
    """
    if not _PROJECT_NAME_RE.match(name):
        raise HTTPException(
            status_code=400,
            detail="Invalid project name. Use only letters, numbers, hyphens, and underscores (1-50 chars)."
        )
    return name
