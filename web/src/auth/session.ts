import { useSyncExternalStore } from 'react';
import type { TokenResponse, UserResponse } from './contracts';

interface Session {
  user: UserResponse;
  accessToken: string;
  expiresAt: number;
}

let snapshot: { session: Session | null; expired: boolean } = { session: null, expired: false };
let expiryTimer: number | undefined;
const listeners = new Set<() => void>();
const getSnapshot = () => snapshot;
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function clearSession(expired = false) {
  window.clearTimeout(expiryTimer);
  snapshot = { session: null, expired };
  listeners.forEach(listener => listener());
}

export function setSession(response: TokenResponse) {
  window.clearTimeout(expiryTimer);
  snapshot = {
    session: { user: response.user, accessToken: response.access_token, expiresAt: Date.now() + response.expires_in * 1000 },
    expired: false,
  };
  expiryTimer = window.setTimeout(() => clearSession(true), response.expires_in * 1000);
  listeners.forEach(listener => listener());
}

/** For future authenticated clients. Server-side JWT verification is still required. */
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
