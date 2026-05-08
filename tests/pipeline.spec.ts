import { test, expect } from '@playwright/test'
import { getToken, createLead, deleteLead } from './helpers'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']

test.describe('Pipeline (Kanban)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/pipeline')
    // Wait until loading skeleton is replaced by actual columns
    await page.waitForSelector('.glass-card', { timeout: 8_000 })
    await page.waitForTimeout(300)
  })

  test('shows "Pipeline" as the page title', async ({ page }) => {
    await expect(page.locator('header h1')).toHaveText('Pipeline')
  })

  test('renders a column for each of the 6 statuses', async ({ page }) => {
    for (const status of STATUSES) {
      // Each column header has a Badge span with the status text
      await expect(page.locator('span.rounded-full', { hasText: status }).first()).toBeVisible()
    }
  })

  test('seed lead "Alice Johnson" is visible (status: Won)', async ({ page }) => {
    await expect(page.getByText('Alice Johnson')).toBeVisible()
  })

  test('seed lead "David Lee" is visible (status: New)', async ({ page }) => {
    await expect(page.getByText('David Lee')).toBeVisible()
  })

  test('each column header shows a count badge', async ({ page }) => {
    // Each column has a count span next to the status badge
    const columnHeaders = page.locator('.bg-surface-container')
    await expect(columnHeaders).toHaveCount(STATUSES.length)
  })

  test('"Won" column contains seed leads Alice Johnson and Grace Kim', async ({ page }) => {
    const wonColumn = page.locator('.glass-card').filter({
      has: page.locator('.bg-surface-container span.rounded-full', { hasText: /^Won$/ }),
    })
    // Use locator('p') to get the name <p> element specifically, avoiding multi-match from ancestor divs
    await expect(wonColumn.locator('p', { hasText: 'Alice Johnson' })).toBeVisible()
    await expect(wonColumn.locator('p', { hasText: 'Grace Kim' })).toBeVisible()
  })

  test('"New" column contains seed leads David Lee and Henry Park', async ({ page }) => {
    const newColumn = page.locator('.glass-card').filter({
      has: page.locator('.bg-surface-container span.rounded-full', { hasText: /^New$/ }),
    })
    await expect(newColumn.locator('p', { hasText: 'David Lee' })).toBeVisible()
    await expect(newColumn.locator('p', { hasText: 'Henry Park' })).toBeVisible()
  })

  test('lead cards link to their detail pages', async ({ page }) => {
    await page.getByText('Alice Johnson').first().click()
    await expect(page).toHaveURL(/\/leads\/\d+/)
    await expect(page.locator('header h1')).toHaveText('Alice Johnson')
  })

  test('drag-and-drop moves a lead to a new status column', async ({ page, request }) => {
    const token = await getToken(request)
    const lead  = await createLead(request, token, {
      lead_name: 'Drag Test Lead',
      status:    'New',
    })

    await page.goto('/pipeline')
    await page.waitForSelector('.glass-card', { timeout: 8_000 })
    await page.waitForTimeout(400)

    // Locate the lead card link and its draggable parent
    const leadLink = page.getByText('Drag Test Lead').first()
    await expect(leadLink).toBeVisible()

    // The draggable element is a motion.div wrapping the link
    const dragSource = leadLink.locator('xpath=ancestor::div[@draggable="true"]').first()

    // Target: the "Qualified" column drop zone
    const qualifiedColumn = page.locator('.glass-card').filter({
      has: page.locator('.bg-surface-container span.rounded-full', { hasText: /^Qualified$/ }),
    })
    const dropZone = qualifiedColumn.locator('div.flex.flex-col.gap-2.p-3')

    await dragSource.dragTo(dropZone)
    await page.waitForTimeout(800)

    // The lead should now appear in the Qualified column
    await expect(qualifiedColumn.getByText('Drag Test Lead')).toBeVisible({ timeout: 6_000 })

    // Cleanup
    await deleteLead(request, token, lead.id)
  })

})
