# PA3 — Sprint 3

Deadline **Fri 2026-11-13** (zip and submission buffer 11-14 to 11-15). Jira: Sprint 3 (PA3). Each member's tasks: `loc/`, `triet/`, `tai/`, `khoa/`, `tuan/` → `TODO.md`.

## What PA3 grades
Revised plan and vision with `Changes.md` (A, B, 10 pts), use-case model (C, 10), use-case specs with prototype screenshots (D, 45), FG-03 end to end with Spec Kit and a video (E, 20), AI usage and weekly report (F, 5). Spec Kit artifacts (`specs/`, plans, tasks) go in the zip.

## Scope
**Build 1, shrunk to what FG-03 needs**

| Keep | Cut |
|---|---|
| Migrations + seed with mock data | Refresh-token rotation |
| Register / login (Argon2id, access JWT) | Profile editing, CEFR screens |
| Create room, join by invite code, `LOBBY` → `READY`, 409 on third user | `LIVE` / `ENDED` beyond FG-03 start |
| Lobby UI | Separate M1 demo and smoke test (folded into FG-03 video and E2E) |

**Database first (11-04):** `docker compose up db`, `alembic upgrade head`, `python -m app.seed` gives 5 users, 10 topics (all CEFR levels), 1 room in `LOBBY`.

**Features running by 11-13:** FG-03 (graded), FG-01 register/login (needed by FG-03), FG-02 topic list/filter (extra).

**Extra prep (stretch, only if FG-03 and documents are on track):**

| Who | Item | Jira |
|---|---|---|
| Tài | FG-02 topic API; LiveKit token spike | SCRUM-44, 45 |
| Khoa | `STTAdapter` + local transcription of a sample WAV | SCRUM-46 |
| Tuấn | `LLMAdapter` + grounding guard | SCRUM-47 |
| Triết | Microphone setup screen spike | SCRUM-48 |
| Lộc | CI job: migrations + seed | SCRUM-43 |

Build 1 Jira: SCRUM-24 auth, 25 frontend, 26 room API, 27 lobby UI, 28 state machine (SCRUM-29, 30 folded into FG-03). New: SCRUM-41 DB + seed, SCRUM-42 Docker DB.

## Repo cleanup (done, PR 14)
Deleted: finished PA2 files, duplicate Spec Kit in `src/` (identical constitution kept at `.specify/memory/constitution.md`), `git_log.txt`, `report_build/`, PA1/PA2 briefs. Spec Kit lives at the repo root. All files remain in Git history at `f789f5c`.

Recover a file: `git show f789f5c:docs/pa2/<file>`.

| PA2 file | Now |
|---|---|
| `PROJECT_PLAN.md` | Moved to `docs/requirements/` (Tài revises it) |
| `G1_SPEC_BUILD1.md` | Moved to `docs/architecture/` |
| `TODO.md`, `CHECKLIST.md` | Replaced by the per-member `TODO.md` files |
| `JIRA_MAPPING.md` | Replaced by `docs/management/SPRINT_TASKS.md` |
| `WEEKLY_REPORT`, `AI_USAGE_LOG`, `MEETINGS/` | Deleted; PA3 versions go in `docs/pa3/` (SCRUM-40), PA2 layout is the template |
| `SPECKIT_TRAINING`, `speckit-training-Triet`, `PA1_LESSONS`, `drafts/` | Deleted |

Open: review `docs/design/initial/figma-state.json` and `docs/reference/ORIGINAL_PROMPT_REFERENCE.md` (kept for now).
