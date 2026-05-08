import { test, expect } from '@playwright/test'

// Auth tests use empty storage — no saved login
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Authentication', () => {

  test('redirects unauthenticated users from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirects unauthenticated users from /leads to /login', async ({ page }) => {
    await page.goto('/leads')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page renders email, password inputs and sign-in button', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('shows the SalesFlow CRM brand heading', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('SalesFlow CRM')).toBeVisible()
  })

  test('shows error message with wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('wrong@example.com')
    await page.locator('input[type="password"]').fill('badpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    // Error banner is a red div inside the form
    await expect(page.locator('form .text-red-700')).toBeVisible()
  })

  test('shows error with correct email but wrong password', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('admin@example.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.locator('form .text-red-700')).toBeVisible()
  })

  test('logs in successfully and redirects to /dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('admin@example.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  })

  test('auth persists after page reload', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('admin@example.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/dashboard/)
    await page.reload()
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText('Dashboard')).toBeVisible()
  })

  test('logout from profile dropdown clears auth and redirects to /login', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('admin@example.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/dashboard/)

    // Open the profile dropdown (avatar button in top-right of TopNav)
    const avatar = page.locator('header button').filter({ hasText: /^[A-Z]+$/ })
    await avatar.click()
    await page.getByRole('button', { name: /sign out/i }).click()

    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 })
    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('crm_token'))
    expect(token).toBeNull()
  })

})
