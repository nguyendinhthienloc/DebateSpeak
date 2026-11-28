import { expect, test, type Page } from '@playwright/test';
import { fakeMic, linhId, openReadyRoom } from './helpers/rooms';

const start = new Date('2026-11-27T10:00:00Z');

/** Counts `/auth/refresh` calls; each one returns a fresh 15-minute token for Linh. */
async function countRefreshes(page: Page) {
  let calls = 0;
  await page.route('**/api/v1/auth/refresh', route => {
    calls += 1;
    return route.fulfill({ status: 200, json: {
      access_token: `token-${calls}`, token_type: 'bearer', expires_in: 900,
      user: { id: linhId, email: 'linh@example.com', display_name: 'Linh', cefr_level: 'B1', created_at: '2026-11-12T08:00:00Z' },
    } });
  });
  return () => calls;
}

test('the token is renewed before it expires, so a room stays on screen', async ({ page }) => {
  await page.clock.install({ time: start });
  await fakeMic(page, { signal: true });
  await openReadyRoom(page);
  await expect(page.getByRole('heading', { name: 'Agree to this debate' })).toBeVisible();
  const refreshes = await countRefreshes(page);
  await page.clock.runFor(841_000);
  await expect.poll(refreshes).toBe(1);
  await expect(page).not.toHaveURL(/#\/sign-in$/);
});

test('a request after the computer slept renews the token instead of signing out', async ({ page }) => {
  await page.clock.install({ time: start });
  await fakeMic(page, { signal: true });
  await openReadyRoom(page);
  await expect(page.getByRole('heading', { name: 'Agree to this debate' })).toBeVisible();
  const refreshes = await countRefreshes(page);
  // Sleep moves the wall clock past expiry without running the expiry timer.
  await page.clock.setSystemTime(new Date(start.getTime() + 20 * 60_000));
  await page.clock.runFor(2_500);
  await expect.poll(refreshes).toBe(1);
  await expect(page).not.toHaveURL(/#\/sign-in$/);
  await expect(page.getByRole('heading', { name: 'Agree to this debate' })).toBeVisible();
});
