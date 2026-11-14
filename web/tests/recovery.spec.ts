import { expect, test } from '@playwright/test';

test('verified email can request a separate reset code and change password', async ({ page }) => {
  await page.route('**/auth/verify-email', route => route.fulfill({ status: 200, json: { status: 'verified' } }));
  await page.route('**/auth/forgot-password', async route => {
    expect(route.request().postDataJSON()).toEqual({ email: 'learner@example.com' });
    await route.fulfill({ status: 202, json: { status: 'accepted' } });
  });
  await page.route('**/auth/reset-password', async route => {
    expect(route.request().postDataJSON()).toEqual({ email: 'learner@example.com', code: 'reset-code', password: 'new valid password' });
    await route.fulfill({ status: 200, json: { status: 'reset' } });
  });
  await page.goto('/#/verify-email');
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByLabel('Email code').fill('verify-code');
  await page.getByRole('button', { name: 'Verify email', exact: true }).click();
  await page.getByRole('link', { name: 'Change password', exact: true }).click();
  await expect(page).toHaveURL(/#\/forgot-password$/);
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('learner@example.com');
  await page.getByRole('button', { name: 'Send reset code' }).click();
  await page.getByRole('link', { name: 'Enter reset code' }).click();
  await expect(page.getByLabel('Email code')).toHaveValue('');
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('learner@example.com');
  await page.getByLabel('Email code').fill('reset-code');
  await page.getByLabel('Password', { exact: true }).fill('new valid password');
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Password updated' })).toBeVisible();
});

test('profile offers a password reset entry and direct reset links work after reload', async ({ page }) => {
  await page.goto('/#/profile');
  await page.getByRole('link', { name: 'Change password', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Forgot password?' })).toBeVisible();
  await page.goto('/#/reset-password');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Reset password', exact: true })).toBeVisible();
});

test('successful password reset clears a signed-in memory session', async ({ page }) => {
  const user = { id: 'd817b684-08e9-49c0-806a-a045fb7f060c', email: 'learner@example.com', display_name: 'Linh', cefr_level: 'B1', created_at: '2026-11-14T08:00:00Z' };
  await page.route('**/auth/login', route => route.fulfill({ status: 200, json: { access_token: 'example-token', token_type: 'bearer', expires_in: 900, user } }));
  await page.route('**/auth/reset-password', route => route.fulfill({ status: 200, json: { status: 'reset' } }));
  await page.goto('/#/sign-in');
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill('old valid password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toBeVisible();
  await page.goto('/#/reset-password');
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByLabel('Email code').fill('reset-code');
  await page.getByLabel('Password', { exact: true }).fill('new valid password');
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Password updated' })).toBeVisible();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
});

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
  await expect(page.getByRole('heading', { name: 'Forgot password?', exact: true })).toBeVisible();
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
