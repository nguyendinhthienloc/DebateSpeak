import { expect, test } from '@playwright/test';
import { installFakeLiveKit } from './helpers/fakeLiveKit';
import { openLiveRoom, roomId } from './helpers/rooms';

test('the real audio layer opens the mic once LiveKit connects', async ({ page }) => {
  await installFakeLiveKit(page);
  await openLiveRoom(page, { liveKit: true });
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__lk.mic)).toBe(true);
});

test('Mute pressed while LiveKit connects keeps the mic off', async ({ page }) => {
  await installFakeLiveKit(page, { hold: true });
  await openLiveRoom(page, { liveKit: true });
  await expect.poll(() => page.evaluate(() => window.__lk.rooms.length)).toBe(1);
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
  await page.evaluate(() => window.__lk.open());
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__lk.micEverOn)).toBe(false);
});

test('Mute pressed while the token is on its way keeps the mic off', async ({ page }) => {
  let releaseToken = () => {};
  const tokenHeld = new Promise<void>(resolve => { releaseToken = resolve; });
  await openLiveRoom(page, { startsInSeconds: 3 });
  await page.route(`**/api/v1/rooms/${roomId}/token`, async route => {
    await tokenHeld;
    await route.fulfill({ status: 200, json: { token: 'media-token', url: 'wss://livekit.test' } });
  });
  const mute = page.getByRole('button', { name: 'Mute', exact: true });
  await expect(mute).toBeEnabled({ timeout: 6000 });
  await mute.click();
  releaseToken();
  await expect.poll(() => page.evaluate(() => window.__audio.connects.length)).toBe(1);
  expect(await page.evaluate(() => window.__audio.connects[0].startMuted)).toBe(true);
});

test('the partner chip follows their mic when it is published after they join', async ({ page }) => {
  type Room = { remoteParticipants: Map<string, { identity: string; isMicrophoneEnabled: boolean }>; emit(event: string, ...args: unknown[]): void };
  await installFakeLiveKit(page);
  await openLiveRoom(page, { liveKit: true });
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
  const chip = page.getByTestId('partner-chip');
  // Both debaters connect at countdown zero, so Sam often arrives before his mic is published.
  await page.evaluate(() => {
    const room = window.__lk.rooms[0] as unknown as Room;
    const sam = { identity: 'sam', isMicrophoneEnabled: false };
    room.remoteParticipants.set('sam', sam);
    room.emit('ParticipantConnected', sam);
  });
  await expect(chip).toContainText('Muted');
  await page.evaluate(() => {
    const room = window.__lk.rooms[0] as unknown as Room;
    const sam = room.remoteParticipants.get('sam')!;
    sam.isMicrophoneEnabled = true;
    room.emit('TrackPublished', { source: 'microphone' }, sam);
  });
  await expect(chip).toContainText('Live');
  await page.evaluate(() => {
    const room = window.__lk.rooms[0] as unknown as Room;
    const sam = room.remoteParticipants.get('sam')!;
    sam.isMicrophoneEnabled = false;
    room.emit('TrackUnpublished', { source: 'microphone' }, sam);
  });
  await expect(chip).toContainText('Muted');
});

test('when LiveKit drops the call, Try again reconnects', async ({ page }) => {
  await installFakeLiveKit(page);
  await openLiveRoom(page, { liveKit: true });
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
  await page.evaluate(() => window.__lk.rooms[0].emit('Disconnected'));
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__lk.connected)).toBe(2);
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
});

test('the real audio layer switches the mic through LiveKit', async ({ page }) => {
  await installFakeLiveKit(page);
  await openLiveRoom(page, { liveKit: true });
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Audio settings', exact: true }).click();
  await page.getByLabel('Microphone', { exact: true }).selectOption({ label: 'USB headset' });
  await expect.poll(() => page.evaluate(() => window.__lk.switched)).toContainEqual(['audioinput', 'mic-2']);
});
