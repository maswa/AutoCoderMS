"""
Shared Environment Variable Constants
======================================

Single source of truth for environment variables forwarded to Claude CLI
subprocesses.  Imported by both ``client.py`` (agent sessions) and
``server/services/chat_constants.py`` (chat sessions) to avoid maintaining
duplicate lists.

These allow autoforge to use alternative API endpoints (Ollama, GLM,
Vertex AI) without affecting the user's global Claude Code settings.
"""

API_ENV_VARS: list[str] = [
    # Core API configuration
    "ANTHROPIC_BASE_URL",              # Custom API endpoint (e.g., https://api.z.ai/api/anthropic)
    "ANTHROPIC_AUTH_TOKEN",            # API authentication token
    "ANTHROPIC_API_KEY",               # API key (used by Kimi and other providers)
    "API_TIMEOUT_MS",                  # Request timeout in milliseconds
    # Model tier overrides
    "ANTHROPIC_DEFAULT_SONNET_MODEL",  # Model override for Sonnet
    "ANTHROPIC_DEFAULT_OPUS_MODEL",    # Model override for Opus
    "ANTHROPIC_DEFAULT_HAIKU_MODEL",   # Model override for Haiku
    # Vertex AI configuration
    "CLAUDE_CODE_USE_VERTEX",          # Enable Vertex AI mode (set to "1")
    "CLOUD_ML_REGION",                 # GCP region (e.g., us-east5)
    "ANTHROPIC_VERTEX_PROJECT_ID",     # GCP project ID
]
