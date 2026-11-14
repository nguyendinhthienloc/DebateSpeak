import { expect, test } from '@playwright/test';

const waiting = '/#/rooms/waiting';
const ready = '/#/rooms/ready';

test('waiting lobby copies the example code and reports success politely', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(waiting);
  await page.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Example code copied. It cannot be used to join a room.');
});

test('a rejected clipboard write shows a recovery message', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } });
  });
  await page.goto(waiting);
  await page.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Copy is unavailable. Select the example code above to copy it.');
});

test('ready lobby keeps the microphone button disabled with its explanation linked', async ({ page }) => {
  await page.goto(ready);
  const mic = page.getByRole('button', { name: 'Test microphone', exact: true });
  await expect(mic).toBeDisabled();
  await expect(mic).toHaveAttribute('aria-describedby', 'lobby-media-limit');
  await expect(page.locator('#lobby-media-limit')).toHaveText('Audio and debate start are not available in this build.');
});

test('waiting lobby puts the room code before participants; ready lobby reverses it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(waiting);
  const codeWaiting = await page.locator('#code-heading').boundingBox();
  const peopleWaiting = await page.locator('#participants-heading').boundingBox();
  expect(codeWaiting!.x).toBeLessThan(peopleWaiting!.x);

  await page.goto(ready);
  const peopleReady = await page.locator('#participants-heading').boundingBox();
  const codeReady = await page.locator('#code-heading').boundingBox();
  expect(peopleReady!.x).toBeLessThan(codeReady!.x);
});

test('both lobbies reflow at 320px without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of [waiting, ready]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  }
});

test('lobbies request no media or application services', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:5173/')) requests.push(request.url());
  });
  await page.goto(waiting);
  await page.goto(ready);
  expect(requests).toEqual([]);
});
