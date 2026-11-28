import { expect, test } from '@playwright/test';
import { fakeMic, openReadyRoom, passAgree } from './helpers/rooms';

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
  await expect(page.getByRole('button', { name: "I'm ready", exact: true })).toBeDisabled();
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
