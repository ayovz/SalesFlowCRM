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

Locator: getByText('Rep')
Expected: visible
Error: strict mode violation: getByText('Rep') resolved to 2 elements:
    1) <span class="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors↵                text-white/55 hover:text-white hover:bg-white/10">…</span> aka getByRole('link', { name: 'bar_chart Reports' })
    2) <th class="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant whitespace-nowrap">Rep</th> aka getByRole('columnheader', { name: 'Rep' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Rep')

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
  12  |   })
  13  | 
  14  |   // ── Upload step ───────────────────────────────────────────────────────────
  15  | 
  16  |   test('shows the upload step by default', async ({ page }) => {
  17  |     await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  18  |   })
  19  | 
  20  |   test('shows step indicator with Upload, Preview, Done labels', async ({ page }) => {
  21  |     await expect(page.getByText('Upload')).toBeVisible()
  22  |     await expect(page.getByText('Preview')).toBeVisible()
  23  |     await expect(page.getByText('Done')).toBeVisible()
  24  |   })
  25  | 
  26  |   test('shows supported file type hint', async ({ page }) => {
  27  |     await expect(page.getByText(/xlsx.*xls.*csv/i)).toBeVisible()
  28  |   })
  29  | 
  30  |   test('shows the Recognized Column Names guide', async ({ page }) => {
  31  |     await expect(page.getByText('Recognized Column Names')).toBeVisible()
  32  |     await expect(page.getByText('Lead Name *')).toBeVisible()
  33  |     await expect(page.getByText('Company')).toBeVisible()
  34  |     await expect(page.getByText('Email')).toBeVisible()
  35  |     await expect(page.getByText('Phone')).toBeVisible()
  36  |     await expect(page.getByText('Lead Source')).toBeVisible()
  37  |     await expect(page.getByText('Salesperson')).toBeVisible()
  38  |     await expect(page.getByText('Status')).toBeVisible()
  39  |     await expect(page.getByText('Deal Value')).toBeVisible()
  40  |   })
  41  | 
  42  |   test('file input accepts xlsx, xls, and csv extensions', async ({ page }) => {
  43  |     const accept = await page.locator('input[type="file"]').getAttribute('accept')
  44  |     expect(accept).toContain('.xlsx')
  45  |     expect(accept).toContain('.xls')
  46  |     expect(accept).toContain('.csv')
  47  |   })
  48  | 
  49  |   test('shows an error for an unsupported file type', async ({ page }) => {
  50  |     const fileInput = page.locator('input[type="file"]')
  51  |     await fileInput.setInputFiles({
  52  |       name: 'document.pdf',
  53  |       mimeType: 'application/pdf',
  54  |       buffer: Buffer.from('fake pdf content'),
  55  |     })
  56  |     await expect(page.getByText(/unsupported file type/i)).toBeVisible()
  57  |   })
  58  | 
  59  |   // ── Preview step ──────────────────────────────────────────────────────────
  60  | 
  61  |   test('uploading a valid CSV transitions to the preview step', async ({ page }) => {
  62  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  63  |     await expect(page.getByText('Rows detected')).toBeVisible({ timeout: 5_000 })
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
  78  | 
  79  |     for (const col of ['Name', 'Company', 'Email', 'Source', 'Rep', 'Status', 'Value']) {
> 80  |       await expect(page.getByText(col)).toBeVisible()
      |                                         ^ Error: expect(locator).toBeVisible() failed
  81  |     }
  82  |   })
  83  | 
  84  |   test('preview table lists the lead names from the CSV', async ({ page }) => {
  85  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  86  |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  87  | 
  88  |     await expect(page.getByText('Import Lead One')).toBeVisible()
  89  |     await expect(page.getByText('Import Lead Two')).toBeVisible()
  90  |     await expect(page.getByText('Import Lead Three')).toBeVisible()
  91  |   })
  92  | 
  93  |   test('valid rows show a "Ready" status badge in the preview', async ({ page }) => {
  94  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  95  |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  96  | 
  97  |     const readyBadges = page.locator('span', { hasText: 'Ready' })
  98  |     await expect(readyBadges.first()).toBeVisible()
  99  |     expect(await readyBadges.count()).toBe(3)
  100 |   })
  101 | 
  102 |   test('"Change file" button goes back to the upload step', async ({ page }) => {
  103 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  104 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  105 | 
  106 |     await page.getByRole('button', { name: 'Change file' }).click()
  107 |     await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  108 |   })
  109 | 
  110 |   // ── Import step ───────────────────────────────────────────────────────────
  111 | 
  112 |   test('clicking "Import" POSTs to /api/leads/bulk and shows the done step', async ({ page, request }) => {
  113 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  114 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  115 | 
  116 |     // Intercept the bulk API call to verify it's made correctly
  117 |     let bulkCalled = false
  118 |     await page.route('**/api/leads/bulk', (route) => {
  119 |       bulkCalled = true
  120 |       route.continue()
  121 |     })
  122 | 
  123 |     await page.getByRole('button', { name: /import/i }).click()
  124 |     await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })
  125 |     expect(bulkCalled).toBe(true)
  126 | 
  127 |     // Cleanup — delete the 3 imported leads
  128 |     const token = await getToken(request)
  129 |     const res   = await request.get('http://localhost:3001/api/leads', {
  130 |       headers: { Authorization: `Bearer ${token}` },
  131 |     })
  132 |     const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
  133 |     const imported = leads.filter(l =>
  134 |       ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
  135 |     )
  136 |     for (const l of imported) {
  137 |       await apiCall(request, 'DELETE', `/api/leads/${l.id}`, token)
  138 |     }
  139 |   })
  140 | 
  141 |   test('"View Leads" button on the done step navigates to /leads', async ({ page, request }) => {
  142 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  143 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  144 |     await page.getByRole('button', { name: /import/i }).click()
  145 |     await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })
  146 | 
  147 |     await page.getByRole('button', { name: 'View Leads' }).click()
  148 |     await expect(page).toHaveURL(/\/leads/)
  149 | 
  150 |     // Cleanup
  151 |     const token = await getToken(request)
  152 |     const res   = await request.get('http://localhost:3001/api/leads', {
  153 |       headers: { Authorization: `Bearer ${token}` },
  154 |     })
  155 |     const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
  156 |     const imported = leads.filter(l =>
  157 |       ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
  158 |     )
  159 |     for (const l of imported) {
  160 |       await apiCall(request, 'DELETE', `/api/leads/${l.id}`, token)
  161 |     }
  162 |   })
  163 | 
  164 |   test('"Import more" button on the done step resets to upload step', async ({ page, request }) => {
  165 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_CSV)
  166 |     await page.waitForSelector('text=Rows detected', { timeout: 5_000 })
  167 |     await page.getByRole('button', { name: /import/i }).click()
  168 |     await expect(page.getByText(/leads imported/i)).toBeVisible({ timeout: 10_000 })
  169 | 
  170 |     await page.getByRole('button', { name: 'Import more' }).click()
  171 |     await expect(page.getByText('Drop your file here or click to browse')).toBeVisible()
  172 | 
  173 |     // Cleanup
  174 |     const token = await getToken(request)
  175 |     const res   = await request.get('http://localhost:3001/api/leads', {
  176 |       headers: { Authorization: `Bearer ${token}` },
  177 |     })
  178 |     const leads = (await res.json()) as Array<{ id: number; lead_name: string }>
  179 |     const imported = leads.filter(l =>
  180 |       ['Import Lead One', 'Import Lead Two', 'Import Lead Three'].includes(l.lead_name),
```