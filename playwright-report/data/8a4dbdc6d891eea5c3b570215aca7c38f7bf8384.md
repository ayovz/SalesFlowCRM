# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lead-detail.spec.ts >> Lead Detail >> shows the "Add Note" section
- Location: tests\lead-detail.spec.ts:90:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Add Note')
Expected: visible
Error: strict mode violation: getByText('Add Note') resolved to 2 elements:
    1) <h3 class="text-sm font-semibold text-on-surface mb-3">Add Note</h3> aka getByRole('heading', { name: 'Add Note' })
    2) <button disabled tabindex="0" type="submit" class="inline-flex items-center justify-center rounded-lg font-medium transition-colors↵        bg-primary text-on-primary hover:bg-primary-container h-8  px-3 text-xs gap-1.5↵        disabled:opacity-50 disabled:cursor-not-allowed ">Add note</button> aka getByRole('button', { name: 'Add note' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Add Note')

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | import { getToken, createLead, deleteLead } from './helpers'
  3   | 
  4   | test.describe('Lead Detail', () => {
  5   | 
  6   |   let leadId: number
  7   | 
  8   |   test.beforeAll(async ({ request }) => {
  9   |     const token = await getToken(request)
  10  |     const lead  = await createLead(request, token, {
  11  |       lead_name:    'Detail Test Lead',
  12  |       company_name: 'Detail Corp',
  13  |       email:        'detail@corp.com',
  14  |       phone:        '555-1234',
  15  |       lead_source:  'LinkedIn',
  16  |       salesperson:  'Sarah Kim',
  17  |       status:       'Contacted',
  18  |       deal_value:   25000,
  19  |     })
  20  |     leadId = lead.id
  21  |   })
  22  | 
  23  |   test.afterAll(async ({ request }) => {
  24  |     const token = await getToken(request)
  25  |     await deleteLead(request, token, leadId)
  26  |   })
  27  | 
  28  |   test.beforeEach(async ({ page }) => {
  29  |     await page.goto(`/leads/${leadId}`)
  30  |     await page.waitForSelector('h2.text-lg.font-bold', { timeout: 8_000 })
  31  |   })
  32  | 
  33  |   // ── Info card ─────────────────────────────────────────────────────────────
  34  | 
  35  |   test('shows the lead name in the TopNav title', async ({ page }) => {
  36  |     await expect(page.locator('header h1')).toHaveText('Detail Test Lead')
  37  |   })
  38  | 
  39  |   test('shows the lead name in the info card heading', async ({ page }) => {
  40  |     await expect(page.locator('h2.text-lg.font-bold')).toContainText('Detail Test Lead')
  41  |   })
  42  | 
  43  |   test('shows the company name', async ({ page }) => {
  44  |     await expect(page.getByText('Detail Corp')).toBeVisible()
  45  |   })
  46  | 
  47  |   test('shows all info field labels', async ({ page }) => {
  48  |     const labels = ['Company', 'Email', 'Phone', 'Lead Source', 'Salesperson', 'Deal Value', 'Created', 'Updated']
  49  |     for (const label of labels) {
  50  |       await expect(page.locator('dt').filter({ hasText: label })).toBeVisible()
  51  |     }
  52  |   })
  53  | 
  54  |   test('shows the email address', async ({ page }) => {
  55  |     await expect(page.getByText('detail@corp.com')).toBeVisible()
  56  |   })
  57  | 
  58  |   test('shows the deal value formatted', async ({ page }) => {
  59  |     await expect(page.getByText('$25K')).toBeVisible()
  60  |   })
  61  | 
  62  |   test('shows the current status badge', async ({ page }) => {
  63  |     await expect(page.getByText('Contacted')).toBeVisible()
  64  |   })
  65  | 
  66  |   test('"Edit" button navigates to the edit page', async ({ page }) => {
  67  |     await page.getByRole('link', { name: /edit/i }).click()
  68  |     await expect(page).toHaveURL(`/leads/${leadId}/edit`)
  69  |   })
  70  | 
  71  |   // ── Status update ─────────────────────────────────────────────────────────
  72  | 
  73  |   test('changing the status dropdown updates the status in the UI', async ({ page, request }) => {
  74  |     const statusSelect = page.locator('select')
  75  |     await statusSelect.selectOption('Qualified')
  76  |     // Wait for PATCH to complete; badge updates
  77  |     await expect(page.locator('span.rounded-full', { hasText: 'Qualified' })).toBeVisible({ timeout: 6_000 })
  78  | 
  79  |     // Reset status for future tests
  80  |     const token = await getToken(request)
  81  |     await request.fetch(`http://localhost:3001/api/leads/${leadId}`, {
  82  |       method: 'PATCH',
  83  |       headers: { Authorization: `Bearer ${token}` },
  84  |       data: { status: 'Contacted' },
  85  |     })
  86  |   })
  87  | 
  88  |   // ── Notes ─────────────────────────────────────────────────────────────────
  89  | 
  90  |   test('shows the "Add Note" section', async ({ page }) => {
> 91  |     await expect(page.getByText('Add Note')).toBeVisible()
      |                                              ^ Error: expect(locator).toBeVisible() failed
  92  |     await expect(page.getByPlaceholder('Write a note…')).toBeVisible()
  93  |   })
  94  | 
  95  |   test('"Add note" button is disabled when textarea is empty', async ({ page }) => {
  96  |     await expect(page.getByRole('button', { name: 'Add note' })).toBeDisabled()
  97  |   })
  98  | 
  99  |   test('adding a note saves it and displays it in the notes list', async ({ page }) => {
  100 |     const noteText = `E2E note — ${Date.now()}`
  101 |     await page.getByPlaceholder('Write a note…').fill(noteText)
  102 |     await expect(page.getByRole('button', { name: 'Add note' })).toBeEnabled()
  103 |     await page.getByRole('button', { name: 'Add note' }).click()
  104 | 
  105 |     // After posting, the note appears
  106 |     await expect(page.getByText(noteText)).toBeVisible({ timeout: 6_000 })
  107 |     // Textarea is cleared
  108 |     await expect(page.getByPlaceholder('Write a note…')).toHaveValue('')
  109 |   })
  110 | 
  111 | })
  112 | 
  113 | test.describe('Lead Edit', () => {
  114 | 
  115 |   let leadId: number
  116 | 
  117 |   test.beforeAll(async ({ request }) => {
  118 |     const token = await getToken(request)
  119 |     const lead  = await createLead(request, token, {
  120 |       lead_name:    'Edit Test Lead',
  121 |       company_name: 'Old Corp',
  122 |       status:       'New',
  123 |     })
  124 |     leadId = lead.id
  125 |   })
  126 | 
  127 |   test.afterAll(async ({ request }) => {
  128 |     const token = await getToken(request)
  129 |     await deleteLead(request, token, leadId)
  130 |   })
  131 | 
  132 |   test('edit form pre-fills existing lead values', async ({ page }) => {
  133 |     await page.goto(`/leads/${leadId}/edit`)
  134 |     await page.waitForSelector('input[placeholder="Full name"]', { timeout: 8_000 })
  135 | 
  136 |     await expect(page.getByPlaceholder('Full name')).toHaveValue('Edit Test Lead')
  137 |     await expect(page.getByPlaceholder('Company name')).toHaveValue('Old Corp')
  138 |   })
  139 | 
  140 |   test('shows "Edit Lead" as the TopNav title', async ({ page }) => {
  141 |     await page.goto(`/leads/${leadId}/edit`)
  142 |     await expect(page.locator('header h1')).toHaveText('Edit Lead')
  143 |   })
  144 | 
  145 |   test('updating the lead name and saving reflects the change', async ({ page }) => {
  146 |     await page.goto(`/leads/${leadId}/edit`)
  147 |     await page.waitForSelector('input[placeholder="Full name"]', { timeout: 8_000 })
  148 | 
  149 |     await page.getByPlaceholder('Full name').clear()
  150 |     await page.getByPlaceholder('Full name').fill('Updated Lead Name')
  151 |     await page.getByRole('button', { name: 'Save changes' }).click()
  152 | 
  153 |     // Redirects to detail page
  154 |     await expect(page).toHaveURL(`/leads/${leadId}`)
  155 |     await expect(page.locator('header h1')).toHaveText('Updated Lead Name')
  156 |   })
  157 | 
  158 |   test('"Cancel" button goes back without saving', async ({ page }) => {
  159 |     await page.goto(`/leads/${leadId}/edit`)
  160 |     await page.waitForSelector('input[placeholder="Full name"]', { timeout: 8_000 })
  161 | 
  162 |     await page.getByPlaceholder('Full name').clear()
  163 |     await page.getByPlaceholder('Full name').fill('Should Not Save')
  164 |     await page.getByRole('button', { name: 'Cancel' }).click()
  165 | 
  166 |     // Navigated back
  167 |     await expect(page).toHaveURL(/\/leads\/\d+/)
  168 |     await expect(page.locator('header h1')).not.toHaveText('Should Not Save')
  169 |   })
  170 | 
  171 | })
  172 | 
```