import { expect, test, type Page } from '@playwright/test';

async function toLevelStep(page: Page, name = '') {
  await page.goto('/#/register');
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a valid password');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  if (name) await page.getByLabel('Display name (optional)').fill(name);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('Step 3 of 3 · English level', { exact: true })).toBeVisible();
}

test('auth screens use their own stage, without the app header or dev bar', async ({ page }) => {
  for (const route of ['/sign-in', '/register', '/account-created', '/forgot-password']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('.auth-stage')).toBeVisible();
    await expect(page.locator('.app-bar')).toHaveCount(0);
    await expect(page.getByLabel('Preview screen')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'DebateSpeak AI', exact: true })).toHaveAttribute('href', '#/welcome');
  }
  await page.goto('/#/sign-in');
  await page.getByRole('link', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
});

test('the lectern name plate follows the display name and level', async ({ page }) => {
  await toLevelStep(page, 'Linh');
  const lectern = page.locator('.auth-lectern');
  await expect(lectern).toHaveAttribute('aria-hidden', 'true');
  await expect(lectern).toContainText('Linh');
  await expect(lectern).toContainText('English level not set');
  await page.getByRole('radio', { name: 'C1', exact: true }).check();
  await expect(lectern).toContainText('English level C1');
});

test('a new account is welcomed by name on the sign-in lectern', async ({ page }) => {
  await page.route('**/auth/register', route => route.fulfill({ status: 201, json: {
    id: 'd817b684-08e9-49c0-806a-a045fb7f060c', email: 'learner@example.com', display_name: 'Linh', cefr_level: 'B2', created_at: '2026-11-12T08:00:00Z' } }));
  await toLevelStep(page, 'Linh');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How do you speak English today?');
  await page.getByRole('radio', { name: 'B2', exact: true }).check();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('Account created', { exact: true })).toBeVisible();
  await expect(page.locator('.auth-lectern')).toContainText('Welcome, Linh');
  await expect(page.locator('.auth-lectern')).toContainText('English level B2');
  await expect(page.getByRole('link', { name: 'Preview rooms' })).toHaveCount(0);
});

test('the level is optional and says what happens without one', async ({ page }) => {
  await toLevelStep(page);
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.getByText("No level chosen? You'll start at B1. Change it in Profile anytime.", { exact: true })).toBeVisible();
});

test('the quick guide suggests a level, fills the choice and sends nothing', async ({ page }) => {
  const calls: string[] = [];
  // The app-wide session restore on load is the only allowed call.
  page.on('request', request => {
    if (request.method() === 'POST' && !request.url().endsWith('/api/v1/auth/refresh')) calls.push(request.url());
  });
  await toLevelStep(page);
  const unsure = page.getByRole('button', { name: /I'm not sure/ });
  await unsure.click();
  const guide = page.getByRole('dialog');
  await expect(guide).toBeVisible();
  await expect(guide.getByRole('heading', { level: 2 })).toContainText('I can say what I think about a simple topic');
  await expect(guide.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await guide.getByRole('radio', { name: 'Yes', exact: true }).check();
  await guide.getByRole('button', { name: 'Continue' }).click();
  await guide.getByRole('radio', { name: 'Yes', exact: true }).check();
  await guide.getByRole('button', { name: 'Continue' }).click();
  // Back keeps the earlier answer.
  await guide.getByRole('button', { name: 'Back' }).click();
  await expect(guide.getByRole('radio', { name: 'Yes', exact: true })).toBeChecked();
  await guide.getByRole('button', { name: 'Continue' }).click();
  await guide.getByRole('radio', { name: 'Not yet', exact: true }).check();
  await guide.getByRole('button', { name: 'Continue' }).click();
  await expect(guide.getByRole('heading', { name: 'We suggest B1' })).toBeVisible();
  await guide.getByRole('button', { name: 'Use B1' }).click();
  await expect(guide).toHaveCount(0);
  await expect(page.getByRole('radio', { name: 'B1', exact: true })).toBeChecked();
  await expect(unsure).toBeFocused();
  await expect(page.locator('h1')).toHaveCount(1);
  expect(calls).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('closing the quick guide changes nothing', async ({ page }) => {
  await toLevelStep(page);
  await page.getByRole('button', { name: /I'm not sure/ }).click();
  await page.getByRole('dialog').getByRole('radio', { name: 'Sometimes', exact: true }).check();
  await page.getByRole('dialog').getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'We suggest A2' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await page.getByRole('button', { name: /I'm not sure/ }).click();
  await page.getByRole('button', { name: 'Close quick guide' }).click();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
});

test('a guide that reaches C1 suggests C1', async ({ page }) => {
  await toLevelStep(page);
  await page.getByRole('button', { name: /I'm not sure/ }).click();
  const guide = page.getByRole('dialog');
  for (let step = 0; step < 4; step++) {
    await guide.getByRole('radio', { name: 'Yes', exact: true }).check();
    await guide.getByRole('button', { name: 'Continue' }).click();
  }
  await expect(guide.getByRole('heading', { name: 'We suggest C1' })).toBeVisible();
});

test('auth stage and quick guide reflow at 320px with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await toLevelStep(page, 'Trần Lê Anh Tuấn Nguyễn Đình Thiên Lộc');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: /I'm not sure/ }).click();
  expect(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
});
