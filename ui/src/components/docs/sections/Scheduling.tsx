/**
 * Scheduling Documentation Section
 *
 * Covers schedule creation, per-schedule settings,
 * overrides, and crash recovery with exponential backoff.
 */

import { Badge } from '@/components/ui/badge'

export function Scheduling() {
  return (
    <div>
      {/* What Scheduling Does */}
      <h3 id="what-scheduling-does" className="text-lg font-semibold text-foreground mt-8 mb-3">
        What Scheduling Does
      </h3>
      <p className="text-muted-foreground mb-4">
        Scheduling automates agent runs at specific times. Set up a schedule and AutoCoder will automatically
        start agents on your project &mdash; useful for overnight builds, periodic maintenance, or continuous
        development.
      </p>

      {/* Creating a Schedule */}
      <h3 id="creating-schedule" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Creating a Schedule
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Click the clock icon in the header to open the Schedule modal</li>
        <li>Set: start time, duration (how long agents run), days of the week</li>
        <li>Optionally configure: YOLO mode, concurrency, model selection</li>
        <li>Schedule is saved and starts at the next matching time</li>
      </ul>

      {/* Schedule Settings */}
      <h3 id="schedule-settings" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Schedule Settings
      </h3>
      <p className="text-muted-foreground mb-3">
        Each schedule can override global settings:
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">Setting</th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">Details</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr>
            <td className="border border-border px-3 py-2">YOLO mode</td>
            <td className="border border-border px-3 py-2">On/off per schedule</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Concurrency</td>
            <td className="border border-border px-3 py-2">
              <Badge variant="secondary">1&ndash;5</Badge> agents
            </td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Model tier</td>
            <td className="border border-border px-3 py-2">Opus / Sonnet / Haiku</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2">Duration</td>
            <td className="border border-border px-3 py-2">How long the session runs before auto-stopping</td>
          </tr>
        </tbody>
      </table>
      <div className="border-l-4 border-primary pl-4 italic text-muted-foreground mt-4">
        All schedule times are in UTC timezone.
      </div>

      {/* Schedule Overrides */}
      <h3 id="schedule-overrides" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Schedule Overrides
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Manually skip a scheduled run (one-time override)</li>
        <li>Pause a schedule temporarily (resumes on next period)</li>
        <li>
          View upcoming runs with{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">Running until</span> /{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">Next run</span> indicators
        </li>
        <li>Override without deleting the schedule</li>
      </ul>

      {/* Crash Recovery */}
      <h3 id="crash-recovery" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Crash Recovery
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>If a scheduled agent crashes, it uses exponential backoff for retries</li>
        <li>
          Maximum <Badge variant="secondary">3</Badge> retry attempts per scheduled run
        </li>
        <li>Backoff prevents rapid restart loops</li>
        <li>Failed runs are logged for troubleshooting</li>
      </ul>
    </div>
  )
}
