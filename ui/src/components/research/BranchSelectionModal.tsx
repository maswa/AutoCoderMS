/**
 * Branch Selection Modal Component
 *
 * Modal for selecting or creating a git branch before converting
 * research results to an AutoCoder spec. Helps users work on a
 * feature branch rather than main/master.
 */

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  GitBranch,
  GitBranchPlus,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronRight,
} from 'lucide-react'
import { listBranches, createBranch, checkoutBranch } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { GitBranch as GitBranchType } from '@/lib/types'

// ============================================================================
// Types
// ============================================================================

interface BranchSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  onBranchSelected: (branch: string) => void
}

type Step = 'select' | 'create'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Suggests a branch name based on project name.
 * Creates a name like "feature/project-name-autocoder"
 */
function suggestBranchName(projectName: string): string {
  const sanitized = projectName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `feature/${sanitized}-autocoder`
}

/**
 * Validates a git branch name.
 * Basic client-side validation matching backend rules.
 */
function isValidBranchName(name: string): boolean {
  if (!name || name.length > 250) return false
  // Check for invalid characters
  if (/[\s~^:?*[\]\\]/.test(name)) return false
  // Check for invalid patterns
  if (
    name.startsWith('/') ||
    name.endsWith('/') ||
    name.includes('//') ||
    name.endsWith('.lock') ||
    name === '.' ||
    name === '..' ||
    name.startsWith('-')
  ) {
    return false
  }
  return true
}

// ============================================================================
// Main Component
// ============================================================================

export function BranchSelectionModal({
  isOpen,
  onClose,
  projectName,
  onBranchSelected,
}: BranchSelectionModalProps) {
  const [step, setStep] = useState<Step>('select')
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [newBranchName, setNewBranchName] = useState('')
  const [baseBranch, setBaseBranch] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // Fetch branches for the project
  const {
    data: branchData,
    isLoading: branchesLoading,
    isError: branchesError,
    error: branchesErrorObj,
    refetch: refetchBranches,
  } = useQuery({
    queryKey: ['branches', projectName],
    queryFn: () => listBranches(projectName),
    enabled: isOpen,
    staleTime: 10000, // Cache for 10 seconds
  })

  // Create branch mutation
  const createBranchMutation = useMutation({
    mutationFn: (params: { branchName: string; fromBranch?: string }) =>
      createBranch(projectName, params.branchName, params.fromBranch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['branches', projectName] })
      onBranchSelected(data.branch || newBranchName)
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create branch')
    },
  })

  // Checkout branch mutation
  const checkoutMutation = useMutation({
    mutationFn: (branch: string) => checkoutBranch(projectName, branch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['branches', projectName] })
      onBranchSelected(data.current_branch || selectedBranch || '')
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to checkout branch')
    },
  })

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('select')
      setSelectedBranch(null)
      setNewBranchName(suggestBranchName(projectName))
      setBaseBranch(null)
      setError(null)
    }
  }, [isOpen, projectName])

  // Set default base branch when data loads
  useEffect(() => {
    if (branchData?.current_branch && !baseBranch) {
      setBaseBranch(branchData.current_branch)
    }
  }, [branchData, baseBranch])

  // Handle branch selection
  const handleSelectBranch = (branch: GitBranchType) => {
    setSelectedBranch(branch.name)
    setError(null)
  }

  // Continue with selected branch
  const handleContinueWithBranch = () => {
    if (!selectedBranch) {
      setError('Please select a branch')
      return
    }

    // If already on the selected branch, just proceed
    if (branchData?.current_branch === selectedBranch) {
      onBranchSelected(selectedBranch)
      return
    }

    // Otherwise, checkout the branch
    checkoutMutation.mutate(selectedBranch)
  }

  // Continue on current branch (skip selection)
  const handleContinueOnCurrent = () => {
    if (branchData?.current_branch) {
      onBranchSelected(branchData.current_branch)
    }
  }

  // Switch to create branch step
  const handleGoToCreate = () => {
    setStep('create')
    setError(null)
  }

  // Go back to selection step
  const handleBackToSelect = () => {
    setStep('select')
    setError(null)
  }

  // Create new branch
  const handleCreateBranch = () => {
    const trimmedName = newBranchName.trim()

    if (!trimmedName) {
      setError('Please enter a branch name')
      return
    }

    if (!isValidBranchName(trimmedName)) {
      setError('Invalid branch name. Avoid special characters and patterns like //, .lock, etc.')
      return
    }

    // Check if branch already exists
    if (branchData?.branches.some((b) => b.name === trimmedName)) {
      setError('A branch with this name already exists')
      return
    }

    createBranchMutation.mutate({
      branchName: trimmedName,
      fromBranch: baseBranch || undefined,
    })
  }

  // Handle close
  const handleClose = () => {
    if (!createBranchMutation.isPending && !checkoutMutation.isPending) {
      onClose()
    }
  }

  if (!isOpen) return null

  const isLoading = createBranchMutation.isPending || checkoutMutation.isPending
  const isNotGitRepo = branchData && !branchData.is_git_repo
  const hasUncommitted = branchData?.has_uncommitted_changes

  // Not a git repo - show warning and allow continuing
  if (isNotGitRepo) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-warning" />
              <div>
                <DialogTitle>Not a Git Repository</DialogTitle>
                <DialogDescription>
                  This project is not initialized as a git repository.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              We recommend using git to track your changes, but you can continue without it.
              Consider initializing git in your project directory:
            </p>
            <pre className="mt-2 p-2 bg-muted rounded text-sm font-mono">git init</pre>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => onBranchSelected('')}>
              Continue Anyway
              <ChevronRight size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Branch selection step
  if (step === 'select') {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <GitBranch size={24} className="text-primary" />
              <div>
                <DialogTitle>Select Working Branch</DialogTitle>
                <DialogDescription>
                  Choose a branch to work on for your AutoCoder project. We recommend using a
                  feature branch.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current branch info */}
            {branchData?.current_branch && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Currently on:</span>
                <Badge variant="secondary" className="font-mono">
                  {branchData.current_branch}
                </Badge>
                {branchData.protected_branches.includes(branchData.current_branch) && (
                  <Badge variant="outline" className="text-warning border-warning">
                    Protected
                  </Badge>
                )}
              </div>
            )}

            {/* Uncommitted changes warning */}
            {hasUncommitted && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle size={16} />
                <AlertDescription>
                  You have uncommitted changes. Commit or stash them before switching branches.
                </AlertDescription>
              </Alert>
            )}

            {/* Loading state */}
            {branchesLoading && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 size={20} className="animate-spin mr-2" />
                Loading branches...
              </div>
            )}

            {/* Error state */}
            {branchesError && (
              <Alert variant="destructive">
                <AlertCircle size={16} />
                <AlertDescription>
                  {branchesErrorObj instanceof Error
                    ? branchesErrorObj.message
                    : 'Failed to load branches'}
                  <Button variant="link" onClick={() => refetchBranches()} className="p-0 ml-2 h-auto">
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Branch list */}
            {branchData && branchData.branches.length > 0 && (
              <div className="space-y-2">
                <Label>Available Branches</Label>
                <ScrollArea className="h-48 border rounded-md">
                  <RadioGroup
                    value={selectedBranch || ''}
                    onValueChange={(value) =>
                      handleSelectBranch(branchData.branches.find((b) => b.name === value)!)
                    }
                    className="p-2 space-y-1"
                  >
                    {branchData.branches.map((branch) => (
                      <div
                        key={branch.name}
                        className={cn(
                          'flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors',
                          selectedBranch === branch.name && 'bg-primary/10'
                        )}
                        onClick={() => handleSelectBranch(branch)}
                      >
                        <RadioGroupItem value={branch.name} id={branch.name} />
                        <label
                          htmlFor={branch.name}
                          className="flex-1 flex items-center gap-2 cursor-pointer"
                        >
                          <span className="font-mono text-sm">{branch.name}</span>
                          {branch.is_current && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                          {branch.is_protected && (
                            <Badge variant="outline" className="text-xs text-warning border-warning">
                              Protected
                            </Badge>
                          )}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
              </div>
            )}

            {/* Error display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle size={16} />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Create new branch option */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleGoToCreate}
              disabled={isLoading}
            >
              <GitBranchPlus size={16} />
              Create New Branch
            </Button>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              {branchData?.current_branch && (
                <Button
                  variant="outline"
                  onClick={handleContinueOnCurrent}
                  disabled={isLoading}
                >
                  Stay on {branchData.current_branch}
                </Button>
              )}
              <Button
                onClick={handleContinueWithBranch}
                disabled={isLoading || !selectedBranch}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Switching...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Continue
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Create branch step
  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <GitBranchPlus size={24} className="text-primary" />
            <div>
              <DialogTitle>Create New Branch</DialogTitle>
              <DialogDescription>
                Create a new branch for your AutoCoder work.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Branch name input */}
          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch Name</Label>
            <Input
              id="branch-name"
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="feature/my-branch"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Use a descriptive name like feature/add-login or fix/navbar-bug
            </p>
          </div>

          {/* Base branch selection */}
          {branchData && branchData.branches.length > 0 && (
            <div className="space-y-2">
              <Label>Create from Branch</Label>
              <RadioGroup
                value={baseBranch || ''}
                onValueChange={setBaseBranch}
                className="grid grid-cols-2 gap-2"
              >
                {branchData.branches
                  .filter((b) => b.is_protected || b.is_current)
                  .slice(0, 4)
                  .map((branch) => (
                    <div
                      key={branch.name}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:border-primary/50 transition-colors',
                        baseBranch === branch.name && 'border-primary bg-primary/5'
                      )}
                      onClick={() => setBaseBranch(branch.name)}
                    >
                      <RadioGroupItem value={branch.name} id={`base-${branch.name}`} />
                      <label
                        htmlFor={`base-${branch.name}`}
                        className="font-mono text-sm cursor-pointer"
                      >
                        {branch.name}
                      </label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
          )}

          {/* Uncommitted changes warning */}
          {hasUncommitted && (
            <Alert variant="destructive" className="py-2">
              <AlertTriangle size={16} />
              <AlertDescription>
                Uncommitted changes will be carried to the new branch.
              </AlertDescription>
            </Alert>
          )}

          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle size={16} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={handleBackToSelect} disabled={isLoading}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateBranch} disabled={isLoading || !newBranchName.trim()}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <GitBranchPlus size={16} />
                  Create & Switch
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
