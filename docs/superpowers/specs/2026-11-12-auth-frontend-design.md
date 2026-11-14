# Sign-up and sign-in frontend

Date: 2026-11-12. Status: user approved; frontend implemented and verified. Mode: Operate.

## Intent and scope

Turn the existing registration and sign-in screens into API-ready forms using
the repository's Cream & Yellow design. The user clarified that API and database
completion is not required. Deliver the frontend integration boundary, not a
claim that backend authentication or the complete FG-01 increment is finished.

Preserve Vite, React, TypeScript, Tailwind, hash routes, Inter, existing spacing,
password visibility controls, keyboard navigation and responsive layouts.
Room, media, transcription and AI screens remain explicitly marked previews.
No audio consent or microphone permission is requested by authentication.

## Approaches

- **Existing HTTP contract (recommended):** typed client calls the endpoints in
  `docs/architecture/G1_SPEC_BUILD1.md`; browser tests intercept requests. This
  makes the frontend usable with a conforming backend without implementing it.
- Runtime fake accounts: permits an offline demo but does not establish API
  integration and risks presenting fabricated account creation as real.
- Full-stack auth now: a larger increment with migrations and persistence,
  beyond the user's clarified requirement.

The recommendation follows the existing contract; it does not change backend
ownership or imply that its endpoints exist.

## HTTP boundary

Use `VITE_API_BASE_URL` as the complete API prefix, default `/api/v1`. Add an empty
placeholder to root `.env.example` and load the repo-root environment through
Vite. Support a same-origin reverse proxy or an explicitly configured API URL;
document trusted-origin credentialed CORS requirements for separate origins.

All auth calls send JSON, `X-DebateSpeak-Client: web`, `credentials: include`,
and `cache: no-store`. Browser code does not manufacture an Origin header.
No logging of credentials or response tokens. Bound requests to 15 seconds,
cancel on navigation, and never automatically retry account mutations.

| Operation | Request | Valid success |
| --- | --- | --- |
| `POST /auth/register` | `email`, `password`, optional `display_name`, `cefr_level` | 201 `UserResponse`; go to sign-in with a transient confirmation |
| `POST /auth/login` | `email`, `password` | 200 `TokenResponse`; retain session in memory and go to rooms |

`UserResponse`: `id`, `email`, `display_name`, `cefr_level`, `created_at`.
`TokenResponse`: `access_token`, `token_type: bearer`, positive `expires_in`,
`user: UserResponse`. Runtime-check success payloads before showing success.
Do not decode a token to invent user data or treat malformed responses as login.

Use the G1 problem-JSON contract (`code`, `detail`, optional
`errors: [{field, message}]`) and tolerate FastAPI's standard 422 validation array
without displaying submitted values. Translate known errors into safe UI copy.

## Form behavior

- Real semantic forms submit by button or Enter. Password managers use
  `username`, `current-password` and `new-password` autocomplete values.
- Email is trimmed, syntax-checked and at most 254 characters; do not rewrite
  provider-specific aliases. Passwords are 12–128 Unicode characters and never
  trimmed, normalized or silently truncated. No composition requirements.
- Optional display name is trimmed, at most 80 characters and omitted when
  blank so the backend supplies `Learner`. CEFR is A2/B1/B2/C1, default B1.
- Show accessible inline errors, focus the first invalid field, preserve inputs
  during recoverable failures, and disable submission while pending.
- Handle invalid credentials (401), rejected origin (403), duplicate email (409),
  validation (422), throttling (429), unavailable service, network failure,
  timeout and malformed success. Failure never navigates to a success screen.
- Account-created confirmation comes only from successful registration in this
  runtime; directly visiting the hash must not claim an account was created.
- Keep access tokens only in runtime memory, with expiry handling and a small
  typed session interface for later authenticated API requests. Never place
  passwords or tokens in browser storage, URLs, analytics or logs.
- Reload clears the session and requires sign-in in this scoped frontend.
  Refresh rotation and server logout remain separate backend integration work;
  no persistent-session or server-revocation guarantee is made here.
- Rooms remain browsable design examples. Show the authenticated identity after
  login without implying real room access control or persistence.

## Acceptance and verification

HTTP recovery copy distinguishes 400 invalid request, 401 invalid credentials,
403 denied account access, 404 missing account service, 405 unsupported action,
408/504 timeout, 409 duplicate registration or conflicting account state, 422
field validation, 429 throttling, 500 server error, and 502/503 temporary service
unavailability. Unknown HTTP errors use safe generic failure copy. A 422 without
recognized field identifiers must not refer to nonexistent highlighted fields.
HTTP errors with non-JSON bodies still map by status; raw bodies are never shown.
Network failures and malformed successful responses retain distinct messages.

Playwright request-interception tests verify exact request bodies/headers,
registration-to-login-to-rooms, session identity, password handling, validation,
duplicate/pending submissions, HTTP/network errors, cancellation, malformed
responses, expiry and absence of stored credentials. Existing room-preview,
history, focus, password visibility and responsive tests remain meaningful.

Run frontend build, lint and browser tests. Inspect rendered auth screens at
mobile and desktop sizes. Report these as frontend contract tests, not evidence
of a real database write, JWT verification or backend security.

## Implementation boundaries

Create focused API types/client and session modules under `web/src/`. Reuse the
shared controls with additive error/pending support. Modify account pages and
the app shell's identity/preview notices, update tests and `web/README.md` with
the integration contract and setup. Update the architecture specification and
project proposal before product-code edits, as required by `AGENTS.md`.

## Verification result

Production build and lint passed. All 65 Playwright browser tests passed with
intercepted API responses, including the fresh review's malformed-user-payload
regressions. A separate browser smoke check confirmed a nondefault API prefix.
Mobile/desktop screenshots were inspected at 390px and 1102px; route reflow tests
also covered 320px and 1440px. No auth horizontal overflow was observed; inputs
render at 16px. The design detector reported only its generic Inter warning;
Inter is the explicitly approved typography and was retained.

Backend persistence, password hashing, JWT verification, refresh/logout and
complete FG-01 acceptance have not been verified by this frontend deliverable.

Error-message follow-up (2026-11-12): six targeted regressions failed against the
old generic message before implementation. After status-specific recovery copy
and a 422 fallback were added, build, lint and all 65 browser tests passed,
including non-JSON error pages, unreachable services and local/server timeouts.
