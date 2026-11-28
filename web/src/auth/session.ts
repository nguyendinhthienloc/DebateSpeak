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
let refresher: (() => Promise<TokenResponse>) | undefined;
let renewing: Promise<void> | undefined;
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
  // Renew a minute early, so requests in flight never carry an expired token.
  const renewIn = Math.max(response.expires_in / 2, response.expires_in - 60);
  expiryTimer = window.setTimeout(() => void renew(), renewIn * 1000);
}

/** How the app gets a new token from `/auth/refresh`. Without one, expiry signs the user out. */
export function setRefresher(next: (() => Promise<TokenResponse>) | undefined) {
  refresher = next;
}

/** One refresh at a time: refresh tokens rotate, so a second call would replay a consumed token. */
function renew() {
  renewing ??= (refresher ? refresher() : Promise.reject(new Error('no refresher')))
    .then(setSession, () => clearSession(true))
    .finally(() => { renewing = undefined; });
  return renewing;
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

/**
 * Memory only. Server-side JWT verification is still required.
 * An expired token (the computer slept past the renewal timer) is refreshed before it is returned.
 */
export async function getAccessToken(): Promise<string | null> {
  const session = snapshot.session;
  if (session && session.expiresAt <= Date.now()) await renew();
  return snapshot.session?.accessToken ?? null;
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
