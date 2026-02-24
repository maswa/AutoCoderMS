import { useState } from 'react'
import { Globe, Square, Loader2, ExternalLink, AlertTriangle, Settings2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DevServerStatus } from '../lib/types'
import { startDevServer, stopDevServer } from '../lib/api'
import { Button } from '@/components/ui/button'
import { DevServerConfigDialog } from './DevServerConfigDialog'

// Re-export DevServerStatus from lib/types for consumers that import from here
export type { DevServerStatus }

// ============================================================================
// React Query Hooks (Internal)
// ============================================================================

/**
 * Internal hook to start the dev server for a project.
 * Invalidates the dev-server-status query on success.
 */
function useStartDevServer(projectName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => startDevServer(projectName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dev-server-status', projectName] })
    },
  })
}

/**
 * Internal hook to stop the dev server for a project.
 * Invalidates the dev-server-status query on success.
 */
function useStopDevServer(projectName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => stopDevServer(projectName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dev-server-status', projectName] })
    },
  })
}

// ============================================================================
// Component
// ============================================================================

interface DevServerControlProps {
  projectName: string
  status: DevServerStatus
  url: string | null
}

/**
 * DevServerControl provides start/stop controls for a project's development server.
 *
 * Features:
 * - Toggle button to start/stop the dev server
 * - Shows loading state during operations
 * - Displays clickable URL when server is running
 * - Uses neobrutalism design with cyan accent when running
 * - Config dialog for setting custom dev commands
 */
export function DevServerControl({ projectName, status, url }: DevServerControlProps) {
  const startDevServerMutation = useStartDevServer(projectName)
  const stopDevServerMutation = useStopDevServer(projectName)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [autoStartOnSave, setAutoStartOnSave] = useState(false)

  const isLoading = startDevServerMutation.isPending || stopDevServerMutation.isPending

  const handleStart = () => {
    // Clear any previous errors before starting
    stopDevServerMutation.reset()
    startDevServerMutation.mutate(undefined, {
      onError: (err) => {
        if (err.message?.includes('No dev command available')) {
          setAutoStartOnSave(true)
          setShowConfigDialog(true)
        }
      },
    })
  }
  const handleStop = () => {
    // Clear any previous errors before stopping
    startDevServerMutation.reset()
    stopDevServerMutation.mutate()
  }

  const handleOpenConfig = () => {
    setAutoStartOnSave(false)
    setShowConfigDialog(true)
  }

  const handleCloseConfig = () => {
    setShowConfigDialog(false)
    // Clear the start error if config dialog was opened reactively
    if (startDevServerMutation.error?.message?.includes('No dev command available')) {
      startDevServerMutation.reset()
    }
  }

  // Server is stopped when status is 'stopped' or 'crashed' (can restart)
  const isStopped = status === 'stopped' || status === 'crashed'
  // Server is in a running state
  const isRunning = status === 'running'
  // Server has crashed
  const isCrashed = status === 'crashed'

  // Hide inline error when config dialog is handling it
  const startError = startDevServerMutation.error
  const showInlineError = startError && !startError.message?.includes('No dev command available')

  return (
    <div className="flex items-center gap-2">
      {isStopped ? (
        <>
          <Button
            onClick={handleStart}
            disabled={isLoading}
            variant={isCrashed ? "destructive" : "outline"}
            size="sm"
            title={isCrashed ? "Dev Server Crashed - Click to Restart" : "Start Dev Server"}
            aria-label={isCrashed ? "Restart Dev Server (crashed)" : "Start Dev Server"}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isCrashed ? (
              <AlertTriangle size={18} />
            ) : (
              <Globe size={18} />
            )}
          </Button>
          <Button
            onClick={handleOpenConfig}
            variant="ghost"
            size="sm"
            title="Configure Dev Server"
            aria-label="Configure Dev Server"
          >
            <Settings2 size={16} />
          </Button>
        </>
      ) : (
        <Button
          onClick={handleStop}
          disabled={isLoading}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          title="Stop Dev Server"
          aria-label="Stop Dev Server"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Square size={18} />
          )}
        </Button>
      )}

      {/* Show URL as clickable link when server is running */}
      {isRunning && url && (
        <Button
          asChild
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${url} in new tab`}
          >
            <span className="font-mono text-xs">{url}</span>
            <ExternalLink size={14} />
          </a>
        </Button>
      )}

      {/* Error display (hide "no dev command" error when config dialog handles it) */}
      {(showInlineError || stopDevServerMutation.error) && (
        <span className="text-xs font-mono text-destructive ml-2">
          {String((showInlineError ? startError : stopDevServerMutation.error)?.message || 'Operation failed')}
        </span>
      )}

      {/* Dev Server Config Dialog */}
      <DevServerConfigDialog
        projectName={projectName}
        isOpen={showConfigDialog}
        onClose={handleCloseConfig}
        autoStartOnSave={autoStartOnSave}
      />
    </div>
  )
}
