# Sprint Planning (PA4, Sprint 4)

*Performed: Nguyễn Đình Thiên Lộc (24125093); Review: Trần Lê Anh Tuấn (24125107), pending*

**Methodology:** Scrum  
**Sprint dates:** > TO FILL (Lộc): Sprint start and end dates (e.g. 17–27 November 2026)  
**Meeting date & time:** > TO FILL (Lộc): Date and time of the Sprint Planning meeting  

## Team members present
> TO FILL (Lộc): Team members present at the Sprint Planning meeting

## Team members absent
> TO FILL (Lộc): Team members absent from the Sprint Planning meeting

---

## 1. Sprint Goal
Build 3: Implement Functional Groups FG-03 (Room & Live Session Management) and FG-04 (Real-Time Audio Communication) using Spec Kit and deliver a narrated YouTube demo video, accompanied by full architectural documentation (C4 Level 1 System Context, C4 Level 2 Container, C4 Level 3 Component diagrams for backend and frontend, and Deployment diagram), revised Use-Case Specifications with `Changes.md`, and the Sprint 4 AI Usage Log and Weekly Report (Parts A–F, 75 pts total).

---

## 2. Sprint Scope Breakdown

| Part | Description | Points | Planned Deliverables |
|---|---|---|---|
| Part A | Revised Use-Case Specifications (2nd submission) + `Changes.md` | 5 | `docs/pa4/Changes.md`, `docs/pa4/USE_CASE_SPECIFICATIONS.md` |
| Part B | Software Architecture: System Context Diagram (C4 Level 1) + Tech Stack description | 15 | `docs/pa4/ARCHITECTURE_C4_CONTEXT.md`, `docs/pa4/ARCHITECTURE_C4_CONTEXT.pdf` |
| Part C | Software Architecture: Container (C4 Level 2) & Component Diagrams (C4 Level 3 BE & FE) | 20 | `docs/pa4/ARCHITECTURE_C4_CONTAINER.md`, `docs/pa4/ARCHITECTURE_C4_COMPONENTS_BE.md`, `docs/pa4/ARCHITECTURE_C4_COMPONENTS_FE.md` (+ PDFs) |
| Part D | Deployment Diagram (Mermaid) + Infrastructure description | 5 | `docs/pa4/DEPLOYMENT_DIAGRAM.md`, `docs/pa4/DEPLOYMENT_DIAGRAM.pdf` |
| Part E | Implement 2 Functional Groups (FG-03 + FG-04) using Spec Kit + YouTube demo | 25 | Spring Boot room API & LiveKit token API, React room setup/lobby & LiveKit audio UI, Spec Kit specs, `docs/pa4/DEMO_VIDEO.md` |
| Part F | AI Usage Report & Weekly Report | 5 | `docs/pa4/AI_USAGE_LOG.md`, `docs/pa4/WEEKLY_REPORT.md`, `docs/pa4/MEETINGS/`, Jira screenshots |

---

## 3. Planned Tasks, Assignments, and Reviewers

| Jira Key | Summary / Task | Owner | Reviewer | Deliverable / Artifact |
|---|---|---|---|---|
| SCRUM-68 | Sprint setup: create `pa4` branch from `pa3`, ensure `pa3` merged to `dev` | Nguyễn Đình Thiên Lộc (24125093) | n/a | `pa4` sprint branch |
| SCRUM-54 | Part A: Revised Use-Case Specifications (2nd submission) + `Changes.md` | Trần Lê Anh Tuấn (24125107) | Nguyễn Đình Thiên Lộc (24125093) | `docs/pa4/Changes.md`, `docs/pa4/USE_CASE_SPECIFICATIONS.md` |
| SCRUM-55 | Part B: C4 Level 1 System Context Diagram + Tech Stack description | Nguyễn Hồng Tấn Tài (24125078) | Trần Lê Anh Tuấn (24125107) | `docs/pa4/ARCHITECTURE_C4_CONTEXT.md` |
| SCRUM-56 | Part C1: C4 Level 2 Container Diagram + protocol descriptions | Nguyễn Anh Khoa (24125058) | Nguyễn Hồng Tấn Tài (24125078) | `docs/pa4/ARCHITECTURE_C4_CONTAINER.md` |
| SCRUM-57 | Part C2: C4 Level 3 Backend Component Diagram (Spring Boot + workers) | Nguyễn Anh Khoa (24125058) | Nguyễn Hồng Tấn Tài (24125078) | `docs/pa4/ARCHITECTURE_C4_COMPONENTS_BE.md` |
| SCRUM-58 | Part C3: C4 Level 3 Frontend Component Diagram (React SPA) | Nguyễn Bảo Minh Triết (24125047) | Nguyễn Anh Khoa (24125058) | `docs/pa4/ARCHITECTURE_C4_COMPONENTS_FE.md` |
| SCRUM-59 | Part D: Deployment Diagram (Mermaid) + infrastructure description | Nguyễn Đình Thiên Lộc (24125093) | Nguyễn Anh Khoa (24125058) | `docs/pa4/DEPLOYMENT_DIAGRAM.md` |
| SCRUM-60 | Part E1: FG-03 Backend — Room API, state machine, DB (Spring Boot) | Nguyễn Hồng Tấn Tài (24125078) | Trần Lê Anh Tuấn (24125107) | `api/authify/src/main/java/org/debatespeak/authify/room/` |
| SCRUM-61 | Part E2: FG-03 Frontend — Room Setup, Join modal, Lobby state sync, Ready | Nguyễn Bảo Minh Triết (24125047) | Nguyễn Đình Thiên Lộc (24125093) | `web/src/pages/rooms/`, `web/src/pages/LobbyPage.tsx` |
| SCRUM-62 | Part E3: FG-04 Backend — LiveKit token generation API (Spring Boot) | Nguyễn Hồng Tấn Tài (24125078) | Nguyễn Anh Khoa (24125058) | `api/authify/src/main/java/org/debatespeak/authify/livekit/` |
| SCRUM-63 | Part E4: FG-04 Frontend — LiveKit SDK, audio tracks, dual-consent UI | Nguyễn Bảo Minh Triết (24125047) | Nguyễn Anh Khoa (24125058) | `web/src/components/audio/`, `web/src/hooks/useLiveKit.ts` |
| SCRUM-64 | Part E5: Spec Kit artifacts for FG-03 (`specs/003-fg03-rooms/`) and FG-04 (`specs/004-fg04-audio/`) | Nguyễn Anh Khoa (24125058) | Trần Lê Anh Tuấn (24125107) | `specs/003-fg03-rooms/`, `specs/004-fg04-audio/` |
| SCRUM-65 | Part E6 & E7: Narrated YouTube demo video for FG-03 + FG-04 | Nguyễn Bảo Minh Triết (24125047) | All members | `docs/pa4/DEMO_VIDEO.md` (YouTube link) |
| SCRUM-66 | Part F1: AI Usage Log — Sprint 4 entries for all 5 members | Trần Lê Anh Tuấn (24125107) | Nguyễn Đình Thiên Lộc (24125093) | `docs/pa4/AI_USAGE_LOG.md` |
| SCRUM-67 | Part F2: Weekly Report — Sprint Planning, Check-ins, Review, Jira board | Nguyễn Đình Thiên Lộc (24125093) | Trần Lê Anh Tuấn (24125107) | `docs/pa4/WEEKLY_REPORT.md`, `docs/pa4/MEETINGS/` |
| SCRUM-68 | Part S: Compile all PA4 Markdown documents to PDF via `report/pdf/build.py` | Nguyễn Đình Thiên Lộc (24125093) | Nguyễn Anh Khoa (24125058) | `docs/pa4/*.pdf` |
| SCRUM-68 | Submission: Manage `docs/pa4/CHECKLIST.md`, export Git log, package `PA4-Group02.zip` | Nguyễn Đình Thiên Lộc (24125093) | All members | `PA4-Group02.zip`, `GIT_LOG.txt` |

---

## 4. Branch Rules & Development Workflow
As agreed in `docs/pa4/README.md` and repository guidelines:
1. **Sprint Branch:** `pa4` is the shared base branch created from `pa3` once `pa3` has been merged to `dev`.
2. **Task Branches:** Branch each task from `pa4` as `feature/SCRUM-<nn>-<short-name>`.
3. **Pull Requests:** Open all PRs targeting `pa4` (never directly into `dev` or `main`).
4. **Code Review:** Each PR requires at least one designated peer review before merging. Merged PR counts as reviewed.
5. **No Direct Code Commits to Sprint Branch:** Never commit code directly to `pa4`. Only the release custodian (Lộc) commits sprint planning and management documents directly if required.
6. **Sprint Finalization:** The release custodian merges `pa4` into `dev` once all checklist deliverables are complete and frozen.

---

## 5. Identified Risks and Mitigations

- **Dependency between Frontend and Backend on FG-03 and FG-04:**
  - *Risk:* Frontend implementation cannot connect without stable backend endpoints for rooms and LiveKit tokens.
  - *Mitigation:* Frontend proceeds with API contracts (`web/src/rooms/contracts.ts`) and mock fallbacks so UI components and tests are built incrementally while backend endpoints are finalized.
- **Strict Diagram Accuracy Requirement:**
  - *Risk:* Rubric penalizes discrepancies between architecture diagrams and actual implementation.
  - *Mitigation:* C4 Container, Component, and Deployment diagrams must be drawn directly from `docker-compose.yml`, Spring Boot packages, and `web/src/` components rather than aspirational designs.
- **Part A Mandatory `Changes.md` Requirement:**
  - *Risk:* A missing `Changes.md` results in 0 points for Part A per grading policy.
  - *Mitigation:* Tuấn will draft `docs/pa4/Changes.md` detailing every change made to use-case specifications compared to PA3.
- **Audio Verification & Demo Video:**
  - *Risk:* LiveKit WebRTC dual-consent and audio streaming require cloud credentials and two-client synchronization.
  - *Mitigation:* Verify LiveKit token generation and room bridge early, ensuring `.env.example` has placeholder keys and no secrets are committed.

---

## 6. Planning Discussion & Decisions
> TO FILL (Lộc): Meeting discussion points and notes from the Sprint Planning meeting

> TO FILL (Lộc): Any additional team decisions agreed upon during planning
