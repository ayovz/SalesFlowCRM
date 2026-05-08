import { test, expect } from '@playwright/test'
import { getToken, createLead, deleteLead } from './helpers'

test.describe('Lead Detail', () => {

  let leadId: number

  test.beforeAll(async ({ request }) => {
    const token = await getToken(request)
    const lead  = await createLead(request, token, {
      lead_name:    'Detail Test Lead',
      company_name: 'Detail Corp',
      email:        'detail@corp.com',
      phone:        '555-1234',
      lead_source:  'LinkedIn',
      salesperson:  'Sarah Kim',
      status:       'Contacted',
      deal_value:   25000,
    })
    leadId = lead.id
  })

  test.afterAll(async ({ request }) => {
    const token = await getToken(request)
    await deleteLead(request, token, leadId)
  })

  test.beforeEach(async ({ page }) => {
    await page.goto(`/leads/${leadId}`)
    await page.waitForSelector('h2.text-lg.font-bold', { timeout: 8_000 })
  })

  // ── Info card ─────────────────────────────────────────────────────────────

  test('shows the lead name in the TopNav title', async ({ page }) => {
    await expect(page.locator('header h1')).toHaveText('Detail Test Lead')
  })

  test('shows the lead name in the info card heading', async ({ page }) => {
    await expect(page.locator('h2.text-lg.font-bold')).toContainText('Detail Test Lead')
  })

  test('shows the company name', async ({ page }) => {
    await expect(page.getByText('Detail Corp')).toBeVisible()
  })

  test('shows all info field labels', async ({ page }) => {
    const labels = ['Company', 'Email', 'Phone', 'Lead Source', 'Salesperson', 'Deal Value', 'Created', 'Updated']
    for (const label of labels) {
      await expect(page.locator('dt').filter({ hasText: label })).toBeVisible()
    }
  })

  test('shows the email address', async ({ page }) => {
    await expect(page.getByText('detail@corp.com')).toBeVisible()
  })

  test('shows the deal value formatted', async ({ page }) => {
    await expect(page.getByText('$25K')).toBeVisible()
  })

  test('shows the current status badge', async ({ page }) => {
    await expect(page.getByText('Contacted')).toBeVisible()
  })

  test('"Edit" button navigates to the edit page', async ({ page }) => {
    await page.getByRole('link', { name: /edit/i }).click()
    await expect(page).toHaveURL(`/leads/${leadId}/edit`)
  })

  // ── Status update ─────────────────────────────────────────────────────────

  test('changing the status dropdown updates the status in the UI', async ({ page, request }) => {
    const statusSelect = page.locator('select')
    await statusSelect.selectOption('Qualified')
    // Wait for PATCH to complete; badge updates
    await expect(page.locator('span.rounded-full', { hasText: 'Qualified' })).toBeVisible({ timeout: 6_000 })

    // Reset status for future tests
    const token = await getToken(request)
    await request.fetch(`http://localhost:3001/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      data: { status: 'Contacted' },
    })
  })

  // ── Notes ─────────────────────────────────────────────────────────────────

  test('shows the "Add Note" section', async ({ page }) => {
    await expect(page.getByText('Add Note')).toBeVisible()
    await expect(page.getByPlaceholder('Write a note…')).toBeVisible()
  })

  test('"Add note" button is disabled when textarea is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add note' })).toBeDisabled()
  })

  test('adding a note saves it and displays it in the notes list', async ({ page }) => {
    const noteText = `E2E note — ${Date.now()}`
    await page.getByPlaceholder('Write a note…').fill(noteText)
    await expect(page.getByRole('button', { name: 'Add note' })).toBeEnabled()
    await page.getByRole('button', { name: 'Add note' }).click()

    // After posting, the note appears
    await expect(page.getByText(noteText)).toBeVisible({ timeout: 6_000 })
    // Textarea is cleared
    await expect(page.getByPlaceholder('Write a note…')).toHaveValue('')
  })

})

test.describe('Lead Edit', () => {

  let leadId: number

  test.beforeAll(async ({ request }) => {
    const token = await getToken(request)
    const lead  = await createLead(request, token, {
      lead_name:    'Edit Test Lead',
      company_name: 'Old Corp',
      status:       'New',
    })
    leadId = lead.id
  })

  test.afterAll(async ({ request }) => {
    const token = await getToken(request)
    await deleteLead(request, token, leadId)
  })

  test('edit form pre-fills existing lead values', async ({ page }) => {
    await page.goto(`/leads/${leadId}/edit`)
    await page.waitForSelector('input[placeholder="Full name"]', { timeout: 8_000 })

    await expect(page.getByPlaceholder('Full name')).toHaveValue('Edit Test Lead')
    await expect(page.getByPlaceholder('Company name')).toHaveValue('Old Corp')
  })

  test('shows "Edit Lead" as the TopNav title', async ({ page }) => {
    await page.goto(`/leads/${leadId}/edit`)
    await expect(page.locator('header h1')).toHaveText('Edit Lead')
  })

  test('updating the lead name and saving reflects the change', async ({ page }) => {
    await page.goto(`/leads/${leadId}/edit`)
    await page.waitForSelector('input[placeholder="Full name"]', { timeout: 8_000 })

    await page.getByPlaceholder('Full name').clear()
    await page.getByPlaceholder('Full name').fill('Updated Lead Name')
    await page.getByRole('button', { name: 'Save changes' }).click()

    // Redirects to detail page
    await expect(page).toHaveURL(`/leads/${leadId}`)
    await expect(page.locator('header h1')).toHaveText('Updated Lead Name')
  })

  test('"Cancel" button goes back without saving', async ({ page }) => {
    await page.goto(`/leads/${leadId}/edit`)
    await page.waitForSelector('input[placeholder="Full name"]', { timeout: 8_000 })

    await page.getByPlaceholder('Full name').clear()
    await page.getByPlaceholder('Full name').fill('Should Not Save')
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Navigated back
    await expect(page).toHaveURL(/\/leads\/\d+/)
    await expect(page.locator('header h1')).not.toHaveText('Should Not Save')
  })

})
