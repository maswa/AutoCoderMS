import {
  Rocket,
  FileText,
  FolderTree,
  LayoutGrid,
  Bot,
  Settings,
  Terminal,
  MessageSquare,
  Clock,
  Palette,
  Shield,
  Wrench,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'

export interface DocSubsection {
  id: string
  title: string
}

export interface DocSection {
  id: string
  title: string
  icon: LucideIcon
  subsections: DocSubsection[]
  keywords: string[]
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    subsections: [
      { id: 'what-is-autocoder', title: 'What is AutoCoder?' },
      { id: 'quick-start', title: 'Quick Start' },
      { id: 'creating-a-project', title: 'Creating a New Project' },
      { id: 'existing-project', title: 'Adding to an Existing Project' },
      { id: 'system-requirements', title: 'System Requirements' },
    ],
    keywords: ['install', 'setup', 'start', 'begin', 'new', 'requirements', 'prerequisites'],
  },
  {
    id: 'app-spec-setup',
    title: 'App Spec & Project Setup',
    icon: FileText,
    subsections: [
      { id: 'what-is-app-spec', title: 'What is an App Spec?' },
      { id: 'creating-spec-with-claude', title: 'Creating a Spec with Claude' },
      { id: 'writing-spec-manually', title: 'Writing a Spec Manually' },
      { id: 'initializer-agent', title: 'The Initializer Agent' },
      { id: 'starting-after-spec', title: 'Starting After Spec Creation' },
    ],
    keywords: ['spec', 'specification', 'xml', 'app_spec', 'initializer', 'prompt', 'template'],
  },
  {
    id: 'project-structure',
    title: 'Target Project Structure',
    icon: FolderTree,
    subsections: [
      { id: 'autocoder-directory', title: '.autocoder/ Directory Layout' },
      { id: 'features-db', title: 'Features Database' },
      { id: 'prompts-directory', title: 'Prompts Directory' },
      { id: 'allowed-commands-yaml', title: 'Allowed Commands Config' },
      { id: 'claude-md', title: 'CLAUDE.md Convention' },
      { id: 'legacy-migration', title: 'Legacy Layout Migration' },
      { id: 'claude-inheritance', title: 'Claude Inheritance' },
    ],
    keywords: ['folder', 'directory', 'structure', 'layout', 'files', 'database', 'sqlite', 'migration'],
  },
  {
    id: 'features-kanban',
    title: 'Features & Kanban Board',
    icon: LayoutGrid,
    subsections: [
      { id: 'kanban-overview', title: 'Kanban Board Overview' },
      { id: 'feature-cards', title: 'Feature Cards' },
      { id: 'dependency-graph', title: 'Dependency Graph View' },
      { id: 'adding-features', title: 'Adding Features' },
      { id: 'editing-features', title: 'Editing & Deleting Features' },
      { id: 'feature-dependencies', title: 'Feature Dependencies' },
      { id: 'expanding-with-ai', title: 'Expanding Project with AI' },
      { id: 'feature-priority', title: 'Priority & Ordering' },
    ],
    keywords: ['kanban', 'board', 'feature', 'card', 'dependency', 'graph', 'priority', 'pending', 'progress', 'done'],
  },
  {
    id: 'agent-system',
    title: 'Agent System',
    icon: Bot,
    subsections: [
      { id: 'maestro-orchestrator', title: 'Maestro: The Orchestrator' },
      { id: 'coding-agents', title: 'Coding Agents' },
      { id: 'testing-agents', title: 'Testing Agents' },
      { id: 'agent-lifecycle', title: 'Agent Lifecycle' },
      { id: 'concurrency', title: 'Concurrency Control' },
      { id: 'mission-control', title: 'Agent Mission Control' },
      { id: 'agent-mascots', title: 'Agent Mascots & States' },
      { id: 'agent-logs', title: 'Viewing Agent Logs' },
      { id: 'process-limits', title: 'Process Limits' },
    ],
    keywords: ['agent', 'maestro', 'orchestrator', 'coding', 'testing', 'parallel', 'concurrency', 'mascot', 'spark', 'fizz', 'octo', 'batch'],
  },
  {
    id: 'settings-config',
    title: 'Settings & Configuration',
    icon: Settings,
    subsections: [
      { id: 'opening-settings', title: 'Opening Settings' },
      { id: 'yolo-mode', title: 'YOLO Mode' },
      { id: 'headless-browser', title: 'Headless Browser' },
      { id: 'model-selection', title: 'Model Selection' },
      { id: 'regression-agents', title: 'Regression Agents' },
      { id: 'features-per-agent', title: 'Features per Agent (Batch Size)' },
      { id: 'concurrency-setting', title: 'Concurrency' },
      { id: 'settings-persistence', title: 'How Settings are Persisted' },
    ],
    keywords: ['settings', 'config', 'yolo', 'headless', 'model', 'opus', 'sonnet', 'haiku', 'batch', 'regression'],
  },
  {
    id: 'developer-tools',
    title: 'Developer Tools',
    icon: Terminal,
    subsections: [
      { id: 'debug-panel', title: 'Debug Panel' },
      { id: 'agent-logs-tab', title: 'Agent Logs Tab' },
      { id: 'dev-server-logs', title: 'Dev Server Logs Tab' },
      { id: 'terminal', title: 'Terminal' },
      { id: 'dev-server-control', title: 'Dev Server Control' },
      { id: 'per-agent-logs', title: 'Per-Agent Logs' },
    ],
    keywords: ['debug', 'terminal', 'logs', 'dev server', 'console', 'xterm', 'shell'],
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    icon: MessageSquare,
    subsections: [
      { id: 'what-is-assistant', title: 'What is the Assistant?' },
      { id: 'opening-assistant', title: 'Opening the Assistant' },
      { id: 'assistant-capabilities', title: 'What It Can Do' },
      { id: 'assistant-limitations', title: 'What It Cannot Do' },
      { id: 'conversation-history', title: 'Conversation History' },
    ],
    keywords: ['assistant', 'ai', 'chat', 'help', 'question', 'conversation'],
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    icon: Clock,
    subsections: [
      { id: 'what-scheduling-does', title: 'What Scheduling Does' },
      { id: 'creating-schedule', title: 'Creating a Schedule' },
      { id: 'schedule-settings', title: 'Schedule Settings' },
      { id: 'schedule-overrides', title: 'Schedule Overrides' },
      { id: 'crash-recovery', title: 'Crash Recovery' },
    ],
    keywords: ['schedule', 'timer', 'automated', 'cron', 'run', 'recurring', 'utc'],
  },
  {
    id: 'appearance-themes',
    title: 'Appearance & Themes',
    icon: Palette,
    subsections: [
      { id: 'themes-overview', title: 'Themes Overview' },
      { id: 'dark-light-mode', title: 'Dark & Light Mode' },
      { id: 'theme-selector', title: 'Theme Selector' },
      { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts' },
    ],
    keywords: ['theme', 'dark', 'light', 'color', 'appearance', 'twitter', 'claude', 'neo', 'brutalism', 'retro', 'aurora', 'business', 'keyboard', 'shortcut'],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    subsections: [
      { id: 'command-validation', title: 'Command Validation Overview' },
      { id: 'command-hierarchy', title: 'Command Hierarchy' },
      { id: 'hardcoded-blocklist', title: 'Hardcoded Blocklist' },
      { id: 'global-allowlist', title: 'Global Allowlist' },
      { id: 'project-allowlist', title: 'Per-Project Allowed Commands' },
      { id: 'org-config', title: 'Organization Configuration' },
      { id: 'extra-read-paths', title: 'Extra Read Paths' },
      { id: 'filesystem-sandboxing', title: 'Filesystem Sandboxing' },
    ],
    keywords: ['security', 'sandbox', 'allowlist', 'blocklist', 'command', 'bash', 'permission', 'filesystem'],
  },
  {
    id: 'advanced-config',
    title: 'Advanced Configuration',
    icon: Wrench,
    subsections: [
      { id: 'vertex-ai', title: 'Vertex AI Setup' },
      { id: 'ollama', title: 'Ollama Local Models' },
      { id: 'env-variables', title: 'Environment Variables' },
      { id: 'cli-arguments', title: 'CLI Arguments' },
      { id: 'webhooks', title: 'Webhook Support' },
      { id: 'project-registry', title: 'Project Registry' },
    ],
    keywords: ['vertex', 'gcloud', 'ollama', 'local', 'env', 'environment', 'cli', 'webhook', 'n8n', 'registry', 'api'],
  },
  {
    id: 'faq',
    title: 'FAQ & Troubleshooting',
    icon: HelpCircle,
    subsections: [
      { id: 'faq-new-project', title: 'Starting a New Project' },
      { id: 'faq-existing-project', title: 'Adding to Existing Project' },
      { id: 'faq-agent-crash', title: 'Agent Crashes' },
      { id: 'faq-custom-commands', title: 'Custom Bash Commands' },
      { id: 'faq-blocked-features', title: 'Blocked Features' },
      { id: 'faq-parallel', title: 'Running in Parallel' },
      { id: 'faq-local-model', title: 'Using Local Models' },
      { id: 'faq-reset', title: 'Resetting a Project' },
      { id: 'faq-agent-types', title: 'Coding vs Testing Agents' },
      { id: 'faq-real-time', title: 'Monitoring in Real Time' },
    ],
    keywords: ['faq', 'troubleshoot', 'help', 'problem', 'issue', 'fix', 'error', 'stuck', 'reset', 'crash'],
  },
]
