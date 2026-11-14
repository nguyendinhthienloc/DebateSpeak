# Sprint Review (PA3)
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058); Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

**Methodology:** Scrum

## Sprint results
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058); Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

Status as of 2026-11-10. Update on 2026-11-13 with the final result.

| PA3 objective | Result and evidence |
|---|---|
| Revised Project Plan, Vision, and `Changes.md` | Partial. `PROJECT_PLAN.md` is still the PA2 v0.1 draft and not yet revised; Vision not yet revised; `Changes.md` drafted |
| Use-case model for all functional groups | Done (PR 19, merged) |
| Use-case specifications and UI prototypes | Done (PR 19, merged) |
| FG-03 room/session implementation | Not done. No auth API, room API, migrations or integrated UI on `pa3` yet |
| FG-03 tests and narrated demo | Not done. No E2E test, no video |
| AI usage and weekly report | Partial. Weekly report still has unconfirmed placeholders; the AI log lacks most members' PA3 use; Jira screenshots missing |

## Update 2026-11-14: Part E scope change
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058); Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

FG-03 could not be delivered: the room API (SCRUM-26, 38) was not built. The team moved Part E to FG-01, which has a complete frontend (UC-01-01 to 08, browser tests) and a Spring Boot + PostgreSQL backend on `backend-tai`. Evidence: `specs/002-fg01-accounts/`. FG-03 moves to PA4. The 2026-11-10 table above is kept as the record of that date.

## Retrospective
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058); Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

- **What went well**
  - The use-case model and use-case specifications with prototypes were completed.
  - The room state machine and the grounding guard were merged with unit tests.
  - Regular Scrum check-ins helped the team identify dependencies and keep work visible.

- **What went wrong**
  - FG-03 is not integrated yet: the database migrations, auth API and room API were not merged by 2026-11-10, so neither the FG-03 frontend nor the backend API exists on `pa3`.
  - Work went into documents and isolated domain modules, not into the vertical slice FG-03 needs.
  - The first version of this Sprint Review stated FG-03 was done without being checked against the repository.
  - No E2E test or demo exists yet.

- **Problems and causes**
  - **Dependency chain on one owner:** SCRUM-41, 24, 26 and 38 are all assigned to Tài, so a delay in the first blocks the rest.
  - **Late integration:** the UI scaffold lives on `feature/UI-scaffold` and was not merged into `pa3`, so frontend and backend never met.
  - **Status not verified against evidence:** Jira and this document reported work as done that the repository did not show.
  - Causes beyond these are to be written by the team on 2026-11-13.

- **What to do differently in PA4**
  - Agree on interface contracts and acceptance criteria before parallel implementation begins.
  - Integrate and test small increments throughout the sprint rather than waiting until the feature is nearly complete.
  - Update specifications and Jira status as work changes.
  - Schedule demo preparation and evidence collection before the final days of the sprint.

- **Lessons learned**
  - A clear task owner does not remove the need for coordination between dependent tasks.
  - Early integration testing can reveal mismatches while they are still easier to fix.
  - Meeting notes, Jira updates, and test evidence are easier to maintain when recorded during the sprint.

## Actions for next PA4
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058); Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

| Action | Owner | Target date |
|---|---|---|
| Agree on audio/STT interfaces and acceptance criteria before implementation | Khoa, Triết, Tài | Before implementation starts |
| Run integration checks regularly and record results | Assigned feature owners | Throughout PA4 |
| Keep architecture and task documentation aligned with delivered work | Relevant document owners | Throughout PA4 |
| Reserve time for demo rehearsal and evidence collection | Demo owner and team | Before PA4 sprint end |

## Review summary
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058); Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

As of 2026-11-10 the documents are mostly in place, but FG-03 (the graded end-to-end slice) is not done and the project is behind schedule. This summary is to be rewritten on 2026-11-13 from what is merged and verified.
