# DebateSpeak frontend

Responsive pages based on the selected Cream & Yellow Figma design. Sign-up and
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
are fixed Figma examples, not the output of a room service.

## Connect the auth API

Set the public build-time variable in the repo-root `.env` (never commit that
file), then restart Vite or rebuild:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The value includes the API prefix, without endpoint names. Empty/unset defaults
to `/api/v1` on the frontend origin; that deployment needs a reverse proxy routing
`/api` to the backend. Vite loads the root environment; only `VITE_` values are
exposed to the browser. Never put a secret in a `VITE_` variable.

For separate frontend/backend origins, the backend must explicitly allow the
frontend origin, credentialed CORS, and `Content-Type`/`X-DebateSpeak-Client`.
The scaffold's current wildcard CORS must be replaced before real auth is enabled.
Use same-site hosting for the G1 refresh-cookie model. Browser requests send
`credentials: include`, `cache: no-store`, JSON and `X-DebateSpeak-Client: web`.
Backend Origin validation, password hashing, JWT verification, throttling and
database transactions remain backend responsibilities.

| Endpoint under the configured prefix | JSON request | Required success |
| --- | --- | --- |
| `POST /auth/register` | `email`, `password`, optional `display_name`, `cefr_level` | 201 `UserResponse` |
| `POST /auth/login` | `email`, `password` | 200 `TokenResponse` |

`UserResponse` follows [G1](../docs/architecture/G1_SPEC_BUILD1.md):

```json
{
  "id": "d817b684-08e9-49c0-806a-a045fb7f060c",
  "email": "learner@example.com",
  "display_name": "Learner",
  "cefr_level": "B1",
  "created_at": "2026-11-12T08:00:00Z"
}
```

Login returns `access_token`, `token_type: "bearer"`, positive `expires_in`
(seconds) and `user: UserResponse`. The frontend runtime-checks success responses.
Registration creates no frontend session: it opens sign-in with a confirmation
and the email prefilled. An arbitrary visit to `#/account-created` shows ordinary
sign-in without claiming a successful registration.

Email is trimmed; passwords preserve spaces and Unicode and require 12–128
Unicode code points. Blank display names are omitted for the backend's `Learner`
default; nonblank names allow up to 80 code points. CEFR defaults to B1.

Errors support G1 problem JSON and standard FastAPI 422 arrays. Raw server
messages/input are never displayed. The UI handles validation, 401, 403, 409,
429, unavailable services, network failures, malformed success and a 15-second
timeout. Submission is guarded while pending; leaving a form cancels its request.
No account mutation is automatically retried. A timed-out/aborted registration
may still complete on the server; a later duplicate response offers sign-in.

Access tokens and the returned user live only in runtime memory. The typed
`getAccessToken()` in `src/auth/session.ts` is available to later authenticated
clients; an expired session clears memory and returns the UI to sign-in. Reload
clears the frontend session. Refresh and server logout/revocation are **not**
implemented in this scope; any server-managed HttpOnly cookie is not read by JS
and is not revoked just by reloading. No passwords/tokens go into localStorage,
sessionStorage, URLs or logs. Room previews remain accessible without login and
are not protected resources.

## Routes

Paths follow `/#/` so direct links and reload work on static hosting without
server rewrites. Browser back/forward, page titles and focus follow navigation.

| Hash path | Screen |
| --- | --- |
| `#/sign-in` | Sign in |
| `#/register` | Registration |
| `#/account-created` | Sign-in; confirmation only after a successful registration |
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
