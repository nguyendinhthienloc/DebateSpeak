import { expect, test } from '@playwright/test';
import { linhId, mockRoom, openLiveRoom, roomId, samId, signInAs, snapshot } from './helpers/rooms';

for (const [end_reason, ended_by, text] of [
  ['TIMER', null, 'The debate ended when time ran out.'],
  ['MANUAL', samId, 'Sam ended the debate.'],
  ['MANUAL', linhId, 'You ended the debate.'],
  ['DISCONNECT', null, 'The debate ended after the connection was lost.'],
] as const) {
  test(`wrap up explains ${end_reason} by ${ended_by}`, async ({ page }) => {
    await signInAs(page, 'Linh');
    await mockRoom(page, snapshot({ status: 'ENDED', end_reason, ended_by }));
    await page.goto(`/#/rooms/${roomId}`);
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  });
}

test('wrap up stays on the stage and is honest about the report', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'ENDED', end_reason: 'TIMER' }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.locator('.app-bar')).toHaveCount(0);
  await expect(page.getByText('Feedback report: coming in a later release', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to home', exact: true })).toHaveAttribute('href', '#/home');
  await expect(page.getByRole('link', { name: 'Set up another room', exact: true })).toHaveAttribute('href', '#/rooms/new');
  expect(await page.locator('main').innerText()).not.toMatch(/score|\d+\s*\/\s*\d+/i);
});

test('wrap up names the partner and the length', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'ENDED', end_reason: 'TIMER', started_at: '2026-11-19T10:00:03Z', ended_at: '2026-11-19T10:10:03Z' }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByText('You debated Sam (Against).', { exact: true })).toBeVisible();
  await expect(page.getByText('10 minutes', { exact: true })).toBeVisible();
});

test('the debate moves to wrap up without a reload and releases audio', async ({ page }) => {
  const room = await openLiveRoom(page);
  room.set(snapshot({ status: 'ENDED', end_reason: 'TIMER' }));
  await expect(page.getByRole('heading', { name: 'Debate finished' })).toBeVisible({ timeout: 7000 });
  expect(await page.evaluate(() => window.__audio.disconnects)).toBe(1);
});
