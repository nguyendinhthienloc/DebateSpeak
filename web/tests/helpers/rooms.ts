import type { Page } from '@playwright/test';

export const roomId = '6f1c2a9e-4b7d-4c8e-9a1f-2d3e4f5a6b7c';
export const linhId = 'd817b684-08e9-49c0-806a-a045fb7f060c';
export const samId = '3a9b0c1d-2e3f-4a5b-8c6d-7e8f9a0b1c2d';

const people = {
  Linh: { id: linhId, email: 'linh@example.com' },
  Sam: { id: samId, email: 'sam@example.com' },
} as const;

export const linhSeat = { user_id: linhId, display_name: 'Linh', side: 'FOR', is_creator: true, ready: false, input: null };
export const samSeat = { user_id: samId, display_name: 'Sam', side: 'AGAINST', is_creator: false, ready: false, input: null };

/** Restores a session for Linh or Sam on page load through a mocked refresh call. */
export async function signInAs(page: Page, name: keyof typeof people) {
  const user = { ...people[name], display_name: name, cefr_level: 'B1', created_at: '2026-11-12T08:00:00Z' };
  await page.route('**/api/v1/auth/refresh', route => route.fulfill({
    status: 200, json: { access_token: `token-${name}`, token_type: 'bearer', expires_in: 900, user },
  }));
}

/** A 10-minute Free flow room with Linh (creator, For) and Sam (Against). */
export function snapshot(overrides: Record<string, unknown> = {}) {
  return {
    id: roomId, code: 'K7Q2M9XA', status: 'READY',
    motion: 'Cities should ban private cars from the centre', format: 'FREE_FLOW', duration_seconds: 600,
    expires_at: '2026-11-19T10:30:00Z', started_at: null, ended_at: null, end_reason: null, ended_by: null,
    server_now: '2026-11-19T10:00:00Z', participants: [linhSeat, samSeat],
    ...overrides,
  };
}

/** Serves `GET /rooms/{id}` from a snapshot that the test can replace. */
export async function mockRoom(page: Page, room: ReturnType<typeof snapshot>) {
  let current = room;
  await page.route(`**/api/v1/rooms/${roomId}`, route => route.fulfill({ status: 200, json: current }));
  return { set(next: ReturnType<typeof snapshot>) { current = next; } };
}
