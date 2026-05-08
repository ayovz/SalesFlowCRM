# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leads.spec.ts >> Leads — create and delete >> creates a new lead via the form and it appears in the list
- Location: tests\leads.spec.ts:147:7

# Error details

```
Error: locator.fill: Error: strict mode violation: getByPlaceholder('0') resolved to 2 elements:
    1) <input type="tel" value="555-0001" placeholder="555-0100" class="h-9 w-full rounded-lg border px-3 text-sm bg-surface-container-lowest text-on-surface↵          placeholder:text-on-surface-variant/50 outline-none transition-colors↵          border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container/30↵          disabled:opacity-50 "/> aka getByRole('textbox', { name: '-0100' })
    2) <input min="0" value="" step="100" type="number" placeholder="0" class="h-9 w-full rounded-lg border px-3 text-sm bg-surface-container-lowest text-on-surface↵          placeholder:text-on-surface-variant/50 outline-none transition-colors↵          border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container/30↵          disabled:opacity-50 "/> aka getByPlaceholder('0', { exact: true })

Call log:
  - waiting for getByPlaceholder('0')

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
            - textbox "Full name" [ref=e46]: E2E Test Person
          - generic [ref=e47]:
            - generic [ref=e48]: Company
            - textbox "Company name" [ref=e49]: E2E Corp
          - generic [ref=e50]:
            - generic [ref=e51]: Email
            - textbox "email@example.com" [ref=e52]: e2e@test.com
          - generic [ref=e53]:
            - generic [ref=e54]: Phone
            - textbox "555-0100" [active] [ref=e55]: 555-0001
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
  55  | 
  56  |   test('clearing search restores all leads', async ({ page }) => {
  57  |     const search = page.getByPlaceholder('Search name, company, email…')
  58  |     await search.fill('Alice')
  59  |     await page.waitForTimeout(400)
  60  |     await search.clear()
  61  |     await page.waitForTimeout(400)
  62  |     await waitForTable(page)
  63  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  64  |     await expect(page.getByText('Bob Smith')).toBeVisible()
  65  |   })
  66  | 
  67  |   test('Status dropdown filters leads to "Won" only', async ({ page }) => {
  68  |     await page.locator('select').filter({ hasText: 'All Statuses' }).selectOption('Won')
  69  |     await waitForTable(page)
  70  |     // Only Won leads should appear (Alice, Grace from seed)
  71  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  72  |     // A non-Won lead should not appear
  73  |     await expect(page.getByText('Carol White')).not.toBeVisible()
  74  |   })
  75  | 
  76  |   test('Source dropdown filters leads by "Referral"', async ({ page }) => {
  77  |     await page.locator('select').filter({ hasText: 'All Sources' }).selectOption('Referral')
  78  |     await waitForTable(page)
  79  |     // Bob (Referral) and Grace (Referral) are seed Referral leads
  80  |     await expect(page.getByText('Bob Smith')).toBeVisible()
  81  |     // Alice (Website) should not appear
  82  |     await expect(page.getByText('Alice Johnson')).not.toBeVisible()
  83  |   })
  84  | 
  85  |   test('Salesperson dropdown filters leads by "Alex Chen"', async ({ page }) => {
  86  |     await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
  87  |     await waitForTable(page)
  88  |     // Alice and Frank are assigned to Alex Chen in seed data
  89  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  90  |     await expect(page.getByText('Bob Smith')).not.toBeVisible()
  91  |   })
  92  | 
  93  |   test('combined status + salesperson filter narrows results correctly', async ({ page }) => {
  94  |     await page.locator('select').filter({ hasText: 'All Statuses' }).selectOption('Won')
  95  |     await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
  96  |     await waitForTable(page)
  97  |     // Alice (Won + Alex Chen) should appear
  98  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  99  |     // Grace (Won + Sarah Kim) should not appear
  100 |     await expect(page.getByText('Grace Kim')).not.toBeVisible()
  101 |   })
  102 | 
  103 |   test('lead count at bottom reflects displayed rows', async ({ page }) => {
  104 |     const countEl = page.locator('p.text-xs.text-on-surface-variant')
  105 |     await expect(countEl).toContainText(/lead/)
  106 |   })
  107 | 
  108 |   test('"New Lead" button navigates to /leads/new', async ({ page }) => {
  109 |     await page.getByRole('link', { name: /new lead/i }).click()
  110 |     await expect(page).toHaveURL(/\/leads\/new/)
  111 |   })
  112 | 
  113 |   test('"Export" button triggers a CSV download', async ({ page }) => {
  114 |     const [download] = await Promise.all([
  115 |       page.waitForEvent('download'),
  116 |       page.getByRole('button', { name: /export/i }).click(),
  117 |     ])
  118 |     expect(download.suggestedFilename()).toBe('leads.csv')
  119 |   })
  120 | 
  121 |   test('clicking a lead row navigates to the lead detail page', async ({ page }) => {
  122 |     await page.locator('table tbody tr').first().click()
  123 |     await expect(page).toHaveURL(/\/leads\/\d+/)
  124 |   })
  125 | 
  126 |   test('edit icon navigates to the edit page for that lead', async ({ page }) => {
  127 |     await page.locator('table tbody tr').first().locator('button').filter({
  128 |       has: page.locator('span', { hasText: 'edit' }),
  129 |     }).click()
  130 |     await expect(page).toHaveURL(/\/leads\/\d+\/edit/)
  131 |   })
  132 | 
  133 | })
  134 | 
  135 | test.describe('Leads — create and delete', () => {
  136 | 
  137 |   let createdLeadId: number | null = null
  138 | 
  139 |   test.afterEach(async ({ request }) => {
  140 |     if (createdLeadId !== null) {
  141 |       const token = await getToken(request)
  142 |       await deleteLead(request, token, createdLeadId)
  143 |       createdLeadId = null
  144 |     }
  145 |   })
  146 | 
  147 |   test('creates a new lead via the form and it appears in the list', async ({ page }) => {
  148 |     await page.goto('/leads/new')
  149 |     await expect(page.locator('header h1')).toHaveText('New Lead')
  150 | 
  151 |     await page.getByPlaceholder('Full name').fill('E2E Test Person')
  152 |     await page.getByPlaceholder('Company name').fill('E2E Corp')
  153 |     await page.getByPlaceholder('email@example.com').fill('e2e@test.com')
  154 |     await page.getByPlaceholder('555-0100').fill('555-0001')
> 155 |     await page.getByPlaceholder('0').fill('12000')
      |                                      ^ Error: locator.fill: Error: strict mode violation: getByPlaceholder('0') resolved to 2 elements:
  156 |     await page.locator('select').filter({ hasText: 'Select source' }).selectOption('LinkedIn')
  157 |     await page.locator('select').filter({ hasText: 'Assign salesperson' }).selectOption('Sarah Kim')
  158 | 
  159 |     await page.getByRole('button', { name: 'Create lead' }).click()
  160 | 
  161 |     // After save, navigates to the new lead's detail page
  162 |     await expect(page).toHaveURL(/\/leads\/\d+$/)
  163 |     const url  = page.url()
  164 |     createdLeadId = Number(url.split('/').pop())
  165 | 
  166 |     await expect(page.locator('header h1')).toHaveText('E2E Test Person')
  167 |   })
  168 | 
  169 |   test('validation — creating a lead without a name shows an error', async ({ page }) => {
  170 |     await page.goto('/leads/new')
  171 |     await page.getByRole('button', { name: 'Create lead' }).click()
  172 |     await expect(page.getByText('Name is required')).toBeVisible()
  173 |     await expect(page).toHaveURL(/\/leads\/new/) // did not navigate away
  174 |   })
  175 | 
  176 |   test('validation — invalid email format shows an error', async ({ page }) => {
  177 |     await page.goto('/leads/new')
  178 |     await page.getByPlaceholder('Full name').fill('Test')
  179 |     await page.getByPlaceholder('email@example.com').fill('not-an-email')
  180 |     await page.getByRole('button', { name: 'Create lead' }).click()
  181 |     await expect(page.getByText('Invalid email')).toBeVisible()
  182 |   })
  183 | 
  184 |   test('deletes a lead via the list delete button', async ({ page, request }) => {
  185 |     const token = await getToken(request)
  186 |     const lead  = await createLead(request, token, { lead_name: 'To Be Deleted' })
  187 |     // No afterEach cleanup needed — test deletes it directly
  188 | 
  189 |     await page.goto('/leads')
  190 |     await waitForTable(page)
  191 |     await expect(page.getByText('To Be Deleted')).toBeVisible()
  192 | 
  193 |     // Accept the confirmation dialog
  194 |     page.on('dialog', d => d.accept())
  195 | 
  196 |     const row = page.locator('table tbody tr').filter({ hasText: 'To Be Deleted' })
  197 |     await row.locator('button').filter({
  198 |       has: page.locator('span', { hasText: 'delete' }),
  199 |     }).click()
  200 | 
  201 |     await expect(page.getByText('To Be Deleted')).not.toBeVisible({ timeout: 6_000 })
  202 |   })
  203 | 
  204 | })
  205 | 
```