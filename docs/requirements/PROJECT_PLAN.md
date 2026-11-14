# DebateSpeak AI — Project Plan
Performed: pending owner verification, Trần Lê Anh Tuấn (24125107). Reviewed: pending, Nguyễn Đình Thiên Lộc (24125093), as assigned in `docs/pa3/Changes.md`. Edited: PA3 revision of version 0.1; human verification pending.

| Document control | Value |
|---|---|
| Course / assignment | CS300 / CSC13002 — Introduction to Software Engineering; PA3-2026 Part A (5 points), second iteration of the PA2 plan |
| Work item / owner / reviewer | SCRUM-35 / Trần Lê Anh Tuấn (24125107) / Nguyễn Đình Thiên Lộc (24125093); reassigned from Tài on 2026-11-14 |
| Task branch | `feature/SCRUM-35-plan-reassign` |
| Deliverable | `docs/requirements/PROJECT_PLAN.md` and its PDF, listed with `docs/pa3/Changes.md` |
| Version / date | 0.2 / 14 November 2026 (revision of 0.1 / 29 October 2026); dates use Asia/Bangkok (UTC+7) |
| Status | PA3 revision draft. Performed: pending owner verification. Reviewed: pending, Nguyễn Đình Thiên Lộc (24125093). Status is as of 2026-11-14 from the repository, not live Jira |
| Group | Vision records Group 02; the release owner must confirm the archive's official Group ID |

Status words in this plan mean what the repository shows on 2026-11-14. A task is Done only when its work is merged and verified. Jira status is not used as evidence, because earlier Jira and review statements were found to be wrong (section 3.2, R-05).

## 1. Introduction and purpose
DebateSpeak AI is a browser application where two English learners practice spontaneous speaking through a live spoken debate. It combines topic selection, controlled room participation, speaker-attributed transcription and evidence-grounded learning feedback. The audience is learners at self-assessed CEFR levels A2 to C1.

This plan tells the team and the reviewers how the work of PA3 (Sprint 3) is organized, what was delivered, what was not, and how the remaining sprints are planned. Version 0.2 replaces the PA2 draft. It states the PA3 position honestly: the use-case documents are done, and the graded FG-03 end-to-end slice is not.

## 2. Project Overview

### 2.1 Goals and acceptance targets
These are targets from the architecture, Vision and G1 contract, not measured results.

| Goal | Observable target | Verification / planned milestone |
|---|---|---|
| P1 — Working account and lobby slice | Two authenticated users create and join a room and see `READY`; with one creator and ten competing joiners only one join succeeds and the room holds two people | G1 acceptance matrix, database integration tests, two-browser E2E; Builds 1 and 2 (not met as of 2026-11-14) |
| P2 — Intelligible live practice | One-way audio delay at most 500 ms median (NFR-01); final transcript at most 3 s median (NFR-02); at least 98% correct speaker attribution (NFR-04) | Timed two-client tests; Build 3 |
| P3 — Grounded feedback | 100% of language and argument items carry a quote that exists in the transcript (NFR-13); sampled grammar feedback judged correct by qualified raters | Grounding checks and human evaluation; Build 4 |
| P4 — Reviewable learning loop | Report ready at most 3 minutes after a 10-minute debate (NFR-05), with transcript, feedback, evidence and history | End-to-end report journey; Build 4 |
| P5 — Protect participation and data | No streaming or transcription before both participants consent (FR-13); no raw audio stored by default (NFR-09); unauthorized access rejected | Negative authorization and consent tests; Builds 3 and 4 |

### 2.2 Scope and boundaries
The product vision (`docs/requirements/VISION_DOCUMENT.md`, version 0.2) covers ten functional groups: accounts and profiles (FG-01), topics (FG-02), room and session management (FG-03), live audio (FG-04), transcription and attribution (FG-05), English analysis (FG-06), argument analysis (FG-07), fact checking (FG-08), evaluation and consensus (FG-09), and history and reports (FG-10). The vision is the product scope. PA3 is one slice of it.

| Stage | Scope | State on 2026-11-14 |
|---|---|---|
| PA2 / Sprint 2 | Documents only: plan, vision, Spec Kit init, AI and weekly report | Done and submitted |
| Build 1 / Sprint 3 | What FG-03 needs: migrations and seed, register and login, create and join a room, `LOBBY` to `READY`, lobby UI | Not integrated: not on `pa3` (section 4.4) |
| Build 2 / Sprint 3 | FG-03 end to end (UI to API to database), topic selection, synchronized start boundary, Spec Kit, narrated video | Not done |
| Build 3 / Sprint 4 | FG-04 and FG-05: consent-gated LiveKit audio and streaming STT | Not started; later build |
| Build 4 / Sprint 5 | FG-06 to FG-10, hardening, final demo | Not started; later build |

FG-03 is the graded PA3 function. FG-01 (register and login) supports it. FG-02 (topic list and filter) is an extra. Live audio, speech-to-text and AI coaching are Builds 3 and 4, not PA3, and no PA3 demo may present a lobby or a design as working audio.

Out of the MVP: native mobile apps, video and audience rooms, automated partner matching, payments, tournaments and rankings, teacher dashboards, phoneme-level diagnosis, large judge panels, model training and multi-region infrastructure.

### 2.3 Deliverables
PA3 deliverables mapped to the PA3 rubric. Status comes from `docs/pa3/CHECKLIST.md` (as of 2026-11-14) and `docs/pa3/MEETINGS/SPRINT_REVIEW.md`.

| Part | Points | Deliverable | Owner | Status on 2026-11-14 |
|---|---|---|---|---|
| A | 5 | Revised plan and `docs/pa3/Changes.md` | Tuấn | Plan revised to 0.2 (merged, PR #31); PDF rebuilt 2026-11-14; `Changes.md` has rows 1.1 to 1.10; reviewer sign-off pending |
| B | 5 | Revised Vision Document | Khoa | Version 0.2 merged (PR #27, final touches PR #30); PDF rebuilt 2026-11-14 with Mermaid diagrams; reviewer sign-off pending |
| C | 10 | Use-case model, 54 use cases, Mermaid diagrams | Tuấn | Done (`docs/pa3/USE_CASE_MODEL.md`, `.pdf`); reviewer sign-off pending |
| D | 45 | 54 use-case specifications, 201 alternative outcomes, 116 prototype screenshots | Triết, Tuấn | Done (`docs/pa3/USE_CASE_SPECIFICATIONS.md`, `.pdf`, `docs/pa3/prototypes/`); reviewer sign-off and spot check pending |
| E | 20 | FG-03 end to end with Spec Kit, E2E test, narrated YouTube video | Tài, Triết; Khoa (E2E); Lộc (video) | Not met: the FG-03 backend is not on `pa3` (only Tài's Java auth commit 3f585e0 on `backend-tai`, unmerged, based on old commit 84aad76); no room API, migrations or integrated FG-03 flow; `specs/001-frontend-baseline/` merged (PR #45) but no FG-03 spec; video uploaded (PR #47), not yet checked by the team; no E2E test |
| F | 5 | AI usage log, weekly report, meeting notes, Jira screenshots | Khoa, Lộc | Partial: AI log records tools per member (PR #41), tasks and prompts still to be added; weekly report still has "[Confirm actual status]" markers; meeting PDF missing; Jira screenshots exist (`docs/pa3/jira-1.png`, `jira-2.png`) |

Part E is the largest gap. The checklist rows E1, E3 (video not yet checked) and E4 are Not met or Missing, and E2 is partial (frontend baseline spec only, no FG-03 spec). The per-member Spec Kit entries requested in PA2 TA feedback are Missing for all five members.

### 2.4 Assumptions and dependencies

| Assumption | Verification owner | If false |
|---|---|---|
| The team can still complete FG-03 within the submission buffer | Team, at the first stand-up after 2026-11-14 | Escalate to the TA and state the gap; do not label a partial slice complete |
| `pa3` accepts PRs from feature branches and Lộc merges `pa3` into `dev` once | Lộc | Follow `docs/pa3/README.md` |
| Official Moodle cutoff matches the sprint docs (Fri 2026-11-13, buffer 11-14 to 11-15) | Lộc | Not verified here; confirm on Moodle |
| LiveKit, STT and LLM quotas are needed only from Sprint 4 | Lộc with Khoa, Tuấn | Check before Build 3 |
| No paid-service expenditure is authorized | Lộc | Confirm a budget before cost tests |

## 3. Project Organization

### 3.1 Team structure and responsibilities
All five members design, code, test and document. The roles follow `AGENTS.md`.

| Member | Student ID | Official team role | PA3 responsibility |
|---|---|---|---|
| Nguyễn Đình Thiên Lộc | 24125093 | DevOps & QA / Fact-Checking Lead | Docker database and CI; reviewer of the plan and vision; FG-03 demo video; submission package and `pa3` to `dev` merge |
| Nguyễn Bảo Minh Triết | 24125047 | Frontend & WebRTC/Audio Lead | Frontend shell, auth pages, lobby UI, FG-03 frontend; use-case flows and prototypes with Tuấn |
| Nguyễn Hồng Tấn Tài | 24125078 | Backend & Real-Time Media Lead | Migrations and seed, auth API, room API, FG-03 backend lead (SCRUM-41, 24, 26, 38) |
| Nguyễn Anh Khoa | 24125058 | AI Audio & Speech Pipeline Lead | Vision Document, weekly report and AI log, PDFs, FG-03 E2E test |
| Trần Lê Anh Tuấn | 24125107 | AI Orchestrator & Analysis Lead | This plan and `Changes.md` (SCRUM-35, reassigned from Tài), room state machine, use-case model and specifications, `LLMAdapter` and grounding guard |

Each actionable ticket has one assignee and one reviewer. A merged PR counts as reviewed under the team's rule; review sign-offs listed as pending above are not recorded approvals.

### 3.2 Risk register
Likelihood and impact are qualitative planning estimates. Owners must confirm their rows.

| ID | Risk | Likelihood / impact | Mitigation and response | Owner | Trigger |
|---|---|---|---|---|---|
| R-01 | FG-03 integration gap: migrations, auth API and room API are not on `pa3`; the frontend scaffold lives on `feature/UI-scaffold`, so frontend and backend never met. Already happened | High / High | Merge SCRUM-41, then 24, 26; merge the scaffold into `pa3`; wire UI to API; run Khoa's E2E; cut extras first. Integrate in small steps and record results | Tài with Triết | Any FG-03 PR not merged at the next check-in |
| R-02 | Single owner dependency: SCRUM-41, 24, 26 and 38 are all assigned to Tài, so a delay in the first blocks the rest | High / High | Split the chain; assign a second implementer or pair for the room API and FG-03 backend; Tuấn's state machine is a ready input | Team, decided at the next planning meeting | A task in the chain stays open past its date |
| R-03 | Stale Jira status: Jira and repository docs disagree (for example SCRUM-28 shows "merged" in the Sprint Review but "local, review pending" in Tuấn's TODO) | High / Medium | Reconcile Jira, PR state and docs together before submission; treat the repository as evidence | Lộc with each owner | Mismatch found at any review |
| R-04 | Time: the deadline (Fri 2026-11-13) has passed; the buffer ends 2026-11-15 | High / High | Prioritize FG-03 and the missing Part E evidence over extras (SCRUM-44 to 48); report the real state if it cannot be finished | Team | Part E items still open on 11-15 |
| R-05 | False status claims in earlier reviews: the first Sprint Review said FG-03 was done without checking the repository | Medium / High | Every status in this plan cites a repository artifact; the Sprint Review is rewritten from merged and verified work | Khoa, Lộc | A statement without a linked artifact |
| R-06 | CI job for migrations and seed (SCRUM-43, PR #17) is merged but skips until SCRUM-41 lands, so it has not run against a real database | Medium / Medium | Treat it as unverified; run it after SCRUM-41 merges | Lộc | SCRUM-41 merged but job still skipped |
| R-07 | Missing evidence in the zip: FG-03 spec, per-member Spec Kit entries, video check, E2E result, PDFs | High / High | Check the submission list in section 4.9 item by item before packaging | Lộc | Package build finds a missing file |
| R-08 | Consent, authorization and grounded-feedback controls are cut to recover schedule | Low / High | Do not cut these controls; in PA3 the start stays disabled for unsupported media | Team | Any proposal to skip a consent test |

Cut optional work (rankings, video, extra panels, FG-02 and stretch spikes) before cutting a Must requirement. If a Must requirement is at risk, tell the TA instead of relabeling a partial feature complete.

### 3.3 Lessons incorporated
From the PA1 lessons and the PA3 Sprint Review: agree interface contracts before parallel work; integrate and test small increments through the sprint; update Jira when work changes; plan demo preparation before the last days; do not put documents ahead of the graded slice. These are lessons recorded in the repository, not a new retrospective.

## 4. Project Plan

### 4.1 Scrum process and communication
Scrum with sprint planning, at least two documented check-ins, a Sprint Review and a Retrospective. Messenger carries daily coordination, Google Meet carries meetings, GitHub PRs carry technical review, and Jira carries assignment and progress. Response times follow `docs/management/TEAM_CONTRACT.md`. Unfinished work is re-planned and reported, not marked Done.

Meeting evidence for PA3: weekly reports for 05/11/2026 and 10/11/2026 (`docs/pa3/WEEKLY_REPORT.md`) and the notes in `docs/pa3/MEETINGS/`. `SPRINT_PLANNING.md` in that folder currently describes PA4, and `SPRINT_REVIEW.md` is dated 2026-11-10 and awaits its 2026-11-13 update. These need correction before submission.

### 4.2 Five-sprint schedule
From `docs/ROADMAP.md`. Weeks are relative roadmap labels.

| Sprint / PA | Weeks | Goal | Verification milestone |
|---|---|---|---|
| 1 / PA1 | 1–2 | Proposal, survey, contract, architecture, scaffold, CI | Done |
| 2 / PA2 | 3–4 | Plan, vision, Spec Kit init, AI and weekly report | Documents submitted; no code build |
| 3 / PA3 | 5–6 | Use-case model and specifications, prototypes, Build 1 then Build 2 (FG-03), `Changes.md` | Build 1 plus Build 2 with narrated video; documents done, FG-03 not met |
| 4 / PA4 | 7–8 | C4 and deployment, live audio and streaming STT | Build 3 (planned) |
| 5 / PA5 | 9–10 | Analysis, reports, testing, hardening, final demo | Build 4 and 15-minute live demo (planned) |

### 4.3 Sprint 3 (PA3) schedule
Real dates from `docs/pa3/README.md` and `docs/pa3/CHECKLIST.md`.

| Date | Event | Outcome |
|---|---|---|
| 2026-11-03 | Scope shrunk to FG-03; database first | Recorded in `Changes.md` rows 1.1 and 1.4 |
| 2026-11-04 | Database first: migrations and seed target (SCRUM-41); Docker database (SCRUM-42) | SCRUM-42 done (PR #15); SCRUM-41 not on `pa3` |
| 2026-11-05 | Weekly report and first check-in; auth API and frontend shell target | Targets missed |
| 2026-11-06 | Room API and lobby UI target; CI migrate and seed job (SCRUM-43) | Job merged (PR #17), unverified |
| 2026-11-10 | Second check-in; FG-03 backend, frontend and E2E target; first Sprint Review status | FG-03 not done; first Sprint Review overstated progress and was corrected |
| 2026-11-11 | Revised plan target (SCRUM-35) and Lộc's review target | Plan was not revised; reassigned to Tuấn on 2026-11-14 |
| 2026-11-12 | Video (SCRUM-39), use-case specs and PDFs targets | Specs done; video uploaded later (PR #47, 2026-11-14), content not checked; PDFs partial |
| **2026-11-13** | **Sprint 3 deadline (Friday)** | **Passed; Part E not met** |
| 2026-11-14 to 11-15 | Submission buffer for the zip and upload | Open now (this document is dated 11-14) |

The deadline has passed. As of 2026-11-14 the following are still open: FG-03 implementation (E1; the backend is not on `pa3`, only Tài's unmerged Java auth commit 3f585e0 on `backend-tai`), the FG-03 Spec Kit spec (E2; `specs/001-frontend-baseline/` is merged via PR #45), the team check of the uploaded video (E3, SCRUM-39; https://youtu.be/wJxqi3J0phE, PR #47, visibility and content not checked), the E2E test (E4, SCRUM-38), per-member Spec Kit entries, a corrected weekly report, the tasks and prompts in the AI log (tools are recorded per member, PR #41), the meeting PDFs, rebuilt PDFs of the plan and vision, reviewer sign-offs for Parts C and D, the zip, the Git log export and the `pa3` to `dev` merge. Whether the buffer can cover them is not verified; what can be finished before the actual cutoff is an open decision (section 4.10).

### 4.4 Build 1 and Build 2 scope for FG-03
Build 1 was shrunk to what FG-03 needs. Source: `docs/pa3/Changes.md` section 1 (rows 1.1, 1.4, 1.5).

| Kept in Build 1 | Cut from Build 1 |
|---|---|
| Migrations and seed with mock data (5 users, 10 topics, 1 room) | Refresh-token rotation |
| Register and login (Argon2id, access JWT) | Profile editing, CEFR screens |
| Create room, join by invite code, `LOBBY` to `READY`, 409 on a third user | `LIVE` and `ENDED` beyond the FG-03 start |
| Lobby UI | Separate Milestone 1 demo and smoke test (folded into the FG-03 video and E2E) |

Build 1 Jira keys: SCRUM-24 auth, SCRUM-25 frontend, SCRUM-26 room API, SCRUM-27 lobby UI, SCRUM-28 state machine; SCRUM-29 and SCRUM-30 folded into FG-03; new SCRUM-41 database and seed, SCRUM-42 Docker database.

Build 2 is FG-03 end to end: topic selection, ready screen and a synchronized debate start, with UI to API to database connected, a Spec Kit trail and a narrated video. The start must not begin audio or transcription, because those are Build 3 and need dual consent (FR-13). The exact boundary of the start action is open decision D3.

Extra preparation (stretch, cut first): FG-02 topic API (SCRUM-44), LiveKit token spike (SCRUM-45), `STTAdapter` (SCRUM-46), `LLMAdapter` and grounding guard (SCRUM-47), microphone setup spike (SCRUM-48), CI migrate and seed (SCRUM-43).

Relevant requirement ids: FR-01 (register and authenticate), FR-10 (create room), FR-11 (join, capacity two), FR-12 (state graph and server-side validation); FR-13 to FR-15 belong to the later session part of FG-03. Contracts for Build 1 are in `docs/architecture/G1_SPEC_BUILD1.md`.

### 4.5 Work breakdown and status on 2026-11-14
"Not verified" means the repository sources disagree or give no evidence.

| Jira | Work | Owner | Reviewer | Status |
|---|---|---|---|---|
| SCRUM-41 | Alembic migrations and seed | Tài | Khoa | Open; not on `pa3` |
| SCRUM-42 | Docker database | Lộc | not verified | Done (PR #15 merged) |
| SCRUM-43 | CI migrate and seed | Lộc | not verified | Merged (PR #17); skips until SCRUM-41; unverified |
| SCRUM-24 | Auth API | Tài | not verified | Open; not on `pa3`. Java auth commit 3f585e0 on `backend-tai`, unmerged. Java backend decision by Tài, 2026-11-14, pending team confirmation (PR #43); AGENTS.md still says FastAPI |
| SCRUM-25 | Frontend shell, register and login pages | Triết | not verified | Lobby work from `feature/SCRUM-25-ui-complete` merged as PR #28 (SCRUM-52); account UI merged as PR #39 (SCRUM-49); entry pages merged as PR #44 (SCRUM-50). Account recovery is gated off (PR #45). The shell and the register/login flow against a real auth API are not verified |
| SCRUM-26 | Room API | Tài | not verified | Open; not on `pa3` |
| SCRUM-27 | Lobby UI | Triết | not verified | Lobby UI merged as PR #28 (SCRUM-52); not verified against SCRUM-27 and not connected to a room API |
| SCRUM-28 | Room state machine and transition tests | Tuấn | Tài | Sprint Review says merged with unit tests; Tuấn's TODO says local, Tài review pending. Not verified |
| SCRUM-38 | FG-03 backend, frontend and E2E | Tài, Triết; Khoa (E2E) | Lộc | To Do; not met |
| SCRUM-39 | Narrated FG-03 video | Lộc | Khoa | Video uploaded (https://youtu.be/wJxqi3J0phE, PR #47); visibility and content not checked by the team; FG-03 itself does not run on `pa3` |
| SCRUM-35 | Revised plan and `Changes.md` | Tuấn (from Tài) | Lộc | This draft; review pending |
| SCRUM-35 | Revised Vision (0.2) | Khoa | Lộc | PR #27 merged; final touches on `feature/SCRUM-35-vision-final`; sign-off pending |
| SCRUM-36 | Use-case model | Tuấn | pending | Done (PR #19); sign-off pending |
| SCRUM-37 | Use-case specifications and prototypes | Triết, Tuấn | pending | Done (PR #19); sign-off pending |
| SCRUM-40 | AI usage log, weekly report, meetings, screenshots | Khoa, Lộc | Lộc | Partial |
| SCRUM-47 | `LLMAdapter` and grounding guard | Tuấn | Khoa | Merged with unit tests per the Sprint Review; peer review not verified |
| SCRUM-44, 45, 46, 48 | Extras: topic API, LiveKit token, `STTAdapter`, mic spike | Tài, Tài, Khoa, Triết | not verified | Stretch; no evidence on `pa3` |
| SCRUM-49 to 52 | UI refinement packages (Tuấn, Tài, Khoa, Lộc) | as named | as named | SCRUM-49 account UI merged (PR #39, Tuấn); SCRUM-50 entry pages extracted and dead code removed (PR #44, Tài), partly done: shell and recovery pages not done; SCRUM-51 narrow preview summary and SCRUM-49 type/spacing roles merged (PR #46); SCRUM-52 lobby merged (PR #28); browser tests not run on the build machine (Chromium does not launch) |
| none | `PA3-Group[GroupId]` zip, Git log, `pa3` to `dev` merge | Lộc | n/a | Missing; local `PA3-Group2/` is partial |

SCRUM-49 to 52 are UI refinement work added outside the graded FG-03 path. They do not replace FG-03.

### 4.6 Sprint 4 and Sprint 5 outline
Planned from `docs/ROADMAP.md`. Planned, not committed: detailed tasks, owners and dates are fixed at each sprint's planning meeting.

| Sprint | Planned scope |
|---|---|
| Sprint 4 (PA4) | Revised use-case specifications with `Changes.md`; C4 context, container, component and deployment diagrams; LiveKit Cloud audio; Silero VAD and streaming STT adapter; Build 3 (FG-04 and FG-05) with a narrated demo. Any FG-03 gap carried over is fixed first |
| Sprint 5 (PA5) | Language Coach, Argument Coach, fact-checking adapter, consensus engine and grounding guards; reports and history; Playwright E2E, audio chaos tests and golden-set evaluation; Build 4 and the 15-minute live demo of all ten FGs; test plan and reflective report |

The Sprint Review actions for PA4 apply: agree audio and STT interfaces before implementation, integrate regularly and record results, keep documents aligned with delivered work, and reserve time for demo and evidence.

### 4.7 Quality and verification approach
- A feature counts as done only when merged into `pa3` through a reviewed PR and shown working. No claim without evidence: a PR number, test output, a screenshot or a video.
- Tests: pytest for the state machine and room rules; PostgreSQL integration tests for room capacity and transitions; Playwright for the FG-03 browser journey (register, create, join, `READY`, third user gets 409); web checks from `web/`: `npm run build`, `npm run lint`, `npm run test:e2e`.
- CI is the GitHub Actions workflow in `.github/workflows/ci.yml`. The migrate and seed job is unverified until SCRUM-41 lands (R-06).
- Grounding (NFR-13): quote matching alone does not prove feedback is correct; human review is needed in Build 4.
- Reviews: a merged PR counts as reviewed; sign-offs shown as pending in this plan are not claimed.
- No application test or benchmark result is reported in this plan. None was run while writing it.

### 4.8 Jira, source control and progress evidence
Jira project `SCRUM` is the task system. Branches are `feature/SCRUM-<nn>-<short-name>` (bug fixes `bugfix/...`) from `pa3`. PRs go into `pa3`, never into `dev` or `main`, and each needs a reviewer. Lộc merges `pa3` into `dev` once, at the end of the sprint. No one commits code directly to `pa3`. Jira status and PR state are different observations and are reconciled together (R-03). The Jira screenshots are `docs/pa3/jira-1.png` and `jira-2.png`; live Jira was not read for this version.

### 4.9 Submission package and checklist
The shared status list is `docs/pa3/CHECKLIST.md`. The package `PA3-Group[GroupId].zip` must hold:

| # | Item | Owner | Status |
|---|---|---|---|
| S1 | `PA3-Group[GroupId]/` folder with all documents as `.md` and `.pdf` | Lộc | Missing; local folder partial and git-excluded |
| S2 | Git log export | Lộc | Missing |
| S3 | Source code without `node_modules`, build output or `.env` | Lộc | Code incomplete (FG-03) |
| S4 | Spec Kit artifacts (`specs/`, plans, tasks) | all | Partial: `specs/001-frontend-baseline/` merged (PR #45); no FG-03 spec; per-member entries missing |
| S5 | YouTube link for the FG-03 video | Lộc | Link exists (https://youtu.be/wJxqi3J0phE, PR #47); visibility and content not checked |
| S6 | Zip of the package | Lộc | Missing |
| S7 | `pa3` to `dev` merge after the package is complete | Lộc | Pending |

PDFs come from `python report/pdf/build.py <file.md>` (Pandoc, Mermaid, `latexmk`). The rebuild of this plan's PDF is a separate step after this draft is reviewed.

### 4.10 Open decisions for the team

| Item | Decision needed | Follow-up |
|---|---|---|
| D1 — Remaining time | Which Part E items can be finished before the real cutoff, and whether to ask the TA about the missed 2026-11-13 deadline | Team, today |
| D2 — Cutoff | Exact Moodle date, time and timezone; official Group ID | Lộc |
| D3 — Build 2 start boundary | What the FG-03 "synchronized debate start" does without audio, keeping unsupported starts blocked | Tài, Triết, Lộc |
| D4 — Owner dependency | Who takes part of the SCRUM-41, 24, 26, 38 chain from Tài | Team |
| D5 — Database contract | The database design and G1 use different names (for example `full_name` and `target_cefr` against `display_name` and `cefr_level`). Agree a mapping before migrations are accepted | Tài, Tuấn, Lộc |
| D6 — Spec Kit entries | Each member's own Spec Kit entry, with real activity and date | Each member |
| D7 — Status reconciliation | SCRUM-28 and SCRUM-47 merge and review state; Jira against the repository | Lộc, Tuấn |

## 5. References and evidence baseline
Paths are repository-relative. No application tests were run and live Jira was not read when writing this version.

| Ref. | Source | Use |
|---|---|---|
| S1 | `docs/assignments/PA3_OVERVIEW.md`, `docs/pa3/README.md` | PA3 parts, points, rules, scope |
| S2 | `docs/pa3/Changes.md` | Change rows 1.1 to 1.7 and Build 1 tables |
| S3 | `docs/pa3/CHECKLIST.md` | Part-by-part status on 2026-11-14 |
| S4 | `docs/pa3/MEETINGS/SPRINT_REVIEW.md`, `docs/pa3/WEEKLY_REPORT.md`, `docs/pa3/AI_USAGE_LOG.md` | Retrospective, risks, evidence gaps |
| S5 | `docs/pa3/<member>/TODO.md` (loc, triet, tai, khoa, tuan) | Owners, tasks, dates, statuses |
| S6 | `docs/ROADMAP.md`, `docs/management/SPRINT_TASKS.md`, `docs/management/TEAM_CONTRACT.md` | Sprint plan, work breakdown, process |
| S7 | `docs/requirements/VISION_DOCUMENT.md` (0.2) | Product scope |
| S8 | `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md`, `docs/architecture/G1_SPEC_BUILD1.md` | FR and NFR ids, Build 1 contracts |
| S9 | `AGENTS.md` | Official roles and engineering rules |

## 6. AI assistance declaration
This revision was drafted with AI assistance from the repository sources listed in section 5, at the request of the lead while the owner was not present. The owner has not yet read or verified it. The owner must check every status and date against the repository, and record the AI use in `docs/pa3/AI_USAGE_LOG.md`. No Jira, commit, push or PR action was performed as part of this writing task.

## 7. Revision record

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-29 | PA2 plan (SCRUM-20) |
| 0.2 | 2026-11-14 | PA3 revision (SCRUM-35), below |

Changes in 0.2 against 0.1, with the matching `docs/pa3/Changes.md` rows:

| # | Change in 0.2 | Reason | Changes.md row |
|---|---|---|---|
| 1 | Owner changed to Tuấn, reviewer Lộc; PA2 performed and reviewed lines replaced by pending lines | Reassigned from Tài on 2026-11-14; no performance or review is claimed | Section 1 header |
| 2 | Build 1 moved to Sprint 3 and cut to what FG-03 needs (section 4.4) | PA2 had no code increment; PA3 grades one FG end to end | 1.1 |
| 3 | Spec Kit location at the repository root, no `src/` copy | One copy avoids drift | 1.2 |
| 4 | Real Sprint 3 dates, the passed deadline and open items (section 4.3) | Replaces the PA2 relative-week targets | 1.3 |
| 5 | Database first (SCRUM-41, 42) added to the plan | Every member runs the same data | 1.4 |
| 6 | Extras (SCRUM-43 to 48) marked as stretch, cut first | Reduce risk for Builds 3 and 4 | 1.5 |
| 7 | Branch and PR rules (section 4.8) | Keep `dev` releasable | 1.6 |
| 8 | No TA feedback entries added | None received as of 2026-11-10 | 1.7 |
| 9 | New: rubric mapping (2.3), risk register with the FG-03 gap, single owner and false status claims (3.2), work breakdown (4.5), quality approach (4.7), submission list (4.9), open decisions (4.10) | Brutal honesty on actual PA3 state | Not yet in `Changes.md`; add a row |
| 10 | PA2-only tables removed: Sprint 2 task close-out, proposed PA2 subtasks, PA2 review and packaging gates | Closed sprint; recoverable from Git history at `f789f5c` | 3 (repository layout) |
