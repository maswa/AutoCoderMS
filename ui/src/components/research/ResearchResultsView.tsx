/**
 * ResearchResultsView Component
 *
 * Displays the generated documentation after a successful codebase analysis.
 * Shows summary stats, tabbed document viewer with markdown rendering, and action buttons.
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  FileText,
  Layers,
  Code2,
  BookOpen,
  Plug,
  AlertCircle,
  ArrowRight,
  FolderTree,
  Copy,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MarkdownViewer } from './MarkdownViewer'
import { BranchSelectionModal } from './BranchSelectionModal'
import { cn } from '@/lib/utils'
import type { ResearchDocsResponse } from '@/lib/types'

// ============================================================================
// Types
// ============================================================================

interface ResearchResultsViewProps {
  projectName: string
  onConvertToSpec: () => void
  onBack?: () => void
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Document tab configuration with icons and labels
 */
const DOC_TABS = [
  { filename: 'STACK.md', label: 'Stack', shortLabel: 'STACK', icon: Layers },
  { filename: 'ARCHITECTURE.md', label: 'Architecture', shortLabel: 'ARCH', icon: FolderTree },
  { filename: 'STRUCTURE.md', label: 'Structure', shortLabel: 'STRUCT', icon: Code2 },
  { filename: 'CONVENTIONS.md', label: 'Conventions', shortLabel: 'CONV', icon: BookOpen },
  { filename: 'INTEGRATIONS.md', label: 'Integrations', shortLabel: 'INTEG', icon: Plug },
] as const

// ============================================================================
// API
// ============================================================================

async function fetchResearchDocs(projectName: string): Promise<ResearchDocsResponse> {
  const response = await fetch(`/api/projects/${encodeURIComponent(projectName)}/research-docs`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Research documentation not found. Run analysis first.')
    }
    throw new Error(`Failed to fetch research docs: ${response.statusText}`)
  }
  return response.json()
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Loading skeleton for the document viewer
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary card skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-lg" />
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="h-10 bg-muted rounded-lg w-full max-w-2xl" />

      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
        <div className="h-32 bg-muted rounded mt-4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </div>
  )
}

/**
 * Summary statistics card
 */
interface SummaryStatProps {
  icon: React.ElementType
  label: string
  value: string | number
  variant?: 'default' | 'primary'
}

function SummaryStat({ icon: Icon, label, value, variant = 'default' }: SummaryStatProps) {
  return (
    <Card className={cn(
      'py-4',
      variant === 'primary' && 'border-primary/50 bg-primary/5'
    )}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn(
          'p-2 rounded-lg',
          variant === 'primary' ? 'bg-primary/10 text-primary' : 'bg-muted'
        )}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-2xl font-bold tabular-nums">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Empty state when no documents are found
 */
function EmptyState({ onBack }: { onBack?: () => void }) {
  return (
    <Card className="py-12">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <FileText size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Documentation Found</h3>
        <p className="text-muted-foreground max-w-md mb-4">
          The codebase analysis has not generated any documentation yet.
          Run the analysis first to generate the documentation.
        </p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Project
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * ResearchResultsView displays the results of codebase analysis
 * with tabbed navigation for different documentation sections.
 */
export function ResearchResultsView({
  projectName,
  onConvertToSpec,
  onBack,
}: ResearchResultsViewProps) {
  const [activeTab, setActiveTab] = useState<string>(DOC_TABS[0].filename)
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null)
  const [showBranchModal, setShowBranchModal] = useState(false)

  // Handle the convert button click - show branch selection first
  const handleConvertClick = () => {
    setShowBranchModal(true)
  }

  // Handle branch selection completion
  const handleBranchSelected = () => {
    setShowBranchModal(false)
    // Proceed with conversion after branch is selected
    onConvertToSpec()
  }

  // Fetch research documents
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['research-docs', projectName],
    queryFn: () => fetchResearchDocs(projectName),
    staleTime: 60000, // Cache for 1 minute
    retry: 2,
  })

  // Copy document content to clipboard
  const handleCopy = async (filename: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedDoc(filename)
      setTimeout(() => setCopiedDoc(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Extract stats from the markdown content for the summary
  const extractStats = () => {
    let techCount = 0
    let fileCount = 0
    let integrationCount = 0

    const stackDoc = data?.docs.find((doc) => doc.filename === 'STACK.md')
    const structureDoc = data?.docs.find((doc) => doc.filename === 'STRUCTURE.md')
    const integrationsDoc = data?.docs.find((doc) => doc.filename === 'INTEGRATIONS.md')

    if (stackDoc?.content) {
      // Count items in lists after "Primary Technologies" or similar headers
      const techMatches = stackDoc.content.match(/^[-*]\s+\*\*[^*]+\*\*/gm)
      techCount = techMatches?.length || 0
    }

    if (structureDoc?.content) {
      // Count directory entries
      const dirMatches = structureDoc.content.match(/^[-*]\s+`[^`]+`/gm)
      fileCount = dirMatches?.length || 0
    }

    if (integrationsDoc?.content) {
      // Count h2 headers as integrations
      const integrationMatches = integrationsDoc.content.match(/^##\s+/gm)
      integrationCount = integrationMatches?.length || 0
    }

    return { techCount, fileCount, integrationCount }
  }

  const stats = data?.docs ? extractStats() : { techCount: 0, fileCount: 0, integrationCount: 0 }

  // Format generation timestamp
  const generatedAt = data?.generated_at
    ? new Date(data.generated_at * 1000)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft size={20} />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Codebase Analysis</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Documentation for</span>
              <Badge variant="secondary">{projectName}</Badge>
              {generatedAt && (
                <span className="text-xs">
                  ({generatedAt.toLocaleDateString()} at {generatedAt.toLocaleTimeString()})
                </span>
              )}
            </div>
          </div>
        </div>

        <Button onClick={handleConvertClick} className="gap-2">
          Convert to AutoCoder Spec
          <ArrowRight size={16} />
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Error State */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            {error instanceof Error ? error.message : 'Failed to load research documents'}
            <Button variant="link" onClick={() => refetch()} className="p-0 h-auto">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {data && data.docs.length === 0 && <EmptyState onBack={onBack} />}

      {/* Main Content */}
      {data && data.docs.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryStat
              icon={FileText}
              label="Documents"
              value={data.docs.length}
              variant="primary"
            />
            <SummaryStat
              icon={Layers}
              label="Technologies"
              value={stats.techCount || '-'}
            />
            <SummaryStat
              icon={Code2}
              label="Directories"
              value={stats.fileCount || '-'}
            />
            <SummaryStat
              icon={Plug}
              label="Integrations"
              value={stats.integrationCount || '-'}
            />
          </div>

          {/* Tabbed Document Viewer */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Generated Documentation</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList variant="line" className="w-full justify-start border-b border-border pb-0 mb-4 overflow-x-auto">
                  {DOC_TABS.map((tab) => {
                    const docExists = data.docs.some((d) => d.filename === tab.filename)
                    const Icon = tab.icon
                    return (
                      <TabsTrigger
                        key={tab.filename}
                        value={tab.filename}
                        disabled={!docExists}
                        className={cn(
                          'gap-1.5 whitespace-nowrap',
                          !docExists && 'opacity-50'
                        )}
                      >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.shortLabel}</span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {DOC_TABS.map((tab) => {
                  const doc = data.docs.find((d) => d.filename === tab.filename)
                  return (
                    <TabsContent key={tab.filename} value={tab.filename}>
                      {/* Copy button */}
                      {doc && (
                        <div className="flex justify-end mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(tab.filename, doc.content)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copiedDoc === tab.filename ? (
                              <>
                                <Check className="size-4 mr-2 text-primary" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="size-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      <ScrollArea className="h-[60vh] pr-4">
                        {doc?.content ? (
                          <MarkdownViewer content={doc.content} />
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <FileText size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No content available for this document.</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </CardContent>
          </Card>

          {/* Bottom CTA */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Ready to start coding?</h3>
                <p className="text-muted-foreground">
                  Convert this analysis into an AutoCoder specification to begin autonomous development.
                </p>
              </div>
              <Button onClick={handleConvertClick} size="lg" className="gap-2 shrink-0">
                Convert to Spec
                <ArrowRight size={18} />
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Back to Projects Link */}
      {onBack && (
        <div className="text-center">
          <Button variant="link" onClick={onBack} className="gap-2">
            <ArrowLeft size={16} />
            Back to Projects
          </Button>
        </div>
      )}

      {/* Branch Selection Modal */}
      <BranchSelectionModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        projectName={projectName}
        onBranchSelected={handleBranchSelected}
      />
    </div>
  )
}
