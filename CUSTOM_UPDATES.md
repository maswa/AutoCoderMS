# Custom Updates - AutoCoder

This document tracks all customizations made to AutoCoder that deviate from the upstream repository. Reference this file before any updates to preserve these changes.

---

## Table of Contents

1. [UI Theme Customization](#1-ui-theme-customization)
2. [Playwright Browser Configuration](#2-playwright-browser-configuration)
3. [Research Agent (AutoCoder Plus)](#3-research-agent-autocoder-plus)
4. [Update Checklist](#update-checklist)

---

## 1. UI Theme Customization

### Overview

The UI has been customized from the default **neobrutalism** style to a clean **Twitter/Supabase-style** design.

**Design Changes:**
- No shadows
- Thin borders (1px)
- Rounded corners (1.3rem base)
- Blue accent color (Twitter blue)
- Clean typography (Open Sans)

### Modified Files

#### `ui/src/styles/custom-theme.css`

**Purpose:** Main theme override file that replaces neo design with clean Twitter style.

**Key Changes:**
- All `--shadow-neo-*` variables set to `none`
- All status colors (`pending`, `progress`, `done`) use Twitter blue
- Rounded corners: `--radius-neo-lg: 1.3rem`
- Font: Open Sans
- Removed all transform effects on hover
- Dark mode with proper contrast

**CSS Variables (Light Mode):**
```css
--color-neo-accent: oklch(0.6723 0.1606 244.9955);  /* Twitter blue */
--color-neo-pending: oklch(0.6723 0.1606 244.9955);
--color-neo-progress: oklch(0.6723 0.1606 244.9955);
--color-neo-done: oklch(0.6723 0.1606 244.9955);
```

**CSS Variables (Dark Mode):**
```css
--color-neo-bg: oklch(0.08 0 0);
--color-neo-card: oklch(0.16 0.005 250);
--color-neo-border: oklch(0.30 0 0);
```

**How to preserve:** This file should NOT be overwritten. It loads after `globals.css` and overrides it.

---

#### `ui/src/components/KanbanColumn.tsx`

**Purpose:** Modified to support themeable kanban columns without inline styles.

**Changes:**

1. **colorMap changed from inline colors to CSS classes:**
```tsx
// BEFORE (original):
const colorMap = {
  pending: 'var(--color-neo-pending)',
  progress: 'var(--color-neo-progress)',
  done: 'var(--color-neo-done)',
}

// AFTER (customized):
const colorMap = {
  pending: 'kanban-header-pending',
  progress: 'kanban-header-progress',
  done: 'kanban-header-done',
}
```

2. **Column div uses CSS class instead of inline style:**
```tsx
// BEFORE:
<div className="neo-card overflow-hidden" style={{ borderColor: colorMap[color] }}>

// AFTER:
<div className={`neo-card overflow-hidden kanban-column ${colorMap[color]}`}>
```

3. **Header div simplified (removed duplicate color class):**
```tsx
// BEFORE:
<div className={`... ${colorMap[color]}`} style={{ backgroundColor: colorMap[color] }}>

// AFTER:
<div className="kanban-header px-4 py-3 border-b border-[var(--color-neo-border)]">
```

4. **Title text color:**
```tsx
// BEFORE:
text-[var(--color-neo-text-on-bright)]

// AFTER:
text-[var(--color-neo-text)]
```

---

## 2. Playwright Browser Configuration

### Overview

Changed default Playwright settings for better performance:
- **Default browser:** Firefox (lower CPU usage)
- **Default mode:** Headless (saves resources)

### Modified Files

#### `client.py`

**Changes:**

```python
# BEFORE:
DEFAULT_PLAYWRIGHT_HEADLESS = False

# AFTER:
DEFAULT_PLAYWRIGHT_HEADLESS = True
DEFAULT_PLAYWRIGHT_BROWSER = "firefox"
```

**New function added:**
```python
def get_playwright_browser() -> str:
    """
    Get the browser to use for Playwright.
    Options: chrome, firefox, webkit, msedge
    Firefox is recommended for lower CPU usage.
    """
    return os.getenv("PLAYWRIGHT_BROWSER", DEFAULT_PLAYWRIGHT_BROWSER).lower()
```

**Playwright args updated:**
```python
playwright_args = [
    "@playwright/mcp@latest",
    "--viewport-size", "1280x720",
    "--browser", browser,  # NEW: configurable browser
]
```

---

#### `.env.example`

**Updated documentation:**
```bash
# PLAYWRIGHT_BROWSER: Which browser to use for testing
# - firefox: Lower CPU usage, recommended (default)
# - chrome: Google Chrome
# - webkit: Safari engine
# - msedge: Microsoft Edge
# PLAYWRIGHT_BROWSER=firefox

# PLAYWRIGHT_HEADLESS: Run browser without visible window
# - true: Browser runs in background, saves CPU (default)
# - false: Browser opens a visible window (useful for debugging)
# PLAYWRIGHT_HEADLESS=true
```

---

## 3. Research Agent (AutoCoder Plus)

### Overview

Added a new **Research Agent** that analyzes existing codebases and generates documentation. This enables AutoCoder to work with existing projects, not just create new ones from scratch.

**Workflow:**
```
1. /gsd:map-codebase        → Analyzes existing codebase
2. Output: .planning/codebase/*.md  (STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, INTEGRATIONS)
3. /gsd-to-autocoder-spec   → Converts to app_spec.txt
4. AutoCoder                → Continues development on existing code
```

### New Files Created

#### MCP Server & Database

| File | Purpose |
|------|---------|
| `mcp_server/research_mcp.py` | MCP server with 6 research tools |
| `api/research_database.py` | SQLAlchemy models for research state |
| `api/stack_detector.py` | Technology stack detection (70+ frameworks) |
| `api/pattern_analyzer.py` | Architecture pattern analysis |
| `api/convention_extractor.py` | Code convention extraction |

#### Commands & Skills

| File | Purpose |
|------|---------|
| `.claude/commands/gsd-map-codebase.md` | Slash command for research |
| `.claude/skills/gsd-map-codebase/SKILL.md` | Skill definition |
| `.claude/templates/research_prompt.template.md` | Research agent prompt |

### Modified Files

#### `client.py`

**Added research MCP server configuration:**
```python
RESEARCH_MCP_TOOLS = [
    "mcp__research__research_scan_files",
    "mcp__research__research_detect_stack",
    "mcp__research__research_add_finding",
    "mcp__research__research_get_context",
    "mcp__research__research_finalize",
    "mcp__research__research_get_stats",
]

# In create_client():
if agent_type == "research":
    mcp_servers = {
        "research": {
            "command": sys.executable,
            "args": ["-m", "mcp_server.research_mcp"],
            "env": {"PROJECT_DIR": str(project_dir.resolve())},
        },
    }
```

#### `agent.py`

**Added research agent type handling:**
```python
elif agent_type == "research":
    print("Running as RESEARCH agent (codebase analysis)")
    prompt = get_research_prompt(project_dir)
```

**Fixed:** Added `agent_type=agent_type` to `create_client()` call.

#### `prompts.py`

**Added research prompt loading:**
```python
def get_research_prompt(project_dir: Path | None = None) -> str:
    return load_prompt("research_prompt", project_dir)
```

#### `autonomous_agent_demo.py`

**Added "research" to CLI arguments:**
```python
choices=["initializer", "coding", "testing", "research"]
```

#### Server Files

| File | Changes |
|------|---------|
| `server/routers/agent.py` | Added `/start-research`, `/research/status`, `/research/stop` endpoints |
| `server/services/process_manager.py` | Added `ResearchAgentProcessManager` class and `start_research()` method |
| `server/websocket.py` | Added `ResearchTracker` class for real-time progress updates |
| `server/schemas.py` | Added `ResearchStatus`, `WSResearchUpdateMessage` schemas |

### Research MCP Tools

| Tool | Purpose |
|------|---------|
| `research_scan_files(pattern, limit)` | Scan files matching glob pattern |
| `research_detect_stack()` | Auto-detect technology stack from manifests |
| `research_add_finding(document, section, content, source_files)` | Add finding to document |
| `research_get_context(document)` | Get current document state |
| `research_finalize()` | Write final markdown files |
| `research_get_stats()` | Get progress statistics |

### Output Structure

```
{project}/.planning/
├── research.db              # SQLite database (temporary)
└── codebase/
    ├── STACK.md             # Languages, frameworks, dependencies
    ├── ARCHITECTURE.md      # Patterns, layers, data flow
    ├── STRUCTURE.md         # Directory layout
    ├── CONVENTIONS.md       # Code style, naming
    └── INTEGRATIONS.md      # APIs, databases, services
```

### Usage

**CLI:**
```bash
python autonomous_agent_demo.py --project-dir /path/to/project --agent-type research
```

**Claude Code:**
```
/gsd:map-codebase
```

**After research completes:**
```
/gsd-to-autocoder-spec
```

### Branch

All changes are on branch: `feature/research-agent`

---

## 4. Update Checklist

When updating AutoCoder from upstream, verify these items:

### UI Changes
- [ ] `ui/src/styles/custom-theme.css` is preserved
- [ ] `ui/src/components/KanbanColumn.tsx` changes are preserved
- [ ] Run `npm run build` in `ui/` directory
- [ ] Test both light and dark modes

### Backend Changes
- [ ] `client.py` - Playwright browser/headless defaults preserved
- [ ] `client.py` - Research MCP server configuration preserved
- [ ] `agent.py` - Research agent type handling preserved
- [ ] `prompts.py` - Research prompt loading preserved
- [ ] `.env.example` - Documentation updates preserved

### Research Agent Files (new)
- [ ] `mcp_server/research_mcp.py` - Research MCP server
- [ ] `api/research_database.py` - Research SQLAlchemy models
- [ ] `api/stack_detector.py` - Stack detection utility
- [ ] `api/pattern_analyzer.py` - Pattern analysis utility
- [ ] `api/convention_extractor.py` - Convention extraction utility
- [ ] `.claude/templates/research_prompt.template.md` - Research prompt
- [ ] `.claude/commands/gsd-map-codebase.md` - Slash command
- [ ] `.claude/skills/gsd-map-codebase/SKILL.md` - Skill definition
- [ ] `server/routers/agent.py` - Research endpoints
- [ ] `server/services/process_manager.py` - Research process manager
- [ ] `server/websocket.py` - Research progress tracking
- [ ] `server/schemas.py` - Research schemas

### General
- [ ] Verify Playwright uses Firefox by default
- [ ] Check that browser runs headless by default
- [ ] Test research agent: `python autonomous_agent_demo.py --project-dir test --agent-type research`

---

## Reverting to Defaults

### UI Only
```bash
rm ui/src/styles/custom-theme.css
git checkout ui/src/components/KanbanColumn.tsx
cd ui && npm run build
```

### Backend Only
```bash
git checkout client.py .env.example
```

---

## Files Summary

| File | Type | Change Description |
|------|------|-------------------|
| `ui/src/styles/custom-theme.css` | UI | Twitter-style theme |
| `ui/src/components/KanbanColumn.tsx` | UI | Themeable kanban columns |
| `ui/src/main.tsx` | UI | Imports custom theme |
| `client.py` | Backend | Firefox + headless defaults, research MCP server |
| `agent.py` | Backend | Research agent type handling |
| `prompts.py` | Backend | Research prompt loading |
| `autonomous_agent_demo.py` | Backend | Research CLI argument |
| `mcp_server/research_mcp.py` | MCP | Research MCP server (6 tools) |
| `api/research_database.py` | API | Research SQLAlchemy models |
| `api/stack_detector.py` | API | Technology stack detection |
| `api/pattern_analyzer.py` | API | Architecture pattern analysis |
| `api/convention_extractor.py` | API | Code convention extraction |
| `server/routers/agent.py` | Server | Research REST endpoints |
| `server/services/process_manager.py` | Server | Research process manager |
| `server/websocket.py` | Server | Research WebSocket tracking |
| `server/schemas.py` | Server | Research Pydantic schemas |
| `.claude/templates/research_prompt.template.md` | Prompt | Research agent prompt |
| `.claude/commands/gsd-map-codebase.md` | Command | /gsd:map-codebase |
| `.claude/skills/gsd-map-codebase/SKILL.md` | Skill | Research skill definition |
| `.env.example` | Config | Updated documentation |

---

## Last Updated

**Date:** January 2026
**Features:**
- Research Agent (AutoCoder Plus) - Analyze existing codebases
- Twitter-style UI theme with custom theme override system
- Firefox + headless Playwright defaults

**Branch:** `feature/research-agent`
