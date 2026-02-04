/**
 * AIAssistant Documentation Section
 *
 * Covers the project assistant: what it is, how to open it,
 * its capabilities and limitations, and conversation history.
 */

import { Badge } from '@/components/ui/badge'

export function AIAssistant() {
  return (
    <div>
      {/* What is the Assistant? */}
      <h3 id="what-is-assistant" className="text-lg font-semibold text-foreground mt-8 mb-3">
        What is the Assistant?
      </h3>
      <p className="text-muted-foreground mb-4">
        The AI Assistant is a read-only project helper that can answer questions about your project, search
        code, view progress, and help you understand what&rsquo;s happening &mdash; without making any changes.
      </p>

      {/* Opening the Assistant */}
      <h3 id="opening-assistant" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Opening the Assistant
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Press <Badge variant="secondary">A</Badge> to toggle the assistant panel
        </li>
        <li>Or click the floating action button (chat bubble) in the bottom-right corner</li>
        <li>The panel slides in from the right side</li>
      </ul>

      {/* What It Can Do */}
      <h3 id="assistant-capabilities" className="text-lg font-semibold text-foreground mt-8 mb-3">
        What It Can Do
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Read and search your project&rsquo;s source code</li>
        <li>Answer questions about code architecture and implementation</li>
        <li>View feature progress and status</li>
        <li>Create new features based on your description</li>
        <li>Explain what agents have done or are currently doing</li>
        <li>Help debug issues by analyzing code and logs</li>
      </ul>

      {/* What It Cannot Do */}
      <h3 id="assistant-limitations" className="text-lg font-semibold text-foreground mt-8 mb-3">
        What It Cannot Do
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Modify files (read-only access)</li>
        <li>Run bash commands</li>
        <li>Mark features as passing/failing</li>
        <li>Start or stop agents</li>
        <li>Access external APIs or the internet</li>
      </ul>
      <div className="border-l-4 border-primary pl-4 italic text-muted-foreground mt-4">
        This is a deliberate security design &mdash; the assistant is a safe way to interact with your project
        without risk of unintended changes.
      </div>

      {/* Conversation History */}
      <h3 id="conversation-history" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Conversation History
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Conversations are stored per-project in SQLite database</li>
        <li>Multiple conversations supported &mdash; start new ones as needed</li>
        <li>Switch between conversations using the conversation selector</li>
        <li>History persists across browser sessions</li>
      </ul>
    </div>
  )
}
