# PA3 Required Documents Checklist

Shared checklist for every member. Each owner ticks their own items and links the evidence. Status is as of 2026-11-14, from the repo on `pa3`. Work is only done when it is merged and verified (see Sprint Review).

Deadline was Fri 2026-11-13. Submission buffer 11-14 to 11-15.

## Part A: Revised Project Plan and Changes.md (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| A1 | Revised Project Plan (Markdown) | Tuấn | Lộc | Done: version 0.2 merged (PR #31, refreshed PR #49). Reviewed by Lộc, 2026-11-14 | `docs/requirements/PROJECT_PLAN.md` |
| A2 | Revised Project Plan (PDF) | Tuấn | Lộc | Done: rebuilt from 0.2 on 2026-11-14 | `docs/requirements/PROJECT_PLAN.pdf` |
| A3 | `Changes.md` covers every revised document | Tuấn | Lộc | Done for plan and vision (rows 1.1 to 1.11, 2.1 to 2.5). Reviewed by Lộc, 2026-11-14 | `docs/pa3/Changes.md` |
| A4 | Changes from TA feedback on PA2 | Tuấn | Lộc | None received as of 2026-11-10 | `docs/pa3/Changes.md` row 1.7 |

## Part B: Vision Document (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| B1 | Vision Document revised (requirements, competitors, environments) | Khoa | Lộc | Done: version 0.2 merged (PR #27, final touches PR #30). Reviewed by Lộc, 2026-11-14 | `docs/requirements/VISION_DOCUMENT.md` |
| B2 | Vision Document (PDF) | Khoa | Lộc | Done: rebuilt from 0.2 on 2026-11-14 with Mermaid diagrams | `docs/requirements/VISION_DOCUMENT.pdf` |

## Part C: Use-Case Model (10 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| C1 | Use-case model with Mermaid diagrams, 54 use cases | Tuấn | Tài | Done. Reviewed by Tài, 2026-11-14 | `docs/pa3/USE_CASE_MODEL.md`, `.pdf` |
| C2 | Reviewer sign-off on the use-case model | Tuấn | Tài | Done: reviewed by Tài, 2026-11-14 | `docs/pa3/USE_CASE_MODEL.md` |

## Part D: Use-Case Specifications and Prototypes (45 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| D1 | 54 specifications, 201 alternative outcomes | Triết, Tuấn | Triết | Done | `docs/pa3/USE_CASE_SPECIFICATIONS.md`, `.pdf` |
| D2 | Prototype screenshots (116) | Triết | Triết | Done | `docs/pa3/screenshots/` |
| D3 | Reviewer sign-off on specifications and prototypes | Triết, Tuấn | Triết | Done: reviewed by Triết, 2026-11-14. Lộc's assigned review of the specifications is still pending | `docs/pa3/USE_CASE_SPECIFICATIONS.md`, `docs/pa3/screenshots/` |

## Part E: FG-01 End to End with Spec Kit (20 pts)

Part E changed from FG-03 to FG-01 on 2026-11-14: FG-03 has no room API, while FG-01 has a frontend (`web/`) and a Spring Boot + PostgreSQL backend (`backend-tai`). See `docs/pa3/Changes.md` row 1.12.

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| E1 | FG-01 implemented end to end (frontend, backend, database) | Tài, Triết | Lộc | Done: frontend merged; backend (16 endpoints, 4 tables, commit `3f5e8f1` on `backend-tai`) verified end to end on 2026-11-14 (JDK 17, PostgreSQL 16, real browser). Recovery emails not run. Secrets now come from environment variables; Tài must still revoke the old Gmail app password | `web/`, `api/authify/`, `specs/002-fg01-accounts/quickstart.md` |
| E2 | Spec Kit artifacts for FG-01 (`specs/`, plans, tasks) | Tài, Triết | Lộc | Written: frontend `001`, backend and database `002` (spec, plan, tasks, quickstart) | `specs/001-frontend-baseline/`, `specs/002-fg01-accounts/` |
| E3 | Narrated demo video on YouTube (unlisted or public), link added, showing FG-01 | Tài | Lộc | Done: FG-01 demo video `https://youtu.be/6K9P5xVkhNo`, link provided by Triết on 2026-11-14; replaces the earlier `https://youtu.be/wJxqi3J0phE` | `https://youtu.be/6K9P5xVkhNo` |
| E4 | E2E test for FG-01 | Khoa | Lộc | Mocked browser tests pass (96); real-API run passes: 29/30 API checks and 8/8 browser steps (`specs/002-fg01-accounts/tasks.md`, verification record) | `web/tests/` |
| E5 | UI refinement, lobby (SCRUM-52) | Lộc | Triết | Merged (PR #28). Browser tests not run on the build machine; cross-browser not done | PR #28 |

## Part F: AI Usage and Weekly Report (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| F1 | AI usage log with every member's PA3 use | Khoa | Lộc | Done: tools and categories recorded for each member (PR #40, #41) | `docs/pa3/AI_USAGE_LOG.md` |
| F2 | Weekly report with no placeholders | Khoa | Lộc | Done: placeholders replaced with verified repository status (PR #59) | `docs/pa3/WEEKLY_REPORT.md` |
| F3 | Meeting notes (planning and review), PDF | Khoa | Lộc | Markdown and PDF present; Scrum meeting notes still missing | `docs/pa3/MEETINGS/` |
| F4 | Jira screenshots | Lộc | Khoa | Done | `docs/pa3/jira-1.png`, `docs/pa3/jira-2.png` |

## Per-member Spec Kit entries (TA feedback on PA2)

Every member needs their own Spec Kit entry, even a short one.

| Member | Spec Kit entry | Status |
|---|---|---|
| Lộc | — | Missing |
| Triết | — | Missing |
| Tài | — | Missing |
| Khoa | — | Missing |
| Tuấn | — | Missing |

## Submission package

| # | Item | Owner | Status |
|---|---|---|---|
| S1 | `PA3-Group02/` folder with all docs as `.md` and `.pdf` | Lộc | Done: every Markdown file has a current PDF; the code slot is `04-fg03-implementation/source/` | `PA3-Group02/` |
| S2 | Git log export | Lộc | Done: `PA3-Group02/GIT_LOG.txt` re-exported 2026-11-14, with author emails removed | `PA3-Group02/GIT_LOG.txt` |
| S3 | Source code, no `node_modules`, build output, or `.env` | Lộc | Done: runnable FG-01 source in `docs/pa3/prototypes/` (web, API, database compose, `.env.example`, run guide); builds and passes 96 tests from that folder | `docs/pa3/prototypes/README.md` |
| S4 | `.zip` of the package | Lộc | Ready to rebuild once the FG-03 code is in | `D:\DebateSpeak\PA3-Group02.zip` |
| S5 | `pa3` → `dev` merge once the package is complete | Lộc | Pending |
