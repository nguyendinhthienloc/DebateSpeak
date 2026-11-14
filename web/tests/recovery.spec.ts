import { expect, test } from '@playwright/test';

for (const width of [320, 1102]) {
  test(`recovery screens fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['forgot-password', 'verify-email', 'reset-password']) {
      await page.goto(`/#/${route}`);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `test-results/recovery-${route}-${width}.png`, fullPage: true });
    }
  });
}

test('pending request prevents duplicate submission and throttling keeps form recoverable', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let calls = 0;
  await page.route('**/auth/forgot-password', async route => {
    calls++;
    await gate;
    await route.fulfill({ status: 429, json: {} });
  });
  await page.goto('/#/forgot-password');
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByRole('button', { name: 'Send reset code' }).click();
  await expect(page.getByRole('button', { name: 'Please wait' })).toBeDisabled();
  await page.getByLabel('Email', { exact: true }).press('Enter');
  release();
  await expect(page.getByRole('alert')).toContainText('Too many attempts');
  expect(calls).toBe(1);
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('learner@example.com');
  await expect(page.getByRole('button', { name: 'Send reset code' })).toBeEnabled();
});

test('requests a reset code without claiming an account exists', async ({ page }) => {
  await page.route('**/auth/forgot-password', async route => {
    expect(route.request().postDataJSON()).toEqual({ email: 'learner@example.com' });
    await route.fulfill({ status: 202, json: { status: 'accepted' } });
  });
  await page.goto('/#/sign-in');
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await page.getByLabel('Email', { exact: true }).fill(' learner@example.com ');
  await page.getByRole('button', { name: 'Send reset code' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  await expect(page.getByText(/If an account matches/)).toBeVisible();
  await page.getByRole('link', { name: 'Enter reset code' }).click();
  await expect(page.getByRole('heading', { name: 'Reset password' })).toBeVisible();
});

for (const mode of ['verify', 'reset'] as const) {
  test(`${mode} validates, handles expired codes and completes only on valid response`, async ({ page }) => {
    let calls = 0;
    await page.route(`**/auth/${mode === 'verify' ? 'verify-email' : 'reset-password'}`, async route => {
      calls++;
      expect(route.request().postDataJSON()).toEqual({ email: 'learner@example.com', code: '123456',
        ...(mode === 'reset' ? { password: '  a valid password  ' } : {}) });
      await route.fulfill(calls === 1 ? { status: 410, json: {} }
        : { status: 200, json: { status: mode === 'verify' ? 'verified' : 'reset' } });
    });
    await page.goto(`/#/${mode === 'verify' ? 'verify-email' : 'reset-password'}`);
    const submit = page.getByRole('button', { name: mode === 'verify' ? 'Verify email' : 'Reset password', exact: true });
    await submit.click();
    await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
    await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
    await page.getByLabel('Email code', { exact: true }).fill('123456');
    if (mode === 'reset') await page.getByLabel('Password', { exact: true }).fill('  a valid password  ');
    await submit.click();
    await expect(page.getByRole('alert')).toContainText('invalid or has expired');
    await submit.click();
    await expect(page.getByRole('heading', { name: mode === 'verify' ? 'Email verified' : 'Password updated' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  });
}

test('resend verification and reject malformed success', async ({ page }) => {
  await page.route('**/auth/resend-verification', route => route.fulfill({ status: 202, json: { status: 'accepted' } }));
  await page.route('**/auth/verify-email', route => route.fulfill({ status: 200, json: {} }));
  await page.goto('/#/verify-email');
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByRole('button', { name: 'Send a new code' }).click();
  await expect(page.getByRole('status')).toContainText('If your account needs verification');
  await page.getByLabel('Email code', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Verify email', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('unexpected response');
  await expect(page.getByRole('heading', { name: 'Email verified' })).toHaveCount(0);
});
