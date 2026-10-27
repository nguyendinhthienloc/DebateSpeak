# SCRUM-19 — Gate G1: Build 1 specification
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead. Edited: Codex.

Prepared: 2026-10-27. Status: proposed implementation contract, awaiting owner/user
inspection and peer review. Branch: `feature/G1-spec-build1`, based on `pa2` at
`dcb92aff046e4ce1a2ef5cca3c9d69d2585f8a4f`. Target: `pa2`.
Authority: [CHECKLIST.md §3](CHECKLIST.md), [TODO.md §5](TODO.md),
[architecture](../architecture/SOFTWARE_ARCHITECTURE_SPEC.md) and
[proposal](../requirements/PROJECT_PROPOSAL.md). This document implements the written
G1 requirements; it does not implement the application or close the gate.

## 1. Scope, decisions and human impact
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

Build 1 delivers registration, login/refresh/logout, own CEFR profile, room creation,
invite-code joining and participant-only room snapshots. Two browsers reach READY;
a third distinct learner is rejected. No media connection, microphone capture,
transcription, debate start, AI job or WebSocket is initiated by this slice. UI polls
`GET /rooms/{id}` every two seconds and stops on logout, leaving the page or a terminal
response. Avoid repeated alerts; keep invite input and show a clear recovery message.

Proposed decisions for Lộc's review and Tài/Triết's implementation alignment:

| Decision | Contract |
|---|---|
| API resource paths | `/users/me` and `/rooms*` from checklist G1.3; older `/me` and `/debates/rooms*` are not Build 1 aliases |
| Persistent names | Keep `users`, `user_profiles`, `debate_rooms`, `debate_participants`; checklist's `rooms` / `room_participants` refer to these existing entities, not extra tables |
| CEFR | A2, B1, B2, C1 only, matching architecture/proposal; correct checklist F-7's conflicting A1–C2 wording |
| Tokens | 15-minute Bearer access JWT in memory; opaque rotating refresh cookie with fixed seven-day family lifetime |
| Topic dependency | Seed at least one active `debate_topics` row and a matching frontend seed list of IDs/titles; no catalog/admin endpoint in Build 1; validate foreign keys |
| State boundary | Full enum retains CANCELLED; Build 1 creates LOBBY and advances to READY. LIVE remains disabled even if both participants are present |

Build 1 implementation is scheduled for Sprint 3 (PA3); PA2-2026 grades documents only.
This spec does not override AGENTS.md or claim any implementation is complete. Declining consent must never prevent
ordinary account use or force capture; room presence is not consent.

## 2. G1.1 — Persistence and invariants
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

| Entity / existing table | Build 1 fields and invariants |
|---|---|
| Account / `users` | UUID id; case-insensitive unique email; Argon2id `password_hash`; existing role/suspension/deletion fields; UTC creation timestamp |
| Profile / `user_profiles` | One row per user; display_name; CEFR enum default B1; native language/goals retain existing defaults. Account/profile writes are atomic |
| Topic / `debate_topics` | Existing schema, minimally seeded active rows; do not create a duplicate topic model or require topic CRUD |
| Room / `debate_rooms` | Existing UUID/topic/creator foreign keys; unique eight-character invite_code; enum status; format/duration/stance_mode; UTC created_at/lobby_expires_at |
| Membership / `debate_participants` | Existing primary key `(room_id,user_id)` and unique `(room_id,label)` with label A or B; nullable consent timestamp stays null in this slice |
| Session / new `auth_refresh_tokens` | Architecture §13.2 adds token-generation rows: id, family_id, user_id, unique SHA-256 token_hash, created/expires/consumed/revoked timestamps and replaced_by |

Keep the existing table names and columns; no rename migration is needed. Refresh
persistence is the G1 schema addition. Migration order: required extensions/enums,
users/profiles/session tokens, seeded topics, rooms/participants. Downgrade in reverse
dependency order on a disposable database; production rollback requires a data-loss
assessment. Do not create future transcript/analysis tables merely for this slice.

Invite codes use a cryptographically secure 32-symbol uppercase alphabet, uniformly
sampled to eight characters (40 random bits). Normalize input by trimming and uppercasing;
never log invite codes or return them to nonparticipants. A lobby expires 30 minutes
after creation. Joining requires server time strictly before expiry. Expiry cancels
LOBBY/READY; obtaining a snapshot may apply the same expiry rule before returning state.

Create room and creator membership A in one transaction. Join by normalized code:
lock the room row, check expiry/state, return an existing member's snapshot on a retry,
then insert distinct member B only if free. Unique A/B constraints back up the lock;
capacity is two even under concurrent requests. Assign opposing stances when READY;
RANDOM assigns the creator PRO/CON securely and the partner the opposite. CREATOR_PICKS
requires creator_stance PRO/CON. Do not permit join to choose arbitrary user identity.

## 3. G1.2 — State graph, guards and errors
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

The later T2.8 pure transition function validates the following complete graph.
Row = current, column = requested target. A dash means InvalidTransition; at an API
that exposes that operation, map it to HTTP 409 with code INVALID_TRANSITION.

| From / to | LOBBY | READY | LIVE | ENDED | CANCELLED |
|---|---|---|---|---|---|
| LOBBY | — | valid | — | — | valid |
| READY | valid | — | valid | — | valid |
| LIVE | — | — | — | valid | — |
| ENDED | — | — | — | — | — |
| CANCELLED | — | — | — | — | — |

| Valid edge | Server-side guard / effect | Build 1 availability |
|---|---|---|
| LOBBY → READY | Second distinct participant joins before expiry; assign opposing stances atomically | Join operation |
| LOBBY/READY → CANCELLED | Expiry, or authorized creator cancellation in a later endpoint; no capture | Expiry handling; no cancellation API added here |
| READY → LOBBY | Participant leaves; clear departed membership/seat and readiness in a later leave operation | Future operation |
| READY → LIVE | Explicit dual consent plus mic readiness and actual media capability; membership alone is insufficient | Disabled; no start/media endpoint in Build 1 |
| LIVE → ENDED | Authorized end, timer expiry or reconnect grace expiry | Future operation |

A valid edge still needs actor authorization and domain guards. Self-transitions are
invalid in the pure graph; an idempotent repeat join returns the snapshot without
calling transition. Build 1 has no arbitrary `PATCH status` API. Unknown routes return
404; do not add a fake status endpoint just to demonstrate 409. T2.8's API negative
test should exercise the real lifecycle service boundary or a future exposed transition.

## 4. G1.3 — Shared HTTP and response contracts
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

All paths below omit the configured API prefix, currently `/api/v1`. Use JSON,
UUID strings and RFC 3339 UTC timestamps. Reject unknown request fields with 422.
Protected endpoints require `Authorization: Bearer <access JWT>`; refresh/logout use
the refresh cookie instead. Server identity always comes from verified credentials.
Auth/profile and room responses use `Cache-Control: no-store`.

Shared response shapes (examples use symbolic values, not real credentials):

```json
{
  "id": "<user UUID>",
  "email": "learner@example.invalid",
  "display_name": "Learner",
  "cefr_level": "B1",
  "created_at": "<UTC timestamp>"
}
```

The shape above is `UserResponse`; it is only visible to that user. `TokenResponse`:

```json
{
  "access_token": "<access JWT>",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "<user UUID>",
    "email": "learner@example.invalid",
    "display_name": "Learner",
    "cefr_level": "B1",
    "created_at": "<UTC timestamp>"
  }
}
```

The refresh token is never returned in JSON. `RoomResponse`:

```json
{
  "id": "<room UUID>",
  "topic_id": "<seeded topic UUID>",
  "creator_id": "<creator UUID>",
  "invite_code": "<eight-character code>",
  "status": "LOBBY",
  "format": "FREE_FLOW",
  "duration_seconds": 600,
  "stance_mode": "RANDOM",
  "created_at": "<UTC timestamp>",
  "lobby_expires_at": "<UTC timestamp>",
  "participants": [
    {"user_id": "<creator UUID>", "display_name": "Learner", "label": "A", "stance": null}
  ]
}
```

At READY there are two participants and each stance is PRO or CON. A nullable stance
in LOBBY is intentional; participant emails and consent internals are not exposed.
The frontend constructs its invite URL from its own origin and the invite code; do
not derive application URLs from an untrusted request Host header.

Error shape: problem JSON with content type `application/problem+json`:

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "code": "ROOM_FULL",
  "detail": "This room already has two participants."
}
```

422 adds `errors: [{field, message}]` but must not echo passwords, tokens or submitted
values. 401 includes `WWW-Authenticate: Bearer` on Bearer-protected routes. All routes
may return 429 with Retry-After when throttled, or sanitized 503 when a required
service is unavailable. Clients must not display raw exception traces.

## 5. G1.3 — Authentication and profile endpoints
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

| Method / path | Request | Success | Defined application errors |
|---|---|---|---|
| POST /auth/register | email, password; optional display_name, cefr_level | 201 UserResponse; no session/cookie created | 409 EMAIL_EXISTS; 422 VALIDATION_ERROR; 403 ORIGIN_REJECTED |
| POST /auth/login | email, password | 200 TokenResponse plus refresh cookie | 401 INVALID_CREDENTIALS; 403 ORIGIN_REJECTED; 422 VALIDATION_ERROR |
| POST /auth/refresh | No body; refresh cookie | 200 TokenResponse plus rotated cookie | 401 INVALID_SESSION (missing/expired/replayed/revoked); 403 ORIGIN_REJECTED |
| POST /auth/logout | No body; refresh cookie if present | 204 empty response, revoke family if identifiable, clear cookie | 403 ORIGIN_REJECTED; no 401 for already-absent/revoked session |
| GET /users/me | No body; Bearer | 200 UserResponse | 401 INVALID_SESSION |
| PATCH /users/me | Nonempty subset of display_name and cefr_level; Bearer | 200 updated UserResponse | 401 INVALID_SESSION; 422 VALIDATION_ERROR |

Email: trim surrounding whitespace, validate syntax and length at most 254, compare
case-insensitively using the existing CITEXT uniqueness. Do not rewrite provider-specific
dots or plus aliases. Password: 12–128 characters; never trim, normalize or truncate.
No arbitrary composition rules. Display name: trimmed, 1–80 characters; defaults to
`Learner` when absent on registration. CEFR defaults to B1; only A2/B1/B2/C1 accepted.
Email, role, user_id and password_hash are not PATCHable through this endpoint.

Successful registration writes user/profile atomically, returns no credential and
routes the UI to login. Duplicate-registration 409 is an explicit Build 1 trade-off
(account-existence disclosure); throttle it. Login returns the same generic 401 for
unknown user, wrong password, suspension or soft deletion; do not reveal which check
failed. Sign-in/account mutation endpoints must not log bodies or secret cookie headers.

## 6. G1.3 — Room endpoints
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

| Method / path | Request | Success | Defined application errors |
|---|---|---|---|
| POST /rooms | Bearer; topic_id; optional format, duration_seconds, stance_mode, creator_stance | 201 RoomResponse with creator A and LOBBY | 401 INVALID_SESSION; 422 VALIDATION_ERROR / TOPIC_UNAVAILABLE |
| POST /rooms/join | Bearer; invite_code only | 200 RoomResponse; new partner makes READY, member retry is idempotent | 401 INVALID_SESSION; 404 ROOM_UNAVAILABLE; 409 ROOM_FULL / ROOM_NOT_JOINABLE; 422 VALIDATION_ERROR |
| GET /rooms/{id} | Bearer; UUID path; no body | 200 RoomResponse for an existing participant | 401 INVALID_SESSION; 404 ROOM_UNAVAILABLE for absent room or nonmember; 422 VALIDATION_ERROR for malformed UUID |

Create defaults: FREE_FLOW, 600 seconds, RANDOM. Accepted format: FREE_FLOW or TIMED_TURNS;
duration is an integer 60–1800 seconds; stance_mode RANDOM or CREATOR_PICKS. The latter
requires creator_stance PRO/CON; supplying creator_stance with RANDOM is invalid.
Unknown or inactive topic IDs yield 422 without inserting a room. A fixed seeded list
and its documented IDs must be delivered with the backend/frontend integration, not guessed.

Join order: authenticate → validate code → lock/resolve room → apply expiry → reject
expired invite with 404 → reject LIVE/ENDED/CANCELLED with 409 → return current member
snapshot if already present → reject two seats with 409 ROOM_FULL → insert B and READY.
Unknown code also yields 404. A third user may learn that a valid code is full, but
must never receive participant names, IDs, email or room contents in the error response.

GET returns only participant snapshots. Before lobby expiry it returns LOBBY/READY;
after expiry it may return CANCELLED to participants, while the code no longer joins.
Refreshing the page must recover the caller's session then load the same persisted room.
Network loss in this lobby-only increment does not invent a LIVE reconnect protocol.

## 7. G1.4 — Token transport, rotation and logout
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

Access JWT: lifetime 15 minutes, verified signature using a server-configured algorithm
allowlist, expiry and configured issuer/audience. Claims include sub=user UUID,
sid=refresh family UUID, jti, iat, exp, iss and aud. Do not accept an algorithm selected
solely by the incoming token. Signing secrets come from environment configuration,
never source defaults in a deployed environment. Use existing configuration names
`SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES` and `REFRESH_TOKEN_EXPIRE_DAYS`; checklist's
older JWT_SECRET/TTL spellings are not additional required variables.

Refresh credential: opaque, at least 32 cryptographically random bytes, encoded for
cookies. Store only its SHA-256 hash in auth_refresh_tokens. Every login creates a
new family expiring exactly seven days later; rotations retain that absolute deadline.
Browser storage: access JWT only in runtime memory; refresh only in host-only cookie
`debatespeak_refresh`, HttpOnly, SameSite=Lax, Secure on HTTPS, Path=`<API prefix>/auth`.
No localStorage/sessionStorage credentials and no Domain attribute. Explicit local
HTTP development may omit Secure; staging/production may not. Clear cookies using
the same Path and attributes, Max-Age=0. Responses never expose the refresh value.

Every auth POST, including login/logout, requires JSON for nonempty bodies, an
`X-DebateSpeak-Client: web` header and a non-null Origin exactly matching an explicitly
configured trusted frontend origin. Reject absent/untrusted Origin/header with 403.
CLI/integration tests send those headers explicitly. For an allowed cross-origin
development frontend, allow credentialed CORS only for the named origin and custom
header; never combine wildcard origins with credentials. The current scaffold's
wildcard CORS must be replaced before this auth flow is enabled. SameSite alone is
not the CSRF defense. Keep deployments same-site; unrelated cross-site hosting needs
a separate reviewed cookie/CSRF design. Register new environment options in .env.example
with placeholders when the implementation introduces them.

Rotation transaction: locate and lock the token row/family, verify account/family
validity, mark the old row consumed, insert the successor hash and link replaced_by,
commit, then set the new cookie and issue access JWT. Roll back all writes on failure.
Retain consumed hashes until family expiry to recognize replay. A consumed token
replay revokes the entire family and returns generic 401. Logout does the same for
an identifiable family and clears the cookie; invalid/missing cookies still get 204.
Protected requests validate account status and that the JWT's sid has an unexpired,
unrevoked current family token, so logout/replay also invalidates access immediately.
Implement refresh, replay revocation and logout using the same transaction-scoped
family lock (a PostgreSQL advisory lock keyed deterministically from family_id) before
token-row writes, so a concurrent refresh cannot recreate a logged-out family. Derive
lock keys consistently; collisions may serialize unrelated families but never weaken
revocation. Database serialization failures are retried transactionally, not by replaying
an already-consumed browser refresh request.

Frontend sends `credentials: include` on auth cookie requests and serializes refresh
attempts; simultaneous tab refreshes may trigger replay revocation and re-login. Do
not automatically retry a refresh whose response was lost: require re-authentication
rather than treating a consumed token as reusable. Limit ordinary API recovery to one
refresh attempt; on failure clear memory and navigate to login without a request loop.

Security rationale references: [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
and [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
These support the transport controls, not a claim that this unimplemented design is secure.

## 8. Acceptance matrix and handoff
Performed: Codex, assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: pending. Edited: Codex.

All scenarios below are NOT RUN; they are implementation requirements for T2.5–T2.9.

| ID | Scenario / observable expected result | Source |
|---|---|---|
| G1-A01 | Register and login; persisted password is Argon2id, no password/hash in responses | AC-1.1 |
| G1-A02 | Duplicate/invalid registration leaves no partial account; wrong login is generic 401 | AC-1.1 |
| G1-A03 | Save B1, reload after refresh; own profile persists, supplied other-user identifiers rejected | AC-1.2 |
| G1-A04 | Rotate refresh, reject replay, revoke family and deny old access; expired session rejected | G1.4 |
| G1-A05 | Logout twice returns 204, cookie clears, family cannot refresh; bad Origin/header gives 403 | G1.4 |
| G1-A06 | A creates, B joins, both poll READY with two opposing stances | M1-3 / M1-4 |
| G1-A07 | One creator plus ten concurrent distinct joiners: exactly one succeeds, nine get 409, two total members | AC-1.4 |
| G1-A08 | Member retry adds no membership; invalid/expired invite cannot join; third user gets no private snapshot | G1.1 / G1.3 |
| G1-A09 | Every one of the 25 state pairs matches the matrix; invalid pairs raise InvalidTransition | AC-1.5 / T2.8 |
| G1-A10 | Join/READY never opens microphone, media token or analysis job; no status mutation endpoint bypasses consent | AGENTS.md §7 |
| G1-A11 | Nonmember room GET returns 404; no emails, token hashes or secrets leak; service failure is sanitized | G1.3 |
| G1-A12 | Create room uses a seeded active topic; bad settings fail before any room/member write | G1.1 / G1.3 |

G1.1–G1.5 are prepared here and in architecture/proposal. Lộc reviews the table names,
matrix, payloads and the proposed token choice; Tài and Triết must agree on the token
choice as required by checklist decision 5. No agreement is fabricated. G1.6 is not
complete until a real spec PR receives approving review, passes CI and merges into pa2. Only that merge
opens the gate for dependent implementation. Do not tick it from document presence.
