# DebateSpeak UI refinement implementation plan

> For agentic workers: use `superpowers:executing-plans` or, when explicitly
> selected, `superpowers:subagent-driven-development` to execute task by task.
> This document is a planning deliverable; implementation has not started.

**Goal:** make the existing scaffold bolder, lighter, less crowded and better
typeset, with restrained, accessible motion.

**Architecture:** refine the existing React SPA and shared semantic styles.
Keep all 12 hash routes and the unknown-route fallback; split the current room
page module by page family so members can own independently reviewable surfaces.
No service-layer or backend work is included.

**Tech stack:** Vite, React 18, TypeScript, Tailwind CSS, local Inter, CSS motion,
existing Playwright checks.

**Spec:** [UI_REFINEMENT_BRIEF.md](../../design/UI_REFINEMENT_BRIEF.md), with
[UI_SCAFFOLD.md](../../design/UI_SCAFFOLD.md), `DESIGN.md` and repository invariants.

## Global constraints

- Preserve Cream `#F6F5F1`, White `#FFFFFF`, Ink `#1C201E`, Yellow `#FFD000`,
  Inter 400/600 and the existing semantic colors. Proposed hierarchy/surface
  changes go through Figma review before implementation.
- Preserve the SPA stack, 12 route paths, labels identifying previews, local-only
  settings, disabled service/media actions, history navigation and focus behavior.
- No backend/auth/media/AI features, no new motion library, no secrets, no
  machine-specific paths, no new unfinished product screens.
- Update the relevant architecture/proposal sections before product-code changes;
  this remains scoped UI refinement, not completion of Build 1 or a roadmap change.
- Each package includes working page interactions, responsive treatment and
  evidence. Nobody delivers only isolated CSS or only an unintegrated animation.

## Equal allocation

Nguyễn Bảo Minh Triết — **24125047**, **Frontend & WebRTC/Audio Lead** — is the
requester and is excluded from all implementation, testing, review and integration
assignments below. No review or coordination workload is silently assigned to him.
Task ownership here supplements, and does not rename, official team roles.

| Owner | Official team role | Work package | Points |
| --- | --- | --- | ---: |
| **Trần Lê Anh Tuấn — 24125107** | **AI Orchestrator & Analysis Lead** | Shared visual/type foundation and account pages | **10** |
| **Nguyễn Hồng Tấn Tài — 24125078** | **Backend & Real-Time Media Lead** | Navigation shell, room entry/invitation and recovery pages | **10** |
| **Nguyễn Anh Khoa — 24125058** | **AI Audio & Speech Pipeline Lead** | Setup/settings, lighter preview and purposeful motion | **10** |
| **Nguyễn Đình Thiên Lộc — 24125093** | **DevOps & QA / Fact-Checking Lead** | Lobby refinement and cross-screen accessibility/visual acceptance | **10** |
| **Total** | | **Four equal estimated shares** | **40** |

Points include design, implementation, testing, review and integration. Equal
points are a planning estimate, not proof of equal hours. Fewer screens compensate
for shared work or more complex interactions. Each owner includes 1 review point
and 1 integration/fix point. If discovery changes a package materially, move a
bounded task and its estimate together; do not put all shared cleanup on one person.

## File ownership and stable interfaces

| Owner | Primary edit boundary |
| --- | --- |
| Tuấn | `src/index.css` shared tokens/type/controls, `src/components/ui.tsx`, `src/pages/AccountPages.tsx`, optional `src/pages/account.css`, `tests/account-refinement.spec.ts` |
| Tài | `src/App.tsx`, `src/routes.ts`, new `src/components/PreviewTools.tsx`, new `src/pages/RoomEntryPages.tsx`, `src/pages/entry.css`, `tests/navigation-refinement.spec.ts` |
| Khoa | new `src/pages/RoomSetupPage.tsx`, `src/pages/setup.css`, `src/roomSettings.ts`, `tests/setup-refinement.spec.ts` |
| Lộc | new `src/pages/LobbyPage.tsx`, `src/pages/lobby.css`, `tests/scaffold.spec.ts`, `tests/lobby-refinement.spec.ts`, `playwright.config.ts`, capture/acceptance evidence |

All paths in this table are relative to `web/`. New page styles are imported by
their page module and scoped to that family. Shared token/primitive requests go
through Tuấn; nobody overrides the shared vocabulary in their page stylesheet.

Tài first extracts `RoomsPage`, `InvitationPage`, `ExpiredRoomPage`,
`CreateRoomPage` and `LobbyPage` into the listed files without behavior changes.
Keep `RoomPages.tsx` as a compatibility re-export during integration. Preserve
`CreateRoomPage({ editing, settings, onChange })`, `RoomSettings`,
`RoomsPage({ full? })`, `LobbyPage({ ready? })` and existing helper interfaces.
Tài transfers ownership of the extracted setup/lobby modules after this small
passing prerequisite; later edits are made only by their assigned owners.

Shared contracts: preserve `ActionLink` variants and `Field`/`Choices` labeling;
add semantic typography/motion tokens centrally. `PreviewTools` must retain
the accessible label **Preview screen** and every route option. Optional details
use native `details/summary` where suitable; otherwise a button with expanded
state and associated region. Do not replace them with a bespoke modal.

## UI-R01 — Tuấn: visual foundation and account flow (10 points)

Scope update, 2026-11-14: Tuấn explicitly waived Figma edits after reporting
that Triết said they were not required. The original Figma checklist item below
is superseded for UI-R01 only. The existing direction/frames remain unchanged;
implementation, browser evidence and peer review are still required. Current
delivery status and the navigation-baseline review are recorded in
[Tuấn's TODO](../../pa3/tuan/TODO.md) and its linked SCRUM-49 evidence record.

Breakdown: foundation/spec/Figma **2**, four account screens **4**, typography
and form validation **2**, peer review **1**, integration/fixes **1**.

- [ ] Revise representative sign-in/profile Figma frames and shared roles using
  the brief. Record proposed color usage, role-based rem type, spacing and
  default/hover/selected/focus/disabled treatment. Preserve baseline frames.
- [ ] Before implementation, update `SOFTWARE_ARCHITECTURE_SPEC.md` and
  `PROJECT_PROPOSAL.md` with the refinement boundary. After direction review,
  update approved `DESIGN.md` tokens and sidecar together if present; do not
  rewrite unrelated historical product decisions.
- [ ] Implement shared roles and consume them in sign-in, registration,
  account-created example and profile. Align password reveal with the field,
  improve group rhythm and reduce redundant explanatory framing without removing
  preview/saving limitations or CEFR self-assessment guidance.
- [ ] Validate all four routes at phone/desktop sizes; exercise password reveal,
  keyboard radios, 200% text sizing, long Vietnamese display names, cold-cache
  font loading and blocked-font fallback. Add a needed font subset only after
  verifying coverage; keep the existing two weights.
  Verify no password persistence and no service submission.
- [ ] Review Tài's navigation package; integrate feedback on this package.

**Done:** all four screens use the agreed type/control system, one clear primary
task, readable fields and visible focus. Local Inter weights are actually loaded,
fallback remains usable, and before/after captures demonstrate changed hierarchy.
No body text is made smaller to achieve visual lightness.

## UI-R02 — Tài: shell, entry and recovery flow (10 points)

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

## UI-R03 — Khoa: setup, light preview and motion (10 points)

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

## UI-R04 — Lộc: lobbies and shared acceptance (10 points)

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

## Sequence and review handoffs

| Stage | Parallel work | Exit condition |
| --- | --- | --- |
| 1. Design and boundaries | All four revise their Figma examples; Tuấn coordinates shared roles/spec text, Tài defines extraction | Representative desktop/mobile direction reviewed; scope/specs recorded |
| 2. Prerequisites | Tuấn lands shared roles consumed by account screens; Tài lands passing extraction | Stable helpers, token vocabulary and independent file boundaries |
| 3. Page slices | All four implement their assigned surfaces, behavior and focused checks | Each package produces a usable preview and its own evidence |
| 4. Peer review | Tuấn → Tài → Khoa → Lộc → Tuấn | Findings addressed by the owning member within their package |
| 5. Integration | Tài coordinates code integration; Lộc runs shared acceptance; every owner fixes their slice | Build/lint/tests and visual acceptance recorded; approved docs match implementation |

No calendar deadline is invented. Stages depend on completed contracts, not on
simultaneous edits to shared files. Use small feature branches/PRs and keep the
working branch passing. No merge, push, Jira assignment or publication is performed
by writing this plan.

## Verification contract

From `web/`, each implementation PR runs `npm run build`, `npm run lint` and
`npm run test:e2e`. Add meaningful behavior tests for new disclosures/motion;
use rendered checks for styling rather than tests that mirror CSS constants.

| Risk requiring explicit coverage | Owner / expected assertion |
| --- | --- |
| Changed hierarchy breaks long copy or zoom | Tuấn: labels/headings readable, no overlap; sizes respond to user scaling |
| Compact picker loses navigation or focus | Tài: closed/open keyboard behavior, all routes reachable, main focused after navigation |
| Animation races or reduced-motion regression | Khoa: immediate correct state under rapid updates, no delayed action or hidden content |
| Reordered mobile lobby confuses reading/focus | Lộc: meaningful reading sequence, usable code action and no duplicated accessible content |
| Refinement implies real backend/audio | Every owner; Lộc aggregates: disabled media, explicit sample status and zero application-service side effects |

Capture at 1440px and 390px for every page family; include 320px stress evidence
and at least one intermediate width. Compare with the reviewed Figma revision,
not the old baseline after approved design changes. Check control/focus/disabled,
error/recovery, disclosure and reduced-motion states. Batch visual fixes before
recapturing. Finish with an independent Impeccable visual review and a scoped
documentation pass. Preserve the intentional Inter exception if the detector
continues to flag popularity rather than a functional defect.

## Planning deliverable status

This plan assigns **10/40 points to each of the four members**, with Triết excluded.
The proposed refinement is ready for review. The initial planning handoff made no
UI implementation, Figma mutation, external task creation, team message, commit or
deployment. The subsequent user-requested TODO/Jira handoff is recorded below.

## TODO and Jira handoff — 2026-11-06

The user requested appending the assignments to each member's existing TODO and
creating Jira tasks. The four tasks below were created in the DebateSpeak `SCRUM`
project, assigned to the matching members and estimated at 10 points each.
They remain in the backlog, without a new due date or sprint assignment. Existing
PA3 tasks and deadlines are unchanged; Triết receives no additional assignment.
The UI-R labels above identify plan sections; the SCRUM keys are the task IDs.

| Plan section | Owner | Member TODO | Jira task |
| --- | --- | --- | --- |
| UI-R01 | Trần Lê Anh Tuấn — 24125107 | [Tuấn TODO](../../pa3/tuan/TODO.md) | [SCRUM-49](https://ndtloc0304.atlassian.net/browse/SCRUM-49) |
| UI-R02 | Nguyễn Hồng Tấn Tài — 24125078 | [Tài TODO](../../pa3/tai/TODO.md) | [SCRUM-50](https://ndtloc0304.atlassian.net/browse/SCRUM-50) |
| UI-R03 | Nguyễn Anh Khoa — 24125058 | [Khoa TODO](../../pa3/khoa/TODO.md) | [SCRUM-51](https://ndtloc0304.atlassian.net/browse/SCRUM-51) |
| UI-R04 | Nguyễn Đình Thiên Lộc — 24125093 | [Lộc TODO](../../pa3/loc/TODO.md) | [SCRUM-52](https://ndtloc0304.atlassian.net/browse/SCRUM-52) |

The tickets include scope, checklists, acceptance criteria, prerequisites, file
ownership and reviewer identities. Shared prerequisites are described as steps,
not whole-task blocking links, to avoid artificial dependency cycles.
