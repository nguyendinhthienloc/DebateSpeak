*Author: Group Member 1 | Reviewer: Group Member 5 | Editor: Group Member 2*

# DebateSpeak AI — Multi-Sprint Engineering Task Breakdown & Role Matrix (TASKS.md)

| Field | Value |
|---|---|
| Project Name | **DebateSpeak AI** |
| Target Timeline | 10–12 Weeks across **5 Sprints** (Mapped directly to **PA1–PA5**) |
| Team Size | 5 Engineers |
| Companion Documents | [SOFTWARE_ARCHITECTURE_SPEC.md](../architecture/SOFTWARE_ARCHITECTURE_SPEC.md), [TESTING_PLAN.md](../pa5/TESTING_PLAN.md) |

---

## 1. Team Role Allocation Matrix

To prevent engineering overlaps and establish clear ownership, the 5 team members are assigned dedicated subsystem areas:

| Role ID | Role Title | Member | Primary Ownership | Primary Technologies |
|---|---|---|---|---|
| **R1** | **Frontend & WebRTC/Audio Lead** | Nguyễn Bảo Minh Triết (`24125047`) | Vite + React SPA, Tailwind UI, room lobby, audio controls, live transcript rendering, report viewer | React, TypeScript, Tailwind CSS, LiveKit Client SDK |
| **R2** | **Backend & Real-Time Media Lead** | Nguyễn Hồng Tấn Tài (`24125078`) | FastAPI service, PostgreSQL models/migrations, JWT auth, room state machine, LiveKit token minting, WebSocket hub | FastAPI, SQLAlchemy, Alembic, PostgreSQL, Redis, LiveKit API |
| **R3** | **AI Audio & Speech Pipeline Lead** | Nguyễn Anh Khoa (`24125058`) | Audio track subscription worker (LiveKit agent), Silero VAD, streaming STT adapter, track-to-speaker attribution, disfluency tracking | Python, LiveKit Agents, Silero VAD, STT Adapter Protocol |
| **R4** | **AI Analysis & Agent Orchestrator Lead** | Trần Lê Anh Tuấn (`24125107`) | Language Coach, Argument Coach, Debate Judge, Consensus Engine, quote grounding guard, Pydantic schemas | Python, Pydantic v2, LLM Adapter Protocol, Redis Queue (ARQ) |
| **R5** | **DevOps & QA / Fact-Checking Lead** | Nguyễn Đình Thiên Lộc (`24125093`) | Claim detector, search integration, evidence evaluator, Docker/Caddy staging deployment, CI/CD, Playwright E2E, latexmk | Docker Compose, Caddy (TLS), GitHub Actions, Search Adapter, Playwright, pytest |

---

## 2. Multi-Sprint Work Breakdown Structure (5 Sprints = PA1 to PA5)

### Sprint 1 (Weeks 1–2 / PA1): Foundation, Proposals & Setup
**Sprint Goal:** Comprehensive project proposal (10 FGs), existing app survey, team contract, dev environment setup, and baseline monorepo with CI.

| Task ID | Task Description | Assignee | Reviewer | Deliverable / Output | Status |
|---|---|---|---|---|---|
| **T1.1** | Repository setup, monorepo layout, code style linters (Ruff, ESLint), GitHub Actions CI | **R5** | **R2** | `.github/workflows/ci.yml` | Done |
| **T1.2** | Docker Compose setup for local dev (PostgreSQL 16, Redis 7, LiveKit dev) & clean `.env.example` | **R5** | **R2** | `docker-compose.yml`, `.env.example` | Done |
| **T1.3** | Author Project Proposal (10 Functional Groups & 2 Actors) | **R1** | **R5** | `docs/pa1/PROJECT_PROPOSAL.md` | Done |
| **T1.4** | Conduct Existing App Survey (ArguFight, Khaos Live, ELSA Speak) | **R2** | **R4** | `docs/pa1/EXISTING_APP_SURVEY.md` | Done |
| **T1.5** | Draft Team Contract & Code Standards | **R3** | **R1** | `docs/pa1/TEAM_CONTRACT.md` | Done |
| **T1.6** | Setup Dev Tools, Scrum Process & Incremental Slices | **R5** | **R2** | `docs/pa1/DEV_TOOLS_AND_PROCESS.md` | Done |
| **T1.7** | Design System Architecture Spec & PostgreSQL Schema | **R4** | **R5** | `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md` | Done |
| **T1.8** | Draft QA & Testing Plan | **R5** | **R3** | `docs/pa5/TESTING_PLAN.md` | Done |
| **T1.9** | Configure `latexmk` academic report compilation & compile PDF | **R5** | **R1** | `report/report.tex`, `report/build/report.pdf` | Done |

---

### Sprint 2 (Weeks 3–4 / PA2): Project Planning, Vision Document & Build 1
**Sprint Goal:** Initial Project Plan, Vision Document, Spec Kit initialization in `/src`, and Build 1 (Auth + Room Lobby skeleton).

| Task ID | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping |
|---|---|---|---|---|---|
| **T2.1** | Author Project Plan: Goals, deliverables, risks, 5-sprint schedule, build plan | **R5** | **R1** | `docs/pa2/PROJECT_PLAN.md` | PA2 Part A |
| **T2.2** | Author Vision Document: Problem statement, positioning table, 10 feature paragraphs, workflows | **R1** | **R4** | `docs/pa2/VISION_DOCUMENT.md` | PA2 Part B |
| **T2.3** | Spec Kit Initialization in `/src`: `constitution.md`, initial spec artifacts, team training evidence | **R4** | **R5** | `src/constitution.md`, training logs | PA2 Part C |
| **T2.4** | Sprint 2 AI Usage Report & Weekly Report (Agile meetings, Jira progress) | **R3** | **R1** | `docs/pa2/WEEKLY_REPORT.md` | PA2 Part D |
| **T2.5** | Build 1 Core Backend: PostgreSQL schema migrations, Argon2id auth, JWT rotation | **R2** | **R5** | `api/app/auth/` | Build 1 |
| **T2.6** | Build 1 Core Frontend: Vite + React shell, login/register UI, CEFR level selection | **R1** | **R2** | `web/src/pages/auth/` | Build 1 |
| **T2.7** | Build 1 Room Lifecycle: `create_room`, `join_room` via invite code (Lobby state machine) | **R2, R1** | **R5** | `api/app/rooms/`, `web/src/pages/rooms/` | Build 1 |

---

### Sprint 3 (Weeks 5–6 / PA3): Use-Case Modeling & First Functional Slice (Build 2)
**Sprint Goal:** Comprehensive use-case model with Mermaid diagrams, use-case specifications, UI prototypes, and full-stack implementation of 1 Functional Group.

| Task ID | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping |
|---|---|---|---|---|---|
| **T3.1** | Revised Project Plan & Vision Document with `Changes.md` (addressing TA feedback) | **R5** | **R1** | `docs/pa3/Changes.md`, revised docs | PA3 Part A, B |
| **T3.2** | Author Use-Case Model: Mermaid diagrams for all 10 FGs, actors, relationships | **R4** | **R2** | `docs/pa3/USE_CASE_MODEL.md` | PA3 Part C |
| **T3.3** | Author Use-Case Specifications: Detailed flows, pre/post conditions, and UI mockups for every UC | **R1, R4** | **R5** | `docs/pa3/USE_CASE_SPECIFICATIONS.md` | PA3 Part D |
| **T3.4** | **Implement 1 Functional Group (FG-03: Room & Live Session Management)** end-to-end using Spec Kit | **R2, R1** | **R5** | Full-stack working code | PA3 Part E (Build 2) |
| **T3.5** | Record narrated video demo of FG-03 and upload to YouTube | **R1** | **All** | YouTube Video Link | PA3 Part E |
| **T3.6** | Sprint 3 AI Usage Report & Weekly Report (Scrum minutes, Jira tracking) | **R3** | **R1** | `docs/pa3/WEEKLY_REPORT.md` | PA3 Part F |

---

### Sprint 4 (Weeks 7–8 / PA4): Software Architecture & Second Implementation Slice (Build 3)
**Sprint Goal:** Complete C4 architecture model (Context, Container, Component, Deployment diagrams), and full-stack implementation of 2 additional Functional Groups (FG-04 Audio + FG-05 STT Pipeline).

| Task ID | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping |
|---|---|---|---|---|---|
| **T4.1** | Revised Use-Case Specifications with `Changes.md` | **R4** | **R1** | `docs/pa4/Changes.md`, revised specs | PA4 Part A |
| **T4.2** | C4 Level 1: System Context Diagram & written explanation | **R4** | **R5** | `docs/pa4/ARCHITECTURE_C4.md` | PA4 Part B |
| **T4.3** | C4 Level 2 & 3: Container Diagram & Component Diagrams (API, Web, LiveKit, Workers) | **R4, R2** | **R5** | `docs/pa4/ARCHITECTURE_C4.md` | PA4 Part C |
| **T4.4** | Deployment Diagram: Docker Compose, Caddy TLS reverse proxy, cloud media mapping | **R5** | **R2** | `docs/pa4/DEPLOYMENT_DIAGRAM.md` | PA4 Part D |
| **T4.5** | **Implement 2 Functional Groups (FG-04 Real-Time Audio + FG-05 Streaming STT)** using Spec Kit | **R3, R1, R2** | **R5** | Full-stack working code | PA4 Part E (Build 3) |
| **T4.6** | Record narrated video demo of audio and live transcription pipeline | **R3** | **All** | YouTube Video Link | PA4 Part E |
| **T4.7** | Sprint 4 AI Usage Report & Weekly Report | **R5** | **R1** | `docs/pa4/WEEKLY_REPORT.md` | PA4 Part F |

---

### Sprint 5 (Weeks 9–10 / PA5): Comprehensive Testing, Hardening & Final Product Demo (Build 4)
**Sprint Goal:** Execute test plan, refine Spec Kit test cases, golden-set evaluations, final reflective report, and live 15-minute product presentation.

| Task ID | Task Description | Assignee | Reviewer | Deliverable / Output | PA Mapping |
|---|---|---|---|---|---|
| **T5.1** | Test Plan & Refined Test Cases: Validate auto-generated test cases, add negative edge cases | **R5** | **R2** | `docs/pa5/TEST_EXECUTION_REPORT.md` | PA5 Part A |
| **T5.2** | Test Execution & Defect Reporting: Document pass/fail matrix, link bug reports | **R5, R1** | **R4** | Bug reports & test matrix | PA5 Part A |
| **T5.3** | Multi-Agent Analysis Hardening: Complete Language Coach, Argument Coach, Fact-Checker & Judge | **R4, R5** | **R2** | Working multi-agent report | Build 4 (Release) |
| **T5.4** | Personalized Learning Report UI & Learner History Progress Charts | **R1** | **R4** | Report viewer & analytics dashboard | Build 4 (Release) |
| **T5.5** | Conduct 15-minute Live Final Product Demo showcasing all features (no slides) | **All (Lead: R1)** | **Faculty** | Live Demo Session | PA5 Part B |
| **T5.6** | Author Reflective Report: SDLC critique, tooling evaluation, individual contributions | **All (Lead: R5)** | **All** | `docs/pa5/REFLECTIVE_REPORT.md` | PA5 Part C |
| **T5.7** | Final Codebase Freeze & Package Submission (`PA5-Group01.zip`) | **R5** | **All** | Final submission archive | PA5 Part D |

---

## 3. Individual Member Workload Matrix

```
+--------------------------------------------------------------------------------------------------+
| ROLE 1: FRONTEND & WEBRTC/AUDIO LEAD (Triết - 24125047)                                          |
| Primary Focus: UI/UX, WebRTC Audio Integration, Lobby & Live Debate, Learning Reports, Demos    |
| Tasks: T1.3, T1.9, T2.2, T2.6, T2.7, T3.3, T3.4, T3.5, T4.5, T5.2, T5.4, T5.5                   |
+--------------------------------------------------------------------------------------------------+
| ROLE 2: BACKEND & REAL-TIME MEDIA LEAD (Tài - 24125078)                                          |
| Primary Focus: FastAPI API, PostgreSQL Models, JWT Auth, Room State Machine, WebSockets, PubSub |
| Tasks: T1.4, T2.5, T2.7, T3.2, T3.4, T4.3, T4.5, T5.1, T5.3, T5.5                              |
+--------------------------------------------------------------------------------------------------+
| ROLE 3: AI AUDIO & SPEECH PIPELINE LEAD (Khoa - 24125058)                                        |
| Primary Focus: LiveKit Bot Worker, Audio Track Hooks, Silero VAD, Streaming STT Adapters         |
| Tasks: T1.5, T2.4, T3.6, T4.5, T4.6, T5.5                                                        |
+--------------------------------------------------------------------------------------------------+
| ROLE 4: AI ANALYSIS & AGENT ORCHESTRATOR LEAD (Tuấn - 24125107)                                  |
| Primary Focus: Agent Prompts, Spec Kit Models, Language/Argument Coach, Consensus Judge          |
| Tasks: T1.7, T2.3, T3.2, T3.3, T4.1, T4.2, T4.3, T5.3, T5.4, T5.5                                |
+--------------------------------------------------------------------------------------------------+
| ROLE 5: DEVOPS & QA / FACT-CHECKING LEAD (Lộc - 24125093)                                        |
| Primary Focus: Staging Deployment, CI/CD, Search Retrieval, Security, E2E Testing, latexmk      |
| Tasks: T1.1, T1.2, T1.6, T1.8, T1.9, T2.1, T3.1, T4.4, T4.7, T5.1, T5.2, T5.6, T5.7             |
+--------------------------------------------------------------------------------------------------+
```
