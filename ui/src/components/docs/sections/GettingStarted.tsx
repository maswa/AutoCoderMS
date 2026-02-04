/**
 * GettingStarted Documentation Section
 *
 * Covers what AutoCoder is, quick start commands,
 * creating and adding projects, and system requirements.
 */

import { Badge } from '@/components/ui/badge'

export function GettingStarted() {
  return (
    <div>
      {/* What is AutoCoder? */}
      <h3 id="what-is-autocoder" className="text-lg font-semibold text-foreground mt-8 mb-3">
        What is AutoCoder?
      </h3>
      <p className="text-muted-foreground mb-4">
        AutoCoder is an autonomous coding agent system that builds complete applications over multiple
        sessions using a two-agent pattern:
      </p>
      <ol className="list-decimal space-y-2 ml-4 text-muted-foreground">
        <li>
          <strong className="text-foreground">Initializer Agent</strong> &mdash; reads your app spec
          and creates features in a SQLite database
        </li>
        <li>
          <strong className="text-foreground">Coding Agent</strong> &mdash; implements features one by
          one, marking each as passing when complete
        </li>
      </ol>
      <p className="text-muted-foreground mt-4">
        It comes with a React-based UI for monitoring progress, managing features, and controlling agents
        in real time.
      </p>

      {/* Quick Start */}
      <h3 id="quick-start" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Quick Start
      </h3>
      <p className="text-muted-foreground mb-3">
        Launch AutoCoder with a single command. The CLI menu lets you create or select a project,
        while the Web UI provides a full dashboard experience.
      </p>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <pre><code>{`# Windows
start.bat          # CLI menu
start_ui.bat       # Web UI

# macOS/Linux
./start.sh         # CLI menu
./start_ui.sh      # Web UI`}</code></pre>
      </div>

      {/* Creating a New Project */}
      <h3 id="creating-a-project" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Creating a New Project
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          From the UI, click the project dropdown and select{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">Create New Project</span>
        </li>
        <li>Enter a name and select or browse to a folder for the project</li>
        <li>
          Create an app spec interactively with Claude, or write one manually in XML format
        </li>
        <li>
          The initializer agent reads your spec and creates features automatically
        </li>
      </ul>

      {/* Adding to an Existing Project */}
      <h3 id="existing-project" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Adding to an Existing Project
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Register the project folder via the UI project selector</li>
        <li>
          AutoCoder creates a{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.autocoder/</span>{' '}
          directory inside your project
        </li>
        <li>
          Existing code is preserved &mdash; AutoCoder adds its configuration alongside it
        </li>
        <li>Write or generate an app spec describing what to build</li>
      </ul>

      {/* System Requirements */}
      <h3 id="system-requirements" className="text-lg font-semibold text-foreground mt-8 mb-3">
        System Requirements
      </h3>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Requirement
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr>
            <td className="border border-border px-3 py-2">Python</td>
            <td className="border border-border px-3 py-2">
              <Badge variant="secondary">3.11+</Badge>
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Node.js</td>
            <td className="border border-border px-3 py-2">
              <Badge variant="secondary">20+</Badge>{' '}
              <span className="text-xs">(for UI development)</span>
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Claude Code CLI</td>
            <td className="border border-border px-3 py-2">
              Required for running agents
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Operating System</td>
            <td className="border border-border px-3 py-2">
              Windows, macOS, or Linux
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
