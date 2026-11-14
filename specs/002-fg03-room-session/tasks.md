# Tasks: FG-03 room and session management

Status: draft, pending team and reviewer approval. All tasks are not started.
Owners come from the PA3 task lists: Tài (backend), Triết (frontend), Tuấn (state machine).
Tasks tagged with a story map to [spec.md](spec.md).

## Decisions first

- [ ] T001 Resolve open questions 1 to 6 in `spec.md` with the team. Owner: Tuấn with Tài and Triết. Not started.

## Backend contracts

- [ ] T002 Confirm `contracts/rooms.md`, including start, cancel and end and the `started_at` and `server_time` fields. Owner: Tài. Not started.
- [ ] T003 State machine: graph, lifecycle context and guards in the chosen backend language, matching `api/app/domain/rooms.py`; unit tests for all 25 pairs (FR-12). Owner: Tuấn (SCRUM-28). Not started.

## Persistence

- [ ] T004 Migration for `started_at` and the topic seed with at least one active topic; rooms and participants tables if missing. Owner: Tài (SCRUM-41). Not started.

## Endpoints

- [ ] T005 [US1] `POST /rooms`: validation, invite code, creator seat A in one transaction (FR-10). Owner: Tài (SCRUM-26). Not started.
- [ ] T006 [US2] `POST /rooms/join`: locking, idempotent retry, 409 on third user, stance assignment, READY (FR-11, FR-12). Owner: Tài (SCRUM-26). Not started.
- [ ] T007 [US3] `GET /rooms/{id}`: participant-only snapshot, expiry applied on read (FR-11, FR-12). Owner: Tài (SCRUM-26). Not started.
- [ ] T008 [US4] `POST /rooms/{id}/start`: guarded READY to LIVE, one stored start time (FR-12). Owner: Tài (SCRUM-38). Not started.
- [ ] T009 [US5] Cancel and end endpoints, if approved (FR-12). Owner: Tài. Not started.

## Frontend wiring

- [ ] T010 [US1] Typed room API client in `web/src/rooms/`; wire room setup to create with topic selection (FR-10). Owner: Triết (SCRUM-27). Not started.
- [ ] T011 [US2] Join by code or link on the lobby screen, with the full-room and unavailable messages (FR-11). Owner: Triết (SCRUM-27). Not started.
- [ ] T012 [US3] Two-second polling that stops on sign-out, navigation or terminal state; READY screen (FR-12). Owner: Triết (SCRUM-38). Not started.
- [ ] T013 [US4] Ready and start screen with a countdown from server time (FR-12). Owner: Triết (SCRUM-38). Not started.

## Tests

- [ ] T014 Backend API tests: create, join, 409 on third user, 11 concurrent joins, non-member 404, expiry, start guards. Owner: Tài. Not started.
- [ ] T015 Playwright two-browser journey from sign-in to LIVE with no microphone request. Owner: Triết. Not started.
- [ ] T016 Run [quickstart.md](quickstart.md) against the real backend and record results. Owner: Tài and Triết. Not started.

## Order

T001 first. T002 and T003 before endpoints. T004 before T005 to T009. T005 to T007 before
T010 to T012. T008 before T013. Tests T014 and T015 follow their endpoints; T016 last.
