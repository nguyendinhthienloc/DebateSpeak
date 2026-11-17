import { expect, test, type Page } from '@playwright/test';

const user = {
  id: 'd817b684-08e9-49c0-806a-a045fb7f060c', email: 'learner@example.com',
  display_name: 'Linh', cefr_level: 'B1', created_at: '2026-11-12T08:00:00Z',
};
const token = { access_token: 'test-access-token', token_type: 'bearer', expires_in: 900, user };

async function signIn(page: Page) {
  await page.route('**/api/v1/auth/*', route => route.request().url().endsWith('/refresh')
    ? route.fulfill({ status: 401, json: { code: 'no_session' } })
    : route.fulfill({ status: 200, json: token }));
  await page.goto('/#/sign-in');
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a valid password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/#\/home$/);
}

test('sign-in lands on the main menu', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Create a room', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Join with code', exact: true })).toBeVisible();
  await expect(page.locator('.home-greeting')).toContainText('Linh');
});

test('create door opens room setup', async ({ page }) => {
  await signIn(page);
  await page.getByRole('link', { name: 'Set up room', exact: true }).click();
  await expect(page).toHaveURL(/#\/rooms\/new$/);
});

test('join validates the code locally', async ({ page }) => {
  await signIn(page);
  const input = page.getByLabel('Invite code', { exact: true });
  await input.fill('K7Q2');
  await page.getByRole('button', { name: 'Join', exact: true }).click();
  await expect(page.getByText('Enter the 8-character code from your partner.', { exact: true })).toBeVisible();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toBeFocused();
  await expect(page).toHaveURL(/#\/home$/);
});

test('valid code opens the invitation preview', async ({ page }) => {
  await signIn(page);
  await page.getByLabel('Invite code', { exact: true }).fill(' k7q2-m9xa ');
  await page.getByRole('button', { name: 'Join', exact: true }).click();
  await expect(page).toHaveURL(/#\/invite$/);
  expect(page.url().toUpperCase()).not.toContain('K7Q2');
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('samples are labelled and carry no scores', async ({ page }) => {
  await signIn(page);
  await expect(page.getByText('Sample', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Topics and history show sample content. No real debate is listed.', { exact: true })).toBeVisible();
  expect(await page.locator('main').innerText()).not.toMatch(/\d+\s*\/\s*\d+|score/i);
});

test('signed out shows the sign-in prompt', async ({ page }) => {
  await page.route('**/api/v1/auth/refresh', route => route.fulfill({ status: 401, json: { code: 'no_session' } }));
  await page.goto('/#/home');
  await expect(page.getByText('Sign in to see this page.', { exact: true })).toBeVisible();
});

test('home reflows at 320px with enlarged text', async ({ page }) => {
  await signIn(page);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('h1')).toHaveCount(1);
});
