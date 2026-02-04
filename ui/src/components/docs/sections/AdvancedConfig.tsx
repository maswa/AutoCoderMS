/**
 * AdvancedConfig Documentation Section
 *
 * Covers Vertex AI setup, Ollama local models, environment variables,
 * CLI arguments, webhook support, and the project registry.
 */

import { Badge } from '@/components/ui/badge'

/** Environment variable descriptor for the reference table. */
interface EnvVar {
  name: string
  description: string
}

const ENV_VARS: EnvVar[] = [
  { name: 'CLAUDE_CODE_USE_VERTEX', description: 'Enable Vertex AI (1)' },
  { name: 'CLOUD_ML_REGION', description: 'GCP region' },
  { name: 'ANTHROPIC_VERTEX_PROJECT_ID', description: 'GCP project ID' },
  { name: 'ANTHROPIC_BASE_URL', description: 'Custom API base URL (for Ollama)' },
  { name: 'ANTHROPIC_AUTH_TOKEN', description: 'API auth token' },
  { name: 'API_TIMEOUT_MS', description: 'API timeout in milliseconds' },
  { name: 'EXTRA_READ_PATHS', description: 'Comma-separated extra read directories' },
  { name: 'ANTHROPIC_DEFAULT_OPUS_MODEL', description: 'Override Opus model name' },
  { name: 'ANTHROPIC_DEFAULT_SONNET_MODEL', description: 'Override Sonnet model name' },
  { name: 'ANTHROPIC_DEFAULT_HAIKU_MODEL', description: 'Override Haiku model name' },
]

/** CLI argument descriptor for the reference table. */
interface CliArg {
  name: string
  description: string
}

const CLI_ARGS: CliArg[] = [
  { name: '--project-dir', description: 'Project directory path or registered name' },
  { name: '--yolo', description: 'Enable YOLO mode' },
  { name: '--parallel', description: 'Enable parallel mode' },
  { name: '--max-concurrency N', description: 'Max concurrent agents (1-5)' },
  { name: '--batch-size N', description: 'Features per coding agent (1-3)' },
  { name: '--batch-features 1,2,3', description: 'Specific feature IDs to implement' },
  { name: '--testing-batch-size N', description: 'Features per testing batch (1-5)' },
  { name: '--testing-batch-features 1,2,3', description: 'Specific testing feature IDs' },
]

export function AdvancedConfig() {
  return (
    <div>
      {/* Vertex AI Setup */}
      <h3 id="vertex-ai" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Vertex AI Setup
      </h3>
      <p className="text-muted-foreground mb-3">
        Run coding agents via Google Cloud Vertex AI:
      </p>
      <ol className="list-decimal space-y-2 ml-4 text-muted-foreground">
        <li>
          Install and authenticate the gcloud CLI:{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            gcloud auth application-default login
          </span>
        </li>
        <li>
          Configure your{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.env</span> file:
        </li>
      </ol>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm mt-3">
        <pre><code>{`CLAUDE_CODE_USE_VERTEX=1
CLOUD_ML_REGION=us-east5
ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-5@20251101
ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-5@20250929
ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-3-5-haiku@20241022`}</code></pre>
      </div>
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mt-4">
        Use <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono not-italic">@</span>{' '}
        instead of <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono not-italic">-</span>{' '}
        in model names for Vertex AI.
      </blockquote>

      {/* Ollama Local Models */}
      <h3 id="ollama" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Ollama Local Models
      </h3>
      <p className="text-muted-foreground mb-3">
        Run coding agents using local models via Ollama v0.14.0+:
      </p>
      <ol className="list-decimal space-y-2 ml-4 text-muted-foreground">
        <li>
          Install Ollama from{' '}
          <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-primary underline">
            ollama.com
          </a>
        </li>
        <li>
          Start Ollama:{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">ollama serve</span>
        </li>
        <li>
          Pull a coding model:{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">ollama pull qwen3-coder</span>
        </li>
        <li>
          Configure your{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">.env</span>:
        </li>
      </ol>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm mt-3">
        <pre><code>{`ANTHROPIC_BASE_URL=http://localhost:11434
ANTHROPIC_AUTH_TOKEN=ollama
API_TIMEOUT_MS=3000000
ANTHROPIC_DEFAULT_SONNET_MODEL=qwen3-coder`}</code></pre>
      </div>
      <p className="text-muted-foreground mt-3">
        <strong className="text-foreground">Recommended models:</strong>{' '}
        <Badge variant="secondary">qwen3-coder</Badge>{' '}
        <Badge variant="secondary">deepseek-coder-v2</Badge>{' '}
        <Badge variant="secondary">codellama</Badge>
      </p>
      <p className="text-muted-foreground mt-2">
        <strong className="text-foreground">Limitations:</strong> Smaller context windows than Claude
        (model-dependent), extended context beta disabled (not supported by Ollama), and performance
        depends on local hardware (GPU recommended).
      </p>

      {/* Environment Variables */}
      <h3 id="env-variables" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Environment Variables
      </h3>
      <p className="text-muted-foreground mb-3">
        Key environment variables for configuring AutoCoder:
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Variable
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          {ENV_VARS.map((v) => (
            <tr key={v.name}>
              <td className="border border-border px-3 py-2">
                <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{v.name}</span>
              </td>
              <td className="border border-border px-3 py-2">{v.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CLI Arguments */}
      <h3 id="cli-arguments" className="text-lg font-semibold text-foreground mt-8 mb-3">
        CLI Arguments
      </h3>
      <p className="text-muted-foreground mb-3">
        Command-line arguments for{' '}
        <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          autonomous_agent_demo.py
        </span>
        :
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Argument
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          {CLI_ARGS.map((arg) => (
            <tr key={arg.name}>
              <td className="border border-border px-3 py-2">
                <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{arg.name}</span>
              </td>
              <td className="border border-border px-3 py-2">{arg.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Webhook Support */}
      <h3 id="webhooks" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Webhook Support
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>AutoCoder can send webhook notifications on feature completion</li>
        <li>Compatible with N8N and similar automation tools</li>
        <li>Configure the webhook URL in project settings</li>
        <li>
          Payload includes: feature name, status, and project info
        </li>
      </ul>

      {/* Project Registry */}
      <h3 id="project-registry" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Project Registry
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          All projects are registered in{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">~/.autocoder/registry.db</span>{' '}
          (SQLite)
        </li>
        <li>Maps project names to filesystem paths</li>
        <li>Uses POSIX path format (forward slashes) for cross-platform compatibility</li>
        <li>SQLAlchemy ORM with SQLite&apos;s built-in transaction handling</li>
      </ul>
    </div>
  )
}
