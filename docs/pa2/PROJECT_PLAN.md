# DebateSpeak AI — Initial Project Plan
Performed: Codex-assisted drafting for Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: Nguyễn Anh Khoa (24125058), AI Audio & Speech Pipeline Lead — pending. Edited: Codex; human verification pending.

| Document control | Value |
|---|---|
| Course / assignment | CS300 / CSC13002 — Introduction to Software Engineering; PA2-2026 Part A (15 points) |
| Work item / owner / reviewer | SCRUM-20 / Tuấn / Khoa, as assigned in the current PA2 task documents |
| Task branch / deliverable | `feature/SCRUM-20-project-plan` / `docs/pa2/PROJECT_PLAN.md`, confirmed by the supplied Jira screenshot |
| Version / preparation date | 0.1 / 29 October 2026; dates use Asia/Bangkok (UTC+7) |
| Status | Initial Markdown draft for user and peer review; revise in PA3 after TA feedback |
| Planning baseline | Remote `pa2` at `dd4851e592e499823c65d71589a7afaad9d39bef`, inspected on 29 October 2026 |
| Deadline information | User reports PA2 is due at the end of this week; the exact Moodle date/time is not yet verified |
| Group | Vision records Group 02; release owner must confirm the archive's official Group ID |

This plan uses the current five-sprint baseline, not the older local checkout or the
legacy four-sprint section of the testing guide. PA2 contains documents; Build 1 code
has moved to Sprint 3. Repository merges, dated Jira exports and planned work are
distinguished below. No live Jira access, human approval or product test result is implied.

## 1. Introduction
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

DebateSpeak AI is a browser application where two English learners practice spontaneous
speaking through a live spoken debate. It combines topic selection, controlled room
participation, speaker-attributed transcription and evidence-grounded learning feedback.
The intended audience is learners at self-assessed CEFR levels A2 to C1, including
university students and non-native professionals. This plan describes how five team
members will organize, build, verify and deliver the product across PA1–PA5.

## 2. Project Overview
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

### 2.1 Goals and acceptance targets
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

The following are targets inherited from the architecture, Vision and G1 contract,
not measured achievements. Each build must retain the preceding build's working behavior.

| Goal | Observable target | Verification / planned milestone |
|---|---|---|
| P1 — Establish a working account/lobby slice | Two authenticated users create/join a room and see READY; with one creator and ten competing joiners, only one join succeeds and the room contains two people | G1 acceptance scenarios, database integration and two-browser smoke test; Build 1 |
| P2 — Enable intelligible live practice | Median one-way audio delay at most 500 ms; median final-transcript delay at most 3 s; at least 98% correct speaker attribution on the defined test set | Timed two-client tests and labeled transcripts, with environment and failures reported; Build 3 |
| P3 — Produce grounded and useful feedback | 100% of retained language/argument quotes match the referenced speaker; at least 85% of sampled grammar feedback is judged correct by qualified raters | Automated grounding checks and human evaluation; Build 4 |
| P4 — Complete a reviewable learning loop | Median report completion at most 3 minutes after a 10-minute debate, with transcript, reasoning feedback, evidence links, practice recommendations and basic history | End-to-end report journey and measured report timing; Build 4 |
| P5 — Protect participation and personal data | No streaming/transcription before both participants explicitly consent; no raw-audio persistence by default; unauthorized profile/room/report access is rejected | Negative authorization/consent tests, storage inspection and deletion tests before learner use; Builds 3–4 |

### 2.2 Scope and boundaries
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

The final MVP covers the ten functional groups: accounts/profiles (FG-01), topics
(FG-02), room/session management (FG-03), live audio (FG-04), transcription/attribution
(FG-05), English analysis (FG-06), argument analysis (FG-07), fact checking (FG-08),
evaluation/consensus (FG-09), and history/reports (FG-10). It includes the essential
topic-moderation, abuse and data-deletion controls, with detailed Must/Should/Could
priorities retained from the architecture. A functional-group label does not turn
every enhancement in that group into a Must requirement.

| Stage | Scope |
|---|---|
| PA2 / Sprint 2 | Project Plan, Vision, Spec Kit/training evidence, AI usage and weekly report; reviewed G1 and database design as supporting documents. No required code increment |
| Build 1 / Sprint 3 | FG-01 and the FG-03 two-person lobby: register/login/refresh/logout, CEFR profile, create/join/read room, READY and capacity/state validation |
| Build 2 / Sprint 3 | FG-03 end-to-end room/session workflow, topic selection and use-case implementation/demo; precise start/media boundary confirmed at Sprint 3 planning |
| Build 3 / Sprint 4 | FG-04 and FG-05: consent-gated LiveKit Cloud audio and track-attributed streaming STT; preserve the existing room/account slice |
| Build 4 / Sprint 5 | FG-06–10 core learning loop and all remaining Must requirements across the ten groups, hardening, evaluation and final live demo |

Build 1 uses explicitly seeded topics until FG-02 is available. Basic topic selection
is planned for Build 2; the remaining topic-management Must requirements must be
tracked for completion by Build 4. No lobby or design demo may be presented as working
live audio. Before declaring the complete FG-03 slice done, clarify which session
operations can be demonstrated before media integration; keep unsupported starts blocked.

Out of the MVP: native mobile applications, video/audience rooms, automated partner
matching, payments, tournaments/public rankings, teacher dashboards, advanced
phoneme-level diagnosis, large judge panels, model training and multi-region infrastructure.
These boundaries apply to the product; live audio, AI and reports are later-build work,
not exclusions from the final product.

### 2.3 Deliverables
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

| Milestone | Deliverables |
|---|---|
| PA1 baseline | Proposal, existing-app survey, team contract/process, architecture/testing designs and repository scaffold |
| PA2 | This Project Plan; `docs/requirements/VISION_DOCUMENT.md`; Spec Kit constitution/scaffold and genuine per-member training evidence; `AI_USAGE_LOG.md`; `WEEKLY_REPORT.md`, meeting evidence and Jira screenshots; Markdown/PDF counterparts, Git log and submission archive |
| PA2 supporting | `docs/pa2/G1_SPEC_BUILD1.md` and `api/app/core/database_document.md`; merged design is not evidence of implemented behavior |
| PA3 | Revised plan/Vision with TA-change traceability; use-case model/specifications and UI prototypes; Builds 1–2, first functional-group implementation and narrated demo; sprint reports |
| PA4 | Revised use cases, C4 context/container/component and deployment diagrams; Build 3 and second implementation-phase demo; sprint reports |
| PA5 | Build 4, test plan/cases/execution results and defects, reflective report, final code package and a 15-minute live demonstration of the complete product |

PA2 submission packaging retains original Markdown and PDFs generated through the
repository's `latexmk` pipeline. This writing task produces the Markdown draft;
PDF export, human review, merging and school submission remain separate checks.

### 2.4 Assumptions and dependencies
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

Owners below are proposed verification responsibilities, not recorded sign-offs.

| Assumption | Verification owner | Check / consequence if false |
|---|---|---|
| The five-person team can sustain the sprint backlog alongside classes | Each member reports capacity; Lộc coordinates | Confirm capacity at planning; split/reduce uncommitted work rather than inventing hours |
| Five PA-aligned sprints fit official course dates | Lộc, with Tuấn recording the plan | Verify Moodle/Jira dates; the nominal two-week schedule is not proof of calendar dates |
| LiveKit Cloud and STT/LLM/search quotas permit the demo workload | Lộc, with Tài/Khoa/Tuấn for their integrations | Check quotas and provider retention before testing; use adapters, bounded workloads and explicit degraded-service behavior |
| Local STT fallback has sufficient compute | Khoa | Benchmark before promising fallback latency; disclose degradation |
| Two willing learners and evaluation raters can be recruited | Khoa coordinates; owners confirmed at planning | Seek at least six consenting pairs and qualified feedback raters; report recruitment limits honestly |
| The existing build/deployment tooling works on team and CI machines | Lộc | Reproduce builds and inspect artifacts; do not assume green legacy report CI validates every new PDF |
| No paid-service expenditure is authorized by this plan | Lộc | Confirm a numeric operating budget before cost acceptance tests; no price or free-tier capacity guarantee is assumed |

## 3. Project Organization
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

### 3.1 Team structure and responsibilities
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

All five members contribute design, code, testing and documentation. R1–R5 below
identify subsystem leadership, not exclusive permission to touch a layer. Official
roles follow AGENTS.md; Lộc additionally coordinates Jira and release custody under
the team contract. No separate Scrum Master or Product Owner appointment is invented.

| ID | Member / student ID | Official role | Current responsibility |
|---|---|---|---|
| R1 | Nguyễn Bảo Minh Triết / 24125047 | Frontend & WebRTC/Audio Lead | Vision and its PDF; review Khoa's report; later auth/lobby/audio/report UI |
| R2 | Nguyễn Hồng Tấn Tài / 24125078 | Backend & Real-Time Media Lead | Database design, Spec Kit review, Moodle submission; later auth/room APIs and media coordination |
| R3 | Nguyễn Anh Khoa / 24125058 | AI Audio & Speech Pipeline Lead | Weekly/AI reports and meeting evidence; review this plan; later STT and smoke tests |
| R4 | Trần Lê Anh Tuấn / 24125107 | AI Orchestrator & Analysis Lead | G1, this plan, Vision review; later state-machine implementation and analysis/orchestration |
| R5 | Nguyễn Đình Thiên Lộc / 24125093 | DevOps & QA / Fact-Checking Lead | Jira/release custody, Spec Kit evidence collection and G1 review; later QA, staging and fact checking |

Every member supplies their own truthful Spec Kit training entry and AI-use record.
Each actionable ticket has one assignee and a different designated reviewer. Shared
work is decomposed into individual subtasks; a roll-up issue does not represent five
independently verified completions. Khoa is the designated reviewer of SCRUM-20.

### 3.2 Risk register
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

Likelihood and impact are qualitative planning estimates. Risk owners must confirm
their rows during review; assignment here does not fabricate their acceptance.

| ID | Risk | Likelihood / impact | Mitigation and response | Proposed owner | Trigger |
|---|---|---|---|---|---|
| R-01 | Member absence or concentrated release workload delays handoffs | Medium / High | Confirm capacity; keep Project Plan with R4 and smoke testing with R3; provide reproducible handoffs and rebalance work through the lead | R5 | A late review or absence threatens a milestone; member flags delay at least 48 hours before a known deadline |
| R-02 | Team unfamiliarity with real-time media/STT | High / High | Use LiveKit Cloud and independent tracks; perform bounded integration spikes before Build 3 and pair frontend, backend and speech owners | R2 | No reproducible two-client connection or attributable transcript at the agreed mid-sprint check |
| R-03 | Too much scope is deferred to Sprints 3–5 | High / High | Split Builds 1 and 2 within Sprint 3; demonstrate each slice; reassess capacity each sprint; defer stretch/Should features before Must requirements | R4 | A mid-sprint checkpoint slips or the final-build critical path exceeds confirmed capacity |
| R-04 | API, spec and status drift causes incompatible implementations | High / High | Use merged G1 as contract; link PRs to Jira/FR criteria; update task mapping and plan together; distinguish source snapshots from live Jira | R4 | Mismatched payloads, due dates or ownership between Jira, code and documents |
| R-05 | Quotas, cost or provider outage interrupt processing | Medium / High | Bound claims/jobs, verify budget/quotas, queue/retry appropriately and keep AI out of the audio path; show partial results | R5 | Quota warning, configured budget breach or sustained provider failure |
| R-06 | Poor STT or ungrounded feedback damages learner trust | High / High | Evaluate target accents; retain speaker links; skip uncertain spans; validate schemas/quotes and sample correctness with human raters | R3 for STT; R4 for coaching (split implementation tasks) | Attribution or accuracy misses target, or feedback blames recognition errors on learners |
| R-07 | Capture without consent or unauthorized access exposes personal data | Medium / High | Server-side dual-consent and ownership checks; no default raw-audio storage; validate retention/deletion and negative paths before learner use | R2 | Any missing-consent capture or cross-user access: stop the affected flow until fixed |
| R-08 | Final documents or PDFs are incomplete despite merged source | High / High | Inspect the submission checklist, attribution, rendered PDFs, minutes, screenshots and archive; build from reviewed sources before upload | R5 | Missing required artifact, unreadable PDF or unverified Moodle cutoff at the packaging checkpoint |

Do not cut consent, authorization, attribution or grounded-feedback controls to recover
schedule. Keep optional rankings/video/advanced panels out; if a Must requirement is at
risk, surface it to the team/TA rather than relabeling a partial feature complete.

### 3.3 PA1 lessons incorporated
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

Lộc's PA1 lessons identify inconsistent PR targets, CI repair after merge preparation,
ownership/status drift, unverifiable Jira keys and excessive release workload. This
plan uses the sprint branch as the integration target, requires review/CI evidence,
uses verified SCRUM keys only, separates observed merges from unverified Jira status,
and distributes planning/testing work. The lessons are supplied source material,
not a claim that a new retrospective meeting has occurred.

## 4. Project Plan
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

### 4.1 Scrum process and communication
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

Use Scrum rather than RUP phases. At Sprint Planning, review course requirements,
capacity, dependencies and acceptance criteria; select one assignee and reviewer per
ticket, estimate and agree due dates in Jira. Hold at least two documented Scrum
check-ins, then Sprint Review and Retrospective. During the implementation sprints,
demonstrate tested vertical slices; the PA2 review inspects documents and evidence.
Unfinished work is explicitly re-planned, not marked Done to improve a chart.

Messenger supports daily coordination and blockers; Google Meet supports meetings;
GitHub PRs record technical reviews; Jira records assignments, dates and progress.
Follow the contract's response expectations: four hours on standard workdays, two
hours for urgent blockers, and twelve hours on weekends unless absence was announced.
Khoa records minutes/screenshots. Existing weekly-report entries dated 20 and 27
October do not independently prove all required meeting types and evidence are present.

### 4.2 Five-sprint schedule
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

The roadmap uses a nominal two-week sprint baseline and a 10–12-week overall target;
the course permits two to three weeks per sprint. Any extension must fit official
course dates and be agreed in Jira. Week labels below are relative roadmap labels,
not invented semester dates. Sprint start/end dates have not been supplied.

| Sprint / PA | Nominal weeks | Goal / planned tasks | Verification milestone |
|---|---|---|---|
| 1 / PA1 | 1–2 | Proposal, survey, contract/process, architecture/testing design, scaffold, CI and local services | Reviewable design and repository baseline; no product build claimed |
| 2 / PA2 | 3–4 | Plan, Vision, G1/database design, Spec Kit/training, AI/weekly reports, PDF/archive and submission | Reviewed document package; no code build required |
| 3 / PA3 | 5–6 | TA-driven plan/Vision revisions, use cases/UI prototypes, Build 1 then Build 2 and narrated demo | First complete functional-group increment; preserve working auth/lobby |
| 4 / PA4 | 7–8 | Revised use cases, C4/deployment design, live audio and STT integration, demo | Build 3; three functional groups demonstrated as required by PA4 |
| 5 / PA5 | 9–10 | Complete analysis/evidence/reporting Must scope, run test/evaluation plan, harden and rehearse, reflective report | Build 4 and 15-minute live final product demo |

The immediately following Sprint 3 already has known Build 1 tickets (section 4.4).
Other later-sprint tasks are planning backlog; detailed assignments and calendar
dates are finalized when those sprints begin, as the PA2 brief permits.

### 4.3 Detailed Sprint 2 tasks and proposed close-out dates
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

**Deadline basis:** on 29 October the user reported "end of this week." Sunday
1 November 2026 is a working interpretation, not a verified Moodle cutoff. Proposed
operational target: ready to submit on Saturday 31 October, with content/review on
Friday 30 October. Confirm the actual day, time and timezone immediately; advance
the targets below if Moodle closes earlier. These proposed dates have not been
written to Jira and must be reconciled before declaring the schedule confirmed.

The supplied SCRUM-20 screenshot confirms Tuấn as assignee, Khoa as reviewer and the
branch/deliverable above. Its Start date and Due date fields are unset; it does not
supply calendar evidence for the other tickets or the official Moodle cutoff.

| Jira / task | One performer | Reviewer | Output / acceptance | Proposed target or observed completion |
|---|---|---|---|---|
| SCRUM-19 — G1 | R4 | R5 | Reviewed data, state, API and token contract in the G1 spec | Merged PR #8 on 27 October; document gate complete, not implementation |
| SCRUM-20 — Project Plan | R4 | R3 | This plan covers every PA2 Part A section; dates/open decisions visible; review changes addressed | Draft 29 October; Khoa review and revisions 30 October |
| SCRUM-21 — Vision | R1 | R4 | Required sections, ten FG paragraphs and Mermaid workflows | Merged PR #6 on 27 October; subsequent open PR #10 is a separate revision |
| SCRUM-22 — Spec Kit and evidence collection | R5 | R2 | Initialized scaffold plus five genuine training entries; constitution acknowledgements tracked | Setup merged PR #7 on 27 October; evidence and acknowledgements target 30 October |
| SCRUM-23 — AI/weekly report | R3 | R1 | Complete AI declarations, required meeting minutes, Jira screenshots and weekly report | PR #9 merged 29 October; inspect/complete submission evidence by 30 October |
| SCRUM-32 — Database design | R2 | R5 | Reviewed database design document linked to the planning baseline | Present in baseline at commit `84aad76`; no runtime database claim |
| SCRUM-33 — Vision PDF | R1 | R5 | PDF generated from accepted Markdown; diagrams, tables, names and links readable | 30 October, after review of the intended source revision |
| SCRUM-34 — Package/release | R5 | R2 | All required Markdown/PDFs, Git log, correct group archive; sprint review; approved `pa2` → `dev` PR | 31 October, after document/evidence checks; exact cutoff pending |
| SCRUM-31 — Moodle submission | R2 | R5 | Upload the approved archive after release merge; retain submission receipt | Proposed 31 October, before the verified official cutoff |

The following are proposed individual subtasks, not invented existing Jira keys.
Create or link real child tickets when authorized; retain the parent's reporting link.

| Parent / individual work | Performer | Proposed reviewer | Proposed due |
|---|---|---|---|
| SCRUM-22 / Triết's own training evidence | R1 | R5 | 30 October |
| SCRUM-22 / Tài's own training evidence | R2 | R5 | 30 October |
| SCRUM-22 / Khoa's own training evidence | R3 | R5 | 30 October |
| SCRUM-22 / Tuấn's own training evidence | R4 | R5 | 30 October |
| SCRUM-22 / Lộc's own training evidence | R5 | R2 | 30 October |
| SCRUM-20 / Markdown-to-PDF and visual check | R4 | R3 | 30 October, after content revisions |
| SCRUM-23 / verify meeting evidence and screenshots | R3 | R1 | 30 October; record gaps, never fabricate missing meetings |

Each training record needs actual date, activity/tutorial and learning evidence; do
not fill the register from a prepared roster. Complete the five-lead constitution
acknowledgements through actual responses. The existing coursework's single-reviewer
rule still applies to each subtask; proposed reviewers must accept before assignment.

### 4.4 Following sprint and later backlog
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

The 27 October Jira mapping moves SCRUM-24–30 to Sprint 3. G1 is merged; their prior
spec dependency is satisfied. Implementation and integration results still need proof.
Relative targets below are proposals for a nominal ten-working-day Sprint 3; calendar
dates and estimates are agreed at Sprint Planning, not silently added to Jira.

| Existing Jira key | Planned work | Performer | Reviewer | Proposed Sprint 3 target |
|---|---|---|---|---|
| SCRUM-24 | Auth, sessions, profile and migrations per G1 | R2 | R5 | Day 4 |
| SCRUM-25 | Frontend design/auth/profile flow against the reviewed contract | R1 | R2 | Day 5; align issue title/scope |
| SCRUM-28 | Pure room transition function, all valid/invalid pairs and API-level negative test | R4 | R2 | Day 4 |
| SCRUM-26 | Room create/join/read APIs, transactional capacity and authorization | R2 | R5 | Day 6 |
| SCRUM-27 | Frontend scaffold/lobby integration with actual APIs | R1 | R5 | Day 7; align issue title/scope |
| SCRUM-29 | Two-browser smoke test, reload/retry and third-person rejection | R3 | R2 | Day 8 |
| SCRUM-30 | Milestone 1 demonstration and sanitized evidence | R5 | Proposed R2; source currently says All | Day 8, before Build 2 completion |

Sprint 3 also needs TA-feedback revisions, complete use-case model/specifications,
UI prototypes and Build 2 plus its video. Split these into real single-assignee tickets
at planning; do not reuse Build 1 IDs or invent new SCRUM numbers. Build 1 should be
verified before the final days, leaving time for Build 2 and integration recovery.

Sprint 4 backlog: use-case revisions; C4 context/container/component and deployment
views; consent-gated LiveKit integration; VAD/STT and independent tracks; reconnection,
privacy and latency checks; narrated demo; reports. Prepare provider contracts and
evaluation data before the final sprint, with incomplete experiments isolated.

Sprint 5 backlog: Language and Argument Coach, bounded claim retrieval/evaluation and
consensus, reports/history and remaining Must admin/data controls; golden-set/human
evaluation; regression, security, load and degraded-service checks; defects, reflective report
and final demo. Reserve the final three working days as a proposed stabilization and
rehearsal buffer. If remaining Must work does not fit, escalate during planning rather
than assuming the team can finish all integration on demo day.

### 4.5 Build plan and verification
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

Four product test builds are planned. PA1's scaffold and PA2's documents are not
counted as working product increments. Timing is relative until official sprint dates
are recorded. A failed gate prevents declaring the build complete.

| Build | Planned availability | What a learner can do | Verification / exit evidence |
|---|---|---|---|
| 1 | Sprint 3, proposed day 8 | Register/login, save CEFR, create/invite/join a two-person room and see READY | G1 acceptance matrix; auth/rotation/logout and concurrency tests; two-browser smoke/demo |
| 2 | Sprint 3 Review | Complete the first end-to-end FG-03 workflow, including topic/room/readiness and supported session controls | Approved use cases and implemented UI→API→database paths; negative lifecycle/consent tests; narrated video; explicit media boundary |
| 3 | Sprint 4 Review, with a mid-sprint media checkpoint | Give dual consent, debate through independent audio tracks, reconnect and view attributed live transcript | Actual two-network audio/STT demo, permission/recovery tests, latency/attribution measurements and video |
| 4 | Sprint 5 before final rehearsal | Debate, review transcript and feedback, open a personalized report and revisit history; use essential admin and data controls | Ten-FG Must checklist, regression/negative tests, performance and cost evidence, evaluation/defect report and final 15-minute live demo |

Use PostgreSQL integration tests for transactional room/session behavior, browser
journeys for UI integration, and labeled transcripts/human review for AI quality.
Document hardware, providers, browser versions and sample sizes. Valid quote matching
alone does not establish feedback correctness. Provider outages must preserve healthy
audio and show incomplete analysis honestly. Preserve isolated speaker attribution,
explicit consent and respectful, actionable correction throughout.

### 4.6 Jira, source control and progress evidence
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

Jira project `SCRUM` is the task system. SCRUM-15/16/17/18 are the Build 1/2/3/4
epics. Existing SCRUM keys are the sole task identifiers; T2.1 and similar names are
legacy labels, not a second issue system. The tables above map work to those keys.
Writing, self-training, reviews, test execution and release work must also be logged.

For each ticket record one assignee, designated reviewer, description/acceptance,
dependencies, sprint, estimate, actual creation/assignment/completion dates, agreed due
date and evidence links. Do not backdate new work, batch-close unfinished issues or
infer implementation from a merged design. Jira issue status and repository PR state
are different observations and should be reconciled together.

The supplied `JIRA_MAPPING.md` is a 27 October export, not live Jira. It records Sprints
1–3, with Sprints 4–5 not yet created; Lộc must confirm current board setup. It also
identifies unlogged setup/drafting/lessons work requiring genuine tickets. The older
TODO statement that Khoa's report is unmerged is superseded by observed PR #9's merge
on 29 October; completeness of meeting/training evidence is a separate check.

Work from the latest sprint branch, e.g. `pa2`, using a task branch such as
`feature/SCRUM-20-project-plan`. PRs target the sprint branch, not `dev`/`main`; obtain
the designated review and required CI before merge. Lộc coordinates the final sprint
PR into `dev`, reviewed by Tài. No direct commits to integration/release branches.

### 4.7 PA2 review, packaging and submission gates
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

1. Khoa checks this plan against Part A; the responsible reviewer checks each other
   document. Record performed/reviewed/edited attribution truthfully after headings.
2. Confirm scope, risk responsibilities, exact Moodle cutoff and task due dates against
   Jira. Update the related plan/mapping records through the normal reviewed workflow.
3. Verify the required meeting evidence, Jira screenshots, per-member training and AI
   declarations. The report being merged is not proof these artifacts are complete.
4. Use the existing `report/pdf/` pipeline and latexmk to produce PDFs from accepted
   Markdown; inspect tables, diagrams, Vietnamese names and links. Keep secrets and
   tool/build intermediates out of the submission and version control.
5. Lộc exports genuine Git history and packages `PA2-Group[GroupId].zip`, confirming
   the Group ID rather than assuming a template name. Tài reviews the release.
6. After Sprint Review and the approved `pa2`→`dev` merge, Tài submits to Moodle and
   retains the receipt; Lộc verifies the uploaded archive before the actual cutoff.

This plan is not final until its designated review and the missing scheduling
information are resolved. PA3 records TA feedback and changes to both plan and Vision,
with an honest explanation of schedule/scope changes and observed build results.

### 4.8 Decisions still requiring confirmation
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

| Item | Required confirmation | Responsible follow-up |
|---|---|---|
| D1 — Calendar | Exact PA2 Moodle date/time/timezone, sprint start/end dates and approved task due dates | Lộc supplies Jira/course dates; Tuấn updates this draft |
| D2 — Draft review | Khoa's review, risk-owner acceptance and the proposed close-out/subtask dates | Khoa, Tuấn and relevant members |
| D3 — Build 2 boundary | Reconcile complete FG-03/session-start acceptance with Build 3 media availability; do not enable unsupported capture | Tài, Triết and Lộc at Sprint 3 planning |
| D4 — Evidence / source drift | Training/constitution acknowledgements, required meeting artifacts and Jira screenshots; reconcile stale report statuses | Lộc and Khoa |
| D5 — Delivery details | Official Group ID, school upload receipt, numerical provider budget and pilot/rater availability | Release owner and relevant subsystem owners |
| D6 — Database contract alignment | The separate database design uses `full_name`, `target_cefr` and `refresh_tokens`, while G1 describes `display_name`/`cefr_level`, a profile table and `auth_refresh_tokens` with family rotation. Agree an explicit mapping or reviewed amendment before migrations; the two documents being merged does not make their schemas identical | Tài, Tuấn and Lộc before SCRUM-24 implementation acceptance |

Current AGENTS.md and ROADMAP.md both place Build 1 in Sprint 3 and audio in Sprint 4;
the earlier PA2-audio scheduling conflict is resolved in this source baseline. The
testing guide explicitly labels its four-sprint timetable legacy. Retain its useful
acceptance criteria, not those old sprint labels or machine-specific setup examples.

## 5. References and evidence baseline
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

Repository sources below are pinned to the inspected `pa2` revision, because the user's
original local checkout is older. Paths named elsewhere describe their intended
repository locations. Open/unmerged PRs #10 and #11 are not treated as delivered scope.

| Ref. | Source | Use |
|---|---|---|
| S1 | [Original PA2-2026 brief](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/assignments/PA2-2026.pdf), Part A and submission rules | Required sections, Scrum/tasks/dates/build plan and initial-draft status |
| S2 | [AGENTS.md](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/AGENTS.md) | Official identities, engineering/human-impact constraints and current increment schedule |
| S3 | [PA2 TODO](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/TODO.md) and [CHECKLIST](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/CHECKLIST.md) | Current PA2 owners and submission gates |
| S4 | [Jira mapping, 27 October](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/JIRA_MAPPING.md) | Verified exported keys/assignees, Build 1 move to Sprint 3 and recorded board gaps |
| S5 | [Roadmap](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/ROADMAP.md) and [task breakdown](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/management/SPRINT_TASKS.md) | Five-sprint/build baseline and reviewers |
| S6 | [Proposal](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/requirements/PROJECT_PROPOSAL.md) and [Vision](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/requirements/VISION_DOCUMENT.md) | Product value, ten FGs, boundaries and measurable targets |
| S7 | [Architecture](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md) and [G1](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/G1_SPEC_BUILD1.md) | Integration contracts, privacy and acceptance obligations |
| S8 | [Team contract](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/management/TEAM_CONTRACT.md) and [development process](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/management/DEV_TOOLS_AND_PROCESS.md) | Collaboration, branching, review and task logging |
| S9 | [Testing plan](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/testing/TESTING_PLAN.md) and [PA1 lessons](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/PA1_LESSONS.md) | Verification, risks and process improvements; legacy sprint labels excluded |
| S10 | [Training evidence](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/SPECKIT_TRAINING.md), [weekly report](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/WEEKLY_REPORT.md) and [AI log](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/docs/pa2/AI_USAGE_LOG.md) | Existing evidence and outstanding completeness checks |
| S11 | [PR #8](https://github.com/nguyendinhthienloc/DebateSpeak/pull/8), [#6](https://github.com/nguyendinhthienloc/DebateSpeak/pull/6), [#7](https://github.com/nguyendinhthienloc/DebateSpeak/pull/7), [#9](https://github.com/nguyendinhthienloc/DebateSpeak/pull/9) | Observed merged G1, Vision, Spec Kit and report sources; not live Jira completion evidence |
| S12 | [PDF build guide](https://github.com/nguyendinhthienloc/DebateSpeak/blob/dd4851e592e499823c65d71589a7afaad9d39bef/report/pdf/README.md) | Required Markdown-to-PDF / latexmk packaging workflow |

The audit also inspected the repository tree, application entry point, frontend
scaffold, dependency manifests, CI and database design. Existing health/scaffold
files do not prove the planned product journeys pass. No application tests or provider
benchmarks were run while drafting this document.

## 6. AI assistance declaration
Performed: Tuấn (24125107), with Codex assistance. Reviewed: Khoa (24125058), pending. Edited: Codex.

On 29 October 2026 the user requested a project-wide review and an initial Project
Plan. Codex read the original assignment, the current remote repository sources and
public PR states, synthesized this English draft and proposed dates based on the
user's end-of-week deadline statement. The exact Moodle cutoff and live Jira dates
were not supplied; neither were invented. Proposed roles/subtasks/risks are not
fabricated sign-offs. No commit, push, PR, review, merge or Jira update was performed
for this writing task. Tuấn retains responsibility for verification and Khoa's review.
