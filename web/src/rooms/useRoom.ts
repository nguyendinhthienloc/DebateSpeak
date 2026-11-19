import { useCallback, useEffect, useState } from 'react';
import { getRoom, RoomApiError } from './api';
import type { RoomSnapshot } from './contracts';

const pollEvery: Record<RoomSnapshot['status'], number | undefined> = { LOBBY: 2000, READY: 2000, LIVE: 5000, ENDED: undefined, CANCELLED: undefined };
export const fatal = (error?: RoomApiError) => error !== undefined && [401, 403, 404].includes(error.status);

/** Reads a room and keeps it fresh by polling. A failed poll keeps the last snapshot unless access is gone. */
export function useRoom(roomId: string) {
  const [room, setRoom] = useState<RoomSnapshot>();
  const [error, setError] = useState<RoomApiError>();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getRoom(roomId, controller.signal).then(
      next => { setRoom(next); setError(undefined); },
      reason => { if (!controller.signal.aborted) setError(reason instanceof RoomApiError ? reason : new RoomApiError(0)); });
    return () => controller.abort();
  }, [roomId, tick]);

  const status = room?.status;
  useEffect(() => {
    const delay = status ? pollEvery[status] : error ? 2000 : undefined;
    if (delay === undefined || fatal(error)) return;
    const timer = window.setTimeout(() => setTick(value => value + 1), delay);
    return () => window.clearTimeout(timer);
  }, [status, error, tick]);

  const refresh = useCallback(() => setTick(value => value + 1), []);
  const apply = useCallback((next: RoomSnapshot) => { setRoom(next); setError(undefined); }, []);
  return { room, error, refresh, apply };
}
