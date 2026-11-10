# Sprint Review (PA3)

**Methodology:** Scrum

## Sprint results

| PA3 objective | Result and evidence |
|---|---|
Status as of 2026-11-10. Update on 2026-11-13 with the final result.

| PA3 objective | Result and evidence |
|---|---|
| Revised Project Plan, Vision, and `Changes.md` | Partial. Plan revised; Vision still to be revised; TA feedback rows in `Changes.md` open |
| Use-case model for all functional groups | Done (PR 19); review pending |
| Use-case specifications and UI prototypes | Done (PR 19); review pending |
| FG-03 room/session implementation | Not done. No auth API, room API, migrations or integrated UI on `pa3` yet |
| FG-03 tests and narrated demo | Not done. No E2E test, no video |
| AI usage and weekly report | Partial. Jira screenshots still to be added |

## Retrospective

- **What went well**
  - The use-case model and use-case specifications with prototypes were completed.
  - The room state machine and the grounding guard were merged with unit tests.
  - Regular Scrum check-ins helped the team identify dependencies and keep work visible.

- **What went wrong**
  - FG-03 is not integrated yet: the database migrations, auth API and room API were not merged by 2026-11-10, so the frontend and backend do not connect.
  - Some integration work took longer than expected because frontend and backend changes were developed in parallel.
  - Documentation and implementation needed repeated updates to remain consistent.
  - Testing and demo preparation were concentrated toward the end of the sprint.

- **Problems and causes**
  - **Integration delays:** Some interface details were clarified after implementation had started, leading to rework.
  - **Documentation drift:** Requirements and implementation changed at different times, so documents needed additional review.
  - **Late testing and demo preparation:** The team prioritized implementation first and did not reserve enough time for early end-to-end checks.

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

| Action | Owner | Target date |
|---|---|---|
| Agree on audio/STT interfaces and acceptance criteria before implementation | Khoa, Triết, Tài | Before implementation starts |
| Run integration checks regularly and record results | Assigned feature owners | Throughout PA4 |
| Keep architecture and task documentation aligned with delivered work | Relevant document owners | Throughout PA4 |
| Reserve time for demo rehearsal and evidence collection | Demo owner and team | Before PA4 sprint end |

## Review summary

As of 2026-11-10 the documents are mostly in place, but FG-03 end to end (graded) is not done and the project is behind schedule. This summary is to be rewritten on 2026-11-13 from what is merged and verified.
