# TODO — Tuấn (AI Orchestrator & Analysis)

Team deadline: **Fri 2026-11-13**. Scope and rules: [../README.md](../README.md). Branch from `pa3`, PR into `pa3`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Part A: revised Project Plan + `docs/pa3/Changes.md` (reassigned from Tài) | SCRUM-35 | `feature/SCRUM-35-plan-reassign` | 11-11 | Reassigned 2026-11-14; revision draft 0.2 in `docs/requirements/PROJECT_PLAN.md` |
| Room state machine as a pure function + transition tests | SCRUM-28 | `feature/SCRUM-28-room-state-machine` | 11-04 | Local implementation tested; Tài review pending |
| Part C: use-case model, Mermaid diagrams for all 10 FGs | SCRUM-36 | `feature/SCRUM-36-use-case-model` | 11-09 | Local model and PDF prepared; Tài review pending |
| Part D: use-case specifications, every alternative flow (45 pts) | SCRUM-37 | `feature/SCRUM-37-use-case-specs` | 11-12 | Local specifications prepared; Lộc review pending |
| Part D: UI prototype screenshots for every use case | SCRUM-37 | `feature/SCRUM-37-use-case-specs` | 11-12 | Local prototypes prepared; Triết/Lộc review pending |
| *Extra:* `LLMAdapter` protocol + grounding guard (verbatim-quote check) with unit tests | SCRUM-47 | `feature/SCRUM-47-llm-adapter-grounding` | 11-12 | Local stretch implementation tested; peer review pending |

Integration dependency: Tài's SCRUM-26/38 room service consumes SCRUM-28. Part D flows and UI design remain co-owned with Triết; human review is pending.

Work record: [implementation guide](IMPLEMENTATION_GUIDE.md). These are artifact statuses, not Jira transitions or peer approvals. Initial delivery was local; on 2026-11-10 the user authorized a combined PR into `pa3`, reviewed by Nguyễn Anh Khoa (24125058), AI Audio & Speech Pipeline Lead. The table retains the Jira-assigned review references. SCRUM-26/38 own real room-service integration.


## UI refinement — shared UI styling, typography and account pages

Delivery progress (2026-11-14): implementation and navigation-baseline review are prepared on `feature/SCRUM-49-ui-type-account`. Before/after captures and review findings are attached in [the evidence record](scrum49/README.md). Tuấn instructed that Figma edits are not required after checking with Triết; the existing frames are preserved. The source-repository status below is not a live Jira transition. Lộc's peer review and merge remain pending.

**Owner:** Trần Lê Anh Tuấn — **24125107** — **AI Orchestrator & Analysis Lead**.

**Jira:** [SCRUM-49](https://ndtloc0304.atlassian.net/browse/SCRUM-49). **Estimate:** 10 points. **Delivery status:** Ready for review; Jira status not changed.

**Reviewer:** Nguyễn Đình Thiên Lộc (24125093). **Scheduling:** Backlog; no new due date.

Source: [implementation plan](../../superpowers/plans/2026-11-06-ui-refinement.md)
(UI-R01 planning section) and [design brief](../../design/UI_REFINEMENT_BRIEF.md).
This adds work only for this UI refinement scope; existing tasks, dates and
statuses above are unchanged. Triết (24125047) is excluded from this addition.

**Scope decision (2026-11-14):** Tuấn reported that Triết does not require a Figma update and explicitly asked to skip that step. Use the existing Cream & Yellow direction and browser baseline; no new Figma approval is claimed. The scaffold baseline is available on pa3. Coordinate shared token vocabulary with all owners.

**Owned files:** web/src/index.css; web/src/components/ui.tsx; web/src/pages/AccountPages.tsx; optional web/src/pages/account.css; web/tests/account-refinement.spec.ts.

Breakdown: foundation/spec/Figma **2**, four account screens **4**, typography
and form validation **2**, peer review **1**, integration/fixes **1**.

- [x] Figma-edit step waived by Tuấn's explicit instruction after checking with
  Triết. Preserve baseline frames; implemented type/control roles are recorded
  in `DESIGN.md` and CSS. No Figma work or approval is claimed.
- [x] Update `SOFTWARE_ARCHITECTURE_SPEC.md` and `PROJECT_PROPOSAL.md` before
  implementation; record the scoped roles in `DESIGN.md`. No sidecar exists.
- [x] Implement shared roles and consume them in sign-in, registration,
  account-created example and profile. Align password reveal with the field,
  improve group rhythm and reduce redundant explanatory framing without removing
  preview/saving limitations or CEFR self-assessment guidance.
- [x] Validate all four routes at phone/desktop sizes; exercise password reveal,
  keyboard radios, 200% text sizing, long Vietnamese display names, cold-cache
  font loading and blocked-font fallback. Add a needed font subset only after
  verifying coverage; keep the existing two weights.
  Verify no password persistence and no service submission.
- [x] Review the available navigation baseline used by Tài's package, including
  skip link, account/room links, history, focus, reload and unknown/expired
  recovery. Findings and UI-R02 follow-up are in the evidence record; no
  unsubmitted UI-R02 work or approval is claimed.
- [ ] Nguyễn Đình Thiên Lộc reviews the PR; address any requested changes and
  merge only through the team's authorized process.

**Done:** all four screens use the agreed type/control system, one clear primary
task, readable fields and visible focus. Local Inter weights are actually loaded,
fallback remains usable, and before/after captures demonstrate changed hierarchy.
No body text is made smaller to achieve visual lightness.

**Shared completion checks:** preserve Cream & Yellow, Inter 400/600, all preview
routes and explicit sample/disabled-media boundaries. The Figma-edit step is
waived for this package per the scope decision above;
update the relevant architecture/proposal specs first. Validate responsive and
keyboard behavior, reduced motion, long text and 200% zoom. From `web/`, run
`npm run build`, `npm run lint` and `npm run test:e2e`; attach before/after
captures and peer-review evidence. No backend, authentication or audio work.

**Branch/PR:** after the scaffold is available on `pa3`, branch from `pa3` using
`feature/SCRUM-49-ui-type-account` and open the PR into `pa3`;
do not recreate the existing scaffold.
