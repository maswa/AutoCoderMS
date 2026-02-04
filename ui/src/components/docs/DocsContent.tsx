/**
 * DocsContent Component
 *
 * Renders all 13 documentation section components in order.
 * Uses IntersectionObserver to detect which section heading is currently
 * visible in the viewport, and notifies the parent so the sidebar
 * can highlight the active section.
 */

import { useEffect, useRef, useCallback } from 'react'
import { DOC_SECTIONS } from './docsData'
// Section components -- lazy-load candidates in the future, but imported
// statically for now to keep the build simple and deterministic.
import { GettingStarted } from './sections/GettingStarted'
import { AppSpecSetup } from './sections/AppSpecSetup'
import { ProjectStructure } from './sections/ProjectStructure'
import { FeaturesKanban } from './sections/FeaturesKanban'
import { AgentSystem } from './sections/AgentSystem'
import { SettingsConfig } from './sections/SettingsConfig'
import { DeveloperTools } from './sections/DeveloperTools'
import { AIAssistant } from './sections/AIAssistant'
import { Scheduling } from './sections/Scheduling'
import { AppearanceThemes } from './sections/AppearanceThemes'
import { Security } from './sections/Security'
import { AdvancedConfig } from './sections/AdvancedConfig'
import { FAQ } from './sections/FAQ'

interface DocsContentProps {
  activeSectionId: string | null
  onSectionVisible: (id: string) => void
}

/**
 * Maps each section id from docsData to its corresponding React component.
 * Order matches DOC_SECTIONS so we can iterate safely.
 */
const SECTION_COMPONENTS: Record<string, React.FC> = {
  'getting-started': GettingStarted,
  'app-spec-setup': AppSpecSetup,
  'project-structure': ProjectStructure,
  'features-kanban': FeaturesKanban,
  'agent-system': AgentSystem,
  'settings-config': SettingsConfig,
  'developer-tools': DeveloperTools,
  'ai-assistant': AIAssistant,
  scheduling: Scheduling,
  'appearance-themes': AppearanceThemes,
  security: Security,
  'advanced-config': AdvancedConfig,
  faq: FAQ,
}

export function DocsContent({ onSectionVisible }: DocsContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Store refs to each section heading element so the observer can watch them
  const headingRefs = useRef<Map<string, HTMLElement>>(new Map())

  // Stable callback ref setter -- avoids recreating refs on every render
  const setHeadingRef = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      headingRefs.current.set(id, element)
    } else {
      headingRefs.current.delete(id)
    }
  }, [])

  // IntersectionObserver: track which section heading is at or near the top of the viewport
  useEffect(() => {
    const headings = headingRefs.current
    if (headings.size === 0) return

    // rootMargin: trigger when a heading enters the top 20% of the viewport.
    // This ensures the sidebar updates *before* the user scrolls past the heading.
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading -- the one closest to the top of the viewport
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          const topEntry = visible[0]
          const sectionId = topEntry.target.getAttribute('data-section-id')
          if (sectionId) {
            onSectionVisible(sectionId)
          }
        }
      },
      {
        // Observe from the very top of the viewport down to -60% from the bottom,
        // so headings are detected while in the upper portion of the screen.
        rootMargin: '0px 0px -60% 0px',
        threshold: 0,
      },
    )

    headings.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [onSectionVisible])

  return (
    <div ref={containerRef} className="docs-prose">
      {DOC_SECTIONS.map((section) => {
        const SectionComponent = SECTION_COMPONENTS[section.id]
        if (!SectionComponent) return null

        const Icon = section.icon

        return (
          <div key={section.id} id={section.id} className="scroll-mt-24 mb-16">
            {/* Section heading with anchor */}
            <h2
              ref={(el) => setHeadingRef(section.id, el)}
              data-section-id={section.id}
              className="font-display text-2xl font-bold tracking-tight mb-6 flex items-center gap-3
                text-foreground border-b-2 border-border pb-3"
            >
              <Icon size={24} className="text-primary shrink-0" />
              {section.title}
            </h2>

            {/* Section body */}
            <SectionComponent />
          </div>
        )
      })}
    </div>
  )
}
