import { expect, test } from '@playwright/test';

test('signed-out visitors land on the welcome stage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Welcome · DebateSpeak AI');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Create account', exact: true }).first()).toHaveAttribute('href', '#/register');
});

test('choosing a podium answers in place and carries the side through the acts', async ({ page }) => {
  const calls: string[] = [];
  page.on('request', request => { if (['fetch', 'xhr'].includes(request.resourceType()) && !request.url().endsWith('/auth/refresh')) calls.push(request.url()); });
  await page.goto('/#/welcome');
  const against = page.getByRole('button', { name: /^AGAINST/ });
  await against.click();
  await expect(against).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /^FOR/ })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.w-centre')).toContainText('You argue AGAINST. Your partner takes FOR.');
  await expect(page.locator('#act-3 .w-side.is-mine .w-side-head')).toHaveText('AGAINSTYou');
  await expect(page.locator('#act-6')).toContainText('You argued AGAINST.');
  await expect(page.locator('#act-5 .w-quote')).toHaveText('“Buses do not run at night”');
  expect(calls).toEqual([]);
});

test('unbuilt acts are labelled and examples are marked', async ({ page }) => {
  await page.goto('/#/welcome');
  await expect(page.getByText('Coming in a later release')).toHaveCount(3);
  for (const label of ['Example motion · nothing is recorded', 'Example room', 'Example transcript', 'Example feedback · not a real result']) await expect(page.getByText(label, { exact: true })).toBeVisible();
  await expect(page.getByLabel('Preview screen')).toHaveCount(0);
});

test('the page snaps, and reduced motion turns snapping off', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/welcome');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe('y mandatory');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe('none');
  await page.goto('/#/sign-in');
  expect(await page.evaluate(() => document.documentElement.classList.contains('w-snap'))).toBe(false);
});

test('welcome reflows at 320px with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/welcome');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
