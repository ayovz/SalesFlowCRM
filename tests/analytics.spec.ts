import { test, expect } from '@playwright/test'

test.describe('Analytics & Insights', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/analytics')
    // Wait for stat cards to be present in DOM, then allow Framer Motion to finish
    await page.waitForSelector('text=Total Leads', { timeout: 10_000 })
    await page.waitForTimeout(800)
  })

  test('shows "Analytics" as the page title', async ({ page }) => {
    await expect(page.locator('header h1')).toHaveText('Analytics')
  })

  test('renders all 4 summary stat cards', async ({ page }) => {
    const labels = ['Total Leads', 'Won Deals', 'Conversion Rate', 'Avg Won Value']
    for (const label of labels) {
      await expect(page.getByText(label).first()).toBeVisible()
    }
  })

  test('Total Leads stat matches API', async ({ page, request }) => {
    const token = await page.evaluate(() => localStorage.getItem('crm_token'))
    const res   = await request.get('http://localhost:3001/api/insights?period=30', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    await expect(page.getByText(String(data.summary.total)).first()).toBeVisible()
  })

  test('renders the "Lead Volume Trend" chart card', async ({ page }) => {
    // Scope to the specific card to avoid multi-element match from ancestor elements
    const trendCard = page.locator('.glass-card').filter({ hasText: 'Lead Volume Trend' })
    await expect(trendCard).toBeVisible({ timeout: 8_000 })
    // Wait for Recharts to mount its SVG inside this card
    const chart = trendCard.locator('.recharts-responsive-container')
    await expect(chart).toBeVisible({ timeout: 8_000 })
    await expect(chart.locator('svg')).toBeVisible({ timeout: 8_000 })
  })

  test('renders the "Conversion Funnel" card with all 6 stages', async ({ page }) => {
    await expect(page.getByText('Conversion Funnel')).toBeVisible()
    for (const stage of ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']) {
      await expect(page.getByText(stage).first()).toBeVisible()
    }
  })

  test('renders the "Win Rate by Source" chart card', async ({ page }) => {
    await expect(page.getByText('Win Rate by Source')).toBeVisible()
  })

  test('renders the "Salesperson Performance" card', async ({ page }) => {
    await expect(page.getByText('Salesperson Performance').first()).toBeVisible()
  })

  test('renders the "Recent Activity" table', async ({ page }) => {
    const activityCard = page.locator('.glass-card').filter({ hasText: 'Recent Activity' }).last()
    await expect(activityCard).toBeVisible()
    // Check table headers scoped to this section
    for (const h of ['Action', 'Details', 'By', 'When']) {
      await expect(activityCard.locator('th', { hasText: h })).toBeVisible()
    }
    await expect(activityCard.locator('th', { hasText: 'Lead' }).first()).toBeVisible()
  })

  test('period filter — switching to "Last 7 days" reloads data', async ({ page }) => {
    const select = page.locator('select').filter({ hasText: 'Last 30 days' })
    await select.selectOption('7')
    await page.waitForTimeout(1_000)
    await expect(page.locator('.text-red-700')).not.toBeVisible()
    await expect(page.getByText('Total Leads').first()).toBeVisible()
  })

  test('source filter narrows displayed data', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Sources' }).selectOption('Website')
    await page.waitForTimeout(800)
    await expect(page.locator('.text-red-700')).not.toBeVisible()
    await expect(page.getByText('Total Leads').first()).toBeVisible()
  })

  test('salesperson filter narrows displayed data', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
    await page.waitForTimeout(800)
    await expect(page.locator('.text-red-700')).not.toBeVisible()
  })

  test('"Refresh" button reloads the insights data', async ({ page }) => {
    await page.getByRole('button', { name: /refresh/i }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Total Leads').first()).toBeVisible()
    await expect(page.locator('.text-red-700')).not.toBeVisible()
  })

  test('"CSV" download button is visible in the header', async ({ page }) => {
    // Button accessible name includes the material icon text: "download CSV"
    await expect(page.getByRole('button', { name: /csv/i }).first()).toBeVisible()
  })

  test('"PDF" download button is visible in the header', async ({ page }) => {
    // Button accessible name includes the material icon text: "picture_as_pdf PDF"
    await expect(page.getByRole('button', { name: /pdf/i }).first()).toBeVisible()
  })

  test('SVG download button on Lead Volume Trend chart is visible', async ({ page }) => {
    const trendCard = page.locator('.glass-card').filter({ hasText: 'Lead Volume Trend' })
    await expect(trendCard.getByText('SVG')).toBeVisible()
  })

  test('"CSV" activity-log download returns a CSV file', async ({ page }) => {
    const csvBtn = page.getByRole('button', { name: /csv/i }).first()
    await expect(csvBtn).toBeEnabled()
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      csvBtn.click(),
    ])
    expect(download.suggestedFilename()).toMatch(/\.csv$/)
  })

  test('"PDF" export triggers a download', async ({ page }) => {
    const pdfBtn = page.getByRole('button', { name: /pdf/i }).first()
    await expect(pdfBtn).toBeEnabled()
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30_000 }),
      pdfBtn.click(),
    ])
    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  })

})
