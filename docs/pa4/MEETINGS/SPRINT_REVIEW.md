# Sprint Review & Retrospective (PA4, Sprint 4)
*Performed: Nguyễn Đình Thiên Lộc (24125093) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Đình Thiên Lộc (24125093)*

**Methodology:** Scrum  
**Date & Time:** Saturday 28 November 2026  
**Team members present:** Nguyễn Đình Thiên Lộc (24125093), Nguyễn Bảo Minh Triết (24125047), Nguyễn Hồng Tấn Tài (24125078), Nguyễn Anh Khoa (24125058), Trần Lê Anh Tuấn (24125107).  
**Team members absent:** None.

---

## 1. Sprint Results (Verified as of 2026-11-28)

Status below reflects verified repository, pull request, and CI state as of **2026-11-28** after all Parts A–F documentation and implementation PRs were fixed, verified, and merged into `pa4`.

| PA4 Part | Planned Scope | Owner | Status as of 2026-11-28 | Verified Evidence |
|---|---|---|---|---|
| Part A (5 pts) | Revised Use-Case Model & Specifications + `Changes.md` | Tuấn | **Done** | PR #72 fixed (11+ Mermaid diagrams, credits, PDFs) & merged into `pa4` |
| Part B (15 pts) | C4 Level 1 System Context Diagram + Tech Stack | Tài | **Done** | `ARCHITECTURE_C4_CONTEXT.md` + PDF merged into `pa4` (PR #74) |
| Part C1 (20 pts) | C4 Level 2 Container Diagram | Khoa | **Done** | Aligned with `pa4` code + PDF merged into `pa4` (PR #78) |
| Part C2 (20 pts) | C4 Level 3 Backend Component Diagram | Khoa | **Done** | Aligned with `pa4` code + PDF merged into `pa4` (PR #79) |
| Part C3 (20 pts) | C4 Level 3 Frontend Component Diagram | Triết | **Done** | Updated for merged PR #70/#71/#73/#82 + PDF merged into `pa4` (PR #74) |
| Part D (5 pts) | UML Deployment Diagram + infrastructure prose | Lộc | **Done** | `DEPLOYMENT_DIAGRAM.md` + PDF merged into `pa4` (PR #74) |
| Part E1 (25 pts) | FG-03 Backend (Spring Boot Room API & DB) | Tài | **Done** | `RoomController` / `RoomService` + entities/repos merged into `pa4` (PR #78) |
| Part E2 (25 pts) | FG-03 Frontend (Create/Join Room, Lobby sync) | Triết | **Done** | PR #70 and PR #82 merged into `pa4` |
| Part E3 (25 pts) | FG-04 Backend (LiveKit Token API) | Tài | **Done** | `POST /api/v1/rooms/{id}/token` (`RoomService.token()`, Jackson 3 JWT) merged (PR #78) |
| Part E4 (25 pts) | FG-04 Frontend (LiveKit Client SDK, audio, typed turns) | Triết | **Done** | PR #71, PR #73, and PR #82 (210/210 Playwright tests pass) merged into `pa4` |
| Part E5 (25 pts) | Spec Kit artifacts (`specs/006-`, `specs/007-`) | Khoa | **Done** | PR #80 (Spec Kit), PR #81 (audio worker), and PR #83 (CI ruff fix) merged into `pa4` |
| Part E6/E7 (25 pts) | Narrated YouTube Demo Video (`DEMO_VIDEO.md`) | Triết | To Do | Two-browser E2E verified; recording & `docs/pa4/DEMO_VIDEO.md` pending |
| Part F1 (5 pts) | Sprint 4 AI Usage Log | Tuấn | **Done** | `AI_USAGE_LOG.md` + PDF merged into `pa4` (PR #74) |
| Part F2 (5 pts) | Weekly Report, Meeting Minutes, Jira board screenshot | Lộc | **Done** | `WEEKLY_REPORT.md`, `MEETINGS/`, `jira-board.png` + PDFs merged (PR #74) |
| Part S | PDF builds, `CHECKLIST.md`, Git log, `PA4-Group02.zip` | Lộc | In Progress | All existing PDFs built; waits only on `DEMO_VIDEO.md` (`E6`/`E7`) before freeze (`AGENTS.md` §10) |

---

## 2. Increment Review (Build 3 — FG-03 & FG-04)

- **FG-03 (Room & Live Session Management):**
  - Frontend flow (`CreateRoomPage.tsx`, `JoinDialog.tsx`, `InviteView.tsx`, `AgreeView.tsx`, `RoomPage.tsx`) and Spring Boot Room API (`RoomController`, `RoomService`, entities, repositories) are merged on `pa4` with full `web/API_CONTRACT.md` coverage.
- **FG-04 (Real-Time Audio Communication):**
  - Frontend LiveKit Client SDK stage (`LiveStage.tsx`, `debateAudio.ts`, `TypePanel.tsx`, `WrapUp.tsx`, `useMicCheck.ts`) is merged on `pa4` (210/210 Playwright tests passing, PR #82).
  - LiveKit token minting (`POST /api/v1/rooms/{id}/token`) is merged in `RoomService.token()` (PR #78), using Jackson 3 `ObjectMapper` serialization and aligned DB port `5432`.
  - `workers/audio_pipeline.py` (PR #81 + PR #83 CI fix) implements deterministic per-speaker audio track buffering and unit tests (`166/166` pytest tests passing).

---

## 3. Retrospective

- **What went well:**
  - **Contract-first frontend delivery:** Triết shipped `web/API_CONTRACT.md`, a working local mock API (`web/mock-local/mockApi.ts`), and 210 Playwright tests early, allowing parallel UI verification before the backend merged.
  - **Spec Kit & audio pipeline coverage:** Khoa completed Spec Kit artifacts (`specs/006-fg03-rooms/`, `specs/007-fg04-audio/`, PR #80) and deterministic speaker-attribution worker tests (PR #81, PR #83).
  - **Full API contract coverage & collaborative fixes:** Tài's `RoomController` / `RoomService` implemented all 13 endpoints from `web/API_CONTRACT.md`, and team-authorized review fixes resolved `api/app/` restoration, Jackson 3 JWT serialization, C4 diagram alignment, and Part A diagram restoration prior to merge.

- **What went wrong:**
  - **Accidental deletion & mixed PR scope:** Backend Room/LiveKit code (`e9601d9`) was pushed onto Khoa's C4 Container branch (PR #78) and deleted all 20 files under `api/app/`.
  - **Diagram-to-code drift:** Initial C4 Container (PR #78) and C4 Backend Component (PR #79) drafts depicted planned components (Caddy reverse proxy, WebSocket room sync, Spring Data Redis, `LiveKitController`, `SileroVADProcessor`) as already live, and used old room state names (`WAITING/IN_DEBATE` instead of `LOBBY/READY/LIVE`).
  - **Broken Backend CI on `pa4`:** PR #81 merged into `pa4` with 7 `ruff` lint errors in `workers/audio_pipeline.py` (later fixed by PR #83).
  - **Late Part A rework & demo recording:** PR #72 required substantial revision (restoring dropped Mermaid diagrams and PA3 credits), and YouTube demo recording (`E6`/`E7`) remained outstanding at sprint review.
  - **Jira board hygiene:** Legacy PA3 tickets (`SCRUM-44`, `SCRUM-49`, `SCRUM-50`, `SCRUM-51`) remained in the Sprint 4 To Do column.

- **Root causes:**
  - Branch protection on `pa4` did not enforce green CI checks before merge, and CI still checked the legacy FastAPI/Alembic scaffold rather than the active Java 17 Spring Boot backend.
  - Backend commits were pushed onto a teammate's documentation branch without inspecting `git status` / deleted files.
  - Architecture diagrams were drafted from earlier planning notes instead of verifying merged files (`docker-compose.yml`, `web/API_CONTRACT.md`, `application.properties`, `workers/`).
  - Sequential dependency on a single backend owner delayed E2E verification and demo recording.

- **What to do differently in Sprint 5 (PA5):**
  - Replace FastAPI/Alembic CI with active Java 17 Spring Boot + PostgreSQL 16 CI alongside Python worker CI and Docker Compose validation, and enforce green checks before merging into `pa5`.
  - Enforce **one Jira ticket per branch/PR** — never push code commits onto another member's documentation branch.
  - Verify every architecture diagram node, route, state name, and package path directly against merged repository code before opening a PR.
  - Freeze backend/API integrations at least 3 days before the sprint deadline so demo recording, PDF compilation, and freeze checks are never rushed.
  - Clean up carry-over tickets on the Jira board during Sprint Planning.

---

## 4. Action Items (PA4 Freeze & Sprint 5 Carryover)

| Action Item | Owner | Target Date | Status |
|---|---|---|---|
| Record narrated YouTube demo video and commit `docs/pa4/DEMO_VIDEO.md` | Triết | Immediate (before PA4 freeze) | Open |
| Build `DEMO_VIDEO.pdf`, export `GIT_LOG.txt`, package `PA4-Group02.zip`, and merge `pa4` → `dev` | Lộc | Once `DEMO_VIDEO.md` merges | Waiting on `E6`/`E7` |
| Overhaul `.github/workflows/ci.yml` (Spring Boot + Postgres 16 CI, Python Worker CI, Docker CI) & add Dockerfiles (`api/authify/`, `web/`) | Lộc | Immediate / PA5 setup | In Progress |
| Clean up carry-over Jira backlog items at Sprint 5 kickoff | Whole team | Sprint 5 Kickoff | Planned |
