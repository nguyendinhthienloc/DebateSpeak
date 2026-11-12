import { isRecord, isTokenResponse, isUserResponse } from './contracts';
import type { AuthField, Credentials, FieldErrors, Registration, TokenResponse, UserResponse } from './contracts';

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

function responseError(status: number, body: unknown, path: string): AuthApiError {
  if (status === 422) return new AuthApiError('Check the highlighted fields and try again.', validationFields(body));
  if (status === 401) return new AuthApiError('Email or password is incorrect.');
  if (status === 403) return new AuthApiError('Sign-in is not allowed from this site. Contact the team if this continues.');
  if (status === 409 && path === '/auth/register') {
    return new AuthApiError('An account already uses this email. Sign in or use another address.', {
      email: 'An account already uses this email.',
    });
  }
  if (status === 429) return new AuthApiError('Too many attempts. Wait a moment before trying again.');
  return new AuthApiError('The account service is unavailable. Try again in a moment.');
}

async function post<T>(path: string, body: Credentials | Registration, status: number,
  valid: (value: unknown) => value is T, signal: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  if (signal.aborted) cancel();
  let timedOut = false;
  const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 15_000);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST', credentials: 'include', cache: 'no-store', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-DebateSpeak-Client': 'web' },
      body: JSON.stringify(body),
    });
    const payload: unknown = await response.json().catch(() => null);
    if (signal.aborted) throw new DOMException('Request cancelled', 'AbortError');
    if (timedOut) throw new AuthApiError('The request timed out. Try again.');
    if (!response.ok) throw responseError(response.status, payload, path);
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
  return post('/auth/register', input, 201, isUserResponse, signal);
}

export function login(input: Credentials, signal: AbortSignal): Promise<TokenResponse> {
  return post('/auth/login', input, 200, isTokenResponse, signal);
}
