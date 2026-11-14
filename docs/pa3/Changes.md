# Changes.md — PA3 (compared with PA2)

One file for PA3, one section per revised document. Each row: what changed, why, where.
Status: **filled** = written, **TA** = needs the PA2 TA feedback items added, **open** = not yet written, **none received** = no TA feedback was given to the group.

## 1. Project Plan (`docs/requirements/PROJECT_PLAN.md`)
Owner: Tuấn (reassigned from Tài, 2026-11-14). Reviewer: Lộc.

| # | Change | Why | Status |
|---|---|---|---|
| 1.1 | Build 1 moved from Sprint 2 to Sprint 3 and shrunk to what FG-03 needs (table below) | PA2 had no code increment; PA3 grades one FG end to end | filled |
| 1.2 | Spec Kit lives at the repo root, not `/src`; the duplicate in `src/` was deleted (identical constitution kept at `.specify/memory/constitution.md`) | PA3 to PA5 do not require `/src`; one copy avoids drift | filled |
| 1.3 | Sprint 3 schedule: deadline Fri 2026-11-13, submission buffer 11-14 to 11-15 | Updated with real dates | filled |
| 1.4 | Database first (11-04): migrations + seed give 5 users, 10 topics, 1 room | Every member can run the same data from day one | filled |
| 1.5 | Extra preparation items (stretch): FG-02 topic API, LiveKit token spike, `STTAdapter`, `LLMAdapter` + grounding guard, mic screen, CI migrate/seed | Reduce risk for Builds 3 and 4; cut first if FG-03 slips | filled |
| 1.6 | Branch and PR rules: `feature/SCRUM-<nn>-<name>`, PR into `pa3`, `pa3` → `dev` once per sprint | Keeps `dev` releasable | filled |
| 1.7 | Changes from TA feedback on PA2 | No TA feedback on PA2 was received by the group as of 2026-11-10 | none received |
| 1.8 | Plan revised to version 0.2 for PA3: header and status, owner reassigned to Tuấn, PA3 content (sections 1–7), rows for FG-03 status and reviewer sign-offs | Part A requires a revised plan traced in Changes.md | filled (reviewer sign-off pending) |
| 1.9 | Backend stack changed from FastAPI (Python) to Java (Spring Boot) in `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md` | Decision by Tài, 2026-11-14; pending team confirmation. AGENTS.md Section 4 not yet updated | filled (team confirmation pending) |

**Build 1, shrunk**

| Kept | Cut |
|---|---|
| Migrations + seed with mock data | Refresh-token rotation |
| Register / login (Argon2id, access JWT) | Profile editing, CEFR screens |
| Create room, join by invite code, `LOBBY` → `READY`, 409 on third user | `LIVE` / `ENDED` beyond FG-03 start |
| Lobby UI | Separate M1 demo and smoke test (folded into the FG-03 video and E2E) |

Build 1 Jira: SCRUM-24 auth, 25 frontend, 26 room API, 27 lobby UI, 28 state machine (SCRUM-29, 30 folded into FG-03). New: SCRUM-41 DB + seed, SCRUM-42 Docker DB.

## 2. Vision Document (`docs/requirements/VISION_DOCUMENT.md`)
Owner: Khoa. Reviewer: Lộc.

| # | Change | Why | Status |
|---|---|---|---|
| 2.1 | Links fixed after the repo cleanup | Files moved (section 3) | filled |
| 2.2 | Functional requirements (FG-01 to FG-10, FR ids cited, spot-checked against the architecture spec) and non-functional targets (NFR-01 to NFR-15) detailed | Brief, Part B | filled |
| 2.3 | Alternatives and user environment written (§3 and §4 of the Vision Document); no new market audit | Brief, Part B | filled |
| 2.4 | Changes from TA feedback on PA2 | No TA feedback on PA2 was received by the group as of 2026-11-10 | none received |
| 2.5 | Document control updated for the PA3 revision; clarified that the full product vision is broader than the current PA3 implementation, which focuses on FG-03, with registration/login supporting the room workflow and topic listing/filtering as extra scope | Make the revision status and current sprint boundary explicit; avoid implying that later product capabilities are implemented in PA3 | filled |

## 3. Repository layout (supporting change)
Deleted: finished PA2 files, duplicate Spec Kit in `src/`, `git_log.txt`, `report_build/`, PA1/PA2 briefs. Everything remains in Git history at `f789f5c`. Recover a file: `git show f789f5c:docs/pa2/<file>`.

| PA2 file | Now |
|---|---|
| `PROJECT_PLAN.md` | Moved to `docs/requirements/` (Tuấn revises it) |
| `G1_SPEC_BUILD1.md` | Moved to `docs/architecture/` |
| `TODO.md`, `CHECKLIST.md` | Replaced by the per-member `TODO.md` files |
| `JIRA_MAPPING.md` | Replaced by `docs/management/SPRINT_TASKS.md` |
| `WEEKLY_REPORT`, `AI_USAGE_LOG`, `MEETINGS/` | Deleted; PA3 versions go in `docs/pa3/` (SCRUM-40), PA2 layout is the template |
| `SPECKIT_TRAINING`, `speckit-training-Triet`, `PA1_LESSONS`, `drafts/` | Deleted |

Open: review `docs/design/initial/figma-state.json` and `docs/reference/ORIGINAL_PROMPT_REFERENCE.md` (kept for now).

## 4. Tuấn's local PA3 ticket deliverables (2026-11-09)
Performed: Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: assigned ticket reviewers, pending. Edited: Trần Lê Anh Tuấn (24125107).

| Ticket / artifact | Change | Reason / boundary |
|---|---|---|
| SCRUM-28; architecture and proposal contracts | Five-state pure transition graph, immutable lifecycle guards and unit tests | Share deterministic room rules with SCRUM-26/38; Build 1 LIVE stays disabled |
| SCRUM-36; `USE_CASE_MODEL.md`, `use_cases.json` | 54 use cases, 11 Mermaid diagrams, FR-01–60 mapping | Complete Part C design coverage while distinguishing future/optional implementation |
| SCRUM-37; `USE_CASE_SPECIFICATIONS.md`, prototype states and screenshots | All 54 basic flows plus 201 alternative/exception outcomes, local interactive prototype | Part D requires coherent UI evidence for both basic and alternative flows |
| SCRUM-47; adapter and grounding modules/tests | Async provider protocol, strict result contract, exact speaker/segment/debate quote guard | Bounded preparation, no paid provider calls or future pipeline implementation |
| PDF pipeline | Add source-relative resource lookup | Embed prototype screenshots through the existing Pandoc/latexmk build |
| `.gitignore` | Broaden secret pattern to `.env*`, retain `.env.example` exception | Protect every dotenv filename without excluding the placeholder template |
| `.env.example` | Empty optional browser-tooling placeholders | Keep local document tooling portable without hardcoding browser paths |

Review, Git publication and Jira completion are not claimed. This section does not replace the open rows in section 2.
