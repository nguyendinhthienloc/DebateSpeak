# Sprint Review & Retrospective (PA4, Sprint 4)
*Performed: Nguyễn Đình Thiên Lộc (24125093) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Đình Thiên Lộc (24125093)*

**Methodology:** Scrum  
**Date & Time:** Saturday 28 November 2026 (drafted for team confirmation and sign-off before freeze)  
**Team members present:** Nguyễn Đình Thiên Lộc (24125093), Nguyễn Bảo Minh Triết (24125047), Nguyễn Hồng Tấn Tài (24125078), Nguyễn Anh Khoa (24125058), Trần Lê Anh Tuấn (24125107).  
**Team members absent:** None.

---

## 1. Sprint Results (Verified as of 2026-11-28)

Status below reflects verified repository, pull request, and CI state as of **2026-11-28**.

| PA4 Part | Planned Scope | Owner | Status as of 2026-11-28 | Verified Evidence |
|---|---|---|---|---|
| Part A (5 pts) | Revised Use-Case Model & Specifications + `Changes.md` | Tuấn | In Review | PR #72 open (`CHANGES_REQUESTED` by Lộc on 2026-11-27; awaiting Tuấn's fixes) |
| Part B (15 pts) | C4 Level 1 System Context Diagram + Tech Stack | Tài | Draft | Draft prepared by Lộc on PR #74 (`docs/pa4/ARCHITECTURE_C4_CONTEXT.md`); awaiting Tài's confirmation |
| Part C1 (20 pts) | C4 Level 2 Container Diagram | Khoa | In Review | PR #78 open into `pa4` (`CHANGES_REQUESTED` by Lộc on 2026-11-28) |
| Part C2 (20 pts) | C4 Level 3 Backend Component Diagram | Khoa | In Review | PR #79 open into `pa4` (`CHANGES_REQUESTED` by Lộc on 2026-11-28) |
| Part C3 (20 pts) | C4 Level 3 Frontend Component Diagram | Triết | Draft | Draft prepared by Lộc on PR #74 (`docs/pa4/ARCHITECTURE_C4_COMPONENTS_FE.md`); awaiting Triết's confirmation |
| Part D (5 pts) | UML Deployment Diagram + infrastructure prose | Lộc | In Review | Finalized + PDF compiled on PR #74 (`docs/pa4/DEPLOYMENT_DIAGRAM.md`) |
| Part E1 (25 pts) | FG-03 Backend (Spring Boot Room API & DB) | Tài | Draft (In Review) | Implemented in `RoomController` / `RoomService` (`e9601d9` on PR #78); `CHANGES_REQUESTED` (accidentally deletes `api/app/`) |
| Part E2 (25 pts) | FG-03 Frontend (Create/Join Room, Lobby sync) | Triết | **Done** | PR #70 merged into `pa4` (2026-11-21); demo fixes approved in PR #82 |
| Part E3 (25 pts) | FG-04 Backend (LiveKit Token API) | Tài | Draft (In Review) | `POST /api/v1/rooms/{id}/token` implemented in `RoomService.token()` on PR #78; awaits separation & merge |
| Part E4 (25 pts) | FG-04 Frontend (LiveKit Client SDK, audio, typed turns) | Triết | **Done** | PR #71 & PR #73 merged into `pa4`; demo fixes approved in PR #82 (210/210 Playwright tests pass) |
| Part E5 (25 pts) | Spec Kit artifacts (`specs/006-`, `specs/007-`) | Khoa | **Done** | PR #80 merged into `pa4` (2026-11-28); audio worker PR #81 also merged (with 7 ruff lint errors to fix) |
| Part E6/E7 (25 pts) | Narrated YouTube Demo Video (`DEMO_VIDEO.md`) | Triết | To Do | Two-browser test against backend verified in PR #82; recording & `docs/pa4/DEMO_VIDEO.md` pending |
| Part F1 (5 pts) | Sprint 4 AI Usage Log | Tuấn | Draft | Draft prepared by Lộc on PR #74 (`docs/pa4/AI_USAGE_LOG.md`); awaiting Tuấn's confirmation |
| Part F2 (5 pts) | Weekly Report, Meeting Minutes, Jira screenshots | Lộc | In Progress | Planning, Check-in 1 & 2, Review minutes, and `jira-board.png` on PR #74; `burndown.png` pending |
| Part S | PDF builds, `CHECKLIST.md`, Git log, `PA4-Group02.zip` | Lộc | In Progress | Blocked until Parts A–F are complete and merged (`AGENTS.md` §10) |

---

## 2. Increment Review (Build 3 — FG-03 & FG-04)

- **FG-03 (Room & Live Session Management):**
  - Frontend flow (`CreateRoomPage.tsx`, `JoinDialog.tsx`, `InviteView.tsx`, `AgreeView.tsx`, `RoomPage.tsx`) is merged on `pa4` with full contract coverage (`web/API_CONTRACT.md`) and Playwright tests.
  - Spring Boot Room API (`RoomController`, `RoomService`, entities, repositories) implements all room, ready, leave, cancel, and end endpoints on PR #78, but cannot merge until `api/app/` deletion is reverted and backend changes are split from PR #78.
- **FG-04 (Real-Time Audio Communication):**
  - Frontend LiveKit Client SDK stage (`LiveStage.tsx`, `debateAudio.ts`, `TypePanel.tsx`, `WrapUp.tsx`, `useMicCheck.ts`) is merged on `pa4`; PR #82 (210/210 Playwright tests passing, approved by Lộc) resolves token renewal, Voice/Type locking after Ready, mic noise threshold (`0.08`), and partner `TrackPublished` chip status.
  - LiveKit token minting (`POST /api/v1/rooms/{id}/token`) is implemented inside `RoomService.token()` on PR #78 (tested in two browsers per PR #82 description), pending JSON serialization cleanup (`ObjectMapper`) and merge.
  - `workers/audio_pipeline.py` (PR #81) merged deterministic per-speaker audio track buffering and unit tests (`tests/unit/test_audio_pipeline.py`), but introduced 7 `ruff` lint errors on `pa4`.

---

## 3. Retrospective

- **What went well:**
  - **Contract-first frontend delivery:** Triết shipped `web/API_CONTRACT.md`, a working in-memory local mock API (`web/mock-local/mockApi.ts`), and 210 automated Playwright tests early, allowing parallel testing before the backend arrived.
  - **Spec Kit & audio pipeline coverage:** Khoa completed Spec Kit artifacts (`specs/006-fg03-rooms/`, `specs/007-fg04-audio/`, PR #80) and deterministic speaker-attribution worker tests (PR #81).
  - **Full API contract coverage by backend:** Tài's `RoomController` / `RoomService` implemented all 13 endpoints from `web/API_CONTRACT.md`, including `POST /rooms/{id}/token`, typed turns, row locks, and CORS `PUT` support.
  - **Rigorous peer review:** Code and document reviews caught rubric-breaking gaps early (dropped diagrams and missing credits in PR #72, deleted `api/app/` and C4 drift in PR #78/#79).

- **What went wrong:**
  - **Accidental deletion & mixed PR scope:** Backend Room/LiveKit code (`e9601d9`) was pushed onto Khoa's C4 Container branch (PR #78) and deleted all 20 files under `api/app/`.
  - **Diagram-to-code drift:** C4 Container (PR #78) and C4 Backend Component (PR #79) diagrams depicted planned components (Caddy reverse proxy, WebSocket room sync, Spring Data Redis, `LiveKitController`, `SileroVADProcessor`) as already live, and used old room state names (`WAITING/IN_DEBATE` instead of `LOBBY/READY/LIVE`).
  - **Broken Backend CI on `pa4`:** PR #81 was merged into `pa4` despite failing the `Backend (Python / FastAPI)` ruff check (7 lint errors in `workers/audio_pipeline.py`), causing subsequent PRs (#74, #78, #79, #82) to show red Backend CI.
  - **Late Part A rework & demo recording:** PR #72 remains open with unresolved blocking comments since 2026-11-27, compressing final PDF builds and YouTube demo recording into the end of the sprint.
  - **Jira board hygiene:** Legacy PA3 tickets (`SCRUM-44`, `SCRUM-49`, `SCRUM-50`, `SCRUM-51`) remained in the Sprint 4 To Do column.

- **Root causes:**
  - Branch protection on `pa4` did not enforce green CI checks before merge.
  - Pushed backend commits onto a teammate's documentation branch without inspecting `git status` / deleted files.
  - Architecture diagrams were drafted from earlier planning notes instead of directly verifying merged files (`docker-compose.yml`, `web/API_CONTRACT.md`, `application.properties`, `workers/`).
  - Sequential dependency on a single backend owner delayed E2E verification and demo recording.

- **What to do differently in Sprint 5 (PA5):**
  - Require all GitHub Actions CI checks (`ruff`, `pytest`, `npm run build`, security invariants) to pass before merging any PR into `pa5`.
  - Enforce **one Jira ticket per branch/PR** — never push code commits onto another member's documentation branch.
  - Verify every architecture diagram node, route, state name, and package path directly against merged repository code before opening a PR.
  - Freeze backend/API integrations at least 3 days before the sprint deadline so demo recording, PDF compilation, and freeze checks are never rushed.
  - Clean up carry-over tickets on the Jira board during Sprint Planning.

---

## 4. Action Items (Immediate PA4 Freeze & Sprint 5 Carryover)

| Action Item | Owner | Target Date | Status |
|---|---|---|---|
| Fix 7 `ruff` lint errors in `workers/audio_pipeline.py` on `pa4` to restore green Backend CI | Khoa | Immediate (before PA4 freeze) | Open |
| Restore `api/app/` in PR #78, split Spring Boot Room/Token API to its own branch, fix `liveKitToken()` JSON serialization (`ObjectMapper`) and port `5432` | Tài | Immediate (before PA4 freeze) | Open |
| Align `ARCHITECTURE_C4_CONTAINER.md` (PR #78) and `ARCHITECTURE_C4_COMPONENTS_BE.md` (PR #79) with actual code & mark unimplemented parts `[Planned]` | Khoa | Immediate (before PA4 freeze) | Open |
| Address blocking review comments on PR #72 (`Changes.md`, restore 11 Mermaid diagrams, Triết's credits, Moodle check) and finalize `AI_USAGE_LOG.md` | Tuấn | Immediate (before PA4 freeze) | Open |
| Review/confirm Lộc's C4 drafts (Part B, C3), merge PR #82, and record narrated YouTube demo (`docs/pa4/DEMO_VIDEO.md`) once backend merges | Triết & Tài | Immediate (before PA4 freeze) | Open |
| Capture `burndown.png`, build remaining PDFs after all PRs merge, export `GIT_LOG.txt`, package `PA4-Group02.zip`, and merge `pa4` → `dev` | Lộc | After all `CHECKLIST.md` rows are `Complete` | Blocked on above |
| Enforce green CI gate and clean Jira sprint backlog at PA5 kickoff | Lộc & Khoa | Sprint 5 Kickoff | Planned |
