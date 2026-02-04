/**
 * AgentSystem Documentation Section
 *
 * Covers the orchestrator (Maestro), coding agents, testing agents,
 * agent lifecycle, concurrency control, mission control dashboard,
 * agent mascots and states, viewing logs, and process limits.
 */

import { Badge } from '@/components/ui/badge'

export function AgentSystem() {
  return (
    <div>
      {/* Maestro: The Orchestrator */}
      <h3 id="maestro-orchestrator" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Maestro: The Orchestrator
      </h3>
      <p className="text-muted-foreground mb-3">
        Maestro is the central orchestrator that coordinates all agents. It acts as the conductor,
        ensuring features are implemented efficiently and in the correct order.
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Manages the full lifecycle of coding and testing agents</li>
        <li>Schedules which features to work on based on dependencies and priority</li>
        <li>Monitors agent health and restarts crashed agents automatically</li>
        <li>Reports status to the UI in real time via WebSocket</li>
      </ul>

      {/* Coding Agents */}
      <h3 id="coding-agents" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Coding Agents
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Implement features one at a time, or in batches of 1&ndash;3</li>
        <li>
          Claim features atomically via the{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            feature_claim_and_get
          </span>{' '}
          MCP tool &mdash; no two agents work on the same feature
        </li>
        <li>Run in isolated environments with their own browser context</li>
        <li>
          Use the Claude Code SDK with project-specific tools and{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">CLAUDE.md</span>
        </li>
      </ul>

      {/* Testing Agents */}
      <h3 id="testing-agents" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Testing Agents
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Run regression tests after features are implemented</li>
        <li>Verify that new code does not break existing features</li>
        <li>Configurable ratio: 0&ndash;3 testing agents per coding agent</li>
        <li>Can batch-test multiple features per session (1&ndash;5)</li>
      </ul>

      {/* Agent Lifecycle */}
      <h3 id="agent-lifecycle" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Agent Lifecycle
      </h3>
      <p className="text-muted-foreground mb-3">
        Agents are controlled through the UI or CLI. The lifecycle states are:
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Action
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Behavior
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr>
            <td className="border border-border px-3 py-2 font-medium">Start</td>
            <td className="border border-border px-3 py-2">
              Click the Play button or run the CLI command
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2 font-medium">Stop</td>
            <td className="border border-border px-3 py-2">
              Gracefully terminates all running agents
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2 font-medium">Pause</td>
            <td className="border border-border px-3 py-2">
              Temporarily halts work (agents finish their current task first)
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2 font-medium">Resume</td>
            <td className="border border-border px-3 py-2">
              Continues from where the agents were paused
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-muted-foreground mt-3">
        Agents auto-continue between sessions with a 3-second delay, so they keep working until
        all features are complete or they are explicitly stopped.
      </p>

      {/* Concurrency Control */}
      <h3 id="concurrency" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Concurrency Control
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          A slider in the agent control bar sets the number of concurrent coding agents
          (1&ndash;5)
        </li>
        <li>
          More agents means faster progress, but also higher API usage
        </li>
        <li>Each agent runs as an independent subprocess</li>
        <li>
          Feature claiming is atomic &mdash; no two agents will ever work on the same feature
          simultaneously
        </li>
      </ul>

      {/* Agent Mission Control */}
      <h3 id="mission-control" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Agent Mission Control
      </h3>
      <p className="text-muted-foreground mb-3">
        The Mission Control dashboard provides a real-time overview of all active agents:
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Active agent cards with mascot icons and current status</li>
        <li>The feature each agent is currently working on</li>
        <li>Agent state indicators (thinking, working, testing, etc.)</li>
        <li>Orchestrator status and a recent activity feed</li>
      </ul>

      {/* Agent Mascots & States */}
      <h3 id="agent-mascots" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Agent Mascots &amp; States
      </h3>
      <p className="text-muted-foreground mb-3">
        Each agent is assigned a unique mascot for easy identification:{' '}
        <strong className="text-foreground">Spark</strong>,{' '}
        <strong className="text-foreground">Fizz</strong>,{' '}
        <strong className="text-foreground">Octo</strong>,{' '}
        <strong className="text-foreground">Hoot</strong>,{' '}
        <strong className="text-foreground">Buzz</strong>, and more. Agent states include:
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              State
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Animation
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="secondary">Thinking</Badge>
            </td>
            <td className="border border-border px-3 py-2">Bouncing</td>
            <td className="border border-border px-3 py-2">Agent is planning its approach</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="secondary">Working</Badge>
            </td>
            <td className="border border-border px-3 py-2">Shake</td>
            <td className="border border-border px-3 py-2">Actively writing code</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="secondary">Testing</Badge>
            </td>
            <td className="border border-border px-3 py-2">Rotating</td>
            <td className="border border-border px-3 py-2">Running tests</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="default">Success</Badge>
            </td>
            <td className="border border-border px-3 py-2">Celebration</td>
            <td className="border border-border px-3 py-2">Feature completed</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="destructive">Error</Badge>
            </td>
            <td className="border border-border px-3 py-2">Red shake</td>
            <td className="border border-border px-3 py-2">Encountered an issue</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="outline">Struggling</Badge>
            </td>
            <td className="border border-border px-3 py-2">Concerned expression</td>
            <td className="border border-border px-3 py-2">Multiple consecutive failures</td>
          </tr>
        </tbody>
      </table>

      {/* Viewing Agent Logs */}
      <h3 id="agent-logs" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Viewing Agent Logs
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Click any agent card in Mission Control to see its log output</li>
        <li>Logs are color-coded by level (info, warning, error)</li>
        <li>Output streams in real time via WebSocket</li>
        <li>Each agent&apos;s logs are isolated and filterable</li>
      </ul>

      {/* Process Limits */}
      <h3 id="process-limits" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Process Limits
      </h3>
      <p className="text-muted-foreground mb-3">
        The orchestrator enforces strict bounds on concurrent processes to prevent resource
        exhaustion:
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Limit
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr>
            <td className="border border-border px-3 py-2">
              <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                MAX_PARALLEL_AGENTS
              </span>
            </td>
            <td className="border border-border px-3 py-2">5 (maximum concurrent coding agents)</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                MAX_TOTAL_AGENTS
              </span>
            </td>
            <td className="border border-border px-3 py-2">
              10 (hard limit on coding + testing combined)
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Testing agents</td>
            <td className="border border-border px-3 py-2">
              Capped at the same count as coding agents
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Total Python processes</td>
            <td className="border border-border px-3 py-2">
              Never exceeds 11 (1 orchestrator + 5 coding + 5 testing)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
