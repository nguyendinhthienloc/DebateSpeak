# TODO — Tài (Backend & Real-Time Media Lead)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| C4 Level 1: Tech Stack description + System Context Diagram (Mermaid) + actors/systems prose | SCRUM-60 | `feature/SCRUM-60-c4-system-context` | TBD | To Do |
| FG-03 Backend: Room entity, 8-char invite code generation, state machine API (create/join/ready/start), DB tables | SCRUM-62 | `feature/SCRUM-62-fg03-backend` | TBD | To Do |
| FG-04 Backend: LiveKit token generation endpoint (`POST /api/v1/rooms/{id}/token`), room bridge, permissions | SCRUM-65 | `feature/SCRUM-65-fg04-livekit-token-api` | TBD | To Do |
| Review Khoa's C4 Level 2 Container Diagram | SCRUM-55 (review) | n/a (review) | TBD | To Do |
| Review Khoa's C4 Level 3 Backend Component Diagram | SCRUM-56 (review) | n/a (review) | TBD | To Do |
| Review Tuấn's Use-Case Specifications updates (Part A) — spot-check room and audio UCs | SCRUM-54 (review) | n/a (review) | TBD | To Do |

## C4 Level 1 — System Context Diagram (SCRUM-60)

**Owner:** Nguyễn Hồng Tấn Tài — **24125078** — **Backend & Real-Time Media Lead**  
**Reviewer:** Trần Lê Anh Tuấn (24125107)  
**Deliverable:** `docs/pa4/ARCHITECTURE_C4_CONTEXT.md`

Must include:
- **Tech Stack section**: React + Vite + Tailwind (FE), Spring Boot 3 + Hibernate + PostgreSQL 16 (BE), Redis 7, LiveKit Cloud SFU, Python ARQ workers, `STTAdapter`, `LLMAdapter`
- **C4 Level 1 Mermaid diagram**: DebateSpeak system box + actors (Student, Admin) + external systems (LiveKit Cloud, STT Cloud provider, LLM provider, Email/SMTP)
- Prose explaining each actor and external dependency

## FG-03 Backend (SCRUM-62)

**Owner:** Nguyễn Hồng Tấn Tài — **24125078**  
**Reviewer:** Trần Lê Anh Tuấn (24125107)  
**Deliverable:** `api/authify/src/main/java/org/debatespeak/authify/room/`

Acceptance criteria:
- `POST /api/v1/rooms` → creates room, returns 8-char `invite_code`
- `POST /api/v1/rooms/join` with `invite_code` → joins room (409 if full or state ≠ WAITING)
- `POST /api/v1/rooms/{id}/ready` → marks user ready; room transitions to IN_DEBATE when both ready
- DB: `rooms` table (id, invite_code, state, topic_id, affirmative_user_id, negative_user_id, created_at)
- State machine: `WAITING` → `READY` → `IN_DEBATE` → `ENDED` (pure function, unit tested)

## FG-04 LiveKit Token API (SCRUM-65)

**Owner:** Nguyễn Hồng Tấn Tài — **24125078**  
**Reviewer:** Nguyễn Anh Khoa (24125058)  
**Deliverable:** `api/authify/src/main/java/org/debatespeak/authify/livekit/`

Acceptance criteria:
- `POST /api/v1/rooms/{id}/token` → returns a signed LiveKit JWT token for the authenticated user
- Token grants: publish audio track, subscribe to other participant's audio, room name = room invite code
- Uses `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` from environment (never hardcoded)
- Returns `{ "token": "<jwt>", "url": "<livekit_server_url>" }`
