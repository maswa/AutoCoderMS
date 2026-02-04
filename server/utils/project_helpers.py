"""
Project Helper Utilities
========================

Shared project path lookup used across all server routers and websocket handlers.
Consolidates the previously duplicated _get_project_path() function.
"""

import sys
from pathlib import Path

# Ensure the project root is on sys.path so `registry` can be imported.
# This is necessary because `registry.py` lives at the repository root,
# outside the `server` package.
_root = Path(__file__).parent.parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from registry import get_project_path as _registry_get_project_path


def get_project_path(project_name: str) -> Path | None:
    """Look up a project's filesystem path from the global registry.

    Args:
        project_name: The registered name of the project.

    Returns:
        The resolved ``Path`` to the project directory, or ``None`` if the
        project is not found in the registry.
    """
    return _registry_get_project_path(project_name)
