import { clearSession, getAccessToken } from '../auth/session';
import { isMediaToken, isRoomPreview, isRoomSnapshot, isTopicList, isTurnList, isTypedTurn, type CreateRoomInput, type InputMode, type MediaToken, type RoomPreview, type RoomSnapshot, type Topic, type TypedTurn } from './contracts';

const baseUrl = (import.meta.env.VITE_API_BASE_URL?.trim() || '/api/v1').replace(/\/+$/, '');

/** A failed room request. `status` 0 means the server could not be reached. */
export class RoomApiError extends Error {
  constructor(public readonly status: number, public readonly code?: string) {
    super(`Room request failed (${status}${code ? `, ${code}` : ''})`);
    this.name = 'RoomApiError';
  }
}

async function request<T>(path: string, method: string, valid: (value: unknown) => value is T, signal: AbortSignal, body?: object): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new RoomApiError(401);
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method, signal, cache: 'no-store', credentials: 'include',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}`, 'X-DebateSpeak-Client': 'web', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new RoomApiError(0);
  }
  const payload: unknown = await response.json().catch(() => null);
  if (response.status === 401) clearSession(true);
  if (!response.ok) {
    const code = typeof payload === 'object' && payload !== null && typeof (payload as { code?: unknown }).code === 'string'
      ? (payload as { code: string }).code : undefined;
    throw new RoomApiError(response.status, code);
  }
  if (!valid(payload)) throw new RoomApiError(response.status, 'unexpected_response');
  return payload;
}

export function getRoom(id: string, signal: AbortSignal): Promise<RoomSnapshot> {
  return request(`/rooms/${encodeURIComponent(id)}`, 'GET', isRoomSnapshot, signal);
}

export async function listTopics(signal: AbortSignal): Promise<Topic[]> {
  return (await request('/topics', 'GET', isTopicList, signal)).topics;
}

export function createRoom(input: CreateRoomInput, signal: AbortSignal): Promise<RoomSnapshot> {
  return request('/rooms', 'POST', isRoomSnapshot, signal, input);
}

export function lookupRoom(code: string, signal: AbortSignal): Promise<RoomPreview> {
  return request('/rooms/lookup', 'POST', isRoomPreview, signal, { code });
}

export function joinRoom(code: string, signal: AbortSignal): Promise<RoomSnapshot> {
  return request('/rooms/join', 'POST', isRoomSnapshot, signal, { code });
}

export function cancelRoom(id: string, signal: AbortSignal): Promise<RoomSnapshot> {
  return request(`/rooms/${encodeURIComponent(id)}/cancel`, 'POST', isRoomSnapshot, signal, {});
}

export function leaveRoom(id: string, signal: AbortSignal): Promise<RoomSnapshot> {
  return request(`/rooms/${encodeURIComponent(id)}/leave`, 'POST', isRoomSnapshot, signal, {});
}

/** Ready includes consent: the server refuses Ready without it. */
export function setReady(id: string, input: InputMode, signal: AbortSignal): Promise<RoomSnapshot> {
  return request(`/rooms/${encodeURIComponent(id)}/ready`, 'PUT', isRoomSnapshot, signal, { consent: true, input });
}

export function clearReady(id: string, signal: AbortSignal): Promise<RoomSnapshot> {
  return request(`/rooms/${encodeURIComponent(id)}/ready`, 'DELETE', isRoomSnapshot, signal);
}

/** A short-lived LiveKit token, issued only while the room is LIVE. */
export function getMediaToken(id: string, signal: AbortSignal): Promise<MediaToken> {
  return request(`/rooms/${encodeURIComponent(id)}/token`, 'POST', isMediaToken, signal, {});
}

export function endRoom(id: string, reason: 'MANUAL' | 'DISCONNECT', signal: AbortSignal): Promise<RoomSnapshot> {
  return request(`/rooms/${encodeURIComponent(id)}/end`, 'POST', isRoomSnapshot, signal, { reason });
}

export function sendTurn(id: string, text: string, signal: AbortSignal): Promise<TypedTurn> {
  return request(`/rooms/${encodeURIComponent(id)}/turns`, 'POST', isTypedTurn, signal, { text });
}

export async function listTurns(id: string, after: number, signal: AbortSignal): Promise<TypedTurn[]> {
  return (await request(`/rooms/${encodeURIComponent(id)}/turns?after=${after}`, 'GET', isTurnList, signal)).turns;
}
