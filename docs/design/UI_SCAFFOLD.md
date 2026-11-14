# Frontend page routes and layout scaffold

Date: 2026-11-06. Mode: Operate. Scope confirmed by the user: page routes and
layout scaffold only. Visual authority: `DESIGN.md` and the selected Figma
file `atfafBv5VA3RxNrfHrn1gl`; screen IDs are recorded in `BUILD1_FIGMA_FLOW.md`.

## Implementation contract

- Preserve Cream & Yellow, Inter 400/600, 28/20/16/14px type, 48px controls,
  44px text actions, 32px desktop and 24px mobile gutters.
- Reuse a header, field, choice group, action link, status note and room preview.
- Provide hash routes for sign-in, registration, account-created example, rooms,
  create room, settings, profile, invitation, waiting/ready lobby, full/expired
  room and an unknown-route recovery screen. A preview screen selector exposes
  the route inventory without inventing product navigation.
- Preserve desktop columns and mobile stacking; waiting lobbies put the invitation
  first on mobile. Use normal document scrolling and support 320px widths.
- Navigation works through anchors, direct links, reload, back and forward; update
  page title and focus the main region after route changes. Include a skip link.
- Label the whole scaffold and any sample outcomes clearly. Primary actions that
  navigate through sample outcomes explicitly say Preview. No backend or media
  integration, credential storage, fake asynchronous processing or real room state.
- Local field selection and password visibility are UI-only. Settings preview
  can retain selections in memory; reloading resets them. Audio controls remain
  disabled and explained. No additional service configuration is required.

## Implementation sequence

1. Update architecture and proposal scope before implementation (done).
2. Add shared design tokens/controls and the small typed hash-route registry.
3. Implement the required page families and preview navigation from current code, DESIGN.md and feature specs. Figma updates occur only on explicit user request.
4. Run TypeScript/Vite build, lint, browser navigation and responsive checks.
5. Inspect desktop/mobile browser renders against DESIGN.md; run the Impeccable detector and
   independent finish review, then document verified results and limitations.

Hash routing is chosen to keep this static preview deployable without server
configuration or a new routing dependency. Product API routing remains deferred.
The existing feature branch provides isolation; no commit or publication is part
of this request. Preserve unrelated local design work and ignore-file changes.

## Verification focus

Direct links and history navigation; unknown routes; keyboard/focus behavior;
narrow screens and long text; no network/media side effects from preview actions.
These checks verify the scaffold only, not Build 1 service acceptance criteria.

## Implemented surface and fidelity adaptations

The scaffold implements 12 typed hash routes plus an unknown-route recovery
screen. The complete route inventory and run commands are in
[the web README](../../web/README.md). Shared controls and page families retain
the incumbent palette, locally bundled Inter 400/600, type hierarchy and
auth/room corner treatments. This is an extension of the selected Figma system;
`DESIGN.md`, `PRODUCT.md` and `.impeccable/design.json` were preserved.

- The shell caps its width at 1102px, including 32px desktop gutters. Create Room
  retains the 510:488 column ratio and 40px gap. At 760px and below, layouts
  stack with 24px gutters; below 360px the brand uses 18px type and audio actions
  stack. These are scaffold implementation choices, not newly approved global
  design tokens.
- Controls use minimum heights of 48px, or 44px for text actions, so wrapped text
  can grow. Focus uses a 3px Ink outline with a 4px offset. The incumbent sidecar
  examples use a 2px offset; this scoped adaptation is recorded here without
  rewriting the global system.
- Preview action labels and explicit example text distinguish navigation from
  account creation, sign-in, invitation validation and room membership. The
  footer screen selector exposes the preview inventory. It is not product
  navigation for a connected application.
- Save and media controls are disabled with explanations. The READY lobby
  preserves Figma's code-adjacent **Test microphone** control as disabled; the
  waiting lobby retains **Copy code**, which copies only its synthetic example
  and reports success or an unavailable-clipboard fallback.
- Settings update the local preview in memory and reset on reload. Waiting and
  READY are fixed examples and do not reflect those settings or real membership.
  The proposed audio overlays and the full Figma state inventory are outside this
  page-layout scaffold.

## Verification evidence (2026-11-06)

The implementation run reported successful `npm run build`, `npm run lint` and
all four Playwright tests. The test source is
[`web/tests/scaffold.spec.ts`](../../web/tests/scaffold.spec.ts):

- Direct navigation, reload, browser history, unknown-route recovery, page title
  and main-region focus.
- All 12 routes checked for horizontal overflow and a single main heading at
  320, 390, 1102 and 1440px viewport widths.
- Password visibility, native radio keyboard selection, long profile input,
  local settings retention across routes and reset on reload.
- Disabled media controls and no fetch/XHR/WebSocket calls, cookies or browser
  storage during the exercised preview flow. Source inspection also found no
  service or media integration.

Local review artifacts under `.impeccable/review/` include 24 desktop/mobile
route captures, a 1102px Create Room capture, a focus capture,
`capture-report.json`, `finish-review.md` and `documentation-review.md`.
The capture report records no failures or horizontal overflow and confirms
Inter loaded for all 24 route captures. The independent visual review inspected
the supplied captures and Figma references; its READY-action finding was fixed
and the two affected views recaptured. Its final verdict accepts that correction.
The detector's Inter warning was retained deliberately because Inter is the
selected Figma typeface.

These results establish preview navigation and sampled Chromium rendering.
They do not establish pixel-perfect parity, the full Figma state set,
cross-browser/device coverage, accessibility certification, real clipboard
behavior on every browser, or Build 1 auth/room/media acceptance. The documenter
checked source and recorded artifacts; it did not independently rerun the test
suite or Figma retrieval.

## Existing context drift left unchanged

The incumbent global context still describes a deferred frontend and an earlier
introductory screen; the sidecar records `frontendImplemented: false`, no CSS
breakpoints and historical Figma-only verification. Those records predate this
scoped implementation. The selected visual identity remains valid, while this
document and the web README describe the current scaffold. No global context
refresh or new design-system approval was included in this task.

Current authority (2026-11-14): frontend implementation is independent of both historical Figma links; browser evidence and repository specs govern acceptance.
