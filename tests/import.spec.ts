import { test, expect } from '@playwright/test'
import { getToken, apiCall } from './helpers'
import path from 'path'

const SAMPLE_CSV = path.join(__dirname, 'fixtures', 'sample-import.csv')

test.describe('Lead Import', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/import')
    await expect(page.locator('header h1')).toHaveText('Import Leads')
  })

  // ── Upload step ───────────────────────────────────────────────────────────

  test('shows the upload step by default', async ({ page }) => {
    await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  })

  test('shows step indicator with Upload, Preview, Done labels', async ({ page }) => {
    await expect(page.getByText('Upload')).toBeVisible()
    await expect(page.getByText('Preview')).toBeVisible()
    await expect(page.getByText('Done')).toBeVisible()
  })

  test('shows supported file type hint', async ({ page }) => {
    await expect(page.getByText(/xlsx.*xls.*csv/i)).toBeVisible()
  })

  test('shows the Recognized Column Names guide', async ({ page }) => {
    await expect(page.getByText('Recognized Column Names')).toBeVisible()
    await expect(page.getByText('Lead Name *')).toBeVisible()
    await expect(page.getByText('Company')).toBeVisible()
    await expect(page.getByText('Email')).toBeVisible()
    await expect(page.getByText('Phone')).toBeVisible()
    await expect(page.getByText('Lead Source')).toBeVisible()
    await expect(page.getByText('Salesperson')).toBeVisible()
    await expect(page.getByText('Status')).toBeVisible()
    await expect(page.getByText('Deal Value')).toBeVisible()
  })

  test('file input accepts xlsx, xls, and csv extensions', async ({ page }) => {
    const accept = await page.locator('input[type="file"]').getAttribute('accept')
    expect(accept).toContain('.xlsx')
    expect(accept).toContain('.xls')
    expect(accept).toContain('.csv')
  })

  test('shows an error for an unsupported file type', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content'),
    })
    await expect(page.getByText(/unsupported file type/i)).toBeVisible()
  })

  // ── Preview step ──────────────────────────────────────────────────────────

  test('uploading a valid CSV transitions to the preview step', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await expect(page.getByText('Rows detected')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('Will import')).toBeVisible()
  })

  test('preview shows the correct detected row count for the sample CSV', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await expect(page.getByText('Rows detected')).toBeVisible({ timeout: 5_000 })
    // Sample CSV has 3 data rows
    const detected = page.locator('div').filter({ hasText: /^3$/ }).first()
    await expect(detected).toBeVisible()
  })

  test('preview table shows all expected columns', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await page.waitForSelector('text=Rows detected', { timeout: 5_000 })

    for (const col of ['Name', 'Company', 'Email', 'Source', 'Rep', 'Status', 'Value']) {
      await expect(page.getByText(col)).toBeVisible()
    }
  })

  test('preview table lists the lead names from the CSV', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await page.waitForSelector('text=Rows detected', { timeout: 5_000 })

    await expect(page.getByText('Import Lead One')).toBeVisible()
    await expect(page.getByText('Import Lead Two')).toBeVisible()
    await expect(page.getByText('Import Lead Three')).toBeVisible()
  })

  test('valid rows show a "Ready" status badge in the preview', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await page.waitForSelector('text=Rows detected', { timeout: 5_000 })

    const readyBadges = page.locator('span', { hasText: 'Ready' })
    await expect(readyBadges.first()).toBeVisible()
    expect(await readyBadges.count()).toBe(3)
  })

  test('"Change file" button goes back to the upload step', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await page.waitForSelector('text=Rows detected', { timeout: 5_000 })

    await page.getByRole('button', { name: 'Change file' }).click()
    await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  })

  // ── Import step ───────────────────────────────────────────────────────────

  test('clicking "Import" POSTs to /api/leads/bulk and shows the done step', async ({ page, request }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await page.waitForSelector('text=Rows detected', { timeout: 5_000 })

    // Intercept the bulk API call to verify it's made correctly
    let bulkCalled = false
    await page.route('**/api/leads/bulk', (route) => {
      bulkCalled = true
      route.continue()
    })

    await page.getByRole('button', { name: /import/i }).click()
    await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })
    expect(bulkCalled).toBe(true)

    // Cleanup — delete the 3 imported leads
    const token = await getToken(request)
    const res   = await request.get('http://localhost:3001/api/leads', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
    const imported = leads.filter(l =>
      ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
    )
    for (const l of imported) {
      await apiCall(request, 'DELETE', `/api/leads/${l.id}`, token)
    }
  })

  test('"View Leads" button on the done step navigates to /leads', async ({ page, request }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
    await page.getByRole('button', { name: /import/i }).click()
    await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: 'View Leads' }).click()
    await expect(page).toHaveURL(/\/leads/)

    // Cleanup
    const token = await getToken(request)
    const res   = await request.get('http://localhost:3001/api/leads', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
    const imported = leads.filter(l =>
      ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
    )
    for (const l of imported) {
      await apiCall(request, 'DELETE', `/api/leads/${l.id}`, token)
    }
  })

  test('"Import more" button on the done step resets to upload step', async ({ page, request }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
    await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
    await page.getByRole('button', { name: /import/i }).click()
    await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: 'Import more' }).click()
    await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()

    // Cleanup
    const token = await getToken(request)
    const res   = await request.get('http://localhost:3001/api/leads', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
    const imported = leads.filter(l =>
      ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
    )
    for (const l of imported) {
      await apiCall(request, 'DELETE', `/api/leads/${l.id}`, token)
    }
  })

})
