# UI Integration Plan: Research Agent

> Design document for integrating codebase analysis functionality into the AutoCoder UI.

*Author: Claude (UX/UI Architect)*
*Date: 2026-01-28*
*Version: 1.0*

---

## Executive Summary

This document outlines the integration of the Research Agent functionality into the existing AutoCoder UI. The Research Agent allows users to analyze existing codebases before using AutoCoder to extend them with new features.

**Key Design Decisions:**

1. **Entry Point**: Add "Analyze Existing Codebase" option alongside "Create New App" in the ProjectSelector
2. **Flow Pattern**: Mirror the existing spec creation flow with a distinct "research" mode
3. **Progress Display**: Reuse the existing WebSocket infrastructure and AgentMissionControl patterns
4. **Output Presentation**: New MarkdownViewer component for displaying generated documentation
5. **Conversion Step**: Clear call-to-action to convert research output to app_spec.txt

**Estimated Implementation Effort**: 3-4 days for a senior frontend developer

---

## 1. Current State Analysis

### 1.1 Existing Application Architecture

```
App.tsx (Router)
├── ProjectSelector (landing page)
│   ├── NewProjectModal (create new project)
│   └── FolderBrowser (select folder)
├── ProjectDashboard (main workspace)
│   ├── SpecCreationChat (create app spec via chat)
│   ├── KanbanBoard (feature tracking)
│   ├── AgentMissionControl (agent progress)
│   ├── DependencyGraph (feature dependencies)
│   └── TerminalViewer (logs/output)
```

### 1.2 Current User Flow

```
[Landing] → [Select/Create Project] → [Create Spec via Chat] → [Run Agents] → [Monitor Progress]
```

### 1.3 Relevant Existing Components

| Component | Purpose | Reusability for Research |
|-----------|---------|-------------------------|
| `FolderBrowser` | Navigate filesystem | HIGH - can select existing codebase |
| `NewProjectModal` | Create project entry | MEDIUM - adapt for "Analyze Codebase" |
| `AgentMissionControl` | Show agent states | HIGH - reuse for research agent |
| `TerminalViewer` | Display logs | HIGH - show research agent output |
| `useProjectWebSocket` | Real-time updates | HIGH - already has ResearchTracker |

### 1.4 Backend API Availability

The following endpoints are already implemented:

```typescript
// Start research agent
POST /api/agent/start-research
Body: { project_name: string, project_dir: string }
Response: { success: boolean, message: string }

// Check research status
GET /api/agent/research/status?project_name=xxx
Response: { status: string, phase: string, files_scanned: number, findings_count: number }

// Stop research agent
DELETE /api/agent/research/stop?project_name=xxx
Response: { success: boolean }
```

WebSocket messages (already implemented in `ResearchTracker`):
- `research_update`: Real-time progress updates
- Phases: `idle` → `scanning` → `analyzing` → `documenting` → `complete`

---

## 2. Proposed User Flow

### 2.1 High-Level Flow

```
[Landing Page]
    │
    ├── "Create New App" (existing flow)
    │
    └── "Analyze Existing Codebase" (NEW)
            │
            ▼
        [FolderBrowser]
        Select project folder
            │
            ▼
        [Research Progress View]
        Show scanning/analyzing/documenting phases
            │
            ▼
        [Research Results View]
        Display generated documentation:
        - STACK.md
        - ARCHITECTURE.md
        - STRUCTURE.md
        - CONVENTIONS.md
        - INTEGRATIONS.md
            │
            ▼
        [Call to Action]
        "Convert to AutoCoder Spec" button
            │
            ▼
        [Spec Creation Chat] (prepopulated with research context)
```

### 2.2 Detailed User Journey

#### Step 1: Landing Page Enhancement

**Current State**: ProjectSelector shows list of projects + "Create New App" button

**Proposed Change**: Add second action button "Analyze Existing Codebase"

```
┌─────────────────────────────────────────────────────────────┐
│                        AutoCoder                             │
│                                                              │
│    ┌─────────────────┐     ┌─────────────────────────┐      │
│    │  Create New App │     │  Analyze Existing       │      │
│    │                 │     │  Codebase               │      │
│    │  Start from     │     │                         │      │
│    │  scratch with   │     │  Import an existing     │      │
│    │  a spec         │     │  project to extend      │      │
│    └─────────────────┘     └─────────────────────────┘      │
│                                                              │
│    Recent Projects:                                          │
│    ┌────────────────────────────────────────────────┐       │
│    │  my-app          Last opened: 2h ago    →      │       │
│    │  dashboard       Last opened: 1d ago    →      │       │
│    └────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Folder Selection Modal

**Component**: Enhanced `NewProjectModal` or new `AnalyzeCodebaseModal`

```
┌───────────────────────────────────────────────────────────────┐
│  Analyze Existing Codebase                              [X]   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Select the root folder of the codebase you want to analyze: │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  📁 /Users/dev/projects                          [↑]    │ │
│  │  ├── 📁 my-react-app                                    │ │
│  │  ├── 📁 backend-api                                     │ │
│  │  └── 📁 mobile-app                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Selected: /Users/dev/projects/my-react-app                  │
│                                                               │
│  Project Name: my-react-app                                  │
│  (This will be used to identify the project in AutoCoder)    │
│                                                               │
│              [Cancel]              [Start Analysis]          │
└───────────────────────────────────────────────────────────────┘
```

#### Step 3: Research Progress View

**Component**: New `ResearchProgressView` (similar to AgentMissionControl)

```
┌───────────────────────────────────────────────────────────────┐
│  Analyzing: my-react-app                                      │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│     ┌──────────────────────────────────────────────────┐     │
│     │                                                   │     │
│     │      🔬                                          │     │
│     │    Research                                       │     │
│     │     Agent                                         │     │
│     │                                                   │     │
│     │   Phase: Analyzing code patterns                  │     │
│     │                                                   │     │
│     └──────────────────────────────────────────────────┘     │
│                                                               │
│     Progress:                                                 │
│     ━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░  75%                   │
│                                                               │
│     📁 Files scanned: 247                                    │
│     📝 Findings recorded: 42                                  │
│     📄 Current: Detecting technology stack...                 │
│                                                               │
│     ┌─────────────────────────────────────────────────────┐  │
│     │ [Terminal output / logs]                            │  │
│     │ > Scanning src/components/...                       │  │
│     │ > Found React 18 with TypeScript                    │  │
│     │ > Analyzing component patterns...                   │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                               │
│                      [Stop Analysis]                          │
└───────────────────────────────────────────────────────────────┘
```

#### Step 4: Research Results View

**Component**: New `ResearchResultsView`

```
┌───────────────────────────────────────────────────────────────┐
│  Analysis Complete: my-react-app                        [X]   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  📊 Summary                                            │   │
│  │  • 247 files analyzed                                  │   │
│  │  • React 18 + TypeScript + Tailwind CSS               │   │
│  │  • REST API backend with Express                       │   │
│  │  • 5 documentation files generated                     │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  Generated Documentation:                                     │
│                                                               │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐        │
│  │ STACK   │ ARCH    │ STRUCT  │ CONVENT │ INTEGR  │        │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ # Technology Stack                                      │ │
│  │                                                          │ │
│  │ ## Frontend                                              │ │
│  │ - React 18.2 with TypeScript 5.0                        │ │
│  │ - Tailwind CSS v3.4 for styling                         │ │
│  │ - Vite as build tool                                    │ │
│  │ ...                                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Ready to extend this codebase with AutoCoder?          │ │
│  │                                                          │ │
│  │  [View All Docs]     [Convert to AutoCoder Spec →]      │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

#### Step 5: Convert to Spec (Integration Point)

When user clicks "Convert to AutoCoder Spec":
1. Navigate to SpecCreationChat
2. Pre-populate with research context
3. Agent reads `.planning/codebase/*.md` files
4. User confirms/adjusts via conversation
5. Generate `app_spec.txt` with existing codebase context

---

## 3. Component Architecture

### 3.1 New Components

```
ui/src/components/
├── research/
│   ├── AnalyzeCodebaseModal.tsx    # Folder selection + project naming
│   ├── ResearchProgressView.tsx    # Real-time progress during analysis
│   ├── ResearchResultsView.tsx     # Display generated documentation
│   ├── ResearchDocTabs.tsx         # Tab navigation for doc files
│   └── MarkdownViewer.tsx          # Render markdown with syntax highlighting
```

### 3.2 Component Details

#### AnalyzeCodebaseModal

```typescript
interface AnalyzeCodebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAnalysis: (projectName: string, projectDir: string) => void;
}

// Features:
// - Integrates existing FolderBrowser component
// - Project name input (auto-derived from folder name)
// - Validates folder exists and is a code project
// - Shows estimated time based on folder size (optional)
```

#### ResearchProgressView

```typescript
interface ResearchProgressViewProps {
  projectName: string;
}

// Features:
// - Connects to existing WebSocket for research_update messages
// - Shows animated research agent mascot (reuse existing patterns)
// - Displays phase, files_scanned, findings_count from WebSocket
// - Progress bar based on phase (25% scanning, 50% analyzing, 75% documenting, 100% complete)
// - Terminal-style log output (reuse TerminalViewer)
// - Stop button calls DELETE /api/agent/research/stop
```

#### ResearchResultsView

```typescript
interface ResearchResultsViewProps {
  projectName: string;
  projectDir: string;
  onConvertToSpec: () => void;
}

// Features:
// - Fetches docs from .planning/codebase/*.md
// - Tab navigation between documents
// - Markdown rendering with syntax highlighting
// - Copy-to-clipboard for code blocks
// - "Convert to AutoCoder Spec" CTA button
```

### 3.3 Modified Existing Components

#### ProjectSelector.tsx

```typescript
// Add new button alongside "Create New App"
<div className="flex gap-4">
  <Button onClick={() => setShowNewProjectModal(true)}>
    Create New App
  </Button>
  <Button
    variant="secondary"
    onClick={() => setShowAnalyzeModal(true)}
  >
    Analyze Existing Codebase
  </Button>
</div>
```

#### App.tsx (Routing)

```typescript
// Add research-related routes
<Route path="/research/:projectName" element={<ResearchProgressView />} />
<Route path="/research/:projectName/results" element={<ResearchResultsView />} />
```

### 3.4 State Management

```typescript
// New types in lib/types.ts
interface ResearchProject {
  name: string;
  dir: string;
  status: 'analyzing' | 'complete' | 'error';
  phase: 'idle' | 'scanning' | 'analyzing' | 'documenting' | 'complete';
  filesScanned: number;
  findingsCount: number;
  completedAt?: string;
}

// WebSocket hook extension (already mostly implemented)
// useProjectWebSocket already handles research_update messages
// Just need to expose them in the return value
```

---

## 4. Implementation Phases

### Phase 1: Foundation (Day 1)

**Goal**: Basic flow working end-to-end

Tasks:
1. [ ] Create `AnalyzeCodebaseModal` component
   - Integrate `FolderBrowser`
   - Add project name input
   - Implement "Start Analysis" that calls API

2. [ ] Update `ProjectSelector`
   - Add "Analyze Existing Codebase" button
   - Wire up modal open/close

3. [ ] Add route `/research/:projectName`
   - Create placeholder `ResearchProgressView`

### Phase 2: Progress Display (Day 2)

**Goal**: Real-time progress visualization

Tasks:
1. [ ] Implement `ResearchProgressView`
   - Connect to WebSocket (already has ResearchTracker)
   - Display phase, files_scanned, findings_count
   - Animated progress indicator
   - Stop button functionality

2. [ ] Add research agent mascot
   - Reuse existing mascot pattern from AgentMissionControl
   - New mascot emoji for research agent (suggestion: 🔬 or 🔍)
   - Phase-based animations

3. [ ] Integrate `TerminalViewer` for log output

### Phase 3: Results Display (Day 3)

**Goal**: Present research output beautifully

Tasks:
1. [ ] Create `MarkdownViewer` component
   - Use `react-markdown` with syntax highlighting
   - Code block copy functionality
   - Responsive design

2. [ ] Implement `ResearchResultsView`
   - Fetch markdown files from server
   - Tab navigation between docs
   - Summary statistics

3. [ ] Add API endpoint to read `.planning/codebase/*.md` files
   ```typescript
   GET /api/projects/:name/research-docs
   Response: { docs: { filename: string, content: string }[] }
   ```

### Phase 4: Integration & Polish (Day 4)

**Goal**: Seamless conversion to spec and UX polish

Tasks:
1. [ ] Implement "Convert to AutoCoder Spec" flow
   - Navigate to SpecCreationChat
   - Pre-load research context
   - Trigger `/gsd-to-autocoder-spec` skill

2. [ ] Error handling
   - Research failed state
   - Empty codebase handling
   - Network error recovery

3. [ ] UX polish
   - Loading states
   - Transitions/animations
   - Responsive design verification
   - Keyboard navigation

4. [ ] Documentation
   - Update user guide
   - Add tooltips/help text

---

## 5. UX Considerations

### 5.1 Accessibility

- All interactive elements have keyboard focus states
- ARIA labels for progress indicators
- Screen reader announcements for phase changes
- Color contrast meets WCAG AA standards
- Focus trap in modals

### 5.2 Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty folder selected | Show error with guidance |
| Very large codebase (>10k files) | Show warning, allow proceed |
| Research agent crashes | Show error, offer retry |
| User navigates away during analysis | Continue in background, show notification |
| Network disconnect | Auto-reconnect WebSocket (already implemented) |
| Duplicate project name | Append number or show conflict resolution |

### 5.3 Error States

```
┌─────────────────────────────────────────────────────────┐
│  Analysis Failed                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│       ⚠️                                                │
│                                                          │
│  The research agent encountered an error:                │
│                                                          │
│  "Unable to access directory: Permission denied"         │
│                                                          │
│  [View Logs]     [Try Again]     [Cancel]               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5.4 Empty States

```
┌─────────────────────────────────────────────────────────┐
│  No Documentation Generated                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│       📭                                                │
│                                                          │
│  The selected folder doesn't appear to contain           │
│  recognizable source code.                               │
│                                                          │
│  Make sure you selected a folder containing:             │
│  • package.json, requirements.txt, or similar            │
│  • Source code files (.js, .ts, .py, etc.)              │
│                                                          │
│  [Select Different Folder]     [View Raw Output]         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Design Specifications

### 6.1 Visual Consistency

The Research Agent UI must use the existing design system:

- **Colors**: Use CSS variables (`--primary`, `--secondary`, etc.)
- **Spacing**: Follow existing patterns (4px grid)
- **Typography**: Use `--font-sans` and `--font-mono`
- **Shadows**: Use `--shadow-*` variables
- **Borders**: Use `--border` and `--radius` variables
- **Components**: Prefer shadcn/ui components

### 6.2 Research Agent Mascot

Since the existing codebase uses emoji mascots for agents:

```typescript
// Add to server/schemas.py AGENT_MASCOTS or create RESEARCH_MASCOT
RESEARCH_MASCOT = "🔬"  // or "🔍" for magnifying glass

// Research agent states (similar to existing pattern):
// idle: neutral expression
// scanning: animated "searching" motion
// analyzing: "thinking" animation (reuse existing)
// documenting: "writing" animation
// complete: celebration animation
// error: shake animation
```

### 6.3 Progress Visualization

```css
/* Phase-based progress bar */
.research-progress {
  /* Scanning: 0-25% */
  /* Analyzing: 25-75% */
  /* Documenting: 75-95% */
  /* Complete: 100% */
}

/* Animate between phases smoothly */
.research-progress-bar {
  transition: width 0.5s ease-out;
}
```

### 6.4 Tab Design for Documents

```
┌─────────┬─────────┬─────────┬─────────┬──────────┐
│ STACK   │ ARCH    │ STRUCT  │ CONVENT │ INTEGR   │
│ .md     │ .md     │ .md     │ .md     │ .md      │
└─────────┴─────────┴─────────┴─────────┴──────────┘
     ↑
  Active tab has:
  - Primary color background
  - Bottom border indicator
  - Bold text
```

### 6.5 Theme Compatibility

The implementation must work with all existing themes:
- Twitter (default)
- Claude (warm tones)
- Neo Brutalism (hard shadows)
- Retro Arcade (vibrant)
- Aurora (violet/teal)

Test checklist for each theme:
- [ ] Progress bar colors
- [ ] Tab active states
- [ ] Button hover states
- [ ] Modal backdrop
- [ ] Markdown code blocks

---

## 7. API Additions Required

### 7.1 Read Research Docs

```typescript
// New endpoint needed
GET /api/projects/:name/research-docs

Response:
{
  success: true,
  docs: [
    { filename: "STACK.md", content: "# Technology Stack\n..." },
    { filename: "ARCHITECTURE.md", content: "# Architecture\n..." },
    { filename: "STRUCTURE.md", content: "# Project Structure\n..." },
    { filename: "CONVENTIONS.md", content: "# Code Conventions\n..." },
    { filename: "INTEGRATIONS.md", content: "# Integrations\n..." }
  ],
  generatedAt: "2026-01-28T10:30:00Z"
}
```

### 7.2 Check Research Completion

```typescript
// May already exist, verify response includes docs path
GET /api/agent/research/status?project_name=xxx

// Ensure response includes:
{
  status: "complete",
  phase: "complete",
  docsPath: ".planning/codebase",
  filesWritten: ["STACK.md", "ARCHITECTURE.md", ...]
}
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

- `AnalyzeCodebaseModal`: Renders, validates input, calls onStartAnalysis
- `ResearchProgressView`: Displays phases correctly, handles WebSocket messages
- `ResearchResultsView`: Renders markdown, tab navigation works
- `MarkdownViewer`: Code highlighting, copy functionality

### 8.2 Integration Tests

- Full flow: Select folder → Start analysis → View progress → View results
- WebSocket reconnection during analysis
- Error recovery scenarios

### 8.3 E2E Tests (Playwright)

```typescript
test('analyze codebase flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Analyze Existing Codebase');
  await page.fill('[data-testid=project-name]', 'test-project');
  // Select folder...
  await page.click('text=Start Analysis');
  await expect(page.locator('[data-testid=research-progress]')).toBeVisible();
  // Wait for completion...
  await expect(page.locator('text=Analysis Complete')).toBeVisible();
});
```

---

## 9. Migration Path

Since this is additive functionality, no migration is required. However:

1. **Database**: No schema changes needed (research.db is separate)
2. **Existing Projects**: Unaffected, new UI elements are additive
3. **WebSocket**: `ResearchTracker` already implemented
4. **API**: New endpoints only, no breaking changes

---

## 10. Success Metrics

After implementation, track:

1. **Adoption**: % of users who try "Analyze Existing Codebase"
2. **Completion**: % of analyses that complete successfully
3. **Conversion**: % of analyses that convert to app_spec.txt
4. **Time**: Average analysis duration by codebase size
5. **Errors**: Research agent crash rate

---

## Appendix A: File Changes Summary

### New Files

```
ui/src/components/research/AnalyzeCodebaseModal.tsx
ui/src/components/research/ResearchProgressView.tsx
ui/src/components/research/ResearchResultsView.tsx
ui/src/components/research/ResearchDocTabs.tsx
ui/src/components/research/MarkdownViewer.tsx
ui/src/components/research/index.ts (barrel export)
```

### Modified Files

```
ui/src/App.tsx                    # Add routes
ui/src/components/ProjectSelector.tsx  # Add button
ui/src/lib/types.ts               # Add ResearchProject type
server/routers/projects.py        # Add /research-docs endpoint
```

---

## Appendix B: Dependencies to Add

```json
// ui/package.json
{
  "dependencies": {
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "react-syntax-highlighter": "^15.5.0"
  }
}
```

---

## Appendix C: References

- Existing WebSocket implementation: `/Users/maswa/Development/Repositories/autocoder/server/websocket.py`
- ResearchTracker class: Lines 522-714 in websocket.py
- Backend API: `/Users/maswa/Development/Repositories/autocoder/server/routers/agent.py`
- Research output example: `/Users/maswa/Development/Repositories/autocoder/.planning/codebase/STACK.md`
- Design system: `/Users/maswa/Development/Repositories/autocoder/ui/src/styles/globals.css`
