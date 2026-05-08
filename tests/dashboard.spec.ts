import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    // Wait for stat cards to be populated (loading state replaced by real data)
    await page.waitForSelector('text=Total Leads', { timeout: 8_000 })
  })

  test('shows "Dashboard" as the page title', async ({ page }) => {
    await expect(page.locator('header h1')).toHaveText('Dashboard')
  })

  test('renders all 8 stat card labels', async ({ page }) => {
    const labels = [
      'Total Leads',
      'New',
      'Contacted',
      'Qualified',
      'Won',
      'Lost',
      'Total Pipeline Value',
      'Won Deal Value',
    ]
    for (const label of labels) {
      await expect(page.getByText(label)).toBeVisible()
    }
  })

  test('Total Leads card shows a positive integer', async ({ page }) => {
    const totalCard = page.locator('div').filter({ hasText: /^Total Leads$/ }).locator('..')
    const valueText = await totalCard.locator('.text-2xl, .text-3xl').first().textContent()
    expect(Number(valueText)).toBeGreaterThan(0)
  })

  test('stat cards reflect actual lead counts from the API', async ({ page, request }) => {
    const res  = await request.get('http://localhost:3001/api/dashboard', {
      headers: {
        Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem('crm_token'))}`,
      },
    })
    const data = await res.json()

    // Total Leads on the page should match the API response
    await expect(page.getByText(String(data.total)).first()).toBeVisible()
  })

  test('shows the "Leads Created — Last 6 Months" section', async ({ page }) => {
    await expect(page.getByText('Leads Created — Last 6 Months')).toBeVisible()
  })

  test('renders the monthly bar chart (Recharts SVG)', async ({ page }) => {
    const chart = page.locator('.recharts-responsive-container').first()
    await expect(chart).toBeVisible()
    await expect(chart.locator('svg')).toBeVisible()
  })

  test('renders three quick-link cards', async ({ page }) => {
    await expect(page.getByText('View all leads')).toBeVisible()
    await expect(page.getByText('Pipeline board')).toBeVisible()
    await expect(page.getByText('Reports')).toBeVisible()
  })

  test('"New Lead" button in header navigates to /leads/new', async ({ page }) => {
    await page.getByRole('link', { name: /new lead/i }).click()
    await expect(page).toHaveURL(/\/leads\/new/)
  })

  test('"View all leads" quick-link navigates to /leads', async ({ page }) => {
    await page.getByRole('link', { name: 'View all leads' }).click()
    await expect(page).toHaveURL(/\/leads/)
  })

  test('"Pipeline board" quick-link navigates to /pipeline', async ({ page }) => {
    await page.getByRole('link', { name: 'Pipeline board' }).click()
    await expect(page).toHaveURL(/\/pipeline/)
  })

})
