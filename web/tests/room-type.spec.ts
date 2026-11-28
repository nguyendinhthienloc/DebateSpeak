import { expect, test } from '@playwright/test';
import { fakeMic, openLiveRoom, openReadyRoom, samId } from './helpers/rooms';

test('Type instead skips the microphone and unlocks Ready after consent', async ({ page }) => {
  await fakeMic(page, { signal: true });
  const calls = await openReadyRoom(page);
  await page.getByRole('button', { name: 'Type instead', exact: true }).click();
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: "I'm ready", exact: true }).click();
  await expect.poll(() => calls.ready()).toEqual({ consent: true, input: 'TYPE' });
  expect(await page.evaluate(() => window.__mic.requests)).toBe(0);
});

test('Type instead can be switched back to the microphone', async ({ page }) => {
  await fakeMic(page, { signal: true });
  await openReadyRoom(page);
  await page.getByRole('button', { name: 'Type instead', exact: true }).click();
  await page.getByRole('button', { name: 'Use my microphone', exact: true }).click();
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Test microphone', exact: true })).toBeVisible();
});

test('consent says typed words are saved', async ({ page }) => {
  await openReadyRoom(page);
  await expect(page.getByText('Anything you type is saved in your transcript and analysed by AI.', { exact: true })).toBeVisible();
});

test('type mode starts with the panel open, hides Mute and publishes no mic', async ({ page }) => {
  await openLiveRoom(page, { myInput: 'TYPE' });
  await expect(page.getByRole('textbox', { name: 'Type your turn' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mute', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.__audio.connects[0].publishMic)).toBe(false);
});

test('a voice debater can open Type, and it stays quieter than Mute', async ({ page }) => {
  await openLiveRoom(page);
  await expect(page.getByRole('textbox', { name: 'Type your turn' })).toHaveCount(0);
  const type = page.getByRole('button', { name: 'Type', exact: true });
  expect(await type.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  await type.click();
  await expect(page.getByRole('textbox', { name: 'Type your turn' })).toBeVisible();
});

test('sending saves the turn and tells the partner', async ({ page }) => {
  const calls = await openLiveRoom(page, { myInput: 'TYPE' });
  await page.getByRole('textbox', { name: 'Type your turn' }).fill('Cars pollute the centre.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect.poll(() => calls.turns()).toEqual([{ text: 'Cars pollute the centre.' }]);
  await expect(page.getByRole('textbox', { name: 'Type your turn' })).toHaveValue('');
  await expect.poll(() => page.evaluate(() => window.__audio.announced)).toEqual([1]);
  await expect(page.getByRole('log', { name: 'Typed turns' })).toContainText('Cars pollute the centre.');
});

test('a failed send keeps the words', async ({ page }) => {
  await openLiveRoom(page, { myInput: 'TYPE', turnsFail: true });
  await page.getByRole('textbox', { name: 'Type your turn' }).fill('Keep these words.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Your turn was not sent. Try again.');
  await expect(page.getByRole('textbox', { name: 'Type your turn' })).toHaveValue('Keep these words.');
});

test("a partner's typed turn appears in the spotlight by itself", async ({ page }) => {
  const room = await openLiveRoom(page);
  room.addTurn({ seq: 1, user_id: samId, text: 'Buses can replace cars.', at_ms: 5000 });
  await page.evaluate(() => window.__audio.emit({ type: 'turn', seq: 1 }));
  await expect(page.getByTestId('spotlight-name')).toHaveText('Sam');
  await expect(page.getByTestId('spotlight-text')).toHaveText('Buses can replace cars.');
});

test('turns survive a reload', async ({ page }) => {
  const room = await openLiveRoom(page, { myInput: 'TYPE' });
  room.addTurn({ seq: 1, user_id: samId, text: 'Still here.', at_ms: 5000 });
  await page.reload();
  await expect(page.getByRole('log', { name: 'Typed turns' })).toContainText('Still here.');
});

test('the chip changes when both debaters type', async ({ page }) => {
  await openLiveRoom(page, { myInput: 'TYPE', partnerInput: 'TYPE' });
  await expect(page.getByText('Live · Typed debate · Saved to transcript', { exact: true })).toBeVisible();
});

test('the text box stops at 500 characters', async ({ page }) => {
  await openLiveRoom(page, { myInput: 'TYPE' });
  await expect(page.getByRole('textbox', { name: 'Type your turn' })).toHaveAttribute('maxlength', '500');
});

test('typed turns render as plain text', async ({ page }) => {
  const room = await openLiveRoom(page, { myInput: 'TYPE' });
  room.addTurn({ seq: 1, user_id: samId, text: '<b>bold</b>', at_ms: 5000 });
  await page.evaluate(() => window.__audio.emit({ type: 'turn', seq: 1 }));
  await expect(page.getByRole('log', { name: 'Typed turns' })).toContainText('<b>bold</b>');
  await expect(page.locator('[role="log"] b')).toHaveCount(0);
});

test('on a phone the panel is a bottom sheet on screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLiveRoom(page, { myInput: 'TYPE' });
  await expect(page.getByRole('textbox', { name: 'Type your turn' })).toBeInViewport();
  const sheet = (await page.locator('.type-panel').boundingBox())!;
  expect(Math.round(sheet.y + sheet.height)).toBe(844);
});
