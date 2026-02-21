"""
SDK Compatibility Patch
=======================

Monkey-patches the Claude Agent SDK's message parser to handle unknown message
types (e.g. rate_limit_event) gracefully instead of raising MessageParseError.

This is needed because the Claude CLI may emit new message types before the SDK
is updated to handle them. See: https://github.com/AutoForgeAI/autoforge/issues/210

Import this module early (before any SDK client usage) to apply the patch.
"""

import logging

logger = logging.getLogger(__name__)

_patched = False


def patch_sdk_message_parser() -> None:
    """Wrap the SDK's parse_message to handle unknown message types as SystemMessage."""
    global _patched
    if _patched:
        return

    try:
        from claude_agent_sdk._internal import message_parser
        from claude_agent_sdk._errors import MessageParseError
        from claude_agent_sdk.types import SystemMessage

        original_parse = message_parser.parse_message

        def patched_parse_message(data: dict) -> object:
            try:
                return original_parse(data)
            except MessageParseError as e:
                msg = str(e)
                if "Unknown message type" in msg:
                    message_type = data.get("type", "unknown")
                    logger.info("Handling unknown SDK message type as SystemMessage: %s", message_type)
                    return SystemMessage(
                        subtype=message_type,
                        data=data,
                    )
                raise

        message_parser.parse_message = patched_parse_message
        _patched = True
        logger.debug("SDK message parser patched for unknown message type compatibility")

    except Exception as e:
        logger.warning("Failed to patch SDK message parser: %s", e)


# Auto-apply on import
patch_sdk_message_parser()
