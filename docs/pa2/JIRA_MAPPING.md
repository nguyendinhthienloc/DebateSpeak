# Jira Mapping (checklist A-6, input to the Project Plan)

Project: `SCRUM` ("DebateSpeak"), read from Jira on 2026-10-21.

## Epics

| Jira | Epic | Status |
|---|---|---|
| SCRUM-15 | Build 1 | To Do |
| SCRUM-16 | Build 2 | To Do |
| SCRUM-17 | Build 3 | To Do |
| SCRUM-18 | Build 4 | To Do |
| SCRUM-8 | Backend (older epic, assignee Tài) | To Do |

## Sprint 2 tasks

| Jira | Task ID | Summary | Assignee | Status on 2026-10-21 |
|---|---|---|---|---|
| SCRUM-19 | G1 | Gate G1 spec | Tuấn | To Do |
| SCRUM-20 | T2.1 | Project Plan | Tuấn | To Do |
| SCRUM-21 | T2.2 | Vision Document | Triết | To Do |
| SCRUM-22 | T2.3 | Spec Kit evidence | Lộc | In Progress |
| SCRUM-23 | T2.4 | AI Usage & Weekly Report | Khoa | To Do |
| SCRUM-24 | T2.5 | Build 1 Backend: auth and migrations | Tài | To Do |
| SCRUM-25 | T2.6 | Build 1 Frontend: auth UI | Triết | To Do |
| SCRUM-26 | T2.7 | Room lifecycle: API | Tài | To Do |
| SCRUM-27 | T2.7 | Room lifecycle: lobby UI | Triết | To Do |
| SCRUM-28 | T2.8 | Room state machine | Tuấn | To Do |
| SCRUM-29 | T2.9 | M1 smoke test | Khoa | To Do |
| SCRUM-30 | M1 | Milestone 1 demo | Lộc | To Do |

T2.7 has two Jira keys (API and UI) so that each ticket keeps exactly one assignee, as the single-assignee rule requires.

## Gaps found

- **A-6.2 sprints:** the Jira connector used here can read and move issues but has no sprint-creation call. Sprints `Sprint 1 (PA1)` to `Sprint 5 (PA5)` must be created in the Jira UI by Lộc.
- **A-6.3 epics:** Build 1 to Build 4 exist. Whether the Sprint 2 tasks are linked to SCRUM-15 was not checked.
- **Unlogged work:** Lộc's Jira setup (A-6), his B-5 paragraphs, and the PA1 lessons write-up have no tickets. The process standard says all activity is logged, so they need tickets.
- **Dates:** the process standard requires tasks to be created at Sprint Planning and completed one by one. Nothing in Sprint 2 is Done yet, which is consistent with that rule; do not batch-close at the end.
