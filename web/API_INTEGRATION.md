# FG-01 backend integration guide

For the backend engineer implementing accounts in `api/`. The frontend already
calls every endpoint below. Today `api/` only has `/health`, so all of them fail.

[API_CONTRACT.md](API_CONTRACT.md) covers the first six endpoints (register,
login, verification and reset) and the shared field rules. This guide adds
the rest of FG-01 and the rules that tie them together. The source of truth for
what the frontend accepts is `src/auth/contracts.ts` and `src/auth/api.ts`.

## 1. Connection

- Prefix: `/api/v1`. The frontend reads `VITE_API_BASE_URL` (repo-root `.env`),
  default `/api/v1` on the same origin.
- Every request sends `Accept: application/json`, `X-DebateSpeak-Client: web`
  and `credentials: include`. Requests with a body also send
  `Content-Type: application/json`.
- CORS for a separate origin: allow the exact frontend origin (no `*`),
  credentials, methods `GET, POST, PATCH, DELETE`, and headers `Content-Type`,
  `Authorization`, `X-DebateSpeak-Client`. The current `api/app/main.py`
  combines `allow_origins=["*"]` with `allow_credentials=True`; replace that.
- The frontend times out after 15 seconds.

## 2. Integration map

What has to be built, and where the frontend already calls it. "Status" is
the backend status on 2026-11-14. Frontend paths are relative to `web/src/`.
Backend paths follow the layout in §7; none of them exist yet.

### Endpoints

| # | Endpoint | Frontend function (`auth/api.ts`) | Called from (screen) | Backend file to create | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | `POST /auth/register` | `register()` | `pages/AccountPages.tsx` → `RegisterPage` (`#/register`) | `api/app/auth/router.py` | Missing |
| 2 | `POST /auth/login` | `login()` | `pages/AccountPages.tsx` → `SignInPage` (`#/sign-in`) | `api/app/auth/router.py` | Missing |
| 3 | `POST /auth/forgot-password` | `recoverAccount('forgot-password')` | `pages/RecoveryPage.tsx` (`#/forgot-password`) | `api/app/auth/router.py` | Missing |
| 4 | `POST /auth/resend-verification` | `recoverAccount('resend-verification')` | `pages/RecoveryPage.tsx` (`#/verify-email`) | `api/app/auth/router.py` | Missing |
| 5 | `POST /auth/verify-email` | `recoverAccount('verify-email')` | `pages/RecoveryPage.tsx` (`#/verify-email`) | `api/app/auth/router.py` | Missing |
| 6 | `POST /auth/reset-password` | `recoverAccount('reset-password')` | `pages/RecoveryPage.tsx` (`#/reset-password`) | `api/app/auth/router.py` | Missing |
| 7 | `POST /auth/refresh` | `refresh()` | `App.tsx` → `restoreOnce()` on page load, and the token-expiry handler | `api/app/auth/router.py` | Missing |
| 8 | `POST /auth/logout` | `logout()` | `App.tsx` → `signOut()` (header, Profile, Sessions "Sign out here") | `api/app/auth/router.py` | Missing |
| 9 | `GET /users/me` | `getProfile()` | `pages/AccountPages.tsx` → `SignedInProfile` (`#/profile`) | `api/app/users/router.py` | Missing |
| 10 | `PATCH /users/me` | `updateProfile()` | `pages/AccountPages.tsx` → `SignedInProfile` (`#/profile`) | `api/app/users/router.py` | Missing |
| 11 | `DELETE /users/me` | `deleteAccount()` | `pages/AccountSettingsPages.tsx` → `DeleteAccountPage` (`#/account/delete`) | `api/app/users/router.py` | Missing |
| 12 | `GET /auth/sessions` | `listSessions()` | `pages/AccountSettingsPages.tsx` → `SessionsPage` (`#/account/sessions`) | `api/app/auth/router.py` | Missing |
| 13 | `DELETE /auth/sessions/{id}` | `revokeSession()` | `pages/AccountSettingsPages.tsx` → `SessionsPage` (`#/account/sessions`) | `api/app/auth/router.py` | Missing |
| 14 | `GET /admin/users?email=` | `findUser()` | `pages/AdminPage.tsx` → `AdminUsersPage` (`#/admin/users`) | `api/app/admin/router.py` | Missing |
| 15 | `POST /admin/users/{id}/suspend` | `setSuspended(id, true, reason)` | `pages/AdminPage.tsx` → `AdminUsersPage` (`#/admin/users`) | `api/app/admin/router.py` | Missing |
| 16 | `POST /admin/users/{id}/reactivate` | `setSuspended(id, false)` | `pages/AdminPage.tsx` → `AdminUsersPage` (`#/admin/users`) | `api/app/admin/router.py` | Missing |

Response shapes the frontend validates are the type guards in
`auth/contracts.ts`: `isUserResponse`, `isTokenResponse`, `isProfileResponse`,
`isSessionList` and `isAdminUser`. If a response fails these, the screen shows
"unexpected response" and nothing is saved in the UI.

### Shared backend pieces

| Piece | Used by | Backend path | Status |
| --- | --- | --- | --- |
| Mount routers under `settings.API_V1_PREFIX` (`/api/v1`) | all | `api/app/main.py` | Only `/health` is mounted |
| CORS: exact frontend origin (`FRONTEND_URL`), credentials on | all | `api/app/main.py` | Wrong: uses `*` with credentials |
| `get_current_user` (Bearer JWT → user, rejects suspended/deleted) | #9–16 | `api/app/auth/deps.py` | Missing |
| `require_admin` | #14–16 | `api/app/auth/deps.py` | Missing |
| Client-header and Origin check for cookie endpoints | #7, #8, #12 | `api/app/auth/deps.py` | Missing |
| Argon2id hashing, JWT signing, refresh rotation, code hashing | #1–8 | `api/app/auth/service.py` | Missing |
| Email sending for codes | #3, #4 | adapter under `api/app/adapters/` | Missing |
| Rate limiting (Redis) | #1–6, #11 | `api/app/auth/service.py` or middleware | Missing |
| Hard-delete job after 7 days (ARQ) | #11 | worker task | Missing |
| Models and Alembic migrations (§6) | all | `api/app/models/`, `api/alembic/` | Missing (only `alembic.ini`) |

### Configuration

| Variable | Where | Note |
| --- | --- | --- |
| `VITE_API_BASE_URL` | repo-root `.env`, read by `web/` | e.g. `http://localhost:8000/api/v1`. Restart Vite after changing it. |
| `FRONTEND_URL` | repo-root `.env`, for the API's CORS | The exact web origin, e.g. `http://localhost:5173`. Not read by `config.py` yet. |
| JWT secret | `api/app/config.py` reads `SECRET_KEY`; `.env.example` names it `JWT_SECRET` | **Mismatch.** Pick one name. Also remove the hardcoded default secret in `config.py` so a missing value fails at startup. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `config.py` default 15, `.env.example` 30 | **Mismatch.** Architecture says 15. The frontend just uses `expires_in`. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | both: 7 | Refresh cookie lifetime. |
| `DATABASE_URL`, `REDIS_URL` | both | Already defined. |
| Email provider settings | not defined | Add placeholders to `.env.example` when the email adapter is chosen. |

## 3. Tokens and sessions

| Token | Where it lives | Lifetime |
| --- | --- | --- |
| Access JWT | Response body only. The frontend keeps it in memory and sends `Authorization: Bearer <token>`. | `expires_in` seconds (spec: 15 min) |
| Refresh token | `HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth` cookie. The frontend never reads it. | Your choice (e.g. 14 days) |

- **Login** returns the access token and sets the refresh cookie.
- **Page load** calls `POST /auth/refresh` exactly once. 200 restores the
  session; any error means signed out, and the frontend shows nothing.
- **Access-token expiry** calls `/auth/refresh` again. If that fails, the
  user sees "Your session expired".
- **Any 401 on a Bearer request** ends the frontend session immediately. Do
  not use 401 for "wrong password" on signed-in endpoints (see delete account).
- **Rotation:** each refresh consumes the old token and issues a new one
  (`auth_refresh_tokens`, SOFTWARE_ARCHITECTURE_SPEC §13). Allow a short reuse
  grace window (about 10 s) before treating reuse as theft. Two tabs reloading
  together will otherwise revoke the family and sign the user out.
- **CSRF:** cookie-authenticated endpoints (`/auth/refresh`, `/auth/logout`)
  must reject requests without `X-DebateSpeak-Client: web` or from an
  unexpected `Origin`.
- One **session** in the UI = one refresh-token family.

## 4. Endpoints

All paths are under the prefix. "Bearer" means a valid access token is required.

| Method & path | Auth | Request body | Success | Errors the UI handles |
| --- | --- | --- | --- | --- |
| `POST /auth/register` | none | see API_CONTRACT | 201 User | 409, 422, 429 |
| `POST /auth/login` | none | `email`, `password` | 200 Login | 401, 403 suspended, 422, 429 |
| `POST /auth/forgot-password` | none | `email` | 202 `{"status":"accepted"}` | 422, 429 |
| `POST /auth/resend-verification` | none | `email` | 202 `{"status":"accepted"}` | 422, 429 |
| `POST /auth/verify-email` | none | `email`, `code` | 200 `{"status":"verified"}` | 400/401/410, 422, 429 |
| `POST /auth/reset-password` | none | `email`, `code`, `password` | 200 `{"status":"reset"}` | 400/401/410, 422, 429 |
| `POST /auth/refresh` | refresh cookie | none | 200 Login, new cookie | 401 (no or invalid cookie) |
| `POST /auth/logout` | refresh cookie | none | **204**, cookie cleared | Must be idempotent: 204 even with no cookie |
| `GET /users/me` | Bearer | none | 200 Profile | 401 |
| `PATCH /users/me` | Bearer | any of `display_name`, `native_language`, `goals`, `cefr_level` | 200 Profile | 401, 422 |
| `DELETE /users/me` | Bearer | `{"password": "..."}` | **202** `{"status":"scheduled"}` | **403** wrong password, 401, 429 |
| `GET /auth/sessions` | Bearer + refresh cookie | none | 200 `{"sessions":[Session]}` | 401 |
| `DELETE /auth/sessions/{id}` | Bearer | none | **204** | 401, 404 (already ended) |
| `GET /admin/users?email=` | Bearer, ADMIN | none | 200 AdminUser | 401, 403, 404 |
| `POST /admin/users/{id}/suspend` | Bearer, ADMIN | `{"reason": "..."}` | 200 AdminUser | 401, 403, 404, 422 |
| `POST /admin/users/{id}/reactivate` | Bearer, ADMIN | none | 200 AdminUser | 401, 403, 404 |

The frontend checks the **exact** success status. A 200 where 204 or 202 is
expected is shown as "unexpected response".

### Login response (also returned by `/auth/refresh`)

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "d817b684-08e9-49c0-806a-a045fb7f060c",
    "email": "learner@example.com",
    "display_name": "Linh",
    "cefr_level": "B1",
    "created_at": "2026-11-14T08:00:00Z",
    "role": "LEARNER"
  }
}
```

`role` is `LEARNER` or `ADMIN`. It is optional (missing means learner), but
send it: admins only see "Manage accounts" when it is `ADMIN`.

### Profile (`GET` / `PATCH /users/me`)

The User object plus:

```json
{ "native_language": "Vietnamese", "goals": ["Reduce filler words", "Improve rebuttal structure"] }
```

- `native_language`: `null` or 1–64 characters.
- `goals`: array of 0–5 strings, each 1–120 characters. Never `null`.
- PATCH: the frontend currently sends all four fields, trimmed, with empty goal
  lines removed and `native_language: null` when blank. Treat it as a partial
  update anyway. Email and role are not editable here; reject them with 422.

### Session (`GET /auth/sessions`)

```json
{ "sessions": [
  { "id": "uuid", "created_at": "2026-11-14T08:00:00Z", "last_used_at": "2026-11-14T09:00:00Z",
    "device": "Chrome on Windows", "current": true }
] }
```

- `id` is the refresh family id (UUID). `device` is `null` or up to 120
  characters, derived from User-Agent at login. Never return the raw
  User-Agent or IP address.
- `current` is true for the family of the refresh cookie on this request.
- Revoking the current session from the API is allowed, but the UI uses
  `/auth/logout` for it.

### AdminUser

```json
{ "id": "uuid", "email": "other@example.com", "display_name": "Minh",
  "role": "LEARNER", "is_suspended": false, "created_at": "2026-11-10T08:00:00Z" }
```

### Errors

Use the shapes in API_CONTRACT.md: `422` with
`{"code":"validation_error","errors":[{"field":"goals","message":"..."}]}` (or
standard FastAPI `detail[].loc`). Field names the UI maps: `email`, `password`,
`display_name`, `cefr_level`, `code`, `native_language`, `goals`, `reason`.
The UI never shows server message text, only its own copy.

Special bodies the UI reads:

| Case | Status | Body |
| --- | --- | --- |
| Login to a suspended account | 403 | `{"code":"account_suspended"}` |
| Wrong password on delete | 403 | anything, e.g. `{"code":"invalid_password"}` |

## 5. Required server behaviour

- **Passwords:** Argon2id. 12–128 Unicode characters, spaces kept.
- **Code requests** (`forgot-password`, `resend-verification`) return the same
  202 for known and unknown emails. Never reveal account existence.
- **Password reset** revokes every refresh family for that user.
- **Logout** revokes the current family and clears the cookie (`Max-Age=0`,
  same `Path`).
- **Delete account:** verify the password, set `users.deleted_at`, revoke all
  families, return 202. Hard-delete the user and all transcripts, analyses and
  reports within 7 days (FR-04, e.g. an ARQ job). Deleted users cannot log in.
- **Suspend:** check `role = ADMIN` on the server (never trust the frontend),
  set `is_suspended`, revoke all families, write an audit row (admin id, target
  id, reason, time). Login then returns 403 `account_suspended`; refresh
  returns 401. Admins must not be able to suspend themselves.
- **Reactivate:** clear `is_suspended`, audit it. No sessions are restored.
- **Rate limits (429):** login, register, code requests, reset, verify and
  delete account.
- **Secrets:** JWT secret and database URL come from `.env`; add placeholders to
  `.env.example` only.

## 6. Data model changes

Existing in the architecture spec (§13): `users`, `user_profiles`,
`auth_refresh_tokens`. Still needed:

- A way to list sessions with `device` and `last_used_at`. Either add those
  columns for the family (simplest: an `auth_sessions` table keyed by
  `family_id`), or store them on the family's first token row.
- `account_suspensions (id, user_id, admin_id, reason, created_at, lifted_at)`
  for the audit trail.
- Email verification and reset codes: store only hashes, with expiry, purpose
  (`verify` or `reset`) and `consumed_at`. A verification code must never
  pass as a reset code.

## 7. Suggested FastAPI layout

Matches AGENTS.md (FastAPI, SQLAlchemy 2 async, Alembic):

```text
api/app/auth/router.py      /auth/* (register, login, refresh, logout, codes, sessions)
api/app/auth/service.py     hashing, JWT, refresh rotation, codes
api/app/auth/deps.py        get_current_user, require_admin
api/app/users/router.py     /users/me GET, PATCH, DELETE
api/app/admin/router.py     /admin/users ...
api/app/models/             SQLAlchemy models; migrations in api/alembic/
```

Mount every router under `/api/v1` in `api/app/main.py`.

## 8. Checking your backend against the frontend

1. Start the API, set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in the
   repo-root `.env`, and run `npm run dev` in `web/`.
2. Walk through: register → verify email → sign in → reload (still signed in)
   → Account → edit and save profile → Active sessions (sign in in a second
   browser, revoke it there) → Sign out → sign in → Delete account.
3. Make an account `ADMIN` in the database, open Account → Manage accounts,
   suspend the second account, confirm it cannot sign in, then reactivate it.
4. Browser DevTools: no tokens in `localStorage`, `sessionStorage`, URLs or
   readable cookies; the refresh cookie is `HttpOnly`.
5. The exact request bodies and responses the UI expects are in
   `tests/auth.spec.ts`, `tests/recovery.spec.ts` and
   `tests/account-management.spec.ts`. These tests mock the API, so a green run
   does not prove your backend works; step 2 does.

Record results in [quickstart.md](../specs/001-frontend-baseline/quickstart.md).
