# Spec Kit Initialisation and Training Evidence (PA2 Part C, SCRUM-22)

Owner: Lộc. Reviewer: Tài.

## 1. Initialisation evidence

| Item | Evidence |
|---|---|
| Spec Kit initialised in `/src` | Commit `8e32cba` "feat(sdd): initialize Spec Kit and establish DebateSpeak AI constitution (T2.3)", merged by [PR #4](https://github.com/nguyendinhthienloc/DebateSpeak/pull/4) |
| Constitution | `src/constitution.md` (copies in `.specify/memory/` and `src/.specify/memory/` are kept identical) |
| Templates, scripts, workflow | `src/.specify/` (templates, PowerShell scripts, `workflows/speckit`) |
| Agent skills | `src/.github/skills/speckit-*` (analyze, checklist, clarify, constitution, converge, implement, plan, specify, tasks, taskstoissues) |

## 2. Constitution check against `AGENTS.md` (CHECKLIST section C)

| `AGENTS.md` section | Constitution |
|---|---|
| §1 No hardcoded paths | Principle I |
| §2 Secrets | Principle II |
| §3 Team identity and roles | Principle VII (added in 1.0.1; was missing) |
| §4 Architecture invariants | Section 2 stack table, Principle III adapters |
| §5 Spec before code, adapters, latexmk | Principle III, stack table |
| §6 Incremental vertical slices | Principle IV |
| §7 User consequences, dual consent | Principle V, Principle VII.2 (added in 1.0.1) |
| §8 Brutal honesty (agents and coaching prompts) | Principle VI (coaching prompts), Principle VII.3 (agents, added in 1.0.1) |

The amendment (1.0.0 to 1.0.1) needs consensus of all five leads under constitution section 3. PR #7 is merged, so Tài's review is done. Acknowledgement by the other four leads is still pending (SCRUM-22).

## 3. Training log (CHECKLIST section C)

One entry per member. Evidence is a screenshot or a note with date, name and what was learned. Rows stay empty until the member supplies them.

| Member | Date | What was done and learned | Evidence |
|---|---|---|---|
| Lộc | 2026-10-13, 2026-10-21 | Hands-on Spec Kit work as DevOps lead: initialised Spec Kit in `/src` and ran the setup commands, wrote the DebateSpeak AI constitution (1.0.0), then amended it to 1.0.1 to match `AGENTS.md` and recorded the check in section 2 above. Learned how the constitution, templates and `/speckit-*` skills fit together. | Commit `8e32cba` (initialisation), PR #4, commit `d0d6aa2` (amendment), PR #7 |
| Triết | 29/10/2026 | Read the project constitution and inspected spec, plan, task templates. Learned the specify -> plan -> tasks -> implement workflow. |[Training note](speckit-training-Triet.md) |
| Tài | | | |
| Khoa | | | |
| Tuấn | | | |

## 4. Open items

- Training entries: Lộc and Triết are done. Tài, Khoa and Tuấn still need to add their row to section 3 (SCRUM-22).
- Build 1 spec files (`/speckit-specify` for auth and room lobby): Sprint 3.
