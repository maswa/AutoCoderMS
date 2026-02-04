/**
 * AppearanceThemes Documentation Section
 *
 * Covers built-in themes with color previews, dark/light mode toggling,
 * the theme selector dropdown, and global keyboard shortcuts.
 */

import { Badge } from '@/components/ui/badge'

/** Theme descriptor used to render the preview rows. */
interface ThemePreview {
  name: string
  description: string
  colors: { label: string; hex: string }[]
}

const THEMES: ThemePreview[] = [
  {
    name: 'Twitter',
    description: 'Clean, modern blue design. Primary: blue, Background: white/dark gray.',
    colors: [
      { label: 'Background', hex: '#ffffff' },
      { label: 'Primary', hex: '#4a9eff' },
      { label: 'Accent', hex: '#e8f4ff' },
    ],
  },
  {
    name: 'Claude',
    description: "Warm beige/cream tones with orange accents. Inspired by Anthropic's Claude brand.",
    colors: [
      { label: 'Background', hex: '#faf6f0' },
      { label: 'Primary', hex: '#c75b2a' },
      { label: 'Accent', hex: '#f5ede4' },
    ],
  },
  {
    name: 'Neo Brutalism',
    description: 'Bold colors, hard shadows, no border radius. High contrast, expressive design.',
    colors: [
      { label: 'Background', hex: '#ffffff' },
      { label: 'Primary', hex: '#ff4d00' },
      { label: 'Accent', hex: '#ffeb00' },
    ],
  },
  {
    name: 'Retro Arcade',
    description: 'Vibrant pink and teal with pixel-art inspired styling.',
    colors: [
      { label: 'Background', hex: '#f0e6d3' },
      { label: 'Primary', hex: '#e8457c' },
      { label: 'Accent', hex: '#4eb8a5' },
    ],
  },
  {
    name: 'Aurora',
    description: 'Deep violet and luminous teal, inspired by the northern lights.',
    colors: [
      { label: 'Background', hex: '#faf8ff' },
      { label: 'Primary', hex: '#8b5cf6' },
      { label: 'Accent', hex: '#2dd4bf' },
    ],
  },
  {
    name: 'Business',
    description: 'Professional deep navy and gray monochrome palette for corporate use.',
    colors: [
      { label: 'Background', hex: '#eaecef' },
      { label: 'Primary', hex: '#000e4e' },
      { label: 'Accent', hex: '#6b7280' },
    ],
  },
]

/** Keyboard shortcut descriptor for the shortcuts table. */
interface Shortcut {
  key: string
  action: string
}

const SHORTCUTS: Shortcut[] = [
  { key: '?', action: 'Show keyboard shortcuts help' },
  { key: 'D', action: 'Toggle debug panel' },
  { key: 'T', action: 'Toggle terminal' },
  { key: 'G', action: 'Toggle Kanban/Graph view' },
  { key: 'N', action: 'Add new feature' },
  { key: 'E', action: 'Expand project with AI' },
  { key: 'A', action: 'Toggle AI assistant' },
  { key: ',', action: 'Open settings' },
  { key: 'R', action: 'Reset project' },
  { key: 'Escape', action: 'Close current modal' },
]

export function AppearanceThemes() {
  return (
    <div>
      {/* Themes Overview */}
      <h3 id="themes-overview" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Themes Overview
      </h3>
      <p className="text-muted-foreground mb-4">
        AutoCoder comes with 6 built-in themes. Each theme provides a complete visual identity including
        colors, accents, and dark mode variants.
      </p>
      <div className="space-y-4">
        {THEMES.map((theme) => (
          <div key={theme.name} className="flex items-start gap-4">
            {/* Color swatches */}
            <div className="flex gap-1.5 shrink-0 mt-1">
              {theme.colors.map((color) => (
                <div
                  key={color.label}
                  title={`${color.label}: ${color.hex}`}
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
            {/* Description */}
            <div>
              <strong className="text-foreground">{theme.name}</strong>
              {theme.name === 'Twitter' && (
                <>
                  {' '}
                  <Badge variant="secondary">Default</Badge>
                </>
              )}
              <span className="text-muted-foreground"> &mdash; {theme.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dark & Light Mode */}
      <h3 id="dark-light-mode" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Dark &amp; Light Mode
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Toggle with the sun/moon icon in the header</li>
        <li>All 6 themes have dedicated dark mode variants</li>
        <li>
          Preference is saved in browser{' '}
          <span className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">localStorage</span>
        </li>
        <li>Dark mode affects all UI elements including the docs page</li>
      </ul>

      {/* Theme Selector */}
      <h3 id="theme-selector" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Theme Selector
      </h3>
      <ul className="list-disc space-y-2 ml-4 text-muted-foreground">
        <li>Hover over the palette icon in the header to open the theme dropdown</li>
        <li>Preview themes by hovering over each option (live preview)</li>
        <li>Click to select &mdash; the change is applied instantly</li>
        <li>Theme preference persists across sessions</li>
      </ul>

      {/* Keyboard Shortcuts */}
      <h3 id="keyboard-shortcuts" className="text-lg font-semibold text-foreground mt-8 mb-3">
        Keyboard Shortcuts
      </h3>
      <p className="text-muted-foreground mb-3">
        Press <Badge variant="secondary">?</Badge> anywhere in the UI to see the shortcuts help overlay.
      </p>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="bg-muted/50">
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">Key</th>
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">Action</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          {SHORTCUTS.map((shortcut) => (
            <tr key={shortcut.key}>
              <td className="border border-border px-3 py-2">
                <Badge variant="secondary">{shortcut.key}</Badge>
              </td>
              <td className="border border-border px-3 py-2">{shortcut.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
