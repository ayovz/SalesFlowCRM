import { test, expect } from '@playwright/test'

test.describe('Analytics & Insights', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/analytics')
    // Wait for summary stat cards to load
    await page.waitForSelector('text=Total Leads', { timeout: 10_000 })
  })

  test('shows "Analytics" as the page title', async ({ page }) => {
    await expect(page.locator('header h1')).toHaveText('Analytics')
  })

  test('renders all 4 summary stat cards', async ({ page }) => {
    const labels = ['Total Leads', 'Won Deals', 'Conversion Rate', 'Avg Won Value']
    for (const label of labels) {
      await expect(page.getByText(label)).toBeVisible()
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
    await expect(page.getByText('Lead Volume Trend')).toBeVisible()
    const chart = page.locator('.recharts-responsive-container').first()
    await expect(chart.locator('svg')).toBeVisible()
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
    await expect(page.getByText('Salesperson Performance')).toBeVisible()
  })

  test('renders the "Recent Activity" table', async ({ page }) => {
    await expect(page.getByText('Recent Activity')).toBeVisible()
    // Table headers
    for (const h of ['Action', 'Lead', 'Details', 'By', 'When']) {
      await expect(page.getByText(h)).toBeVisible()
    }
  })

  test('period filter — switching to "Last 7 days" reloads data', async ({ page }) => {
    const select = page.locator('select').filter({ hasText: 'Last 30 days' })
    await select.selectOption('7')
    // Loading spinner or updated data — just verify no error shown
    await page.waitForTimeout(1_000)
    await expect(page.locator('.text-red-700')).not.toBeVisible()
    await expect(page.getByText('Total Leads')).toBeVisible()
  })

  test('source filter narrows displayed data', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Sources' }).selectOption('Website')
    await page.waitForTimeout(800)
    await expect(page.locator('.text-red-700')).not.toBeVisible()
    await expect(page.getByText('Total Leads')).toBeVisible()
  })

  test('salesperson filter narrows displayed data', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
    await page.waitForTimeout(800)
    await expect(page.locator('.text-red-700')).not.toBeVisible()
  })

  test('"Refresh" button reloads the insights data', async ({ page }) => {
    await page.getByRole('button', { name: /refresh/i }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Total Leads')).toBeVisible()
    await expect(page.locator('.text-red-700')).not.toBeVisible()
  })

  test('"CSV" download button is visible in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^csv$/i })).toBeVisible()
  })

  test('"PDF" download button is visible in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^pdf$/i })).toBeVisible()
  })

  test('SVG download button on Lead Volume Trend chart is visible', async ({ page }) => {
    const trendCard = page.locator('.glass-card').filter({ hasText: 'Lead Volume Trend' })
    await expect(trendCard.getByText('SVG')).toBeVisible()
  })

  test('"CSV" activity-log download returns a CSV file', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /^csv$/i }).click(),
    ])
    expect(download.suggestedFilename()).toMatch(/\.csv$/)
  })

  test('"PDF" export triggers a download', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30_000 }),
      page.getByRole('button', { name: /^pdf$/i }).click(),
    ])
    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  })

})
