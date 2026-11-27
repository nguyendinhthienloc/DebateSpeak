import { useCallback, useEffect, useRef, useState } from 'react';
import { listTurns, sendTurn } from './api';
import type { TypedTurn } from './contracts';

const pollEveryMs = 5000;

/**
 * Typed debate turns for a room. Loads every turn on mount, then asks for newer ones every 5 s and whenever
 * `refresh()` is called (the partner's "turn" audio message). Duplicates are dropped by `seq`.
 * `onArrive` hears about turns that arrive after the first load, including your own sent turns.
 */
export function useTypedTurns(roomId: string, options: { announce(seq: number): void; onArrive(turn: TypedTurn): void }) {
  const [turns, setTurns] = useState<TypedTurn[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const [tick, setTick] = useState(0);
  const known = useRef<TypedTurn[]>([]);
  const loaded = useRef(false);
  const callbacks = useRef(options);
  callbacks.current = options;

  const merge = useCallback((incoming: TypedTurn[], initial: boolean) => {
    const fresh = incoming.filter(turn => !known.current.some(seen => seen.seq === turn.seq));
    if (fresh.length === 0) return;
    known.current = [...known.current, ...fresh].sort((a, b) => a.seq - b.seq);
    setTurns(known.current);
    if (!initial) fresh.forEach(turn => callbacks.current.onArrive(turn));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const initial = !loaded.current;
    listTurns(roomId, known.current.at(-1)?.seq ?? 0, controller.signal)
      .then(list => { loaded.current = true; merge(list, initial); }, () => {});
    const timer = window.setTimeout(() => setTick(value => value + 1), pollEveryMs);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [roomId, tick, merge]);

  const refresh = useCallback(() => setTick(value => value + 1), []);

  /** Sends a turn. Resolves true when it was saved; on failure the caller keeps the words. */
  const send = useCallback(async (text: string) => {
    setSending(true);
    setError(undefined);
    try {
      const turn = await sendTurn(roomId, text, new AbortController().signal);
      merge([turn], false);
      callbacks.current.announce(turn.seq);
      return true;
    } catch {
      setError('Your turn was not sent. Try again.');
      return false;
    } finally {
      setSending(false);
    }
  }, [roomId, merge]);

  return { turns, send, sending, error, refresh };
}
