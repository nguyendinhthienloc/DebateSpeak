# Feature Specification: FG-04 real-time audio end to end

*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Đình Thiên Lộc (24125093)*

> Draft prepared by Lộc for Khoa to check and take over.

Created: 2026-11-27. Feature: `007-fg04-audio`. Jira: SCRUM-64 (this spec),
SCRUM-62 (token API), SCRUM-63 (frontend). Status: Draft. Frontend in review
(PR #71, and PR #73 which adds typed turns on top); token API not started.
Depends on [006 — FG-03 rooms](../006-fg03-rooms/spec.md): audio exists only
while a room is `LIVE`.

Covers FR-18 to FR-21 of the
[architecture spec](../../docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md).
Contract: [web/API_CONTRACT.md](../../web/API_CONTRACT.md) as updated by PR #73.

## User Scenarios & Testing

### US1 — Hear each other (P1)
When the room goes `LIVE`, each browser asks the API for a short-lived LiveKit
token and joins the LiveKit room named after the room id. Each voice debater
publishes one microphone track; both hear the other.
Independent check: two browsers on different networks hear each other within
5 s of `started_at`.

### US2 — Mic only after both consent (P1)
No microphone track is published, and no token is issued, before both debaters
pressed Ready with consent (006 FR-005). A debater who chose typing gets a token
that cannot publish audio.
Independent check: request a token in `READY` (409); a `TYPE` debater's token
has no publish-audio grant.

### US3 — Mute, unmute and see who is talking (P1)
Each voice debater can mute and unmute. Both see the partner's state (Live,
Muted, Lost connection) and who is speaking now. Mute pressed while connecting
keeps the mic off. After a reload during the debate the mic starts muted and
the screen says so.
Independent check: mute in browser A; B shows "Muted" and hears nothing.

### US4 — Survive a bad connection (P2)
The stage shows connection quality and LiveKit reconnects on its own. If the
partner is gone for 60 s, the client ends the room with `DISCONNECT`. If the
call drops, Try again requests a new token. If the browser blocks playback,
a Turn on sound button appears.
Independent check: close B's tab; after 60 s A sees the debate end.

### US5 — Typed turns (P3, PR #73)
A debater who chose typing sends turns of 1–500 characters. They are debate
content, saved and shown to the partner.

### Edge Cases
Mic permission denied (blocks Ready, not the room); expired token on reconnect
(ask again); token request for an `ENDED` room (409); non-participant (403/404);
both muted for the whole debate (allowed, nothing is transcribed).

## Requirements

- FR-001: `POST /rooms/{id}/token` returns `{"token","url"}` for a participant
  of a `LIVE` room only; otherwise 409 (not live) or 403/404.
- FR-002: Token identity = user id, name = display name, room = room id (never
  the invite code). Lifetime is a few minutes.
- FR-003: Grants: subscribe and publish data for both; publish microphone audio
  only when that participant's `input` is `VOICE`.
- FR-004 (dual consent, AGENTS.md §7): the token endpoint re-checks that both
  participants have `consent_given_at`. No audio flows otherwise.
- FR-005: One audio track per speaker, so speech is attributed by identity, not
  by diarization (FR-24 groundwork).
- FR-006: LiveKit key and secret come from environment variables only; `url`
  is `LIVEKIT_URL`. Nothing secret reaches the browser except the signed token.
- FR-007: Typed turns follow the contract's Typed turns section: trimmed,
  1–500 chars (422 otherwise), stored in `transcript_segments` with
  `source = 'TYPED'`.

## Key Entities

No new audio tables: LiveKit holds media, nothing is recorded in PA4. Typed
turns add a `source` column to `transcript_segments`. Details: [plan](plan.md).

## Success Criteria

- SC-001: Two real browsers talk through LiveKit Cloud using a token from the
  Spring Boot API, with no mocks.
- SC-002: No test or manual run publishes audio before both consents.
- SC-003: Mute state and active speaker match on both screens within 1 s.

## Out of scope (PA4)

Streaming STT and live transcript (FG-05), recording audio, video (FR-22),
server-side LiveKit webhooks. Device selection and the mic test are already in
the FG-03 consent screen (`AgreeView.tsx`).
