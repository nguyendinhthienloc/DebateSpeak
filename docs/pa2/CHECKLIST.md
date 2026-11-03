# PA2 Checklist

Updated 2026-10-31.

Scope: **PA2-2026 only**, which grades documents (A Project Plan 15, B Vision Document 20, C Spec Kit 5, D AI usage and weekly report 5). Owners are in [TODO.md](TODO.md). A merged PR counts as reviewed.

## G1 — Spec (done, merged)
- [x] G1 spec merged and reviewed (PR #8, `G1_SPEC_BUILD1.md`)

## A — Project Plan (Tuấn, reviewer Khoa) — `docs/pa2/PROJECT_PLAN.md`
- [x] Merged and reviewed (PR #12): Introduction, Overview, Organization (team roles and 5 risks with mitigation), Project Plan, references and AI declaration
- [ ] Check that the schedule and task list match Jira (SCRUM keys, Sprint 2 documents only, Build 1 in Sprint 3)
- [ ] PDF built and committed (`PROJECT_PLAN.pdf`)

## B — Vision Document (Triết, reviewer Tuấn) — `docs/requirements/VISION_DOCUMENT.md`
- [x] All required sections, ten feature paragraphs and two Mermaid diagrams, merged and reviewed (PR #6)
- [x] PDF built and committed (SCRUM-33, PR #10)

## C — Spec Kit (SCRUM-22: every member has a task; Lộc collects, reviewer Tài)
- [x] `src/constitution.md` and `.specify/` merged and reviewed (PR #7)
- [ ] Training entry (SCRUM-22) from each member in `SPECKIT_TRAINING.md`. Done: Lộc, Triết. Open: Tài, Khoa, Tuấn
- [ ] Constitution 1.0.1 acknowledged by all five leads

## D — AI usage and weekly report (Khoa, reviewer Triết)
- [x] `AI_USAGE_LOG.md` merged to `pa2` (PR #9, 3 rows, each with a "what a human changed" note)
- [x] Sprint Planning and Sprint Review minutes merged (`docs/pa2/MEETINGS/`, .md and .pdf)
- [ ] Two standups: no separate minutes (the two weekly entries in `WEEKLY_REPORT.md` cover 20/10 and 27/10)
- [ ] Jira screenshots (`docs/pa2/screenshots/`)
- [x] `WEEKLY_REPORT.md` merged to `pa2` (PR #9)
- [x] Weekly report PDF built (`WEEKLY_REPORT.pdf`)

## Backend database design (Tài, SCRUM-32)
- [x] `api/app/core/database_document.md` merged and reviewed (commit `84aad76`)

## Submission (Lộc, last)
- [ ] All documents merged to `pa2`, each with Markdown and PDF. PDFs present: Vision Document, weekly report, Sprint Planning, Sprint Review. Missing: Project Plan, AI usage log, Spec Kit training
- [ ] Git log exported (SCRUM-34)
- [ ] Zip `PA2-Group[GroupId]` (SCRUM-34) (confirm the Group ID; the Vision Document says Group 02)
- [ ] No `.env` files, secrets or absolute paths in the repo
- [ ] `pa2` → `dev` PR after Sprint Review (Lộc, SCRUM-34)
- [ ] Tài submits the zip to the school's Moodle after the merge to `dev` (SCRUM-31)
