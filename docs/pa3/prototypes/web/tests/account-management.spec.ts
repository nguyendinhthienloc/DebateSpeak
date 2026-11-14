import { expect, test, type Page } from '@playwright/test';

const user = {
  id: 'd817b684-08e9-49c0-806a-a045fb7f060c', email: 'learner@example.com',
  display_name: 'Linh', cefr_level: 'B2', created_at: '2026-11-12T08:00:00Z',
};
const profile = { ...user, native_language: 'Vietnamese', goals: ['Reduce filler words'] };
const token = { access_token: 'test-access-token', token_type: 'bearer', expires_in: 900, user };
const other = {
  id: '0b8a3f8e-6c1d-4c55-9a51-2f5d0f0c9a11', email: 'other@example.com', display_name: 'Minh',
  role: 'LEARNER', is_suspended: false, created_at: '2026-11-10T08:00:00Z',
};

/** Signs in through the refresh-cookie restore that runs on page load. */
async function restoreAs(page: Page, signedIn = user) {
  let refreshes = 0;
  await page.route('**/api/v1/auth/refresh', route => { refreshes++; return route.fulfill({ status: 200, json: { ...token, user: signedIn } }); });
  return () => refreshes;
}

test('reload restores the session once, and sign out revokes it on the server', async ({ page }) => {
  const refreshes = await restoreAs(page);
  let logoutHeaders: Record<string, string> | undefined;
  await page.route('**/api/v1/auth/logout', route => { logoutHeaders = route.request().headers(); return route.fulfill({ status: 204 }); });
  await page.goto('/#/rooms');
  await expect(page.getByText('Signed in as Linh', { exact: true })).toBeVisible();
  expect(refreshes()).toBe(1);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.getByText('You are signed out.', { exact: true })).toBeVisible();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
  expect(logoutHeaders?.['x-debatespeak-client']).toBe('web');
  expect(logoutHeaders?.authorization).toBeUndefined();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('sign out still clears the device when the server does not confirm', async ({ page }) => {
  await restoreAs(page);
  await page.route('**/api/v1/auth/logout', route => route.abort('failed'));
  await page.goto('/#/rooms');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByText(/server did not confirm/)).toBeVisible();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
});

test('profile loads from and saves to /users/me with the bearer token', async ({ page }) => {
  await restoreAs(page);
  let patch: { body: unknown; auth: string | undefined } | undefined;
  await page.route('**/api/v1/users/me', async route => {
    const request = route.request();
    if (request.method() === 'GET') return route.fulfill({ status: 200, json: profile });
    patch = { body: request.postDataJSON(), auth: request.headers().authorization };
    return route.fulfill({ status: 200, json: { ...profile, ...request.postDataJSON() } });
  });
  await page.goto('/#/profile');
  await expect(page.getByLabel('Display name', { exact: true })).toHaveValue('Linh');
  await expect(page.getByLabel('Native language (optional)')).toHaveValue('Vietnamese');
  await page.getByLabel('Display name', { exact: true }).fill('  Linh Tran ');
  await page.getByLabel('Learning goals (optional)').fill('Reduce filler words\n\n Improve rebuttals ');
  await page.getByRole('radio', { name: 'C1', exact: true }).check();
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByText('Profile saved', { exact: true })).toBeVisible();
  await expect(page.getByText('Signed in as Linh Tran', { exact: true })).toBeVisible();
  expect(patch).toEqual({
    body: { display_name: 'Linh Tran', native_language: 'Vietnamese', goals: ['Reduce filler words', 'Improve rebuttals'], cefr_level: 'C1' },
    auth: 'Bearer test-access-token',
  });
});

test('saving a profile without role keeps the admin role from sign-in', async ({ page }) => {
  await restoreAs(page, { ...user, role: 'ADMIN' } as typeof user);
  await page.route('**/api/v1/users/me', route => route.fulfill({ status: 200, json: profile }));
  await page.goto('/#/profile');
  await expect(page.getByRole('link', { name: 'Manage accounts' })).toBeVisible();
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByText('Profile saved', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Manage accounts' })).toBeVisible();
});

test('an admin cannot suspend their own account', async ({ page }) => {
  await restoreAs(page, { ...user, role: 'ADMIN' } as typeof user);
  await page.route('**/api/v1/admin/users?*', route => route.fulfill({ status: 200, json: { ...other, id: user.id, email: user.email, role: 'ADMIN' } }));
  await page.goto('/#/admin/users');
  await page.getByLabel('Account email').fill(user.email);
  await page.getByRole('button', { name: 'Find account' }).click();
  await expect(page.getByText('This is your account. Another administrator must change its status.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Suspend account' })).toHaveCount(0);
});

test('profile validates locally and rejects malformed profile responses', async ({ page }) => {
  await restoreAs(page);
  let patches = 0;
  await page.route('**/api/v1/users/me', route => {
    if (route.request().method() === 'GET') return route.fulfill({ status: 200, json: profile });
    patches++;
    return route.fulfill({ status: 200, json: { ...profile, goals: 'not a list' } });
  });
  await page.goto('/#/profile');
  await page.getByLabel('Display name', { exact: true }).fill('   ');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByLabel('Display name', { exact: true })).toBeFocused();
  await page.getByLabel('Display name', { exact: true }).fill('Linh');
  await page.getByLabel('Learning goals (optional)').fill('a\nb\nc\nd\ne\nf');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByText('Use up to 5 goals of up to 120 characters each.')).toBeVisible();
  expect(patches).toBe(0);
  await page.getByLabel('Learning goals (optional)').fill('one goal');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('unexpected response');
  await expect(page.getByText('Profile saved', { exact: true })).toHaveCount(0);
});

test('a 401 on a signed-in request ends the session', async ({ page }) => {
  await restoreAs(page);
  await page.route('**/api/v1/users/me', route => route.fulfill({ status: 401, json: { detail: 'SECRET SERVER TRACE' } }));
  await page.goto('/#/profile');
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.getByText('Your session expired. Sign in again.', { exact: true })).toBeVisible();
  await expect(page.getByText(/SECRET SERVER TRACE/)).toHaveCount(0);
});

test('signed-out visitors get a sign-in prompt and no protected request', async ({ page }) => {
  const protectedCalls: string[] = [];
  page.on('request', request => { if (request.headers().authorization) protectedCalls.push(request.url()); });
  for (const [route, title] of [['/account/sessions', 'Active sessions'], ['/account/delete', 'Delete account'], ['/admin/users', 'Manage accounts']]) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
  }
  await page.goto('/#/profile');
  await expect(page.getByText('Sample profile', { exact: true })).toBeVisible();
  expect(protectedCalls).toEqual([]);
});

test('active sessions can revoke another device only after confirmation', async ({ page }) => {
  await restoreAs(page);
  const revoked: string[] = [];
  await page.route('**/api/v1/auth/sessions', route => route.fulfill({ status: 200, json: { sessions: [
    { id: user.id, created_at: '2026-11-14T08:00:00Z', last_used_at: '2026-11-14T09:00:00Z', device: 'Chrome on Windows', current: true },
    { id: other.id, created_at: '2026-11-01T08:00:00Z', last_used_at: '2026-11-02T08:00:00Z', device: null, current: false },
  ] } }));
  await page.route('**/api/v1/auth/sessions/*', route => {
    revoked.push(`${route.request().method()} ${new URL(route.request().url()).pathname}`);
    return route.fulfill({ status: 204 });
  });
  await page.goto('/#/account/sessions');
  await expect(page.getByText('This device', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out here', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out unknown device', exact: true }).click();
  expect(revoked).toEqual([]);
  await page.getByRole('button', { name: 'Confirm sign out', exact: true }).click();
  await expect(page.getByText('Session signed out', { exact: true })).toBeVisible();
  await expect(page.getByText('Unknown device', { exact: true })).toHaveCount(0);
  expect(revoked).toEqual([`DELETE /api/v1/auth/sessions/${other.id}`]);
});

test('account deletion needs confirmation and the password', async ({ page }) => {
  await restoreAs(page);
  let attempts = 0;
  await page.route('**/api/v1/users/me', route => {
    attempts++;
    expect(route.request().method()).toBe('DELETE');
    return attempts === 1
      ? route.fulfill({ status: 403, json: { code: 'invalid_password' } })
      : route.fulfill({ status: 202, json: { status: 'scheduled' } });
  });
  await page.goto('/#/account/delete');
  const submit = page.getByRole('button', { name: 'Delete my account', exact: true });
  await expect(submit).toBeDisabled();
  await page.getByRole('checkbox').check();
  await page.getByLabel('Password', { exact: true }).fill('wrong password here');
  await submit.click();
  await expect(page.getByRole('alert')).toContainText('Password is incorrect. Your account was not deleted.');
  await page.getByLabel('Password', { exact: true }).fill('the right password');
  await submit.click();
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.getByText(/Your account is deleted/)).toBeVisible();
  await expect(page.getByText('Signed in as Linh', { exact: true })).toHaveCount(0);
});

test('admin tools stay hidden from learners and suspend only with a reason and confirmation', async ({ page }) => {
  await restoreAs(page, { ...user, role: 'ADMIN' } as typeof user);
  const actions: { path: string; body: unknown }[] = [];
  await page.route('**/api/v1/admin/users?*', route => route.fulfill({ status: 200, json: other }));
  await page.route('**/api/v1/admin/users/*/*', route => {
    const suspend = route.request().url().endsWith('/suspend');
    actions.push({ path: new URL(route.request().url()).pathname, body: route.request().postDataJSON() });
    return route.fulfill({ status: 200, json: { ...other, is_suspended: suspend } });
  });
  await page.route('**/api/v1/users/me', route => route.fulfill({ status: 200, json: { ...profile, role: 'ADMIN' } }));
  await page.goto('/#/profile');
  await page.getByRole('link', { name: 'Manage accounts', exact: true }).click();
  await page.getByLabel('Account email').fill('other@example.com');
  await page.getByRole('button', { name: 'Find account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Minh', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Suspend account', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm suspension', exact: true }).click();
  await expect(page.getByLabel('Reason for suspension')).toBeFocused();
  expect(actions).toEqual([]);
  await page.getByLabel('Reason for suspension').fill('Abusive language in rooms');
  await page.getByRole('button', { name: 'Confirm suspension', exact: true }).click();
  await expect(page.getByText(/Account suspended/)).toBeVisible();
  await page.getByRole('button', { name: 'Reactivate account', exact: true }).click();
  await expect(page.getByText('Account reactivated.', { exact: true })).toBeVisible();
  expect(actions).toEqual([
    { path: `/api/v1/admin/users/${other.id}/suspend`, body: { reason: 'Abusive language in rooms' } },
    { path: `/api/v1/admin/users/${other.id}/reactivate`, body: null },
  ]);
});

test('learners do not see admin tools', async ({ page }) => {
  await restoreAs(page);
  await page.route('**/api/v1/users/me', route => route.fulfill({ status: 200, json: profile }));
  await page.goto('/#/profile');
  await expect(page.getByLabel('Display name', { exact: true })).toHaveValue('Linh');
  await expect(page.getByRole('link', { name: 'Manage accounts', exact: true })).toHaveCount(0);
  await page.goto('/#/admin/users');
  await expect(page.getByText('Only administrators can manage accounts.', { exact: true })).toBeVisible();
});

test('a suspended account gets a specific sign-in message', async ({ page }) => {
  await page.route('**/api/v1/auth/login', route => route.fulfill({ status: 403, json: { code: 'account_suspended' } }));
  await page.goto('/#/sign-in');
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a valid password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('This account is suspended.');
});
