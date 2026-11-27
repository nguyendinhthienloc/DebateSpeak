// Fake API for clicking through the room flow with two accounts. Development only; see web/DEV_GUIDE.md.
// Everything lives in memory and resets when the dev server restarts.
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const password = 'debate-practice';
const now = () => Date.now();
const iso = (ms: number) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');

interface User { id: string; email: string; display_name: string; cefr_level: string; created_at: string; native_language: string | null; goals: string[] }
type Side = 'FOR' | 'AGAINST';
interface Seat { user_id: string; side: Side | null; is_creator: boolean; ready: boolean; input: 'VOICE' | 'TYPE' | null }
interface Room {
  id: string; code: string | null; status: 'LOBBY' | 'READY' | 'LIVE' | 'ENDED' | 'CANCELLED'; motion: string;
  format: 'FREE_FLOW' | 'TIMED_TURNS'; duration_seconds: number; random_sides: boolean; expires_at: number;
  started_at: number | null; ended_at: number | null; end_reason: string | null; ended_by: string | null; seats: Seat[];
  turns: { seq: number; user_id: string; text: string; at_ms: number }[];
}

const users: User[] = [
  { id: randomUUID(), email: 'linh@example.com', display_name: 'Linh', cefr_level: 'B1', created_at: iso(now()), native_language: null, goals: [] },
  { id: randomUUID(), email: 'sam@example.com', display_name: 'Sam', cefr_level: 'B2', created_at: iso(now()), native_language: null, goals: [] },
];
const passwords = new Map(users.map(user => [user.id, password]));
const accessTokens = new Map<string, string>();
const refreshTokens = new Map<string, string>();
const rooms: Room[] = [];
const topics = [
  ['Social media does more harm than good for teenagers', 'Society', 'B1'],
  ['Cities should ban private cars from the centre', 'Environment', 'B1'],
  ['Homework should be optional in secondary school', 'Education', 'B1'],
  ['Online friendships are as real as offline ones', 'Society', 'B2'],
  ['Video games should count as a sport', 'Culture', 'A2'],
  ['Schools should teach financial literacy', 'Education', 'A2'],
  ['Governments should fund ocean research before space travel', 'Science', 'C1'],
  ['Artificial intelligence will create more jobs than it destroys', 'Technology', 'C1'],
].map(([motion, category, cefr_level], index) => ({ id: `topic-${index + 1}`, motion, category, cefr_level }));

const codeLetters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newCode() {
  for (;;) {
    const code = Array.from({ length: 8 }, () => codeLetters[Math.floor(Math.random() * codeLetters.length)]).join('');
    if (!rooms.some(room => room.code === code)) return code;
  }
}

/** Applies expiry and the time limit before every read and write, like RoomService.settle. */
function settle(room: Room) {
  if ((room.status === 'LOBBY' || room.status === 'READY') && now() > room.expires_at) {
    Object.assign(room, { status: 'CANCELLED', end_reason: 'EXPIRED', ended_at: now(), code: null });
  }
  if (room.status === 'LIVE' && room.started_at && now() > room.started_at + room.duration_seconds * 1000) {
    Object.assign(room, { status: 'ENDED', end_reason: 'TIMER', ended_at: room.started_at + room.duration_seconds * 1000 });
  }
}

function view(room: Room) {
  return {
    id: room.id, code: room.code, status: room.status, motion: room.motion, format: room.format,
    duration_seconds: room.duration_seconds, expires_at: iso(room.expires_at),
    started_at: room.started_at ? iso(room.started_at) : null, ended_at: room.ended_at ? iso(room.ended_at) : null,
    end_reason: room.end_reason, ended_by: room.ended_by, server_now: iso(now()),
    participants: room.seats.map(seat => ({ ...seat, display_name: users.find(user => user.id === seat.user_id)?.display_name ?? 'Learner' })),
  };
}

function tokens(user: User, response: ServerResponse) {
  const access = randomUUID();
  const refresh = randomUUID();
  accessTokens.set(access, user.id);
  refreshTokens.set(refresh, user.id);
  response.setHeader('Set-Cookie', `mock_refresh=${refresh}; Path=/api/v1/auth; HttpOnly; SameSite=Lax`);
  const { native_language: _language, goals: _goals, ...plain } = user;
  return { access_token: access, token_type: 'bearer', expires_in: 3600, user: plain };
}

async function body(request: IncomingMessage): Promise<Record<string, unknown>> {
  let text = '';
  for await (const chunk of request) text += chunk;
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
}

type Reply = [number, unknown?];
const fail = (status: number, code: string): Reply => [status, { code }];

async function handle(request: IncomingMessage, response: ServerResponse): Promise<Reply> {
  const url = new URL(request.url ?? '/', 'http://local');
  const path = url.pathname.replace(/^\/api\/v1/, '');
  const method = request.method ?? 'GET';
  const input = method === 'GET' ? {} : await body(request);
  const cookie = /mock_refresh=([^;]+)/.exec(request.headers.cookie ?? '')?.[1];

  if (path === '/auth/login' && method === 'POST') {
    const user = users.find(item => item.email === String(input.email).toLowerCase());
    if (!user || passwords.get(user.id) !== input.password) return fail(401, 'invalid_credentials');
    return [200, tokens(user, response)];
  }
  if (path === '/auth/register' && method === 'POST') {
    const email = String(input.email).toLowerCase();
    if (users.some(user => user.email === email)) return fail(409, 'email_taken');
    const user: User = { id: randomUUID(), email, display_name: String(input.display_name || email.split('@')[0]), cefr_level: String(input.cefr_level || 'B1'), created_at: iso(now()), native_language: null, goals: [] };
    users.push(user);
    passwords.set(user.id, String(input.password));
    const { native_language: _language, goals: _goals, ...plain } = user;
    return [201, plain];
  }
  if (path === '/auth/refresh' && method === 'POST') {
    const user = users.find(item => item.id === (cookie && refreshTokens.get(cookie)));
    if (!user || !cookie) return fail(401, 'no_session');
    refreshTokens.delete(cookie);
    return [200, tokens(user, response)];
  }
  if (path === '/auth/logout' && method === 'POST') {
    if (cookie) refreshTokens.delete(cookie);
    response.setHeader('Set-Cookie', 'mock_refresh=; Path=/api/v1/auth; Max-Age=0');
    return [204];
  }

  const bearer = /^Bearer (.+)$/.exec(request.headers.authorization ?? '')?.[1];
  const me = users.find(user => user.id === (bearer && accessTokens.get(bearer)));
  if (!me) return fail(401, 'unauthorized');

  if (path === '/users/me' && method === 'GET') return [200, me];
  if (path === '/users/me' && method === 'PATCH') { Object.assign(me, input); return [200, me]; }
  if (path === '/auth/sessions' && method === 'GET') {
    return [200, { sessions: [{ id: randomUUID(), created_at: me.created_at, last_used_at: iso(now()), device: 'Mock browser', current: true }] }];
  }
  if (path === '/topics' && method === 'GET') return [200, { topics }];

  if (path === '/rooms' && method === 'POST') {
    const topic = topics.find(item => item.id === input.topic_id);
    const minutes = Number(input.duration_minutes);
    if (!topic || ![5, 10, 15, 20].includes(minutes)) return fail(422, 'invalid_room');
    const side = input.side === 'FOR' || input.side === 'AGAINST' ? input.side : null;
    const room: Room = {
      id: randomUUID(), code: newCode(), status: 'LOBBY', motion: topic.motion,
      format: input.format === 'TIMED_TURNS' ? 'TIMED_TURNS' : 'FREE_FLOW',
      duration_seconds: input.format === 'TIMED_TURNS' ? 390 : minutes * 60, random_sides: side === null,
      expires_at: now() + 30 * 60_000, started_at: null, ended_at: null, end_reason: null, ended_by: null,
      seats: [{ user_id: me.id, side, is_creator: true, ready: false, input: null }], turns: [],
    };
    rooms.push(room);
    return [201, view(room)];
  }

  if ((path === '/rooms/lookup' || path === '/rooms/join') && method === 'POST') {
    rooms.forEach(settle);
    const room = rooms.find(item => item.code !== null && item.code === String(input.code).toUpperCase());
    if (!room) return fail(404, 'invite_invalid');
    const seated = room.seats.some(seat => seat.user_id === me.id);
    if (path === '/rooms/lookup') {
      if (!seated && room.seats.length === 2) return fail(409, 'room_full');
      const creator = room.seats.find(seat => seat.is_creator)!;
      return [200, { room_id: seated ? room.id : null, motion: room.motion, format: room.format, duration_seconds: room.duration_seconds,
        creator_name: users.find(user => user.id === creator.user_id)?.display_name, stance_mode: room.random_sides ? 'RANDOM' : 'CREATOR_PICKS' }];
    }
    if (seated) return [200, view(room)];
    if (room.seats.length === 2) return fail(409, 'room_full');
    const creator = room.seats[0];
    if (room.random_sides) creator.side = Math.random() < 0.5 ? 'FOR' : 'AGAINST';
    room.seats.push({ user_id: me.id, side: creator.side === 'FOR' ? 'AGAINST' : 'FOR', is_creator: false, ready: false, input: null });
    room.status = 'READY';
    return [200, view(room)];
  }

  const match = /^\/rooms\/([0-9a-f-]{36})(\/[a-z]+)?$/.exec(path);
  const room = match && rooms.find(item => item.id === match[1]);
  if (!room || !room.seats.some(seat => seat.user_id === me.id)) return fail(404, 'room_not_found');
  settle(room);
  const action = match[2] ?? '';
  const seat = room.seats.find(item => item.user_id === me.id)!;

  if (action === '' && method === 'GET') return [200, view(room)];
  if (action === '/cancel' && method === 'POST') {
    if (!seat.is_creator) return fail(403, 'not_creator');
    if (room.status !== 'LOBBY' && room.status !== 'READY') return fail(409, 'invalid_state');
    Object.assign(room, { status: 'CANCELLED', end_reason: 'CANCELLED', ended_at: now(), code: null });
    return [200, view(room)];
  }
  if (action === '/leave' && method === 'POST') {
    if (room.status !== 'LOBBY' && room.status !== 'READY') return fail(409, 'invalid_state');
    if (seat.is_creator) {
      Object.assign(room, { status: 'CANCELLED', end_reason: 'CANCELLED', ended_at: now(), code: null });
    } else {
      room.seats = room.seats.filter(item => item !== seat);
      for (const other of room.seats) { other.ready = false; other.input = null; if (room.random_sides) other.side = null; }
      Object.assign(room, { status: 'LOBBY', expires_at: now() + 30 * 60_000 });
    }
    return [200, view(room)];
  }
  if (action === '/ready' && method === 'PUT') {
    if (room.status !== 'READY') return fail(409, 'invalid_state');
    if (input.consent !== true) return fail(422, 'consent_required');
    Object.assign(seat, { ready: true, input: input.input === 'TYPE' ? 'TYPE' : 'VOICE' });
    if (room.seats.length === 2 && room.seats.every(item => item.ready)) Object.assign(room, { status: 'LIVE', started_at: now() + 3000 });
    return [200, view(room)];
  }
  if (action === '/ready' && method === 'DELETE') {
    if (room.status !== 'READY') return fail(409, 'invalid_state');
    Object.assign(seat, { ready: false, input: null });
    return [200, view(room)];
  }
  if (action === '/end' && method === 'POST') {
    if (room.status !== 'LIVE') return fail(409, 'invalid_state');
    Object.assign(room, { status: 'ENDED', end_reason: input.reason === 'DISCONNECT' ? 'DISCONNECT' : 'MANUAL', ended_by: me.id, ended_at: now() });
    return [200, view(room)];
  }
  if (action === '/turns' && method === 'POST') {
    if (room.status !== 'LIVE') return fail(409, 'invalid_state');
    const text = typeof input.text === 'string' ? input.text.trim() : '';
    if (text.length < 1 || text.length > 500) return fail(422, 'invalid_text');
    const turn = { seq: room.turns.length + 1, user_id: me.id, text, at_ms: Math.max(0, now() - (room.started_at ?? now())) };
    room.turns.push(turn);
    return [201, turn];
  }
  if (action === '/turns' && method === 'GET') {
    const after = Number(url.searchParams.get('after') ?? 0);
    return [200, { turns: room.turns.filter(turn => turn.seq > after) }];
  }
  return fail(501, 'not_in_mock');
}

export function mockApi(): Plugin {
  return {
    name: 'debatespeak-mock-api',
    configureServer(server) {
      server.middlewares.use('/api/v1', (request, response) => {
        request.url = `/api/v1${request.url ?? ''}`;
        handle(request, response).then(([status, payload]) => {
          response.statusCode = status;
          if (payload === undefined) return response.end();
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify(payload));
        }, error => { response.statusCode = 500; response.end(String(error)); });
      });
      server.httpServer?.once('listening', () => {
        server.config.logger.info(`\n  Mock API on. Accounts: linh@example.com and sam@example.com, password "${password}".\n`);
      });
    },
  };
}
