"""
Chat Session Constants
======================

Shared constants for all chat session types (assistant, spec, expand).

The canonical ``API_ENV_VARS`` list lives in ``env_constants.py`` at the
project root and is re-exported here for convenience so that existing
imports (``from .chat_constants import API_ENV_VARS``) continue to work.
"""

import logging
import sys
from pathlib import Path
from typing import Any, AsyncGenerator

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
from rate_limit_utils import is_rate_limit_error, parse_retry_after  # noqa: E402, F401

logger = logging.getLogger(__name__)


def check_rate_limit_error(exc: Exception) -> tuple[bool, int | None]:
    """Inspect an exception and determine if it represents a rate-limit.

    Returns ``(is_rate_limit, retry_seconds)``.  ``retry_seconds`` is the
    parsed Retry-After value when available, otherwise ``None`` (caller
    should use exponential backoff).
    """
    # MessageParseError = unknown CLI message type (e.g. "rate_limit_event").
    # These are informational events, NOT actual rate limit errors.
    # The word "rate_limit" in the type name would false-positive the regex.
    if type(exc).__name__ == "MessageParseError":
        return False, None

    # For all other exceptions: match error text against known rate-limit patterns
    exc_str = str(exc)
    if is_rate_limit_error(exc_str):
        retry = parse_retry_after(exc_str)
        return True, retry

    return False, None


async def safe_receive_response(client: Any, log: logging.Logger) -> AsyncGenerator:
    """Wrap ``client.receive_response()`` to skip ``MessageParseError``.

    The Claude Code CLI may emit message types (e.g. ``rate_limit_event``)
    that the installed Python SDK does not recognise, causing
    ``MessageParseError`` which kills the async generator.  The CLI
    subprocess is still alive and the SDK uses a buffered memory channel,
    so we restart ``receive_response()`` to continue reading remaining
    messages without losing data.
    """
    max_retries = 50
    retries = 0
    while True:
        try:
            async for msg in client.receive_response():
                yield msg
            return  # Normal completion
        except Exception as exc:
            if type(exc).__name__ == "MessageParseError":
                retries += 1
                if retries > max_retries:
                    log.error(f"Too many unrecognized CLI messages ({retries}), stopping")
                    return
                log.warning(f"Ignoring unrecognized message from Claude CLI: {exc}")
                continue
            raise


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
