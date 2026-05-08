# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.ts >> Analytics & Insights >> "PDF" export triggers a download
- Location: tests\analytics.spec.ts:110:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^pdf$/i })

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
          - generic [ref=e20]:
            - generic [ref=e21]: bar_chart
            - text: Reports
        - link "insights Analytics" [ref=e22] [cursor=pointer]:
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
          - heading "Analytics" [level=1] [ref=e37]
          - generic [ref=e38]:
            - generic [ref=e39]:
              - button "download CSV" [ref=e40] [cursor=pointer]:
                - generic [ref=e41]: download
                - text: CSV
              - button "picture_as_pdf PDF" [ref=e42] [cursor=pointer]:
                - generic [ref=e43]: picture_as_pdf
                - text: PDF
            - button "AD" [ref=e45] [cursor=pointer]
        - generic [ref=e46]:
          - generic [ref=e47]:
            - combobox [ref=e48]:
              - option "Last 7 days"
              - option "Last 30 days" [selected]
              - option "Last 90 days"
              - option "Last 180 days"
            - combobox [ref=e49]:
              - option "All Sources" [selected]
              - option "Website"
              - option "Referral"
              - option "LinkedIn"
              - option "Conference"
              - option "Cold Call"
              - option "Email Campaign"
              - option "Other"
            - combobox [ref=e50]:
              - option "All Reps" [selected]
              - option "Alex Chen"
              - option "Sarah Kim"
              - option "James Park"
              - option "Maria Lopez"
              - option "David Osei"
            - button "refresh Refresh" [ref=e51] [cursor=pointer]:
              - generic [ref=e52]: refresh
              - text: Refresh
          - generic [ref=e53]:
            - generic [ref=e54]:
              - generic [ref=e56]: people
              - generic [ref=e57]:
                - generic [ref=e58]: "13"
                - generic [ref=e59]: Total Leads
            - generic [ref=e60]:
              - generic [ref=e62]: emoji_events
              - generic [ref=e63]:
                - generic [ref=e64]: "3"
                - generic [ref=e65]: Won Deals
            - generic [ref=e66]:
              - generic [ref=e68]: percent
              - generic [ref=e69]:
                - generic [ref=e70]: 23%
                - generic [ref=e71]: Conversion Rate
            - generic [ref=e72]:
              - generic [ref=e74]: savings
              - generic [ref=e75]:
                - generic [ref=e76]: $54K
                - generic [ref=e77]: Avg Won Value
          - generic [ref=e78]:
            - generic [ref=e80]:
              - generic [ref=e81]:
                - heading "Lead Volume Trend" [level=2] [ref=e82]
                - button "download SVG" [ref=e83] [cursor=pointer]:
                  - generic [ref=e84]: download
                  - text: SVG
              - generic [ref=e87]:
                - img [ref=e88]:
                  - generic [ref=e92]:
                    - generic [ref=e94]: 4/9
                    - generic [ref=e96]: 4/15
                    - generic [ref=e98]: 4/21
                    - generic [ref=e100]: 4/27
                    - generic [ref=e102]: 5/3
                  - generic [ref=e104]:
                    - generic [ref=e106]: "0"
                    - generic [ref=e108]: "2"
                    - generic [ref=e110]: "4"
                    - generic [ref=e112]: "6"
                    - generic [ref=e114]: "8"
                - list [ref=e120]:
                  - listitem [ref=e121]:
                    - img [ref=e122]
                    - text: Actual
                  - listitem [ref=e124]:
                    - img [ref=e125]
                    - text: Trend
            - generic [ref=e128]:
              - heading "Conversion Funnel" [level=2] [ref=e130]
              - generic [ref=e131]:
                - generic [ref=e132]:
                  - generic [ref=e133]: New
                  - generic [ref=e135]: "7"
                - generic [ref=e136]:
                  - generic [ref=e137]: Contacted
                  - generic [ref=e139]: "1"
                  - generic [ref=e141]: "-86%"
                - generic [ref=e142]:
                  - generic [ref=e143]: Qualified
                  - generic [ref=e145]: "1"
                  - generic [ref=e147]: 0%
                - generic [ref=e148]:
                  - generic [ref=e149]: Proposal Sent
                  - generic [ref=e151]: "0"
                  - generic [ref=e153]: "-100%"
                - generic [ref=e154]:
                  - generic [ref=e155]: Won
                  - generic [ref=e157]: "3"
                - generic [ref=e158]:
                  - generic [ref=e159]: Lost
                  - generic [ref=e161]: "1"
                  - generic [ref=e163]: "-67%"
          - generic [ref=e164]:
            - generic [ref=e165]:
              - generic [ref=e166]:
                - heading "Win Rate by Source" [level=2] [ref=e167]
                - button "download SVG" [ref=e168] [cursor=pointer]:
                  - generic [ref=e169]: download
                  - text: SVG
              - img [ref=e173]:
                - generic [ref=e177]:
                  - generic [ref=e179]: 0%
                  - generic [ref=e181]: 25%
                  - generic [ref=e183]: 50%
                  - generic [ref=e185]: 75%
                  - generic [ref=e187]: 100%
                - generic [ref=e189]:
                  - generic [ref=e191]: Website
                  - generic [ref=e193]: Referral
                  - generic [ref=e195]: LinkedIn
                  - generic [ref=e197]: Conference
                  - generic [ref=e199]: Cold Call
            - generic [ref=e209]:
              - generic [ref=e210]:
                - heading "Salesperson Performance" [level=2] [ref=e211]
                - button "download SVG" [ref=e212] [cursor=pointer]:
                  - generic [ref=e213]: download
                  - text: SVG
              - table [ref=e215]:
                - rowgroup [ref=e216]:
                  - row "Rep Leads Won Win Rate Value" [ref=e217]:
                    - columnheader "Rep" [ref=e218]
                    - columnheader "Leads" [ref=e219]
                    - columnheader "Won" [ref=e220]
                    - columnheader "Win Rate" [ref=e221]
                    - columnheader "Value" [ref=e222]
                - rowgroup [ref=e223]:
                  - row "Alex Chen 2 1 50% $54K" [ref=e224]:
                    - cell "Alex Chen" [ref=e225]
                    - cell "2" [ref=e226]
                    - cell "1" [ref=e227]
                    - cell "50%" [ref=e228]:
                      - generic [ref=e229]: 50%
                    - cell "$54K" [ref=e230]
                  - row "Sarah Kim 2 1 50% $54K" [ref=e231]:
                    - cell "Sarah Kim" [ref=e232]
                    - cell "2" [ref=e233]
                    - cell "1" [ref=e234]
                    - cell "50%" [ref=e235]:
                      - generic [ref=e236]: 50%
                    - cell "$54K" [ref=e237]
                  - row "James Park 2 0 0% $0" [ref=e238]:
                    - cell "James Park" [ref=e239]
                    - cell "2" [ref=e240]
                    - cell "0" [ref=e241]
                    - cell "0%" [ref=e242]:
                      - generic [ref=e243]: 0%
                    - cell "$0" [ref=e244]
                  - row "Maria Lopez 1 1 100% $54K" [ref=e245]:
                    - cell "Maria Lopez" [ref=e246]
                    - cell "1" [ref=e247]
                    - cell "1" [ref=e248]
                    - cell "100%" [ref=e249]:
                      - generic [ref=e250]: 100%
                    - cell "$54K" [ref=e251]
                  - row "David Osei 1 0 0% $0" [ref=e252]:
                    - cell "David Osei" [ref=e253]
                    - cell "1" [ref=e254]
                    - cell "0" [ref=e255]
                    - cell "0%" [ref=e256]:
                      - generic [ref=e257]: 0%
                    - cell "$0" [ref=e258]
          - generic [ref=e259]:
            - generic [ref=e260]:
              - heading "Recent Activity" [level=2] [ref=e261]
              - button "download CSV" [ref=e262] [cursor=pointer]:
                - generic [ref=e263]: download
                - text: CSV
            - table [ref=e265]:
              - rowgroup [ref=e266]:
                - row "Action Lead Details By When" [ref=e267]:
                  - columnheader "Action" [ref=e268]
                  - columnheader "Lead" [ref=e269]
                  - columnheader "Details" [ref=e270]
                  - columnheader "By" [ref=e271]
                  - columnheader "When" [ref=e272]
              - rowgroup [ref=e273]:
                - row "add_circle Lead Created Alex Chen Lead imported from XLSX admin@example.com 7h ago" [ref=e274]:
                  - cell "add_circle Lead Created" [ref=e275]:
                    - generic [ref=e276]:
                      - generic [ref=e278]: add_circle
                      - generic [ref=e279]: Lead Created
                  - cell "Alex Chen" [ref=e280]
                  - cell "Lead imported from XLSX" [ref=e281]
                  - cell "admin@example.com" [ref=e282]
                  - cell "7h ago" [ref=e283]
                - row "add_circle Lead Created Sarah Kim Lead imported from XLSX admin@example.com 7h ago" [ref=e284]:
                  - cell "add_circle Lead Created" [ref=e285]:
                    - generic [ref=e286]:
                      - generic [ref=e288]: add_circle
                      - generic [ref=e289]: Lead Created
                  - cell "Sarah Kim" [ref=e290]
                  - cell "Lead imported from XLSX" [ref=e291]
                  - cell "admin@example.com" [ref=e292]
                  - cell "7h ago" [ref=e293]
                - row "add_circle Lead Created James Park Lead imported from XLSX admin@example.com 7h ago" [ref=e294]:
                  - cell "add_circle Lead Created" [ref=e295]:
                    - generic [ref=e296]:
                      - generic [ref=e298]: add_circle
                      - generic [ref=e299]: Lead Created
                  - cell "James Park" [ref=e300]
                  - cell "Lead imported from XLSX" [ref=e301]
                  - cell "admin@example.com" [ref=e302]
                  - cell "7h ago" [ref=e303]
                - row "add_circle Lead Created Maria Lopez Lead imported from XLSX admin@example.com 7h ago" [ref=e304]:
                  - cell "add_circle Lead Created" [ref=e305]:
                    - generic [ref=e306]:
                      - generic [ref=e308]: add_circle
                      - generic [ref=e309]: Lead Created
                  - cell "Maria Lopez" [ref=e310]
                  - cell "Lead imported from XLSX" [ref=e311]
                  - cell "admin@example.com" [ref=e312]
                  - cell "7h ago" [ref=e313]
                - row "add_circle Lead Created David Osei Lead imported from XLSX admin@example.com 7h ago" [ref=e314]:
                  - cell "add_circle Lead Created" [ref=e315]:
                    - generic [ref=e316]:
                      - generic [ref=e318]: add_circle
                      - generic [ref=e319]: Lead Created
                  - cell "David Osei" [ref=e320]
                  - cell "Lead imported from XLSX" [ref=e321]
                  - cell "admin@example.com" [ref=e322]
                  - cell "7h ago" [ref=e323]
                - row "swap_horiz Status Changed David Lee Status changed from Contacted to Won admin@example.com 16h ago" [ref=e324]:
                  - cell "swap_horiz Status Changed" [ref=e325]:
                    - generic [ref=e326]:
                      - generic [ref=e328]: swap_horiz
                      - generic [ref=e329]: Status Changed
                  - cell "David Lee" [ref=e330]
                  - cell "Status changed from Contacted to Won" [ref=e331]
                  - cell "admin@example.com" [ref=e332]
                  - cell "16h ago" [ref=e333]
                - row "swap_horiz Status Changed Eva Martinez Status changed from Proposal Sent to Qualified admin@example.com 16h ago" [ref=e334]:
                  - cell "swap_horiz Status Changed" [ref=e335]:
                    - generic [ref=e336]:
                      - generic [ref=e338]: swap_horiz
                      - generic [ref=e339]: Status Changed
                  - cell "Eva Martinez" [ref=e340]
                  - cell "Status changed from Proposal Sent to Qualified" [ref=e341]
                  - cell "admin@example.com" [ref=e342]
                  - cell "16h ago" [ref=e343]
                - row "swap_horiz Status Changed Bob Smith Status changed from Qualified to New admin@example.com 16h ago" [ref=e344]:
                  - cell "swap_horiz Status Changed" [ref=e345]:
                    - generic [ref=e346]:
                      - generic [ref=e348]: swap_horiz
                      - generic [ref=e349]: Status Changed
                  - cell "Bob Smith" [ref=e350]
                  - cell "Status changed from Qualified to New" [ref=e351]
                  - cell "admin@example.com" [ref=e352]
                  - cell "16h ago" [ref=e353]
                - row "swap_horiz Status Changed David Lee Status changed from New to Contacted admin@example.com 16h ago" [ref=e354]:
                  - cell "swap_horiz Status Changed" [ref=e355]:
                    - generic [ref=e356]:
                      - generic [ref=e358]: swap_horiz
                      - generic [ref=e359]: Status Changed
                  - cell "David Lee" [ref=e360]
                  - cell "Status changed from New to Contacted" [ref=e361]
                  - cell "admin@example.com" [ref=e362]
                  - cell "16h ago" [ref=e363]
  - generic [ref=e364]: Website
```

# Test source

```ts
  13  |   })
  14  | 
  15  |   test('renders all 4 summary stat cards', async ({ page }) => {
  16  |     const labels = ['Total Leads', 'Won Deals', 'Conversion Rate', 'Avg Won Value']
  17  |     for (const label of labels) {
  18  |       await expect(page.getByText(label)).toBeVisible()
  19  |     }
  20  |   })
  21  | 
  22  |   test('Total Leads stat matches API', async ({ page, request }) => {
  23  |     const token = await page.evaluate(() => localStorage.getItem('crm_token'))
  24  |     const res   = await request.get('http://localhost:3001/api/insights?period=30', {
  25  |       headers: { Authorization: `Bearer ${token}` },
  26  |     })
  27  |     const data = await res.json()
  28  |     await expect(page.getByText(String(data.summary.total)).first()).toBeVisible()
  29  |   })
  30  | 
  31  |   test('renders the "Lead Volume Trend" chart card', async ({ page }) => {
  32  |     await expect(page.getByText('Lead Volume Trend')).toBeVisible()
  33  |     const chart = page.locator('.recharts-responsive-container').first()
  34  |     await expect(chart.locator('svg')).toBeVisible()
  35  |   })
  36  | 
  37  |   test('renders the "Conversion Funnel" card with all 6 stages', async ({ page }) => {
  38  |     await expect(page.getByText('Conversion Funnel')).toBeVisible()
  39  |     for (const stage of ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']) {
  40  |       await expect(page.getByText(stage).first()).toBeVisible()
  41  |     }
  42  |   })
  43  | 
  44  |   test('renders the "Win Rate by Source" chart card', async ({ page }) => {
  45  |     await expect(page.getByText('Win Rate by Source')).toBeVisible()
  46  |   })
  47  | 
  48  |   test('renders the "Salesperson Performance" card', async ({ page }) => {
  49  |     await expect(page.getByText('Salesperson Performance')).toBeVisible()
  50  |   })
  51  | 
  52  |   test('renders the "Recent Activity" table', async ({ page }) => {
  53  |     await expect(page.getByText('Recent Activity')).toBeVisible()
  54  |     // Table headers
  55  |     for (const h of ['Action', 'Lead', 'Details', 'By', 'When']) {
  56  |       await expect(page.getByText(h)).toBeVisible()
  57  |     }
  58  |   })
  59  | 
  60  |   test('period filter — switching to "Last 7 days" reloads data', async ({ page }) => {
  61  |     const select = page.locator('select').filter({ hasText: 'Last 30 days' })
  62  |     await select.selectOption('7')
  63  |     // Loading spinner or updated data — just verify no error shown
  64  |     await page.waitForTimeout(1_000)
  65  |     await expect(page.locator('.text-red-700')).not.toBeVisible()
  66  |     await expect(page.getByText('Total Leads')).toBeVisible()
  67  |   })
  68  | 
  69  |   test('source filter narrows displayed data', async ({ page }) => {
  70  |     await page.locator('select').filter({ hasText: 'All Sources' }).selectOption('Website')
  71  |     await page.waitForTimeout(800)
  72  |     await expect(page.locator('.text-red-700')).not.toBeVisible()
  73  |     await expect(page.getByText('Total Leads')).toBeVisible()
  74  |   })
  75  | 
  76  |   test('salesperson filter narrows displayed data', async ({ page }) => {
  77  |     await page.locator('select').filter({ hasText: 'All Reps' }).selectOption('Alex Chen')
  78  |     await page.waitForTimeout(800)
  79  |     await expect(page.locator('.text-red-700')).not.toBeVisible()
  80  |   })
  81  | 
  82  |   test('"Refresh" button reloads the insights data', async ({ page }) => {
  83  |     await page.getByRole('button', { name: /refresh/i }).click()
  84  |     await page.waitForTimeout(500)
  85  |     await expect(page.getByText('Total Leads')).toBeVisible()
  86  |     await expect(page.locator('.text-red-700')).not.toBeVisible()
  87  |   })
  88  | 
  89  |   test('"CSV" download button is visible in the header', async ({ page }) => {
  90  |     await expect(page.getByRole('button', { name: /^csv$/i })).toBeVisible()
  91  |   })
  92  | 
  93  |   test('"PDF" download button is visible in the header', async ({ page }) => {
  94  |     await expect(page.getByRole('button', { name: /^pdf$/i })).toBeVisible()
  95  |   })
  96  | 
  97  |   test('SVG download button on Lead Volume Trend chart is visible', async ({ page }) => {
  98  |     const trendCard = page.locator('.glass-card').filter({ hasText: 'Lead Volume Trend' })
  99  |     await expect(trendCard.getByText('SVG')).toBeVisible()
  100 |   })
  101 | 
  102 |   test('"CSV" activity-log download returns a CSV file', async ({ page }) => {
  103 |     const [download] = await Promise.all([
  104 |       page.waitForEvent('download'),
  105 |       page.getByRole('button', { name: /^csv$/i }).click(),
  106 |     ])
  107 |     expect(download.suggestedFilename()).toMatch(/\.csv$/)
  108 |   })
  109 | 
  110 |   test('"PDF" export triggers a download', async ({ page }) => {
  111 |     const [download] = await Promise.all([
  112 |       page.waitForEvent('download', { timeout: 30_000 }),
> 113 |       page.getByRole('button', { name: /^pdf$/i }).click(),
      |                                                    ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  114 |     ])
  115 |     expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  116 |   })
  117 | 
  118 | })
  119 | 
```