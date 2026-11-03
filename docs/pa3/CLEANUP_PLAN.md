# Repo cleanup plan

Branch: `feature/cleanup-repo` from `pa3`, one PR into `pa3` before teammates start PA3 branches. Owner: Lộc.

## Decisions
- Finished PA2 material is deleted; git history keeps it. Live files are moved first.
- Spec Kit stays at the repo root (`.specify/`, `.github/skills/`). The `src/` copy is deleted.
- Code refactor is layout only: no behaviour changes.

## Work

| Step | Action |
|---|---|
| 1 | Move live files: `docs/pa2/PROJECT_PLAN.md` → `docs/requirements/`, `docs/pa2/G1_SPEC_BUILD1.md` → `docs/architecture/`, `src/constitution.md` content → `.specify/memory/constitution.md` if newer |
| 2 | Delete `src/` (Spec Kit duplicate), `docs/pa2/` remainder, PA1/PA2 briefs in `docs/assignments/` (keep PA3–PA5), `git_log.txt`, `report_build/` |
| 3 | Fix every link to a deleted or moved path (`docs/management/*`, `docs/ROADMAP.md`, `README.md`, `AGENTS.md`) |
| 4 | Update obsolete docs: `README.md`, `docs/ROADMAP.md`, `docs/management/SPRINT_TASKS.md` (Sprint 2 closed, new PA3 Jira keys SCRUM-35 to 40), `AGENTS.md` sprint path |
| 5 | Layout: add `api/app/auth/`, `api/app/rooms/`, `web/src/pages/`; check CI paths and `docker-compose.yml` still resolve |
| 6 | Run CI checks (ruff, ESLint, pytest) and open PR into `pa3` |

## Risks
- PA2 required Spec Kit under `/src`; PA3 does not. PA2 is submitted, so deleting `src/` is low risk. Check PA4 and PA5 briefs.
- Teammates with open branches touching moved files will conflict; merge this PR first.

## Open questions
- Resolved: `PA3-2026.pdf` does not require Spec Kit under `/src`. It requires the generated Spec Kit artifacts (specs, plans, tasks) in the submission. PA4 and PA5 briefs not yet checked.
- Keep `docs/design/initial/figma-state.json` and `docs/reference/ORIGINAL_PROMPT_REFERENCE.md`? Not yet reviewed.
- Final list of obsolete docs to update beyond step 4.

See [PA2_FILE_MAP.md](PA2_FILE_MAP.md) for where each PA2 file went.
