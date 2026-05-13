# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pipeline.spec.ts >> Pipeline (Kanban) >> "New" column contains seed leads David Lee and Henry Park
- Location: tests\pipeline.spec.ts:49:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.glass-card').filter({ has: locator('.bg-surface-container span.rounded-full').filter({ hasText: /^New$/ }) }).locator('p').filter({ hasText: 'David Lee' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.glass-card').filter({ has: locator('.bg-surface-container span.rounded-full').filter({ hasText: /^New$/ }) }).locator('p').filter({ hasText: 'David Lee' })

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
        - heading "Pipeline" [level=1] [ref=e37]
        - button "AD" [ref=e40] [cursor=pointer]
      - generic [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]:
              - generic [ref=e45]: New
              - generic [ref=e46]: "8"
            - generic [ref=e47]: $62K
          - generic [ref=e48]:
            - generic [ref=e49]:
              - link "E2E Test Person" [ref=e50] [cursor=pointer]:
                - /url: /leads/57
                - paragraph [ref=e51]: E2E Test Person
              - paragraph [ref=e52]: E2E Corp
              - paragraph [ref=e53]: $12K
              - paragraph [ref=e54]: Sarah Kim
            - link "Alex Chen" [ref=e56] [cursor=pointer]:
              - /url: /leads/9
              - paragraph [ref=e57]: Alex Chen
            - link "Sarah Kim" [ref=e59] [cursor=pointer]:
              - /url: /leads/10
              - paragraph [ref=e60]: Sarah Kim
            - link "James Park" [ref=e62] [cursor=pointer]:
              - /url: /leads/11
              - paragraph [ref=e63]: James Park
            - link "Maria Lopez" [ref=e65] [cursor=pointer]:
              - /url: /leads/12
              - paragraph [ref=e66]: Maria Lopez
            - link "David Osei" [ref=e68] [cursor=pointer]:
              - /url: /leads/13
              - paragraph [ref=e69]: David Osei
            - generic [ref=e70]:
              - link "Bob Smith" [ref=e71] [cursor=pointer]:
                - /url: /leads/2
                - paragraph [ref=e72]: Bob Smith
              - paragraph [ref=e73]: DataFlow Inc
              - paragraph [ref=e74]: $28K
              - paragraph [ref=e75]: Sarah Kim
            - generic [ref=e76]:
              - link "Henry Park" [ref=e77] [cursor=pointer]:
                - /url: /leads/8
                - paragraph [ref=e78]: Henry Park
              - paragraph [ref=e79]: Vertex Corp
              - paragraph [ref=e80]: $22K
              - paragraph [ref=e81]: James Park
        - generic [ref=e82]:
          - generic [ref=e83]:
            - generic [ref=e84]:
              - generic [ref=e85]: Contacted
              - generic [ref=e86]: "1"
            - generic [ref=e87]: $15K
          - generic [ref=e89]:
            - link "Carol White" [ref=e90] [cursor=pointer]:
              - /url: /leads/3
              - paragraph [ref=e91]: Carol White
            - paragraph [ref=e92]: Streamline
            - paragraph [ref=e93]: $15K
            - paragraph [ref=e94]: James Park
        - generic [ref=e95]:
          - generic [ref=e96]:
            - generic [ref=e97]:
              - generic [ref=e98]: Qualified
              - generic [ref=e99]: "1"
            - generic [ref=e100]: $33K
          - generic [ref=e102]:
            - link "Eva Martinez" [ref=e103] [cursor=pointer]:
              - /url: /leads/5
              - paragraph [ref=e104]: Eva Martinez
            - paragraph [ref=e105]: CloudPeak
            - paragraph [ref=e106]: $33K
            - paragraph [ref=e107]: David Osei
        - generic [ref=e108]:
          - generic [ref=e110]:
            - generic [ref=e111]: Proposal Sent
            - generic [ref=e112]: "0"
          - paragraph [ref=e114]: Drop here
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e117]:
              - generic [ref=e118]: Won
              - generic [ref=e119]: "3"
            - generic [ref=e120]: $161K
          - generic [ref=e121]:
            - generic [ref=e122]:
              - link "Alice Johnson" [ref=e123] [cursor=pointer]:
                - /url: /leads/1
                - paragraph [ref=e124]: Alice Johnson
              - paragraph [ref=e125]: TechCorp
              - paragraph [ref=e126]: $45K
              - paragraph [ref=e127]: Alex Chen
            - generic [ref=e128]:
              - link "David Lee" [ref=e129] [cursor=pointer]:
                - /url: /leads/4
                - paragraph [ref=e130]: David Lee
              - paragraph [ref=e131]: NovaSystems
              - paragraph [ref=e132]: $62K
              - paragraph [ref=e133]: Maria Lopez
            - generic [ref=e134]:
              - link "Grace Kim" [ref=e135] [cursor=pointer]:
                - /url: /leads/7
                - paragraph [ref=e136]: Grace Kim
              - paragraph [ref=e137]: BlueSky Tech
              - paragraph [ref=e138]: $54K
              - paragraph [ref=e139]: Sarah Kim
        - generic [ref=e140]:
          - generic [ref=e141]:
            - generic [ref=e142]:
              - generic [ref=e143]: Lost
              - generic [ref=e144]: "1"
            - generic [ref=e145]: $19K
          - generic [ref=e147]:
            - link "Frank Turner" [ref=e148] [cursor=pointer]:
              - /url: /leads/6
              - paragraph [ref=e149]: Frank Turner
            - paragraph [ref=e150]: Apex Digital
            - paragraph [ref=e151]: $19K
            - paragraph [ref=e152]: Alex Chen
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { getToken, createLead, deleteLead } from './helpers'
  3  | 
  4  | const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
  5  | 
  6  | test.describe('Pipeline (Kanban)', () => {
  7  | 
  8  |   test.beforeEach(async ({ page }) => {
  9  |     await page.goto('/pipeline')
  10 |     // Wait until loading skeleton is replaced by actual columns
  11 |     await page.waitForSelector('.glass-card', { timeout: 8_000 })
  12 |     await page.waitForTimeout(300)
  13 |   })
  14 | 
  15 |   test('shows "Pipeline" as the page title', async ({ page }) => {
  16 |     await expect(page.locator('header h1')).toHaveText('Pipeline')
  17 |   })
  18 | 
  19 |   test('renders a column for each of the 6 statuses', async ({ page }) => {
  20 |     for (const status of STATUSES) {
  21 |       // Each column header has a Badge span with the status text
  22 |       await expect(page.locator('span.rounded-full', { hasText: status }).first()).toBeVisible()
  23 |     }
  24 |   })
  25 | 
  26 |   test('seed lead "Alice Johnson" is visible (status: Won)', async ({ page }) => {
  27 |     await expect(page.getByText('Alice Johnson')).toBeVisible()
  28 |   })
  29 | 
  30 |   test('seed lead "David Lee" is visible (status: New)', async ({ page }) => {
  31 |     await expect(page.getByText('David Lee')).toBeVisible()
  32 |   })
  33 | 
  34 |   test('each column header shows a count badge', async ({ page }) => {
  35 |     // Each column has a count span next to the status badge
  36 |     const columnHeaders = page.locator('.bg-surface-container')
  37 |     await expect(columnHeaders).toHaveCount(STATUSES.length)
  38 |   })
  39 | 
  40 |   test('"Won" column contains seed leads Alice Johnson and Grace Kim', async ({ page }) => {
  41 |     const wonColumn = page.locator('.glass-card').filter({
  42 |       has: page.locator('.bg-surface-container span.rounded-full', { hasText: /^Won$/ }),
  43 |     })
  44 |     // Use locator('p') to get the name <p> element specifically, avoiding multi-match from ancestor divs
  45 |     await expect(wonColumn.locator('p', { hasText: 'Alice Johnson' })).toBeVisible()
  46 |     await expect(wonColumn.locator('p', { hasText: 'Grace Kim' })).toBeVisible()
  47 |   })
  48 | 
  49 |   test('"New" column contains seed leads David Lee and Henry Park', async ({ page }) => {
  50 |     const newColumn = page.locator('.glass-card').filter({
  51 |       has: page.locator('.bg-surface-container span.rounded-full', { hasText: /^New$/ }),
  52 |     })
> 53 |     await expect(newColumn.locator('p', { hasText: 'David Lee' })).toBeVisible()
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  54 |     await expect(newColumn.locator('p', { hasText: 'Henry Park' })).toBeVisible()
  55 |   })
  56 | 
  57 |   test('lead cards link to their detail pages', async ({ page }) => {
  58 |     await page.getByText('Alice Johnson').first().click()
  59 |     await expect(page).toHaveURL(/\/leads\/\d+/)
  60 |     await expect(page.locator('header h1')).toHaveText('Alice Johnson')
  61 |   })
  62 | 
  63 |   test('drag-and-drop moves a lead to a new status column', async ({ page, request }) => {
  64 |     const token = await getToken(request)
  65 |     const lead  = await createLead(request, token, {
  66 |       lead_name: 'Drag Test Lead',
  67 |       status:    'New',
  68 |     })
  69 | 
  70 |     await page.goto('/pipeline')
  71 |     await page.waitForSelector('.glass-card', { timeout: 8_000 })
  72 |     await page.waitForTimeout(400)
  73 | 
  74 |     // Locate the lead card link and its draggable parent
  75 |     const leadLink = page.getByText('Drag Test Lead').first()
  76 |     await expect(leadLink).toBeVisible()
  77 | 
  78 |     // The draggable element is a motion.div wrapping the link
  79 |     const dragSource = leadLink.locator('xpath=ancestor::div[@draggable="true"]').first()
  80 | 
  81 |     // Target: the "Qualified" column drop zone
  82 |     const qualifiedColumn = page.locator('.glass-card').filter({
  83 |       has: page.locator('.bg-surface-container span.rounded-full', { hasText: /^Qualified$/ }),
  84 |     })
  85 |     const dropZone = qualifiedColumn.locator('div.flex.flex-col.gap-2.p-3')
  86 | 
  87 |     await dragSource.dragTo(dropZone)
  88 |     await page.waitForTimeout(800)
  89 | 
  90 |     // The lead should now appear in the Qualified column
  91 |     await expect(qualifiedColumn.getByText('Drag Test Lead')).toBeVisible({ timeout: 6_000 })
  92 | 
  93 |     // Cleanup
  94 |     await deleteLead(request, token, lead.id)
  95 |   })
  96 | 
  97 | })
  98 | 
```