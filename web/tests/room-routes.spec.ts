import { expect, test } from '@playwright/test';
import { matchDynamicRoute } from '../src/routes';

const id = 'd817b684-08e9-49c0-806a-a045fb7f060c';

test('room and join paths are recognised', () => {
  expect(matchDynamicRoute(`/rooms/${id}`)).toEqual({ kind: 'room', roomId: id });
  expect(matchDynamicRoute('/join/k7q2-m9xa')).toEqual({ kind: 'join', code: 'K7Q2M9XA' });
  expect(matchDynamicRoute('/rooms/new')).toBeUndefined();
  expect(matchDynamicRoute('/rooms/not-a-uuid')).toBeUndefined();
  expect(matchDynamicRoute('/join/short')).toBeUndefined();
});

for (const old of ['/rooms', '/rooms/new/settings', '/invite', '/rooms/waiting', '/rooms/ready', '/rooms/full', '/rooms/expired']) {
  test(`${old} is gone`, async ({ page }) => {
    await page.goto(`/#${old}`);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to home', exact: true })).toBeVisible();
  });
}

test('the site has two header styles and no preview badge', async ({ page }) => {
  await page.goto('/#/welcome');
  await expect(page.locator('.stage-bar')).toHaveCount(1);
  await page.goto('/#/sign-in');
  await expect(page.locator('.stage-bar')).toHaveCount(1);
  await expect(page.locator('.auth-bar, .w-nav')).toHaveCount(0);
  await page.goto('/#/profile');
  await expect(page.locator('.app-bar')).toHaveCount(1);
  await expect(page.locator('.preview-badge')).toHaveCount(0);
});
