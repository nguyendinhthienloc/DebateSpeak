# Feature Specification: FG-03 Room and session management

Status: draft, pending team and reviewer approval. Nothing here is implemented.
Feature: `002-fg03-room-session`. Branch: `feature/SCRUM-38-fg03-spec`. Jira: SCRUM-38.

Spec before code (AGENTS.md section 5). Sources: `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md`
(FR-10 to FR-12), `docs/architecture/G1_SPEC_BUILD1.md`, `docs/pa3/Changes.md` section 1,
and the PA3 task lists of Tài, Triết and Tuấn. The existing Python graph in
`api/app/domain/rooms.py` is the reference for states and guards. The backend is
Java (Spring Boot) per Tài's decision of 2026-11-14, still pending team confirmation.

## User Scenarios & Testing

### US1 - Create a room (P1) - FR-10

A signed-in learner chooses a topic, stance mode, format and duration and gets a
room with an invite code and link.

Acceptance:
- Given a signed-in learner and a seeded active topic, when they submit valid settings,
  then a room is created in LOBBY, they hold seat A, and the invite code and link are shown.
- Given settings are omitted, when they create, then the defaults are FREE_FLOW, 600 seconds, RANDOM.
- Given stance mode CREATOR_PICKS without a creator stance, or an unknown or inactive topic,
  or a duration outside 60-1800 seconds, when they submit, then a 422 is returned and no room is saved.
- Given the user is not signed in, when they submit, then a 401 is returned.

Independent check: create a room through the API and see it in the lobby screen.

### US2 - Join by invite code (P1) - FR-11, FR-12

A second signed-in learner joins with the invite code or link. The room becomes READY.

Acceptance:
- Given a LOBBY room with one participant, when another learner submits the code
  (any letter case, surrounding spaces), then they take seat B, the room becomes READY
  and both participants have opposing stances.
- Given the room already has two participants, when a third learner submits the code,
  then a 409 ROOM_FULL is returned with no participant data.
- Given a participant submits the code again, then the current room is returned and no
  membership is added.
- Given the code is unknown or the lobby has expired, then a 404 ROOM_UNAVAILABLE is returned.
- Given ten distinct learners join at once, then exactly one succeeds and nine get 409.

Independent check: two browsers reach READY; a third gets the full message.

### US3 - See the lobby update (P1) - FR-11, FR-12

Both participants see the same room state without reloading.

Acceptance:
- Given the creator waits in the lobby, when the partner joins, then within about two
  seconds the creator's screen shows READY, the partner's name and both stances.
- Given a page reload, then the learner signs in again and the same persisted room loads.
- Given a non-member requests a room, then 404 ROOM_UNAVAILABLE is returned.
- Given the lobby passes its 30-minute expiry, then the room reads as CANCELLED and the
  code no longer joins.
- Polling stops when the learner signs out, leaves the page or reaches a terminal state.

### US4 - Start the debate together (P1) - FR-12

When the room is READY, a participant starts the debate and both screens enter the
live state at the same moment.

Acceptance:
- Given a READY room, when a participant requests start, then the room becomes LIVE and
  the server records one start time.
- Given both clients poll, then both show the live screen and a countdown from the same
  server start time and duration, not from their own click time.
- Given a LOBBY, ENDED or CANCELLED room, or a non-participant, when start is requested,
  then 409 INVALID_TRANSITION or 404 is returned and nothing changes.
- Given a start request is repeated, then the room stays LIVE with the original start time.
- Given the start, then no microphone, media token, transcription or analysis job begins
  (audio is out of scope for PA3).

Independent check: both browsers move from READY to LIVE with matching server start time.
Start availability depends on open questions 1 and 2.

### US5 - End or cancel a room (P2) - FR-12, FR-15

Acceptance:
- Given a LOBBY or READY room, when the creator cancels, then it becomes CANCELLED.
- Given a LIVE room, when a participant ends it, then it becomes ENDED and stays read-only.
- Given any other pair of states, then 409 INVALID_TRANSITION is returned.

Availability depends on open question 3.

### Edge Cases

Concurrent joins, double submission, expired lobby, malformed UUID or code, token
expiry during polling, network loss while polling (show a calm retry message, keep input),
a creator joining their own room (the retry rule applies), service failure (sanitized 503).

## Requirements

Each requirement maps to a functional requirement in the architecture spec.

- FR-10 (US1): create a room with topic, stance mode, format, duration; return invite code and link.
- FR-10 (US1): topic selection uses seeded active topics only; invalid topics are rejected before any write.
- FR-11 (US2): join by normalized invite code; capacity is exactly two; a third distinct learner gets 409.
- FR-11 (US2, US3): only participants see room data; non-members see 404.
- FR-12 (US2): LOBBY to READY on the second distinct join, assigning opposing stances atomically.
- FR-12 (US4): READY to LIVE only after server-side guards pass; one server start time is stored.
- FR-12 (US3, US5): LOBBY or READY to CANCELLED on expiry or creator action; LIVE to ENDED by an authorized action.
- FR-12 (all): every transition is validated by the state graph; no endpoint writes status directly.
- FR-13 (US4): consent gating of the start is not decided here; see open question 1.
- FR-15 (US5): leave and reconnect grace are outside this spec; only end and cancel are covered.

Out of scope for PA3: live audio, speech-to-text, LLM analysis, refresh-token rotation,
profile editing, FG-02 topic listing and filtering (an extra, not required here),
reporting and moderation (FR-16, FR-17).

### Key Entities

Room (`debate_rooms`), participant (`debate_participants`, seat A or B), topic
(`debate_topics`, seeded), invite code, room status. See [data-model.md](data-model.md).

## Success Criteria

- SC-001: Two browsers go from sign-in to READY with opposing stances.
- SC-002: Of eleven simultaneous join attempts, exactly one succeeds.
- SC-003: All 25 state pairs behave as the graph defines.
- SC-004: Both participants enter LIVE from one server start time.
- SC-005: No microphone access, media token or analysis job starts in any FG-03 flow.
- SC-006: Lobby and start screens fit 320px, work by keyboard, and announce state changes.

## Assumptions

Authentication from the account increment is available. Polling every two seconds is
the update method (no WebSocket in PA3). English-only UI. Error shape follows G1 section 4.

## Open questions

1. Consent and start: FR-13 requires dual consent before a debate starts, but it is
   planned for Increment 2, and the Python guard rejects LIVE without consent, microphone
   readiness and media. Does the PA3 start skip consent because no audio runs, or does the
   FG-03 start remain disabled behind a flag? Needs a team decision before US4 is built.
2. G1 section 3 says Build 1 adds no start endpoint, while Changes.md keeps the FG-03
   start. Is `POST /rooms/{id}/start` approved as the one new endpoint?
3. Are cancel and end endpoints part of PA3, or only the state graph and unit tests?
4. Does FG-02 `GET /topics` ship, or does the frontend use a seed list of topic IDs and titles?
5. Backend language: Java (Spring Boot) is pending team confirmation; AGENTS.md section 4
   and the Python domain module still describe Python. Which implements the graph?
6. Who may start: either participant or the creator only?
