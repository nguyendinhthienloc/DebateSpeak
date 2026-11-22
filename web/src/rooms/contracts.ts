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

export interface Topic {
  id: string;
  motion: string;
  category: string;
  cefr_level: string;
}

export interface CreateRoomInput {
  topic_id: string;
  format: RoomFormat;
  duration_minutes: number;
  side: Side | 'RANDOM';
}

function isTopic(value: unknown): value is Topic {
  return isRecord(value) && typeof value.id === 'string' && typeof value.motion === 'string'
    && typeof value.category === 'string' && typeof value.cefr_level === 'string';
}

export function isTopicList(value: unknown): value is { topics: Topic[] } {
  return isRecord(value) && Array.isArray(value.topics) && value.topics.every(isTopic);
}

/** What an invite code shows before joining. `room_id` is set only when the caller is already seated. */
export interface RoomPreview {
  room_id: string | null;
  motion: string;
  creator_name: string;
  format: RoomFormat;
  duration_seconds: number;
  stance_mode: 'RANDOM' | 'CREATOR_PICKS';
}

export function isRoomPreview(value: unknown): value is RoomPreview {
  return isRecord(value) && typeof value.motion === 'string' && typeof value.creator_name === 'string';
}

export interface MediaToken { token: string; url: string }

export function isMediaToken(value: unknown): value is MediaToken {
  return isRecord(value) && typeof value.token === 'string' && typeof value.url === 'string';
}
