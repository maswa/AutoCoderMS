/**
 * FeaturesKanban Documentation Section
 *
 * Covers the Kanban board, feature cards, dependency graph view,
 * adding/editing features, dependencies, expanding with AI,
 * and priority ordering.
 */

import { Badge } from '@/components/ui/badge'

export function FeaturesKanban() {
  return (
    <div>
      {/* Kanban Board Overview */}
      <h3 id="kanban-overview" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Kanban Board Overview
      </h3>
      <p className="text-muted-foreground mb-3">
        The main view organizes features into three columns representing their current status:
      </p>
      <table className="w-full text-sm mt-3 mb-4">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Column
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Color
            </th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              Meaning
            </th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr>
            <td className="border border-border px-3 py-2 font-medium">Pending</td>
            <td className="border border-border px-3 py-2">
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">Yellow</Badge>
            </td>
            <td className="border border-border px-3 py-2">Waiting to be picked up</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2 font-medium">In Progress</td>
            <td className="border border-border px-3 py-2">
              <Badge variant="outline" className="border-cyan-500 text-cyan-600">Cyan</Badge>
            </td>
            <td className="border border-border px-3 py-2">An agent is actively working on it</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2 font-medium">Done</td>
            <td className="border border-border px-3 py-2">
              <Badge variant="outline" className="border-green-500 text-green-600">Green</Badge>
            </td>
            <td className="border border-border px-3 py-2">Implemented and passing</td>
          </tr>
        </tbody>
      </table>
      <p className="text-muted-foreground">
        Each feature appears as a card showing its name, priority, and category. The board updates
        in real time as agents work.
      </p>

      {/* Feature Cards */}
      <h3 id="feature-cards" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Feature Cards
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Each card displays a priority badge (<Badge variant="secondary">P1</Badge> through{' '}
          <Badge variant="secondary">P5</Badge>), a category tag, and the feature name
        </li>
        <li>Status icons indicate the current state of the feature</li>
        <li>Click a card to open the detail modal with the full description and test steps</li>
        <li>
          Cards in the &quot;In Progress&quot; column show which agent is currently working on them
        </li>
      </ul>

      {/* Dependency Graph View */}
      <h3 id="dependency-graph" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Dependency Graph View
      </h3>
      <p className="text-muted-foreground mb-3">
        An alternative to the Kanban board that visualizes feature relationships as a directed graph.
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Press <Badge variant="secondary">G</Badge> to toggle between Kanban and Graph view
        </li>
        <li>Uses the dagre layout engine for automatic node positioning</li>
        <li>
          Nodes are colored by status &mdash; pending, in-progress, and done each have
          distinct colors
        </li>
        <li>Arrows show dependency relationships between features</li>
        <li>Click any node to open the feature detail modal</li>
        <li>Supports both horizontal and vertical layout orientations</li>
      </ul>

      {/* Adding Features */}
      <h3 id="adding-features" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Adding Features
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Press <Badge variant="secondary">N</Badge> to open the Add Feature form
        </li>
        <li>Fill in: name, description, category, and priority</li>
        <li>Optionally define steps (test criteria the agent must pass to complete the feature)</li>
        <li>New features are added to the Pending column immediately</li>
      </ul>

      {/* Editing & Deleting Features */}
      <h3 id="editing-features" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Editing &amp; Deleting Features
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Click a feature card to open the detail modal</li>
        <li>
          Click <strong className="text-foreground">Edit</strong> to modify the name, description,
          category, priority, or steps
        </li>
        <li>
          <strong className="text-foreground">Delete</strong> removes the feature permanently
        </li>
        <li>
          <strong className="text-foreground">Skip</strong> moves a feature to the end of the queue
          without deleting it
        </li>
      </ul>

      {/* Feature Dependencies */}
      <h3 id="feature-dependencies" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Feature Dependencies
      </h3>
      <p className="text-muted-foreground mb-3">
        Features can declare dependencies on other features, ensuring they are implemented in the
        correct order.
      </p>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Set dependencies in the feature edit modal</li>
        <li>
          Cycle detection prevents circular dependencies (uses Kahn&apos;s algorithm combined
          with DFS)
        </li>
        <li>
          Blocked features display a lock icon and cannot be claimed by agents until their
          dependencies are met
        </li>
        <li>The Dependency Graph view makes these relationships easy to visualize</li>
      </ul>

      {/* Expanding Project with AI */}
      <h3 id="expanding-with-ai" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Expanding Project with AI
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Press <Badge variant="secondary">E</Badge> to open the Expand Project modal
        </li>
        <li>Chat with Claude to describe the new features you want to add</li>
        <li>Supports image attachments for UI mockups or design references</li>
        <li>Claude creates properly structured features with appropriate dependencies</li>
        <li>New features appear on the board immediately after creation</li>
      </ul>

      {/* Priority & Ordering */}
      <h3 id="feature-priority" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Priority &amp; Ordering
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>
          Features are ordered by priority: <Badge variant="secondary">P1</Badge> is the highest
          and <Badge variant="secondary">P5</Badge> is the lowest
        </li>
        <li>Within the same priority level, features are ordered by creation time</li>
        <li>Agents always pick up the highest-priority ready feature first</li>
      </ul>
    </div>
  )
}
