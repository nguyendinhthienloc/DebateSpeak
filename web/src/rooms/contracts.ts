/** Frontend view of the room API in docs/superpowers/specs/2026-11-19-room-flow-design.md. */
export const roomStatuses = ['LOBBY', 'READY', 'LIVE', 'ENDED', 'CANCELLED'] as const;
export type RoomStatus = typeof roomStatuses[number];
export type Side = 'FOR' | 'AGAINST';
export type InputMode = 'VOICE' | 'TYPE';
export type EndReason = 'MANUAL' | 'TIMER' | 'DISCONNECT' | 'CANCELLED' | 'EXPIRED';
export type RoomFormat = 'FREE_FLOW' | 'TIMED_TURNS';

export interface Participant {
  user_id: string;
  display_name: string;
  side: Side | null;
  is_creator: boolean;
  ready: boolean;
  input: InputMode | null;
}

export interface RoomSnapshot {
  id: string;
  code: string | null;
  status: RoomStatus;
  motion: string;
  format: RoomFormat;
  duration_seconds: number;
  expires_at: string;
  started_at: string | null;
  ended_at: string | null;
  end_reason: EndReason | null;
  ended_by: string | null;
  server_now: string;
  participants: Participant[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function isParticipant(value: unknown): value is Participant {
  return isRecord(value) && typeof value.user_id === 'string' && typeof value.display_name === 'string'
    && typeof value.is_creator === 'boolean' && typeof value.ready === 'boolean';
}

export function isRoomSnapshot(value: unknown): value is RoomSnapshot {
  return isRecord(value) && typeof value.id === 'string' && typeof value.motion === 'string'
    && roomStatuses.includes(value.status as RoomStatus)
    && Array.isArray(value.participants) && value.participants.every(isParticipant);
}
