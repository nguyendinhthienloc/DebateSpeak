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

export interface UserResponse {
  id: string;
  email: string;
  display_name: string;
  cefr_level: CefrLevel;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: UserResponse;
}

export type AuthField = 'email' | 'password' | 'display_name' | 'cefr_level';
export type FieldErrors = Partial<Record<AuthField, string>>;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

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
    && typeof value.id === 'string'
    && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value.id)
    && isEmail(value.email)
    && typeof value.display_name === 'string' && value.display_name.trim().length > 0
    && [...value.display_name].length <= 80
    && cefrLevels.includes(value.cefr_level as CefrLevel)
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
