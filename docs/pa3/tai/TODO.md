# TODO — Tài (Backend & Real-Time Media)

Team deadline: **Fri 2026-11-13**. Scope and rules: [../README.md](../README.md). Branch from `pa3`, PR into `pa3`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| **First:** Alembic migrations + seed script with mock data (5 users, 10 topics, 1 room) | SCRUM-41 | `feature/SCRUM-41-db-migrations-seed` | 11-04 | Open |
| Auth API: register, login, Argon2id, access JWT | SCRUM-24 | `feature/SCRUM-24-auth-api` | 11-05 | Open |
| Room API: create, join by invite code, 409 on third user | SCRUM-26 | `feature/SCRUM-26-room-api` | 11-06 | Open |
| FG-03 backend lead: topic selection, synchronized debate start, tests (pytest) | SCRUM-38 | `feature/SCRUM-38-fg03-room-session` | 11-10 | Open |
| Part A: revised Project Plan + `docs/pa3/Changes.md` | SCRUM-35 | — | 11-11 | Reassigned to Tuấn on 2026-11-14 |
| *Extra:* FG-02 topic list/filter API | SCRUM-44 | `feature/SCRUM-44-topic-api` | 11-11 | Stretch |
| *Extra:* LiveKit access-token endpoint spike | SCRUM-45 | `feature/SCRUM-45-livekit-token-spike` | 11-12 | Stretch |

Blocked by: Tuấn's state machine (SCRUM-28) for the room API.


## UI refinement — navigation, room entry, invitations and recovery pages

**Owner:** Nguyễn Hồng Tấn Tài — **24125078** — **Backend & Real-Time Media Lead**.

**Jira:** [SCRUM-50](https://ndtloc0304.atlassian.net/browse/SCRUM-50). **Estimate:** 10 points. **Status:** To Do.

**Reviewer:** Trần Lê Anh Tuấn (24125107). **Scheduling:** Backlog; no new due date.

Source: [implementation plan](../../superpowers/plans/2026-11-06-ui-refinement.md)
(UI-R02 planning section) and [design brief](../../design/UI_REFINEMENT_BRIEF.md).
This adds work only for this UI refinement scope; existing tasks, dates and
statuses above are unchanged. Triết (24125047) is excluded from this addition.

**Prerequisites:** Scaffold baseline available on pa3. Extract page modules first; page styling consumes Tuấn's shared roles. Hand extracted setup/lobby modules to Khoa/Lộc.

**Owned files:** web/src/App.tsx; web/src/routes.ts; new web/src/components/PreviewTools.tsx; web/src/pages/RoomEntryPages.tsx; web/src/pages/entry.css; web/tests/navigation-refinement.spec.ts.

Breakdown: passing extraction **2**, shell plus four entry/recovery screens **4**,
navigation/disclosure validation **2**, peer review **1**, integration/fixes **1**.

- [ ] Make the extraction described above and confirm existing tests still pass.
  This is a prerequisite, not a separate product feature or an empty-page layer.
- [ ] Revise room-entry/invitation/recovery and shell Figma examples. Distinguish
  the main action from secondary navigation; keep error text near its field.
- [ ] Refine `/rooms`, `/invite`, `/rooms/full`, `/rooms/expired`, the shared
  header and unknown-route fallback. Implement the compact preview-tools
  disclosure with a permanently visible short preview notice and current screen.
- [ ] Verify all 12 routes remain selectable when the disclosure is open;
  direct links, refresh, back/forward and unknown routes still work. Check
  keyboard open/close, focus after route changes, long labels and 200% zoom.
  Update affected test interactions to open the disclosure explicitly.
- [ ] Review Khoa's setup package; integrate feedback on this package.

**Done:** review navigation is clearly secondary and remains discoverable; no
hidden-only preview warning, inaccessible route, changed URL or fake invite
validation. The recovery flow has a clear action and preserves example wording.

**Shared completion checks:** preserve Cream & Yellow, Inter 400/600, all preview
routes and explicit sample/disabled-media boundaries. Review Figma before code;
update the relevant architecture/proposal specs first. Validate responsive and
keyboard behavior, reduced motion, long text and 200% zoom. From `web/`, run
`npm run build`, `npm run lint` and `npm run test:e2e`; attach before/after
captures and peer-review evidence. No backend, authentication or audio work.

**Branch/PR:** after the scaffold is available on `pa3`, branch from `pa3` using
`feature/SCRUM-50-ui-navigation-entry` and open the PR into `pa3`;
do not recreate the existing scaffold.
