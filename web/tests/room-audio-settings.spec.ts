import { expect, test, type Page } from '@playwright/test';
import { fakeMic, openLiveRoom } from './helpers/rooms';

const gear = (page: Page) => page.getByRole('button', { name: 'Audio settings', exact: true });
const panel = (page: Page) => page.getByRole('region', { name: 'Audio settings' });

test('the gear opens audio settings and closes back to the gear', async ({ page }) => {
  await openLiveRoom(page);
  await expect(gear(page)).toBeEnabled();
  await gear(page).click();
  await expect(panel(page)).toBeVisible();
  await expect(gear(page)).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(panel(page)).toHaveCount(0);
  await expect(gear(page)).toBeFocused();
  expect(await page.evaluate(() => [window.__audio.muted, window.__audio.switched])).toEqual([[], []]);
});

test('choosing another microphone switches the live mic', async ({ page }) => {
  await openLiveRoom(page);
  await gear(page).click();
  await panel(page).getByLabel('Microphone', { exact: true }).selectOption({ label: 'USB headset' });
  await expect.poll(() => page.evaluate(() => window.__audio.switched)).toEqual([['audioinput', 'mic-2']]);
});

test('choosing a speaker routes the partner voice', async ({ page }) => {
  await openLiveRoom(page);
  await gear(page).click();
  await panel(page).getByLabel('Speaker', { exact: true }).selectOption({ label: 'Headphones' });
  await expect.poll(() => page.evaluate(() => window.__audio.switched)).toEqual([['audiooutput', 'spk-2']]);
});

test('a failed switch says so', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => { window.__audio.failSwitch = true; });
  await gear(page).click();
  await panel(page).getByLabel('Microphone', { exact: true }).selectOption({ label: 'USB headset' });
  await expect(panel(page).getByRole('alert')).toHaveText('That device could not be used. Pick another one.');
});

test('typists get no microphone picker', async ({ page }) => {
  await fakeMic(page, { signal: true });
  await openLiveRoom(page, { myInput: 'TYPE' });
  await gear(page).click();
  await expect(panel(page).getByLabel('Speaker', { exact: true })).toBeVisible();
  await expect(panel(page).getByLabel('Microphone', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.__mic.requests)).toBe(0);
});

test('no speaker picker where the browser cannot route sound', async ({ page }) => {
  await page.addInitScript(() => { delete (HTMLMediaElement.prototype as { setSinkId?: unknown }).setSinkId; });
  await openLiveRoom(page);
  await gear(page).click();
  await expect(panel(page).getByLabel('Microphone', { exact: true })).toBeVisible();
  await expect(panel(page).getByLabel('Speaker', { exact: true })).toHaveCount(0);
});
