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
| C1 | Use-case model with Mermaid diagrams, 54 use cases | Tuấn | pending | Done | `docs/pa3/USE_CASE_MODEL.md`, `.pdf` |
| C2 | Reviewer sign-off on the use-case model | Tuấn | Tài | Reviewed by Tài, 2026-11-14 | `docs/pa3/USE_CASE_MODEL.md` |

## Part D: Use-Case Specifications and Prototypes (45 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| D1 | 54 specifications, 201 alternative outcomes | Triết, Tuấn | pending | Done | `docs/pa3/USE_CASE_SPECIFICATIONS.md`, `.pdf` |
| D2 | Prototype screenshots (116) | Triết | pending | Done | `docs/pa3/prototypes/screenshots/` |
| D3 | Reviewer sign-off on specifications and prototypes | Triết, Tuấn | Triết | Reviewed by Triết, 2026-11-14 (Tuấn's own review of his work is not applicable; Lộc's assigned review still pending) | `docs/pa3/USE_CASE_SPECIFICATIONS.md`, `docs/pa3/prototypes/README.md` |

## Part E: FG-03 End to End with Spec Kit (20 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| E1 | FG-03 implemented end to end (frontend, backend, database). Code is in progress by Tài and Triết | Tài, Triết | Lộc | **Partial, not verified**: register and login pages on `pa3` (Triết, PR #39/#45); Java auth code on `pa3` (Tài, PR #53) with no build file; no database migrations or verified persistence (`api/alembic/` absent); no FG-01 end-to-end test | `web/src/auth/`, `api/app/auth/` |
| E2 | Spec Kit artifacts for FG-03 (`specs/`, plans, tasks) | Tài, Triết | Lộc | **Partial**: `specs/001-frontend-baseline/` is merged (PR #45). No FG-01 backend spec. Draft FG-03 spec on PR #56 is no longer the graded group | `specs/001-frontend-baseline/` |
| E3 | Narrated demo video on YouTube (unlisted or public), link added, showing the Part E group | Tài | Lộc | Uploaded: `https://youtu.be/wJxqi3J0phE`. **Must be checked**: the video must show the Part E group. Team has not confirmed its content | `https://youtu.be/wJxqi3J0phE` |
| E4 | E2E test for FG-03 | Khoa | Lộc | **Missing**: no FG-01 end-to-end test. Browser tests not run on the build machine | none |
| E5 | UI refinement, lobby (SCRUM-52) | Lộc | Triết | Merged (PR #28). Browser tests not run on the build machine; cross-browser not done | PR #28 |

## Part F: AI Usage and Weekly Report (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| F1 | AI usage log with every member's PA3 use | Khoa | Lộc | Done: tools and categories recorded for each member (PR #40, #41) | `docs/pa3/AI_USAGE_LOG.md` |
| F2 | Weekly report with no placeholders | Khoa | Lộc | Partial: placeholders "[Confirm actual status.]" remain in the weekly report | `docs/pa3/WEEKLY_REPORT.md` |
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
| S2 | Git log export | Lộc | Partial: `PA3-Group2/GIT_LOG.txt` exists from before the latest merges; re-export at packaging | `PA3-Group2/GIT_LOG.txt` |
| S3 | Source code, no `node_modules`, build output, or `.env` | Lộc | Partial: web app builds on `pa3`; no FG-03 backend beyond the unverified Java auth code merged in PR #53 |
| S4 | `.zip` of the package | Lộc | Missing |
| S5 | `pa3` → `dev` merge once the package is complete | Lộc | Pending |
