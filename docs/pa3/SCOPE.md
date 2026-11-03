# PA3 scope: shrunk Build 1, FG-03, extra prep

Team deadline: **Fri 2026-11-13**. PA3 grades FG-03 end to end, Spec Kit artifacts and the documents (Parts A to F). Everything marked *extra* is prep for PA4/PA5 and must not delay those.

## Build 1, shrunk to what FG-03 needs
| Keep | Cut |
|---|---|
| Alembic migrations + seed script with mock data: `users`, `debate_topics`, `debate_rooms`, `room_participants` | Refresh-token rotation (access JWT only) |
| Register / login (Argon2id, access JWT) | Profile editing, CEFR level screens |
| Create room, join by invite code, `LOBBY` → `READY`, third user gets 409 | `LIVE` / `ENDED` beyond FG-03's synchronized start |
| Lobby UI | Separate M1 demo and smoke test: folded into the FG-03 video and E2E test |

## First deliverable (11-04): database with mock data
`docker compose up db`, `alembic upgrade head`, `python -m app.seed` gives 5 users, 10 topics (all CEFR levels) and 1 sample room in `LOBBY`. Everyone develops against this.

## Features implemented
| FG | Use cases | Status |
|---|---|---|
| FG-03 Room & Session | create room, join by code, lobby, start | Graded (Part E) |
| FG-01 User Account | register, login | Needed by FG-03 |
| FG-02 Topic Library | list and filter topics by CEFR and category | *Extra*, small, reads seeded data |

## Extra prep (stretch, after FG-03 is on track)
| Who | Item | Feeds |
|---|---|---|
| Tài | LiveKit access-token endpoint spike | PA4 FG-04 |
| Khoa | `STTAdapter` protocol + local transcription of a sample WAV | PA4 FG-05 |
| Tuấn | `LLMAdapter` protocol + grounding guard (verbatim-quote check) with unit tests | PA5 FG-06/07 |
| Triết | Microphone setup screen spike | PA4 FG-04 |
| Lộc | CI job that runs migrations + seed against Postgres | all |
