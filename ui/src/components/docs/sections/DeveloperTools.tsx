/**
 * DeveloperTools Documentation Section
 *
 * Covers the debug panel, agent logs tab, dev server logs,
 * terminal, dev server control, and per-agent logs.
 */

import { Badge } from '@/components/ui/badge'

export function DeveloperTools() {
  return (
    <div>
      {/* Debug Panel */}
      <h3 id="debug-panel" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Debug Panel
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Press <Badge variant="secondary">D</Badge> to toggle the debug panel at the bottom of the screen
        </li>
        <li>Resizable by dragging the top edge</li>
        <li>
          Three tabs: <strong className="text-foreground">Agent Logs</strong>,{' '}
          <strong className="text-foreground">Dev Server Logs</strong>, and{' '}
          <strong className="text-foreground">Terminal</strong>
        </li>
        <li>Shows real-time output from agents and dev server</li>
      </ul>

      {/* Agent Logs Tab */}
      <h3 id="agent-logs-tab" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Agent Logs Tab
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Color-coded log levels:{' '}
          <span className="text-[var(--color-log-error)] font-medium">Error</span>,{' '}
          <span className="text-[var(--color-log-warning)] font-medium">Warning</span>,{' '}
          <span className="text-[var(--color-log-info)] font-medium">Info</span>,{' '}
          <span className="text-[var(--color-log-debug)] font-medium">Debug</span>,{' '}
          <span className="text-[var(--color-log-success)] font-medium">Success</span>
        </li>
        <li>Timestamps on each log entry</li>
        <li>Auto-scrolls to latest entry</li>
        <li>Clear button to reset log view</li>
      </ul>

      {/* Dev Server Logs Tab */}
      <h3 id="dev-server-logs" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Dev Server Logs Tab
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Shows stdout/stderr from the project&rsquo;s dev server (e.g.,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">npm run dev</span>)
        </li>
        <li>Useful for seeing compilation errors, hot reload status</li>
        <li>Clear button available</li>
      </ul>

      {/* Terminal */}
      <h3 id="terminal" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Terminal
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Press <Badge variant="secondary">T</Badge> to open terminal (opens debug panel on the terminal tab)
        </li>
        <li>Full xterm.js terminal emulator with WebSocket backend</li>
        <li>Multi-tab support: create multiple terminal sessions</li>
        <li>Rename tabs by double-clicking the tab title</li>
        <li>Each tab runs an independent PTY (pseudo-terminal) session</li>
        <li>Supports standard terminal features: colors, cursor movement, history</li>
      </ul>

      {/* Dev Server Control */}
      <h3 id="dev-server-control" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Dev Server Control
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Start/stop button in the header bar</li>
        <li>
          Auto-detects project type (Next.js, Vite, CRA, etc.) and runs the appropriate dev command
        </li>
        <li>Shows the dev server URL when running</li>
        <li>Automatic crash detection and restart option</li>
        <li>Dev server output piped to the Dev Server Logs tab</li>
      </ul>

      {/* Per-Agent Logs */}
      <h3 id="per-agent-logs" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Per-Agent Logs
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>In Agent Mission Control, click any agent card to see its individual logs</li>
        <li>
          Logs include: what feature the agent is working on, code changes, test results
        </li>
        <li>Separate logs for coding agents and testing agents</li>
        <li>Real-time streaming &mdash; see agent output as it happens</li>
      </ul>
    </div>
  )
}
