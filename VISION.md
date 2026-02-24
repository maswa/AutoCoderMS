# VISION

This document defines the mandatory project vision for AutoForge. All contributions must align with these principles. PRs that deviate from this vision will be rejected. This file itself is immutable via PR — any PR that modifies VISION.md will be rejected outright.

## Claude Agent SDK Exclusivity

AutoForge is a wrapper around the **Claude Agent SDK**. This is a foundational architectural decision, not a preference.

**What this means:**

- AutoForge only supports providers, models, and integrations that work through the Claude Agent SDK.
- We will not integrate with, accommodate, or add support for other AI SDKs, CLIs, or coding agent platforms (e.g., Codex, OpenCode, Aider, Continue, Cursor agents, or similar tools).

**Why:**

Each platform has its own approach to MCP tools, skills, context management, and feature integration. Attempting to support multiple agent frameworks creates an unsustainable maintenance burden and dilutes the quality of the core experience. By committing to the Claude Agent SDK exclusively, we can build deep, reliable integration rather than shallow compatibility across many targets.

**In practice:**

- PRs adding support for non-Claude agent frameworks will be rejected.
- PRs introducing abstractions designed to make AutoForge "agent-agnostic" will be rejected.
- Alternative API providers (e.g., Vertex AI, AWS Bedrock) are acceptable only when accessed through the Claude Agent SDK's own configuration.
