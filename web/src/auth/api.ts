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
  code: 'Check the code from your email and try again.',
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

async function post<T>(path: string, body: object, status: number,
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

export type RecoveryAction = 'forgot-password' | 'resend-verification' | 'verify-email' | 'reset-password';
type RecoveryInput = {
  'forgot-password': { email: string };
  'resend-verification': { email: string };
  'verify-email': { email: string; code: string };
  'reset-password': { email: string; code: string; password: string };
};

export function recoverAccount<A extends RecoveryAction>(action: A, input: RecoveryInput[A], signal: AbortSignal) {
  const expected = action === 'verify-email' ? 'verified' : action === 'reset-password' ? 'reset' : 'accepted';
  return post(`/auth/${action}`, input, expected === 'accepted' ? 202 : 200,
    (value): value is { status: string } => isRecord(value) && value.status === expected, signal);
}
