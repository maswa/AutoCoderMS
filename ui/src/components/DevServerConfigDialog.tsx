import { useState, useEffect } from 'react'
import { Loader2, RotateCcw, Terminal } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDevServerConfig, useUpdateDevServerConfig } from '@/hooks/useProjects'
import { startDevServer } from '@/lib/api'

interface DevServerConfigDialogProps {
  projectName: string
  isOpen: boolean
  onClose: () => void
  autoStartOnSave?: boolean
}

export function DevServerConfigDialog({
  projectName,
  isOpen,
  onClose,
  autoStartOnSave = false,
}: DevServerConfigDialogProps) {
  const { data: config } = useDevServerConfig(isOpen ? projectName : null)
  const updateConfig = useUpdateDevServerConfig(projectName)
  const queryClient = useQueryClient()

  const [command, setCommand] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Sync input with config when dialog opens or config loads
  useEffect(() => {
    if (isOpen && config) {
      setCommand(config.custom_command ?? config.effective_command ?? '')
      setError(null)
    }
  }, [isOpen, config])

  const hasCustomCommand = !!config?.custom_command

  const handleSaveAndStart = async () => {
    const trimmed = command.trim()
    if (!trimmed) {
      setError('Please enter a dev server command.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await updateConfig.mutateAsync(trimmed)

      if (autoStartOnSave) {
        await startDevServer(projectName)
        queryClient.invalidateQueries({ queryKey: ['dev-server-status', projectName] })
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = async () => {
    setIsSaving(true)
    setError(null)

    try {
      await updateConfig.mutateAsync(null)
      setCommand(config?.detected_command ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear configuration')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Terminal size={20} />
            </div>
            <DialogTitle>Dev Server Configuration</DialogTitle>
          </div>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="space-y-4">
            {/* Detection info */}
            <div className="rounded-lg border-2 border-border bg-muted/50 p-3 text-sm">
              {config?.detected_type ? (
                <p>
                  Detected project type: <strong className="text-foreground">{config.detected_type}</strong>
                  {config.detected_command && (
                    <span className="text-muted-foreground"> — {config.detected_command}</span>
                  )}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No project type detected. Enter a custom command below.
                </p>
              )}
            </div>

            {/* Command input */}
            <div className="space-y-2">
              <Label htmlFor="dev-command" className="text-foreground">Dev server command</Label>
              <Input
                id="dev-command"
                value={command}
                onChange={(e) => {
                  setCommand(e.target.value)
                  setError(null)
                }}
                placeholder="npm run dev"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSaving) {
                    handleSaveAndStart()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Allowed runners: npm, npx, pnpm, yarn, python, uvicorn, flask, poetry, cargo, go
              </p>
            </div>

            {/* Clear custom command button */}
            {hasCustomCommand && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={isSaving}
                className="gap-1.5"
              >
                <RotateCcw size={14} />
                Clear custom command (use auto-detection)
              </Button>
            )}

            {/* Error display */}
            {error && (
              <p className="text-sm font-mono text-destructive">{error}</p>
            )}
          </div>
        </DialogDescription>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSaveAndStart} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-1.5" />
                Saving...
              </>
            ) : autoStartOnSave ? (
              'Save & Start'
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
