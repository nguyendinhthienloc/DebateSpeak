# SCRUM-49 — account refinement evidence and navigation review
Performed: Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead — pending. Edited: Trần Lê Anh Tuấn (24125107).

Prepared 2026-11-14. Scope: shared presentation and the existing sign-in, registration, confirmed-registration sign-in and sample-profile routes. The user authorized finishing this package and its review handoff. This record supplies code-review and browser evidence; it is not human approval, a Jira transition or an end-to-end backend claim.

## 1. Scope decision and completed changes
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Lộc (24125093), pending. Edited: Trần Lê Anh Tuấn (24125107).

Tuấn reported that Triết does not require Figma edits and explicitly instructed the assistant to skip them. This supersedes the Figma-edit step for UI-R01/SCRUM-49 only. The Cream & Yellow identity and existing Figma frames remain unchanged. No approval from Triết or Lộc is fabricated.

- Account headings use a 2rem desktop / 1.75rem narrow role, and the task column grows from 368px to 432px at desktop widths. Related fields and separate groups use consistent spacing.
- The named Show/Hide password control sits beside the input in one bordered group. Its touch target, keyboard focus, password value and autocomplete behavior are preserved.
- Registration separates credentials from the learning-profile group. Native CEFR radios show a check and explicit Selected text; self-assessment guidance remains visible.
- The sample-profile limitation appears before editing. Save stays disabled with its explanation beside the action; no account-saving API is invented.
- Local Unicode-scoped Vietnamese Inter 400/600 subsets supplement the original Latin fonts. Body text is not made smaller; fallback fonts remain usable.
- Real auth response validation, memory-only session behavior, all routes, room/media limits and existing error handling are preserved.

Architecture/proposal contracts were updated before product code. Files are limited to the shared controls/styles, account-page family, tests and supporting documentation; no room backend or media behavior is added.

## 2. Before/after captures
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Lộc (24125093), pending. Edited: Trần Lê Anh Tuấn (24125107).

The baseline was captured before editing at `cbf3ba0`. The later `5ca2cd6` pa3 update did not change `web/`, so the browser baseline still matches the current upstream UI. Images use the same 1440×1000 desktop and 390×844 phone viewports, with full-page capture. Files below are deliverable evidence rather than ignored build output.

| Screen | Desktop before | Desktop after | Phone before | Phone after |
|---|---|---|---|---|
| Sign in | [Before](before/sign-in-1440.png) | [After](after/sign-in-1440.png) | [Before](before/sign-in-390.png) | [After](after/sign-in-390.png) |
| Registration | [Before](before/register-1440.png) | [After](after/register-1440.png) | [Before](before/register-390.png) | [After](after/register-390.png) |
| Account-created route | [Before](before/account-created-1440.png) | [After](after/account-created-1440.png) | [Before](before/account-created-390.png) | [After](after/account-created-390.png) |
| Profile | [Before](before/profile-1440.png) | [After](after/profile-1440.png) | [Before](before/profile-390.png) | [After](after/profile-390.png) |

Opening account-created directly deliberately shows sign-in, without fabricated success. The existing intercepted-HTTP auth test separately verifies that a validated registration response shows Account created, preserves email and clears password. API requests are blocked during screenshot capture. No screenshot represents a real learner's account or grades.

## 3. Review of Tài's available navigation baseline
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Lộc (24125093), pending. Edited: Trần Lê Anh Tuấn (24125107).

Reviewed `web/src/App.tsx`, `web/src/routes.ts` and the room-entry/invitation/recovery exports against UI-R02's stable interfaces. No separately submitted completed UI-R02 refinement package is present in the inspected baseline; this review does not claim that future work was inspected.

| Area | Finding and evidence |
|---|---|
| Route contract | All 12 route values are retained; the labelled Preview screen selector remains reachable. Direct URLs, reload and unknown-route recovery are covered by existing scaffold tests. |
| Keyboard and history | Skip to content focuses main without changing the route. Account/room navigation, back/forward, document titles and recovery return to the correct screen; the new integration test exercises this. |
| Boundaries | Room-entry/full/expired/invitation views identify sample data and do not submit codes or request media. Existing no-service room tests remain applicable. |
| UI-R02 follow-up | The preview selector is still fully visible in App.tsx; the compact disclosure requested by UI-R02 is not implemented. It remains Tài's package scope and is not presented as completed by SCRUM-49. |

No navigation defect requiring an account-package change was found in these inspected paths. Browser evidence is not a human peer-review signature; Lộc's review and any resulting integration fixes remain pending.

## 4. Validation and reproduction
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Lộc (24125093), pending. Edited: Trần Lê Anh Tuấn (24125107).

Run from `web/`:

```sh
npm ci
npm run build
npm run lint
npm run test:e2e
```

The standard Playwright configuration expects its Chromium browser. For this machine, validation used installed Chrome with the same tests through a local runner config. Browser tests intercept auth HTTP and do not contact a real account service. Results on 2026-11-14: build passed, lint passed, and all 79 browser tests passed (the existing 73 plus six account/navigation checks). The committed capture script also ran successfully with API requests blocked and produced all eight after images.

Account checks cover adjacent keyboard-operated password reveal, non-color CEFR feedback, all four routes at 320/390/640/768/1102/1440 CSS pixels with 200% text enlargement, long Vietnamese names, local 400/600 glyph loads, blocked-font fallback and reduced motion. The 640px case exercises the reflow width equivalent of a 1280px viewport at 200% browser zoom; this is a layout proxy, not a claim of physical-device certification.

With the local Vite server running, reproduce after images using Playwright Chromium:

```sh
node scripts/capture-account-review.mjs
```

Or use an installed Chrome:

```sh
node scripts/capture-account-review.mjs --channel chrome
```

The script writes to ignored `report_build/scrum49-capture`, uses local font assets and blocks API requests. Preserve the supplied before captures; they are the pre-change baseline. Human visual review, any requested revisions and merge remain pending.
