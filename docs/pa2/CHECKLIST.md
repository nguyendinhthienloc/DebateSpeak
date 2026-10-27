# PA2 Checklist — Project Plan, Vision Document & Build 1

> **Status:** DRAFT for revision before Jira import.
> **Sprint:** Sprint 2 (Weeks 3–4), PA2 — 45 pts. Source of truth for the sprint scope: [SPRINT_TASKS.md](../management/SPRINT_TASKS.md) (T2.1–T2.7) and [PA2_OVERVIEW.md](../assignments/PA2_OVERVIEW.md).

## 0. Open decisions to confirm before Jira

These conflicts exist in the current docs. The checklist below assumes the first option in each.

1. **What PA2 contains.** The course brief and `SPRINT_TASKS.md` say PA2 = Project Plan + Vision Document + Spec Kit init + Build 1 (Auth + Room Lobby skeleton). `TESTING_PLAN.md` ("Sprint 2: Live Debate Room") and `AGENTS.md` §6 ("Increment 2: Live Audio Core") put LiveKit audio in PA2. **Assumed: Build 1 only. Live audio is excluded from PA2.**
2. **Spec before code.** `AGENTS.md` §5 forbids writing code before the spec is updated. **Assumed: no Build 1 code is merged until Gate G1 (§3) is closed.**
3. **Vision Document ownership.** `SPRINT_TASKS.md` gives T2.2 to Triết alone. This checklist splits the 10 feature paragraphs across all five members (§5, B-5) with Triết as the owner who assembles the file. Change this if you want a single author.
4. **Topic library (FG-02).** `TESTING_PLAN.md` AC-1.3 (topic filter, admin CRUD) is in Build 1, but no T2.x task covers it. **Assumed: out of PA2, moved to Sprint 3.** Add a task if you disagree.
5. **Auth token storage.** Choose httpOnly cookie or in-memory access token + refresh cookie. This is a security decision and needs Tài and Triết to agree (task B-2).

## 1. Owners, branches and Jira mapping

Moved to [docs/pa2/TODO.md](TODO.md). Read its branch rules before creating any branch.

## 2. Sprint 2 timeline (suggested)

| Week | Focus |
|---|---|
| Week 3, days 1–2 | Gate G1 spec written and reviewed. Project Plan draft (A-section). Sprint Planning meeting. |
| Week 3, days 3–5 | Backend migrations + auth (T2.5). Frontend shell (T2.6). Vision Document draft (B-section). Standup 1. |
| Week 4, days 1–3 | Room lifecycle API + UI (T2.7). Risk table and schedule finalised. Standup 2. |
| Week 4, days 4–5 | Integration test of Milestone 1. Sprint Review. Final docs, weekly report, Jira screenshots. |

---

## 3. Gate G1 — Spec update (blocks all Build 1 code)

Owner: **Tuấn** (spec), reviewer **Lộc**.

Prepared contract: [G1_SPEC_BUILD1.md](G1_SPEC_BUILD1.md), SCRUM-19, 2026-10-27.
Drafting: Codex assisting Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead;
review by Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead, pending.
The contract maps checklist `rooms` / `room_participants` to the existing
`debate_rooms` / `debate_participants` tables, retains CANCELLED, and makes the
token-storage choice concrete for review. The checkboxes remain open until verified.

- [ ] **G1.1** Open `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md`. Confirm the `users`, `rooms`, `room_participants` tables and the room state enum (`LOBBY`, `READY`, `LIVE`, `ENDED`) match what Build 1 needs. Note any change.
- [ ] **G1.2** Write the transition table: which states can move to which, and which HTTP code is returned on an invalid move (409, per AC-1.5).
- [ ] **G1.3** Write the API contract for the Build 1 endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET/PATCH /users/me`, `POST /rooms`, `POST /rooms/join`, `GET /rooms/{id}`. For each: request body, response body, error codes.
- [ ] **G1.4** Write the token approach (access + refresh, rotation, where the refresh token lives). Decision 5 above.
- [ ] **G1.5** Update `docs/requirements/PROJECT_PROPOSAL.md` if any requirement wording changed.
- [ ] **G1.6** Commit spec changes on a `feature/G1-spec-build1` branch (from `pa2`) and open a PR into `pa2`. Reviewer: Lộc. Merge to `pa2` before any B- or F- task starts.

**Done when:** the PR is merged and `pa2` contains the spec for every endpoint in G1.3.

---

## 4. Part A — Project Plan (T2.1)

Owner: **Tuấn**. Reviewer: **Khoa**. Output: `docs/pa2/PROJECT_PLAN.md`. Lộc supplies the Jira setup (A-6) and the Sprint 1 PA1 lessons as input, but does not own this task.

### A-1 Setup
- [ ] **A-1.1** Create `docs/pa2/` and add `PROJECT_PLAN.md` with the section headings only: Overview, Goals, Scope, Deliverables, Assumptions, Team Organisation, Risks, Sprint Schedule, Build Plan, Jira Integration.
- [ ] **A-1.2** Copy the role matrix from `../management/SPRINT_TASKS.md` §1 (Team Role Allocation) into the Team Organisation section. Check each name and student ID against the table in `AGENTS.md` §3.

### A-2 Overview, goals, scope
- [ ] **A-2.1** Write a 3–5 sentence project overview. Source: `PROJECT_PROPOSAL.md` opening section.
- [ ] **A-2.2** Write 3–5 measurable goals. Each goal must have a number or a yes/no test (e.g., "two users complete register → room join in under 2 minutes", "10 parallel joins produce exactly 2 participants").
- [ ] **A-2.3** Write the in-scope list: FG-01 (account), FG-03 (room lobby skeleton). Mark FG-02, FG-04 to FG-10 as "later sprints" with the sprint number from `ROADMAP.md`.
- [ ] **A-2.4** Write the out-of-scope list. Include live audio, STT, LLM analysis, reports.

### A-3 Deliverables and assumptions
- [ ] **A-3.1** List the PA2 deliverables: Project Plan, Vision Document, Spec Kit (`src/constitution.md`, `.specify/`), Build 1 (demo-able), AI usage report, weekly report.
- [ ] **A-3.2** List assumptions (e.g., "LiveKit Cloud free tier is available in Sprint 4", "team has 2 working weeks per sprint", "no paid services"). Each assumption gets an owner who will check it.

### A-4 Risks (minimum 3, each with mitigation)
- [ ] **A-4.1** Draft a risk table with columns: ID, Risk, Likelihood (L/M/H), Impact (L/M/H), Mitigation, Owner, Trigger.
- [ ] **A-4.2** Include at least these four (from `TESTING_PLAN.md` risk table):
  - Team unfamiliar with real-time systems → mitigation: spike with LiveKit quickstart in Sprint 4 prep; pair sessions.
  - Scope overload in Sprints 3–4 → mitigation: scope-cut order from `TESTING_PLAN.md`; velocity check at Sprint 2 end.
  - Spec drift between Spec Kit and code → mitigation: G1 gate; PR reviewer checks spec link.
  - Uneven load on Lộc (PA1 DevOps work and T2.3 Spec Kit in Sprint 2, plus release duties) → mitigation: T2.1 moved to Tuấn and the M1 smoke test moved to Khoa; re-check load at Sprint Review.
- [ ] **A-4.3** Get each risk owner to read and sign off their row (a comment on the PR is enough).

### A-5 Sprint schedule and build plan
- [ ] **A-5.1** Build the 5-sprint table: Sprint, Weeks, PA, Goal, Build. Source: `SPRINT_TASKS.md` §2 headings.
- [ ] **A-5.2** Build plan table: Build 1 (S2), Build 2 (S3, FG-03), Build 3 (S4, FG-04 + FG-05), Build 4 (S5, all FGs + demo). For each build, write one line: "what a user can do at the end of this build".
- [ ] **A-5.3** Check the schedule against `ROADMAP.md` §1. Fix any disagreement in the same PR.

### A-6 Jira integration
- [ ] **A-6.1** Create a Jira project (or confirm the existing one). Use the existing project with key `SCRUM` (named "DebateSpeak"); do not create a new one. Claude connects to it through the Atlassian MCP connector at `https://mcp.atlassian.com/v2/mcp`; each member signs in with their own Atlassian account.
- [ ] **A-6.2** Create 5 sprints named `Sprint 1 (PA1)` to `Sprint 5 (PA5)`.
- [ ] **A-6.3** Create one Epic per Build: Build 1 to Build 4.
- [ ] **A-6.4** Import the tasks from the Jira import table in `SPRINT_TASKS.md`. Set the assignee, reviewer and branch name (from its branch table) in the description.
- [ ] **A-6.5** Describe in the plan how Jira IDs map to the Task IDs in `SPRINT_TASKS.md` (e.g., "Jira `SCRUM-24` = T2.5").

### A-7 Review
- [ ] **A-7.1** Khoa reviews against the PA2 rubric in `PA2_OVERVIEW.md` Part A (15 pts). Tuấn fixes and re-requests review.
- [ ] **A-7.2** Tuấn merges `feature/T2.1-project-plan` into `pa2`.

---

## 5. Part B — Vision Document (T2.2)

Owner: **Triết** (assembler). Reviewer: **Tuấn**. Output: `docs/pa2/VISION_DOCUMENT.md`.
Feature paragraphs are written by the members named in B-5.

### B-1 Problem statement
- [ ] **B-1.1** Read `EXISTING_APP_SURVEY.md` (ArguFight, Khaos Live, ELSA Speak). Write down 3 concrete gaps (one line each).
- [ ] **B-1.2** Fill the problem statement table with the course template: *The problem of… affects… the impact of which is… a successful solution would be…*. One row per problem, 2 problems maximum.

### B-2 Product position
- [ ] **B-2.1** Fill the product position statement table: *For… Who… The product name… That… Unlike… Our product…*. Use the name "DebateSpeak AI".
- [ ] **B-2.2** Tuấn checks that every "Unlike" entry names a surveyed app.

### B-3 Stakeholders and users
- [ ] **B-3.1** List the two actors from `PROJECT_PROPOSAL.md`. For each: goal, pain point, how often they use the product.
- [ ] **B-3.2** List other stakeholders (course instructor, TA, English teachers). One line each on what they need.

### B-4 Needs and competition
- [ ] **B-4.1** Write a needs analysis of 5 bullets, each one a need the proposal's functional groups meet.
- [ ] **B-4.2** Write a competition summary: one row per competitor (name, strength, weakness, what we do differently). Use only facts from `EXISTING_APP_SURVEY.md`; cite the section.

### B-5 Feature paragraphs (10, split across members)
Each paragraph: 3–5 sentences of rationale. Name the FG and what it lets a user do.

| Member | Features to write |
|---|---|
| Triết | FG-03 Room & Live Session Management, FG-04 Real-Time Audio Communication |
| Tài | FG-01 User & Profile Management, FG-02 Topic & Difficulty Management |
| Khoa | FG-05 Speech-to-Text & Attribution, FG-06 English Language Analysis |
| Tuấn | FG-07 Argument & Debate Analysis, FG-09 Multi-Agent Evaluation & Consensus |
| Lộc | FG-08 AI Fact-Checking & Evidence, FG-10 Learning History & Reports |

- [ ] **B-5.1** Each author writes their paragraphs in a separate draft (`docs/pa2/drafts/<name>.md`). Due: Week 3 day 5.
- [ ] **B-5.2** Each paragraph lists the FG number in its heading, e.g., `### FG-03 Room & Live Session Management`.
- [ ] **B-5.3** Triết merges all drafts into `VISION_DOCUMENT.md`. Remove the drafts folder after merge.

### B-6 Workflow diagrams (Mermaid)
- [ ] **B-6.1** Diagram 1: Room lifecycle (`LOBBY → READY → LIVE → ENDED`), including the 409 path. Owner: Tài.
- [ ] **B-6.2** Diagram 2: Join flow (register/login → enter invite code → lobby). Owner: Triết.
- [ ] **B-6.3** Check both render in the GitHub preview (no syntax error).

### B-7 Non-functional requirements (quantified)
- [ ] **B-7.1** Latency: mute status reaches other participant within 1 s (AC-2.4, carried into the vision for PA3+).
- [ ] **B-7.2** Concurrency: 10 parallel join requests on a 2-seat room produce exactly 2 participants (AC-1.4).
- [ ] **B-7.3** Security: passwords stored only as Argon2id hashes; a user cannot read or modify another user's profile (AC-1.1, AC-1.2).
- [ ] **B-7.4** Reliability: 30 s network interruption rejoins without duplicate; 60 s ends with reason `DISCONNECT` (AC-2.5). Mark as "Sprint 4 target".

### B-8 Review
- [ ] **B-8.1** Tuấn reviews against the PA2 rubric (20 pts). Each feature paragraph is checked for 3–5 sentences.
- [ ] **B-8.2** Triết fixes and merges `feature/T2.2-vision-document` into `pa2`.

---

## 6. Part C — Spec Kit Initialisation (T2.3, done — evidence only)

Owner: **Lộc**. Reviewer: **Tài**.

- [x] **C-1** `src/constitution.md` exists in the tree.
- [x] **C-2** `.specify/` folder exists with templates and scripts.
- [ ] **C-3** Confirm `src/constitution.md` matches the team's current rules (`AGENTS.md` §1–§8). Fix any gap.
- [ ] **C-4** Create the Build 1 spec files using `/speckit-specify` (for auth) and `/speckit-specify` (for room lobby). Save under the folder the spec-kit scripts create.
- [ ] **C-5** Each member logs one Spec Kit training session. Evidence = screenshot or a note in `docs/pa2/AI_USAGE_LOG.md` with date, name, what was learned. (Required by PA2 Part C.)
- [ ] **C-6** Gather C-5 evidence into `docs/pa2/SPECKIT_TRAINING.md`.

---

## 7. Part D — AI Usage & Weekly Report (T2.4)

Owner: **Khoa**. Reviewer: **Triết**. Output: `docs/pa2/WEEKLY_REPORT.md`, `docs/pa2/AI_USAGE_LOG.md`.

### D-1 AI usage log
- [ ] **D-1.1** Create `docs/pa2/AI_USAGE_LOG.md` with columns: Date, Member, Tool, Task, What AI did, What was changed by human, Notes.
- [ ] **D-1.2** Each member adds their rows during the sprint, not at the end. Reminder at each standup.
- [ ] **D-1.3** Khoa checks the log at Sprint Review. Any row missing a human-change note is returned.

### D-2 Meetings
- [ ] **D-2.1** Sprint Planning: prepare agenda (goal, task list from the Jira import table in `SPRINT_TASKS.md`, capacity). Record minutes in `docs/pa2/MEETINGS/`.
- [ ] **D-2.2** Standup 1 (Week 3 mid): minutes with yesterday / today / blockers per member.
- [ ] **D-2.3** Standup 2 (Week 4 mid): same format.
- [ ] **D-2.4** Sprint Review: demo Build 1 to the team (Milestone 1 steps in §9). Record minutes.
- [ ] **D-2.5** Take a Jira screenshot at each meeting (board, burndown, sprint summary). Save under `docs/pa2/screenshots/`.

### D-3 Weekly report
- [ ] **D-3.1** Write `WEEKLY_REPORT.md` sections: Sprint goal, what was done (by task ID), what was not done and why, metrics (tasks done / planned), AI usage summary, links to minutes and screenshots.
- [ ] **D-3.2** Triết reviews. Khoa fixes and merges.

---

## 8. Build 1 — Backend (T2.5)

Owner: **Tài**. Reviewer: **Lộc**. Blocked by Gate G1.
Code path: `api/app/auth/`, `api/app/db/`, `api/app/users/`.

### BE-1 Database setup
- [ ] **BE-1.1** Add `sqlalchemy` (2.x async) and `asyncpg` to `api/pyproject.toml`. Run lock update.
- [ ] **BE-1.2** Create `api/app/db/session.py`: async engine and session factory. Read the database URL from settings (`api/app/config.py`), never hardcoded.
- [ ] **BE-1.3** Add the new variables (`DATABASE_URL`, `JWT_SECRET`, `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`) to `.env.example` with empty values.
- [ ] **BE-1.4** Confirm `.gitignore` lists `.env`, `.env.*` (except `.env.example`).
- [ ] **BE-1.5** Initialise Alembic (`api/alembic/`). Use a relative `script_location`. Verify `alembic upgrade head` runs against the Docker Compose Postgres.
- [ ] **BE-1.6** First migration: `users` table (id, email unique, password_hash, cefr_level, created_at).
- [ ] **BE-1.7** Second migration: `rooms` and `room_participants` tables per the G1 spec.

### BE-2 Password and token
- [ ] **BE-2.1** Write `api/app/auth/passwords.py`: Argon2id hash and verify. Unit test: stored value starts with `$argon2id$`, verify returns False for wrong password.
- [ ] **BE-2.2** Write `api/app/auth/tokens.py`: issue access JWT; issue refresh token; store refresh token hash in DB.
- [ ] **BE-2.3** Refresh rotation: using a refresh token issues a new pair and invalidates the old one. Reusing the old one returns 401. Unit test both.

### BE-3 Auth endpoints
- [ ] **BE-3.1** `POST /auth/register`: validate email and password length; duplicate email returns 409. Test.
- [ ] **BE-3.2** `POST /auth/login`: wrong password returns 401 with a generic message. Test.
- [ ] **BE-3.3** `POST /auth/refresh` and `POST /auth/logout`. Test both.
- [ ] **BE-3.4** `GET /users/me` and `PATCH /users/me` (CEFR level). Dependency: a user can only read/modify their own record (AC-1.2). Test with a second user.

### BE-4 Room endpoints
- [ ] **BE-4.1** (Tuấn, T2.8) Write the state machine as a pure function: `transition(current, target) -> new_state`, raising `InvalidTransition`. Unit test every valid and invalid pair (AC-1.5).
- [ ] **BE-4.2** `POST /rooms`: creator becomes the first participant; generate a short invite code.
- [ ] **BE-4.3** `POST /rooms/join`: a third user receives 409. Use a row lock or a unique constraint so 10 parallel joins give exactly 2 participants (AC-1.4). Write the concurrency test.
- [ ] **BE-4.4** `GET /rooms/{id}`: only participants can read (AC-2.6 pattern, applied now).

### BE-5 Quality gate
- [ ] **BE-5.1** `ruff` and type check pass locally and in CI.
- [ ] **BE-5.2** All unit tests in `tests/unit/` pass. Add `api/tests/` only if CI requires it; update `ci.yml` in the same PR.
- [ ] **BE-5.3** Open PR, link Jira ID, request Lộc's review.

---

## 9. Build 1 — Frontend (T2.6)

Owner: **Triết**. Reviewer: **Tài**. Blocked by G1.3 (API contract). Can use mocked responses until the backend is merged.
Code path: `web/src/pages/auth/`, `web/src/api/`.

- [ ] **F-1** Confirm the Vite + React + TypeScript + Tailwind shell in `web/` starts with `npm run dev`. Fix any broken lint.
- [ ] **F-2** Add a router with routes: `/login`, `/register`, `/`, `/rooms/new`, `/rooms/join`, `/rooms/:id`.
- [ ] **F-3** Write `web/src/api/client.ts`: base URL from `import.meta.env.VITE_API_URL`, JSON helper, error mapping (401 → login, 409 → message).
- [ ] **F-4** Register form: email, password, confirm password. Client-side validation mirrors server rules. Show server error text.
- [ ] **F-5** Login form. On success, store the session as decided in G1.4 (Decision 5).
- [ ] **F-6** Logout button in the header.
- [ ] **F-7** CEFR level picker (A2/B1/B2/C1, matching the G1 contract and existing enum) on the profile page. Saves via `PATCH /users/me`.
- [ ] **F-8** Protected-route wrapper: unauthenticated user goes to `/login`.
- [ ] **F-9** Component tests for the two forms (Vitest + Testing Library). Add to CI.
- [ ] **F-10** Responsive check: both forms work at 375 px width and at desktop width (AGENTS.md §4.1).

---

## 10. Build 1 — Room Lifecycle, End to End (T2.7)

Owners: **Tài** (API, done in B-4) and **Triết** (UI). Reviewer: **Lộc**.
Code path: `api/app/rooms/`, `web/src/pages/rooms/`.

- [ ] **R-1** Triết: "Create room" button calls `POST /rooms`, then navigates to `/rooms/:id`.
- [ ] **R-2** Triết: show the invite code on the lobby page with a copy button.
- [ ] **R-3** Triết: "Join room" page takes an invite code and calls `POST /rooms/join`. Show a clear message on 409 ("Room is full").
- [ ] **R-4** Triết: lobby page shows the two participants' names and the room state. Poll `GET /rooms/{id}` every 2 s for Build 1 (WebSocket is Sprint 3+).
- [ ] **R-5** Tài: confirm `LOBBY → READY` happens when the second participant joins. Add the test.
- [ ] **R-6** Tuấn (T2.8): confirm invalid transitions return 409 at the API level (AC-1.5). Add the test.
- [ ] **R-7** Khoa (T2.9): add one end-to-end smoke test (Playwright, or a scripted two-client pytest) for Milestone 1.

---

## 11. Milestone 1 — Demo (Sprint Review)

Target: two users in two browsers.

- [ ] **M1-1** User A registers, sets CEFR level, logs out. Verify password is stored as Argon2id (check DB row).
- [ ] **M1-2** User B registers, logs in, sets CEFR level.
- [ ] **M1-3** User A creates a room and sees the invite code.
- [ ] **M1-4** User B joins with the code. Both browsers show state `READY`.
- [ ] **M1-5** User C tries to join. Receives "Room is full" (409).
- [ ] **M1-6** Record the run (screenshots or a short screen recording) and save under `docs/pa2/screenshots/`.
- [ ] **M1-7** Lộc confirms CI is green on `pa2` (AC-1.6).

---

## 12. Definition of Done (PA2)

- [ ] Every T2.x task has: code or document merged to `pa2`, reviewer approval, Jira ticket closed, task ID (and Jira ID once available) in the PR title.
- [ ] `PROJECT_PLAN.md`, `VISION_DOCUMENT.md`, `WEEKLY_REPORT.md`, `AI_USAGE_LOG.md`, `SPECKIT_TRAINING.md` all present under `docs/pa2/`.
- [ ] Spec G1 merged before any Build 1 code.
- [ ] `pa2` merged into `dev` after Sprint Review (branch rule 6 in `SPRINT_TASKS.md`), with CI green on `pa2` and on `dev`. `main` is updated only for the tagged release.
- [ ] No `.env` files, secrets, or absolute paths in the diff (AGENTS.md §1–§2).
- [ ] Milestone 1 demo recorded.
- [ ] Sprint Review minutes and Jira screenshots in place.

---

## 13. Jira import

Moved to [docs/pa2/TODO.md](TODO.md) §4.
