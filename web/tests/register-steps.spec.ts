import { expect, test, type Page } from '@playwright/test';

const user = {
  id: 'd817b684-08e9-49c0-806a-a045fb7f060c', email: 'learner@example.com',
  display_name: 'Linh', cefr_level: 'B2', created_at: '2026-11-12T08:00:00Z',
};
const password = 'a valid password';

async function countRegisterPosts(page: Page) {
  const calls = { count: 0 };
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/v1/auth/register') calls.count++;
  });
  return calls;
}

async function fillStepOne(page: Page) {
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByLabel('Password', { exact: true }).fill(password);
}

test('step 1 continues without calling the API', async ({ page }) => {
  const calls = await countRegisterPosts(page);
  await page.goto('/#/register');
  await expect(page.getByText('Step 1 of 2 · Account', { exact: true })).toBeVisible();
  await fillStepOne(page);
  await page.getByLabel('Password', { exact: true }).press('Enter');
  await expect(page.getByText('Step 2 of 2 · Learning profile', { exact: true })).toBeVisible();
  await expect(page.getByText('Step 2 of 2 · Learning profile', { exact: true })).toBeFocused();
  expect(await page.locator('.register-step').evaluate(element => getComputedStyle(element).animationName)).toBe('step-forward');
  expect(calls.count).toBe(0);
});

test('step 1 blocks invalid credentials', async ({ page }) => {
  await page.goto('/#/register');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  await expect(page.getByText('Enter your email address.', { exact: true })).toBeVisible();
  await expect(page.getByText('Step 1 of 2 · Account', { exact: true })).toBeVisible();
});

test('back keeps values', async ({ page }) => {
  await page.goto('/#/register');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('learner@example.com');
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue(password);
  expect(await page.locator('.register-step').evaluate(element => getComputedStyle(element).animationName)).toBe('step-back');
});

test('409 returns to step 1 with email focused', async ({ page }) => {
  await page.route('**/auth/register', route => route.fulfill({ status: 409, json: { code: 'EMAIL_TAKEN' } }));
  await page.goto('/#/register');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('An account already uses this email.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue(password);
  await expect(page.getByText('Step 1 of 2 · Account', { exact: true })).toBeVisible();
});

test('422 cefr error stays on step 2', async ({ page }) => {
  await page.route('**/auth/register', route => route.fulfill({ status: 422,
    json: { code: 'VALIDATION_ERROR', errors: [{ field: 'cefr_level', message: 'Invalid choice' }] } }));
  await page.goto('/#/register');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Your English level' })).toBeFocused();
  await expect(page.getByText('Step 2 of 2 · Learning profile', { exact: true })).toBeVisible();
});

test('step change is instant under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/register');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  expect(await page.locator('.register-step').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('no step data in URL or storage', async ({ page }) => {
  await page.goto('/#/register');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('Step 2 of 2 · Learning profile', { exact: true })).toBeVisible();
  expect(page.url()).toMatch(/#\/register$/);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('registers through both steps', async ({ page }) => {
  let body: unknown;
  await page.route('**/auth/register', async route => { body = route.request().postDataJSON(); await route.fulfill({ status: 201, json: user }); });
  await page.goto('/#/register');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Display name (optional)').fill('Linh');
  await page.getByRole('radio', { name: 'B2', exact: true }).check();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('Account created', { exact: true })).toBeVisible();
  expect(body).toEqual({ email: 'learner@example.com', password, display_name: 'Linh', cefr_level: 'B2' });
});
