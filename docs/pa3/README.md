# PA3 — Sprint 3

Deadline **Fri 2026-11-13** (zip and submission buffer 11-14 to 11-15). Jira: Sprint 3 (PA3). Each member's tasks: `loc/`, `triet/`, `tai/`, `khoa/`, `tuan/` → `TODO.md`.

## How to work (everyone)
1. `git checkout pa3 && git pull`, then branch from `pa3`.
2. Name the branch `feature/SCRUM-<nn>-<short-name>` (bug fixes: `bugfix/SCRUM-<nn>-<short-name>`). Example: `feature/SCRUM-24-auth-api`.
3. Open the PR **into `pa3`**, never into `dev` or `main`. One teammate reviews; a merged PR counts as reviewed.
4. Never commit directly to `pa3` for code. Only Lộc commits planning docs straight to it.
5. Lộc merges `pa3` into `dev` once, at the end of the sprint.

## What PA3 grades
Revised plan and vision with `Changes.md` (A, B, 10 pts; the single [Changes.md](Changes.md) is mandatory, no file = no points), use-case model (C, 10), use-case specs with prototype screenshots (D, 45), FG-01 end to end with Spec Kit and a video (E, 20; changed from FG-03 on 2026-11-14), AI usage and weekly report (F, 5). Spec Kit artifacts (`specs/`, plans, tasks) go in the zip.

## Scope
**Build 1 is shrunk to what FG-03 needs** (kept and cut lists: [Changes.md](Changes.md)).

**Database:** `docker compose up -d db`; the Spring Boot API creates its tables on start. Run steps: `specs/002-fg01-accounts/quickstart.md`.

**Graded feature:** FG-01 accounts end to end (UC-01-01 to 08). FG-03 moves to PA4.

**Extra prep (stretch, only if FG-03 and documents are on track):**

| Who | Item | Jira |
|---|---|---|
| Tài | FG-02 topic API; LiveKit token spike | SCRUM-44, 45 |
| Khoa | `STTAdapter` + local transcription of a sample WAV | SCRUM-46 |
| Tuấn | `LLMAdapter` + grounding guard | SCRUM-47 |
| Triết | Microphone setup screen spike | SCRUM-48 |
| Lộc | CI job: migrations + seed | SCRUM-43 |

Build 1 Jira keys and the repo cleanup record (PA2 file map): [Changes.md](Changes.md).
