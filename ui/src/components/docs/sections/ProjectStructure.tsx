/**
 * ProjectStructure Documentation Section
 *
 * Covers the .autocoder/ directory layout, features database,
 * prompts directory, allowed commands, CLAUDE.md convention,
 * legacy migration, and Claude inheritance.
 */

export function ProjectStructure() {
  return (
    <div>
      {/* .autocoder/ Directory Layout */}
      <h3 id="autocoder-directory" className="text-lg font-semibold text-foreground mt-8 mb-3">
        .autocoder/ Directory Layout
      </h3>
      <p className="text-muted-foreground mb-3">
        Every AutoCoder project stores its configuration and runtime files in a{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.autocoder/</span>{' '}
        directory at the project root.
      </p>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <pre><code>{`your-project/
\u251C\u2500\u2500 .autocoder/
\u2502   \u251C\u2500\u2500 features.db              # SQLite feature database
\u2502   \u251C\u2500\u2500 .agent.lock              # Lock file (prevents multiple instances)
\u2502   \u251C\u2500\u2500 .gitignore               # Ignores runtime files
\u2502   \u251C\u2500\u2500 allowed_commands.yaml    # Per-project bash command allowlist
\u2502   \u2514\u2500\u2500 prompts/
\u2502       \u251C\u2500\u2500 app_spec.txt         # Application specification (XML)
\u2502       \u251C\u2500\u2500 initializer_prompt.md # First session prompt
\u2502       \u2514\u2500\u2500 coding_prompt.md     # Continuation session prompt
\u251C\u2500\u2500 CLAUDE.md                    # Claude Code convention file
\u2514\u2500\u2500 app_spec.txt                 # Root copy for template compatibility`}</code></pre>
      </div>

      {/* Features Database */}
      <h3 id="features-db" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Features Database
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          SQLite database managed by SQLAlchemy, stored at{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            .autocoder/features.db
          </span>
        </li>
        <li>
          Each feature record includes: id, priority, category, name, description, steps, status
          (<span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pending</span>,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">in_progress</span>,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">passing</span>,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">failing</span>),
          and dependencies
        </li>
        <li>Agents interact with features through MCP server tools, not direct database access</li>
        <li>Viewable in the UI via the Kanban board or the Dependency Graph view</li>
      </ul>

      {/* Prompts Directory */}
      <h3 id="prompts-directory" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Prompts Directory
      </h3>
      <p className="text-muted-foreground mb-3">
        Prompts control how agents behave during each session:
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">app_spec.txt</span>{' '}
          &mdash; your application specification in XML format
        </li>
        <li>
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            initializer_prompt.md
          </span>{' '}
          &mdash; prompt for the initializer agent (creates features from the spec)
        </li>
        <li>
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            coding_prompt.md
          </span>{' '}
          &mdash; prompt for coding agents (implements features)
        </li>
      </ul>
      <p className="text-muted-foreground mt-3">
        These can be customized per project. If not present, defaults from{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          .claude/templates/
        </span>{' '}
        are used as a fallback.
      </p>

      {/* Allowed Commands Config */}
      <h3 id="allowed-commands-yaml" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Allowed Commands Config
      </h3>
      <p className="text-muted-foreground mb-3">
        The optional{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          .autocoder/allowed_commands.yaml
        </span>{' '}
        file lets you grant project-specific bash commands to the agent. This is useful when your
        project requires tools beyond the default allowlist (e.g., language-specific compilers or
        custom build scripts).
      </p>
      <p className="text-muted-foreground">
        See the <strong className="text-foreground">Security</strong> section for full details on
        the command hierarchy and how project-level commands interact with global and organization
        policies.
      </p>

      {/* CLAUDE.md Convention */}
      <h3 id="claude-md" className="text-lg font-semibold text-foreground mt-8 mb-3">
        CLAUDE.md Convention
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">CLAUDE.md</span>{' '}
          lives at the project root, as required by the Claude Code SDK
        </li>
        <li>
          Contains project-specific instructions that the agent follows during every coding session
        </li>
        <li>
          Automatically inherited by all agents working on the project &mdash; no additional
          configuration needed
        </li>
      </ul>

      {/* Legacy Layout Migration */}
      <h3 id="legacy-migration" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Legacy Layout Migration
      </h3>
      <p className="text-muted-foreground mb-3">
        Older projects stored configuration files directly at the project root (e.g.,{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">features.db</span>,{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">prompts/</span>).
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          On the next agent start, these files are automatically migrated into{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.autocoder/</span>
        </li>
        <li>Dual-path resolution ensures both old and new layouts work transparently</li>
        <li>No manual migration is needed &mdash; it happens seamlessly</li>
      </ul>

      {/* Claude Inheritance */}
      <h3 id="claude-inheritance" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Claude Inheritance
      </h3>
      <p className="text-muted-foreground mb-3">
        Agents inherit all MCP servers, tools, skills, custom commands, and{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">CLAUDE.md</span>{' '}
        from the target project folder.
      </p>
      <div className="border-l-4 border-primary pl-4 italic text-muted-foreground">
        If your project has its own MCP servers or Claude commands, the coding agent can use them.
        The agent essentially runs as if Claude Code was opened in your project directory.
      </div>
    </div>
  )
}
