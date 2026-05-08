# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lead-detail.spec.ts >> Lead Edit >> "Cancel" button goes back without saving
- Location: tests\lead-detail.spec.ts:158:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/leads\/\d+/
Received string:  "about:blank"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "about:blank"

```

# Test source

```ts
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
  91  |     await expect(page.getByText('Add Note')).toBeVisible()
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
> 167 |     await expect(page).toHaveURL(/\/leads\/\d+/)
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  168 |     await expect(page.locator('header h1')).not.toHaveText('Should Not Save')
  169 |   })
  170 | 
  171 | })
  172 | 
```