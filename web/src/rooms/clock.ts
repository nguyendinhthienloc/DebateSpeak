import type { RoomSnapshot, Side } from './contracts';

/** Debate timing. Pure functions: no DOM, no React. Times are server time in milliseconds. */
export interface Phase { label: string; side: Side | null; seconds: number }

/** Timed turns, architecture spec section 6.4: 390 seconds in all. */
export const timedPhases: Phase[] = [
  { label: 'Opening', side: 'FOR', seconds: 60 },
  { label: 'Opening', side: 'AGAINST', seconds: 60 },
  { label: 'Rebuttal', side: 'FOR', seconds: 45 },
  { label: 'Rebuttal', side: 'AGAINST', seconds: 45 },
  { label: 'Cross-talk', side: null, seconds: 120 },
  { label: 'Closing', side: 'FOR', seconds: 30 },
  { label: 'Closing', side: 'AGAINST', seconds: 30 },
];

/** Add this to the client clock to get server time. */
export function serverOffsetMs(room: RoomSnapshot, clientNowMs: number): number {
  return Date.parse(room.server_now) - clientNowMs;
}

/** Whole seconds of debate left, from the shared start time. */
export function secondsLeft(room: RoomSnapshot, serverNowMs: number): number {
  if (!room.started_at) return room.duration_seconds;
  const remaining = Date.parse(room.started_at) + room.duration_seconds * 1000 - serverNowMs;
  return Math.min(room.duration_seconds, Math.max(0, Math.ceil(remaining / 1000)));
}

/** Whole seconds until the shared start time; 0 once the debate has started. */
export function countdownLeft(room: RoomSnapshot, serverNowMs: number): number {
  if (!room.started_at) return 0;
  return Math.max(0, Math.ceil((Date.parse(room.started_at) - serverNowMs) / 1000));
}

export function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}

/** The phase running after `elapsedSeconds`, and the seconds left in it. Undefined once all phases are over. */
export function phaseAt(elapsedSeconds: number): { phase: Phase; turnLeft: number } | undefined {
  let start = 0;
  for (const phase of timedPhases) {
    if (elapsedSeconds < start + phase.seconds) return { phase, turnLeft: start + phase.seconds - Math.max(elapsedSeconds, start) };
    start += phase.seconds;
  }
  return undefined;
}
