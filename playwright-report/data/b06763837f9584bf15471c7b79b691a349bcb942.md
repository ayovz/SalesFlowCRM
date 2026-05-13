# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leads.spec.ts >> Leads — create and delete >> creates a new lead via the form and it appears in the list
- Location: tests\leads.spec.ts:148:7

# Error details

```
Error: apiRequestContext.post: read ECONNRESET
Call log:
  - → POST http://localhost:3001/api/auth/login
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/json
    - content-length: 54

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
        - heading "E2E Test Person" [level=1] [ref=e37]
        - generic [ref=e38]:
          - generic [ref=e40]:
            - link "edit Edit" [ref=e41] [cursor=pointer]:
              - /url: /leads/57/edit
              - button "edit Edit" [ref=e42]:
                - generic [ref=e43]: edit
                - text: Edit
            - button "delete Delete" [ref=e44] [cursor=pointer]:
              - generic [ref=e45]: delete
              - text: Delete
          - button "AD" [ref=e47] [cursor=pointer]
      - generic [ref=e48]:
        - generic [ref=e50]:
          - generic [ref=e51]:
            - generic [ref=e52]:
              - heading "E2E Test Person" [level=2] [ref=e53]
              - paragraph [ref=e54]: E2E Corp
            - generic [ref=e55]: New
          - generic [ref=e56]:
            - generic [ref=e57]:
              - term [ref=e58]: Company
              - definition [ref=e59]: E2E Corp
            - generic [ref=e60]:
              - term [ref=e61]: Email
              - definition [ref=e62]: e2e@test.com
            - generic [ref=e63]:
              - term [ref=e64]: Phone
              - definition [ref=e65]: 555-0001
            - generic [ref=e66]:
              - term [ref=e67]: Lead Source
              - definition [ref=e68]: LinkedIn
            - generic [ref=e69]:
              - term [ref=e70]: Salesperson
              - definition [ref=e71]: Sarah Kim
            - generic [ref=e72]:
              - term [ref=e73]: Deal Value
              - definition [ref=e74]: $12K
            - generic [ref=e75]:
              - term [ref=e76]: Created
              - definition [ref=e77]: 5/8/2026
            - generic [ref=e78]:
              - term [ref=e79]: Updated
              - definition [ref=e80]: 5/8/2026
          - generic [ref=e82]:
            - generic [ref=e83]: Update Status
            - combobox [ref=e84]:
              - option "New" [selected]
              - option "Contacted"
              - option "Qualified"
              - option "Proposal Sent"
              - option "Won"
              - option "Lost"
        - generic [ref=e85]:
          - generic [ref=e86]:
            - heading "Add Note" [level=3] [ref=e87]
            - generic [ref=e88]:
              - textbox "Write a note…" [ref=e89]
              - button "Add note" [disabled] [ref=e90]
          - paragraph [ref=e92]: No notes yet
```

# Test source

```ts
  1  | import { APIRequestContext, Page } from '@playwright/test'
  2  | 
  3  | export const API_URL = 'http://localhost:3001'
  4  | export const ADMIN    = { email: 'admin@example.com', password: 'password123' }
  5  | 
  6  | // ── API helpers ──────────────────────────────────────────────────────────────
  7  | 
  8  | export async function getToken(request: APIRequestContext): Promise<string> {
> 9  |   const res  = await request.post(`${API_URL}/api/auth/login`, { data: ADMIN })
     |                              ^ Error: apiRequestContext.post: read ECONNRESET
  10 |   const json = await res.json()
  11 |   return json.token as string
  12 | }
  13 | 
  14 | export async function apiCall(
  15 |   request: APIRequestContext,
  16 |   method:  'GET' | 'POST' | 'PATCH' | 'DELETE',
  17 |   path:    string,
  18 |   token:   string,
  19 |   body?:   Record<string, unknown>,
  20 | ) {
  21 |   return request.fetch(`${API_URL}${path}`, {
  22 |     method,
  23 |     headers: { Authorization: `Bearer ${token}` },
  24 |     data: body,
  25 |   })
  26 | }
  27 | 
  28 | export async function createLead(
  29 |   request:   APIRequestContext,
  30 |   token:     string,
  31 |   overrides: Record<string, unknown> = {},
  32 | ): Promise<{ id: number; lead_name: string }> {
  33 |   const res = await apiCall(request, 'POST', '/api/leads', token, {
  34 |     lead_name:    'Playwright Test Lead',
  35 |     company_name: 'Test Corp',
  36 |     email:        'playwright@test.com',
  37 |     phone:        '555-9999',
  38 |     lead_source:  'Website',
  39 |     salesperson:  'Alex Chen',
  40 |     status:       'New',
  41 |     deal_value:   5000,
  42 |     ...overrides,
  43 |   })
  44 |   return res.json()
  45 | }
  46 | 
  47 | export async function deleteLead(
  48 |   request: APIRequestContext,
  49 |   token:   string,
  50 |   id:      number,
  51 | ): Promise<void> {
  52 |   await apiCall(request, 'DELETE', `/api/leads/${id}`, token)
  53 | }
  54 | 
  55 | // ── Page helpers ─────────────────────────────────────────────────────────────
  56 | 
  57 | /** Wait for the table to finish its loading state */
  58 | export async function waitForTable(page: Page) {
  59 |   await page.waitForSelector('table tbody tr:not(:has(td[colspan]))', { timeout: 8_000 })
  60 | }
  61 | 
  62 | /** Fill the lead form fields (LeadNew / LeadEdit pages) */
  63 | export async function fillLeadForm(
  64 |   page:   Page,
  65 |   fields: {
  66 |     lead_name?:    string
  67 |     company_name?: string
  68 |     email?:        string
  69 |     phone?:        string
  70 |     deal_value?:   string
  71 |     lead_source?:  string
  72 |     salesperson?:  string
  73 |     status?:       string
  74 |   },
  75 | ) {
  76 |   if (fields.lead_name    !== undefined) await page.getByPlaceholder('Full name').fill(fields.lead_name)
  77 |   if (fields.company_name !== undefined) await page.getByPlaceholder('Company name').fill(fields.company_name)
  78 |   if (fields.email        !== undefined) await page.getByPlaceholder('email@example.com').fill(fields.email)
  79 |   if (fields.phone        !== undefined) await page.getByPlaceholder('555-0100').fill(fields.phone)
  80 |   if (fields.deal_value   !== undefined) await page.getByPlaceholder('0').fill(fields.deal_value)
  81 |   if (fields.lead_source  !== undefined) {
  82 |     await page.locator('select').filter({ hasText: 'Select source' }).selectOption(fields.lead_source)
  83 |   }
  84 |   if (fields.salesperson !== undefined) {
  85 |     await page.locator('select').filter({ hasText: 'Assign salesperson' }).selectOption(fields.salesperson)
  86 |   }
  87 |   if (fields.status !== undefined) {
  88 |     await page.locator('select').filter({ hasText: 'New' }).selectOption(fields.status)
  89 |   }
  90 | }
  91 | 
```