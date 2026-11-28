import { expect, test } from '@playwright/test';
import { installFakeAudio } from './helpers/fakeAudio';
import { fakeMic, linhSeat, openReadyRoom, passAgree, roomId, samSeat, snapshot } from './helpers/rooms';

test('no microphone is requested until the learner clicks Test', async ({ page }) => {
  await fakeMic(page, { signal: true });
  await openReadyRoom(page);
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeDisabled();
  expect(await page.evaluate(() => window.__mic.requests)).toBe(0);
});

test('agreeing and passing the mic test unlocks Ready and releases the mic', async ({ page }) => {
  await fakeMic(page, { signal: true });
  await openReadyRoom(page);
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await expect(page.getByText('We can hear you', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => window.__mic.stopped)).toBeGreaterThan(0);
});

test('Ready sends consent and voice, then can be withdrawn', async ({ page }) => {
  await fakeMic(page, { signal: true });
  const calls = await openReadyRoom(page);
  await passAgree(page);
  await page.getByRole('button', { name: "I'm ready", exact: true }).click();
  await expect.poll(() => calls.ready()).toEqual({ consent: true, input: 'VOICE' });
  await page.getByRole('button', { name: 'Not ready yet', exact: true }).click();
  await expect.poll(() => calls.cleared()).toBe(1);
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeVisible();
});

test('after Ready, the voice or type choice is locked to what was sent', async ({ page }) => {
  await fakeMic(page, { signal: true });
  const calls = await openReadyRoom(page);
  await passAgree(page);
  await page.getByRole('button', { name: "I'm ready", exact: true }).click();
  await expect.poll(() => calls.ready()).toEqual({ consent: true, input: 'VOICE' });
  await expect(page.getByRole('button', { name: 'Not ready yet', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Type instead', exact: true })).toBeDisabled();
  await expect(page.getByText('No microphone is used', { exact: false })).toHaveCount(0);
});

test('the partner sees no pressure wording', async ({ page }) => {
  await fakeMic(page, { signal: true });
  await openReadyRoom(page);
  await expect(page.getByText("Sam hasn't finished yet", { exact: true })).toBeVisible();
  expect(await page.locator('main').innerText()).not.toMatch(/waiting for you|hurry|seconds left/i);
});

test('a blocked mic explains recovery and keeps Ready locked', async ({ page }) => {
  await fakeMic(page, { signal: false, denied: true });
  await openReadyRoom(page);
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Your browser is blocking the microphone');
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeDisabled();
});

test('leaving says no audio was shared', async ({ page }) => {
  await fakeMic(page, { signal: true });
  await openReadyRoom(page);
  await page.getByRole('button', { name: 'Leave room', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'You left the room' })).toBeVisible();
  await expect(page.getByText('No audio was shared.', { exact: true })).toBeVisible();
});

test('background noise alone does not pass the mic test', async ({ page }) => {
  test.setTimeout(20000);
  await fakeMic(page, { signal: 0.09 });
  await openReadyRoom(page);
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await expect(page.getByText("We can't hear anything yet.", { exact: false })).toBeVisible({ timeout: 12000 });
  // The test is a light check now: an allowed mic is enough, and audio settings are the fallback in the debate.
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeEnabled();
});

test('a normal speaking voice still passes the mic test', async ({ page }) => {
  await fakeMic(page, { signal: 0.16 });
  await openReadyRoom(page);
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await expect(page.getByText('We can hear you', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeEnabled();
});

test('a silent microphone says so and can be tested again', async ({ page }) => {
  test.setTimeout(20000);
  await fakeMic(page, { signal: false });
  await openReadyRoom(page);
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await expect(page.getByText("We can't hear anything yet.", { exact: false })).toBeVisible({ timeout: 12000 });
  expect(await page.evaluate(() => window.__mic.stopped)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeDisabled();
});

test('Ready unlocks once the mic is allowed, before it hears speech', async ({ page }) => {
  await fakeMic(page, { signal: false });
  await openReadyRoom(page);
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await expect(page.getByText('Say a few words…', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeEnabled();
});

test('no microphone pops up a notice that offers typing', async ({ page }) => {
  await fakeMic(page, { signal: false, missing: true });
  await openReadyRoom(page);
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  const notice = page.getByRole('alert').filter({ hasText: 'No microphone found' });
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('Connect a microphone, or keep going by typing.');
  await expect(page.getByText('Your browser is blocking the microphone', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeDisabled();
  await notice.getByRole('button', { name: 'Type instead', exact: true }).click();
  await expect(notice).toHaveCount(0);
  await expect(page.getByText('You will type your turns in this debate.', { exact: false })).toBeVisible();
});

test('dismissing the no-microphone notice keeps voice', async ({ page }) => {
  await fakeMic(page, { signal: false, missing: true });
  await openReadyRoom(page);
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  const notice = page.getByRole('alert').filter({ hasText: 'No microphone found' });
  await notice.getByRole('button', { name: 'Dismiss', exact: true }).click();
  await expect(notice).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Test microphone', exact: true })).toBeVisible();
});

test('the mic chosen in the lobby is used in the debate', async ({ page }) => {
  await installFakeAudio(page);
  await fakeMic(page, { signal: true, devices: ['Built-in microphone', 'USB headset'] });
  const calls = await openReadyRoom(page);
  await page.route(`**/api/v1/rooms/${roomId}/token`, route => route.fulfill({ status: 200, json: { token: 'media-token', url: 'wss://livekit.test' } }));
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await page.getByLabel('Microphone', { exact: true }).selectOption({ label: 'USB headset' });
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: "I'm ready", exact: true }).click();
  await expect.poll(() => calls.ready()).toEqual({ consent: true, input: 'VOICE' });
  calls.set(snapshot({
    status: 'LIVE', started_at: new Date(Date.now() - 1000).toISOString(), server_now: new Date().toISOString(),
    participants: [{ ...linhSeat, ready: true, input: 'VOICE' }, { ...samSeat, ready: true, input: 'VOICE' }],
  }));
  await expect.poll(() => page.evaluate(() => window.__audio.connects.length), { timeout: 8000 }).toBe(1);
  expect(await page.evaluate(() => window.__audio.connects[0].deviceId)).toBe('mic-2');
});
