# UI refinement brief — bolder, lighter, clearer

Date: 2026-11-06. Status: proposed for review; planning only. Mode: Operate.

## Request and boundaries

Improve styling, animation, visual confidence, lightness, spacing and typesetting
across the existing web scaffold. The requester confirmed they are Nguyễn Bảo Minh
Triết (24125047), Frontend & WebRTC/Audio Lead, and asked to be excluded from the
work allocation. The other four members receive equal estimated work in
[the implementation plan](../superpowers/plans/2026-11-06-ui-refinement.md).

The audience and user task remain those in `PRODUCT.md`: learners preparing for
spoken debate and navigating account/room setup. No narrower audience is assumed.
Success means a clear next action, readable information and less competition for
attention. These are design objectives, not demonstrated usability improvements.

Scope: all 12 existing preview routes and the unknown-route recovery screen.
Keep Vite + React + TypeScript + Tailwind, hash routing and existing local UI
behavior. Preserve example labels, disabled backend/media actions, consent
boundaries, browser history, focus handling and local-only settings.
No authentication, database, live rooms, microphone access, transcription, AI,
new product screens, decorative imagery or additional animation dependency.
This refinement does not count as a completed vertical product increment.

## Evidence and diagnosis

Sources: `DESIGN.md`, [the scaffold contract](UI_SCAFFOLD.md), current `web/src/`
and the same-session desktop/mobile captures under `.impeccable/review/`.
The captures match the inspected source and predate these proposed changes.

| Current evidence | Consequence | Proposed response |
| --- | --- | --- |
| `.room-preview` fills a large Ink rectangle and repeats the motion, settings and stance explanations | Secondary content competes with the setup action; the phone page becomes long | White/open preview with Ink type; compact shared explanations; optional details below the task |
| `h1` and `.headline` share 28px/600; participant names and section titles share 20px/600 | Several items carry similar emphasis | Distinguish page, section, participant, data and supporting roles |
| All text inherits 1.45 line height; headings use arbitrary word breaking | Adequate baseline, but wrapping and paragraph rhythm are not tuned to role | Role-based leading, balanced headings, deliberate measures and emergency wrapping |
| `.preview-tools` has a full-width divider, explanation and large selector on every page | Review navigation adds visual weight to a sparse task UI | Retain a visible preview notice; put the screen picker in an accessible disclosure |
| Setup/settings use repeated explanations and equally spaced text blocks | Related details can look like separate tasks | Group by meaning, retain labels and necessary warnings, collapse optional detail |
| Source has no authored motion or reduced-motion rules | No continuity language for the proposed disclosures and changed preview values | Small state transitions with a complete reduced-motion path |

This is visual/source diagnosis, not a user-research finding. Existing body and
control contrast should be preserved. The typography detector reports only its
generic Inter warning; Inter is an explicit brand choice and stays.

## Approach

| Approach | Tradeoff |
| --- | --- |
| Spacing and color polish only | Lowest change risk, but leaves the large preview and repeated information competing |
| **Focused refinement within the current identity — recommended** | Revises hierarchy, secondary surfaces and disclosures while preserving tasks and palette |
| Full visual redesign | Requires new identity exploration and substantially more review; unnecessary for this scope |

The recommendation is a proposal, not a claim that new Figma frames or tokens
are already approved. Refine representative Figma frames first, audit them, then
implement the reviewed direction. Preserve the existing frames as the baseline.

## Proposed visual and interaction direction

**Bolder:** one dominant task heading and primary action per screen. Yellow stays
for the main action and selected controls; meaningful typography and alignment
carry confidence. Keep the exact existing Cream/White/Ink/Yellow palette.

**Lighter:** replace the large setup-preview Ink fill with White or the Cream
canvas; keep dark readable text. Use space before extra borders. Keep necessary
field boundaries, status text and focus outlines at readable contrast. Lightness
does not mean smaller text, pale controls or reduced contrast.

**Less crowded:** group topic/settings/action, summarize repeated shared context,
and provide a compact preview disclosure on phones. Keep the topic, current
settings, primary action, preview status and audio-unavailable explanation visible
without opening secondary detail. Audio controls remain disabled; never hide why.
Desktop can keep a secondary preview column; mobile uses one task-first column.
Keep the screen picker reachable through a labeled disclosure, with the current
screen and a short preview notice visible while closed. No modal is needed.

**Typesetting proposal:** retain locally bundled Inter 400/600. Use rem-based
semantic tokens; exact values below are starting specifications for Figma review.

| Role | Proposed size / weight / line height | Use |
| --- | --- | --- |
| Page title | 2rem desktop, 1.75rem narrow / 600 / 1.25 | One h1; task or lobby motion |
| Section title | 1.25rem / 600 / 1.35 | Major content groups |
| Preview motion | 1.25rem / 600 / 1.35 | Repeated motion stays subordinate; reuse the section role |
| Participant name | 1rem / 600 / 1.5 | Identity without competing with the motion |
| Body | 1rem / 400 / 1.55 | Explanations and stance information |
| Label/action | 0.875rem / 600 / 1.45 | Fields and controls |
| Supporting text | 0.875rem / 400 / 1.5 | Secondary context; never essential prose at smaller sizes |
| Invite code | 1.75rem / 600 / 1.3 | Readable, selectable data; normal tracking |

Use 45–65ch for longer prose where space permits, not as a forced minimum on
phones or compact fields. Balance headings and use progressive pretty wrapping
for prose. Preserve emergency wrapping for unbroken names/codes. Keep fonts visible
during loading and test the system-sans fallback. The scaffold currently imports
Latin-only assets: verify Vietnamese display names and add only the necessary
subset if coverage is incomplete. Check cold-cache and blocked-font behavior;
font availability and layout stability are not established by the static captures.
Keep essential action/safety explanations at body size when they carry the main
meaning, rather than treating every instruction as metadata. Use the existing spacing scale:
6–8px within fields, 12–16px within groups, 24–32px between groups, 40px between
desktop columns; do not enlarge every gap indiscriminately.

**Motion thesis:** the focal interaction is changing room settings and recognizing
the corresponding preview update. The content updates immediately; a brief emphasis
on only the changed row communicates the relationship. Surrounding layout stays
stable. Disclosure and control feedback support that interaction.

| Interaction | Budget | Reduced-motion behavior |
| --- | --- | --- |
| Hover/selected control feedback | 100–150ms color/border transition | Immediate or brief non-spatial color change |
| Preview row update | Up to 180ms, one bounded emphasis, no loop | Immediate text/state update; no pulse or movement |
| Optional preview / screen-picker disclosure | Up to 180ms child emphasis; layout may open immediately | Immediate open/close with clear expanded state |
| Copy-code feedback | Immediate message; at most 150ms visual emphasis | Immediate visible and announced result |
| Route change | Immediate content, title, scroll and focus | Same behavior; no entrance choreography |

No parallax, staggered page reveals, bouncing, perpetual pulses, autoplay sound,
blocking transitions or animation of focus rings. CSS is sufficient; no dependency
is proposed. Repeated toggles/navigation must interrupt cleanly. Reduced motion
preserves visible states and announcements.

## Page outcomes

| Page family | Intended result |
| --- | --- |
| Sign-in, registration, account example, profile | Clear field rhythm; password reveal adjacent to password; readable CEFR choices; compact secondary navigation |
| Room entry, invitation, full/expired examples | Primary join/setup or recovery path immediately apparent; necessary error guidance beside its related control |
| Setup and settings | Topic/settings lead; preview supports them; optional detail stops dominating the mobile page |
| Waiting and ready lobbies | Motion leads, people and stances remain easy to scan, code/action are grouped; sample membership and disabled audio remain explicit |
| Shared shell and unknown route | Consistent header, restrained preview tooling, obvious recovery and preserved navigation/focus |

Do not shorten factual content or safety statements without reviewing the proposed
copy in the Figma pass. No fabricated positive feedback or simulated live states.

## Acceptance and remaining decisions

- All routes remain reachable through direct URL, links and the disclosed picker.
- No horizontal scroll, clipped focus, overlapped text or trapped content at
  320, 390, 768, 1102 and 1440px. Check 200% zoom and 200% text-size stress.
- Primary task and action remain visible before optional detail at ordinary
  viewport sizes; at zoom/narrow extremes, scrolling is preferable to shrinking.
- Preserve 48px primary/secondary and 44px text-action targets. Ordinary text
  contrast target is at least 4.5:1; large text and necessary control boundaries
  at least 3:1. Record checks rather than claiming certification.
- Verify keyboard disclosure operation, native radios, skip link, history/focus,
  readable long names and motions, copy failure and reduced-motion operation.
- No service/media/storage side effects; no new animation package, timers that
  fake live activity, or continuously running animation work.
- Capture each page family before/after at desktop and phone sizes, including
  open/closed detail, selected, disabled, recovery and focus states.

The team still needs to review the proposed Figma revisions and type scale.
No delivery deadline or individual availability was supplied; workload points in
the plan are relative estimates, not promised hours or a sprint reschedule.
