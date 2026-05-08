# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> renders three quick-link cards
- Location: tests\dashboard.spec.ts:59:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Reports')
Expected: visible
Error: strict mode violation: getByText('Reports') resolved to 2 elements:
    1) <span class="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors↵                text-white/55 hover:text-white hover:bg-white/10">…</span> aka getByRole('link', { name: 'bar_chart Reports', exact: true })
    2) <div class="text-sm font-semibold text-on-surface">Reports</div> aka getByRole('link', { name: 'bar_chart Reports Deal value' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Reports')

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
          - generic [ref=e12]:
            - generic [ref=e13]: grid_view
            - text: Dashboard
        - link "people Leads" [ref=e14] [cursor=pointer]:
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
          - heading "Dashboard" [level=1] [ref=e37]
          - generic [ref=e38]:
            - link "add New Lead" [ref=e40] [cursor=pointer]:
              - /url: /leads/new
              - button "add New Lead" [ref=e41]:
                - generic [ref=e42]: add
                - text: New Lead
            - button "AD" [ref=e44] [cursor=pointer]
        - generic [ref=e45]:
          - generic [ref=e47]:
            - generic [ref=e48]:
              - generic [ref=e50]: people
              - generic [ref=e51]:
                - generic [ref=e52]: "13"
                - generic [ref=e53]: Total Leads
            - generic [ref=e54]:
              - generic [ref=e56]: fiber_new
              - generic [ref=e57]:
                - generic [ref=e58]: "7"
                - generic [ref=e59]: New
            - generic [ref=e60]:
              - generic [ref=e62]: mark_email_read
              - generic [ref=e63]:
                - generic [ref=e64]: "1"
                - generic [ref=e65]: Contacted
            - generic [ref=e66]:
              - generic [ref=e68]: verified
              - generic [ref=e69]:
                - generic [ref=e70]: "1"
                - generic [ref=e71]: Qualified
            - generic [ref=e72]:
              - generic [ref=e74]: emoji_events
              - generic [ref=e75]:
                - generic [ref=e76]: "3"
                - generic [ref=e77]: Won
            - generic [ref=e78]:
              - generic [ref=e80]: cancel
              - generic [ref=e81]:
                - generic [ref=e82]: "1"
                - generic [ref=e83]: Lost
            - generic [ref=e84]:
              - generic [ref=e86]: paid
              - generic [ref=e87]:
                - generic [ref=e88]: $278K
                - generic [ref=e89]: Total Pipeline Value
            - generic [ref=e90]:
              - generic [ref=e92]: savings
              - generic [ref=e93]:
                - generic [ref=e94]: $161K
                - generic [ref=e95]: Won Deal Value
          - generic [ref=e96]:
            - heading "Leads Created — Last 6 Months" [level=2] [ref=e97]
            - img [ref=e100]:
              - generic [ref=e104]:
                - generic [ref=e106]: Dec
                - generic [ref=e108]: Jan
                - generic [ref=e110]: Feb
                - generic [ref=e112]: Mar
                - generic [ref=e114]: Apr
                - generic [ref=e116]: May
              - generic [ref=e118]:
                - generic [ref=e120]: "0"
                - generic [ref=e122]: "2"
                - generic [ref=e124]: "4"
                - generic [ref=e126]: "6"
                - generic [ref=e128]: "8"
          - generic [ref=e140]:
            - link "list View all leads 13 total" [ref=e141] [cursor=pointer]:
              - /url: /leads
              - generic [ref=e143]: list
              - generic [ref=e144]:
                - generic [ref=e145]: View all leads
                - generic [ref=e146]: 13 total
            - link "view_kanban Pipeline board Drag to update status" [ref=e147] [cursor=pointer]:
              - /url: /pipeline
              - generic [ref=e149]: view_kanban
              - generic [ref=e150]:
                - generic [ref=e151]: Pipeline board
                - generic [ref=e152]: Drag to update status
            - link "bar_chart Reports Deal value & activity" [ref=e153] [cursor=pointer]:
              - /url: /reports
              - generic [ref=e155]: bar_chart
              - generic [ref=e156]:
                - generic [ref=e157]: Reports
                - generic [ref=e158]: Deal value & activity
  - generic [ref=e159]: "0"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Dashboard', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/dashboard')
  7  |     // Wait for stat cards to be populated (loading state replaced by real data)
  8  |     await page.waitForSelector('text=Total Leads', { timeout: 8_000 })
  9  |   })
  10 | 
  11 |   test('shows "Dashboard" as the page title', async ({ page }) => {
  12 |     await expect(page.locator('header h1')).toHaveText('Dashboard')
  13 |   })
  14 | 
  15 |   test('renders all 8 stat card labels', async ({ page }) => {
  16 |     const labels = [
  17 |       'Total Leads',
  18 |       'New',
  19 |       'Contacted',
  20 |       'Qualified',
  21 |       'Won',
  22 |       'Lost',
  23 |       'Total Pipeline Value',
  24 |       'Won Deal Value',
  25 |     ]
  26 |     for (const label of labels) {
  27 |       await expect(page.getByText(label)).toBeVisible()
  28 |     }
  29 |   })
  30 | 
  31 |   test('Total Leads card shows a positive integer', async ({ page }) => {
  32 |     const totalCard = page.locator('div').filter({ hasText: /^Total Leads$/ }).locator('..')
  33 |     const valueText = await totalCard.locator('.text-2xl, .text-3xl').first().textContent()
  34 |     expect(Number(valueText)).toBeGreaterThan(0)
  35 |   })
  36 | 
  37 |   test('stat cards reflect actual lead counts from the API', async ({ page, request }) => {
  38 |     const res  = await request.get('http://localhost:3001/api/dashboard', {
  39 |       headers: {
  40 |         Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem('crm_token'))}`,
  41 |       },
  42 |     })
  43 |     const data = await res.json()
  44 | 
  45 |     // Total Leads on the page should match the API response
  46 |     await expect(page.getByText(String(data.total)).first()).toBeVisible()
  47 |   })
  48 | 
  49 |   test('shows the "Leads Created — Last 6 Months" section', async ({ page }) => {
  50 |     await expect(page.getByText('Leads Created — Last 6 Months')).toBeVisible()
  51 |   })
  52 | 
  53 |   test('renders the monthly bar chart (Recharts SVG)', async ({ page }) => {
  54 |     const chart = page.locator('.recharts-responsive-container').first()
  55 |     await expect(chart).toBeVisible()
  56 |     await expect(chart.locator('svg')).toBeVisible()
  57 |   })
  58 | 
  59 |   test('renders three quick-link cards', async ({ page }) => {
  60 |     await expect(page.getByText('View all leads')).toBeVisible()
  61 |     await expect(page.getByText('Pipeline board')).toBeVisible()
> 62 |     await expect(page.getByText('Reports')).toBeVisible()
     |                                             ^ Error: expect(locator).toBeVisible() failed
  63 |   })
  64 | 
  65 |   test('"New Lead" button in header navigates to /leads/new', async ({ page }) => {
  66 |     await page.getByRole('link', { name: /new lead/i }).click()
  67 |     await expect(page).toHaveURL(/\/leads\/new/)
  68 |   })
  69 | 
  70 |   test('"View all leads" quick-link navigates to /leads', async ({ page }) => {
  71 |     await page.getByRole('link', { name: 'View all leads' }).click()
  72 |     await expect(page).toHaveURL(/\/leads/)
  73 |   })
  74 | 
  75 |   test('"Pipeline board" quick-link navigates to /pipeline', async ({ page }) => {
  76 |     await page.getByRole('link', { name: 'Pipeline board' }).click()
  77 |     await expect(page).toHaveURL(/\/pipeline/)
  78 |   })
  79 | 
  80 | })
  81 | 
```