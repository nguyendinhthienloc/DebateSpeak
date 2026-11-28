import { expect, test } from '@playwright/test';
import { installFakeAudio } from './helpers/fakeAudio';
import { openLiveRoom, roomId, samId, signInAs } from './helpers/rooms';

test('the stage shows the countdown, then connects and opens the mic', async ({ page }) => {
  await openLiveRoom(page, { startsInSeconds: 3 });
  await expect(page.getByTestId('countdown')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__audio.connects.length), { timeout: 6000 }).toBe(1);
  expect(await page.evaluate(() => window.__audio.connects[0].publishMic)).toBe(true);
  await expect(page.locator('.app-bar')).toHaveCount(0);
  await expect(page.locator('.stage-bar a')).toHaveCount(0);
  await expect(page.getByText('Live · Transcribing · Audio not saved', { exact: true })).toBeVisible();
});

test('the spotlight names the speaker and the partner keeps a presence', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(id => window.__audio.emit({ type: 'speakers', ids: [id] }), samId);
  await expect(page.getByTestId('spotlight-name')).toHaveText('Sam');
  await expect(page.getByTestId('partner-chip')).toContainText('Sam');
});

test('the clock is a progress bar with exact digits', async ({ page }) => {
  await openLiveRoom(page, { secondsLeft: 462 });
  await expect(page.getByRole('progressbar', { name: 'Time left' })).toHaveAttribute('aria-valuenow', /4[56]\d/);
  await expect(page.getByTestId('clock-digits')).toHaveText(/07:[34]\d/);
});

test('timed turns name the phase, the turn holder and the time left', async ({ page }) => {
  await openLiveRoom(page, { format: 'TIMED_TURNS', secondsLeft: 329 });
  await expect(page.getByTestId('turn-line')).toHaveText(/^Opening · Sam · 0:5\d$/);
});

test('one minute left is announced politely', async ({ page }) => {
  await openLiveRoom(page, { secondsLeft: 62 });
  await expect(page.getByRole('status').filter({ hasText: '1 minute left' })).toBeVisible({ timeout: 6000 });
});

test('mute toggles and End debate asks first', async ({ page }) => {
  const calls = await openLiveRoom(page);
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Unmute', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__audio.muted)).toEqual([true]);
  await page.getByRole('button', { name: 'End debate', exact: true }).click();
  expect(calls.ended()).toBe(0);
  await page.getByRole('button', { name: 'End for both of you', exact: true }).click();
  await expect.poll(() => calls.ended()).toBe(1);
  expect(calls.endReason()).toBe('MANUAL');
});

test('Keep debating closes the question without ending', async ({ page }) => {
  const calls = await openLiveRoom(page);
  await page.getByRole('button', { name: 'End debate', exact: true }).click();
  await page.getByRole('button', { name: 'Keep debating', exact: true }).click();
  await expect(page.getByRole('button', { name: 'End debate', exact: true })).toBeFocused();
  expect(calls.ended()).toBe(0);
});

test('a lost partner shows the 60-second wait, then ends the debate', async ({ page }) => {
  await page.clock.install();
  const calls = await openLiveRoom(page);
  await page.evaluate(() => window.__audio.emit({ type: 'partner', present: false, muted: false }));
  await expect(page.getByText('Sam lost connection. Waiting up to 60 seconds.', { exact: true })).toBeVisible();
  await page.clock.fastForward(61_000);
  await expect.poll(() => calls.endReason()).toBe('DISCONNECT');
});

test('a partner who comes back cancels the wait', async ({ page }) => {
  await page.clock.install();
  const calls = await openLiveRoom(page);
  await page.evaluate(() => window.__audio.emit({ type: 'partner', present: false, muted: false }));
  await page.evaluate(() => window.__audio.emit({ type: 'partner', present: true, muted: false }));
  await expect(page.getByText('Sam lost connection. Waiting up to 60 seconds.', { exact: true })).toHaveCount(0);
  await page.clock.fastForward(61_000);
  expect(calls.ended()).toBe(0);
});

test('reloading during a debate rejoins muted and says so', async ({ page }) => {
  await openLiveRoom(page);
  await page.reload();
  await expect.poll(() => page.evaluate(() => window.__audio.connects.at(-1)?.startMuted)).toBe(true);
  await expect(page.getByText("You're muted after rejoining.", { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unmute', exact: true })).toBeVisible();
});

test('blocked playback offers a button to hear the partner', async ({ page }) => {
  await openLiveRoom(page);
  await page.evaluate(() => window.__audio.emit({ type: 'playback-blocked' }));
  await page.getByRole('button', { name: 'Turn on sound', exact: true }).click();
  expect(await page.evaluate(() => window.__audio.resumed)).toBe(1);
});

test('failed polling keeps the debate on screen', async ({ page }) => {
  await openLiveRoom(page);
  await page.route(`**/api/v1/rooms/${roomId}`, route => route.abort('failed'));
  await page.waitForTimeout(6000);
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'LIVE');
  expect(await page.evaluate(() => window.__audio.disconnects)).toBe(0);
});

test('leaving with Back disconnects the audio', async ({ page }) => {
  // Home loads first and the room opens by a hash change, so the fakes must be in place before that first load.
  await installFakeAudio(page);
  await signInAs(page, 'Linh');
  await page.goto('/#/home');
  await openLiveRoom(page);
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.__audio.disconnects)).toBe(1);
});

test('an 80-character name wraps inside the stage at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const name = 'Nguyen '.repeat(11) + 'Lin';
  await openLiveRoom(page, { partnerName: name });
  await page.evaluate(id => window.__audio.emit({ type: 'speakers', ids: [id] }), samId);
  await expect(page.getByTestId('spotlight-name')).toHaveText(name);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const box = (await page.getByTestId('spotlight-name').boundingBox())!;
  expect(box.x + box.width).toBeLessThanOrEqual(320);
});
