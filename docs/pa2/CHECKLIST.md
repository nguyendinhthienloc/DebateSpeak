# PA2 Checklist

Scope: **PA2-2026 only**, which grades documents (A Project Plan 15, B Vision Document 20, C Spec Kit 5, D AI usage and weekly report 5). Owners are in [TODO.md](TODO.md). A merged PR counts as reviewed.

## G1 — Spec (done, merged)
- [x] G1 spec merged and reviewed (PR #8, `G1_SPEC_BUILD1.md`)

## A — Project Plan (Tuấn, reviewer Khoa) — `docs/pa2/PROJECT_PLAN.md`
- [ ] Introduction
- [ ] Overview: goals (measurable), scope, deliverables, assumptions
- [ ] Organisation: team roles and IDs (from `AGENTS.md` §3), at least 3 risks with mitigation
- [ ] Plan: 5 sprints (one per PA), detailed tasks for Sprint 2 only, schedule matching Jira, build plan
- [ ] Jira IDs mapped to tasks (see `JIRA_MAPPING.md`)
- [ ] Attribution line under each section; Khoa reviews; PDF built

## B — Vision Document (Triết, reviewer Tuấn) — `docs/requirements/VISION_DOCUMENT.md`
- [x] All required sections, ten feature paragraphs and two Mermaid diagrams, merged and reviewed (PR #6)
- [ ] PDF built and committed

## C — Spec Kit (SCRUM-22: every member has a task; Lộc collects, reviewer Tài)
- [x] `src/constitution.md` and `.specify/` merged and reviewed (PR #7)
- [ ] Training entry (SCRUM-22) from each member in `SPECKIT_TRAINING.md`: Lộc, Triết, Tài, Khoa, Tuấn
- [ ] Constitution 1.0.1 acknowledged by all five leads

## D — AI usage and weekly report (Khoa, reviewer Triết)
- [ ] `AI_USAGE_LOG.md` merged to `pa2`; every row has a "what a human changed" note
- [ ] Minutes: Sprint Planning, two standups, Sprint Review (`docs/pa2/MEETINGS/`)
- [ ] Jira screenshots (`docs/pa2/screenshots/`)
- [ ] `WEEKLY_REPORT.md`; PDF built

## Backend database design (Tài, SCRUM-32)
- [x] `api/app/core/database_document.md` merged and reviewed (commit `84aad76`)

## Submission (Lộc, last)
- [ ] All documents merged to `pa2`, each with Markdown and PDF
- [ ] Git log exported
- [ ] Zip `PA2-Group[GroupId]` (confirm the Group ID; the Vision Document says Group 02)
- [ ] No `.env` files, secrets or absolute paths in the repo
- [ ] `pa2` → `dev` PR after Sprint Review (Lộc)
- [ ] Tài submits the zip to the school's Moodle after the merge to `dev`
