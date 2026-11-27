# Feature Specification: FG-03 rooms and live sessions end to end

*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Đình Thiên Lộc (24125093)*

> Draft prepared by Lộc for Khoa to check and take over.

Created: 2026-11-27. Feature: `006-fg03-rooms`. Jira: SCRUM-64 (this spec),
SCRUM-60 (backend), SCRUM-61 (frontend). Status: Draft. Frontend done and merged
(PR #70); room API not started.

Covers FR-10 to FR-13 and FR-15 of the
[architecture spec](../../docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md).
Behaviour and wording come from the
[room flow design](../../docs/superpowers/specs/2026-11-19-room-flow-design.md);
endpoints and shapes from [web/API_CONTRACT.md](../../web/API_CONTRACT.md).
This spec was written after the frontend. It does not claim Spec Kit came first.

## User Scenarios & Testing

### US1 — Create a room (P1)
A signed-in learner picks a topic, format (`FREE_FLOW` or `TIMED_TURNS`),
duration (5, 10, 15 or 20 min) and side (`FOR`, `AGAINST`, `RANDOM`). The room
opens in `LOBBY` with an 8-character invite code valid for 30 minutes.
Independent check: create, restart the API, `GET /rooms/{id}` returns the same room.

### US2 — Join by invite code (P1)
A second learner enters the code, sees a preview (motion, creator, format,
duration, stance mode) and takes the seat. The room moves to `READY` and both
sides are assigned. A third account is refused.
Independent check: two browsers join one room; a third browser gets "room full".

### US3 — Consent and Ready (P1)
Each debater chooses voice or typing and presses I'm ready, which records
explicit consent to transcription and analysis. Only when both are ready does
the room go `LIVE`, with `started_at` = second Ready + 3 s. Either may un-ready.
Independent check: one Ready keeps `READY`; the second Ready gives `LIVE`.

### US4 — Leave, cancel, expire, end (P2)
The creator can cancel in `LOBBY`/`READY`. A guest leaving `READY` reopens the
seat. A `LOBBY` room past its expiry becomes `CANCELLED` (`EXPIRED`). A `LIVE`
room ends by either debater (`MANUAL`), the timer (`TIMER`) or a 60-second
partner disconnect (`DISCONNECT`).
Independent check: each ending shows the right `end_reason` after a reload.

### Edge Cases
Wrong, expired or closed code (404); room full (409); a seated caller looking
up their own code gets `room_id` back instead of a second seat; Ready without
consent (422); any move not allowed in the current state (409); a non-participant
reading a room (403/404); two simultaneous joins or Readys (row lock, one wins).

## Requirements

- FR-001: Endpoints, bodies, shapes and status codes follow
  [web/API_CONTRACT.md](../../web/API_CONTRACT.md) exactly. The UI validates
  shapes with `web/src/rooms/contracts.ts`.
- FR-002: States are `LOBBY`, `READY`, `LIVE`, `ENDED`, `CANCELLED`. Only the
  transitions in the contract's Rules section are allowed; all others return 409.
- FR-003: Invite codes are 8 random characters (at least 40 bits), unique,
  single-room, and `null` once the room is ended or cancelled.
- FR-004: A room holds exactly two debaters. No account ever holds two seats.
- FR-005 (dual consent, AGENTS.md §7): the server refuses
  Ready without `consent: true`, stores the consent time per participant, and
  never goes `LIVE`, issues a media token or saves transcript text unless both
  participants consented. Leaving or un-readying clears consent.
- FR-006: Rooms, participants, consent and debate sessions persist in
  PostgreSQL 16. Going `LIVE` creates exactly one `debate_sessions` row.
- FR-007: Every snapshot carries `server_now`. Expiry and the time limit are
  applied on every read; no scheduler is required.
- FR-008: Join and Ready run under a row lock on the room.
- FR-009: All room endpoints need a valid access token. 401 is used only for a
  missing or bad token, because the UI signs the user out on 401.

## Key Entities

Topic (`debate_topics`), Room (`debate_rooms`), Participant with side, ready,
input mode and consent time (`debate_participants`), Debate session
(`debate_sessions`). Columns: [plan](plan.md).

## Success Criteria

- SC-001: One full flow (create, join, both Ready, `LIVE`, end) works in two
  real browsers against the Spring Boot API, with no mocks.
- SC-002: Rooms and their final state survive an API restart.
- SC-003: No room reaches `LIVE` in any test without two recorded consents.

## Out of scope (PA4)

Audio and the media token (see [007](../007-fg04-audio/spec.md)), abuse reports
and admin force-close (FR-16, FR-17), turn timer per speaker (FR-14 is UI only),
push updates (polling is enough for two people).
