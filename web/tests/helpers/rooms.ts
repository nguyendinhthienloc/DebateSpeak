import { expect, type Page } from '@playwright/test';
import { installFakeAudio } from './fakeAudio';

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

/**
 * Replaces the microphone with a tone (or silence, or a refusal) and counts requests and stopped tracks on `window.__mic`.
 * `signal: true` is a loud tone; a number sets the tone's peak volume (its level is about 0.7 times that).
 * `missing` means no microphone is connected; `devices` lists microphone labels (ids `mic-1`, `mic-2`, …).
 */
export async function fakeMic(page: Page, options: { signal: boolean | number; denied?: boolean; missing?: boolean; devices?: string[] }) {
  await page.addInitScript(({ signal, denied, missing, devices: labels }) => {
    window.__mic = { requests: 0, stopped: 0 };
    const devices = navigator.mediaDevices;
    const inputs = labels
      ? labels.map((label, index) => ({ deviceId: `mic-${index + 1}`, groupId: 'fake', kind: 'audioinput', label, toJSON: () => ({}) }))
      : [{ deviceId: 'fake-mic', groupId: 'fake', kind: 'audioinput', label: 'Built-in microphone', toJSON: () => ({}) }];
    devices.enumerateDevices = async () => (missing ? [] : inputs) as MediaDeviceInfo[];
    devices.getUserMedia = async () => {
      window.__mic.requests += 1;
      if (missing) throw new DOMException('Requested device not found', 'NotFoundError');
      if (denied) throw new DOMException('Permission denied', 'NotAllowedError');
      const context = new AudioContext();
      const output = context.createMediaStreamDestination();
      if (signal) {
        const tone = context.createOscillator();
        const gain = context.createGain();
        gain.gain.value = typeof signal === 'number' ? signal : 0.5;
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

/** Signs in as Linh and opens a READY room with Sam. Reports the last Ready body and how many times Ready was withdrawn; `set` replaces the room. */
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
  return { ready: () => ready, cleared: () => cleared, set: room.set };
}

/** Ticks the consent box and passes the microphone test. */
export async function passAgree(page: Page) {
  await page.getByRole('checkbox', { name: 'I agree for this debate' }).check();
  await page.getByRole('button', { name: 'Test microphone', exact: true }).click();
  await page.getByText('We can hear you', { exact: true }).waitFor();
}

interface LiveOptions {
  startsInSeconds?: number; secondsLeft?: number; format?: 'FREE_FLOW' | 'TIMED_TURNS';
  partnerName?: string; myInput?: 'VOICE' | 'TYPE'; partnerInput?: 'VOICE' | 'TYPE'; turnsFail?: boolean;
  /** Run the real audio layer against a fake livekit-client module (install it first with installFakeLiveKit). */
  liveKit?: boolean;
}

type Turn = { seq: number; user_id: string; text: string; at_ms: number };

/**
 * Signs in as Linh with fake audio, opens the room in READY, then switches it to LIVE so the page sees the debate begin.
 * The start time is fixed when LIVE is first served, and every response carries the current server time.
 */
export async function openLiveRoom(page: Page, options: LiveOptions = {}) {
  if (!options.liveKit) await installFakeAudio(page);
  await signInAs(page, 'Linh');
  const timed = options.format === 'TIMED_TURNS';
  const duration = timed ? 390 : 600;
  const seats = [
    { ...linhSeat, ready: true, input: options.myInput ?? 'VOICE' },
    { ...samSeat, display_name: options.partnerName ?? 'Sam', ready: true, input: options.partnerInput ?? 'VOICE' },
  ];
  let current: Record<string, unknown> = snapshot({ status: 'READY', format: options.format ?? 'FREE_FLOW', duration_seconds: duration, participants: seats });
  let ended = 0;
  let endReason: string | undefined;
  const sent: unknown[] = [];
  const turns: Turn[] = [];
  await page.route(url => url.pathname.endsWith(`/api/v1/rooms/${roomId}/turns`), route => {
    if (route.request().method() === 'POST') {
      if (options.turnsFail) return route.fulfill({ status: 500, json: {} });
      const body = route.request().postDataJSON();
      sent.push(body);
      const turn = { seq: turns.length + 1, user_id: linhId, text: body.text, at_ms: 1000 };
      turns.push(turn);
      return route.fulfill({ status: 201, json: turn });
    }
    const after = Number(new URL(route.request().url()).searchParams.get('after') ?? 0);
    return route.fulfill({ status: 200, json: { turns: turns.filter(turn => turn.seq > after) } });
  });
  await page.route(`**/api/v1/rooms/${roomId}`, route => {
    if (current.status === 'LIVE' && current.started_at === null) {
      const startsIn = options.startsInSeconds !== undefined ? options.startsInSeconds : -(duration - (options.secondsLeft ?? duration - 5));
      current = { ...current, started_at: new Date(Date.now() + startsIn * 1000).toISOString() };
    }
    return route.fulfill({ status: 200, json: { ...current, server_now: new Date().toISOString() } });
  });
  await page.route(`**/api/v1/rooms/${roomId}/token`, route => route.fulfill({ status: 200, json: { token: 'media-token', url: 'wss://livekit.test' } }));
  await page.route(`**/api/v1/rooms/${roomId}/end`, route => {
    ended += 1;
    endReason = route.request().postDataJSON()?.reason;
    current = { ...current, status: 'ENDED', end_reason: endReason, ended_by: endReason === 'MANUAL' ? linhId : null, ended_at: new Date().toISOString() };
    return route.fulfill({ status: 200, json: { ...current, server_now: new Date().toISOString() } });
  });
  await page.goto(`/#/rooms/${roomId}`);
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'READY');
  current = { ...current, status: 'LIVE', started_at: null };
  await expect(page.getByTestId('room-view')).toHaveAttribute('data-status', 'LIVE', { timeout: 5000 });
  if (options.startsInSeconds === undefined && !options.liveKit) {
    await expect.poll(() => page.evaluate(() => window.__audio.connects.length), { timeout: 5000 }).toBeGreaterThan(0);
  }
  return {
    set(room: Record<string, unknown>) { current = { ...room }; },
    ended: () => ended,
    endReason: () => endReason,
    turns: () => sent,
    addTurn(turn: Turn) { turns.push(turn); },
  };
}
