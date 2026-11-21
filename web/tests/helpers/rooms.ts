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

export const topics = [
  { id: 'topic-1', motion: 'Social media does more harm than good for teenagers', category: 'Society', cefr_level: 'B1' },
  { id: 'topic-2', motion: 'Cities should ban private cars from the centre', category: 'Environment', cefr_level: 'B1' },
  { id: 'topic-3', motion: 'Homework should be optional in secondary school', category: 'Education', cefr_level: 'B1' },
  { id: 'topic-4', motion: 'Online friendships are as real as offline ones', category: 'Society', cefr_level: 'B2' },
  { id: 'topic-5', motion: 'Video games should count as a sport', category: 'Culture', cefr_level: 'A2' },
  { id: 'topic-6', motion: 'Governments should fund ocean research before space travel', category: 'Science', cefr_level: 'C1' },
];

/** Serves `GET /topics` with six seeded motions. */
export async function mockTopics(page: Page) {
  await page.route('**/api/v1/topics', route => route.fulfill({ status: 200, json: { topics } }));
}

/** Serves everything Home loads: the topics list. */
export async function mockHome(page: Page) {
  await mockTopics(page);
}

/** Serves `POST /rooms/lookup` with a preview of Linh's 10-minute Free flow room. */
export async function mockLookup(page: Page, preview: Record<string, unknown> = {}) {
  await page.route('**/api/v1/rooms/lookup', route => route.fulfill({ status: 200, json: {
    room_id: null, motion: 'Cities should ban private cars from the centre', creator_name: 'Linh',
    format: 'FREE_FLOW', duration_seconds: 600, stance_mode: 'RANDOM', ...preview,
  } }));
}

/** Serves `POST /rooms/join` with the joined room. */
export async function mockJoin(page: Page, room: ReturnType<typeof snapshot>) {
  await page.route('**/api/v1/rooms/join', route => route.fulfill({ status: 200, json: room }));
}

/** A visitor who starts signed out: refresh fails, sign-in succeeds as `name`. */
export async function mockSignInFlow(page: Page, name: keyof typeof people) {
  const user = { ...people[name], display_name: name, cefr_level: 'B1', created_at: '2026-11-12T08:00:00Z' };
  await page.route('**/api/v1/auth/*', route => route.request().url().endsWith('/refresh')
    ? route.fulfill({ status: 401, json: { code: 'no_session' } })
    : route.fulfill({ status: 200, json: { access_token: `token-${name}`, token_type: 'bearer', expires_in: 900, user } }));
}

export async function submitSignIn(page: Page) {
  await page.getByLabel('Email', { exact: true }).fill('sam@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a valid password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

declare global {
  interface Window { __mic: { requests: number; stopped: number } }
}

/** Replaces the microphone with a tone (or silence, or a refusal) and counts requests and stopped tracks on `window.__mic`. */
export async function fakeMic(page: Page, options: { signal: boolean; denied?: boolean }) {
  await page.addInitScript(({ signal, denied }) => {
    window.__mic = { requests: 0, stopped: 0 };
    const devices = navigator.mediaDevices;
    devices.enumerateDevices = async () => [{ deviceId: 'fake-mic', groupId: 'fake', kind: 'audioinput', label: 'Built-in microphone', toJSON: () => ({}) }];
    devices.getUserMedia = async () => {
      window.__mic.requests += 1;
      if (denied) throw new DOMException('Permission denied', 'NotAllowedError');
      const context = new AudioContext();
      const output = context.createMediaStreamDestination();
      if (signal) {
        const tone = context.createOscillator();
        const gain = context.createGain();
        gain.gain.value = 0.5;
        tone.connect(gain).connect(output);
        tone.start();
      }
      for (const track of output.stream.getTracks()) {
        const stop = track.stop.bind(track);
        track.stop = () => { window.__mic.stopped += 1; stop(); };
      }
      return output.stream;
    };
  }, options);
}

/** Signs in as Linh and opens a READY room with Sam. Reports the last Ready body and how many times Ready was withdrawn. */
export async function openReadyRoom(page: Page) {
  await signInAs(page, 'Linh');
  const waiting = snapshot({ status: 'READY' });
  const room = await mockRoom(page, waiting);
  let ready: unknown;
  let cleared = 0;
  await page.route(`**/api/v1/rooms/${roomId}/ready`, route => {
    if (route.request().method() === 'PUT') {
      ready = route.request().postDataJSON();
      const next = snapshot({ status: 'READY', participants: [{ ...linhSeat, ready: true, input: 'VOICE' }, samSeat] });
      room.set(next);
      return route.fulfill({ status: 200, json: next });
    }
    cleared += 1;
    room.set(waiting);
    return route.fulfill({ status: 200, json: waiting });
  });
  await page.route(`**/api/v1/rooms/${roomId}/leave`, route => route.fulfill({ status: 200,
    json: snapshot({ status: 'CANCELLED', code: null, end_reason: 'CANCELLED' }) }));
  await page.goto(`/#/rooms/${roomId}`);
  return { ready: () => ready, cleared: () => cleared };
}

/** Ticks the consent box and passes the microphone test. */
export async function passAgree(page: Page) {
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await page.getByText('We can hear you', { exact: true }).waitFor();
}
