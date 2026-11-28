import { expect, test } from '@playwright/test';

test('routes survive reload, back/forward and unknown URLs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Cities should ban private cars from the centre' })).toBeVisible();
  await page.getByRole('link', { name: 'Sign in', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await page.goto('/#/rooms/new');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Create room', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.locator('main')).toBeFocused();
  await page.goto('/#/missing');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveTitle('Home · DebateSpeak AI');
});

test('signed out, room setup never creates a session, requests media, or calls a service', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    // The app-wide session restore on load is the only allowed call; rooms add none.
    if (['fetch', 'xhr', 'websocket'].includes(request.resourceType())
      && !request.url().endsWith('/api/v1/auth/refresh')) requests.push(request.url());
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      value: () => { throw new Error('Scaffold must never request media'); },
    });
  });
  await page.goto('/#/rooms/new');
  await expect(page.getByText('Sign in to see this page.', { exact: true })).toBeVisible();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie })))
    .toEqual({ local: 0, session: 0, cookie: '' });
});

test('all screens reflow at narrow and desktop widths', async ({ page }) => {
  for (const width of [320, 390, 1102, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    // Auth and welcome screens have no dev bar; read the route list from an app screen.
    await page.goto('/#/profile');
    const routes = await page.getByLabel('Preview screen').locator('option').evaluateAll(options =>
      options.map(option => (option as HTMLOptionElement).value));
    for (const route of routes) {
      await page.goto(`/#${route}`);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} at ${width}px`).toBe(true);
    }
  }
});

test('keyboard controls remain usable', async ({ page }) => {
  await page.goto('/#/register');
  await page.getByLabel('Password', { exact: true }).fill('example-only-password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
  await page.goto('/#/profile');
  await page.getByLabel('Display name').fill('A very long learner name that should fit without making the page overflow');
  await page.getByRole('radio', { name: 'B2', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio', { name: 'B2', exact: true })).toBeChecked();
});

test('pages animate in', async ({ page }) => {
  await page.goto('/#/profile');
  expect(await page.locator('main').evaluate(element => getComputedStyle(element).animationName)).toBe('enter');
});

test('reduced motion disables every animation and leaves content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/register');
  const main = page.locator('main');
  expect(await main.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await main.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  const button = page.getByRole('button', { name: 'Continue', exact: true });
  expect(await button.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
});

test('page descriptions are short regular-weight leads', async ({ page }) => {
  await page.goto('/#/missing');
  const lead = page.getByText('This link does not match a page.', { exact: true });
  await expect(lead).toBeVisible();
  expect(await lead.evaluate(element => getComputedStyle(element).fontWeight)).toBe('400');
  await page.goto('/#/home');
  await expect(page.locator('.page-heading p')).toHaveCount(0);
});
