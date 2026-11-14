import { expect, test } from '@playwright/test';

test('password visibility stays inside the input group and keeps the value and label', async ({ page }) => {
  for (const route of ['/sign-in', '/register']) {
    await page.goto(`/#${route}`);
    const input = page.getByLabel('Password', { exact: true });
    const button = page.getByRole('button', { name: 'Show password', exact: true });
    await input.fill('example-only-password');
    const field = await input.boundingBox();
    const action = await button.boundingBox();
    expect(field!.x + field!.width).toBeLessThanOrEqual(action!.x + 1);
    expect(Math.abs(field!.y + field!.height / 2 - action!.y - action!.height / 2)).toBeLessThan(2);
    expect(action!.height).toBeGreaterThanOrEqual(44);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveValue('example-only-password');
    await expect(page.getByRole('button', { name: 'Hide password', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('autocomplete', route === '/register' ? 'new-password' : 'current-password');
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  }
});

test('account CEFR selection has keyboard and non-color feedback', async ({ page }) => {
  for (const route of ['/register', '/profile']) {
    await page.goto(`/#${route}`);
    await page.getByRole('radio', { name: 'B1', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: 'B2', exact: true })).toBeChecked();
    await expect(page.getByText('Selected: B2', { exact: true })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'B2', exact: true })).toBeFocused();
    await expect(page.locator('.choice-check')).toHaveCount(1);
  }
});

test('all account routes reflow with enlarged text and preserve profile limitations', async ({ page }) => {
  for (const width of [320, 390, 640, 768, 1102, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/sign-in', '/register', '/account-created', '/profile']) {
      await page.goto(`/#${route}`);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} / ${width}px / 200% text`).toBe(true);
      await expect(page.locator('h1')).toHaveCount(1);
      if (route === '/profile') {
        await page.getByLabel('Display name', { exact: true }).fill('Trần Lê Anh Tuấn Nguyễn Đình Thiên Lộc Nguyễn Bảo Minh Triết');
        await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toBeDisabled();
        await expect(page.locator('#profile-limit')).toContainText('not connected');
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    }
  }
});

test('Vietnamese font coverage loads locally and blocked fonts keep forms usable', async ({ page }) => {
  const fonts: string[] = [];
  page.on('request', request => { if (request.resourceType() === 'font') fonts.push(request.url()); });
  await page.goto('/#/profile');
  await page.getByLabel('Display name', { exact: true }).fill('Trần Lê Anh Tuấn');
  await page.evaluate(async () => {
    await Promise.all([400, 600].map(weight => document.fonts.load(`${weight} 16px Inter`, 'Trần Lê Anh Tuấn')));
  });
  expect(fonts.some(url => url.includes('vietnamese-400'))).toBe(true);
  expect(fonts.some(url => url.includes('vietnamese-600'))).toBe(true);
  expect(fonts.every(url => new URL(url).origin === 'http://127.0.0.1:5173')).toBe(true);
  await page.route('**/*.{woff,woff2}', route => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your profile', exact: true })).toBeVisible();
  await page.getByLabel('Display name', { exact: true }).fill('Nguyễn Đình Thiên Lộc');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('reduced motion preserves immediate control state without transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/register');
  const reveal = page.getByRole('button', { name: 'Show password', exact: true });
  expect(await reveal.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  await reveal.click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');
});

test('account and room navigation preserves keyboard skip, history and recovery', async ({ page }) => {
  await page.goto('/#/sign-in');
  const skip = page.getByRole('link', { name: 'Skip to content', exact: true });
  await skip.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).toHaveURL(/#\/sign-in$/);
  await page.getByRole('link', { name: 'Preview rooms', exact: true }).click();
  await page.getByRole('link', { name: 'Account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your profile', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#\/rooms$/);
  await expect(page.locator('main')).toBeFocused();
  await page.goForward();
  await expect(page).toHaveTitle('Profile · DebateSpeak AI');
  for (const route of ['/rooms/expired', '/not-a-screen']) {
    await page.goto(`/#${route}`);
    await page.getByRole('link', { name: 'Back to rooms', exact: true }).click();
    await expect(page).toHaveURL(/#\/rooms$/);
    await expect(page.getByRole('heading', { name: 'Find your practice room', exact: true })).toBeVisible();
  }
});
