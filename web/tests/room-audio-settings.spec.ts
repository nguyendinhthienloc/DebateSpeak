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

const stoppedAlert = (page: Page) => page.getByRole('alert').filter({ hasText: 'Your microphone stopped.' });

test('a stopped mic shows an alert and the true mute state', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => window.__audio.emit({ type: 'mic', state: 'stopped' }));
  await expect(stoppedAlert(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unmute', exact: true })).toBeVisible();
  await stoppedAlert(page).getByRole('button', { name: 'Open audio settings', exact: true }).click();
  await expect(panel(page)).toBeVisible();
});

test('the alert clears when the mic is live again', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => window.__audio.emit({ type: 'mic', state: 'stopped' }));
  await expect(stoppedAlert(page)).toBeVisible();
  await page.evaluate(() => window.__audio.emit({ type: 'mic', state: 'live' }));
  await expect(stoppedAlert(page)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Mute', exact: true })).toBeVisible();
});

test('a failed unmute shows the alert', async ({ page }) => {
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));
  await openLiveRoom(page);
  await page.evaluate(() => { window.__audio.failUnmute = true; });
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
  await page.getByRole('button', { name: 'Unmute', exact: true }).click();
  await expect(stoppedAlert(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unmute', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

const noMicNotice = (page: Page) => page.getByRole('alert').filter({ hasText: 'No microphone found' });

test('with no microphone left, the stage offers typing', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => { window.__audio.devices.audioinput = []; window.__audio.emit({ type: 'mic', state: 'stopped' }); });
  await expect(noMicNotice(page)).toBeVisible();
  const before = await page.evaluate(() => [window.__audio.muted.length, window.__audio.connects.length]);
  await noMicNotice(page).getByRole('button', { name: 'Type instead', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Typed turns' })).toBeVisible();
  await expect(page.getByLabel('Type your turn', { exact: true })).toBeFocused();
  await expect(noMicNotice(page)).toHaveCount(0);
  expect(await page.evaluate(() => [window.__audio.muted.length, window.__audio.connects.length])).toEqual(before);
});

test('the notice gives way when a mic is plugged back in', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => { window.__audio.devices.audioinput = []; window.__audio.emit({ type: 'mic', state: 'stopped' }); });
  await expect(noMicNotice(page)).toBeVisible();
  await page.evaluate(() => {
    window.__audio.devices.audioinput = [{ id: 'mic-3', label: 'Webcam microphone' }];
    navigator.mediaDevices.dispatchEvent(new Event('devicechange'));
  });
  await expect(noMicNotice(page)).toHaveCount(0);
  await expect(stoppedAlert(page).getByRole('button', { name: 'Open audio settings', exact: true })).toBeVisible();
});

test('a stopped mic with another mic available shows only the settings alert', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => window.__audio.emit({ type: 'mic', state: 'stopped' }));
  await expect(stoppedAlert(page)).toBeVisible();
  await expect(noMicNotice(page)).toHaveCount(0);
});

test('the meter hears the live mic', async ({ page }) => {
  await fakeMic(page, { signal: true });
  await openLiveRoom(page);
  await page.evaluate(() => { window.__audio.micTone = 0.5; });
  await gear(page).click();
  await expect(panel(page).getByText('We can hear you', { exact: true })).toBeVisible();
  expect(await panel(page).locator('.mic-meter span.on').count()).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.__mic.requests)).toBe(0);
});

test('the meter says when there is no sound', async ({ page }) => {
  await openLiveRoom(page);
  await gear(page).click();
  await expect(panel(page).getByText('No sound yet', { exact: true })).toBeVisible();
});

test('the meter says when the mic stopped', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => window.__audio.emit({ type: 'mic', state: 'stopped' }));
  await gear(page).click();
  await expect(panel(page).getByText('Microphone stopped', { exact: true })).toBeVisible();
});

test('closing audio settings leaves the live mic running', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => { window.__audio.micTone = 0.5; });
  await gear(page).click();
  await expect(panel(page).getByText('We can hear you', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel(page)).toHaveCount(0);
  expect(await page.evaluate(() => window.__audio.track?.readyState)).toBe('live');
});

test('the partner volume slider sets their volume', async ({ page }) => {
  await openLiveRoom(page);
  await gear(page).click();
  const slider = panel(page).getByLabel("Sam's volume", { exact: true });
  await expect(slider).toHaveValue('100');
  await slider.fill('40');
  await expect.poll(() => page.evaluate(() => window.__audio.volumes.at(-1))).toBe(0.4);
  await expect(panel(page).getByText('40%', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await gear(page).click();
  await expect(panel(page).getByLabel("Sam's volume", { exact: true })).toHaveValue('40');
});

test('audio settings can mute and unmute the mic, in step with the dock', async ({ page }) => {
  await openLiveRoom(page);
  await gear(page).click();
  await panel(page).getByRole('button', { name: 'Mute microphone', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__audio.muted)).toEqual([true]);
  await expect(page.getByRole('button', { name: 'Unmute', exact: true })).toBeVisible();
  await panel(page).getByRole('button', { name: 'Unmute microphone', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__audio.muted)).toEqual([true, false]);
  await expect(page.getByRole('button', { name: 'Mute', exact: true })).toBeVisible();
  await expect(panel(page)).toBeVisible();
});

test('typists get no mute in audio settings', async ({ page }) => {
  await openLiveRoom(page, { myInput: 'TYPE' });
  await gear(page).click();
  await expect(panel(page).getByRole('button', { name: /mute microphone/i })).toHaveCount(0);
});
