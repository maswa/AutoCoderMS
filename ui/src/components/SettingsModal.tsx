import { Loader2, AlertCircle, Check, Moon, Sun } from 'lucide-react'
import { useSettings, useUpdateSettings, useAvailableModels } from '../hooks/useProjects'
import { useTheme, THEMES } from '../hooks/useTheme'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data: settings, isLoading, isError, refetch } = useSettings()
  const { data: modelsData } = useAvailableModels()
  const updateSettings = useUpdateSettings()
  const { theme, setTheme, darkMode, toggleDarkMode } = useTheme()

  const handleYoloToggle = () => {
    if (settings && !updateSettings.isPending) {
      updateSettings.mutate({ yolo_mode: !settings.yolo_mode })
    }
  }

  const handleModelChange = (modelId: string) => {
    if (!updateSettings.isPending) {
      updateSettings.mutate({ model: modelId })
    }
  }

  const handleTestingRatioChange = (ratio: number) => {
    if (!updateSettings.isPending) {
      updateSettings.mutate({ testing_agent_ratio: ratio })
    }
  }

  const handleTestingModeChange = (mode: string) => {
    if (!updateSettings.isPending) {
      updateSettings.mutate({ testing_mode: mode })
    }
  }

  const handleBatchSizeChange = (size: number) => {
    if (!updateSettings.isPending) {
      updateSettings.mutate({ batch_size: size })
    }
  }

  const models = modelsData?.models ?? []
  const isSaving = updateSettings.isPending

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Settings
            {isSaving && <Loader2 className="animate-spin" size={16} />}
          </DialogTitle>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin" size={24} />
            <span className="ml-2">Loading settings...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load settings
              <Button
                variant="link"
                onClick={() => refetch()}
                className="ml-2 p-0 h-auto"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Content */}
        {settings && !isLoading && (
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="font-medium">Theme</Label>
              <div className="grid gap-2">
                {THEMES.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left ${
                      theme === themeOption.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-0.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-sm border border-border/50"
                        style={{ backgroundColor: themeOption.previewColors.background }}
                      />
                      <div
                        className="w-5 h-5 rounded-sm border border-border/50"
                        style={{ backgroundColor: themeOption.previewColors.primary }}
                      />
                      <div
                        className="w-5 h-5 rounded-sm border border-border/50"
                        style={{ backgroundColor: themeOption.previewColors.accent }}
                      />
                    </div>

                    {/* Theme info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{themeOption.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {themeOption.description}
                      </div>
                    </div>

                    {/* Checkmark */}
                    {theme === themeOption.id && (
                      <Check size={18} className="text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark appearance
                </p>
              </div>
              <Button
                id="dark-mode"
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="gap-2"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                {darkMode ? 'Light' : 'Dark'}
              </Button>
            </div>

            <hr className="border-border" />

            {/* YOLO Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="yolo-mode" className="font-medium">
                  YOLO Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Skip testing for rapid prototyping
                </p>
              </div>
              <Switch
                id="yolo-mode"
                checked={settings.yolo_mode}
                onCheckedChange={handleYoloToggle}
                disabled={isSaving}
              />
            </div>

            {/* Browser Testing Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Browser Testing</Label>
                <p className="text-sm text-muted-foreground">
                  {(settings?.testing_mode || 'full') === 'smart' ? 'UI features only' : 'All features'}
                </p>
              </div>
              <div className={`flex rounded-lg border overflow-hidden ${settings?.yolo_mode ? 'opacity-50' : ''}`}>
                {[
                  { id: 'full', label: 'Full' },
                  { id: 'smart', label: 'Smart' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleTestingModeChange(mode.id)}
                    disabled={isSaving || settings?.yolo_mode}
                    className={`py-1.5 px-3 text-sm font-medium transition-colors ${
                      (settings?.testing_mode || 'full') === mode.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-muted'
                    } ${(isSaving || settings?.yolo_mode) ? 'cursor-not-allowed' : ''}`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Headless Browser Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="playwright-headless" className="font-medium">
                  Headless Browser
                </Label>
                <p className="text-sm text-muted-foreground">
                  Run browser without visible window (saves CPU)
                </p>
              </div>
              <Switch
                id="playwright-headless"
                checked={settings?.playwright_headless ?? true}
                onCheckedChange={() => updateSettings.mutate({ playwright_headless: !(settings?.playwright_headless ?? true) })}
                disabled={isSaving}
              />
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label className="font-medium">Model</Label>
              <div className="flex rounded-lg border overflow-hidden">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    disabled={isSaving}
                    className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                      settings.model === model.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-muted'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Regression Agents */}
            <div className="space-y-2">
              <Label className="font-medium">Regression Agents</Label>
              <p className="text-sm text-muted-foreground">
                Number of regression testing agents (0 = disabled)
              </p>
              <div className="flex rounded-lg border overflow-hidden">
                {[0, 1, 2, 3].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => handleTestingRatioChange(ratio)}
                    disabled={isSaving}
                    className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                      settings.testing_agent_ratio === ratio
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-muted'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Features per Agent */}
            <div className="space-y-2">
              <Label className="font-medium">Features per Agent</Label>
              <p className="text-sm text-muted-foreground">
                Number of features assigned to each coding agent
              </p>
              <div className="flex rounded-lg border overflow-hidden">
                {[1, 2, 3].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleBatchSizeChange(size)}
                    disabled={isSaving}
                    className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                      (settings.batch_size ?? 1) === size
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-muted'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Update Error */}
            {updateSettings.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to save settings. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
