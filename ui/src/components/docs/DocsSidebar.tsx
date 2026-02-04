/**
 * DocsSidebar Component
 *
 * Left sidebar navigation for the documentation page.
 * Lists all sections from docsData with expandable subsections.
 * Supports search filtering with auto-expansion of matching sections.
 */

import { useState, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { DOC_SECTIONS, type DocSection } from './docsData'

interface DocsSidebarProps {
  activeSectionId: string | null
  onSectionClick: (id: string) => void
  searchQuery: string
  onMobileClose?: () => void
}

export function DocsSidebar({
  activeSectionId,
  onSectionClick,
  searchQuery,
  onMobileClose,
}: DocsSidebarProps) {
  // Track which top-level sections are manually expanded by the user
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // Start with the first section expanded so the sidebar is not fully collapsed
    const initial = new Set<string>()
    if (DOC_SECTIONS.length > 0) {
      initial.add(DOC_SECTIONS[0].id)
    }
    return initial
  })

  const normalizedQuery = searchQuery.trim().toLowerCase()

  // Filter sections based on search query, matching against section title,
  // subsection titles, and keywords
  const filteredSections = useMemo(() => {
    if (!normalizedQuery) {
      return DOC_SECTIONS
    }

    return DOC_SECTIONS.filter((section) => {
      // Check section title
      if (section.title.toLowerCase().includes(normalizedQuery)) return true

      // Check keywords
      if (section.keywords.some((kw) => kw.toLowerCase().includes(normalizedQuery))) return true

      // Check subsection titles
      if (section.subsections.some((sub) => sub.title.toLowerCase().includes(normalizedQuery))) {
        return true
      }

      return false
    })
  }, [normalizedQuery])

  // Determine which sections should appear expanded:
  // - When searching: auto-expand all matching sections
  // - Otherwise: use manual expanded state, plus expand whichever section contains the active item
  const isSectionExpanded = (sectionId: string): boolean => {
    if (normalizedQuery) return true

    if (expandedSections.has(sectionId)) return true

    // Also expand the section that contains the currently active subsection
    if (activeSectionId) {
      const section = DOC_SECTIONS.find((s) => s.id === sectionId)
      if (section) {
        if (section.id === activeSectionId) return true
        if (section.subsections.some((sub) => sub.id === activeSectionId)) return true
      }
    }

    return false
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  /**
   * Checks whether a given id (section or subsection) is the currently active item.
   * Active items get a highlighted visual treatment.
   */
  const isActive = (id: string): boolean => activeSectionId === id

  /**
   * Checks whether a section contains the active subsection.
   * Used to highlight parent sections in a muted way.
   */
  const sectionContainsActive = (section: DocSection): boolean => {
    if (!activeSectionId) return false
    return section.subsections.some((sub) => sub.id === activeSectionId)
  }

  const handleItemClick = (id: string) => {
    onSectionClick(id)
    // On mobile, close the sidebar after navigation
    onMobileClose?.()
  }

  return (
    <nav aria-label="Documentation navigation" className="space-y-1">
      {filteredSections.map((section) => {
        const Icon = section.icon
        const expanded = isSectionExpanded(section.id)
        const active = isActive(section.id)
        const containsActive = sectionContainsActive(section)

        return (
          <div key={section.id}>
            {/* Section header (clickable to expand/collapse and navigate) */}
            <button
              onClick={() => {
                toggleSection(section.id)
                handleItemClick(section.id)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md
                transition-colors cursor-pointer group
                ${active
                  ? 'bg-primary/10 border-l-2 border-primary text-foreground font-semibold'
                  : containsActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              aria-expanded={expanded}
            >
              <Icon
                size={16}
                className={`shrink-0 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
              />

              <span className="flex-1 text-left truncate">{section.title}</span>

              <ChevronRight
                size={14}
                className={`shrink-0 text-muted-foreground transition-transform duration-200
                  ${expanded ? 'rotate-90' : ''}`}
              />
            </button>

            {/* Subsections (shown when expanded) */}
            {expanded && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border animate-slide-in-down">
                {section.subsections.map((sub) => {
                  const subActive = isActive(sub.id)

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleItemClick(sub.id)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-r-md
                        transition-colors cursor-pointer
                        ${subActive
                          ? 'bg-primary/10 border-l-2 border-primary text-foreground font-medium -ml-px'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      {sub.title}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* No results message when search filters everything out */}
      {normalizedQuery && filteredSections.length === 0 && (
        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
          No sections match &ldquo;{searchQuery}&rdquo;
        </div>
      )}
    </nav>
  )
}
