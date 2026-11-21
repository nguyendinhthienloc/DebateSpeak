/** Who the debate stage spotlights. Pure functions: no DOM, no React. */
export interface SpotlightState {
  mode: 'idle' | 'speaking' | 'both' | 'quiet' | 'typed';
  ids: string[];
  text?: string;
  changedAt: number;
}

export type SpotlightEvent = { type: 'speakers'; ids: string[] } | { type: 'typed'; id: string; text: string };

const speakerHoldMs = 1200;
const typedHoldMs = 6000;

export const initialSpotlight: SpotlightState = { mode: 'idle', ids: [], changedAt: 0 };

const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every(id => b.includes(id));

/**
 * A speaker holds the spotlight for at least 1.2 s so names don't flicker; two speakers share it;
 * silence keeps the last speaker as "quiet"; a typed turn takes it at once and holds for 6 s against speech.
 */
export function nextSpotlight(state: SpotlightState, event: SpotlightEvent, nowMs: number): SpotlightState {
  if (event.type === 'typed') return { mode: 'typed', ids: [event.id], text: event.text, changedAt: nowMs };

  const held = (state.mode === 'typed' && nowMs - state.changedAt < typedHoldMs)
    || ((state.mode === 'speaking' || state.mode === 'both') && nowMs - state.changedAt < speakerHoldMs);
  if (held) return state;

  if (event.ids.length === 0) {
    return state.ids.length > 0 && state.mode !== 'quiet' ? { mode: 'quiet', ids: state.ids, changedAt: nowMs } : state;
  }
  const mode = event.ids.length > 1 ? 'both' : 'speaking';
  if (state.mode === mode && sameIds(state.ids, event.ids)) return state;
  return { mode, ids: [...event.ids], changedAt: nowMs };
}
