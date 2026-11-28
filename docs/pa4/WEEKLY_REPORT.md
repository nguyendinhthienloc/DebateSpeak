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
| Lộc (24125093) | SCRUM-59 | Part D: Deployment Diagram + prose | In Review | Updated + PDF built on PR #74 (`feature/SCRUM-68-graphify`); Khoa to review |
| Lộc (24125093) | SCRUM-67 | Part F2: Weekly Report & meeting minutes | In Progress | Planning, Check-in 1 & 2, `SPRINT_REVIEW.md` template on PR #74; waits for Sprint Review & Jira screenshots |
| Lộc (24125093) | SCRUM-68 | Part S: Compile PA4 Markdown docs to PDF | In Progress | Lộc's docs & current drafts built via `report/pdf/build.py`; remaining Parts A/C1/C2/E7 await merges |
| Lộc (24125093) | SCRUM-68 | Freeze `CHECKLIST.md`, Git log, package `.zip` | In Progress | Checklist updated on PR #74; freeze & zip blocked until all rows are Complete (`AGENTS.md` §10) |
| Lộc (24125093) | SCRUM-52 | Refine waiting/ready lobbies & accessibility | Deferred / Closed | Dropped from PA4 (not in `PA4_OVERVIEW.md`; superseded by Triết's PR #70/#71/#73) |
| **Triết** (24125047) | SCRUM-58 | Part C3: C4 Level 3 Frontend Components | In Progress | Draft by Lộc on PR #74; Triết to check and take over |
| Triết (24125047) | SCRUM-61 | Part E2: FG-03 Frontend (Setup, Join, Lobby) | **Done** | PR #70 merged into `pa4` (2026-11-21, `7676197`) |
| Triết (24125047) | SCRUM-63 | Part E4: FG-04 Frontend (LiveKit, audio UI) | **Done** | PR #71 & PR #73 merged into `pa4`; bugfix branch pushed 2026-11-28 |
| Triết (24125047) | SCRUM-65 | Part E6/E7: Narrated YouTube demo video | To Do | `docs/pa4/DEMO_VIDEO.md` missing; waits for backend E2E |
| **Tài** (24125078) | SCRUM-55 | Part B: C4 Level 1 System Context + stack | In Progress | Draft by Lộc on PR #74; Tài to check and take over |
| Tài (24125078) | SCRUM-60 | Part E1: FG-03 Backend (Room API & DB) | In Progress | Commit `e9601d9` (2026-11-28) pushed onto PR #78 (`feature/SCRUM-56-c4-container-diagram`), unmerged |
| Tài (24125078) | SCRUM-62 | Part E3: FG-04 Backend (LiveKit token API) | To Do | No LiveKit token endpoint on any branch as of 2026-11-28 |
| **Khoa** (24125058) | SCRUM-56 | Part C1: C4 Level 2 Container Diagram | In Review | PR #78 open into `pa4` (`feature/SCRUM-56-c4-container-diagram`) |
| Khoa (24125058) | SCRUM-57 | Part C2: C4 Level 3 Backend Components | In Review | PR #79 open into `pa4` (`feature/SCRUM-57-c4-backend-components`) |
| Khoa (24125058) | SCRUM-64 | Part E5: Spec Kit (`specs/006-`, `specs/007-`) | **Done** | PR #80 merged into `pa4` (2026-11-28, `d81ddc6`); audio worker PR #81 also open |
| **Tuấn** (24125107) | SCRUM-54 | Part A: Revised Use Cases + `Changes.md` | In Review | PR #72 open into `pa4`; `CHANGES_REQUESTED` by Lộc (2026-11-27) |
| Tuấn (24125107) | SCRUM-66 | Part F1: AI Usage Log (all 5 members) | In Progress | Draft by Lộc on PR #74; Tuấn to confirm and complete |

---

## 3. Work Completed So Far (with Commit & PR Evidence)

1. **Sprint 4 Task Planning & Workspace Setup:**
   - Commit `a98d181` (2026-11-17, Khoa): Initialized `docs/pa4/README.md`, `docs/pa4/CHECKLIST.md`, `docs/pa4/create_pa4_jira_issues.py`, and member `TODO.md` files.
   - Commit `ef607a4` (2026-11-17, Khoa): Added `STTAdapter` protocol implementation and unit tests (`api/app/adapters/stt.py`, `tests/unit/test_stt_adapter.py`).

2. **Prototype Cleanup & UI Refresh:**
   - **PR #68** (merged 2026-11-17, `4bd5201`): Removed PA3 Part D clickable prototype per grading scope while retaining prototype UI screenshots (`docs/pa3/`).
   - **PR #69** (merged 2026-11-19, `3d3c3f8`): Merged UI refresh (`feature/SCRUM-53-ui-refresh`) into `pa4`.

3. **FG-03 & FG-04 Frontend Implementation and Spec Kit Artifacts:**
   - **PR #70** (merged 2026-11-21, `7676197`): Merged FG-03 room flow (`CreateRoomPage.tsx`, `InviteView.tsx`, `AgreeView.tsx`, `JoinDialog.tsx`, `RoomPage.tsx`, `RoomNotice.tsx`, `web/src/rooms/`, Playwright specs).
   - **PR #71** (merged 2026-11-23, `d86968e`): Merged FG-04 LiveKit live debate stage (`LiveStage.tsx`, `debateAudio.ts`, `WrapUp.tsx`, `clock.ts`, `spotlight.ts`, Playwright audio/live specs).
   - **PR #73** (merged 2026-11-26, `97694af`): Merged typed-turn fallback (`TypePanel.tsx`, `useTypedTurns.ts`), local mock API (`web/mock-local/mockApi.ts`, `vite.mock.config.ts`), `web/DEV_GUIDE.md`, and `docs/api/` contract docs.
   - **PR #80** (merged 2026-11-28, `d81ddc6`): Merged Spec Kit artifacts `specs/006-fg03-rooms/` and `specs/007-fg04-audio/` into `pa4`.

4. **Sprint Management, Reviews & Open Pull Requests:**
   - **PR #74** (draft, `feature/SCRUM-68-graphify`, Lộc): Finalized `docs/pa4/DEPLOYMENT_DIAGRAM.md` (+ PDF), `docs/pa4/MEETINGS/SPRINT_PLANNING.md` (+ PDF), `docs/pa4/MEETINGS/SPRINT_REVIEW.md` template (+ PDF), `docs/pa4/WEEKLY_REPORT.md` (+ PDF), `docs/reference/AI_SKILLS_GUIDE.md`, `docs/pa4/CHECKLIST.md`, and handoff drafts for Parts B, C3, and F1.
   - **PR #72** (open, Tuấn): Part A revised use cases and `Changes.md`; Lộc posted review (`CHANGES_REQUESTED`, 2026-11-27).
   - **PR #78** (open, Khoa + Tài): Part C1 C4 Container diagram plus Tài's Spring Boot Room API commit (`e9601d9`, 2026-11-28).
   - **PR #79** (open, Khoa): Part C2 C4 Backend Component diagram.
   - **PR #81** (open, Khoa): WebRTC audio pipeline prototype (`workers/audio_pipeline.py`).

---

## 4. Risks and Blockers

- **Incomplete PA4 Deliverables Blocking Freeze (as of 2026-11-28):**
  - Only `E2`, `E4`, and `E5` are merged and complete on `pa4`. Per `AGENTS.md` §10, `PA4-Group02.zip` cannot be packaged until every row in `docs/pa4/CHECKLIST.md` is `Complete`.
- **FG-03 & FG-04 Backend API Delivery:**
  - Tài's Spring Boot Room API (`e9601d9`) was pushed onto Khoa's C4 Container branch (PR #78) rather than its own clean branch and is not yet reviewed or merged.
  - The FG-04 LiveKit token endpoint (`POST /api/v1/rooms/{id}/token`) has not been pushed to any branch yet, blocking real two-browser LiveKit integration.
- **Part A Rework (PR #72):**
  - PR #72 requires updates to restore dropped Mermaid diagrams (11 → 3), restore PA3 credits for Triết, and document the Moodle PA3 TA feedback check before it can be approved and merged.
- **Demo Video Dependency:**
  - Triết's narrated YouTube demo (SCRUM-65) requires working end-to-end backend + LiveKit room flow (or agreed verification path) and remains unrecorded.
- **Missing Jira Screenshots & Sprint Review:**
  - `docs/pa4/screenshots/jira-board.png` and `docs/pa4/screenshots/burndown.png` (F5) have not been captured yet, and the Sprint Review & Retrospective meeting has not yet taken place.

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

**Status:** Pending — Sprint 4 Review & Retrospective has not yet been held as of 2026-11-28. Full minutes will be recorded in `docs/pa4/MEETINGS/SPRINT_REVIEW.md` and summarized below once the meeting takes place.

- **Date & Time:** Pending (to be scheduled once remaining Part A–E deliverables are ready for sprint review).
- **Team members present / absent:** Pending.
- **Sprint Results & Increment Review:** Pre-review evidence table (as of 2026-11-28) is tracked in `docs/pa4/MEETINGS/SPRINT_REVIEW.md` and Section 2 above.
- **Retrospective & Action Items for PA5:** Pending team meeting discussion.

---

## 8. Jira Board & Burndown Chart

### Jira Board Progression
- **Status:** Pending capture by Lộc.
- **Expected artifact path:** `docs/pa4/screenshots/jira-board.png` (showing SCRUM-54 through SCRUM-68 across To Do, In Progress, In Review, and Done).

### Sprint Burndown Chart
- **Status:** Pending capture by Lộc.
- **Expected artifact path:** `docs/pa4/screenshots/burndown.png` (Sprint 4 burndown chart exported from Jira).
