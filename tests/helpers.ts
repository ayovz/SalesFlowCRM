import { APIRequestContext, Page } from '@playwright/test'

export const API_URL = 'http://localhost:3001'
export const ADMIN    = { email: 'admin@example.com', password: 'password123' }

// ── API helpers ──────────────────────────────────────────────────────────────

export async function getToken(request: APIRequestContext): Promise<string> {
  const res  = await request.post(`${API_URL}/api/auth/login`, { data: ADMIN })
  const json = await res.json()
  return json.token as string
}

export async function apiCall(
  request: APIRequestContext,
  method:  'GET' | 'POST' | 'PATCH' | 'DELETE',
  path:    string,
  token:   string,
  body?:   Record<string, unknown>,
) {
  return request.fetch(`${API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    data: body,
  })
}

export async function createLead(
  request:   APIRequestContext,
  token:     string,
  overrides: Record<string, unknown> = {},
): Promise<{ id: number; lead_name: string }> {
  const res = await apiCall(request, 'POST', '/api/leads', token, {
    lead_name:    'Playwright Test Lead',
    company_name: 'Test Corp',
    email:        'playwright@test.com',
    phone:        '555-9999',
    lead_source:  'Website',
    salesperson:  'Alex Chen',
    status:       'New',
    deal_value:   5000,
    ...overrides,
  })
  return res.json()
}

export async function deleteLead(
  request: APIRequestContext,
  token:   string,
  id:      number,
): Promise<void> {
  await apiCall(request, 'DELETE', `/api/leads/${id}`, token)
}

// ── Page helpers ─────────────────────────────────────────────────────────────

/** Wait for the table to finish its loading state */
export async function waitForTable(page: Page) {
  await page.waitForSelector('table tbody tr:not(:has(td[colspan]))', { timeout: 8_000 })
}

/** Fill the lead form fields (LeadNew / LeadEdit pages) */
export async function fillLeadForm(
  page:   Page,
  fields: {
    lead_name?:    string
    company_name?: string
    email?:        string
    phone?:        string
    deal_value?:   string
    lead_source?:  string
    salesperson?:  string
    status?:       string
  },
) {
  if (fields.lead_name    !== undefined) await page.getByPlaceholder('Full name').fill(fields.lead_name)
  if (fields.company_name !== undefined) await page.getByPlaceholder('Company name').fill(fields.company_name)
  if (fields.email        !== undefined) await page.getByPlaceholder('email@example.com').fill(fields.email)
  if (fields.phone        !== undefined) await page.getByPlaceholder('555-0100').fill(fields.phone)
  if (fields.deal_value   !== undefined) await page.getByPlaceholder('0').fill(fields.deal_value)
  if (fields.lead_source  !== undefined) {
    await page.locator('select').filter({ hasText: 'Select source' }).selectOption(fields.lead_source)
  }
  if (fields.salesperson !== undefined) {
    await page.locator('select').filter({ hasText: 'Assign salesperson' }).selectOption(fields.salesperson)
  }
  if (fields.status !== undefined) {
    await page.locator('select').filter({ hasText: 'New' }).selectOption(fields.status)
  }
}
