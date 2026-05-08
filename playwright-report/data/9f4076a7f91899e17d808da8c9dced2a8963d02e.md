# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports.spec.ts >> Reports >> salesperson table has expected column headers
- Location: tests\reports.spec.ts:31:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Salesperson')
Expected: visible
Error: strict mode violation: getByText('Salesperson') resolved to 2 elements:
    1) <h2 class="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">Salesperson Performance</h2> aka getByRole('heading', { name: 'Salesperson Performance' })
    2) <th class="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Salesperson</th> aka getByRole('columnheader', { name: 'Salesperson' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Salesperson')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
          - heading "Reports" [level=1] [ref=e37]
          - generic [ref=e38]:
            - button "picture_as_pdf Download PDF" [ref=e40] [cursor=pointer]:
              - generic [ref=e41]: picture_as_pdf
              - text: Download PDF
            - button "AD" [ref=e43] [cursor=pointer]
        - generic [ref=e44]:
          - generic [ref=e45]:
            - heading "Lead Status Distribution" [level=2] [ref=e46]
            - img [ref=e49]:
              - generic [ref=e50]:
                - generic [ref=e51]:
                  - img [ref=e53]
                  - img [ref=e55]
                  - img [ref=e57]
                  - img [ref=e59]
                  - img [ref=e61]
                - generic [ref=e62]:
                  - generic [ref=e64]: New 54%
                  - generic [ref=e66]: Contacted 8%
                  - generic [ref=e68]: Qualified 8%
                  - generic [ref=e70]: Won 23%
                  - generic [ref=e72]: Lost 8%
          - generic [ref=e73]:
            - heading "Leads by Source" [level=2] [ref=e74]
            - img [ref=e77]:
              - generic [ref=e81]:
                - generic [ref=e83]: "0"
                - generic [ref=e85]: "1"
                - generic [ref=e87]: "2"
                - generic [ref=e89]: "3"
                - generic [ref=e91]: "4"
              - generic [ref=e93]:
                - generic [ref=e95]: Website
                - generic [ref=e97]: Referral
                - generic [ref=e99]: LinkedIn
                - generic [ref=e101]: Conference
                - generic [ref=e103]: Cold Call
          - generic [ref=e117]:
            - heading "Deal Value by Source ($)" [level=2] [ref=e118]
            - img [ref=e121]:
              - generic [ref=e125]:
                - generic [ref=e127]: $0
                - generic [ref=e129]: $25K
                - generic [ref=e131]: $50K
                - generic [ref=e133]: $75K
                - generic [ref=e135]: $100K
              - generic [ref=e137]:
                - generic [ref=e139]: Website
                - generic [ref=e141]: Referral
                - generic [ref=e143]: LinkedIn
                - generic [ref=e145]: Conference
                - generic [ref=e147]: Cold Call
          - generic [ref=e161]:
            - heading "Salesperson Performance" [level=2] [ref=e162]
            - table [ref=e164]:
              - rowgroup [ref=e165]:
                - row "Salesperson Leads Won Win Rate Won Value" [ref=e166]:
                  - columnheader "Salesperson" [ref=e167]
                  - columnheader "Leads" [ref=e168]
                  - columnheader "Won" [ref=e169]
                  - columnheader "Win Rate" [ref=e170]
                  - columnheader "Won Value" [ref=e171]
              - rowgroup [ref=e172]:
                - row "Alex Chen 2 1 50% $45K" [ref=e173]:
                  - cell "Alex Chen" [ref=e174]
                  - cell "2" [ref=e175]
                  - cell "1" [ref=e176]
                  - cell "50%" [ref=e177]
                  - cell "$45K" [ref=e178]
                - row "Sarah Kim 2 1 50% $54K" [ref=e179]:
                  - cell "Sarah Kim" [ref=e180]
                  - cell "2" [ref=e181]
                  - cell "1" [ref=e182]
                  - cell "50%" [ref=e183]
                  - cell "$54K" [ref=e184]
                - row "James Park 2 0 0% $0" [ref=e185]:
                  - cell "James Park" [ref=e186]
                  - cell "2" [ref=e187]
                  - cell "0" [ref=e188]
                  - cell "0%" [ref=e189]
                  - cell "$0" [ref=e190]
                - row "Maria Lopez 1 1 100% $62K" [ref=e191]:
                  - cell "Maria Lopez" [ref=e192]
                  - cell "1" [ref=e193]
                  - cell "1" [ref=e194]
                  - cell "100%" [ref=e195]
                  - cell "$62K" [ref=e196]
                - row "David Osei 1 0 0% $0" [ref=e197]:
                  - cell "David Osei" [ref=e198]
                  - cell "1" [ref=e199]
                  - cell "0" [ref=e200]
                  - cell "0%" [ref=e201]
                  - cell "$0" [ref=e202]
  - generic [ref=e203]: $0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Reports', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/reports')
  7  |     // Wait for charts to render (Recharts mounts SVG elements)
  8  |     await page.waitForSelector('.recharts-responsive-container', { timeout: 10_000 })
  9  |   })
  10 | 
  11 |   test('shows "Reports" as the page title', async ({ page }) => {
  12 |     await expect(page.locator('header h1')).toHaveText('Reports')
  13 |   })
  14 | 
  15 |   test('renders the "Lead Status Distribution" chart card', async ({ page }) => {
  16 |     await expect(page.getByText('Lead Status Distribution')).toBeVisible()
  17 |   })
  18 | 
  19 |   test('renders the "Leads by Source" chart card', async ({ page }) => {
  20 |     await expect(page.getByText('Leads by Source')).toBeVisible()
  21 |   })
  22 | 
  23 |   test('renders the "Deal Value by Source" chart card', async ({ page }) => {
  24 |     await expect(page.getByText('Deal Value by Source ($)')).toBeVisible()
  25 |   })
  26 | 
  27 |   test('renders the "Salesperson Performance" table card', async ({ page }) => {
  28 |     await expect(page.getByText('Salesperson Performance')).toBeVisible()
  29 |   })
  30 | 
  31 |   test('salesperson table has expected column headers', async ({ page }) => {
  32 |     for (const header of ['Salesperson', 'Leads', 'Won', 'Win Rate', 'Won Value']) {
> 33 |       await expect(page.getByText(header)).toBeVisible()
     |                                            ^ Error: expect(locator).toBeVisible() failed
  34 |     }
  35 |   })
  36 | 
  37 |   test('salesperson table lists at least one rep with data', async ({ page }) => {
  38 |     const rows = page.locator('table tbody tr')
  39 |     await expect(rows.first()).toBeVisible()
  40 |     const repName = await rows.first().locator('td').first().textContent()
  41 |     expect(repName?.trim().length).toBeGreaterThan(0)
  42 |   })
  43 | 
  44 |   test('status pie chart renders an SVG', async ({ page }) => {
  45 |     // First Recharts container holds the pie chart
  46 |     const pie = page.locator('.recharts-responsive-container').first()
  47 |     await expect(pie.locator('svg')).toBeVisible()
  48 |   })
  49 | 
  50 |   test('bar charts render SVG elements', async ({ page }) => {
  51 |     const bars = page.locator('.recharts-responsive-container')
  52 |     const count = await bars.count()
  53 |     expect(count).toBeGreaterThanOrEqual(3)
  54 |   })
  55 | 
  56 |   test('"Download PDF" button is visible in the header', async ({ page }) => {
  57 |     await expect(page.getByRole('button', { name: /download pdf/i })).toBeVisible()
  58 |   })
  59 | 
  60 |   test('"Download PDF" button triggers a download', async ({ page }) => {
  61 |     const [download] = await Promise.all([
  62 |       page.waitForEvent('download', { timeout: 30_000 }),
  63 |       page.getByRole('button', { name: /download pdf/i }).click(),
  64 |     ])
  65 |     expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  66 |   })
  67 | 
  68 |   test('reports reflect the actual number of leads in the database', async ({ page, request }) => {
  69 |     const token = await page.evaluate(() => localStorage.getItem('crm_token'))
  70 |     const res   = await request.get('http://localhost:3001/api/leads', {
  71 |       headers: { Authorization: `Bearer ${token}` },
  72 |     })
  73 |     const leads = await res.json()
  74 |     const wonCount = leads.filter((l: { status: string }) => l.status === 'Won').length
  75 | 
  76 |     // The "Salesperson Performance" table total "Won" column should sum to wonCount
  77 |     const wonCells = page.locator('table tbody tr td:nth-child(3)')
  78 |     let tableWon = 0
  79 |     const cells = await wonCells.all()
  80 |     for (const cell of cells) {
  81 |       tableWon += Number(await cell.textContent())
  82 |     }
  83 |     expect(tableWon).toBe(wonCount)
  84 |   })
  85 | 
  86 | })
  87 | 
```