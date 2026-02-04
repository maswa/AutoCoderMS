/**
 * SettingsConfig Documentation Section
 *
 * Covers global settings: opening the modal, YOLO mode, headless browser,
 * model selection, regression agents, batch size, concurrency, and persistence.
 */

import { Badge } from '@/components/ui/badge'

export function SettingsConfig() {
  return (
    <div>
      {/* Opening Settings */}
      <h3 id="opening-settings" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Opening Settings
      </h3>
      <p className="text-muted-foreground mb-4">
        Press the <Badge variant="secondary">,</Badge> (comma) key or click the gear icon in the header bar to
        open the Settings modal. Settings are global and apply to all projects.
      </p>

      {/* YOLO Mode */}
      <h3 id="yolo-mode" className="text-lg font-semibold text-foreground mt-8 mb-3">
        YOLO Mode
      </h3>
      <p className="text-muted-foreground mb-3">
        YOLO mode is for rapid prototyping &mdash; it skips testing for faster iteration:
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          <strong className="text-foreground">What&rsquo;s skipped:</strong> Regression testing, Playwright MCP
          server (browser automation disabled)
        </li>
        <li>
          <strong className="text-foreground">What still runs:</strong> Lint and type-check (to verify code
          compiles), Feature MCP server for tracking
        </li>
        <li>
          Toggle via the lightning bolt button in the UI or the{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">--yolo</span> CLI flag
        </li>
        <li>
          <strong className="text-foreground">When to use:</strong> Early prototyping when you want to scaffold
          features quickly without verification overhead
        </li>
        <li>Switch back to standard mode for production-quality development</li>
      </ul>

      {/* Headless Browser */}
      <h3 id="headless-browser" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Headless Browser
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>When enabled, Playwright runs without a visible browser window</li>
        <li>Saves CPU/GPU resources on machines running multiple agents</li>
        <li>Tests still run fully &mdash; just no visible browser UI</li>
        <li>Toggle in settings or via the UI button</li>
      </ul>

      {/* Model Selection */}
      <h3 id="model-selection" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Model Selection
      </h3>
      <p className="text-muted-foreground mb-3">
        Choose which Claude model tier to use for your agents:
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">Tier</th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Characteristics
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="default">Opus</Badge>
            </td>
            <td className="border border-border px-3 py-2">Most capable, highest quality</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="secondary">Sonnet</Badge>
            </td>
            <td className="border border-border px-3 py-2">Balanced speed and quality</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">
              <Badge variant="outline">Haiku</Badge>
            </td>
            <td className="border border-border px-3 py-2">Fastest, most economical</td>
          </tr>
        </tbody>
      </table>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground mt-4">
        <li>Model can be set globally in settings</li>
        <li>Per-schedule model override is also available</li>
        <li>
          When using Vertex AI, model names use{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">@</span> instead of{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">-</span> (e.g.,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            claude-opus-4-5@20251101
          </span>
          )
        </li>
      </ul>

      {/* Regression Agents */}
      <h3 id="regression-agents" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Regression Agents
      </h3>
      <p className="text-muted-foreground mb-3">
        Controls how many testing agents run alongside coding agents (0&ndash;3):
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          <strong className="text-foreground">0:</strong> No regression testing (like YOLO but coding agents
          still test their own feature)
        </li>
        <li>
          <strong className="text-foreground">1:</strong> One testing agent runs in background verifying
          completed features
        </li>
        <li>
          <strong className="text-foreground">2&ndash;3:</strong> Multiple testing agents for thorough
          verification
        </li>
        <li>Testing agents batch-test 1&ndash;5 features per session</li>
      </ul>

      {/* Features per Agent / Batch Size */}
      <h3 id="features-per-agent" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Features per Agent (Batch Size)
      </h3>
      <p className="text-muted-foreground mb-3">
        Controls how many features each coding agent implements per session (1&ndash;3):
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          <strong className="text-foreground">1:</strong> One feature per session (most focused, lower risk of
          conflicts)
        </li>
        <li>
          <strong className="text-foreground">2&ndash;3:</strong> Multiple features per session (more efficient,
          fewer session startups)
        </li>
        <li>
          Set via settings UI or the{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">--batch-size</span> CLI flag
        </li>
        <li>
          Can also target specific features:{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">--batch-features 1,2,3</span>
        </li>
      </ul>

      {/* Concurrency */}
      <h3 id="concurrency-setting" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Concurrency
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Per-project default concurrency saved in project settings</li>
        <li>Override at runtime with the concurrency slider in agent controls</li>
        <li>
          Range: <Badge variant="secondary">1&ndash;5</Badge> concurrent coding agents
        </li>
        <li>Higher concurrency = faster progress but more API cost</li>
      </ul>

      {/* How Settings are Persisted */}
      <h3 id="settings-persistence" className="text-lg font-semibold text-foreground mt-8 mb-3">
        How Settings are Persisted
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Global settings stored in SQLite registry at{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">~/.autocoder/registry.db</span>
        </li>
        <li>Per-project settings (like default concurrency) stored in the project registry entry</li>
        <li>UI settings (theme, dark mode) stored in browser localStorage</li>
        <li>Settings survive app restarts and are shared across UI sessions</li>
      </ul>
    </div>
  )
}
