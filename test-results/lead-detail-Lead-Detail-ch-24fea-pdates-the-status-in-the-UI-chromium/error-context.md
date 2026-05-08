# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lead-detail.spec.ts >> Lead Detail >> changing the status dropdown updates the status in the UI
- Location: tests\lead-detail.spec.ts:73:7

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