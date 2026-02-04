/**
 * FAQ Documentation Section
 *
 * Covers frequently asked questions about project setup, agent behavior,
 * customization, troubleshooting, and real-time monitoring.
 */

export function FAQ() {
  return (
    <div>
      {/* Starting a New Project */}
      <h3 id="faq-new-project" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Starting a New Project
      </h3>
      <p className="text-muted-foreground italic mb-2">
        How do I use AutoCoder on a new project?
      </p>
      <p className="text-muted-foreground">
        From the UI, select &quot;Create New Project&quot; in the project dropdown. Choose a folder and
        name. Then create an app spec using the interactive chat or write one manually. Click Start to run
        the initializer agent, which creates features from your spec. Coding agents then implement features
        automatically.
      </p>

      {/* Adding to Existing Project */}
      <h3 id="faq-existing-project" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Adding to Existing Project
      </h3>
      <p className="text-muted-foreground italic mb-2">
        How do I add AutoCoder to an existing project?
      </p>
      <p className="text-muted-foreground">
        Register the project folder through the UI project selector using &quot;Add Existing&quot;.
        AutoCoder creates a{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.autocoder/</span> directory
        alongside your existing code. Write an app spec describing what to build (new features), and the
        agent works within your existing codebase.
      </p>

      {/* Agent Crashes */}
      <h3 id="faq-agent-crash" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Agent Crashes
      </h3>
      <p className="text-muted-foreground italic mb-2">
        What happens if an agent crashes?
      </p>
      <p className="text-muted-foreground">
        The orchestrator (Maestro) automatically detects crashed agents and can restart them. Features
        claimed by a crashed agent are released back to the pending queue. Scheduled runs use exponential
        backoff with up to 3 retries. Check the agent logs in the debug panel for crash details.
      </p>

      {/* Custom Bash Commands */}
      <h3 id="faq-custom-commands" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Custom Bash Commands
      </h3>
      <p className="text-muted-foreground italic mb-2">
        How do I customize which bash commands the agent can use?
      </p>
      <p className="text-muted-foreground">
        Create{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          .autocoder/allowed_commands.yaml
        </span>{' '}
        in your project with a list of allowed commands. Supports exact names, wildcards (e.g.,{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">swift*</span>), and local
        scripts. See the Security section for full details on the command hierarchy.
      </p>

      {/* Blocked Features */}
      <h3 id="faq-blocked-features" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Blocked Features
      </h3>
      <p className="text-muted-foreground italic mb-2">
        Why are my features stuck in &quot;blocked&quot; status?
      </p>
      <p className="text-muted-foreground">
        Features with unmet dependencies show as blocked. Check the Dependency Graph view (press{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">G</span>) to see which
        features are waiting on others. A feature can only start when all its dependencies are marked as
        &quot;passing&quot;. Remove or reorder dependencies if needed.
      </p>

      {/* Running in Parallel */}
      <h3 id="faq-parallel" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Running in Parallel
      </h3>
      <p className="text-muted-foreground italic mb-2">
        How do I run multiple agents in parallel?
      </p>
      <p className="text-muted-foreground">
        Use the concurrency slider in the agent control bar (1&ndash;5 agents) or pass{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          --parallel --max-concurrency N
        </span>{' '}
        on the CLI. Each agent claims features atomically, so there is no conflict. More agents means
        faster progress but higher API cost.
      </p>

      {/* Using Local Models */}
      <h3 id="faq-local-model" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Using Local Models
      </h3>
      <p className="text-muted-foreground italic mb-2">
        Can I use a local model instead of the Claude API?
      </p>
      <p className="text-muted-foreground">
        Yes, via Ollama v0.14.0+. Install Ollama, pull a coding model (e.g.,{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">qwen3-coder</span>), and
        configure your{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.env</span> to point to
        localhost. See the Advanced Configuration section for full setup instructions.
      </p>

      {/* Resetting a Project */}
      <h3 id="faq-reset" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Resetting a Project
      </h3>
      <p className="text-muted-foreground italic mb-2">
        How do I reset a project and start over?
      </p>
      <p className="text-muted-foreground">
        Press <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">R</span> (when agents
        are stopped) to open the Reset modal. Choose between: &quot;Reset Features&quot; (clears the
        feature database, keeps the spec) or &quot;Full Reset&quot; (removes the spec too, starts fresh).
        After a full reset, you will be prompted to create a new spec.
      </p>

      {/* Coding vs Testing Agents */}
      <h3 id="faq-agent-types" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Coding vs Testing Agents
      </h3>
      <p className="text-muted-foreground italic mb-2">
        What&apos;s the difference between coding and testing agents?
      </p>
      <p className="text-muted-foreground">
        Coding agents implement features &mdash; they write code, create files, and run feature-specific
        tests. Testing agents run regression tests across completed features to ensure new code does not
        break existing functionality. Configure the testing agent ratio (0&ndash;3) in settings.
      </p>

      {/* Monitoring in Real Time */}
      <h3 id="faq-real-time" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Monitoring in Real Time
      </h3>
      <p className="text-muted-foreground italic mb-2">
        How do I view what an agent is doing in real time?
      </p>
      <p className="text-muted-foreground">
        Multiple ways: (1) Watch the Kanban board for feature status changes. (2) Open the debug panel
        (<span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">D</span> key) for live
        agent logs. (3) Click agent cards in Mission Control for per-agent logs. (4) The progress bar
        updates in real time via WebSocket.
      </p>
    </div>
  )
}
