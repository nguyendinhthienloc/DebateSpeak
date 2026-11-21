import { expect, test } from '@playwright/test';
import { mockRoom, mockTopics, roomId, signInAs, snapshot } from './helpers/rooms';

test('defaults are chosen and creating a room opens it', async ({ page }) => {
  await signInAs(page, 'Linh');
  let body: unknown;
  await mockTopics(page);
  await page.route('**/api/v1/rooms', route => { body = route.request().postDataJSON(); return route.fulfill({ status: 201, json: snapshot({ status: 'LOBBY' }) }); });
  await mockRoom(page, snapshot({ status: 'LOBBY' }));
  await page.goto('/#/rooms/new');
  await page.getByRole('button', { name: 'Create room', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`#/rooms/${roomId}$`));
  expect(body).toMatchObject({ topic_id: 'topic-1', format: 'FREE_FLOW', duration_minutes: 10, side: 'RANDOM' });
});

test('choosing a motion updates the headline', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockTopics(page);
  await page.goto('/#/rooms/new');
  await page.getByRole('radio', { name: /Homework should be optional/ }).check({ force: true });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homework should be optional in secondary school');
});

test('timed turns replaces the length choice', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockTopics(page);
  await page.goto('/#/rooms/new');
  await page.getByRole('radio', { name: 'Timed turns', exact: true }).check({ force: true });
  await expect(page.getByText('About 7 minutes', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio', { name: '10 min', exact: true })).toHaveCount(0);
});

test('the two columns fill the page at 1440 by 900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await signInAs(page, 'Linh');
  await mockTopics(page);
  await page.goto('/#/rooms/new');
  const form = (await page.getByTestId('create-form').boundingBox())!;
  const list = (await page.getByTestId('motion-pane').boundingBox())!;
  expect(list.x).toBeGreaterThan(form.x + form.width - 1);
  expect(Math.abs(list.height - form.height)).toBeLessThanOrEqual(1);
  expect(list.y + list.height).toBeGreaterThan(740);
});

test('a failed create keeps the choices and explains', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockTopics(page);
  await page.route('**/api/v1/rooms', route => route.fulfill({ status: 500, json: {} }));
  await page.goto('/#/rooms/new');
  await page.getByRole('radio', { name: '15 min', exact: true }).check({ force: true });
  await page.getByRole('button', { name: 'Create room', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('The room could not be created. Try again.');
  await expect(page.getByRole('radio', { name: '15 min', exact: true })).toBeChecked();
});

test('below 960px the motion list opens from a button and Create room sticks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signInAs(page, 'Linh');
  await mockTopics(page);
  await page.goto('/#/rooms/new');
  await expect(page.getByRole('radio', { name: /Homework should be optional/ })).toHaveCount(0);
  const toggle = page.getByRole('button', { name: 'Choose another motion', exact: true });
  await toggle.click();
  // Picking closes the list, so click rather than check (check re-reads the removed radio).
  await page.getByRole('radio', { name: /Homework should be optional/ }).click({ force: true });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homework should be optional in secondary school');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const bar = page.getByRole('button', { name: 'Create room', exact: true });
  expect(await bar.evaluate(element => getComputedStyle(element.parentElement!).position)).toBe('sticky');
});

test('a topic picked on Home is preselected', async ({ page }) => {
  await signInAs(page, 'Linh');
  await mockTopics(page);
  await page.goto('/#/home');
  await page.getByRole('button', { name: /Cities should ban private cars/ }).click();
  await expect(page).toHaveURL(/#\/rooms\/new$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cities should ban private cars from the centre');
});
