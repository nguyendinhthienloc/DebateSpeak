# TODO — Khoa (AI Audio & Speech Pipeline)

Team deadline: **Fri 2026-11-13**. Scope and rules: [../README.md](../README.md). Branch from `pa3`, PR into `pa3`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Review Tài's migrations and seed data | SCRUM-41 | `feature/SCRUM-41-db-migrations-seed` | 11-05 | Open |
| FG-03 E2E test (Playwright): register, create, join, `READY`, third user 409 | SCRUM-38 | `feature/SCRUM-38-fg03-room-session` | 11-10 | Open |
| Part B: revised Vision Document + changes listed in `Changes.md` | SCRUM-35 | `feature/SCRUM-35-revised-plan-vision` | 11-11 | Open |
| Sprint 3 AI usage + weekly report (Part F), Jira screenshots, standup and Sprint minutes | SCRUM-40 | `feature/SCRUM-40-weekly-report` | 11-12 | Open |
| PDFs for Project Plan, Vision Document, use-case model and specs | SCRUM-36, 37 | `feature/SCRUM-36-use-case-model` | 11-12 | Open |
| *Extra:* `STTAdapter` protocol + local transcription of a sample WAV | SCRUM-46 | `feature/SCRUM-46-stt-adapter-spike` | 11-12 | Stretch |

Blocked by: Build 1 merged for the E2E test; Tài's revised plan for the PDFs.


## UI refinement — room setup with a lighter preview and accessible motion

**Owner:** Nguyễn Anh Khoa — **24125058** — **AI Audio & Speech Pipeline Lead**.

**Jira:** [SCRUM-51](https://ndtloc0304.atlassian.net/browse/SCRUM-51). **Estimate:** 10 points. **Status:** To Do.

**Reviewer:** Nguyễn Hồng Tấn Tài (24125078). **Scheduling:** Backlog; no new due date.

Source: [implementation plan](../../superpowers/plans/2026-11-06-ui-refinement.md)
(UI-R03 planning section) and [design brief](../../design/UI_REFINEMENT_BRIEF.md).
This adds work only for this UI refinement scope; existing tasks, dates and
statuses above are unchanged. Triết (24125047) is excluded from this addition.

**Prerequisites:** Reviewed setup Figma direction, scaffold baseline on pa3, Tài's setup-module extraction and Tuấn's shared visual/type roles. Dependencies are prerequisite steps, not completion of those entire packages.

**Owned files:** web/src/pages/RoomSetupPage.tsx; web/src/pages/setup.css; web/src/roomSettings.ts; web/tests/setup-refinement.spec.ts.

Breakdown: setup/motion Figma specification **2**, two setup screens **4**,
motion and interaction validation **2**, peer review **1**, integration/fixes **1**.

- [ ] Revise create-room and settings desktop/mobile frames. Replace the large
  dark preview with the proposed light treatment; show one shared explanation
  where it replaces repeated text without losing speaker/stance meaning.
- [ ] Implement task-first setup and settings layouts. Desktop retains an
  optional supporting column; narrow screens show a compact summary and a
  labeled preview-details disclosure. Current settings and action remain outside
  it. Keep disabled audio controls and their unavailability explanation clear.
- [ ] Apply the brief's motion timings to settings-to-preview feedback and
  optional details. Data/state updates immediately. No page-load sequence,
  simulated microphone meter, audio request or new motion dependency.
- [ ] Verify random/chosen and opposite stances, blank/min/max duration, local
  values across route changes, reload reset, rapid toggles and navigation during
  transitions. Test normal/reduced motion and 320px layout. Confirm expanded
  content is in the accessibility tree and closed content is not tabbable.
- [ ] Review Lộc's lobby package; integrate feedback on this package.

**Done:** setup leads visually, mobile secondary detail is optional, and changes
to settings have legible feedback. Both motion modes preserve controls, focus,
visible state and preview truthfulness; no animation delays an action.

**Shared completion checks:** preserve Cream & Yellow, Inter 400/600, all preview
routes and explicit sample/disabled-media boundaries. Review Figma before code;
update the relevant architecture/proposal specs first. Validate responsive and
keyboard behavior, reduced motion, long text and 200% zoom. From `web/`, run
`npm run build`, `npm run lint` and `npm run test:e2e`; attach before/after
captures and peer-review evidence. No backend, authentication or audio work.

**Branch/PR:** after the scaffold is available on `pa3`, branch from `pa3` using
`feature/SCRUM-51-ui-setup-motion` and open the PR into `pa3`;
do not recreate the existing scaffold.
