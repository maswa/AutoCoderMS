/**
 * DocsSearch Component
 *
 * Search input for the documentation sidebar.
 * Supports Ctrl/Cmd+K keyboard shortcut to focus,
 * and shows a keyboard hint when the input is empty.
 */

import { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface DocsSearchProps {
  value: string
  onChange: (value: string) => void
}

export function DocsSearch({ value, onChange }: DocsSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Global keyboard shortcut: Ctrl/Cmd+K focuses the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative">
      {/* Search icon */}
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search docs..."
        className="w-full pl-9 pr-16 py-2 text-sm bg-muted border border-border rounded-lg
          text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring
          transition-colors"
      />

      {/* Right side: clear button when has value, otherwise Ctrl+K hint */}
      {value ? (
        <button
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground
            hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      ) : (
        <kbd
          className="absolute right-3 top-1/2 -translate-y-1/2
            text-[10px] text-muted-foreground bg-background
            border border-border rounded px-1.5 py-0.5
            pointer-events-none select-none"
        >
          Ctrl+K
        </kbd>
      )}
    </div>
  )
}
