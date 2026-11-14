# PA3 Required Documents Checklist

Shared checklist for every member. Each owner ticks their own items and links the evidence. Status is as of 2026-11-14, from the repo on `pa3`. Work is only done when it is merged and verified (see Sprint Review).

Deadline was Fri 2026-11-13. Submission buffer 11-14 to 11-15.

## Part A: Revised Project Plan and Changes.md (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| A1 | Revised Project Plan (Markdown) | Tài | Lộc | **Not revised**: still the v0.1 PA2 draft header and PA2 Performed/Reviewed lines. Only PA3 schedule rows exist | `docs/requirements/PROJECT_PLAN.md` |
| A2 | Revised Project Plan (PDF) | Tài | Lộc | PDF exists but is built from the v0.1 draft; rebuild after A1 | `docs/requirements/PROJECT_PLAN.pdf` |
| A3 | `Changes.md` covers every revised document | Tài | Lộc | Partial: plan rows 1.x filled, but the plan itself is not revised; vision rows 2.2–2.3 filled on `feature/SCRUM-35-vision-final` | `docs/pa3/Changes.md` |
| A4 | Changes from TA feedback on PA2 | Tài | Lộc | None received as of 2026-11-10 | `docs/pa3/Changes.md` row 1.7 |

## Part B: Vision Document (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| B1 | Vision Document revised (requirements, competitors, environments) | Khoa | Lộc | Revised to 0.2 (PR #27). Final touches on `feature/SCRUM-35-vision-final`: reviewer line and status fixed. Reviewer sign-off pending | `docs/requirements/VISION_DOCUMENT.md` |
| B2 | Vision Document (PDF) | Khoa | Lộc | **Not rebuilt**: `report/pdf/build.py` needs the Mermaid CLI, missing on this machine. PDF is from PR #27 | `docs/requirements/VISION_DOCUMENT.pdf` |

## Part C: Use-Case Model (10 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| C1 | Use-case model with Mermaid diagrams, 54 use cases | Tuấn | pending | Done | `docs/pa3/USE_CASE_MODEL.md`, `.pdf` |
| C2 | Reviewer sign-off | Tuấn | pending | Pending | — |

## Part D: Use-Case Specifications and Prototypes (45 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| D1 | 54 specifications, 201 alternative outcomes | Triết, Tuấn | pending | Done | `docs/pa3/USE_CASE_SPECIFICATIONS.md`, `.pdf` |
| D2 | Prototype screenshots (116) | Triết | pending | Done | `docs/pa3/prototypes/screenshots/` |
| D3 | Reviewer sign-off and spot check | Triết, Tuấn | pending | Pending | — |

## Part E: FG-03 End to End with Spec Kit (20 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| E1 | FG-03 implemented (frontend, backend, database) | Tài, Triết | Lộc | **Not met**: no auth or room API, no migrations, no integrated UI on `pa3` | SCRUM-38 (To Do) |
| E2 | Spec Kit artifacts (`specs/`, plans, tasks) | all | Lộc | **Missing** | none |
| E3 | Narrated FG-03 demo on YouTube, link added | Lộc | Khoa | **Missing** (SCRUM-39) | none |
| E4 | E2E test for FG-03 | Khoa | Lộc | **Missing** | none |
| E5 | UI refinement, lobby (SCRUM-52) | Lộc | Triết | In review: PR #28 open, browser tests not run | PR #28 |

## Part F: AI Usage and Weekly Report (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| F1 | AI usage log with every member's PA3 use | Khoa | Lộc | Partial: most members missing | `docs/pa3/AI_USAGE_LOG.md` |
| F2 | Weekly report with no placeholders | Khoa | Lộc | Partial: "[Confirm actual status]" left in | `docs/pa3/WEEKLY_REPORT.md` |
| F3 | Meeting notes (planning and review), PDF | Khoa | Lộc | Markdown done, PDF missing | `docs/pa3/MEETINGS/` |
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
| S1 | `PA3-Group[GroupId]/` folder with all docs as `.md` and `.pdf` | Lộc | Missing (local `PA3-Group2/` is partial and git-excluded) |
| S2 | Git log export | Lộc | Missing |
| S3 | Source code, no `node_modules`, build output, or `.env` | Lộc | Code incomplete |
| S4 | `.zip` of the package | Lộc | Missing |
| S5 | `pa3` → `dev` merge once the package is complete | Lộc | Pending |
