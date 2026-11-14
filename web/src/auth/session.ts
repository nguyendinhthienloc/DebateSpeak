import { useSyncExternalStore } from 'react';
import type { TokenResponse, UserResponse } from './contracts';

interface Session {
  user: UserResponse;
  accessToken: string;
  expiresAt: number;
}

/** `restoring` is true until the startup `/auth/refresh` attempt settles. */
let snapshot: { session: Session | null; expired: boolean; restoring: boolean } = { session: null, expired: false, restoring: true };
let expiryTimer: number | undefined;
let expiryHandler: (() => void) | undefined;
const listeners = new Set<() => void>();
const getSnapshot = () => snapshot;
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function publish(next: typeof snapshot) {
  snapshot = next;
  listeners.forEach(listener => listener());
}

export function clearSession(expired = false) {
  window.clearTimeout(expiryTimer);
  publish({ session: null, expired, restoring: false });
}

export function setSession(response: TokenResponse) {
  window.clearTimeout(expiryTimer);
  publish({
    session: { user: response.user, accessToken: response.access_token, expiresAt: Date.now() + response.expires_in * 1000 },
    expired: false, restoring: false,
  });
  expiryTimer = window.setTimeout(() => (expiryHandler ? expiryHandler() : clearSession(true)), response.expires_in * 1000);
}

/** Called when the access token expires; the app uses it to try `/auth/refresh` first. */
export function setExpiryHandler(handler: (() => void) | undefined) {
  expiryHandler = handler;
}

export function finishRestoring() {
  if (snapshot.restoring) publish({ ...snapshot, restoring: false });
}

export function hasSession() {
  return snapshot.session !== null;
}

/** Keep the header name and role in sync after a profile save. */
export function updateSessionUser(user: UserResponse) {
  if (snapshot.session) publish({ ...snapshot, session: { ...snapshot.session, user } });
}

/** Memory only. Server-side JWT verification is still required. */
export function getAccessToken(): string | null {
  const session = snapshot.session;
  if (session && session.expiresAt <= Date.now()) {
    clearSession(true);
    return null;
  }
  return session?.accessToken ?? null;
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
