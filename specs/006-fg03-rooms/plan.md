# Implementation Plan: FG-03 rooms and live sessions

Date: 2026-11-27. [Specification](spec.md). Backend owner: Tài. Frontend owner: Triết.

## Summary

Add the room API to the existing Spring Boot service `api/authify` (same JWT,
CORS and error handling as FG-01). The frontend is finished and unchanged:
it already calls every endpoint below with mocked tests.

## Technical Context

| Layer | Choice |
|---|---|
| Frontend | Done: `web/src/rooms/`, `web/src/pages/rooms/` (PR #70) |
| API | Java 17, Spring Boot, in `api/authify` (AGENTS.md §4) |
| Database | PostgreSQL 16; schema from the architecture spec, adjusted below |
| Concurrency | `SELECT … FOR UPDATE` (JPA `PESSIMISTIC_WRITE`) on the room for join, ready, leave, end |
| Time | Expiry and time limit applied on every read; `server_now` on every snapshot |
| Tests | Spring Boot tests for the state machine; Playwright in `web/tests/room-*.spec.ts` mock HTTP only |

## Structure

```text
api/authify/src/main/java/org/debatespeak/authify/
├── controller/RoomController.java      # /topics, /rooms/**
├── service/RoomService.java            # transitions, locking, expiry
├── entity/ TopicEntity, RoomEntity, ParticipantEntity, DebateSessionEntity
├── repository/ one per entity
└── dto/ RoomSnapshot, RoomPreview, Topic, CreateRoomRequest, ReadyRequest
```

## Data model

Based on the architecture spec SQL, with the changes the contract needs:

| Table | Columns |
|---|---|
| `debate_topics` | id, motion, category, cefr_level (seeded) |
| `debate_rooms` | id, topic_id, creator_id, invite_code (nullable after close), status, format, duration_seconds, stance_mode, created_at, lobby_expires_at |
| `debate_participants` | room_id, user_id, side (`FOR`/`AGAINST`), is_creator, ready, input_mode, consent_given_at, joined_at, left_at |
| `debate_sessions` | id, room_id (unique), started_at, ended_at, end_reason, ended_by |

## Contracts

All under `/api/v1`, bearer token required. Full shapes:
[web/API_CONTRACT.md](../../web/API_CONTRACT.md).

| Endpoint | Result |
|---|---|
| `GET /topics` | `{"topics":[Topic]}` |
| `POST /rooms` | Snapshot, `LOBBY` |
| `POST /rooms/lookup` `{code}` | Preview; 404, 409 full |
| `POST /rooms/join` `{code}` | Snapshot, `READY`; 404, 409 |
| `GET /rooms/{id}` | Snapshot; 403/404 for non-participants |
| `POST /rooms/{id}/cancel`, `/leave` | Snapshot; 409 |
| `PUT /rooms/{id}/ready` `{consent,input}` | Snapshot; 422 no consent, 409 |
| `DELETE /rooms/{id}/ready` | Snapshot; 409 |
| `POST /rooms/{id}/end` `{reason}` | Snapshot, `ENDED`; 409 |

Add `PUT` to the CORS allowed methods.

## Decisions and gaps

- State names follow the contract (`LOBBY`, `READY`, `LIVE`). Older notes
  using `WAITING` and `IN_DEBATE` are superseded.
- The architecture SQL uses `PRO`/`CON` and labels `A`/`B`; the contract uses
  `FOR`/`AGAINST`. Store the contract values; update the architecture spec.
- `end_reason` needs `CANCELLED` and `EXPIRED`; `ended_by` is new.
- `api/app/domain/rooms.py` (Python, SCRUM-28) holds pure transition guards.
  The Java service must re-implement them; the Python file is not wired to anything.
- No migrations yet (Hibernate `ddl-auto`), as in FG-01.
- Polling every 2 s per open room is fine for a class demo, not for scale.
