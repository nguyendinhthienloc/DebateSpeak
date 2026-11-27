# Tasks: FG-03 rooms and live sessions

Checked = done and visible in the repository on `pa4`. Unchecked = not started
unless noted. Backend: Tài (SCRUM-60). Frontend: Triết (SCRUM-61).

## Setup

- [x] T001 Room flow design and API contract (`docs/superpowers/specs/2026-11-19-room-flow-design.md`, `web/API_CONTRACT.md`).
- [ ] T002 Spec, plan and tasks for FG-03 (this folder, SCRUM-64). Khoa to check, Tuấn to review.
- [ ] T003 Update the architecture spec SQL: `FOR`/`AGAINST`, `ready`, `input_mode`, `is_creator`, `ended_by`, extra end reasons (Lộc or Tài, before backend code).

## Frontend (Triết) — done, PR #70 merged 2026-11-21

- [x] T010 Room client and page shell (`web/src/rooms/api.ts`, `contracts.ts`, `RoomPage.tsx`).
- [x] T011 [US1] Create room screen (topic, format, duration, side).
- [x] T012 [US2] Invite and join: preview, room full, wrong code, seated caller.
- [x] T013 [US3] Consent and mic check before Ready (`AgreeView.tsx`).
- [x] T014 [US4] Cancel, leave and expiry messages.
- [x] T015 Playwright tests `web/tests/room-{create,invite,agree,page,routes}.spec.ts` (HTTP mocked).

## Backend data (Tài) — not started

- [ ] T020 Entities and repositories: topics, rooms, participants, sessions.
- [ ] T021 Seed at least 10 topics across CEFR A2–C1.

## Backend US1–US2 (Tài) — not started

- [ ] T030 [US1] `GET /topics`, `POST /rooms` with a unique 8-character code.
- [ ] T031 [US2] `POST /rooms/lookup`, `POST /rooms/join` under a row lock; side assignment.
- [ ] T032 [US2] `GET /rooms/{id}` with expiry and time limit applied on read; 403/404 for outsiders.

## Backend US3 (Tài) — not started

- [ ] T040 [US3] `PUT /rooms/{id}/ready` refuses without `consent: true` (422) and stores `consent_given_at`.
- [ ] T041 [US3] Second Ready → `LIVE`, `started_at` = now + 3 s, exactly one `debate_sessions` row.
- [ ] T042 [US3] `DELETE /rooms/{id}/ready` clears ready and consent.

## Backend US4 (Tài) — not started

- [ ] T050 [US4] Cancel, leave (seat reopens, expiry restarts), creator leave cancels.
- [ ] T051 [US4] `POST /rooms/{id}/end` with `MANUAL`/`DISCONNECT`; `TIMER` on read.
- [ ] T052 Add `PUT` to CORS methods in `SecurityConfig.java`.

## Verification

- [ ] T060 Spring Boot tests for every transition, including 409 for invalid moves and 422 without consent.
- [ ] T061 Concurrency test: two joins and two Readys at once; one room, one session.
- [ ] T062 Two real browsers against the API: create, join, both Ready, `LIVE`, end; restart the API and reload.
- [ ] T063 Record the result here with the commit hash, as in [002 tasks](../002-fg01-accounts/tasks.md).
