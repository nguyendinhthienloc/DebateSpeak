import { expect, test } from '@playwright/test';

test('preview routes survive reload, back/forward and unknown URLs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Preview rooms', exact: true }).click();
  await page.getByRole('link', { name: 'Create a room', exact: true }).click();
  await expect(page).toHaveURL(/#\/rooms\/new$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Set up your room' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Find your practice room' })).toBeVisible();
  await page.goForward();
  await expect(page.locator('main')).toBeFocused();
  await page.goto('/#/missing');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to rooms', exact: true }).click();
  await expect(page).toHaveTitle('Rooms · DebateSpeak AI');
});

test('room previews never create a session, request media, or call a service', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (['fetch', 'xhr', 'websocket'].includes(request.resourceType())) requests.push(request.url());
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      value: () => { throw new Error('Scaffold must never request media'); },
    });
  });
  await page.goto('/#/rooms/new');
  await expect(page.getByRole('button', { name: 'Test microphone' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Test speaker' })).toBeDisabled();
  await page.getByRole('link', { name: 'Preview waiting lobby' }).click();
  await expect(page.getByText('Sample room · no seat is reserved.')).toBeVisible();
  await page.getByLabel('Preview screen').selectOption('/rooms/ready');
  await expect(page.getByText('Room setup complete · 2 of 2 joined')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Test microphone' })).toBeDisabled();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie })))
    .toEqual({ local: 0, session: 0, cookie: '' });
});

test('all screens reflow at narrow and desktop widths', async ({ page }) => {
  for (const width of [320, 390, 1102, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const routes = await page.getByLabel('Preview screen').locator('option').evaluateAll(options =>
      options.map(option => (option as HTMLOptionElement).value));
    for (const route of routes) {
      await page.getByLabel('Preview screen').selectOption(route);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} at ${width}px`).toBe(true);
    }
  }
});

test('keyboard controls and settings remain local and usable', async ({ page }) => {
  await page.goto('/#/register');
  await page.getByLabel('Password', { exact: true }).fill('example-only-password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
  await page.goto('/#/rooms/new/settings');
  await page.getByRole('radio', { name: 'Timed turns', exact: true }).check();
  await page.getByLabel('Duration (minutes)').fill('15');
  await page.getByRole('link', { name: 'Use these settings' }).click();
  await expect(page.getByText('Timed turns · 15 minutes')).toHaveCount(2);
  await page.reload();
  await expect(page.getByText('Free flow · 10 minutes')).toHaveCount(2);
  await page.goto('/#/profile');
  await page.getByLabel('Display name').fill('A very long learner name that should fit without making the page overflow');
  await page.getByRole('radio', { name: 'B2', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio', { name: 'B2', exact: true })).toBeChecked();
});
