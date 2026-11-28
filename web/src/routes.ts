import { useSyncExternalStore } from 'react';
import { normalizeInviteCode } from './inviteCode';

export const routes = [
  { path: '/welcome', label: 'Welcome' },
  { path: '/home', label: 'Home' },
  { path: '/sign-in', label: 'Sign in' },
  { path: '/register', label: 'Create account' },
  { path: '/account-created', label: 'Sign in after registration' },
  { path: '/forgot-password', label: 'Forgot password' },
  { path: '/reset-password', label: 'Reset password' },
  { path: '/verify-email', label: 'Verify email' },
  { path: '/rooms/new', label: 'Create room' },
  { path: '/profile', label: 'Profile' },
  { path: '/account/sessions', label: 'Active sessions' },
  { path: '/account/delete', label: 'Delete account' },
  { path: '/admin/users', label: 'Manage accounts' },
] as const;

export type RoutePath = typeof routes[number]['path'];

export type DynamicRoute = { kind: 'room'; roomId: string } | { kind: 'join'; code: string };

const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

/** Room pages (`/rooms/:id`) and invite links (`/join/:code`). Anything else is a static route or not found. */
export function matchDynamicRoute(path: string): DynamicRoute | undefined {
  const [, first, second, extra] = path.split('/');
  if (extra !== undefined || !second) return undefined;
  if (first === 'rooms' && uuid.test(second)) return { kind: 'room', roomId: second.toLowerCase() };
  if (first === 'join') {
    const code = normalizeInviteCode(second);
    return code ? { kind: 'join', code } : undefined;
  }
  return undefined;
}

// An invite opened while signed out, kept in memory only so it never reaches storage.
let pendingInvite: string | undefined;

export function rememberInvite(code: string) {
  pendingInvite = code;
}

export function takeInvite(): string | undefined {
  const code = pendingInvite;
  pendingInvite = undefined;
  return code;
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function currentPath() {
  return window.location.hash.slice(1).replace(/\/+$/, '') || '/welcome';
}

export function useRoute() {
  return useSyncExternalStore(subscribe, currentPath);
}
