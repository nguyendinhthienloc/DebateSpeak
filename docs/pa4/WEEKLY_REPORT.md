# Weekly Report (PA4)

*Performed: Nguyễn Đình Thiên Lộc (24125093); Review: Trần Lê Anh Tuấn (24125107), pending*

---

## 1. Sprint Goal
**Sprint 4 / PA4 Goal (Build 3):** Implement Functional Groups FG-03 (Room & Live Session Management) and FG-04 (Real-Time Audio Communication) using Spec Kit and record a narrated YouTube demo video, alongside comprehensive architectural models (C4 Level 1 System Context, C4 Level 2 Container, C4 Level 3 Component diagrams for backend and frontend, and Deployment diagram), revised Use-Case Specifications with `Changes.md`, and the Sprint 4 AI Usage Log and Weekly Report (Parts A–F, 75 points total).

---

## 2. Per-Member Task Table

Status is determined strictly by verified repository evidence (merged pull request = Done; active branch = In Progress; otherwise as recorded in member `TODO.md` files).

| Member | Student ID | Team Role | Jira Key | Task Summary | Status | Evidence / Notes |
|---|---|---|---|---|---|---|
| **Nguyễn Đình Thiên Lộc** | 24125093 | DevOps & QA / Fact-Checking Lead | SCRUM-68 | Sprint setup: create `pa4` branch from `pa3`, merge `pa3` to `dev` | **Done** | Branch `pa4` created; PR #67 merged `pa3` into `dev` on 2026-11-14 |
| Nguyễn Đình Thiên Lộc | 24125093 | DevOps & QA / Fact-Checking Lead | SCRUM-59 | Part D: Deployment Diagram (Mermaid) + infrastructure prose | In Review | Drafted with PDF on `feature/SCRUM-68-graphify`; review by Khoa |
| Nguyễn Đình Thiên Lộc | 24125093 | DevOps & QA / Fact-Checking Lead | SCRUM-67 | Part F2: Weekly Report & Scrum meeting documentation | In Progress | Drafted on `feature/SCRUM-68-graphify`; meeting minutes still to fill |
| Nguyễn Đình Thiên Lộc | 24125093 | DevOps & QA / Fact-Checking Lead | SCRUM-68 | Part S: Compile all PA4 Markdown documents to PDF | To Do | Deliverables `docs/pa4/*.pdf` missing |
| Nguyễn Đình Thiên Lộc | 24125093 | DevOps & QA / Fact-Checking Lead | SCRUM-68 | Submission: Manage `docs/pa4/CHECKLIST.md`, export Git log, package `.zip` | To Do | Awaiting sprint freeze |
| **Nguyễn Bảo Minh Triết** | 24125047 | Frontend & WebRTC/Audio Lead | SCRUM-58 | Part C3: C4 Level 3 Frontend Component Diagram | In Progress | Draft by Lộc on `feature/SCRUM-58-c4-frontend-components`; Triết to check |
| Nguyễn Bảo Minh Triết | 24125047 | Frontend & WebRTC/Audio Lead | SCRUM-61 | Part E2: FG-03 Frontend (Room Setup, Join Dialog, Room Page, Lobby sync) | **Done** | PR #70 merged into `pa4` on 2026-11-21 (commit `7676197`) |
| Nguyễn Bảo Minh Triết | 24125047 | Frontend & WebRTC/Audio Lead | SCRUM-63 | Part E4: FG-04 Frontend (LiveKit Client SDK, audio tracks, dual-consent) | **Done** | PR #71 (live stage) and PR #73 (typed turns, mock API) merged into `pa4` |
| Nguyễn Bảo Minh Triết | 24125047 | Frontend & WebRTC/Audio Lead | SCRUM-65 | Part E6: Narrated YouTube demo video for FG-03 + FG-04 | To Do | Deliverable `docs/pa4/DEMO_VIDEO.md` missing |
| **Nguyễn Hồng Tấn Tài** | 24125078 | Backend & Real-Time Media Lead | SCRUM-55 | Part B: C4 Level 1 System Context Diagram + Tech Stack prose | In Progress | Draft by Lộc on `feature/SCRUM-55-c4-system-context`; Tài to check |
| Nguyễn Hồng Tấn Tài | 24125078 | Backend & Real-Time Media Lead | SCRUM-60 | Part E1: FG-03 Backend (Room API, invite code, state machine, DB) | To Do | Not started as of 2026-11-27: no room endpoints on any branch |
| Nguyễn Hồng Tấn Tài | 24125078 | Backend & Real-Time Media Lead | SCRUM-62 | Part E3: FG-04 Backend (LiveKit token generation API endpoint) | To Do | Not started as of 2026-11-27: no token endpoint on any branch |
| **Nguyễn Anh Khoa** | 24125058 | AI Audio & Speech Pipeline Lead | SCRUM-56 | Part C1: C4 Level 2 Container Diagram (Mermaid) + protocols | In Review | Pushed to `feature/SCRUM-56-c4-container-diagram` (2026-11-24); no PR yet. Jira says Done |
| Nguyễn Anh Khoa | 24125058 | AI Audio & Speech Pipeline Lead | SCRUM-57 | Part C2: C4 Level 3 Backend Component Diagram | In Review | Pushed to `feature/SCRUM-57-c4-backend-components` (2026-11-24); no PR yet |
| Nguyễn Anh Khoa | 24125058 | AI Audio & Speech Pipeline Lead | SCRUM-64 | Part E5: Spec Kit artifacts for FG-03 & FG-04 (`specs/006-`, `specs/007-`) | In Progress | Draft by Lộc on `feature/SCRUM-64-speckit-fg03-fg04`; Khoa to check |
| **Trần Lê Anh Tuấn** | 24125107 | AI Orchestrator & Analysis Lead | SCRUM-54 | Part A: Revised Use-Case Specifications (2nd submission) + `Changes.md` | In Review | PR #72 open into `pa4`; changes requested by Lộc |
| Trần Lê Anh Tuấn | 24125107 | AI Orchestrator & Analysis Lead | SCRUM-66 | Part F1: AI Usage Log — Sprint 4 entries for all 5 members | To Do | Deliverable `docs/pa4/AI_USAGE_LOG.md` missing |

---

## 3. Work Completed So Far (with Commit & PR Evidence)

1. **Sprint 4 Task Planning & Workspace Setup:**
   - Commit `a98d181` (2026-11-17, Khoa Nguyen): Initialized `docs/pa4/README.md`, `docs/pa4/CHECKLIST.md`, `docs/pa4/create_pa4_jira_issues.py`, and individual member task files (`docs/pa4/*/TODO.md`).
   - Commit `ef607a4` (2026-11-17, Khoa Nguyen): Added SCRUM-46 `STTAdapter` protocol implementation and unit tests (`api/app/adapters/stt.py`, `tests/unit/test_stt_adapter.py`).

2. **Prototype & Specification Refinement:**
   - **Pull Request #68** (merged 2026-11-17, commit `4bd5201`): Removed PA3 Part D clickable prototype per grading scope while retaining prototype UI screenshots (`docs/pa3/`).
   - **Pull Request #69** (merged 2026-11-19, commit `3d3c3f8`): Merged UI refresh (`feature/SCRUM-53-ui-refresh`) into `pa4`, establishing typography scales, motion tokens, entrance animations, split-step registration, and page shells.

3. **FG-03 Frontend Room Flow:**
   - **Pull Request #70** (merged 2026-11-21, commit `7676197`): Merged FG-03 frontend implementation (`feature/SCRUM-61-fg03-frontend`) into `pa4`. Deliverables included:
     - Pages & Views: `CreateRoomPage.tsx`, `InviteView.tsx`, `AgreeView.tsx`, `JoinDialog.tsx`, `RoomPage.tsx`, `RoomNotice.tsx`.
     - State Management & API: `web/src/rooms/api.ts`, `web/src/rooms/contracts.ts`, `web/src/rooms/useRoom.ts`, `web/src/rooms/useMicCheck.ts`.
     - Automated Browser Tests: `room-create.spec.ts`, `room-invite.spec.ts`, `room-agree.spec.ts`, `room-page.spec.ts`, `room-routes.spec.ts`.

4. **Sprint Management & Documentation in Progress:**
   - Branch `feature/SCRUM-68-graphify` (Lộc): Drafted `docs/pa4/MEETINGS/SPRINT_PLANNING.md` and `docs/pa4/WEEKLY_REPORT.md`.
   - Same branch: `docs/pa4/DEPLOYMENT_DIAGRAM.md` and its PDF (SCRUM-59).

---

## 4. Risks and Blockers

- **Missing PA4 Deliverables Across All Parts (per `docs/pa4/CHECKLIST.md`):**
  - As of 2026-11-22, all checklist entries except sprint setup and frontend room components are marked `Missing`. Accelerated execution across all five members is required.
- **Backend FG-03 & FG-04 API Delivery:**
  - FG-03 backend endpoints (`POST /api/v1/rooms`, `POST /api/v1/rooms/join`, `POST /api/v1/rooms/{id}/ready`) and FG-04 LiveKit token API (`POST /api/v1/rooms/{id}/token`) remain in progress with Tài and have not been merged into `pa4`. The frontend currently operates against contract definitions.
- **LiveKit Cloud Credentials & Audio End-to-End:**
  - FG-04 requires active LiveKit Cloud configuration (`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`) tested through the Spring Boot token endpoint and React LiveKit Client SDK.
- **Demo Video Recording Dependency:**
  - Triết's narrated YouTube demo (SCRUM-65) requires a fully functioning end-to-end flow across two separate browser sessions (Affirmative and Negative debaters), which is blocked until backend endpoints and audio integration are merged.
- **Strict PDF Build and Submission Freeze:**
  - Every document must compile cleanly to PDF via `report/pdf/build.py` without layout or table truncation before the freeze checklist can be marked complete.

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
> TO FILL (Lộc): what was agreed

---

## 6. Scrum Check-in 2

**Date & Time:** > TO FILL (Lộc): Date and time of Check-in 2  
**Team members present:** > TO FILL (Lộc): Team members present at Check-in 2  
**Team members absent:** > TO FILL (Lộc): Team members absent from Check-in 2  

### Status Reports
> TO FILL (Lộc): Discussion and per-member status reports (Completed, To-do, Obstacles) for Check-in 2

### Summary of Meeting
> TO FILL (Lộc): Summary of Check-in 2 meeting and agreed adjustments

---

## 7. Sprint Review & Retrospective

**Date & Time:** > TO FILL (Lộc): Date and time of Sprint Review & Retrospective  
**Team members present:** > TO FILL (Lộc): Team members present at Sprint Review & Retrospective  
**Team members absent:** > TO FILL (Lộc): Team members absent from Sprint Review & Retrospective  

### Sprint Results & Increment Review
> TO FILL (Lộc): Review of delivered increments against sprint goal (FG-03, FG-04, architecture diagrams, use cases, demo video)

### Retrospective
- **What went well:**
  - > TO FILL (Lộc): Key positive outcomes and achievements from Sprint 4
- **What went wrong:**
  - > TO FILL (Lộc): Bottlenecks, delays, and friction points encountered during Sprint 4
- **Root causes:**
  - > TO FILL (Lộc): Underlying causes of identified issues
- **What to do differently in Sprint 5 / PA5:**
  - > TO FILL (Lộc): Concrete process and technical improvements for next sprint

### Action Items for Next Sprint
> TO FILL (Lộc): Action items and assignees for next sprint

---

## 8. Jira Board & Burndown Chart

### Jira Board Progression
> TO FILL (Lộc): Jira board screenshots (e.g. docs/pa4/screenshots/jira-board.png) showing task progression across To Do, In Progress, In Review, and Done

### Sprint Burndown Chart
> TO FILL (Lộc): Sprint 4 burndown chart screenshot from Jira (e.g. docs/pa4/screenshots/burndown.png)
