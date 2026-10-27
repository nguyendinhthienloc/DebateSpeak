# DebateSpeak AI — Multi-Sprint Engineering Task Breakdown & Role Matrix (TASKS.md)

| Field | Value |
|---|---|
| Project Name | **DebateSpeak AI** |
| Target Timeline | 10–12 Weeks across **5 Sprints** (Mapped directly to **PA1–PA5**) |
| Team Size | 5 Engineers |
| Companion Documents | [SOFTWARE_ARCHITECTURE_SPEC.md](../architecture/SOFTWARE_ARCHITECTURE_SPEC.md), [TESTING_PLAN.md](../testing/TESTING_PLAN.md) |

---

## 1. Team Role Allocation Matrix
*Performed by: Nguyễn Đình Thiên Lộc (24125093) | Reviewed by: Nguyễn Bảo Minh Triết (24125047) | Edited by: Trần Lê Anh Tuấn (24125107)*

| Role ID | Role Title | Member | Candidate Technologies (Tentative / Subject to Change) |
|---|---|---|---|
| **R1** | **Frontend & WebRTC/Audio Lead** | Nguyễn Bảo Minh Triết (`24125047`) | React, TypeScript, Tailwind CSS, LiveKit Client SDK |
| **R2** | **Backend & Real-Time Media Lead** | Nguyễn Hồng Tấn Tài (`24125078`) | FastAPI, SQLAlchemy, Alembic, PostgreSQL, Redis, LiveKit API |
| **R3** | **AI Audio & Speech Pipeline Lead** | Nguyễn Anh Khoa (`24125058`) | Python, LiveKit Agents, Silero VAD, STT Adapter Protocol |
| **R4** | **AI Analysis & Agent Orchestrator Lead** | Trần Lê Anh Tuấn (`24125107`) | Python, Pydantic v2, LLM Adapter Protocol, Redis Queue (ARQ) |
| **R5** | **DevOps & QA / Fact-Checking Lead & Release Custodian** | Nguyễn Đình Thiên Lộc (`24125093`) | Docker Compose, Caddy (TLS), GitHub Actions, Search Adapter, Playwright, pytest |

> **Note on Implementation Status & Technology Choices:** Because active implementation has not yet started in Sprint 1 (conception & proposal phase), primary ownership of code modules is not assigned in advance. The candidate technologies listed above reflect initial architectural planning and remain tentative and subject to change based on prototyping, research spikes, and Spec Kit specifications in future sprints. Furthermore, for Sprint 1 documentation, Nguyễn Đình Thiên Lộc served as Documentation Custodian & Git Release Manager to manage consolidated repository commits on behalf of all collaborating authors.

---

## 2. Multi-Sprint Work Breakdown Structure (5 Sprints = PA1 to PA5)

> **Task IDs.** The Jira key (SCRUM-nn) is the only task ID. A dash means the task has no Jira ticket yet; it gets a key when it is created at Sprint Planning.
*Performed by: Nguyễn Đình Thiên Lộc (24125093) | Reviewed by: Nguyễn Hồng Tấn Tài (24125078) | Edited by: Nguyễn Anh Khoa (24125058)*

### Sprint 1 (Weeks 1–2 / PA1): Foundation, Proposals & Setup
**Sprint Goal:** Comprehensive project proposal (10 FGs), existing app survey, team contract, dev environment setup, and baseline monorepo with CI.

| Jira | Task Description | Assignee | Reviewer | Deliverable / Output | Status |
|---|---|---|---|---|---|
| — | Repository setup, monorepo layout, code style linters (Ruff, ESLint), GitHub Actions CI | **R5** | **R2** | `.github/workflows/ci.yml` | Done |
| — | Docker Compose setup for local dev (PostgreSQL 16, Redis 7, LiveKit dev) & clean `.env.example` | **R5** | **R2** | `docker-compose.yml`, `.env.example` | Done |
| — | Author Project Proposal (10 Functional Groups & 2 Actors) | **R1** | **R5** | `docs/requirements/PROJECT_PROPOSAL.md` | Done |
| — | Conduct Existing App Survey (ArguFight, Khaos Live, ELSA Speak) | **R2** | **R4** | `docs/requirements/EXISTING_APP_SURVEY.md` | Done |
| — | Draft Team Contract & Code Standards | **R3** | **R1** | `docs/management/TEAM_CONTRACT.md` | Done |
| — | Setup Dev Tools, Scrum Process & Incremental Slices | **R5** | **R2** | `docs/management/DEV_TOOLS_AND_PROCESS.md` | Done |
| — | Design System Architecture Spec & PostgreSQL Schema | **R4** | **R5** | `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md` | Done |
| — | Draft QA & Testing Plan | **R5** | **R3** | `docs/testing/TESTING_PLAN.md` | Done |
| — | Configure `latexmk` academic report compilation & compile PDF | **R5** | **R1** | `report/report.tex`, `report/build/report.pdf` | Done |

---

### Sprint 2 (Weeks 3–4 / PA2): Project Planning & Vision Document
**Sprint Goal:** Initial Project Plan, Vision Document, Spec Kit initialization in `/src`, and the AI usage and weekly report. PA2-2026 grades documents only; Build 1 code moved to Sprint 3.

| Jira | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping | Status |
|---|---|---|---|---|---|---|
| SCRUM-19 | Gate G1 spec: Build 1 API, state-machine and token contract | **R4** | **R5** | `docs/pa2/G1_SPEC_BUILD1.md` | PA2 supporting | Done |
| SCRUM-20 | Author Project Plan: Goals, deliverables, risks, 5-sprint schedule, build plan | **R4** | **R3** | `docs/pa2/PROJECT_PLAN.md` | PA2 Part A | In Progress |
| SCRUM-21 | Author Vision Document: Problem statement, positioning table, 10 feature paragraphs, workflows | **R1** | **R4** | `docs/requirements/VISION_DOCUMENT.md` | PA2 Part B | Done |
| SCRUM-22 | Spec Kit Initialization in `/src`: `constitution.md`, initial spec artifacts, team training evidence | **R5** | **R2** | `src/constitution.md`, `.specify/` | PA2 Part C | Done |
| SCRUM-23 | Sprint 2 AI Usage Report & Weekly Report (Agile meetings, Jira progress) | **R3** | **R1** | `docs/pa2/WEEKLY_REPORT.md` | PA2 Part D | Planned |
| SCRUM-31 | Submit the PA2 zip to the school's Moodle after `pa2` is merged into `dev` | **R2** | **R5** | Moodle submission | PA2 submission | Planned |
| SCRUM-32 | Backend database design document | **R2** | **R5** | `api/app/core/database_document.md` | PA2 supporting | Done |

---

### Sprint 2 assignments

Who does what, branch rules, branch table and Jira mapping: [pa2/TODO.md](../pa2/TODO.md).
---

### Sprint 3 (Weeks 5–6 / PA3): Use-Case Modeling & First Functional Slice (Build 2)
**Sprint Goal:** Comprehensive use-case model with Mermaid diagrams, use-case specifications, UI prototypes, and full-stack implementation of 1 Functional Group. Also carries Build 1 (auth and room lobby), moved from Sprint 2.

| Jira | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping |
|---|---|---|---|---|---|
| — | Revised Project Plan & Vision Document with `Changes.md` (addressing TA feedback) | **R5** | **R1** | `docs/pa3/Changes.md`, revised docs | PA3 Part A, B |
| — | Author Use-Case Model: Mermaid diagrams for all 10 FGs, actors, relationships | **R4** | **R2** | `docs/pa3/USE_CASE_MODEL.md` | PA3 Part C |
| — | Author Use-Case Specifications: Detailed flows, pre/post conditions, and UI mockups for every UC | **R1, R4** | **R5** | `docs/pa3/USE_CASE_SPECIFICATIONS.md` | PA3 Part D |
| — | **Implement 1 Functional Group (FG-03: Room & Live Session Management)** end-to-end using Spec Kit | **R2, R1** | **R5** | Full-stack working code | PA3 Part E (Build 2) |
| — | Record narrated video demo of FG-03 and upload to YouTube | **R1** | **All** | YouTube Video Link | PA3 Part E |
| — | Sprint 3 AI Usage Report & Weekly Report (Scrum minutes, Jira tracking) | **R3** | **R1** | `docs/pa3/WEEKLY_REPORT.md` | PA3 Part F |
| SCRUM-24 | Build 1 Core Backend: PostgreSQL schema migrations, Argon2id auth, JWT rotation | **R2** | **R5** | `api/app/auth/` | Build 1 (moved from Sprint 2) |
| SCRUM-25 | Build 1 Core Frontend: Vite + React shell, login/register UI, CEFR level selection | **R1** | **R2** | `web/src/pages/auth/` | Build 1 (moved from Sprint 2) |
| SCRUM-26, SCRUM-27 | Build 1 Room Lifecycle: `create_room`, `join_room` via invite code (Lobby state machine) | **R2, R1** | **R5** | `api/app/rooms/`, `web/src/pages/rooms/` | Build 1 (moved from Sprint 2) |
| SCRUM-28 | Room state machine as a pure function, all valid/invalid transition tests, and the invalid-transition API test (BE-4.1, R-6, AC-1.5) | **R4** | **R2** | `api/app/rooms/state.py`, unit tests | Build 1 (moved from Sprint 2) |
| SCRUM-29 | Milestone 1 end-to-end smoke test: two users create, join and see `READY`; third user gets 409 (R-7, M1-1 to M1-5) | **R3** | **R2** | `tests/e2e/` | Build 1 (moved from Sprint 2) |
| SCRUM-30 | Milestone 1 demo: two users in two browsers create, join and see `READY` | **R5** | **All** | Demo recording | Build 1 (moved from Sprint 2) |

---

### Sprint 4 (Weeks 7–8 / PA4): Software Architecture & Second Implementation Slice (Build 3)
**Sprint Goal:** Complete C4 architecture model (Context, Container, Component, Deployment diagrams), and full-stack implementation of 2 additional Functional Groups (FG-04 Audio + FG-05 STT Pipeline).

| Jira | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping |
|---|---|---|---|---|---|
| — | Revised Use-Case Specifications with `Changes.md` | **R4** | **R1** | `docs/pa4/Changes.md`, revised specs | PA4 Part A |
| — | C4 Level 1: System Context Diagram & written explanation | **R4** | **R5** | `docs/pa4/ARCHITECTURE_C4.md` | PA4 Part B |
| — | C4 Level 2 & 3: Container Diagram & Component Diagrams (API, Web, LiveKit, Workers) | **R4, R2** | **R5** | `docs/pa4/ARCHITECTURE_C4.md` | PA4 Part C |
| — | Deployment Diagram: Docker Compose, Caddy TLS reverse proxy, cloud media mapping | **R5** | **R2** | `docs/pa4/DEPLOYMENT_DIAGRAM.md` | PA4 Part D |
| — | **Implement 2 Functional Groups (FG-04 Real-Time Audio + FG-05 Streaming STT)** using Spec Kit | **R3, R1, R2** | **R5** | Full-stack working code | PA4 Part E (Build 3) |
| — | Record narrated video demo of audio and live transcription pipeline | **R3** | **All** | YouTube Video Link | PA4 Part E |
| — | Sprint 4 AI Usage Report & Weekly Report | **R5** | **R1** | `docs/pa4/WEEKLY_REPORT.md` | PA4 Part F |

---

### Sprint 5 (Weeks 9–10 / PA5): Comprehensive Testing, Hardening & Final Product Demo (Build 4)
**Sprint Goal:** Execute test plan, refine Spec Kit test cases, golden-set evaluations, final reflective report, and live 15-minute product presentation.

| Jira | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping |
|---|---|---|---|---|---|
| — | Test Plan & Refined Test Cases: Validate auto-generated test cases, add negative edge cases | **R5** | **R2** | `docs/pa5/TEST_EXECUTION_REPORT.md` | PA5 Part A |
| — | Test Execution & Defect Reporting: Document pass/fail matrix, link bug reports | **R5, R1** | **R4** | Bug reports & test matrix | PA5 Part A |
| — | Multi-Agent Analysis Hardening: Complete Language Coach, Argument Coach, Fact-Checker & Judge | **R4, R5** | **R2** | Working multi-agent report | Build 4 (Release) |
| — | Personalized Learning Report UI & Learner History Progress Charts | **R1** | **R4** | Report viewer & analytics dashboard | Build 4 (Release) |
| — | Conduct 15-minute Live Final Product Demo showcasing all features (no slides) | **All (Lead: R1)** | **Faculty** | Live Demo Session | PA5 Part B |
| — | Author Reflective Report: SDLC critique, tooling evaluation, individual contributions | **All (Lead: R5)** | **All** | `docs/pa5/REFLECTIVE_REPORT.md` | PA5 Part C |
| — | Final Codebase Freeze & Package Submission (`PA5-Group01.zip`) | **R5** | **All** | Final submission archive | PA5 Part D |

---

## 3. Individual Member Workload Matrix
*Performed by: Nguyễn Đình Thiên Lộc (24125093) | Reviewed by: Trần Lê Anh Tuấn (24125107) | Edited by: Nguyễn Bảo Minh Triết (24125047)*

```
+--------------------------------------------------------------------------------------------------+
| ROLE 1: FRONTEND & WEBRTC/AUDIO LEAD (Triết - 24125047)                                          |
| Primary Focus: UI/UX, WebRTC Audio Integration, Lobby & Live Debate, Learning Reports, Demos    |
| Tasks: SCRUM-21, SCRUM-25, SCRUM-27 |
+--------------------------------------------------------------------------------------------------+
| ROLE 2: BACKEND & REAL-TIME MEDIA LEAD (Tài - 24125078)                                          |
| Primary Focus: FastAPI API, PostgreSQL Models, JWT Auth, Room State Machine, WebSockets, PubSub |
| Tasks: SCRUM-24, SCRUM-26, SCRUM-31, SCRUM-32 |
+--------------------------------------------------------------------------------------------------+
| ROLE 3: AI AUDIO & SPEECH PIPELINE LEAD (Khoa - 24125058)                                        |
| Primary Focus: LiveKit Bot Worker, Audio Track Hooks, Silero VAD, Streaming STT Adapters         |
| Tasks: SCRUM-23, SCRUM-29 |
+--------------------------------------------------------------------------------------------------+
| ROLE 4: AI ANALYSIS & AGENT ORCHESTRATOR LEAD (Tuấn - 24125107)                                  |
| Primary Focus: Agent Prompts, Spec Kit Models, Language/Argument Coach, Consensus Judge          |
| Tasks: SCRUM-19, SCRUM-20, SCRUM-28 |
+--------------------------------------------------------------------------------------------------+
| ROLE 5: DEVOPS & QA / FACT-CHECKING LEAD (Lộc - 24125093)                                        |
| Primary Focus: Staging Deployment, CI/CD, Search Retrieval, Security, E2E Testing, latexmk      |
| Tasks: SCRUM-22, SCRUM-30 |
+--------------------------------------------------------------------------------------------------+
```
