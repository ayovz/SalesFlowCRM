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

Locator: locator('.bg-surface-container span.rounded-full').filter({ hasText: /^New$/ }).locator('xpath=ancestor::div[contains(@class,"glass-card")]').first().getByText('David Lee')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.bg-surface-container span.rounded-full').filter({ hasText: /^New$/ }).locator('xpath=ancestor::div[contains(@class,"glass-card")]').first().getByText('David Lee')

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
              - generic [ref=e46]: "7"
            - generic [ref=e47]: $50K
          - generic [ref=e48]:
            - link "Alex Chen" [ref=e50] [cursor=pointer]:
              - /url: /leads/9
              - paragraph [ref=e51]: Alex Chen
            - link "Sarah Kim" [ref=e53] [cursor=pointer]:
              - /url: /leads/10
              - paragraph [ref=e54]: Sarah Kim
            - link "James Park" [ref=e56] [cursor=pointer]:
              - /url: /leads/11
              - paragraph [ref=e57]: James Park
            - link "Maria Lopez" [ref=e59] [cursor=pointer]:
              - /url: /leads/12
              - paragraph [ref=e60]: Maria Lopez
            - link "David Osei" [ref=e62] [cursor=pointer]:
              - /url: /leads/13
              - paragraph [ref=e63]: David Osei
            - generic [ref=e64]:
              - link "Bob Smith" [ref=e65] [cursor=pointer]:
                - /url: /leads/2
                - paragraph [ref=e66]: Bob Smith
              - paragraph [ref=e67]: DataFlow Inc
              - paragraph [ref=e68]: $28K
              - paragraph [ref=e69]: Sarah Kim
            - generic [ref=e70]:
              - link "Henry Park" [ref=e71] [cursor=pointer]:
                - /url: /leads/8
                - paragraph [ref=e72]: Henry Park
              - paragraph [ref=e73]: Vertex Corp
              - paragraph [ref=e74]: $22K
              - paragraph [ref=e75]: James Park
        - generic [ref=e76]:
          - generic [ref=e77]:
            - generic [ref=e78]:
              - generic [ref=e79]: Contacted
              - generic [ref=e80]: "1"
            - generic [ref=e81]: $15K
          - generic [ref=e83]:
            - link "Carol White" [ref=e84] [cursor=pointer]:
              - /url: /leads/3
              - paragraph [ref=e85]: Carol White
            - paragraph [ref=e86]: Streamline
            - paragraph [ref=e87]: $15K
            - paragraph [ref=e88]: James Park
        - generic [ref=e89]:
          - generic [ref=e90]:
            - generic [ref=e91]:
              - generic [ref=e92]: Qualified
              - generic [ref=e93]: "1"
            - generic [ref=e94]: $33K
          - generic [ref=e96]:
            - link "Eva Martinez" [ref=e97] [cursor=pointer]:
              - /url: /leads/5
              - paragraph [ref=e98]: Eva Martinez
            - paragraph [ref=e99]: CloudPeak
            - paragraph [ref=e100]: $33K
            - paragraph [ref=e101]: David Osei
        - generic [ref=e102]:
          - generic [ref=e104]:
            - generic [ref=e105]: Proposal Sent
            - generic [ref=e106]: "0"
          - paragraph [ref=e108]: Drop here
        - generic [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]:
              - generic [ref=e112]: Won
              - generic [ref=e113]: "3"
            - generic [ref=e114]: $161K
          - generic [ref=e115]:
            - generic [ref=e116]:
              - link "Alice Johnson" [ref=e117] [cursor=pointer]:
                - /url: /leads/1
                - paragraph [ref=e118]: Alice Johnson
              - paragraph [ref=e119]: TechCorp
              - paragraph [ref=e120]: $45K
              - paragraph [ref=e121]: Alex Chen
            - generic [ref=e122]:
              - link "David Lee" [ref=e123] [cursor=pointer]:
                - /url: /leads/4
                - paragraph [ref=e124]: David Lee
              - paragraph [ref=e125]: NovaSystems
              - paragraph [ref=e126]: $62K
              - paragraph [ref=e127]: Maria Lopez
            - generic [ref=e128]:
              - link "Grace Kim" [ref=e129] [cursor=pointer]:
                - /url: /leads/7
                - paragraph [ref=e130]: Grace Kim
              - paragraph [ref=e131]: BlueSky Tech
              - paragraph [ref=e132]: $54K
              - paragraph [ref=e133]: Sarah Kim
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]:
              - generic [ref=e137]: Lost
              - generic [ref=e138]: "1"
            - generic [ref=e139]: $19K
          - generic [ref=e141]:
            - link "Frank Turner" [ref=e142] [cursor=pointer]:
              - /url: /leads/6
              - paragraph [ref=e143]: Frank Turner
            - paragraph [ref=e144]: Apex Digital
            - paragraph [ref=e145]: $19K
            - paragraph [ref=e146]: Alex Chen
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
  41 |     // Find the Won column — it's the parent .glass-card that contains the "Won" badge in its header
  42 |     const wonBadge  = page.locator('.bg-surface-container span.rounded-full', { hasText: /^Won$/ })
  43 |     const wonColumn = wonBadge.locator('xpath=ancestor::div[contains(@class,"glass-card")]').first()
  44 | 
  45 |     await expect(wonColumn.getByText('Alice Johnson')).toBeVisible()
  46 |     await expect(wonColumn.getByText('Grace Kim')).toBeVisible()
  47 |   })
  48 | 
  49 |   test('"New" column contains seed leads David Lee and Henry Park', async ({ page }) => {
  50 |     const newBadge  = page.locator('.bg-surface-container span.rounded-full', { hasText: /^New$/ })
  51 |     const newColumn = newBadge.locator('xpath=ancestor::div[contains(@class,"glass-card")]').first()
  52 | 
> 53 |     await expect(newColumn.getByText('David Lee')).toBeVisible()
     |                                                    ^ Error: expect(locator).toBeVisible() failed
  54 |     await expect(newColumn.getByText('Henry Park')).toBeVisible()
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
  82 |     const qualifiedBadge  = page.locator('.bg-surface-container span.rounded-full', { hasText: /^Qualified$/ })
  83 |     const qualifiedColumn = qualifiedBadge.locator('xpath=ancestor::div[contains(@class,"glass-card")]').first()
  84 |     const dropZone        = qualifiedColumn.locator('div.flex.flex-col.gap-2.p-3')
  85 | 
  86 |     await dragSource.dragTo(dropZone)
  87 |     await page.waitForTimeout(800)
  88 | 
  89 |     // The lead should now appear in the Qualified column
  90 |     await expect(qualifiedColumn.getByText('Drag Test Lead')).toBeVisible({ timeout: 6_000 })
  91 | 
  92 |     // Cleanup
  93 |     await deleteLead(request, token, lead.id)
  94 |   })
  95 | 
  96 | })
  97 | 
```