import { expect, test } from '@playwright/test';
import { mockRoom, roomId, signInAs, snapshot } from './helpers/rooms';

test('a signed-out visitor is asked to sign in', async ({ page }) => {
  await page.route('**/api/v1/auth/refresh', route => route.fulfill({ status: 401, json: {} }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByText('Sign in to see this page.', { exact: true })).toBeVisible();
});

test('a room the learner cannot open says so and offers a way home', async ({ page }) => {
  await signInAs(page, 'Linh');
  await page.route(`**/api/v1/rooms/${roomId}`, route => route.fulfill({ status: 404, json: { code: 'room_not_found' } }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByRole('heading', { name: 'This room is not available' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
});

test('a cancelled room names who closed it', async ({ page }) => {
  await signInAs(page, 'Sam');
  await mockRoom(page, snapshot({ status: 'CANCELLED', end_reason: 'CANCELLED', code: null }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByRole('heading', { name: 'Linh closed this room' })).toBeVisible();
});

test('the creator sees that they closed the room', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'CANCELLED', end_reason: 'CANCELLED', code: null }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByRole('heading', { name: 'You closed this room' })).toBeVisible();
});

test('an expired room says the invite no longer works', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'CANCELLED', end_reason: 'EXPIRED', code: null }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByRole('heading', { name: 'This invite no longer works' })).toBeVisible();
});

test('polling picks up a change of state', async ({ page }) => {
  await signInAs(page, 'Linh');
  const room = await mockRoom(page, snapshot({ status: 'LOBBY' }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'LOBBY');
  room.set(snapshot({ status: 'READY' }));
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'READY', { timeout: 4000 });
});

test('a failed poll keeps the room on screen', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'LOBBY' }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'LOBBY');
  await page.unroute(`**/api/v1/rooms/${roomId}`);
  await page.route(`**/api/v1/rooms/${roomId}`, route => route.fulfill({ status: 503, json: {} }));
  await page.waitForTimeout(2500);
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'LOBBY');
});

test('the room request carries the access token', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot());
  const request = page.waitForRequest(`**/api/v1/rooms/${roomId}`);
  await page.goto(`/#/rooms/${roomId}`);
  expect((await request).headers().authorization).toBe('Bearer token-Linh');
});
