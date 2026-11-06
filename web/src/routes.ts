import { useSyncExternalStore } from 'react';

export const routes = [
  { path: '/sign-in', label: 'Sign in' },
  { path: '/register', label: 'Create account' },
  { path: '/account-created', label: 'Account created example' },
  { path: '/rooms', label: 'Rooms' },
  { path: '/rooms/new', label: 'Create room' },
  { path: '/rooms/new/settings', label: 'Room settings' },
  { path: '/profile', label: 'Profile' },
  { path: '/invite', label: 'Invitation' },
  { path: '/rooms/waiting', label: 'Waiting lobby' },
  { path: '/rooms/ready', label: 'Ready lobby' },
  { path: '/rooms/full', label: 'Room full example' },
  { path: '/rooms/expired', label: 'Expired room example' },
] as const;

export type RoutePath = typeof routes[number]['path'];

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function currentPath() {
  return window.location.hash.slice(1).replace(/\/+$/, '') || '/sign-in';
}

export function useRoute() {
  return useSyncExternalStore(subscribe, currentPath);
}
