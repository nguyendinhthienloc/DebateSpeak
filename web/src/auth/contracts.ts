/** Frontend subset of docs/architecture/G1_SPEC_BUILD1.md. */
export const cefrLevels = ['A2', 'B1', 'B2', 'C1'] as const;
export type CefrLevel = typeof cefrLevels[number];

export interface Credentials {
  email: string;
  password: string;
}

export interface Registration extends Credentials {
  display_name?: string;
  cefr_level: CefrLevel;
}

export const userRoles = ['LEARNER', 'ADMIN'] as const;
export type UserRole = typeof userRoles[number];

export interface UserResponse {
  id: string;
  email: string;
  display_name: string;
  cefr_level: CefrLevel;
  created_at: string;
  /** Optional until the backend sends it; absence means LEARNER. */
  role?: UserRole;
}

export interface ProfileResponse extends UserResponse {
  native_language: string | null;
  goals: string[];
}

export type ProfileUpdate = Partial<Pick<ProfileResponse, 'display_name' | 'cefr_level' | 'native_language' | 'goals'>>;

export interface ActiveSession {
  id: string;
  created_at: string;
  last_used_at: string;
  device: string | null;
  current: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  is_suspended: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: UserResponse;
}

export type AuthField = 'email' | 'password' | 'display_name' | 'cefr_level' | 'code'
  | 'native_language' | 'goals' | 'reason';
export type FieldErrors = Partial<Record<AuthField, string>>;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const uuidPattern = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const isUuid = (value: unknown): value is string => typeof value === 'string' && uuidPattern.test(value);
const isDisplayName = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0 && [...value].length <= 80;
const isText = (value: unknown, max: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && [...value].length <= max;

function isUtcTimestamp(value: unknown): value is string {
  if (typeof value !== 'string'
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|\+00:00)$/i.test(value)) return false;
  const timestamp = Date.parse(value);
  // Date.parse can normalize impossible dates such as February 30. Reject them.
  return Number.isFinite(timestamp)
    && new Date(timestamp).toISOString().slice(0, 19) === value.slice(0, 19).toUpperCase();
}

export function isUserResponse(value: unknown): value is UserResponse {
  return isRecord(value)
    && isUuid(value.id)
    && isEmail(value.email)
    && isDisplayName(value.display_name)
    && cefrLevels.includes(value.cefr_level as CefrLevel)
    && isUtcTimestamp(value.created_at)
    && (value.role === undefined || userRoles.includes(value.role as UserRole));
}

export function isProfileResponse(value: unknown): value is ProfileResponse {
  return isUserResponse(value) && isRecord(value)
    && (value.native_language === null || isText(value.native_language, 64))
    && Array.isArray(value.goals) && value.goals.length <= 5
    && value.goals.every(goal => isText(goal, 120));
}

function isActiveSession(value: unknown): value is ActiveSession {
  return isRecord(value) && isUuid(value.id)
    && isUtcTimestamp(value.created_at) && isUtcTimestamp(value.last_used_at)
    && (value.device === null || isText(value.device, 120))
    && typeof value.current === 'boolean';
}

export function isSessionList(value: unknown): value is { sessions: ActiveSession[] } {
  return isRecord(value) && Array.isArray(value.sessions) && value.sessions.every(isActiveSession);
}

export function isAdminUser(value: unknown): value is AdminUser {
  return isRecord(value) && isUuid(value.id) && isEmail(value.email)
    && isDisplayName(value.display_name)
    && userRoles.includes(value.role as UserRole)
    && typeof value.is_suspended === 'boolean'
    && isUtcTimestamp(value.created_at);
}

export function isTokenResponse(value: unknown): value is TokenResponse {
  return isRecord(value)
    && typeof value.access_token === 'string' && value.access_token.length > 0
    && !/\s/.test(value.access_token)
    && value.token_type === 'bearer'
    && typeof value.expires_in === 'number' && Number.isFinite(value.expires_in)
    && value.expires_in > 0 && value.expires_in <= 2_147_483
    && isUserResponse(value.user);
}
