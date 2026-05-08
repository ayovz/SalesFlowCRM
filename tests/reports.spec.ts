import { test, expect } from '@playwright/test'

test.describe('Reports', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    // Wait for charts to render (Recharts mounts SVG elements)
    await page.waitForSelector('.recharts-responsive-container', { timeout: 10_000 })
  })

  test('shows "Reports" as the page title', async ({ page }) => {
    await expect(page.locator('header h1')).toHaveText('Reports')
  })

  test('renders the "Lead Status Distribution" chart card', async ({ page }) => {
    await expect(page.getByText('Lead Status Distribution')).toBeVisible()
  })

  test('renders the "Leads by Source" chart card', async ({ page }) => {
    await expect(page.getByText('Leads by Source')).toBeVisible()
  })

  test('renders the "Deal Value by Source" chart card', async ({ page }) => {
    await expect(page.getByText('Deal Value by Source ($)')).toBeVisible()
  })

  test('renders the "Salesperson Performance" table card', async ({ page }) => {
    await expect(page.getByText('Salesperson Performance')).toBeVisible()
  })

  test('salesperson table has expected column headers', async ({ page }) => {
    const table = page.locator('table').first()
    for (const header of ['Salesperson', 'Leads', 'Won', 'Win Rate', 'Won Value']) {
      // Use exact text match so "Won" does not also match "Won Value"
      await expect(table.locator('th').getByText(header, { exact: true })).toBeVisible()
    }
  })

  test('salesperson table lists at least one rep with data', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    const repName = await rows.first().locator('td').first().textContent()
    expect(repName?.trim().length).toBeGreaterThan(0)
  })

  test('status pie chart renders an SVG', async ({ page }) => {
    // First Recharts container holds the pie chart
    const pie = page.locator('.recharts-responsive-container').first()
    await expect(pie.locator('svg')).toBeVisible()
  })

  test('bar charts render SVG elements', async ({ page }) => {
    const bars = page.locator('.recharts-responsive-container')
    const count = await bars.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('"Download PDF" button is visible in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /download pdf/i })).toBeVisible()
  })

  test('"Download PDF" button triggers a download', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30_000 }),
      page.getByRole('button', { name: /download pdf/i }).click(),
    ])
    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  })

  test('reports reflect the actual number of leads in the database', async ({ page, request }) => {
    const token = await page.evaluate(() => localStorage.getItem('crm_token'))
    const res   = await request.get('http://localhost:3001/api/leads', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const leads = await res.json()
    const wonCount = leads.filter((l: { status: string }) => l.status === 'Won').length

    // The "Salesperson Performance" table total "Won" column should sum to wonCount
    const wonCells = page.locator('table tbody tr td:nth-child(3)')
    let tableWon = 0
    const cells = await wonCells.all()
    for (const cell of cells) {
      tableWon += Number(await cell.textContent())
    }
    expect(tableWon).toBe(wonCount)
  })

})
