# Part E: Development Tools & Process Setup — DebateSpeak AI

*Author: Group Member 5 | Reviewer: Group Member 2 | Editor: Group Member 1*

| Field | Description |
|---|---|
| Course | CS300 / CSC13002 — Introduction to Software Engineering |
| Document | **Part E: Scrum Process & Engineering Tooling Setup** |
| Score Allocation | Part E (5 Points) |

---

## 1. Scrum Methodology Implementation

*Performed by: Member 5 | Reviewed by: Member 1 | Edited by: Member 2*

Our team adheres strictly to the **Agile Scrum framework** throughout the 8-week semester project, mapping each Project Assignment (PA) directly to a dedicated 2-week Sprint:

```mermaid
graph LR
    subgraph Sprint Cycle (2 Weeks)
        SP[Sprint Planning<br/>Day 1] --> S1[Scrum Meeting 1<br/>Mid-Week 1]
        S1 --> S2[Scrum Meeting 2<br/>Mid-Week 2]
        S2 --> SR[Sprint Review & Retro<br/>Day 14]
    end
```

- **Sprint Planning Meeting (Day 1 of Sprint):** The team reviews the product backlog, decomposes features into Jira user stories, estimates story points using Planning Poker, and commits to the Sprint Backlog.
- **Scrum Check-ins (2 Meetings per Sprint):** Held mid-week to evaluate progress against the sprint burndown chart, identify emerging technical blockers, and coordinate API contracts.
- **Sprint Review & Retrospective (Final Day of Sprint):** Demonstrates working software against acceptance criteria, conducts an honest team retrospective (What went well, what can be improved), and logs actions in `docs/management/retrospectives/`.

---

## 2. Jira Task Management Standards

*Performed by: Member 1 | Reviewed by: Member 5 | Edited by: Member 3*

The team utilizes **Jira** for end-to-end task tracking following strict course guidelines:

1. **Complete Project Logging:** All activities—including coding, writing documentation reports, research spikes, self-training on LiveKit, and setting up CI pipelines—are logged as formal Jira issues.
2. **Single Assignee Invariant:** Every Jira issue is assigned to **exactly one team member** (no shared tickets). Collaborative tasks are decomposed into distinct paired sub-tasks.
3. **Strict Date Progression:**
   - Every issue records an explicit **Creation Date**, **Assignment Date**, and **Completion Date**.
   - Tasks are created and assigned *during Sprint Planning before work begins*.
   - **Anti-Pattern Prevention:** No member may batch-create, self-assign, and mark tasks as done all at once after work is finished. Real-time transition tracking (`To Do` → `In Progress` → `Review` → `Done`) is enforced.
4. **Weekly Report Evidence:** Screenshots of the Jira sprint board, burndown charts, and individual task velocity will be embedded in each weekly submission report.

---

## 3. Version Control & Git Repository Structure

*Performed by: Member 2 | Reviewed by: Member 5 | Edited by: Member 4*

- **Private Remote Repository:** Hosted on **GitHub** under private visibility with access granted to the course instructor and TAs.
- **Directory Structure:** Organizes code and documentation strictly according to the course recommendations:

```text
DebateSpeak-AI/
├── .github/
│   └── workflows/ci.yml             # Automated CI pipeline (Ruff, ESLint, tests)
├── src/                             # Application source code (implementation from PA2)
│   ├── web/                         # Vite + React (TypeScript) SPA frontend
│   ├── api/                         # FastAPI backend service
│   └── workers/                     # Transcription & AI analysis workers
├── docs/                            # Comprehensive documentation (Markdown)
│   ├── management/                  # Project planning, team contract, weekly reports
│   ├── requirements/                # Vision document, proposal, app survey, use cases
│   ├── analysis-and-design/         # Software architecture spec, schemas, API design
│   └── test/                        # Testing plan, golden sets, evaluation reports
├── docker-compose.yml               # Local container orchestration
├── .gitignore                       # Strict ignore rules (excluding .env, credentials, venvs)
└── README.md                        # Project root documentation index
```

- **Credential & Secret Safety:** Zero credentials or API keys (`AIza...`, `gsk_...`, LiveKit secrets) will ever be committed. Environment variables are loaded via local `.env` files (excluded by `.gitignore`) and managed in GitHub Actions via encrypted Repository Secrets.

---

## 4. Spec-Driven Development & Spec Kit Integration

*Performed by: Member 4 | Reviewed by: Member 1 | Edited by: Member 5*

- In accordance with course guidelines, the team adopts **Specification-Driven Development** starting from PA1 and preparing for **Spec Kit** integration in PA2.
- Before code implementation begins on any feature:
  1. A formal specification (data models, Pydantic schemas, API route contracts, and edge cases) is written and reviewed in `docs/analysis-and-design/SOFTWARE_ARCHITECTURE_SPEC.md`.
  2. Test cases and acceptance criteria are authored in `docs/test/TESTING_PLAN.md`.
  3. AI coding assistants (GitHub Copilot / Cursor) are constrained using these specifications as prompt context, ensuring code generation directly adheres to architecture invariants.

---

## 5. AI Coding Tooling & Educational Accounts

*Performed by: Member 3 | Reviewed by: Member 2 | Edited by: Member 1*

All 5 team members have registered and verified educational developer accounts:
- **GitHub Copilot for Students:** Activated via the GitHub Student Developer Pack on university email domains (`@hcmus.edu.vn`). Used for inline autocompletion and unit test scaffolding.
- **Cursor IDE / Antigravity:** Configured with local project context (`.cursorrules` / project documentation indexing) to assist with full-stack refactoring, FastAPI schema validation, and React component styling.

---

## 6. Sprint 1 Work Breakdown Structure (PA1 Tasks)

*Performed by: Member 1 | Reviewed by: Member 2 | Edited by: Member 5*

| Task Key | Task Summary | Assignee | Issue Type | Estimated Points | Target Completion |
|---|---|---|---|---|---|
| `DSP-1` | Author Project Proposal & 10 Functional Groups | Member 1 | Documentation | 5 pts | Week 1, Day 4 |
| `DSP-2` | Conduct Existing App Survey (ArguFight & Khaos Live) | Member 2 | Research/Doc | 5 pts | Week 1, Day 6 |
| `DSP-3` | Draft Team Contract & Accountability Guidelines | Member 3 | Documentation | 3 pts | Week 2, Day 2 |
| `DSP-4` | Author Software Architecture & System Spec Document | Member 4 | Technical Spec| 8 pts | Week 2, Day 4 |
| `DSP-5` | Initialize Git Monorepo, Directory Hierarchy & CI Linters | Member 5 | DevOps/Setup | 3 pts | Week 1, Day 3 |
| `DSP-6` | Setup Docker Compose (Postgres, Redis, LiveKit dev) | Member 5 | DevOps/Setup | 3 pts | Week 2, Day 3 |
| `DSP-7` | Verify Educational AI Coding Accounts (Copilot/Cursor) | All | Administrative | 1 pt | Week 1, Day 2 |
| `DSP-8` | Compile PA1 Markdown Package & Export Submission PDFs | Member 1 | Management | 2 pts | Week 2, Day 6 |
