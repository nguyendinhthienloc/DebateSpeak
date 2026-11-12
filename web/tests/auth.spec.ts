import { expect, test, type Page } from '@playwright/test';

const user = {
  id: 'd817b684-08e9-49c0-806a-a045fb7f060c', email: 'learner@example.com',
  display_name: 'Linh', cefr_level: 'B2', created_at: '2026-11-12T08:00:00Z',
};
const token = { access_token: 'test-access-token', token_type: 'bearer', expires_in: 900, user };
const password = '  a valid password  ';

async function fillCredentials(page: Page, value = password) {
  await page.getByLabel('Email', { exact: true }).fill(' learner@example.com ');
  await page.getByLabel('Password', { exact: true }).fill(value);
}

test('registers then signs in through the G1 HTTP contract', async ({ page }) => {
  const requests: { path: string; body: unknown; client: string | undefined; contentType: string | undefined }[] = [];
  await page.route('**/api/v1/auth/*', async route => {
    const request = route.request();
    requests.push({ path: new URL(request.url()).pathname, body: request.postDataJSON(),
      client: request.headers()['x-debatespeak-client'], contentType: request.headers()['content-type'] });
    await route.fulfill({ status: request.url().endsWith('/register') ? 201 : 200,
      json: request.url().endsWith('/register') ? user : token });
  });
  await page.goto('/#/register');
  await fillCredentials(page);
  await page.getByLabel('Display name (optional)').fill('  Linh  ');
  await page.getByRole('radio', { name: 'B2', exact: true }).check();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.getByText('Account created', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('learner@example.com');
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue('');
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Password', { exact: true }).press('Enter');
  await expect(page).toHaveURL(/#\/rooms$/);
  await expect(page.getByText('Signed in as Linh', { exact: true })).toBeVisible();
  expect(requests).toEqual([
    { path: '/api/v1/auth/register', body: { email: 'learner@example.com', password, display_name: 'Linh', cefr_level: 'B2' }, client: 'web', contentType: 'application/json' },
    { path: '/api/v1/auth/login', body: { email: 'learner@example.com', password }, client: 'web', contentType: 'application/json' },
  ]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })))
    .toEqual({ local: 0, session: 0 });
  expect(page.url()).not.toContain('learner@example.com');
  await page.reload();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
});

test('validates fields locally and focuses the first invalid input', async ({ page }) => {
  let calls = 0;
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).pathname.startsWith('/api/v1/auth/')) calls++;
  });
  await page.goto('/#/register');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Enter your email address.', { exact: true })).toBeVisible();
  await fillCredentials(page, 'short');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByLabel('Password', { exact: true })).toBeFocused();
  await expect(page.getByText('Use 12–128 characters.', { exact: true })).toBeVisible();
  expect(calls).toBe(0);
});

test('uses Unicode character lengths and omits an empty optional name', async ({ page }) => {
  let body: unknown;
  await page.route('**/auth/register', async route => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: user });
  });
  await page.goto('/#/register');
  await fillCredentials(page, '😀'.repeat(11));
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('Use 12–128 characters.', { exact: true })).toBeVisible();
  expect(body).toBeUndefined();
  await page.getByLabel('Password', { exact: true }).fill('😀'.repeat(12));
  await page.getByLabel('Display name (optional)').fill('   ');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('Account created', { exact: true })).toBeVisible();
  expect(body).toEqual({ email: 'learner@example.com', password: '😀'.repeat(12), cefr_level: 'B1' });
});

test('checks length limits without silently truncating passwords or display names', async ({ page }) => {
  let calls = 0;
  await page.route('**/auth/register', async route => { calls++; await route.fulfill({ status: 201, json: user }); });
  await page.goto('/#/register');
  await fillCredentials(page, 'x'.repeat(129));
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue('x'.repeat(129));
  await expect(page.getByText('Use 12–128 characters.', { exact: true })).toBeVisible();
  await page.getByLabel('Password', { exact: true }).fill('x'.repeat(128));
  await page.getByLabel('Display name (optional)').fill('界'.repeat(81));
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByLabel('Display name (optional)')).toBeFocused();
  expect(calls).toBe(0);
  await page.getByLabel('Display name (optional)').fill('界'.repeat(80));
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('Account created', { exact: true })).toBeVisible();
  expect(calls).toBe(1);
});

test('makes a server CEFR validation error accessible and focuses its group', async ({ page }) => {
  await page.route('**/auth/register', route => route.fulfill({ status: 422,
    json: { code: 'VALIDATION_ERROR', errors: [{ field: 'cefr_level', message: 'Invalid choice' }] } }));
  await page.goto('/#/register');
  await fillCredentials(page);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Your English level' })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('group', { name: 'Your English level' })).toBeFocused();
});

test('sends the auth client header and credentialed requests without caching', async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init) => {
      if (init?.method === 'POST') {
        (window as unknown as { authRequestOptions: unknown }).authRequestOptions = {
          credentials: init.credentials, cache: init.cache, headers: init.headers,
        };
      }
      return originalFetch(input, init);
    };
  });
  await page.route('**/auth/login', route => route.fulfill({ status: 200, json: token }));
  await page.goto('/#/sign-in');
  await fillCredentials(page);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/#\/rooms$/);
  expect(await page.evaluate(() => (window as unknown as { authRequestOptions: unknown }).authRequestOptions)).toEqual({
    credentials: 'include', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-DebateSpeak-Client': 'web' },
  });
});

for (const scenario of [
  { status: 401, route: 'login', message: 'Email or password is incorrect.' },
  { status: 403, route: 'login', message: 'Sign-in is not allowed from this site. Contact the team if this continues.' },
  { status: 409, route: 'register', message: 'An account already uses this email. Sign in or use another address.' },
  { status: 429, route: 'login', message: 'Too many attempts. Wait a moment before trying again.' },
  { status: 503, route: 'login', message: 'The account service is unavailable. Try again in a moment.' },
  { status: 404, route: 'login', message: 'The account service is unavailable. Try again in a moment.' },
]) {
  test(`recovers from HTTP ${scenario.status} on ${scenario.route} without exposing server details`, async ({ page }) => {
    await page.route(`**/auth/${scenario.route}`, route => route.fulfill({ status: scenario.status,
      json: { detail: 'SECRET SERVER TRACE and submitted password', code: 'TEST_ERROR' } }));
    await page.goto(scenario.route === 'register' ? '/#/register' : '/#/sign-in');
    await fillCredentials(page);
    const submit = page.getByRole('button', { name: scenario.route === 'register' ? 'Create account' : 'Sign in', exact: true });
    await submit.click();
    await expect(page.getByRole('alert')).toContainText(scenario.message);
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue('learner@example.com');
    await expect(page.getByLabel('Password', { exact: true })).toHaveValue(password);
    await expect(submit).toBeEnabled();
    await expect(page.getByText(/SECRET SERVER TRACE/)).toHaveCount(0);
    await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
  });
}

for (const detail of [
  { code: 'VALIDATION_ERROR', errors: [{ field: 'email', message: 'SECRET SERVER TRACE' }] },
  { detail: [{ loc: ['body', 'email'], msg: 'SECRET SERVER TRACE', input: password }] },
]) {
  test(`maps ${'errors' in detail ? 'G1' : 'FastAPI'} validation errors safely to fields`, async ({ page }) => {
    await page.route('**/auth/login', route => route.fulfill({ status: 422, json: detail }));
    await page.goto('/#/sign-in');
    await fillCredentials(page);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
    await expect(page.getByRole('alert')).toContainText('Check the highlighted fields and try again.');
    await expect(page.getByText(/SECRET SERVER TRACE/)).toHaveCount(0);
  });
}

test('prevents duplicate submissions and ignores a response after navigation', async ({ page }) => {
  let calls = 0;
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/auth/login', async route => {
    calls++;
    await pending;
    await route.fulfill({ status: 200, json: token }).catch(() => {});
  });
  await page.goto('/#/sign-in');
  await fillCredentials(page);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Signing in…', exact: true })).toBeDisabled();
  await page.getByLabel('Password', { exact: true }).press('Enter');
  expect(calls).toBe(1);
  await page.getByRole('link', { name: 'Create account', exact: true }).click();
  release();
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
});

test('recovers from a network failure', async ({ page }) => {
  await page.route('**/auth/login', route => route.abort('failed'));
  await page.goto('/#/sign-in');
  await fillCredentials(page);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Could not reach the account service. Check your connection and try again.');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
});

test('times out a stalled request and allows retry', async ({ page }) => {
  await page.clock.install();
  await page.route('**/auth/login', () => {});
  await page.goto('/#/sign-in');
  await fillCredentials(page);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Signing in…', exact: true })).toBeDisabled();
  await page.clock.fastForward(15_001);
  await expect(page.getByRole('alert')).toContainText('The request timed out. Try again.');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
});

for (const response of [
  { ...token, access_token: '' }, { ...token, expires_in: 0 },
  { ...token, expires_in: '900' }, { ...token, token_type: 'basic' },
  { ...token, user: { ...user, cefr_level: 'C2' } }, { detail: 'not a token' },
]) {
  test(`rejects malformed login success ${JSON.stringify(response)}`, async ({ page }) => {
    await page.route('**/auth/login', route => route.fulfill({ status: 200, json: response }));
    await page.goto('/#/sign-in');
    await fillCredentials(page);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('The account service returned an unexpected response. Try again or contact the team.');
    await expect(page).toHaveURL(/#\/sign-in$/);
  });
}

test('rejects invalid registration success and untrusted confirmation routes', async ({ page }) => {
  await page.goto('/#/account-created');
  await expect(page.getByText('Account created', { exact: true })).toHaveCount(0);
  await page.route('**/auth/register', route => route.fulfill({ status: 201, json: {} }));
  await page.goto('/#/register');
  await fillCredentials(page);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('unexpected response');
  await expect(page).toHaveURL(/#\/register$/);
});

for (const [description, invalidUser] of [
  ['blank email', { ...user, email: ' ' }],
  ['invalid email', { ...user, email: 'not-an-email' }],
  ['long email', { ...user, email: `${'a'.repeat(255)}@example.com` }],
  ['numeric date', { ...user, created_at: '0' }],
  ['date without UTC time', { ...user, created_at: '2026-11-12' }],
  ['impossible calendar date', { ...user, created_at: '2026-02-30T00:00:00Z' }],
  ['long display name', { ...user, display_name: 'x'.repeat(81) }],
] as const) {
  for (const endpoint of ['register', 'login']) {
    test(`rejects ${description} in ${endpoint} success`, async ({ page }) => {
      await page.route(`**/auth/${endpoint}`, route => route.fulfill({ status: endpoint === 'register' ? 201 : 200,
        json: endpoint === 'register' ? invalidUser : { ...token, user: invalidUser } }));
      await page.goto(endpoint === 'register' ? '/#/register' : '/#/sign-in');
      await fillCredentials(page);
      await page.getByRole('button', { name: endpoint === 'register' ? 'Create account' : 'Sign in', exact: true }).click();
      await expect(page.getByRole('alert')).toContainText('unexpected response');
      await expect(page.getByText('Account created', { exact: true })).toHaveCount(0);
      await expect(page.getByText(/Signed in as/)).toHaveCount(0);
    });
  }
}

test('expires the memory session and asks the learner to sign in again', async ({ page }) => {
  await page.clock.install();
  await page.route('**/auth/login', route => route.fulfill({ status: 200, json: { ...token, expires_in: 2 } }));
  await page.goto('/#/sign-in');
  await fillCredentials(page);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toBeVisible();
  await page.clock.fastForward(2_001);
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.getByText('Your session expired. Sign in again.', { exact: true })).toBeVisible();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
});
