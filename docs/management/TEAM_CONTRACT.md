# Part D: Team Contract — DebateSpeak AI

| Field | Description |
|---|---|
| Course | CS300 / CSC13002 — Introduction to Software Engineering |
| Document | **Part D: Team Contract & Collaboration Framework** |
| Score Allocation | Part D (5 Points) |

---

## 1. Team Roles and Responsibilities

In accordance with course guidelines, **all 5 team members act as full-stack engineers** contributing to design, coding, testing, and documentation. To maintain accountability and prevent gaps, each member leads a dedicated functional subsystem:

| Member Name & ID | Primary Lead Role | Full-Stack Responsibilities & Lead Deliverables |
|---|---|---|
| **Nguyễn Bảo Minh Triết** (ID: `24125047`) | **Frontend & WebRTC/Audio Lead (Triết)** | • Leads the Vite + React SPA architecture, Tailwind design system, and UI accessibility.<br>• Implements the LiveKit Client SDK integration, audio controls, room lobby, and interactive report viewer.<br>• Coordinates user flows with backend WebSocket endpoints. |
| **Nguyễn Hồng Tấn Tài** (ID: `24125078`) | **Backend & Real-Time Media Lead (Tài)** | • Leads the FastAPI core architecture and PostgreSQL database schema design (SQLAlchemy/Alembic).<br>• Implements user authentication (Argon2id, rotating JWTs) and room lifecycle state machine.<br>• Develops the LiveKit server token minting service and Redis pub/sub WebSocket hub. |
| **Nguyễn Anh Khoa** (ID: `24125058`) | **AI Audio & Speech Pipeline Lead (Khoa)** | • Leads the LiveKit audio track subscription worker (bot subscriber).<br>• Implements Silero VAD for vocal activity segmentation and pause measurement.<br>• Develops the streaming STT adapter pipeline (cloud streaming STT + local fallback engine), word timestamps, and filler-word tracking. |
| **Trần Lê Anh Tuấn** (ID: `24125107`) | **AI Orchestrator & Analysis Lead (Tuấn)** | • Leads the prompt engineering, LLM adapter interfaces, and Pydantic schemas for all AI agents.<br>• Implements the Language Coach (grammar/vocab), Argument Coach (rebuttal/fallacies), and Debate Judge.<br>• Builds the deterministic Consensus Engine and the regex/substring quote-grounding guard. |
| **Nguyễn Đình Thiên Lộc** (ID: `24125093`) | **DevOps & QA / Fact-Checking Lead (Lộc)** | • Leads the Fact Investigator search retrieval pipeline (web search adapter) and Evidence Evaluator agent.<br>• Manages the Docker Compose multi-container staging environment and Caddy automated TLS reverse proxy.<br>• Establishes CI/CD pipelines (GitHub Actions), Playwright E2E automation, and golden-set evaluation scripts. |

---

## 2. Communication Plan

- **Primary Communication Channels:**
  - **Facebook Messenger:** Primary daily communication channel (team group chat for daily coordination, instant messaging, announcements, urgent blocker alerts, and poll-based meeting scheduling).
  - **Google Meet:** Synchronous online team meetings, sprint ceremonies, and live pair-programming sessions.
  - **GitHub Discussions / PR Comments:** Formal code reviews, architectural debate, and technical RFCs.
- **Meeting Cadence & Scheduling:**
  - **Meeting Times:** Specific meeting times and dates are **flexible and to be decided** collaboratively prior to each sprint or milestone based on all 5 members' course schedules and academic availability (polled and confirmed via Messenger).
  - **Sprint Ceremonies & Syncs:** Arranged dynamically at key milestones (Sprint Planning at sprint launch, mid-sprint progress check-ins, and sprint review/retro demonstrations) to maintain momentum without rigid scheduling constraints.
- **Response Time Expectations:**
  - Standard workdays (Monday – Friday, 08:00 – 21:00): Acknowledge messages within **4 hours**.
  - Urgent blockers (`[BLOCKER]` prefix in Messenger): Acknowledge within **2 hours**.
  - Weekends: Acknowledge within **12 hours** unless notified of planned absence in advance.

---

## 3. Work Schedule and Deadlines

- **Incremental Release Schedule (5 Sprints mapped to PA1–PA5):**
  - **Sprint 1 (PA1 - Weeks 1–2):** *Conception & Setup* — Proposal (10 FGs), app survey, team contract, dev tooling, baseline monorepo, Docker Compose, and academic report.
  - **Sprint 2 (PA2 - Weeks 3–4):** *Planning & Foundation (Build 1)* — Project Plan, Vision Document, Spec Kit initialization in `/src`, and Build 1 (Auth + Room Lobby state machine skeleton).
  - **Sprint 3 (PA3 - Weeks 5–6):** *Use-Case Modeling & First Functional Slice (Build 2)* — Use-case specs & diagrams, Changes.md, Build 2 (End-to-End implementation of 1 FG: Room & Session Management), narrated video demo.
  - **Sprint 4 (PA4 - Weeks 7–8):** *Architecture & Second Implementation Slice (Build 3)* — C4 model (Context, Container, Component, Deployment), Build 3 (Implementation of 2 FGs: Live Audio + Streaming STT), narrated video demo.
  - **Sprint 5 (PA5 - Weeks 9–10):** *Comprehensive Testing, Demo & Hardening (Build 4 - Final Release)* — Test plan, refined test cases, golden-set evaluation, 15-minute live product demo of all 10 FGs, reflective report.
- **Contingency Protocol for Missed Deadlines:**
  - If a team member realizes a task will be delayed, they must notify the Team Leader on Messenger at least **48 hours before the sprint deadline**.
  - The team will hold an emergency triage meeting to redistribute subtasks or scope down non-critical features to preserve milestone delivery.

---

## 4. Code and Documentation Standards

- **Coding Conventions & Linters:**
  - **Python (Backend & Workers):** Strict PEP 8 standards enforced via **Ruff** (line length 100) and static type checking via **MyPy**.
  - **TypeScript (Frontend):** Enforced via **ESLint** and **Prettier** with strict TypeScript compiler checks (`noImplicitAny: true`).
- **Git Branching Strategy:**
  - Git Flow model: `main` (production-ready, tagged releases), `develop` (staging integration), and short-lived feature branches (`feat/room-timer`, `fix/vad-segmentation`).
  - **Never commit directly to `main` or `develop`.** All changes require a Pull Request.
- **Code Review & Testing Guidelines:**
  - Every PR must have at least **one approving review** from a designated peer reviewer before merging.
  - PRs must pass automated CI checks (linters, unit tests) and maintain ≥70% test coverage on core business logic.
- **Documentation Standards:**
  - All documentation is written in clear, concise English using GitHub-flavored Markdown.
  - Architectural flows must use Mermaid diagrams.

---

## 5. Accountability, Performance, and Consequences

- **Contribution Measurement Criteria:**
  - Completion of assigned Jira tasks within the committed sprint timeline.
  - Meaningful, consistent Git commit activity (measured via commit frequency and pull request contributions; no last-minute code dumps).
  - Punctual attendance and active participation in scheduled Scrum ceremonies.
- **Handling Underperformance:**
  - **Step 1 (Informal 1-on-1):** The Project Manager speaks privately with the struggling member to understand challenges, offer technical pair-programming support, or rebalance workload.
  - **Step 2 (Formal Team Notice):** If inactivity or unresponsiveness continues for more than 48 hours without justification, a written notice is posted in the private team log outlining required remediation actions within 3 business days.
  - **Step 3 (Consequence & Escalation):** If underperformance persists, the team will formally reflect the individual's contribution accurately in the peer evaluation form and escalate the issue to the course Teaching Assistant (TA) or Instructor.

---

## 6. Decision-Making & Conflict Resolution

- **Decision-Making Protocol:**
  - Architectural and technical decisions are made through open discussion and **consensus whenever possible**.
  - If consensus cannot be reached, the team takes a **majority vote (3 out of 5 votes)**.
  - In the event of a tie or time-critical impasse on schedule trade-offs, the **Project Manager holds the casting vote**.
- **Conflict Resolution Framework:**
  - **Level 1 (Internal Discussion):** Disputing parties discuss the issue professionally in a dedicated 1-on-1 meeting focusing strictly on objective code quality, project requirements, and data.
  - **Level 2 (Team Mediation):** If unresolved, the full team mediates the discussion during the next Scrum meeting.
  - **Level 3 (Instructor Escalation):** If a personal or structural dispute threatens project progress, the Project Manager contacts the TA/Instructor for academic mediation.

---

## 7. Contract Review and Update Process

- This team contract will be reviewed at the conclusion of each sprint during the **Sprint Retrospective**.
- Any team member may propose amendments to communication protocols, workload distribution, or tooling.
- Amendments take effect upon unanimous agreement of all 5 team members and will be committed to `docs/management/TEAM_CONTRACT.md` with an updated revision date.
