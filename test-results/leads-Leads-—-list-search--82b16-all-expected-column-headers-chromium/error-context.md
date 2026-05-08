# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leads.spec.ts >> Leads — list, search, filters >> shows the table with all expected column headers
- Location: tests\leads.spec.ts:15:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Status')
Expected: visible
Error: strict mode violation: getByText('Status') resolved to 2 elements:
    1) <option value="">All Statuses</option> aka getByRole('combobox').first()
    2) <th class="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Status</th> aka getByRole('columnheader', { name: 'Status' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Status')

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
        - heading "Leads" [level=1] [ref=e37]
        - generic [ref=e38]:
          - generic [ref=e39]:
            - button "download Export" [ref=e40] [cursor=pointer]:
              - generic [ref=e41]: download
              - text: Export
            - link "add New Lead" [ref=e42] [cursor=pointer]:
              - /url: /leads/new
              - button "add New Lead" [ref=e43]:
                - generic [ref=e44]: add
                - text: New Lead
          - button "AD" [ref=e46] [cursor=pointer]
      - generic [ref=e47]:
        - generic [ref=e48]:
          - generic [ref=e49]: search
          - textbox "Search name, company, email…" [ref=e50]
        - combobox [ref=e51]:
          - option "All Statuses" [selected]
          - option "New"
          - option "Contacted"
          - option "Qualified"
          - option "Proposal Sent"
          - option "Won"
          - option "Lost"
        - combobox [ref=e52]:
          - option "All Sources" [selected]
          - option "Website"
          - option "Referral"
          - option "LinkedIn"
          - option "Conference"
          - option "Cold Call"
          - option "Email Campaign"
          - option "Other"
        - combobox [ref=e53]:
          - option "All Reps" [selected]
          - option "Alex Chen"
          - option "Sarah Kim"
          - option "James Park"
          - option "Maria Lopez"
          - option "David Osei"
      - generic [ref=e54]:
        - table [ref=e56]:
          - rowgroup [ref=e57]:
            - row "Name / Company Status Source Salesperson Deal Value" [ref=e58]:
              - columnheader "Name / Company" [ref=e59]
              - columnheader "Status" [ref=e60]
              - columnheader "Source" [ref=e61]
              - columnheader "Salesperson" [ref=e62]
              - columnheader "Deal Value" [ref=e63]
              - columnheader [ref=e64]
          - rowgroup [ref=e65]:
            - row "Alex Chen — New — — — edit delete" [ref=e66] [cursor=pointer]:
              - cell "Alex Chen —" [ref=e67]:
                - generic [ref=e68]: Alex Chen
                - generic [ref=e69]: —
              - cell "New" [ref=e70]:
                - generic [ref=e71]: New
              - cell "—" [ref=e72]
              - cell "—" [ref=e73]
              - cell "—" [ref=e74]
              - cell "edit delete" [ref=e75]:
                - generic [ref=e76]:
                  - button "edit" [ref=e77]:
                    - generic [ref=e78]: edit
                  - button "delete" [ref=e79]:
                    - generic [ref=e80]: delete
            - row "Sarah Kim — New — — — edit delete" [ref=e81] [cursor=pointer]:
              - cell "Sarah Kim —" [ref=e82]:
                - generic [ref=e83]: Sarah Kim
                - generic [ref=e84]: —
              - cell "New" [ref=e85]:
                - generic [ref=e86]: New
              - cell "—" [ref=e87]
              - cell "—" [ref=e88]
              - cell "—" [ref=e89]
              - cell "edit delete" [ref=e90]:
                - generic [ref=e91]:
                  - button "edit" [ref=e92]:
                    - generic [ref=e93]: edit
                  - button "delete" [ref=e94]:
                    - generic [ref=e95]: delete
            - row "James Park — New — — — edit delete" [ref=e96] [cursor=pointer]:
              - cell "James Park —" [ref=e97]:
                - generic [ref=e98]: James Park
                - generic [ref=e99]: —
              - cell "New" [ref=e100]:
                - generic [ref=e101]: New
              - cell "—" [ref=e102]
              - cell "—" [ref=e103]
              - cell "—" [ref=e104]
              - cell "edit delete" [ref=e105]:
                - generic [ref=e106]:
                  - button "edit" [ref=e107]:
                    - generic [ref=e108]: edit
                  - button "delete" [ref=e109]:
                    - generic [ref=e110]: delete
            - row "Maria Lopez — New — — — edit delete" [ref=e111] [cursor=pointer]:
              - cell "Maria Lopez —" [ref=e112]:
                - generic [ref=e113]: Maria Lopez
                - generic [ref=e114]: —
              - cell "New" [ref=e115]:
                - generic [ref=e116]: New
              - cell "—" [ref=e117]
              - cell "—" [ref=e118]
              - cell "—" [ref=e119]
              - cell "edit delete" [ref=e120]:
                - generic [ref=e121]:
                  - button "edit" [ref=e122]:
                    - generic [ref=e123]: edit
                  - button "delete" [ref=e124]:
                    - generic [ref=e125]: delete
            - row "David Osei — New — — — edit delete" [ref=e126] [cursor=pointer]:
              - cell "David Osei —" [ref=e127]:
                - generic [ref=e128]: David Osei
                - generic [ref=e129]: —
              - cell "New" [ref=e130]:
                - generic [ref=e131]: New
              - cell "—" [ref=e132]
              - cell "—" [ref=e133]
              - cell "—" [ref=e134]
              - cell "edit delete" [ref=e135]:
                - generic [ref=e136]:
                  - button "edit" [ref=e137]:
                    - generic [ref=e138]: edit
                  - button "delete" [ref=e139]:
                    - generic [ref=e140]: delete
            - row "Alice Johnson TechCorp Won Website Alex Chen $45K edit delete" [ref=e141] [cursor=pointer]:
              - cell "Alice Johnson TechCorp" [ref=e142]:
                - generic [ref=e143]: Alice Johnson
                - generic [ref=e144]: TechCorp
              - cell "Won" [ref=e145]:
                - generic [ref=e146]: Won
              - cell "Website" [ref=e147]
              - cell "Alex Chen" [ref=e148]
              - cell "$45K" [ref=e149]
              - cell "edit delete" [ref=e150]:
                - generic [ref=e151]:
                  - button "edit" [ref=e152]:
                    - generic [ref=e153]: edit
                  - button "delete" [ref=e154]:
                    - generic [ref=e155]: delete
            - row "Bob Smith DataFlow Inc New Referral Sarah Kim $28K edit delete" [ref=e156] [cursor=pointer]:
              - cell "Bob Smith DataFlow Inc" [ref=e157]:
                - generic [ref=e158]: Bob Smith
                - generic [ref=e159]: DataFlow Inc
              - cell "New" [ref=e160]:
                - generic [ref=e161]: New
              - cell "Referral" [ref=e162]
              - cell "Sarah Kim" [ref=e163]
              - cell "$28K" [ref=e164]
              - cell "edit delete" [ref=e165]:
                - generic [ref=e166]:
                  - button "edit" [ref=e167]:
                    - generic [ref=e168]: edit
                  - button "delete" [ref=e169]:
                    - generic [ref=e170]: delete
            - row "Carol White Streamline Contacted LinkedIn James Park $15K edit delete" [ref=e171] [cursor=pointer]:
              - cell "Carol White Streamline" [ref=e172]:
                - generic [ref=e173]: Carol White
                - generic [ref=e174]: Streamline
              - cell "Contacted" [ref=e175]:
                - generic [ref=e176]: Contacted
              - cell "LinkedIn" [ref=e177]
              - cell "James Park" [ref=e178]
              - cell "$15K" [ref=e179]
              - cell "edit delete" [ref=e180]:
                - generic [ref=e181]:
                  - button "edit" [ref=e182]:
                    - generic [ref=e183]: edit
                  - button "delete" [ref=e184]:
                    - generic [ref=e185]: delete
            - row "David Lee NovaSystems Won Conference Maria Lopez $62K edit delete" [ref=e186] [cursor=pointer]:
              - cell "David Lee NovaSystems" [ref=e187]:
                - generic [ref=e188]: David Lee
                - generic [ref=e189]: NovaSystems
              - cell "Won" [ref=e190]:
                - generic [ref=e191]: Won
              - cell "Conference" [ref=e192]
              - cell "Maria Lopez" [ref=e193]
              - cell "$62K" [ref=e194]
              - cell "edit delete" [ref=e195]:
                - generic [ref=e196]:
                  - button "edit" [ref=e197]:
                    - generic [ref=e198]: edit
                  - button "delete" [ref=e199]:
                    - generic [ref=e200]: delete
            - row "Eva Martinez CloudPeak Qualified Cold Call David Osei $33K edit delete" [ref=e201] [cursor=pointer]:
              - cell "Eva Martinez CloudPeak" [ref=e202]:
                - generic [ref=e203]: Eva Martinez
                - generic [ref=e204]: CloudPeak
              - cell "Qualified" [ref=e205]:
                - generic [ref=e206]: Qualified
              - cell "Cold Call" [ref=e207]
              - cell "David Osei" [ref=e208]
              - cell "$33K" [ref=e209]
              - cell "edit delete" [ref=e210]:
                - generic [ref=e211]:
                  - button "edit" [ref=e212]:
                    - generic [ref=e213]: edit
                  - button "delete" [ref=e214]:
                    - generic [ref=e215]: delete
            - row "Frank Turner Apex Digital Lost Website Alex Chen $19K edit delete" [ref=e216] [cursor=pointer]:
              - cell "Frank Turner Apex Digital" [ref=e217]:
                - generic [ref=e218]: Frank Turner
                - generic [ref=e219]: Apex Digital
              - cell "Lost" [ref=e220]:
                - generic [ref=e221]: Lost
              - cell "Website" [ref=e222]
              - cell "Alex Chen" [ref=e223]
              - cell "$19K" [ref=e224]
              - cell "edit delete" [ref=e225]:
                - generic [ref=e226]:
                  - button "edit" [ref=e227]:
                    - generic [ref=e228]: edit
                  - button "delete" [ref=e229]:
                    - generic [ref=e230]: delete
            - row "Grace Kim BlueSky Tech Won Referral Sarah Kim $54K edit delete" [ref=e231] [cursor=pointer]:
              - cell "Grace Kim BlueSky Tech" [ref=e232]:
                - generic [ref=e233]: Grace Kim
                - generic [ref=e234]: BlueSky Tech
              - cell "Won" [ref=e235]:
                - generic [ref=e236]: Won
              - cell "Referral" [ref=e237]
              - cell "Sarah Kim" [ref=e238]
              - cell "$54K" [ref=e239]
              - cell "edit delete" [ref=e240]:
                - generic [ref=e241]:
                  - button "edit" [ref=e242]:
                    - generic [ref=e243]: edit
                  - button "delete" [ref=e244]:
                    - generic [ref=e245]: delete
            - row "Henry Park Vertex Corp New LinkedIn James Park $22K edit delete" [ref=e246] [cursor=pointer]:
              - cell "Henry Park Vertex Corp" [ref=e247]:
                - generic [ref=e248]: Henry Park
                - generic [ref=e249]: Vertex Corp
              - cell "New" [ref=e250]:
                - generic [ref=e251]: New
              - cell "LinkedIn" [ref=e252]
              - cell "James Park" [ref=e253]
              - cell "$22K" [ref=e254]
              - cell "edit delete" [ref=e255]:
                - generic [ref=e256]:
                  - button "edit" [ref=e257]:
                    - generic [ref=e258]: edit
                  - button "delete" [ref=e259]:
                    - generic [ref=e260]: delete
        - paragraph [ref=e261]: 13 leads
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | import { getToken, createLead, deleteLead, waitForTable } from './helpers'
  3   | 
  4   | test.describe('Leads — list, search, filters', () => {
  5   | 
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await page.goto('/leads')
  8   |     await waitForTable(page)
  9   |   })
  10  | 
  11  |   test('shows "Leads" as the page title', async ({ page }) => {
  12  |     await expect(page.locator('header h1')).toHaveText('Leads')
  13  |   })
  14  | 
  15  |   test('shows the table with all expected column headers', async ({ page }) => {
  16  |     const headers = ['Name / Company', 'Status', 'Source', 'Salesperson', 'Deal Value']
  17  |     for (const h of headers) {
> 18  |       await expect(page.getByText(h)).toBeVisible()
      |                                       ^ Error: expect(locator).toBeVisible() failed
  19  |     }
  20  |   })
  21  | 
  22  |   test('seed data — at least 8 lead rows are present', async ({ page }) => {
  23  |     const rows = page.locator('table tbody tr')
  24  |     await expect(rows).toHaveCount(await rows.count()) // resolve count first
  25  |     expect(await rows.count()).toBeGreaterThanOrEqual(8)
  26  |   })
  27  | 
  28  |   test('shows seed lead "Alice Johnson" in the list', async ({ page }) => {
  29  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  30  |   })
  31  | 
  32  |   test('search by lead name filters the list', async ({ page }) => {
  33  |     await page.getByPlaceholder('Search name, company, email…').fill('Alice')
  34  |     await page.waitForTimeout(400) // debounce
  35  |     await waitForTable(page)
  36  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  37  |     await expect(page.getByText('Bob Smith')).not.toBeVisible()
  38  |   })
  39  | 
  40  |   test('search by company name filters the list', async ({ page }) => {
  41  |     await page.getByPlaceholder('Search name, company, email…').fill('TechCorp')
  42  |     await page.waitForTimeout(400)
  43  |     await waitForTable(page)
  44  |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  45  |     await expect(page.getByText('Bob Smith')).not.toBeVisible()
  46  |   })
  47  | 
  48  |   test('search by email filters the list', async ({ page }) => {
  49  |     await page.getByPlaceholder('Search name, company, email…').fill('grace@bluesky.com')
  50  |     await page.waitForTimeout(400)
  51  |     await waitForTable(page)
  52  |     await expect(page.getByText('Grace Kim')).toBeVisible()
  53  |     await expect(page.getByText('Alice Johnson')).not.toBeVisible()
  54  |   })
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
```