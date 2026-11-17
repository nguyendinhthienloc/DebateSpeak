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
  await expect(page.locator('.home-greeting')).toHaveText(/^Good (morning|afternoon|evening), Linh\.$/);
  await expect(page.locator('header').getByText('Signed in as Linh', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
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

test('phone header keeps the brand on one line and history fits without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  const brand = page.getByRole('link', { name: 'DebateSpeak AI', exact: true });
  const lineHeight = await brand.evaluate(element => parseFloat(getComputedStyle(element).fontSize) * 1.6);
  expect((await brand.boundingBox())!.height).toBeLessThan(lineHeight);
  expect(await page.locator('.home-table').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await expect(page.getByText('12 Nov', { exact: true })).toBeVisible();
});

test('door headings and the create button never break mid-word at 320px with 200% text', async ({ page }) => {
  await signIn(page);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const split = await page.evaluate(() => {
    const broken: string[] = [];
    for (const element of document.querySelectorAll('.home-door h1, .home-door h2, .home-create')) {
      const text = element.firstChild;
      if (!text || text.nodeType !== Node.TEXT_NODE) continue;
      const value = text.textContent ?? '';
      for (const match of value.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(text, match.index!);
        range.setEnd(text, match.index! + match[0].length);
        if (range.getClientRects().length > 1) broken.push(match[0]);
      }
    }
    return broken;
  });
  expect(split).toEqual([]);
});

test('only the page, doors and topic cards animate in', async ({ page }) => {
  await signIn(page);
  expect(await page.locator('.home-section').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.locator('.home-topic').nth(1).evaluate(element => getComputedStyle(element).animationName)).toBe('enter');
});
