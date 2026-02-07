"""
Chat Session Constants
======================

Shared constants for all chat session types (assistant, spec, expand).

The canonical ``API_ENV_VARS`` list lives in ``env_constants.py`` at the
project root and is re-exported here for convenience so that existing
imports (``from .chat_constants import API_ENV_VARS``) continue to work.
"""

import sys
from pathlib import Path
from typing import AsyncGenerator

# -------------------------------------------------------------------
# Root directory of the autoforge project (repository root).
# Used throughout the server package whenever the repo root is needed.
# -------------------------------------------------------------------
ROOT_DIR = Path(__file__).parent.parent.parent

# Ensure the project root is on sys.path so we can import env_constants
# from the root-level module without requiring a package install.
_root_str = str(ROOT_DIR)
if _root_str not in sys.path:
    sys.path.insert(0, _root_str)

# -------------------------------------------------------------------
# Environment variables forwarded to Claude CLI subprocesses.
# Single source of truth lives in env_constants.py at the project root.
# Re-exported here so existing ``from .chat_constants import API_ENV_VARS``
# imports continue to work unchanged.
# -------------------------------------------------------------------
from env_constants import API_ENV_VARS  # noqa: E402, F401


async def make_multimodal_message(content_blocks: list[dict]) -> AsyncGenerator[dict, None]:
    """Yield a single multimodal user message in Claude Agent SDK format.

    The Claude Agent SDK's ``query()`` method accepts either a plain string
    or an ``AsyncIterable[dict]`` for custom message formats.  This helper
    wraps a list of content blocks (text and/or images) in the expected
    envelope.

    Args:
        content_blocks: List of content-block dicts, e.g.
            ``[{"type": "text", "text": "..."}, {"type": "image", ...}]``.

    Yields:
        A single dict representing the user message.
    """
    yield {
        "type": "user",
        "message": {"role": "user", "content": content_blocks},
        "parent_tool_use_id": None,
        "session_id": "default",
    }
