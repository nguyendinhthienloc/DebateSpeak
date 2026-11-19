import { clearSession, getAccessToken } from '../auth/session';
import { isRoomSnapshot, type RoomSnapshot } from './contracts';

const baseUrl = (import.meta.env.VITE_API_BASE_URL?.trim() || '/api/v1').replace(/\/+$/, '');

/** A failed room request. `status` 0 means the server could not be reached. */
export class RoomApiError extends Error {
  constructor(public readonly status: number, public readonly code?: string) {
    super(`Room request failed (${status}${code ? `, ${code}` : ''})`);
    this.name = 'RoomApiError';
  }
}

async function request<T>(path: string, method: string, valid: (value: unknown) => value is T, signal: AbortSignal, body?: object): Promise<T> {
  const token = getAccessToken();
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
