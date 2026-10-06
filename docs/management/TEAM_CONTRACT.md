# Part D: Team Contract — DebateSpeak AI

*Author: Group Member 1 | Reviewer: Group Member 5 | Editor: Group Member 3*

| Field | Description |
|---|---|
| Course | CS300 / CSC13002 — Introduction to Software Engineering |
| Document | **Part D: Team Contract & Collaboration Framework** |
| Score Allocation | Part D (5 Points) |

---

## 1. Team Roles and Responsibilities

*Performed by: Member 1 | Reviewed by: Member 2 | Edited by: Member 5*

In accordance with course guidelines, **all 5 team members act as full-stack engineers** contributing to design, coding, testing, and documentation. To maintain accountability and prevent gaps, each member leads a dedicated functional subsystem:

| Member Name & ID | Primary Lead Role | Full-Stack Responsibilities & Lead Deliverables |
|---|---|---|
| **Member 1** (ID: `XXXX001`) | **Project Manager & Frontend/Audio Lead** | • Coordinates sprint planning, backlog prioritization, and team deadlines.<br>• Leads the Vite + React SPA architecture, Tailwind design system, and UI accessibility.<br>• Implements the LiveKit Client SDK integration, audio controls, room lobby, and interactive report viewer. |
| **Member 2** (ID: `XXXX002`) | **Backend & Real-Time Media Lead** | • Leads the FastAPI core architecture and PostgreSQL database schema design (SQLAlchemy/Alembic).<br>• Implements user authentication (Argon2id, rotating JWTs) and room lifecycle state machine.<br>• Develops the LiveKit server token minting service and Redis pub/sub WebSocket hub. |
| **Member 3** (ID: `XXXX003`) | **Speech & Real-Time Pipeline Lead** | • Leads the LiveKit audio track subscription worker (bot subscriber).<br>• Implements Silero VAD for vocal activity segmentation and pause measurement.<br>• Develops the streaming STT adapter pipeline (Groq Whisper / Deepgram + `faster-whisper`), word timestamps, and filler-word tracking. |
| **Member 4** (ID: `XXXX004`) | **AI Analysis & Agent Orchestrator Lead** | • Leads the prompt engineering and Pydantic schemas for all AI agents.<br>• Implements the Language Coach (grammar/vocab), Argument Coach (rebuttal/fallacies), and Debate Judge.<br>• Builds the deterministic Consensus Engine and the regex/substring quote-grounding guard. |
| **Member 5** (ID: `XXXX005`) | **Fact-Checking, DevOps & QA Lead** | • Leads the Fact Investigator search retrieval pipeline (Serper/Tavily API) and Evidence Evaluator agent.<br>• Manages the Docker Compose multi-container staging environment and Caddy automated TLS reverse proxy.<br>• Establishes CI/CD pipelines (GitHub Actions), Playwright E2E automation, and golden-set evaluation scripts. |

---

## 2. Communication Plan

*Performed by: Member 1 | Reviewed by: Member 3 | Edited by: Member 4*

- **Primary Communication Channels:**
  - **Discord:** Daily asynchronous coordination, instant messaging, and technical troubleshooting channels (`#frontend`, `#backend`, `#ai-pipeline`, `#devops`).
  - **Google Meet:** Bi-weekly synchronous Scrum meetings and sprint ceremonies.
  - **GitHub Discussions / PR Comments:** Formal code reviews, architectural debate, and technical RFCs.
- **Meeting Frequency & Cadence:**
  - **Sprint Planning Meeting:** Once at the beginning of each 2-week sprint (60 minutes).
  - **Scrum Check-in Meetings:** Twice per sprint (Mid-week 1 and Mid-week 2; 20 minutes each) to discuss completed work, immediate next steps, and blockers.
  - **Sprint Review & Retrospective:** Once at the end of each sprint (45 minutes) to demonstrate working software and reflect on process improvements.
- **Response Time Expectations:**
  - Standard workdays (Monday – Friday, 08:00 – 21:00): Acknowledge messages within **4 hours**.
  - Urgent blockers (`[BLOCKER]` prefix in Discord): Acknowledge within **2 hours**.
  - Weekends: Acknowledge within **12 hours** unless notified of planned absence in advance.

---

## 3. Work Schedule and Deadlines

*Performed by: Member 2 | Reviewed by: Member 1 | Edited by: Member 5*

- **Semester Milestone Schedule:**
  - **Sprint 1 (PA1 - Weeks 1–2):** Project proposal, competitor survey, architecture spec, team contract, repository & CI setup.
  - **Sprint 2 (PA2 - Weeks 3–4):** Live debate room, two-way WebRTC audio, staging deployment with HTTPS, and two-user audio verification.
  - **Sprint 3 (PA3 - Weeks 5–6):** Live transcription worker, speaker attribution, Language Coach, Argument Coach, and Fact-Checking search pipeline.
  - **Sprint 4 (PA4 - Weeks 7–8):** Debate Judge, personalized learning reports, progress analytics, full E2E testing, and capstone presentation defense.
- **Contingency Protocol for Missed Deadlines:**
  - If a team member realizes a task will be delayed, they must notify the Project Manager on Discord at least **48 hours before the sprint deadline**.
  - The team will hold an emergency triage meeting to redistribute subtasks or scope down non-critical features to preserve milestone delivery.

---

## 4. Code and Documentation Standards

*Performed by: Member 5 | Reviewed by: Member 4 | Edited by: Member 2*

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
  - Architectural flows must use Mermaid diagrams. Every document header must state author, reviewer, and editor.

---

## 5. Accountability, Performance, and Consequences

*Performed by: Member 4 | Reviewed by: Member 1 | Edited by: Member 3*

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

*Performed by: Member 3 | Reviewed by: Member 2 | Edited by: Member 1*

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

*Performed by: Member 1 | Reviewed by: Member 5 | Edited by: Member 4*

- This team contract will be reviewed at the conclusion of each sprint during the **Sprint Retrospective**.
- Any team member may propose amendments to communication protocols, workload distribution, or tooling.
- Amendments take effect upon unanimous agreement of all 5 team members and will be committed to `docs/management/TEAM_CONTRACT.md` with an updated revision date.
