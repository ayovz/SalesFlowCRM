# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: import.spec.ts >> Lead Import >> preview table shows all expected columns
- Location: tests\import.spec.ts:75:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table').first().locator('th').filter({ hasText: 'Status' })
Expected: visible
Error: strict mode violation: locator('table').first().locator('th').filter({ hasText: 'Status' }) resolved to 2 elements:
    1) <th class="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant whitespace-nowrap">Status</th> aka getByRole('columnheader', { name: 'Status' }).first()
    2) <th class="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Status</th> aka getByRole('columnheader', { name: 'Status' }).nth(1)

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('table').first().locator('th').filter({ hasText: 'Status' })

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
        - generic [ref=e14]:
          - generic [ref=e15]: people
          - text: Leads
      - link "view_kanban Pipeline" [ref=e16] [cursor=pointer]:
        - /url: /pipeline
        - generic [ref=e17]:
          - generic [ref=e18]: view_kanban
          - text: Pipeline
      - link "bar_chart Reports" [ref=e19] [cursor=pointer]:
        - /url: /reports
        - generic [ref=e20]:
          - generic [ref=e21]: bar_chart
          - text: Reports
      - link "insights Analytics" [ref=e22] [cursor=pointer]:
        - /url: /analytics
        - generic [ref=e23]:
          - generic [ref=e24]: insights
          - text: Analytics
      - link "upload_file Import" [ref=e25] [cursor=pointer]:
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
        - heading "Import Leads" [level=1] [ref=e37]
        - button "AD" [ref=e40] [cursor=pointer]
      - generic [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e45]: check
            - generic [ref=e46]: Upload
            - generic [ref=e47]: chevron_right
          - generic [ref=e48]:
            - generic [ref=e49]: "2"
            - generic [ref=e50]: Preview
            - generic [ref=e51]: chevron_right
          - generic [ref=e52]:
            - generic [ref=e53]: "3"
            - generic [ref=e54]: Done
        - generic [ref=e55]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - generic [ref=e58]: "3"
              - generic [ref=e59]: Rows detected
            - generic [ref=e60]:
              - generic [ref=e61]: "3"
              - generic [ref=e62]: Will import
            - generic [ref=e63]:
              - button "Change file" [ref=e64] [cursor=pointer]
              - button "Import 3 leads" [ref=e65] [cursor=pointer]
          - table [ref=e68]:
            - rowgroup [ref=e69]:
              - row "# Name Company Email Source Rep Status Value Status" [ref=e70]:
                - columnheader "#" [ref=e71]
                - columnheader "Name" [ref=e72]
                - columnheader "Company" [ref=e73]
                - columnheader "Email" [ref=e74]
                - columnheader "Source" [ref=e75]
                - columnheader "Rep" [ref=e76]
                - columnheader "Status" [ref=e77]
                - columnheader "Value" [ref=e78]
                - columnheader "Status" [ref=e79]
            - rowgroup [ref=e80]:
              - row "1 Import Lead One Acme Corp one@acme.com Website Alex Chen New $10,000 Ready" [ref=e81]:
                - cell "1" [ref=e82]
                - cell "Import Lead One" [ref=e83]
                - cell "Acme Corp" [ref=e84]
                - cell "one@acme.com" [ref=e85]
                - cell "Website" [ref=e86]
                - cell "Alex Chen" [ref=e87]
                - cell "New" [ref=e88]
                - cell "$10,000" [ref=e89]
                - cell "Ready" [ref=e90]
              - row "2 Import Lead Two Beta Inc two@beta.com Referral Sarah Kim Contacted $20,000 Ready" [ref=e91]:
                - cell "2" [ref=e92]
                - cell "Import Lead Two" [ref=e93]
                - cell "Beta Inc" [ref=e94]
                - cell "two@beta.com" [ref=e95]
                - cell "Referral" [ref=e96]
                - cell "Sarah Kim" [ref=e97]
                - cell "Contacted" [ref=e98]
                - cell "$20,000" [ref=e99]
                - cell "Ready" [ref=e100]
              - row "3 Import Lead Three Gamma Ltd three@gamma.com LinkedIn James Park Qualified $30,000 Ready" [ref=e101]:
                - cell "3" [ref=e102]
                - cell "Import Lead Three" [ref=e103]
                - cell "Gamma Ltd" [ref=e104]
                - cell "three@gamma.com" [ref=e105]
                - cell "LinkedIn" [ref=e106]
                - cell "James Park" [ref=e107]
                - cell "Qualified" [ref=e108]
                - cell "$30,000" [ref=e109]
                - cell "Ready" [ref=e110]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | import { getToken, apiCall } from './helpers'
  3   | import path from 'path'
  4   | 
  5   | const SAMPLE_CSV = path.join(__dirname, 'fixtures', 'sample-import.csv')
  6   | 
  7   | test.describe('Lead Import', () => {
  8   | 
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.goto('/import')
  11  |     await expect(page.locator('header h1')).toHaveText('Import Leads')
  12  |     // Allow Framer Motion upload-step animation to complete
  13  |     await page.waitForTimeout(500)
  14  |   })
  15  | 
  16  |   // ── Upload step ───────────────────────────────────────────────────────────
  17  | 
  18  |   test('shows the upload step by default', async ({ page }) => {
  19  |     await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  20  |   })
  21  | 
  22  |   test('shows step indicator with Upload, Preview, Done labels', async ({ page }) => {
  23  |     // Use exact: true so the locator matches only the specific label span, not its ancestors
  24  |     await expect(page.getByText('Upload', { exact: true })).toBeVisible()
  25  |     await expect(page.getByText('Preview', { exact: true })).toBeVisible()
  26  |     await expect(page.getByText('Done', { exact: true })).toBeVisible()
  27  |   })
  28  | 
  29  |   test('shows supported file type hint', async ({ page }) => {
  30  |     await expect(page.getByText(/xlsx.*xls.*csv/i)).toBeVisible()
  31  |   })
  32  | 
  33  |   test('shows the Recognized Column Names guide', async ({ page }) => {
  34  |     // Use element-specific locators to avoid multi-element matches from ancestor elements
  35  |     await expect(page.locator('h3', { hasText: 'Recognized Column Names' })).toBeVisible()
  36  |     for (const field of ['Lead Name *', 'Company', 'Email', 'Phone', 'Lead Source', 'Salesperson', 'Status', 'Deal Value']) {
  37  |       await expect(page.locator('p.text-xs.font-semibold', { hasText: field })).toBeVisible()
  38  |     }
  39  |   })
  40  | 
  41  |   test('file input accepts xlsx, xls, and csv extensions', async ({ page }) => {
  42  |     const accept = await page.locator('input[type="file"]').getAttribute('accept')
  43  |     expect(accept).toContain('.xlsx')
  44  |     expect(accept).toContain('.xls')
  45  |     expect(accept).toContain('.csv')
  46  |   })
  47  | 
  48  |   test('shows an error for an unsupported file type', async ({ page }) => {
  49  |     const fileInput = page.locator('input[type="file"]')
  50  |     await fileInput.setInputFiles({
  51  |       name: 'document.pdf',
  52  |       mimeType: 'application/pdf',
  53  |       buffer: Buffer.from('fake pdf content'),
  54  |     })
  55  |     await expect(page.getByText(/unsupported file type/i)).toBeVisible()
  56  |   })
  57  | 
  58  |   // ── Preview step ──────────────────────────────────────────────────────────
  59  | 
  60  |   test('uploading a valid CSV transitions to the preview step', async ({ page }) => {
  61  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  62  |     await expect(page.getByText('Rows detected')).toBeVisible({ timeout: 5_000 })
  63  |     await page.waitForTimeout(500)
  64  |     await expect(page.getByText('Will import')).toBeVisible()
  65  |   })
  66  | 
  67  |   test('preview shows the correct detected row count for the sample CSV', async ({ page }) => {
  68  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  69  |     await expect(page.getByText('Rows detected')).toBeVisible({ timeout: 5_000 })
  70  |     // Sample CSV has 3 data rows
  71  |     const detected = page.locator('div').filter({ hasText: /^3$/ }).first()
  72  |     await expect(detected).toBeVisible()
  73  |   })
  74  | 
  75  |   test('preview table shows all expected columns', async ({ page }) => {
  76  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  77  |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  78  |     await page.waitForTimeout(500)
  79  | 
  80  |     const table = page.locator('table').first()
  81  |     for (const col of ['Name', 'Company', 'Email', 'Source', 'Rep', 'Status', 'Value']) {
> 82  |       await expect(table.locator('th', { hasText: col })).toBeVisible()
      |                                                           ^ Error: expect(locator).toBeVisible() failed
  83  |     }
  84  |   })
  85  | 
  86  |   test('preview table lists the lead names from the CSV', async ({ page }) => {
  87  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  88  |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  89  | 
  90  |     await expect(page.getByText('Import Lead One')).toBeVisible()
  91  |     await expect(page.getByText('Import Lead Two')).toBeVisible()
  92  |     await expect(page.getByText('Import Lead Three')).toBeVisible()
  93  |   })
  94  | 
  95  |   test('valid rows show a "Ready" status badge in the preview', async ({ page }) => {
  96  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  97  |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  98  | 
  99  |     const readyBadges = page.locator('span', { hasText: 'Ready' })
  100 |     await expect(readyBadges.first()).toBeVisible()
  101 |     expect(await readyBadges.count()).toBe(3)
  102 |   })
  103 | 
  104 |   test('"Change file" button goes back to the upload step', async ({ page }) => {
  105 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  106 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  107 | 
  108 |     await page.getByRole('button', { name: 'Change file' }).click()
  109 |     await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  110 |   })
  111 | 
  112 |   // ── Import step ───────────────────────────────────────────────────────────
  113 | 
  114 |   test('clicking "Import" POSTs to /api/leads/bulk and shows the done step', async ({ page, request }) => {
  115 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  116 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  117 | 
  118 |     // Intercept the bulk API call to verify it's made correctly
  119 |     let bulkCalled = false
  120 |     await page.route('**/api/leads/bulk', (route) => {
  121 |       bulkCalled = true
  122 |       route.continue()
  123 |     })
  124 | 
  125 |     await page.getByRole('button', { name: /import/i }).click()
  126 |     await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })
  127 |     expect(bulkCalled).toBe(true)
  128 | 
  129 |     // Cleanup — delete the 3 imported leads
  130 |     const token = await getToken(request)
  131 |     const res   = await request.get('http://localhost:3001/api/leads', {
  132 |       headers: { Authorization: `Bearer ${token}` },
  133 |     })
  134 |     const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
  135 |     const imported = leads.filter(l =>
  136 |       ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
  137 |     )
  138 |     for (const l of imported) {
  139 |       await apiCall(request, 'DELETE', `/api/leads/${l.id}`, token)
  140 |     }
  141 |   })
  142 | 
  143 |   test('"View Leads" button on the done step navigates to /leads', async ({ page, request }) => {
  144 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  145 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  146 |     await page.getByRole('button', { name: /import/i }).click()
  147 |     await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })
  148 | 
  149 |     await page.getByRole('button', { name: 'View Leads' }).click()
  150 |     await expect(page).toHaveURL(/\/leads/)
  151 | 
  152 |     // Cleanup
  153 |     const token = await getToken(request)
  154 |     const res   = await request.get('http://localhost:3001/api/leads', {
  155 |       headers: { Authorization: `Bearer ${token}` },
  156 |     })
  157 |     const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
  158 |     const imported = leads.filter(l =>
  159 |       ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
  160 |     )
  161 |     for (const l of imported) {
  162 |       await apiCall(request, 'DELETE', `/api/leads/${l.id}`, token)
  163 |     }
  164 |   })
  165 | 
  166 |   test('"Import more" button on the done step resets to upload step', async ({ page, request }) => {
  167 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  168 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  169 |     await page.getByRole('button', { name: /import/i }).click()
  170 |     await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })
  171 | 
  172 |     await page.getByRole('button', { name: 'Import more' }).click()
  173 |     await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  174 | 
  175 |     // Cleanup
  176 |     const token = await getToken(request)
  177 |     const res   = await request.get('http://localhost:3001/api/leads', {
  178 |       headers: { Authorization: `Bearer ${token}` },
  179 |     })
  180 |     const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
  181 |     const imported = leads.filter(l =>
  182 |       ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
```