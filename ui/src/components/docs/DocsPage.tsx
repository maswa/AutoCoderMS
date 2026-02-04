/**
 * DocsPage Component
 *
 * Main layout for the documentation route (#/docs).
 * Full-page layout with a sticky header, collapsible sidebar on the left,
 * and scrollable content area on the right.
 *
 * Mobile-responsive: sidebar collapses behind a hamburger menu that
 * opens as an overlay.
 */

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Menu, X, Moon, Sun } from 'lucide-react'
import { useHashRoute } from '../../hooks/useHashRoute'
import { useTheme } from '../../hooks/useTheme'
import { ThemeSelector } from '../ThemeSelector'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DocsSidebar } from './DocsSidebar'
import { DocsSearch } from './DocsSearch'
import { DocsContent } from './DocsContent'

export function DocsPage() {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const { section: initialSection } = useHashRoute()
  const { theme, setTheme, darkMode, toggleDarkMode, themes } = useTheme()

  // On mount, if the hash includes a section id (e.g. #/docs/getting-started),
  // scroll to it and set it as active
  useEffect(() => {
    if (initialSection) {
      setActiveSectionId(initialSection)
      // Delay scroll slightly so the DOM is rendered
      requestAnimationFrame(() => {
        const element = document.getElementById(initialSection)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only on mount

  // When a sidebar item is clicked, scroll the corresponding element into view
  const handleSectionClick = useCallback((id: string) => {
    setActiveSectionId(id)

    // Update hash for linkability (without triggering a route change)
    history.replaceState(null, '', `#/docs/${id}`)

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Called by DocsContent's IntersectionObserver when a heading scrolls into view
  const handleSectionVisible = useCallback((id: string) => {
    setActiveSectionId(id)
  }, [])

  // Close mobile sidebar when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileSidebarOpen])

  // Prevent body scroll when mobile sidebar overlay is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileSidebarOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md text-foreground border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side: hamburger (mobile) + title + badge */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger button -- only visible below lg breakpoint */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                aria-label={mobileSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>

              <a
                href="#/"
                className="font-display text-xl font-bold tracking-tight uppercase text-foreground
                  hover:text-primary transition-colors"
              >
                AutoCoder
              </a>

              <Badge variant="secondary" className="text-xs font-medium">
                Documentation
              </Badge>
            </div>

            {/* Right side: theme controls + back button */}
            <div className="flex items-center gap-2">
              <ThemeSelector
                themes={themes}
                currentTheme={theme}
                onThemeChange={setTheme}
              />

              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                title="Toggle dark mode"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="#/" className="inline-flex items-center gap-1.5">
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Back to App</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="max-w-7xl mx-auto flex">
        {/* ----------------------------------------------------------------
            Desktop sidebar -- visible at lg and above
            Fixed width, sticky below the header, independently scrollable
           ---------------------------------------------------------------- */}
        <aside
          className="hidden lg:block w-[280px] shrink-0 sticky top-[57px] h-[calc(100vh-57px)]
            overflow-y-auto border-r border-border p-4 space-y-4"
        >
          <DocsSearch value={searchQuery} onChange={setSearchQuery} />
          <DocsSidebar
            activeSectionId={activeSectionId}
            onSectionClick={handleSectionClick}
            searchQuery={searchQuery}
          />
        </aside>

        {/* ----------------------------------------------------------------
            Mobile sidebar overlay -- visible below lg breakpoint
           ---------------------------------------------------------------- */}
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar panel */}
            <aside
              className="fixed top-[57px] left-0 z-50 w-[280px] h-[calc(100vh-57px)]
                overflow-y-auto bg-card border-r-2 border-border p-4 space-y-4
                animate-slide-in lg:hidden"
            >
              <DocsSearch value={searchQuery} onChange={setSearchQuery} />
              <DocsSidebar
                activeSectionId={activeSectionId}
                onSectionClick={handleSectionClick}
                searchQuery={searchQuery}
                onMobileClose={() => setMobileSidebarOpen(false)}
              />
            </aside>
          </>
        )}

        {/* ----------------------------------------------------------------
            Content area -- fills remaining space, scrollable
           ---------------------------------------------------------------- */}
        <main className="flex-1 min-w-0 px-6 py-8 lg:px-10">
          <div className="max-w-[65ch] mx-auto">
            <DocsContent
              activeSectionId={activeSectionId}
              onSectionVisible={handleSectionVisible}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
