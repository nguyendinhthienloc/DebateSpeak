import { expect, test } from '@playwright/test';
import { linhSeat, mockHome, mockJoin, mockLookup, mockRoom, mockSignInFlow, roomId, signInAs, snapshot, submitSignIn } from './helpers/rooms';

test('the invite shows a grouped code and copies a join link', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'LOBBY', code: 'K7Q2M9XA' }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByText('K7Q2 M9XA', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy invite link', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/#\/join\/K7Q2M9XA$/);
  await expect(page.getByRole('status').filter({ hasText: 'Invite link copied' })).toBeVisible();
});

test('a rejected clipboard write explains how to recover', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } }));
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'LOBBY', code: 'K7Q2M9XA' }));
  await page.goto(`/#/rooms/${roomId}`);
  await page.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(page.getByText('Copy is unavailable. Select the code above to copy it.', { exact: true })).toBeVisible();
});

test('a guest leaving reopens the seat and says so', async ({ page }) => {
  await signInAs(page, 'Linh');
  const room = await mockRoom(page, snapshot({ status: 'READY' }));
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'READY');
  room.set(snapshot({ status: 'LOBBY', participants: [linhSeat] }));
  await expect(page.getByText('Sam left. The seat is open again.', { exact: true })).toBeVisible({ timeout: 4000 });
});

test('the invite link opens a dialog over Home, and joining enters the room', async ({ page }) => {
  await signInAs(page, 'Sam');
  await mockHome(page);
  await mockLookup(page, { motion: 'Cities should ban private cars from the centre', creator_name: 'Linh' });
  await mockJoin(page, snapshot({ status: 'READY' }));
  await page.goto('/#/join/K7Q2M9XA');
  const dialog = page.getByRole('dialog', { name: 'Linh invited you to debate' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Take the open seat', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`#/rooms/${roomId}$`));
});

test('Esc closes the dialog and returns Home', async ({ page }) => {
  await signInAs(page, 'Sam');
  await mockHome(page);
  await mockLookup(page, { creator_name: 'Linh' });
  await page.goto('/#/join/K7Q2M9XA');
  await expect(page.getByRole('dialog', { name: 'Linh invited you to debate' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#\/home$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('someone already seated goes straight to the room', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockHome(page);
  await mockLookup(page, { room_id: roomId });
  await mockRoom(page, snapshot({ status: 'LOBBY' }));
  await page.goto('/#/join/K7Q2M9XA');
  await expect(page).toHaveURL(new RegExp(`#/rooms/${roomId}$`));
});

for (const [status, code, message] of [
  [404, 'invite_invalid', 'This invite no longer works'],
  [409, 'room_full', 'This room already has two debaters'],
] as const) {
  test(`${code} is explained in the dialog`, async ({ page }) => {
    await signInAs(page, 'Sam');
    await mockHome(page);
    await page.route('**/api/v1/rooms/lookup', route => route.fulfill({ status, json: { code } }));
    await page.goto('/#/join/K7Q2M9XA');
    await expect(page.getByRole('dialog', { name: message })).toBeVisible();
  });
}

test('a signed-out visitor returns to the invite after signing in', async ({ page }) => {
  await mockSignInFlow(page, 'Sam');
  await mockHome(page);
  await mockLookup(page, { creator_name: 'Linh' });
  await page.goto('/#/join/K7Q2M9XA');
  await expect(page).toHaveURL(/#\/sign-in$/);
  await submitSignIn(page);
  await expect(page).toHaveURL(/#\/join\/K7Q2M9XA$/);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('the creator cancels the room from the invite', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockRoom(page, snapshot({ status: 'LOBBY', participants: [linhSeat] }));
  await page.route(`**/api/v1/rooms/${roomId}/cancel`, route => route.fulfill({ status: 200,
    json: snapshot({ status: 'CANCELLED', code: null, end_reason: 'CANCELLED', participants: [linhSeat] }) }));
  await page.goto(`/#/rooms/${roomId}`);
  await page.getByRole('button', { name: 'Cancel room', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'You closed this room', exact: true })).toBeVisible();
});

test('focus moves to the dialog action once the invite loads', async ({ page }) => {
  await signInAs(page, 'Sam');
  await mockHome(page);
  await mockLookup(page, { creator_name: 'Linh' });
  await page.goto('/#/join/K7Q2M9XA');
  await expect(page.getByRole('button', { name: 'Take the open seat', exact: true })).toBeFocused();
});
