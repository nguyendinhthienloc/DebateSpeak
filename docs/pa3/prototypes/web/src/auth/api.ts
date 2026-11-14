import { isAdminUser, isProfileResponse, isRecord, isSessionList, isTokenResponse, isUserResponse } from './contracts';
import type {
  ActiveSession, AdminUser, AuthField, Credentials, FieldErrors, ProfileResponse, ProfileUpdate, Registration,
  TokenResponse, UserResponse,
} from './contracts';
import { clearSession, getAccessToken } from './session';

const baseUrl = (import.meta.env.VITE_API_BASE_URL?.trim() || '/api/v1').replace(/\/+$/, '');
const unexpectedResponse = 'The account service returned an unexpected response. Try again or contact the team.';

export class AuthApiError extends Error {
  constructor(message: string, public readonly fields: FieldErrors = {}) {
    super(message);
    this.name = 'AuthApiError';
  }
}

const fieldMessages: Record<AuthField, string> = {
  email: 'Check this email address and try again.',
  password: 'Check your password and try again.',
  display_name: 'Check your display name (up to 80 characters).',
  cefr_level: 'Choose A2, B1, B2 or C1.',
  code: 'Check the code from your email and try again.',
  native_language: 'Check your native language (up to 64 characters).',
  goals: 'Use up to 5 goals of up to 120 characters each.',
  reason: 'Give a reason of up to 500 characters.',
};

function validationFields(body: unknown): FieldErrors {
  const errors: FieldErrors = {};
  if (!isRecord(body)) return errors;
  const issues = Array.isArray(body.errors) ? body.errors : Array.isArray(body.detail) ? body.detail : [];
  for (const issue of issues) {
    if (!isRecord(issue)) continue;
    const field = typeof issue.field === 'string' ? issue.field
      : Array.isArray(issue.loc) ? issue.loc[issue.loc.length - 1] : undefined;
    if (typeof field === 'string' && Object.prototype.hasOwnProperty.call(fieldMessages, field)) {
      // Map only known field identifiers; never display raw server messages/input.
      errors[field as AuthField] = fieldMessages[field as AuthField];
    }
  }
  return errors;
}

function responseError(status: number, body: unknown, path: string, method: string): AuthApiError {
  if (status === 403 && path === '/auth/login' && isRecord(body) && body.code === 'account_suspended') {
    return new AuthApiError('This account is suspended. Contact the team if you think this is a mistake.');
  }
  if (status === 403 && path === '/users/me' && method === 'DELETE') {
    return new AuthApiError('Password is incorrect. Your account was not deleted.', { password: 'Check your password and try again.' });
  }
  if (status === 403 && path.startsWith('/admin/')) {
    return new AuthApiError('Only administrators can do this.');
  }
  if (status === 404 && path.startsWith('/admin/users?')) {
    return new AuthApiError('No account uses this email.', { email: 'No account uses this email.' });
  }
  if (status === 404 && path.startsWith('/auth/sessions/')) {
    return new AuthApiError('This session has already ended. Refresh the list.');
  }
  if (['/auth/verify-email', '/auth/reset-password'].includes(path) && [400, 401, 410].includes(status)) {
    return new AuthApiError('This code is invalid or has expired. Request a new code and try again.', {
      code: 'Use the latest code sent to your email.',
    });
  }
  if (status === 422) {
    const fields = validationFields(body);
    return new AuthApiError(Object.keys(fields).length
      ? 'Check the highlighted fields and try again.'
      : 'The account service could not validate your details. Check them and try again.', fields);
  }
  if (status === 409 && path === '/auth/register') {
    return new AuthApiError('An account already uses this email. Sign in or use another address.', {
      email: 'An account already uses this email.',
    });
  }
  const messages: Partial<Record<number, string>> = {
    400: 'The request could not be accepted. Check your details and try again.',
    401: 'Email or password is incorrect.',
    403: 'Account access is not allowed from this site. Contact the team if this continues.',
    404: 'The account service could not be found. Contact the team.',
    405: 'The account service does not support this action. Contact the team.',
    408: 'The request timed out. Try again.',
    409: 'This request conflicts with the current account state. Try again.',
    429: 'Too many attempts. Wait a moment before trying again.',
    500: 'The account service encountered an error. Try again in a moment.',
    502: 'The account service is temporarily unavailable. Try again in a moment.',
    503: 'The account service is temporarily unavailable. Try again in a moment.',
    504: 'The request timed out. Try again.',
  };
  return new AuthApiError(messages[status] ?? 'The request could not be completed. Try again or contact the team.');
}

interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  status: number;
  valid: (value: unknown) => value is T;
  /** Send the in-memory access token. A 401 then ends the session. */
  auth?: boolean;
}

const sessionExpired = 'Your session expired. Sign in again.';
const noBody = (value: unknown): value is null => value === null;

async function request<T>(path: string, { method = 'POST', body, status, valid, auth = false }: RequestOptions<T>,
  signal: AbortSignal): Promise<T> {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  headers.Accept = 'application/json';
  headers['X-DebateSpeak-Client'] = 'web';
  if (auth) {
    const token = getAccessToken();
    if (!token) throw new AuthApiError(sessionExpired);
    headers.Authorization = `Bearer ${token}`;
  }
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  if (signal.aborted) cancel();
  let timedOut = false;
  const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 15_000);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method, credentials: 'include', cache: 'no-store', signal: controller.signal, headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const payload: unknown = await response.json().catch(() => null);
    if (signal.aborted) throw new DOMException('Request cancelled', 'AbortError');
    if (timedOut) throw new AuthApiError('The request timed out. Try again.');
    if (auth && response.status === 401) {
      clearSession(true);
      throw new AuthApiError(sessionExpired);
    }
    if (!response.ok) throw responseError(response.status, payload, path, method);
    if (response.status !== status || !valid(payload)) throw new AuthApiError(unexpectedResponse);
    return payload;
  } catch (error) {
    if (signal.aborted) throw new DOMException('Request cancelled', 'AbortError');
    if (timedOut) throw new AuthApiError('The request timed out. Try again.');
    if (error instanceof AuthApiError) throw error;
    throw new AuthApiError('Could not reach the account service. Check your connection and try again.');
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener('abort', cancel);
  }
}

export function register(input: Registration, signal: AbortSignal): Promise<UserResponse> {
  return request('/auth/register', { body: input, status: 201, valid: isUserResponse }, signal);
}

export function login(input: Credentials, signal: AbortSignal): Promise<TokenResponse> {
  return request('/auth/login', { body: input, status: 200, valid: isTokenResponse }, signal);
}

/** Uses the HttpOnly refresh cookie; the frontend never reads that cookie. */
export function refresh(signal: AbortSignal): Promise<TokenResponse> {
  return request('/auth/refresh', { status: 200, valid: isTokenResponse }, signal);
}

export function logout(signal: AbortSignal): Promise<null> {
  return request('/auth/logout', { status: 204, valid: noBody }, signal);
}

export function getProfile(signal: AbortSignal): Promise<ProfileResponse> {
  return request('/users/me', { method: 'GET', status: 200, valid: isProfileResponse, auth: true }, signal);
}

export function updateProfile(input: ProfileUpdate, signal: AbortSignal): Promise<ProfileResponse> {
  return request('/users/me', { method: 'PATCH', body: input, status: 200, valid: isProfileResponse, auth: true }, signal);
}

export function deleteAccount(password: string, signal: AbortSignal) {
  return request('/users/me', { method: 'DELETE', body: { password }, status: 202, auth: true,
    valid: (value): value is { status: 'scheduled' } => isRecord(value) && value.status === 'scheduled' }, signal);
}

export async function listSessions(signal: AbortSignal): Promise<ActiveSession[]> {
  const result = await request('/auth/sessions', { method: 'GET', status: 200, valid: isSessionList, auth: true }, signal);
  return result.sessions;
}

export function revokeSession(id: string, signal: AbortSignal): Promise<null> {
  return request(`/auth/sessions/${encodeURIComponent(id)}`, { method: 'DELETE', status: 204, valid: noBody, auth: true }, signal);
}

export function findUser(email: string, signal: AbortSignal): Promise<AdminUser> {
  return request(`/admin/users?${new URLSearchParams({ email })}`, { method: 'GET', status: 200, valid: isAdminUser, auth: true }, signal);
}

export function setSuspended(id: string, suspend: boolean, reason: string, signal: AbortSignal): Promise<AdminUser> {
  const path = `/admin/users/${encodeURIComponent(id)}/${suspend ? 'suspend' : 'reactivate'}`;
  return request(path, { ...(suspend ? { body: { reason } } : {}), status: 200, valid: isAdminUser, auth: true }, signal);
}

export type RecoveryAction = 'forgot-password' | 'resend-verification' | 'verify-email' | 'reset-password';
type RecoveryInput = {
  'forgot-password': { email: string };
  'resend-verification': { email: string };
  'verify-email': { email: string; code: string };
  'reset-password': { email: string; code: string; password: string };
};

export function recoverAccount<A extends RecoveryAction>(action: A, input: RecoveryInput[A], signal: AbortSignal) {
  const expected = action === 'verify-email' ? 'verified' : action === 'reset-password' ? 'reset' : 'accepted';
  return request(`/auth/${action}`, { body: input, status: expected === 'accepted' ? 202 : 200,
    valid: (value): value is { status: string } => isRecord(value) && value.status === expected }, signal);
}
