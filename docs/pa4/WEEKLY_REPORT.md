# Weekly Report (PA4)
*Performed: Nguyễn Đình Thiên Lộc (24125093); Review: Trần Lê Anh Tuấn (24125107), pending*

---

## 1. Sprint Goal
**Sprint 4 / PA4 Goal (Build 3):** Implement Functional Groups FG-03 (Room & Live Session Management) and FG-04 (Real-Time Audio Communication) using Spec Kit and record a narrated YouTube demo video, alongside comprehensive architectural models (C4 Level 1 System Context, C4 Level 2 Container, C4 Level 3 Component diagrams for backend and frontend, and Deployment diagram), revised Use-Case Specifications with `Changes.md`, and the Sprint 4 AI Usage Log and Weekly Report (Parts A–F, 75 points total).

---

## 2. Per-Member Task Table

Status is determined strictly by verified repository evidence as of **2026-11-28** (merged pull request = Done; active branch / open PR = In Review or In Progress; otherwise as recorded in member `TODO.md` files).

| Member | Jira Key | Task Summary | Status | Evidence / Notes |
|---|---|---|---|---|
| **Lộc** (24125093) | SCRUM-68 | Create `pa4` from `pa3`; merge `pa3` → `dev` | **Done** | Branch `pa4` created; PR #67 merged into `dev` (2026-11-14) |
| Lộc (24125093) | SCRUM-59 | Part D: Deployment Diagram + prose | **Done** | Finalized + PDF compiled and merged in PR #74 |
| Lộc (24125093) | SCRUM-67 | Part F2: Weekly Report & meeting minutes | **Done** | Planning, Check-in 1 & 2, Sprint Review, and `jira-board.png` merged in PR #74 |
| Lộc (24125093) | SCRUM-68 | Part S: Compile PA4 Markdown docs to PDF | In Progress | All existing Parts A–F docs compiled cleanly via `report/pdf/build.py`; awaits `DEMO_VIDEO.md` |
| Lộc (24125093) | SCRUM-68 | Freeze `CHECKLIST.md`, Git log, package `.zip` | In Progress | Checklist updated; freeze & zip wait only for `E6`/`E7` YouTube demo (`AGENTS.md` §10) |
| Lộc (24125093) | SCRUM-52 | Refine waiting/ready lobbies & accessibility | Deferred / Closed | Dropped from PA4 (not in `PA4_OVERVIEW.md`; superseded by Triết's PR #70/#71/#73/#82) |
| **Triết** (24125047) | SCRUM-58 | Part C3: C4 Level 3 Frontend Components | **Done** | Updated and compiled to PDF in PR #74 |
| Triết (24125047) | SCRUM-61 | Part E2: FG-03 Frontend (Setup, Join, Lobby) | **Done** | PR #70 and PR #82 merged into `pa4` |
| Triết (24125047) | SCRUM-63 | Part E4: FG-04 Frontend (LiveKit, audio UI) | **Done** | PR #71, PR #73, and PR #82 (210/210 Playwright tests) merged into `pa4` |
| Triết (24125047) | SCRUM-65 | Part E6/E7: Narrated YouTube demo video | To Do | Two-browser test verified against backend (PR #82); recording & `docs/pa4/DEMO_VIDEO.md` pending |
| **Tài** (24125078) | SCRUM-55 | Part B: C4 Level 1 System Context + stack | **Done** | Compiled to PDF and merged in PR #74 |
| Tài (24125078) | SCRUM-60 | Part E1: FG-03 Backend (Room API & DB) | **Done** | `RoomController`, `RoomService`, entities, repos merged into `pa4` (PR #78) |
| Tài (24125078) | SCRUM-62 | Part E3: FG-04 Backend (LiveKit token API) | **Done** | `POST /rooms/{id}/token` (`RoomService.token()`, Jackson 3 JWT) merged into `pa4` (PR #78) |
| **Khoa** (24125058) | SCRUM-56 | Part C1: C4 Level 2 Container Diagram | **Done** | Aligned with code + PDF compiled and merged into `pa4` (PR #78) |
| Khoa (24125058) | SCRUM-57 | Part C2: C4 Level 3 Backend Components | **Done** | Aligned with code + PDF compiled and merged into `pa4` (PR #79) |
| Khoa (24125058) | SCRUM-64 | Part E5: Spec Kit (`specs/006-`, `specs/007-`) | **Done** | PR #80 (Spec Kit), PR #81 (audio worker), and PR #83 (CI ruff fix) merged into `pa4` |
| **Tuấn** (24125107) | SCRUM-54 | Part A: Revised Use Cases + `Changes.md` | **Done** | Review fixes applied (11+ Mermaid diagrams, credits, PDFs) and merged into `pa4` (PR #72) |
| Tuấn (24125107) | SCRUM-66 | Part F1: AI Usage Log (all 5 members) | **Done** | Finalized with PDF and merged into `pa4` (PR #74) |

---

## 3. Work Completed So Far (with Commit & PR Evidence)

1. **Sprint 4 Task Planning & Workspace Setup:**
   - Commit `a98d181` (2026-11-17, Khoa): Initialized `docs/pa4/README.md`, `docs/pa4/CHECKLIST.md`, `docs/pa4/create_pa4_jira_issues.py`, and member `TODO.md` files.
   - Commit `ef607a4` (2026-11-17, Khoa): Added `STTAdapter` protocol implementation and unit tests (`api/app/adapters/stt.py`, `tests/unit/test_stt_adapter.py`).

2. **Prototype Cleanup & UI Refresh:**
   - **PR #68** (merged 2026-11-17, `4bd5201`): Removed PA3 Part D clickable prototype per grading scope while retaining prototype UI screenshots (`docs/pa3/`).
   - **PR #69** (merged 2026-11-19, `3d3c3f8`): Merged UI refresh (`feature/SCRUM-53-ui-refresh`) into `pa4`.

3. **FG-03 & FG-04 Full-Stack Implementation, Spec Kit, and CI Fixes:**
   - **PR #70** (merged 2026-11-21, `7676197`): Merged FG-03 room flow frontend (`web/src/pages/rooms/`, `web/src/rooms/`, Playwright tests).
   - **PR #71** (merged 2026-11-23, `d86968e`): Merged FG-04 LiveKit live debate stage (`LiveStage.tsx`, `debateAudio.ts`, `WrapUp.tsx`, `clock.ts`, `spotlight.ts`).
   - **PR #73** (merged 2026-11-26, `97694af`): Merged typed-turn fallback (`TypePanel.tsx`, `useTypedTurns.ts`), local mock API (`web/mock-local/`), `web/DEV_GUIDE.md`, and `docs/api/`.
   - **PR #80** (merged 2026-11-28, `d81ddc6`): Merged Spec Kit artifacts `specs/006-fg03-rooms/` and `specs/007-fg04-audio/`.
   - **PR #81** (merged 2026-11-28, `68a773e`): Merged WebRTC audio pipeline worker (`workers/audio_pipeline.py`, `tests/unit/test_audio_pipeline.py`).
   - **PR #82** (merged 2026-11-28, `475c935`): Merged room flow bugfixes (token renewal, Voice/Type lock, mic RMS `0.08`, partner `TrackPublished`, 210/210 Playwright tests).
   - **PR #83** (merged 2026-11-28, `0e95efd`): Fixed `ruff` lint and format issues across Python workers/tests (`166/166` pytest tests passing).

4. **Architecture, Use Cases, Backend Room API & Sprint Docs Merged (2026-11-28):**
   - **PR #78** (merged 2026-11-28, `166eb70`): Restored `api/app/`, fixed Jackson 3 LiveKit JWT serialization and JDBC port `5432`, merged `RoomController` / `RoomService` + entities/repos (FG-03 & FG-04 backend) and `ARCHITECTURE_C4_CONTAINER.md` + PDF.
   - **PR #79** (merged 2026-11-28, `e629478`): Merged aligned `ARCHITECTURE_C4_COMPONENTS_BE.md` + PDF.
   - **PR #72** (merged 2026-11-28, `380d28d`): Merged Part A (`Changes.md`, `USE_CASE_MODEL.md` with all 11+ Mermaid diagrams, `USE_CASE_SPECIFICATIONS.md`, and all 3 PDFs).
   - **PR #74** (merged 2026-11-28): Merged Part B/C3/D/F1/F2 docs + PDFs, `docs/pa4/screenshots/jira-board.png`, `docs/reference/AI_SKILLS_GUIDE.md`, and updated `CHECKLIST.md`.

---

## 4. Risks and Blockers

- **Remaining Deliverable Before Freeze (as of 2026-11-28):**
  - Parts A, B, C, D, F, and all FG-03/FG-04 code (`E1`–`E5`) are merged and compiled to PDF on `pa4`.
  - Only **E6/E7 (Narrated YouTube Demo Video + `docs/pa4/DEMO_VIDEO.md`)** remains missing. Per `AGENTS.md` §10, `PA4-Group02.zip` (`S1`–`S5`) and `pa4` → `dev` merge remain paused until Triết adds `DEMO_VIDEO.md` and `DEMO_VIDEO.pdf` is built.

---

## 5. Scrum Check-in 1

**Date & Time:** Tuesday 24 November 2026, 21:30, Google Meet  
**Team members present:** All five: Nguyễn Đình Thiên Lộc (24125093), Nguyễn Bảo Minh Triết (24125047), Nguyễn Hồng Tấn Tài (24125078), Nguyễn Anh Khoa (24125058), Trần Lê Anh Tuấn (24125107).  
**Team members absent:** None.  

### Status Reports
Status as of the meeting, from Git and GitHub.

| Member | Completed | To do | Obstacles |
|---|---|---|---|
| Lộc | Deployment diagram and weekly report drafts; graphify and Spec Kit guide (22 Nov) | Reviews, PDFs, checklist, package | Waits on the other parts |
| Triết | FG-03 frontend merged (PR #70, 21 Nov); live stage and typed turns built (PR #71 opened 23 Nov) | C4 frontend components; demo video | No room or token backend to connect to |
| Tài | FG-01 auth backend (before the sprint) | C4 system context; FG-03 room API; FG-04 token API | No sprint commits yet |
| Khoa | STTAdapter (SCRUM-46, 17 Nov); C4 container and backend component drafts pushed (24 Nov) | Spec Kit for FG-03 and FG-04; open PRs for the C4 drafts | None recorded |
| Tuấn | Reviewed and merged PR #69 (19 Nov) | Part A use cases and `Changes.md`; AI usage log | No PA3 TA feedback found |

### Summary of Meeting
- Khoa is Scrum master for this week.

---

## 6. Scrum Check-in 2

**Date & Time:** Friday 27 November 2026, 22:00, Google Meet  
**Team members present:** All five: Nguyễn Đình Thiên Lộc (24125093), Nguyễn Bảo Minh Triết (24125047), Nguyễn Hồng Tấn Tài (24125078), Nguyễn Anh Khoa (24125058), Trần Lê Anh Tuấn (24125107).  
**Team members absent:** None.  

### Status Reports
Status as of 2026-11-27 22:00, verified against Git and GitHub.

| Member | Completed | To do | Obstacles |
|---|---|---|---|
| Lộc | Reviewed PR #72 (`CHANGES_REQUESTED`); drafted C4 Context (Part B), C4 FE Components (Part C3), Spec Kit specs, and AI Usage Log on PR #74 | Sync PR #74 with `pa4`, finalize Check-in 2, compile PDFs, wait for freeze | Cannot freeze or build final PDFs until teammates' PRs merge |
| Triết | FG-04 live stage (PR #71, 23 Nov) and typed turns + mock API (PR #73, 26 Nov) merged into `pa4` | Review/take over C4 FE Components draft; record YouTube demo video | Backend room & LiveKit token APIs not merged yet |
| Tài | No merged commits or open PRs as of 22:00 | Review/take over C4 Context draft; deliver FG-03 Room API & FG-04 LiveKit Token API | Behind schedule on backend critical path |
| Khoa | C4 Container and BE Component branches pushed (24 Nov); preparing PRs and Spec Kit (`specs/006-`, `specs/007-`) | Open PRs for C4 Container, C4 BE Components, and Spec Kit artifacts | Needs Tài's backend alignment for C4/API consistency |
| Tuấn | Opened PR #72 (25 Nov) for Part A (`Changes.md`, Use Cases) | Address Lộc's blocking review comments on PR #72; finalize AI Usage Log | Needs Moodle check for PA3 TA feedback and diagram restoration |

### Summary of Meeting
- **Deadline alignment:** The team reviewed progress across all PA4 deliverables (Parts A–F) to meet the upcoming submission deadline.
- **Unblocking critical path:** Prioritized accelerating Tài's FG-03 Room API and FG-04 LiveKit Token API so Triết can verify end-to-end integration and record the narrated YouTube demo video.
- **Review & documentation follow-ups:** Agreed to push open C4 PRs (Khoa), resolve the blocking comments on PR #72 (Tuấn), and confirm/take over the draft documents prepared by Lộc on PR #74.

---

## 7. Sprint Review & Retrospective

**Date & Time:** Saturday 28 November 2026 (full minutes in `docs/pa4/MEETINGS/SPRINT_REVIEW.md`)  
**Team members present:** All five: Nguyễn Đình Thiên Lộc (24125093), Nguyễn Bảo Minh Triết (24125047), Nguyễn Hồng Tấn Tài (24125078), Nguyễn Anh Khoa (24125058), Trần Lê Anh Tuấn (24125107).  
**Team members absent:** None.  

### Sprint Results & Increment Review
- **Delivered & Merged on `pa4`:** Part A (`Changes.md`, 11+ diagram `USE_CASE_MODEL.md`, `USE_CASE_SPECIFICATIONS.md`, PR #72), Part B (`ARCHITECTURE_C4_CONTEXT.md`), Part C (`ARCHITECTURE_C4_CONTAINER.md` PR #78, `ARCHITECTURE_C4_COMPONENTS_BE.md` PR #79, `ARCHITECTURE_C4_COMPONENTS_FE.md`), Part D (`DEPLOYMENT_DIAGRAM.md`), Part E1–E5 (FG-03 & FG-04 frontend PR #70/#71/#73/#82, Spring Boot Room & LiveKit Token backend PR #78, Spec Kit PR #80, audio worker PR #81/#83), and Part F (`AI_USAGE_LOG.md`, `WEEKLY_REPORT.md`, `MEETINGS/`, `jira-board.png`).
- **Remaining:** Narrated YouTube demo video (`docs/pa4/DEMO_VIDEO.md`) and final freeze package (`PA4-Group02.zip` + `pa4` → `dev`).

### Retrospective
- **What went well:** Contract-first frontend development (`web/API_CONTRACT.md` + local mock API) unblocked 210 Playwright tests early; Spec Kit & audio worker tests shipped; Tài implemented all 13 backend room/token/turn endpoints; thorough reviews and team-authorized PR fixes resolved `api/app/` deletion, ruff lint errors, C4 diagram drift, and Part A diagram restoration cleanly.
- **What went wrong:** Backend code was pushed onto Khoa's C4 Container branch (PR #78) and deleted `api/app/`; C4 diagrams initially drifted from actual code and `docker-compose.yml`; PR #81 merged with 7 `ruff` errors breaking Backend CI; Part A rework (PR #72) and demo recording slipped to the end of the sprint; legacy PA3 cards remained on the Jira board.
- **Root causes:** `pa4` lacked a green-CI merge gate; pushing code onto another member's documentation branch without inspecting `git status`; diagramming from planning notes instead of merged files; single-owner backend bottleneck.
- **What to do differently in Sprint 5 / PA5:** Enforce green CI checks (including Spring Boot + Postgres CI) before merging into `pa5`; strictly one ticket per branch/PR; verify diagrams directly against live code; freeze backend APIs at least 3 days before deadline; clean up Jira carry-over items at Sprint Planning.

### Action Items for PA4 Freeze & Sprint 5
- **Triết:** Record and publish the narrated YouTube demo video (`docs/pa4/DEMO_VIDEO.md`).
- **Lộc:** Build `DEMO_VIDEO.pdf`, export `GIT_LOG.txt`, package `PA4-Group02.zip`, and merge `pa4` → `dev` once `CHECKLIST.md` is 100% `Complete`.
- **Whole team (Sprint 5 kickoff):** Adopt updated Spring Boot + PostgreSQL 16 CI and Docker Compose `--profile full` workflow, and clean up the Sprint 5 Jira backlog.

---

## 8. Jira Board

![Sprint 4 Jira Board (2026-11-28)](screenshots/jira-board.png){ width=100% }

*Captured on 2026-11-28 (`docs/pa4/screenshots/jira-board.png`). Board shows Sprint 4 columns: To Do (14, including carry-over PA3 items SCRUM-44, 49–51), In Progress (4: SCRUM-57, 58, 64, 65), In Review (0), and Done (5: SCRUM-53, 56, 61, 63, plus 1 additional item). Note: subsequent merges on 2026-11-28 completed PR #72, #74, #78, #79, #82, and #83.*
