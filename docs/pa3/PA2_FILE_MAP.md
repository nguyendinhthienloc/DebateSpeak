# Where the PA2 files went

`docs/pa2/` was removed in `feature/cleanup-repo`. Every file is still in Git history at commit `f789f5c` (`dev`, after the `pa2` merge).

Recover one file: `git show f789f5c:docs/pa2/<file>`. Restore a whole copy: `git checkout f789f5c -- docs/pa2/<file>`.

| PA2 file | Now | Why |
|---|---|---|
| `PROJECT_PLAN.md` | **Moved** to `docs/requirements/PROJECT_PLAN.md` | Live document. Tài revises it in PA3 Part A. |
| `G1_SPEC_BUILD1.md` | **Moved** to `docs/architecture/G1_SPEC_BUILD1.md` | Build 1 API and token contract, still the spec for Build 1. |
| `TODO.md`, `CHECKLIST.md` | Replaced by `docs/pa3/<member>/TODO.md` | PA2-only task lists. |
| `JIRA_MAPPING.md` | Replaced by `docs/management/SPRINT_TASKS.md` | Same mapping, kept in one place. |
| `WEEKLY_REPORT.md` (+ PDF), `AI_USAGE_LOG.md` | Deleted. PA3 versions go in `docs/pa3/` (SCRUM-40) | Sprint-specific. Reuse the PA2 layout as the template. |
| `MEETINGS/` (Planning, Review, + PDFs) | Deleted. PA3 minutes go in `docs/pa3/MEETINGS/` | Sprint-specific. |
| `SPECKIT_TRAINING.md`, `speckit-training-Triet.md` | Deleted | PA2 evidence, already submitted. |
| `PA1_LESSONS.md` | Deleted | Folded into the plan; history keeps the original. |
| `drafts/loc.md` | Deleted | Draft, superseded. |

Other removals in the same change: `src/` (duplicate Spec Kit, identical constitution at `.specify/memory/constitution.md`), `git_log.txt`, `report_build/`, and the PA1/PA2 briefs in `docs/assignments/`.
