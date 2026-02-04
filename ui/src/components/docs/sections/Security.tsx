/**
 * Security Documentation Section
 *
 * Covers the defense-in-depth security model: command validation layers,
 * the hierarchical allowlist/blocklist system, per-project and org-level
 * configuration, extra read paths, and filesystem sandboxing.
 */

import { Badge } from '@/components/ui/badge'

export function Security() {
  return (
    <div>
      {/* Command Validation Overview */}
      <h3 id="command-validation" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Command Validation Overview
      </h3>
      <p className="text-muted-foreground mb-3">
        AutoCoder uses a defense-in-depth approach for security. All three layers must pass before any
        command is executed:
      </p>
      <ol className="list-decimal space-y-2 ml-4 text-muted-foreground">
        <li>
          <strong className="text-foreground">OS-level sandbox</strong> &mdash; bash commands run inside
          a restricted sandbox environment
        </li>
        <li>
          <strong className="text-foreground">Filesystem restriction</strong> &mdash; agents can only
          access the project directory (plus configured extra read paths)
        </li>
        <li>
          <strong className="text-foreground">Hierarchical allowlist</strong> &mdash; every bash command
          is validated against a multi-level allowlist system
        </li>
      </ol>

      {/* Command Hierarchy */}
      <h3 id="command-hierarchy" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Command Hierarchy
      </h3>
      <p className="text-muted-foreground mb-3">
        Commands are evaluated against a 5-level hierarchy, from highest to lowest priority:
      </p>
      <ol className="list-decimal space-y-2 ml-4 text-muted-foreground">
        <li>
          <strong className="text-foreground">Hardcoded Blocklist</strong>{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">security.py</span>{' '}
          &mdash; NEVER allowed, cannot be overridden
        </li>
        <li>
          <strong className="text-foreground">Org Blocklist</strong>{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">~/.autocoder/config.yaml</span>{' '}
          &mdash; org-wide blocks, cannot be project-overridden
        </li>
        <li>
          <strong className="text-foreground">Org Allowlist</strong>{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">~/.autocoder/config.yaml</span>{' '}
          &mdash; available to all projects
        </li>
        <li>
          <strong className="text-foreground">Global Allowlist</strong>{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">security.py</span>{' '}
          &mdash; default commands (npm, git, curl, etc.)
        </li>
        <li>
          <strong className="text-foreground">Project Allowlist</strong>{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            .autocoder/allowed_commands.yaml
          </span>{' '}
          &mdash; project-specific additions
        </li>
      </ol>
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mt-4">
        Higher priority levels always win. A command blocked at level 1 or 2 can never be allowed by
        lower levels.
      </blockquote>

      {/* Hardcoded Blocklist */}
      <h3 id="hardcoded-blocklist" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Hardcoded Blocklist
      </h3>
      <p className="text-muted-foreground mb-3">
        The following commands can <strong className="text-foreground">never</strong> be allowed, regardless
        of any configuration. They are hardcoded in{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">security.py</span> and
        cannot be overridden:
      </p>
      <div className="flex flex-wrap gap-2">
        {['dd', 'sudo', 'su', 'shutdown', 'reboot', 'poweroff', 'mkfs', 'fdisk', 'mount', 'umount', 'systemctl'].map(
          (cmd) => (
            <Badge key={cmd} variant="destructive">
              {cmd}
            </Badge>
          ),
        )}
      </div>

      {/* Global Allowlist */}
      <h3 id="global-allowlist" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Global Allowlist
      </h3>
      <p className="text-muted-foreground mb-3">
        Default commands available to all projects out of the box. These are the standard development
        commands needed for most projects:
      </p>
      <div className="flex flex-wrap gap-2">
        {['npm', 'npx', 'node', 'git', 'curl', 'python', 'pip', 'cat', 'ls', 'mkdir', 'cp', 'mv', 'rm', 'grep', 'find'].map(
          (cmd) => (
            <Badge key={cmd} variant="secondary">
              {cmd}
            </Badge>
          ),
        )}
      </div>

      {/* Per-Project Allowed Commands */}
      <h3 id="project-allowlist" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Per-Project Allowed Commands
      </h3>
      <p className="text-muted-foreground mb-3">
        Each project can define additional allowed commands in{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          .autocoder/allowed_commands.yaml
        </span>
        :
      </p>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <pre><code>{`# .autocoder/allowed_commands.yaml
version: 1
commands:
  # Exact command name
  - name: swift
    description: Swift compiler

  # Wildcard - matches swiftc, swiftlint, swiftformat
  - name: swift*
    description: All Swift tools (wildcard)

  # Local project scripts
  - name: ./scripts/build.sh
    description: Project build script`}</code></pre>
      </div>
      <p className="text-muted-foreground mt-3">
        <strong className="text-foreground">Pattern matching:</strong> exact match (
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">swift</span>), wildcard (
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">swift*</span> matches swiftc,
        swiftlint, etc.), and scripts (
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">./scripts/build.sh</span>).
        Limit: 100 commands per project.
      </p>

      {/* Organization Configuration */}
      <h3 id="org-config" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Organization Configuration
      </h3>
      <p className="text-muted-foreground mb-3">
        System administrators can set org-wide policies in{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">~/.autocoder/config.yaml</span>:
      </p>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <pre><code>{`# ~/.autocoder/config.yaml
version: 1

# Commands available to ALL projects
allowed_commands:
  - name: jq
    description: JSON processor

# Commands blocked across ALL projects (cannot be overridden)
blocked_commands:
  - aws        # Prevent accidental cloud operations
  - kubectl    # Block production deployments`}</code></pre>
      </div>
      <p className="text-muted-foreground mt-3">
        Org-level blocked commands cannot be overridden by any project configuration.
      </p>

      {/* Extra Read Paths */}
      <h3 id="extra-read-paths" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Extra Read Paths
      </h3>
      <p className="text-muted-foreground mb-3">
        Allow agents to read files from directories outside the project folder via the{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">EXTRA_READ_PATHS</span>{' '}
        environment variable:
      </p>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <pre><code>EXTRA_READ_PATHS=/path/to/docs,/path/to/shared-libs</code></pre>
      </div>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground mt-3">
        <li>Must be absolute paths and must exist as directories</li>
        <li>Only read operations allowed (Read, Glob, Grep &mdash; no Write/Edit)</li>
        <li>
          Sensitive directories are always blocked:{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.ssh</span>,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.aws</span>,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.gnupg</span>,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.docker</span>,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.kube</span>, etc.
        </li>
      </ul>

      {/* Filesystem Sandboxing */}
      <h3 id="filesystem-sandboxing" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Filesystem Sandboxing
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Agents can only write to the project directory</li>
        <li>Read access is limited to the project directory plus configured extra read paths</li>
        <li>
          Path traversal attacks are prevented via canonicalization (
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">Path.resolve()</span>)
        </li>
        <li>File operations are validated before execution</li>
      </ul>
    </div>
  )
}
