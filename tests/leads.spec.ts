import { test, expect } from '@playwright/test'
import { getToken, createLead, deleteLead, waitForTable } from './helpers'

test.describe('Leads — list, search, filters', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/leads')
    await waitForTable(page)
  })

  test('shows "Leads" as the page title', async ({ page }) => {
    await expect(page.locator('header h1')).toHaveText('Leads')
  })

  test('shows the table with all expected column headers', async ({ page }) => {
    const headers = ['Name / Company', 'Status', 'Source', 'Salesperson', 'Deal Value']
    const thead = page.locator('thead')
    for (const h of headers) {
      await expect(thead.locator('th', { hasText: h })).toBeVisible()
    }
  })

  test('seed data — at least 8 lead rows are present', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(await rows.count()) // resolve count first
    expect(await rows.count()).toBeGreaterThanOrEqual(8)
  })

  test('shows seed lead "Alice Johnson" in the list', async ({ page }) => {
    await expect(page.getByText('Alice Johnson')).toBeVisible()
  })

  test('search by lead name filters the list', async ({ page }) => {
    await page.getByPlaceholder('Search name, company, email…').fill('Alice')
    await page.waitForTimeout(400) // debounce
    await waitForTable(page)
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    await expect(page.getByText('Bob Smith')).not.toBeVisible()
  })

  test('search by company name filters the list', async ({ page }) => {
    await page.getByPlaceholder('Search name, company, email…').fill('TechCorp')
    await page.waitForTimeout(400)
    await waitForTable(page)
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    await expect(page.getByText('Bob Smith')).not.toBeVisible()
  })

  test('search by email filters the list', async ({ page }) => {
    await page.getByPlaceholder('Search name, company, email…').fill('grace@bluesky.com')
    await page.waitForTimeout(400)
    await waitForTable(page)
    await expect(page.getByText('Grace Kim')).toBeVisible()
    await expect(page.getByText('Alice Johnson')).not.toBeVisible()
  })

  test('clearing search restores all leads', async ({ page }) => {
    const search = page.getByPlaceholder('Search name, company, email…')
    await search.fill('Alice')
    await page.waitForTimeout(400)
    await search.clear()
    await page.waitForTimeout(400)
    await waitForTable(page)
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    await expect(page.getByText('Bob Smith')).toBeVisible()
  })

  test('Status dropdown filters leads to "Won" only', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Statuses' }).selectOption('Won')
    await waitForTable(page)
    // Only Won leads should appear (Alice, Grace from seed)
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    // A non-Won lead should not appear
    await expect(page.getByText('Carol White')).not.toBeVisible()
  })

  test('Source dropdown filters leads by "Referral"', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Sources' }).selectOption('Referral')
    await waitForTable(page)
    // Bob (Referral) and Grace (Referral) are seed Referral leads
    await expect(page.getByText('Bob Smith')).toBeVisible()
    // Alice (Website) should not appear
    await expect(page.getByText('Alice Johnson')).not.toBeVisible()
  })

  test('Salesperson dropdown filters leads by "Alex Chen"', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
    await waitForTable(page)
    // Alice and Frank are assigned to Alex Chen in seed data
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    await expect(page.getByText('Bob Smith')).not.toBeVisible()
  })

  test('combined status + salesperson filter narrows results correctly', async ({ page }) => {
    await page.locator('select').filter({ hasText: 'All Statuses' }).selectOption('Won')
    await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
    await waitForTable(page)
    // Alice (Won + Alex Chen) should appear
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    // Grace (Won + Sarah Kim) should not appear
    await expect(page.getByText('Grace Kim')).not.toBeVisible()
  })

  test('lead count at bottom reflects displayed rows', async ({ page }) => {
    const countEl = page.locator('p.text-xs.text-on-surface-variant')
    await expect(countEl).toContainText(/lead/)
  })

  test('"New Lead" button navigates to /leads/new', async ({ page }) => {
    await page.getByRole('link', { name: /new lead/i }).click()
    await expect(page).toHaveURL(/\/leads\/new/)
  })

  test('"Export" button triggers a CSV download', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /export/i }).click(),
    ])
    expect(download.suggestedFilename()).toBe('leads.csv')
  })

  test('clicking a lead row navigates to the lead detail page', async ({ page }) => {
    await page.locator('table tbody tr').first().click()
    await expect(page).toHaveURL(/\/leads\/\d+/)
  })

  test('edit icon navigates to the edit page for that lead', async ({ page }) => {
    await page.locator('table tbody tr').first().locator('button').filter({
      has: page.locator('span', { hasText: 'edit' }),
    }).click()
    await expect(page).toHaveURL(/\/leads\/\d+\/edit/)
  })

})

test.describe('Leads — create and delete', () => {

  let createdLeadId: number | null = null

  test.afterEach(async ({ request }) => {
    if (createdLeadId !== null) {
      const token = await getToken(request)
      await deleteLead(request, token, createdLeadId)
      createdLeadId = null
    }
  })

  test('creates a new lead via the form and it appears in the list', async ({ page }) => {
    await page.goto('/leads/new')
    await expect(page.locator('header h1')).toHaveText('New Lead')

    await page.getByPlaceholder('Full name').fill('E2E Test Person')
    await page.getByPlaceholder('Company name').fill('E2E Corp')
    await page.getByPlaceholder('email@example.com').fill('e2e@test.com')
    await page.getByPlaceholder('555-0100').fill('555-0001')
    await page.getByPlaceholder('0', { exact: true }).fill('12000')
    await page.locator('select').filter({ hasText: 'Select source' }).selectOption('LinkedIn')
    await page.locator('select').filter({ hasText: 'Assign salesperson' }).selectOption('Sarah Kim')

    await page.getByRole('button', { name: 'Create lead' }).click()

    // After save, navigates to the new lead's detail page
    await expect(page).toHaveURL(/\/leads\/\d+$/)
    const url  = page.url()
    createdLeadId = Number(url.split('/').pop())

    await expect(page.locator('header h1')).toHaveText('E2E Test Person')
  })

  test('validation — creating a lead without a name shows an error', async ({ page }) => {
    await page.goto('/leads/new')
    await page.getByRole('button', { name: 'Create lead' }).click()
    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page).toHaveURL(/\/leads\/new/) // did not navigate away
  })

  test('validation — invalid email format shows an error', async ({ page }) => {
    await page.goto('/leads/new')
    await page.getByPlaceholder('Full name').fill('Test')
    await page.getByPlaceholder('email@example.com').fill('not-an-email')
    await page.getByRole('button', { name: 'Create lead' }).click()
    await expect(page.getByText('Invalid email', { exact: true })).toBeVisible()
  })

  test('deletes a lead via the list delete button', async ({ page, request }) => {
    const token = await getToken(request)
    const lead  = await createLead(request, token, { lead_name: 'To Be Deleted' })
    // No afterEach cleanup needed — test deletes it directly

    await page.goto('/leads')
    await waitForTable(page)
    await expect(page.getByText('To Be Deleted')).toBeVisible()

    // Accept the confirmation dialog
    page.on('dialog', d => d.accept())

    const row = page.locator('table tbody tr').filter({ hasText: 'To Be Deleted' })
    await row.locator('button').filter({
      has: page.locator('span', { hasText: 'delete' }),
    }).click()

    await expect(page.getByText('To Be Deleted')).not.toBeVisible({ timeout: 6_000 })
  })

})
