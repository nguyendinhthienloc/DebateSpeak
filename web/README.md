# DebateSpeak frontend

Responsive frontend using the Cream & Yellow design system. Sign-up and
sign-in are API-ready forms using the existing G1 contract. The Spring Boot API
(`api/authify`, branch `backend-tai`) implements these endpoints. Profile, sign out, active sessions, account deletion and admin
suspension are API-ready too. Rooms (create, invite, join, agree, the live debate
stage with LiveKit audio, and wrap up) are built against the room API but wait for
its backend; see [Waiting on the backend](#waiting-on-the-backend). Transcription
and AI feedback are not built yet.

## Run

Use Node.js 20 or newer. From `web/`:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The default page is the welcome page; use the
page links or the **Preview screen** selector at the bottom (development only) to
explore every screen. **Create account** and **Sign in** submit to the configured
API. Signed out, Profile is a labelled sample with saving disabled. Room screens
need a signed-in account and the room API.

## Connect the auth API

Use the [short backend handoff](API_CONTRACT.md)
for all six endpoints, request/response examples, validation and errors.
The [Spec Kit baseline](../specs/001-frontend-baseline/spec.md) records current
scope; [tasks](../specs/001-frontend-baseline/tasks.md) distinguish completed
frontend work from remaining integration.

Set `VITE_API_BASE_URL` in the repo-root `.env` and restart Vite. It defaults to
`/api/v1`; include the full API prefix when overriding it. Never put secrets in
`VITE_` variables. See the contract for CORS requirements.

## Routes

Paths follow `/#/` so direct links and reload work on static hosting without
server rewrites. Browser back/forward, page titles and focus follow navigation.

| Hash path | Screen |
| --- | --- |
| `#/sign-in` | Sign in |
| `#/register` | Registration |
| `#/account-created` | Sign-in; confirmation only after a successful registration |
| `#/forgot-password` | Request a reset code |
| `#/reset-password` | Set a new password with an email code |
| `#/verify-email` | Verify email or request a code |
| `#/welcome` | Welcome |
| `#/home` | Home: create, join with a code, topics |
| `#/rooms/new` | Create a room |
| `#/rooms/:id` | One room in every state: invite, agree, live debate, wrap up, closed |
| `#/join/:code` | Invite dialog over Home |
| `#/profile` | Profile (real when signed in, sample otherwise) |
| `#/account/sessions` | Active sessions (signed in) |
| `#/account/delete` | Delete account (signed in) |
| `#/admin/users` | Suspend or reactivate accounts (admins) |

Unknown routes show a recovery page. Shared controls live in `src/components/`,
page families in `src/pages/`, navigation in `src/routes.ts`, and visual tokens in
`src/index.css`. Inter is bundled locally through `@fontsource/inter`.

## Verify

```sh
npm run build
npm run lint
npx playwright install chromium
npm run test:e2e
```

Browser checks intercept only the external HTTP boundary and exercise real forms,
request bodies/options, loading/errors, cancellation, session expiry and absence
of stored credentials. Existing checks cover history/reload, unknown routes,
keyboard controls and all routes at 320/390/1102/1440px. Room tests mock the room
API, the microphone and LiveKit; no microphone is requested before the learner clicks Test.
These tests verify the frontend contract, not database
persistence, password hashing, JWT security or complete FG-01 acceptance.
See [the approved auth scope](../docs/superpowers/specs/2026-11-12-auth-frontend-design.md).

## Frontend workflow and current scope

Frontend development is independent of both historical Figma links. Implement
from `src/`, [DESIGN.md](../DESIGN.md) and [Spec Kit](../specs/README.md), then
verify in the browser. Update Figma only when explicitly requested.

Login, registration and recovery are FG-01. FG-03 room screens follow
[the room flow spec](../docs/superpowers/specs/2026-11-19-room-flow-design.md).
FG-01 account management is frontend-ready; see "Not yet available" below and
[the backend integration guide](API_INTEGRATION.md).

After email verification, Change password opens the password-reset request.
Profile has the same entry point. Request a fresh reset code, enter it with the
new password, then sign in. A verification code cannot substitute for a reset
code. Real email/password changes require the documented backend endpoints.

## Waiting on the backend

The backend (`api/authify`) already has every auth and account endpoint above.
The room endpoints below do not exist yet. The frontend calls them as the
[room flow spec](../docs/superpowers/specs/2026-11-19-room-flow-design.md)
defines them, and its tests mock them. Paths are under `/api/v1`.

| Endpoint | Frontend use | Backend ticket | Frontend |
| --- | --- | --- | --- |
| `GET /topics` | Home topics, Create motion list | SCRUM-60 | Built |
| `POST /rooms` | Create room | SCRUM-60 | Built |
| `GET /rooms/{id}` | Room page, polled every 2 s (5 s live) | SCRUM-60 | Built |
| `POST /rooms/lookup` | Invite dialog: who invited you, terms, errors | SCRUM-60 | Built |
| `POST /rooms/join` | Take the open seat | SCRUM-60 | Built |
| `POST /rooms/{id}/cancel` | Cancel room (creator) | SCRUM-60 | Built |
| `POST /rooms/{id}/leave` | Leave room | SCRUM-60 | Built |
| `PUT /rooms/{id}/ready` | I'm ready, with consent and input | SCRUM-60 | Built |
| `DELETE /rooms/{id}/ready` | Not ready yet | SCRUM-60 | Built |
| `POST /rooms/{id}/end` | End debate; ends after a partner is gone 60 s | SCRUM-60 | Built |
| `POST /rooms/{id}/token` | LiveKit token for live audio, returns `{ token, url }` | SCRUM-62 | Built |
| `POST /rooms/{id}/turns`, `GET /rooms/{id}/turns?after=` | Typed debate turns (Type instead) | Typed turns issue | Built |

Response shapes to confirm with the backend owner:

- `GET /topics` returns `{ "topics": [{ "id", "motion", "category", "cefr_level" }] }`, with `id` a string.
- `POST /rooms/lookup` returns `room_id` (only when the caller is already seated),
  `motion`, `creator_name`, `format`, `duration_seconds` and `stance_mode`.
  Errors: 404 `invite_invalid`, 409 `room_full`.

## Not yet available (FG-01, 2026-11-14)

The frontend now has screens for every FG-01 use case. What it cannot do yet:

- **Backend verified end to end on 2026-11-14** (JDK 17, PostgreSQL, real
  browser), except the recovery emails. Run it with
  [the 002 quickstart](../specs/002-fg01-accounts/quickstart.md). All account
  tests mock the HTTP boundary; none prove real persistence,
  password hashing, JWT signing, email delivery or session revocation.
- **Session restore depends on the refresh cookie.** Reload calls
  `/auth/refresh` once. Without a backend that sets the HttpOnly cookie, reload
  still signs you out. Two tabs reloading at the same moment can race on a
  rotating refresh token; the backend needs a short reuse grace window.
- **Unverified email at login is undecided.** There is no screen or redirect for
  "verify your email first".
- **Profile:** email cannot be changed. Native language is free text, not a list.
  Goals are free text, one per line. The `data_retention_days` setting (FR-04,
  FG-10) has no UI.
- **Change password while signed in** still uses the email reset-code flow.
  There is no "current password + new password" form.
- **Active sessions:** the device label comes from the backend; there is no
  "sign out all other devices" button, only one at a time.
- **Account deletion:** no data export first, and no way to cancel during the
  7-day hard-delete window.
- **Admin:** lookup is by exact email only. There is no user list, audit-log
  view, role management or appeal flow. The use-case model says
  "Moderator / Admin" but the schema has only `LEARNER` and `ADMIN`; the
  frontend shows tools only for `ADMIN`.
- **Consent and data controls** listed under FG-01 in the Vision Document
  (N-02) are not in these screens.
