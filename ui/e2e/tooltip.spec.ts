import { test, expect } from '@playwright/test'

/**
 * E2E tooltip tests for header icon buttons.
 *
 * Run tests:
 *   cd ui && npm run test:e2e
 *   cd ui && npm run test:e2e -- tooltip.spec.ts
 */
test.describe('Header tooltips', () => {
  test.setTimeout(30000)

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('button:has-text("Select Project")', { timeout: 10000 })
  })

  async function selectProject(page: import('@playwright/test').Page) {
    const projectSelector = page.locator('button:has-text("Select Project")')
    if (await projectSelector.isVisible()) {
      await projectSelector.click()
      const items = page.locator('.neo-dropdown-item')
      const itemCount = await items.count()
      if (itemCount === 0) return false
      await items.first().click()
      await expect(projectSelector).not.toBeVisible({ timeout: 5000 }).catch(() => {})
      return true
    }
    return false
  }

  test('Settings tooltip shows on hover', async ({ page }) => {
    const hasProject = await selectProject(page)
    if (!hasProject) {
      test.skip(true, 'No projects available')
      return
    }

    const settingsButton = page.locator('button[aria-label="Open Settings"]')
    await expect(settingsButton).toBeVisible()

    await settingsButton.hover()

    const tooltip = page.locator('[data-slot="tooltip-content"]', { hasText: 'Settings' })
    await expect(tooltip).toBeVisible({ timeout: 2000 })
  })
})
