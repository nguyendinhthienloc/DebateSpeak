# TODO — Lộc (DevOps & QA)

Team deadline: **Fri 2026-11-13**. Buffer for zip and submission: 11-14 to 11-15. Scope and rules: [../README.md](../README.md). Branch from `pa3`, PR into `pa3`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Merge cleanup PR 14 into `pa3` | PR 14 | n/a | 11-03 | Done |
| Docker Compose database starts clean for every member (`docker compose up db`) | SCRUM-42 | `feature/SCRUM-42-docker-db` | 11-04 | Open |
| CI job: run migrations + seed against Postgres | SCRUM-43 | `feature/SCRUM-43-ci-migrate-seed` | 11-06 | Stretch |
| Review FG-03 PRs and Changes.md | SCRUM-38, 35 | n/a (review) | 11-11 | Open |
| Record narrated FG-03 demo (includes the lobby flow), upload to YouTube | SCRUM-39 | `feature/SCRUM-39-fg03-demo-video` | 11-12 | Open |
| Build `PA3-Group[GroupId].zip` (docs as .md + PDF, Git log, Spec Kit artifacts), merge `pa3` → `dev` | none | n/a | 11-13 | Open |

Blocked by: FG-03 done before the video.


## UI refinement — waiting and ready lobbies and verify UI accessibility

**Owner:** Nguyễn Đình Thiên Lộc — **24125093** — **DevOps & QA / Fact-Checking Lead**.

**Jira:** [SCRUM-52](https://ndtloc0304.atlassian.net/browse/SCRUM-52). **Estimate:** 10 points. **Status:** To Do.

**Reviewer:** Nguyễn Anh Khoa (24125058). **Scheduling:** Backlog; no new due date.

Source: [implementation plan](../../superpowers/plans/2026-11-06-ui-refinement.md)
(UI-R04 planning section) and [design brief](../../design/UI_REFINEMENT_BRIEF.md).
This adds work only for this UI refinement scope; existing tasks, dates and
statuses above are unchanged. Triết (24125047) is excluded from this addition.

**Prerequisites:** Reviewed lobby Figma direction, scaffold baseline on pa3, Tài's lobby-module extraction and Tuấn's shared visual/type roles. Final shared acceptance follows all page packages; each owner fixes their own defects.

**Owned files:** web/src/pages/LobbyPage.tsx; web/src/pages/lobby.css; web/tests/scaffold.spec.ts; web/tests/lobby-refinement.spec.ts; web/playwright.config.ts.

Breakdown: lobby Figma/state specification **2**, waiting/ready screens **3**,
cross-screen acceptance **3**, peer review **1**, integration/fixes **1**.

- [ ] Revise waiting/ready Figma frames: motion first, smaller participant names,
  clear stances, compact code/action group, fewer redundant dividers and no
  invented presence indicators. Keep distinct waiting/ready reading priorities.
- [ ] Implement both lobby variants. Preserve waiting Copy code and its failure
  recovery; preserve disabled READY Test microphone with associated explanation.
  Use the shared motion vocabulary for copy feedback and a polite status message.
- [ ] Maintain the shared test matrix: all 12 routes plus unknown fallback at
  320/390/768/1102/1440px; representative 200% zoom/text stress; normal/reduced
  motion; clipboard rejection; keyboard and visible focus; long names/motions.
  Verify no request for media or application services and no credential storage.
- [ ] Audit every owner's screenshots and changed behavior, including open and
  closed disclosures. Run build/lint/browser suite and scoped Impeccable scans.
  Check representative current Chrome, Edge and Firefox where available; record
  any browser/device not exercised. Record contrast and motion-performance
  observations without claiming certification or unmeasured speed improvements.
- [ ] Review Tuấn's account/foundation package; integrate feedback on this package.

**Done:** lobbies stay calm and readable, all critical regression checks pass,
and the final evidence matrix names actual coverage and any remaining limitation.
Each owner fixes their own failed screen; Lộc does not absorb everyone's repairs.

**Shared completion checks:** preserve Cream & Yellow, Inter 400/600, all preview
routes and explicit sample/disabled-media boundaries. Review Figma before code;
update the relevant architecture/proposal specs first. Validate responsive and
keyboard behavior, reduced motion, long text and 200% zoom. From `web/`, run
`npm run build`, `npm run lint` and `npm run test:e2e`; attach before/after
captures and peer-review evidence. No backend, authentication or audio work.

**Branch/PR:** after the scaffold is available on `pa3`, branch from `pa3` using
`feature/SCRUM-52-ui-lobby-acceptance` and open the PR into `pa3`;
do not recreate the existing scaffold.
