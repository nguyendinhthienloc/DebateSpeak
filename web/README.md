# DebateSpeak frontend

Responsive frontend using the Cream & Yellow design system. Sign-up and
sign-in are API-ready forms using the existing G1 contract. The API currently
implements only `/health`: real account creation and login require a conforming
backend. Rooms, profile editing, audio, transcription and AI remain previews.

## Run

Use Node.js 20 or newer. From `web/`:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The default page is sign-in; use the page
links or **Preview screen** selector at the bottom to explore every screen.
**Create account** and **Sign in** submit to the configured API. Actions labeled
**Preview** navigate to sample outcomes. Profile saving and audio checks are disabled.
Room setting selections live only in memory and reset on reload; lobby screens
are sample previews, not the output of a room service.

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
| `#/rooms` | Room entry |
| `#/rooms/new` | Setup summary and preview |
| `#/rooms/new/settings` | Room settings |
| `#/profile` | Profile |
| `#/invite` | Invitation example |
| `#/rooms/waiting` | Waiting lobby example |
| `#/rooms/ready` | Ready lobby example |
| `#/rooms/full` | Full-room recovery example |
| `#/rooms/expired` | Expired-room recovery example |

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
keyboard controls and all routes at 320/390/1102/1440px. Room previews make no
service/media requests. These tests verify the frontend contract, not database
persistence, password hashing, JWT security or complete FG-01 acceptance.
See [the approved auth scope](../docs/superpowers/specs/2026-11-12-auth-frontend-design.md).

## Frontend workflow and current scope

Frontend development is independent of both historical Figma links. Implement
from `src/`, [DESIGN.md](../DESIGN.md) and [Spec Kit](../specs/README.md), then
verify in the browser. Update Figma only when explicitly requested.

Login, registration and recovery are FG-01. FG-03 room/session support remains
previews: create/join APIs, persistence, participant authorization, server-side
state transitions, dual consent, timing, reconnection and moderation are missing.
Profile saving, account deletion, active-session management and refresh/logout
also remain unfinished. See [the API contract](API_CONTRACT.md).

After email verification, Change password opens the password-reset request.
Profile has the same entry point. Request a fresh reset code, enter it with the
new password, then sign in. A verification code cannot substitute for a reset
code. Real email/password changes require the documented backend endpoints.
