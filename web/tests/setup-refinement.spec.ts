import { expect, test, type Page } from '@playwright/test';

const timed = (page: Page) => page.getByRole('radio', { name: 'Timed turns', exact: true });
const free = (page: Page) => page.getByRole('radio', { name: 'Free flow', exact: true });
const firstRow = (page: Page) => page.locator('.preview-row').first();

test('preview row is emphasised after a change, never on load', async ({ page }) => {
  await page.goto('/#/rooms/new/settings');
  await expect(page.locator('.preview-row.flash')).toHaveCount(0);
  await timed(page).check();
  await expect(firstRow(page)).toHaveText('Timed turns · 10 minutes');
  await expect(firstRow(page)).toHaveClass(/flash/);
  await expect(firstRow(page)).toHaveCSS('animation-name', 'row-emphasis');
});

test('reduced motion keeps the update but removes the animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/rooms/new/settings');
  await timed(page).check();
  await expect(firstRow(page)).toHaveText('Timed turns · 10 minutes');
  await expect(firstRow(page)).toHaveCSS('animation-name', 'none');
});

test('rapid toggles settle on the last value', async ({ page }) => {
  await page.goto('/#/rooms/new/settings');
  for (let i = 0; i < 5; i += 1) { await timed(page).check(); await free(page).check(); }
  await expect(firstRow(page)).toHaveText('Free flow · 10 minutes');
});

test('duration clamps on blur: blank, below min, above max', async ({ page }) => {
  await page.goto('/#/rooms/new/settings');
  const duration = page.getByLabel('Duration (minutes)');
  for (const [typed, expected] of [['', '10'], ['0', '1'], ['99', '30']] as const) {
    await duration.fill(typed);
    await duration.blur();
    await expect(duration).toHaveValue(expected);
  }
});

test('chosen stance shows the opposite stance for the partner', async ({ page }) => {
  await page.goto('/#/rooms/new/settings');
  await page.getByRole('radio', { name: 'I choose', exact: true }).check();
  await page.getByRole('radio', { name: 'Against (CON)', exact: true }).check();
  const preview = page.getByRole('complementary', { name: 'Room preview and audio checks' });
  await expect(preview.getByText('Against (CON)', { exact: true })).toBeVisible();
  await expect(preview.getByText('In favor (PRO)', { exact: true })).toBeVisible();
});

test('narrow: preview details toggle, audio explanation stays visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/rooms/new/settings');
  const heading = page.getByRole('heading', { name: 'Room preview' });
  await expect(page.locator('#audio-limit')).toBeVisible();
  await expect(heading).toBeHidden();
  await page.getByText('Preview details', { exact: true }).click();
  await expect(heading).toBeVisible();
  await page.getByText('Preview details', { exact: true }).click();
  await expect(heading).toBeHidden();
  await expect(page.locator('#audio-limit')).toBeVisible();
});