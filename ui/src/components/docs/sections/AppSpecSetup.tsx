/**
 * AppSpecSetup Documentation Section
 *
 * Explains what an app spec is, how to create one interactively
 * or manually, the initializer agent, and starting after spec creation.
 */

export function AppSpecSetup() {
  return (
    <div>
      {/* What is an App Spec? */}
      <h3 id="what-is-app-spec" className="text-lg font-semibold text-foreground mt-8 mb-3">
        What is an App Spec?
      </h3>
      <p className="text-muted-foreground mb-3">
        The app spec is an XML document that describes the application to be built. It lives at{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          .autocoder/prompts/app_spec.txt
        </span>{' '}
        and tells the initializer agent what features to create. The spec defines your app&apos;s name,
        description, tech stack, and the features that should be implemented.
      </p>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
        <pre><code>{`<app>
  <name>My App</name>
  <description>A task management app</description>
  <features>
    <feature>User authentication with login/signup</feature>
    <feature>Task CRUD with categories</feature>
  </features>
</app>`}</code></pre>
      </div>

      {/* Creating a Spec with Claude */}
      <h3 id="creating-spec-with-claude" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Creating a Spec with Claude
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          In the UI, select your project and click{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">Create Spec</span>
        </li>
        <li>
          An interactive chat with Claude helps you define your app &mdash; it asks about
          your app&apos;s purpose, features, and tech stack
        </li>
        <li>The spec is generated and saved automatically</li>
        <li>After creation, the initializer agent can be started immediately</li>
      </ul>

      {/* Writing a Spec Manually */}
      <h3 id="writing-spec-manually" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Writing a Spec Manually
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Create{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            .autocoder/prompts/app_spec.txt
          </span>{' '}
          in your project directory
        </li>
        <li>
          Use XML format with app name, description, tech stack, and a feature list
        </li>
        <li>
          Be specific about each feature &mdash; the initializer creates test cases from these
          descriptions
        </li>
        <li>
          Include technical constraints where needed (e.g.,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            &quot;use PostgreSQL&quot;
          </span>
          ,{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            &quot;React with TypeScript&quot;
          </span>
          )
        </li>
      </ul>

      {/* The Initializer Agent */}
      <h3 id="initializer-agent" className="text-lg font-semibold text-foreground mt-8 mb-3">
        The Initializer Agent
      </h3>
      <p className="text-muted-foreground mb-3">
        The initializer agent is the first agent to run on a new project. It bridges the gap between
        your spec and the coding agents that implement features.
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Runs automatically on first agent start when no features exist in the database</li>
        <li>Reads the app spec and creates features with descriptions, steps, and priorities</li>
        <li>
          Sets up feature dependencies (e.g., &quot;auth must be done before user profile&quot;)
        </li>
        <li>
          Creates the feature database at{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            .autocoder/features.db
          </span>
        </li>
      </ul>

      {/* Starting After Spec Creation */}
      <h3 id="starting-after-spec" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Starting After Spec Creation
      </h3>
      <p className="text-muted-foreground mb-3">
        Once your spec is ready, you can kick off the agents:
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          From the UI, click the <strong className="text-foreground">Play</strong> button to start
          the agent
        </li>
        <li>
          Or run from the CLI:
        </li>
      </ul>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm mt-3">
        <pre><code>python autonomous_agent_demo.py --project-dir your-project</code></pre>
      </div>
      <p className="text-muted-foreground mt-3">
        The initializer runs first to create features, then coding agents take over to implement
        them. Progress is shown in real time on the Kanban board.
      </p>
    </div>
  )
}
