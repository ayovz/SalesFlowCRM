import { test as setup, expect } from '@playwright/test'
import fs   from 'fs'
import path from 'path'

const AUTH_FILE = 'tests/.auth/user.json'

setup('authenticate', async ({ page, request }) => {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true })

  // Obtain JWT from the real API
  const resp = await request.post('http://localhost:3001/api/auth/login', {
    data: { email: 'admin@example.com', password: 'password123' },
  })
  expect(resp.status()).toBe(200)
  const { token, user } = await resp.json()
  expect(token).toBeTruthy()

  // Navigate to the app origin and write localStorage so the React Guard lets us through
  await page.goto('/login')
  await page.evaluate(
    ({ t, u }) => {
      localStorage.setItem('crm_token', t)
      localStorage.setItem('crm_user', JSON.stringify(u))
    },
    { t: token, u: user },
  )

  // Persist the storage state for all subsequent tests
  await page.context().storageState({ path: AUTH_FILE })
})
