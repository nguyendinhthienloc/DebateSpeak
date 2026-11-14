import { expect, test } from '@playwright/test';

// UC-01-05 is not enabled: recovery is gated and sign-in shows no recovery links.
test('sign-in shows no recovery links', async ({ page }) => {
  await page.goto('/#/sign-in');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Forgot password?' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Verify your email' })).toHaveCount(0);
});

for (const route of ['forgot-password', 'verify-email', 'reset-password']) {
  test(`/${route} is inert and sends no request`, async ({ page }) => {
    let calls = 0;
    await page.route('**/api/v1/auth/**', async r => { if (!r.request().url().endsWith('/auth/refresh')) calls++; await r.abort(); });
    await page.goto(`/#/${route}`);
    await expect(page.getByRole('heading', { name: 'Account recovery is not available in this build' })).toBeVisible();
    await expect(page.locator('form')).toHaveCount(0);
    expect(calls).toBe(0);
  });
}
