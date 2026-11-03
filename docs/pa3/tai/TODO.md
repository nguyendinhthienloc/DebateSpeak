# TODO — Tài (Backend & Real-Time Media)

Team deadline: **Fri 2026-11-13**. Scope and rules: [../README.md](../README.md). Branch from `pa3`, PR into `pa3`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| **First:** Alembic migrations + seed script with mock data (5 users, 10 topics, 1 room) | SCRUM-41 | `feature/SCRUM-41-db-migrations-seed` | 11-04 | Open |
| Auth API: register, login, Argon2id, access JWT | SCRUM-24 | `feature/SCRUM-24-auth-api` | 11-05 | Open |
| Room API: create, join by invite code, 409 on third user | SCRUM-26 | `feature/SCRUM-26-room-api` | 11-06 | Open |
| FG-03 backend lead: topic selection, synchronized debate start, tests (pytest) | SCRUM-38 | `feature/SCRUM-38-fg03-room-session` | 11-10 | Open |
| Part A: revised Project Plan + `docs/pa3/Changes.md` | SCRUM-35 | `feature/SCRUM-35-revised-plan-vision` | 11-11 | Open |
| *Extra:* FG-02 topic list/filter API | SCRUM-44 | `feature/SCRUM-44-topic-api` | 11-11 | Stretch |
| *Extra:* LiveKit access-token endpoint spike | SCRUM-45 | `feature/SCRUM-45-livekit-token-spike` | 11-12 | Stretch |

Blocked by: Tuấn's state machine (SCRUM-28) for the room API.
