# Implementation Plan: FG-03 Room and session management

Status: draft, pending team and reviewer approval. Date: 2026-11-14. [Specification](spec.md).
No part of this plan is implemented.

## Summary

Deliver one vertical slice: create room, join by code, lobby polling to READY, then a
synchronized start to LIVE, from UI to API to database. Audio is not touched.

## Technical Context

- Frontend: Vite, React, TypeScript, Tailwind SPA in `web/`; hash routing; in-memory access token.
- Backend: Java (Spring Boot), decision by Tài 2026-11-14, pending team confirmation (open question 5).
  Libraries for ORM, migrations and JWT are not chosen yet.
- Database: PostgreSQL 16 with existing tables `debate_topics`, `debate_rooms`, `debate_participants`.
- State rules: pure transition function and guards, reference `api/app/domain/rooms.py` (Tuấn, SCRUM-28).
- Updates: client polls `GET /rooms/{id}` every two seconds.
- Tests: unit tests for the graph; API tests including 11 concurrent joins; Playwright for the two-browser journey.

## Constitution Check

- Spec before code: this plan precedes any FG-03 code.
- Vertical slice: each user story connects UI, API and database (AGENTS.md section 6).
- Consent and safety (AGENTS.md section 7): no audio, media token or analysis job starts; start gating depends on open question 1.
- No secrets and no absolute paths; any new setting goes into `.env.example` with a placeholder.
- Gap: the architecture spec and AGENTS.md still name FastAPI in places; the Java decision is unconfirmed.

## Project Structure

| Location | Responsibility |
| --- | --- |
| `specs/002-fg03-room-session/` | This specification |
| Backend room module (path set after the language decision) | Room service, controllers, repositories |
| Backend state machine module | Graph and guards (Tuấn) |
| Database migrations | Topic seed and room tables if not yet present |
| `web/src/pages/RoomPages.tsx`, `RoomSetupPage.tsx`, `roomSettings.ts` | Setup, lobby, ready and live screens, currently sample data |
| `web/src/rooms/` (new) | Typed room API client and polling |
| `web/tests/` | Browser tests for the room journey |

## Delivery and Validation

1. Agree the open questions and the contract in [contracts/rooms.md](contracts/rooms.md).
2. State machine tests first, then endpoints and persistence, then frontend wiring.
3. Run the manual checks in [quickstart.md](quickstart.md) with two real browsers.
4. A story is done only when its acceptance scenarios pass against the real backend.

## Risks

- Start without consent may conflict with AGENTS.md section 7 (open question 1).
- Two backend languages (Java API, Python domain reference) risk divergent rules.
- Sample frontend screens must be clearly replaced, not mixed with live data.
