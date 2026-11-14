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
| D2 | Prototype screenshots (116) | Triết | Triết | Done | `docs/pa3/prototypes/screenshots/` |
| D3 | Reviewer sign-off on specifications and prototypes | Triết, Tuấn | Triết | Done: reviewed by Triết, 2026-11-14. Lộc's assigned review of the specifications is still pending | `docs/pa3/USE_CASE_SPECIFICATIONS.md`, `docs/pa3/prototypes/README.md` |

## Part E: FG-03 End to End with Spec Kit (20 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| E1 | FG-03 implemented end to end (frontend, backend, database) | Tài, Triết | Lộc | **Open, code only**: Tài and Triết are writing the code today, to go in `04-fg03-implementation/source/` | — |
| E2 | Spec Kit artifacts for FG-03 (`specs/`, plans, tasks) | Tài, Triết | Lộc | **Open, code only**: Tài and Triết produce these with the code. Spec Kit baseline `specs/001-frontend-baseline/` is merged | `specs/001-frontend-baseline/` |
| E3 | Narrated demo video on YouTube (unlisted or public), link added, showing the Part E group | Tài | Lộc | Uploaded: `https://youtu.be/wJxqi3J0phE`. **Must be checked**: the video must show the Part E group. Team has not confirmed its content | `https://youtu.be/wJxqi3J0phE` |
| E4 | E2E test for FG-03 | Khoa | Lộc | **Open, code only**: depends on the FG-03 build | — |
| E5 | UI refinement, lobby (SCRUM-52) | Lộc | Triết | Merged (PR #28). Browser tests not run on the build machine; cross-browser not done | PR #28 |

## Part F: AI Usage and Weekly Report (5 pts)

| # | Item | Owner | Reviewer | Status | Evidence |
|---|---|---|---|---|---|
| F1 | AI usage log with every member's PA3 use | Khoa | Lộc | Done: tools and categories recorded for each member (PR #40, #41) | `docs/pa3/AI_USAGE_LOG.md` |
| F2 | Weekly report with no placeholders | Khoa | Lộc | Done: placeholders replaced with verified repository status (PR #59) | `docs/pa3/WEEKLY_REPORT.md` |
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
| S1 | `PA3-Group02/` folder with all docs as `.md` and `.pdf` | Lộc | Done: every Markdown file has a current PDF; the code slot is `04-fg03-implementation/source/` | `PA3-Group02/` |
| S2 | Git log export | Lộc | Done: `PA3-Group02/GIT_LOG.txt` re-exported 2026-11-14, with author emails removed | `PA3-Group02/GIT_LOG.txt` |
| S3 | Source code, no `node_modules`, build output, or `.env` | Lộc | **Open, code only**: FG-03 source from Tài and Triết; web app builds on `pa3` | — |
| S4 | `.zip` of the package | Lộc | Ready to rebuild once the FG-03 code is in | `D:\DebateSpeak\PA3-Group02.zip` |
| S5 | `pa3` → `dev` merge once the package is complete | Lộc | Pending |
