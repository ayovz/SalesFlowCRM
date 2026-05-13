# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leads.spec.ts >> Leads — create and delete >> validation — invalid email format shows an error
- Location: tests\leads.spec.ts:177:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Invalid email', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Invalid email', { exact: true })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e7]: hub
      - generic [ref=e8]: SalesFlow
    - navigation [ref=e9]:
      - link "grid_view Dashboard" [ref=e10] [cursor=pointer]:
        - /url: /dashboard
        - generic [ref=e11]:
          - generic [ref=e12]: grid_view
          - text: Dashboard
      - link "people Leads" [ref=e13] [cursor=pointer]:
        - /url: /leads
        - generic [ref=e15]:
          - generic [ref=e16]: people
          - text: Leads
      - link "view_kanban Pipeline" [ref=e17] [cursor=pointer]:
        - /url: /pipeline
        - generic [ref=e18]:
          - generic [ref=e19]: view_kanban
          - text: Pipeline
      - link "bar_chart Reports" [ref=e20] [cursor=pointer]:
        - /url: /reports
        - generic [ref=e21]:
          - generic [ref=e22]: bar_chart
          - text: Reports
      - link "insights Analytics" [ref=e23] [cursor=pointer]:
        - /url: /analytics
        - generic [ref=e24]:
          - generic [ref=e25]: insights
          - text: Analytics
      - link "upload_file Import" [ref=e26] [cursor=pointer]:
        - /url: /import
        - generic [ref=e27]:
          - generic [ref=e28]: upload_file
          - text: Import
      - link "settings Settings" [ref=e29] [cursor=pointer]:
        - /url: /settings
        - generic [ref=e30]:
          - generic [ref=e31]: settings
          - text: Settings
    - paragraph [ref=e33]: SalesFlow CRM · v1.0
  - main [ref=e34]:
    - generic [ref=e35]:
      - generic [ref=e36]:
        - heading "New Lead" [level=1] [ref=e37]
        - button "AD" [ref=e40] [cursor=pointer]
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e44]:
            - generic [ref=e45]: Lead Name *
            - textbox "Full name" [ref=e46]: Test
          - generic [ref=e47]:
            - generic [ref=e48]: Company
            - textbox "Company name" [ref=e49]
          - generic [ref=e50]:
            - generic [ref=e51]: Email
            - textbox "email@example.com" [active] [ref=e52]: not-an-email
          - generic [ref=e53]:
            - generic [ref=e54]: Phone
            - textbox "555-0100" [ref=e55]
        - generic [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e58]: Lead Source
            - combobox [ref=e59]:
              - option "Select source…" [selected]
              - option "Website"
              - option "Referral"
              - option "LinkedIn"
              - option "Conference"
              - option "Cold Call"
              - option "Email Campaign"
              - option "Other"
          - generic [ref=e60]:
            - generic [ref=e61]: Salesperson
            - combobox [ref=e62]:
              - option "Assign salesperson…" [selected]
              - option "Alex Chen"
              - option "Sarah Kim"
              - option "James Park"
              - option "Maria Lopez"
              - option "David Osei"
          - generic [ref=e63]:
            - generic [ref=e64]: Status
            - combobox [ref=e65]:
              - option "New" [selected]
              - option "Contacted"
              - option "Qualified"
              - option "Proposal Sent"
              - option "Won"
              - option "Lost"
          - generic [ref=e66]:
            - generic [ref=e67]: Deal Value ($)
            - spinbutton [ref=e68]
        - generic [ref=e69]:
          - button "Create lead" [ref=e70] [cursor=pointer]
          - button "Cancel" [ref=e71] [cursor=pointer]
```

# Test source

```ts
  82  |     // Alice (Website) should not appear
  83  |     await expect(page.getByText('Alice Johnson')).not.toBeVisible()
  84  |   })
  85  | 
  86  |   test('Salesperson dropdown filters leads by "Alex Chen"', async ({ page }) => {
  87  |     await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
  88  |     await waitForTable(page)
  89  |     // Alice and Frank are assigned to Alex Chen in seed data
  90  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  91  |     await expect(page.getByText('Bob Smith')).not.toBeVisible()
  92  |   })
  93  | 
  94  |   test('combined status + salesperson filter narrows results correctly', async ({ page }) => {
  95  |     await page.locator('select').filter({ hasText: 'All Statuses' }).selectOption('Won')
  96  |     await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
  97  |     await waitForTable(page)
  98  |     // Alice (Won + Alex Chen) should appear
  99  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  100 |     // Grace (Won + Sarah Kim) should not appear
  101 |     await expect(page.getByText('Grace Kim')).not.toBeVisible()
  102 |   })
  103 | 
  104 |   test('lead count at bottom reflects displayed rows', async ({ page }) => {
  105 |     const countEl = page.locator('p.text-xs.text-on-surface-variant')
  106 |     await expect(countEl).toContainText(/lead/)
  107 |   })
  108 | 
  109 |   test('"New Lead" button navigates to /leads/new', async ({ page }) => {
  110 |     await page.getByRole('link', { name: /new lead/i }).click()
  111 |     await expect(page).toHaveURL(/\/leads\/new/)
  112 |   })
  113 | 
  114 |   test('"Export" button triggers a CSV download', async ({ page }) => {
  115 |     const [download] = await Promise.all([
  116 |       page.waitForEvent('download'),
  117 |       page.getByRole('button', { name: /export/i }).click(),
  118 |     ])
  119 |     expect(download.suggestedFilename()).toBe('leads.csv')
  120 |   })
  121 | 
  122 |   test('clicking a lead row navigates to the lead detail page', async ({ page }) => {
  123 |     await page.locator('table tbody tr').first().click()
  124 |     await expect(page).toHaveURL(/\/leads\/\d+/)
  125 |   })
  126 | 
  127 |   test('edit icon navigates to the edit page for that lead', async ({ page }) => {
  128 |     await page.locator('table tbody tr').first().locator('button').filter({
  129 |       has: page.locator('span', { hasText: 'edit' }),
  130 |     }).click()
  131 |     await expect(page).toHaveURL(/\/leads\/\d+\/edit/)
  132 |   })
  133 | 
  134 | })
  135 | 
  136 | test.describe('Leads — create and delete', () => {
  137 | 
  138 |   let createdLeadId: number | null = null
  139 | 
  140 |   test.afterEach(async ({ request }) => {
  141 |     if (createdLeadId !== null) {
  142 |       const token = await getToken(request)
  143 |       await deleteLead(request, token, createdLeadId)
  144 |       createdLeadId = null
  145 |     }
  146 |   })
  147 | 
  148 |   test('creates a new lead via the form and it appears in the list', async ({ page }) => {
  149 |     await page.goto('/leads/new')
  150 |     await expect(page.locator('header h1')).toHaveText('New Lead')
  151 | 
  152 |     await page.getByPlaceholder('Full name').fill('E2E Test Person')
  153 |     await page.getByPlaceholder('Company name').fill('E2E Corp')
  154 |     await page.getByPlaceholder('email@example.com').fill('e2e@test.com')
  155 |     await page.getByPlaceholder('555-0100').fill('555-0001')
  156 |     await page.getByPlaceholder('0', { exact: true }).fill('12000')
  157 |     await page.locator('select').filter({ hasText: 'Select source' }).selectOption('LinkedIn')
  158 |     await page.locator('select').filter({ hasText: 'Assign salesperson' }).selectOption('Sarah Kim')
  159 | 
  160 |     await page.getByRole('button', { name: 'Create lead' }).click()
  161 | 
  162 |     // After save, navigates to the new lead's detail page
  163 |     await expect(page).toHaveURL(/\/leads\/\d+$/)
  164 |     const url  = page.url()
  165 |     createdLeadId = Number(url.split('/').pop())
  166 | 
  167 |     await expect(page.locator('header h1')).toHaveText('E2E Test Person')
  168 |   })
  169 | 
  170 |   test('validation — creating a lead without a name shows an error', async ({ page }) => {
  171 |     await page.goto('/leads/new')
  172 |     await page.getByRole('button', { name: 'Create lead' }).click()
  173 |     await expect(page.getByText('Name is required')).toBeVisible()
  174 |     await expect(page).toHaveURL(/\/leads\/new/) // did not navigate away
  175 |   })
  176 | 
  177 |   test('validation — invalid email format shows an error', async ({ page }) => {
  178 |     await page.goto('/leads/new')
  179 |     await page.getByPlaceholder('Full name').fill('Test')
  180 |     await page.getByPlaceholder('email@example.com').fill('not-an-email')
  181 |     await page.getByRole('button', { name: 'Create lead' }).click()
> 182 |     await expect(page.getByText('Invalid email', { exact: true })).toBeVisible()
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
  183 |   })
  184 | 
  185 |   test('deletes a lead via the list delete button', async ({ page, request }) => {
  186 |     const token = await getToken(request)
  187 |     const lead  = await createLead(request, token, { lead_name: 'To Be Deleted' })
  188 |     // No afterEach cleanup needed — test deletes it directly
  189 | 
  190 |     await page.goto('/leads')
  191 |     await waitForTable(page)
  192 |     await expect(page.getByText('To Be Deleted')).toBeVisible()
  193 | 
  194 |     // Accept the confirmation dialog
  195 |     page.on('dialog', d => d.accept())
  196 | 
  197 |     const row = page.locator('table tbody tr').filter({ hasText: 'To Be Deleted' })
  198 |     await row.locator('button').filter({
  199 |       has: page.locator('span', { hasText: 'delete' }),
  200 |     }).click()
  201 | 
  202 |     await expect(page.getByText('To Be Deleted')).not.toBeVisible({ timeout: 6_000 })
  203 |   })
  204 | 
  205 | })
  206 | 
```