---
name: DebateSpeak AI — Cream & Yellow
description: Cream ground, Ink structure and committed Yellow for spoken-debate practice; every feature surface stands at least 3:1 off its ground.
colors:
  primary: "#FFD000"
  primary-hover: "#E6B900"
  background: "#F6F5F1"
  surface: "#FFFFFF"
  ink: "#1C201E"
  muted: "#454B46"
  border: "#7A817A"
  line: "rgb(28 32 30 / .28)"
  link: "#665000"
  success: "#16623D"
  warning: "#815000"
  error: "#A82344"
  disabled: "#DEDFDA"
  contrast-surface: "#1C201E"
  on-ink: "#FFFFFF"
  focus-on-contrast: "#FFD000"
  stage-floor: "#2A2F2C"
  stage-edge: "#3B413D"
  floor-cream: "#E8E5DC"
typography:
  display:
    fontFamily: "Archivo Variable"
    fontSize: "clamp(2.25rem, 1.75rem + 2vw, 3rem)"
    fontWeight: 800
    fontStretch: "87.5%"
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  act-display:
    fontFamily: "Archivo Variable"
    fontSize: "clamp(2.25rem, 1rem + 3vw, 4rem)"
    fontWeight: 800
    fontStretch: "87.5%"
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Inter"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  account-page-title:
    fontFamily: "Archivo Variable"
    fontSize: "{typography.display.fontSize}"
    fontWeight: 800
    lineHeight: 1.05
  headline:
    fontFamily: "Archivo Variable"
    fontSize: "1.75rem"
    fontWeight: 800
    fontStretch: "87.5%"
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo Variable"
    fontSize: "1.25rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1.3
    letterSpacing: "0em"
  name:
    fontFamily: "Archivo Variable"
    fontSize: "1.125rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1.3
  medium:
    fontFamily: "Inter"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  small:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0em"
motion:
  ease-out: "cubic-bezier(.22, 1, .36, 1)"
  ease-spring: "cubic-bezier(.34, 1.3, .64, 1)"
  duration-fast: "120ms"
  duration-base: "200ms"
  duration-slow: "320ms"
  stagger: "60ms"
  reduced-motion: "no animation, no transition, no scroll snap"
rounded:
  control: "8px"
  nameplate: "12px"
  surface: "16px"
  pill: "999px"
spacing:
  tight: "4px"
  related: "8px"
  control: "12px"
  standard: "16px"
  group: "20px"
  mobile-gutter: "24px"
  gutter: "clamp(24px, 4vw, 64px)"
  section: "48px"
  content-max: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
  button-disabled:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
  text-action:
    textColor: "{colors.link}"
    typography: "{typography.label}"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: "48px"
  room-button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
  room-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: "48px"
  app-header:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    height: "72px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "clamp(24px, 2.5vw, 36px)"
  topic-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.medium}"
    rounded: "{rounded.surface}"
    padding: "16px 18px"
  topics-pane:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.surface}"
    padding: "clamp(1.25rem, 2vw, 1.75rem)"
  door-create:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "clamp(1.5rem, 2.5vw, 2.25rem)"
  door-join:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "clamp(1.5rem, 2.5vw, 2.25rem)"
  nameplate:
    backgroundColor: "{colors.on-ink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.nameplate}"
    padding: "12px 16px"
---

# Design System: DebateSpeak AI

## Current implementation authority (2026-11-14)

Frontend work is independent of Figma. The current visual authority is this
file, `web/src/index.css`, `web/src/pages/account.css`, shared components and
rendered browser checks. Keep Cream & Yellow, Inter, responsive layouts and
accessible controls. Figma updates require an explicit user request; neither
Foundations nor Build 1 flow is a dependency, approval gate or sync requirement.
The older Figma details below are historical design research, not current
implementation instructions. For account APIs use `docs/api/fg01-auth-contract.md`.
Recovery pages reuse account geometry and expose Change password after email
verification and from Profile. That action requests a separate password-reset
code; verification alone never grants password-change authorization.

## SCRUM-61 room flow — November 19, 2026

Supersedes older room, header and Preview badge notes below where they conflict.
The sample room routes become one room page at `#/rooms/:id`; the invite link is
`#/join/:code`. Palette, type, radius and shadow tokens are unchanged. Details:
`docs/superpowers/specs/2026-11-19-room-flow-design.md`. Performer and peer
review are to be recorded by the branch owner; no approval is claimed here.

- **Two header styles.** The **App bar** is the Ink bar with brand and navigation
  for signed-in app pages. The **Stage bar** carries the brand and at most one
  action, for the welcome page, the auth stage, the live debate and its wrap-up.
  During a debate the brand is plain text, not a link. The Preview badge is removed.
- **Room stage exception.** The live debate (`LIVE`) and its wrap-up (`ENDED`) stand
  on a full-screen Ink stage with a `stage-floor` band, like the auth stage.
  Create, invite, join and consent stay on Cream.
- **Invite code.** Display type in two groups of four (`K7Q2 M9XA`) on a Yellow
  panel with an Ink edge; Copy invite link is the primary action.
- **Side tags.** Pills that always carry the words "For" (Yellow, Ink text) or
  "Against" (Ink, White text). Side never depends on colour alone.
- **Mic meter.** Ink segments on White with an Ink edge, plus a text status such
  as "We can hear you".
- **Spotlight.** The current speaker's name in display type at the largest size
  on the stage, in Yellow, with the side tag and "You" for the learner. The
  partner keeps a White chip with name, side and state. A typed turn shows the
  writer's name with the text under it.
- **Debate clock.** A slim bar across the top of the stage showing time left,
  with exact digits at its end. It never flashes or changes colour.
- **Type panel.** Opened by a quiet text action. A side panel from 760px, a bottom
  sheet below it; White with an Ink edge on the stage.
- **Audio settings.** A 44px gear in the dock opens a White panel: a pop-up above the
  dock from 760px, a bottom sheet below it, with the dark-stage drop. It holds the
  microphone and speaker pickers, the mic meter, a Mute microphone toggle that mirrors
  the dock's Mute, and the partner's volume slider: Ink
  fill on an Ink 18% track, a Yellow thumb with a 2px Ink edge, Ink focus ring.
- **No-microphone notice.** A White notice with an Ink edge, fixed near the top, not a
  dialog: "No microphone found", with Type instead (primary) and Dismiss.
- **No pressure.** Consent screens show no countdown and no "your partner is
  waiting" wording; the partner's progress is one plain line.

## SCRUM-53 auth stage — November 17, 2026

Supersedes the sign-in layout and account-note notes below where they conflict.
Sign in, register, account created and recovery now stand on a full-screen Ink
stage with no app header or dev bar: one White form plate on a Yellow lectern
that carries the live name and level, over a floor band. Register runs in three
steps whose headings ask the step's question; the optional level adds an
"I'm not sure" quick guide. The Ink motion aside beside sign-in is removed.
Account notes use a full 1px Success/Error edge (8px radius) instead of a 3px
inline-start rule. Palette, type and radius tokens are unchanged. Details:
`specs/005-auth-stage/spec.md`; direction:
`.impeccable/surfaces/web-src-pages-accountpages-tsx.md`. Performer and peer
review are to be recorded by the branch owner; no approval is claimed here.

## SCRUM-53 contrast pass and welcome page — November 17, 2026

Supersedes the flat, one-accent and grey-disabled rules in older notes below
wherever they conflict. Requested by the user because features "didn't stand
out of the background". Diagnosis: text contrast was fine (Ink on Cream
15.1:1); surface contrast was not (White on Cream 1.09:1, Yellow on Cream
1.35:1, old disabled fill 1.23:1). The build now applies a 3:1 floor to every
feature surface, lets Ink and Yellow own whole regions, adds one raised shadow,
draws disabled controls with a dashed boundary, darkens Muted and dividers, and
adds the `#/welcome` stage. Palette, type, radius and motion durations are
unchanged. Details: `specs/004-welcome-contrast/spec.md`; welcome direction:
`.impeccable/surfaces/web-src-pages-welcomepage-tsx.md`. Performer and peer
review are to be recorded by the branch owner; no approval is claimed here.

## SCRUM-53 wide-screen and density pass — November 17, 2026

Supersedes older width, radius and motion notes below where they conflict. The
header bar spans the window; content grows to 1440px inside a
`clamp(24px, 4vw, 64px)` gutter, and wide screens gain a second column rather
than longer lines (70 characters at most). Corners: 8px controls and fields,
16px surfaces, pill badges. One "Preview" badge in the header replaces
per-screen sample notes; the lobby carries the only consent line. Supporting
text: two lines per screen at most. Details: `specs/003-ui-refresh/spec.md`.

## SCRUM-49 local account refinement — November 14, 2026
Performed: Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead — pending. Edited: Trần Lê Anh Tuấn (24125107).

The user requested implementation and a local before/after preview against the selected Cream & Yellow direction and the current sign-in screenshot. Account pages use the scoped account-page-title role (2rem, 600, 1.25; 1.75rem narrow), a 27rem task column, 1.25rem related-field rhythm and 1.5rem group separation. Labels/supporting text retain 0.875rem; essential body text remains 1rem. Existing room-specific type and geometry remain separate. The CSS semantic variables are the implementation reference; no design sidecar exists in this checkout.

Place the named password visibility control in the same bordered field group, preserving a 44px target, visible focus, value and autocomplete. Account CEFR choices retain native radio semantics and add a visible check and Selected text. The sample-profile notice precedes editing; saving stays disabled with an adjacent explanation. Registration success appears only after the existing validated API response. Add only the local Vietnamese 400/600 subset under its Unicode range, retaining Latin 400/600 and a usable system fallback. No decorative palette, imagery, shadows or additional font weight is introduced. *(Historical: the "no shadows" and "no decorative palette" limits were superseded by the November 17 contrast pass above.)*

Tuấn explicitly waived new Figma edits after reporting that Triết said they were not required. Existing Figma frames remain unchanged. The implementation and attached browser evidence are prepared for peer review; no teammate approval is claimed.

## Overview

**Creative North Star: "Cream & Yellow"**

A readable, confident interface for a socially demanding activity. Cream is the ground; Ink carries language, structure and whole regions (the header bar, the Home topics column, the welcome stage); Signal Yellow marks deliberate actions and may own a region when that region is itself the action. Features stand off the page: every card, panel, seat and pane has an Ink edge or a fill that clears 3:1 against its ground, and surfaces you can act on lift on a soft raised shadow. Confidence comes from clear controls, readable states and specific guidance rather than decoration or promises of improvement.

Historical reference only: the original visual exploration used [Foundations — Cream & Yellow](https://www.figma.com/design/atfafBv5VA3RxNrfHrn1gl?node-id=26-5) and the [complete Build 1 flow](https://www.figma.com/design/atfafBv5VA3RxNrfHrn1gl?node-id=34-18), with the `DebateSpeak / Cream & Yellow` colour collection and its single `Default` mode. The canvas contains 68 desktop/mobile screens, including two focus specimens, plus 24 proposed local-audio overlay states. The proposed checks are documented in [the Create Room concept](docs/design/CREATE_ROOM_PREVIEW_AUDIO_CONCEPT.md); they do not change the Build 1 media contract. Product behavior remains governed by [PRODUCT.md](PRODUCT.md), [the UX brief](docs/pa2/BUILD1_UX_BRIEF.md) and [Gate G1](docs/architecture/G1_SPEC_BUILD1.md).

**Key Characteristics:**

- Cream ground, Ink structure, one saturated brand hue; no companion accents.
- Every feature surface clears 3:1 against its ground (1.5px Ink edge or a committed fill).
- Ink and Yellow may own whole regions; pastel tints may not.
- One raised shadow for surfaces you can act on.
- Calm, direct English copy that preserves learner dignity.

## Colors

One brand hue (Signal Yellow), one structural dark (Ink) and a warm Cream ground, used at full commitment rather than softened.

### Primary

- **Signal Yellow** (`primary`): actions, selection, the current-page bar in the header, the Create a room door, the welcome's Yellow act field, the lit podium and the chosen side. Ink text on it, always.
- **Deep Yellow** (`primary-hover`): hover state, and the floor band of the welcome's Yellow act. Never a second decorative palette.

### Neutral

- **Cream** (`background`): the page canvas and the welcome's Cream act fields.
- **White** (`surface`): fields, cards, panels, seats and name plates. On Cream, White alone is 1.09:1, so a White surface always carries the 1.5px Ink edge.
- **Ink** (`ink`, alias `contrast-surface`): text, edges, focus outlines, and committed regions: the app header bar, Home's topics pane, the Create button inside the Yellow door, the welcome stage and the auth stage.
- **On-Ink White** (`on-ink`): text on Ink regions. Softened supporting text on Ink uses White at 84% (11.9:1) or 70% (8.6:1).
- **Muted Slate** (`muted`): supporting text; 8.2:1 on Cream, 8.9:1 on White, 6.1:1 on Yellow. Not for text on Ink.
- **Border Grey** (`border`): field and secondary-control outlines outside room controls (3.7:1 on Cream, 4.0:1 on White), and the dashed disabled boundary.
- **Divider** (`line`, Ink at 28%): separators between rows and groups (1.8:1 on Cream). A divider separates content; it never stands in for a feature surface's boundary.
- **Stone** (`disabled`): the unfilled step-bar track only. Controls no longer use a grey disabled fill.
- **Stage Floor / Stage Edge** (`stage-floor`, `stage-edge`) and **Cream Floor** (`floor-cream`): floor bands only: the welcome page's, and `stage-floor`/`stage-edge` under the auth stage; see Components.

### Semantic roles

Success, Warning and Error are text/status roles with explicit wording; account notes carry a full 1px Success or Error edge with an 8px radius. Informational secondary actions use Ochre (`link`). A learner must be able to distinguish states without identifying a hue.

### Named Rules

**The Contrast Floor Rule.** Every feature surface (panel, card, seat, topic, pane, door, note) has a boundary of at least 3:1 against its ground: a 1.5px Ink edge, or a fill that is itself 3:1 (Ink on Cream, Yellow on Ink, White on Ink). Test: sample the surface's outer pixel against the ground behind it.

**The Committed Colour Rule.** Yellow and Ink may own whole regions when the region has one job: the header is an Ink bar, Home's topics column is an Ink field, the Create door is Yellow because the door is the action. A Yellow region on Cream still carries the Ink edge (Yellow on Cream is 1.35:1). Yellow is never scattered as decorative strips.

**The Ink on Yellow Rule.** Text on Yellow is Ink (11.20:1); white text on Yellow is prohibited. The Yellow fill alone does not establish a control boundary on Cream.

**The No Pastel Rule.** Committed Ink and Yellow regions are allowed; tinting sections in pale pastels or extra hues is not.

Recorded opaque-pair checks: Ink on Cream 15.10:1, Muted on Cream 8.20:1, White on Ink 16.47:1, Yellow on Ink 11.20:1, Border on Cream 3.67:1. These are colour checks, not full accessibility conformance.

## Typography

**Display Font:** Archivo Variable at 800, semi-condensed (87.5% stretch), self-hosted with Latin and Vietnamese subsets.
**Body Font:** Inter 400 and 600, self-hosted with Latin and Vietnamese subsets; system sans fallback.

**Character:** a compact, assertive display face for motions, codes and headings against a plain, highly legible text face for everything a learner must read.

### Hierarchy

- **Display**: page titles, room motions, invite codes. Balanced wrapping.
- **Act display**: welcome act headings only (and up to 6rem on the closing act).
- **Headline**: `.headline` task headings.
- **Title**: section headings (h2) and the brand at narrow widths.
- **Name**: participant names.
- **Medium**: topic-card motions and emphasised one-liners.
- **Lead**: intro text under a page title, in Muted. The earlier 300 weight read washed out and is not used.
- **Body / Small / Label**: body text, helper text, labels and buttons. Supporting text stays 14px.

Headings explain the task. Long names, email addresses and motions wrap rather than losing meaning. A fallback face is not evidence of a font match. No display serif, decorative uppercase or monospace identity is established.

## Layout

The header bar spans the window; content grows to 1440px (`content-max`) inside the `gutter`. Wide screens gain a second column rather than longer lines: Home places the two doors and history on the left with the Ink topics pane on the right (one column under 1200px, doors stack under 900px); Profile places the form beside a raised links pane above 960px, the pair centred in the content column; Create Room uses a flexible setup column beside a 20–28rem preview. Under 760px, action bars stick to the bottom of the viewport above a Divider rule.

The welcome page (`#/welcome`) is the exception to the content column: six full-height acts (`min-height: 100svh`) with content held to `content-max` by padding, and the act rail fixed at the right edge (hidden under 760px).

The auth stage (sign in, register, account created, recovery) also leaves the content column: a full-height (`100svh`) Ink stage with its own top bar, one centred plate up to 36rem wide, and spare height split between the space above the plate and the floor so the podium sits low on tall screens. On short viewports (860px tall or less, such as 1920 × 1080 at 125% scaling, about 730px), the top padding, plate padding, form gaps, lectern and floor tighten so every register step fits without a page scroll. See Components.

Historical Figma geometry (510px/488px Create Room columns, 1102px and 390px reference frames, 32px desktop gutters, 368px sign-in column) is superseded by the values above and kept only as research context. Mobile references used a 390 × 844 viewport with one page scroll area; reflow at 320px remains a required check.

**The Topic First Rule.** In room views, the motion is the main heading. A compact membership status supports it; do not repeat the same state in a giant heading and a banner.

Room setup shows defaults first. **Change settings** opens the full form; **Use these settings** returns to the summary before creation. Mobile waiting screens place the invitation first; READY screens put participants first. Visitor mode and screen-specific routes belong in the surface brief, not in global design tokens.

## Motion

Motion confirms what changed; it never decorates. Pages fade and rise 8px on entry (320ms, `ease-out`), register steps slide in the direction of travel, selected-choice checks pop in, status notes reveal downward, and list rows, doors and topic cards stagger 60ms apart. Press, hover lift and selection use `ease-spring` (slight overshoot, no bounce back): actions press to 97%, topic cards lift 3px. Nothing shakes and nothing exceeds 320ms, except the two loops: the open-seat waiting pulse (1.6s opacity) and the welcome Act 3 waveform, which runs only while that act is on screen. Every animation starts from a visible end state. Under `prefers-reduced-motion: reduce`, all animation and transition is off, hover transforms are removed, and the welcome page drops scroll snap.

## Elevation & Depth

A hybrid: edges carry structure, one raised shadow marks what you can act on. The shadow is soft, offset downward and Ink-tinted, never a glow or a hard offset block. Ink regions sit flat on Cream; their contrast is the separation. Keyboard-focus outlines are functional state feedback and must remain unclipped.

### Shadow Vocabulary

- **Raised** (`--raised`: `0 1px 2px rgb(28 32 30 / .14), 0 18px 36px -18px rgb(28 32 30 / .42)`): panels, seats, topic cards, doors, session rows, the preview card, the Profile links pane, welcome cards and name plates.
- **Raised hover** (`--raised-hover`: `0 2px 4px rgb(28 32 30 / .16), 0 26px 44px -18px rgb(28 32 30 / .5)`): hover on raised surfaces that are themselves the action (topic cards).

- **Dark-stage drop** (deep, black, negative spread; on the auth plate `0 2px 4px rgb(0 0 0 / .3), 0 40px 80px -30px rgb(0 0 0 / .8)`): surfaces that stand on an Ink stage or over the dimmed quick-guide backdrop (the welcome banner and track, the auth plate, the quick guide dialog), where the Ink-tinted Raised shadow would not read. Stage-only; never on Cream.

Open or placeholder states (open seat, the other side's empty note) drop the shadow and switch the edge to dashed.

### Named Rules

**The One Lift Rule.** One raised elevation and its hover. A surface either sits on the page or is raised; there is no third level, no glow and no hard offset shadow. The dark-stage drop is the sanctioned exception for surfaces on the welcome and auth stages; it is still soft and downward, never a glow or offset block.

## Shapes

One radius family: 8px for buttons, fields and choices; 16px for panels, cards, seats, doors and panes; pill for badges, tags and the act-rail label; 12px only for the welcome name plate. Feature surfaces use a 1.5px Ink edge (`--edge`); fields and controls keep a 1px boundary (Ink on primary actions and room controls, Border elsewhere). Placeholders use the same edge dashed. Participant rows keep 16px vertical padding and an 8px name-to-stance gap. Text actions keep 44px targets; primary and secondary controls are 48px high. Keyboard focus is a 3px outline at 4px offset: Ink on light grounds, Yellow on Ink.

## Components

### Buttons and text actions

Primary buttons pair Signal Yellow with Ink labels and a 1px Ink boundary; hover deepens to `primary-hover`. Inside the Yellow Create door the primary action inverts to White on Ink (hover turns its label Yellow) so it stands off the Yellow field. Secondary controls are White with a Border outline (Ink inside room controls); hover fills Cream. Text actions use Ochre with 44px targets; in the Ink header they use On-Ink White. Focus adds a 3px outside outline without moving layout. Loading keeps an action-specific label.

**Disabled is drawn, not greyed.** Transparent fill, 1.5px dashed Border boundary, Muted text, `not-allowed` cursor. No grey fill.

Do not let a label extend outside its control. Reserve one clear primary action for the current task; error recovery has a visible action when retry is available. While waiting for a partner, Copy code is primary and Back to rooms is secondary.

### Choice groups

CEFR, format and stance choices: unselected options are White with a 1px boundary that turns Ink on hover; the selected option is Yellow with an Ink boundary, a check that pops in and explicit Selected text. Keep options under a persistent label. Do not introduce an additional accent family.

### Fields

Persistent external labels, White fields, 1px boundary, readable supporting text and explicit field errors (Error boundary and text). Passwords support a named Show/Hide control inside the same bordered group. Placeholders use Muted and never act as the only label. The focus outline stays visible outside the field and its parent.

### Cards, panels and panes

- **Panels, seats, session rows, preview card:** White, 1.5px Ink edge, 16px radius, Raised shadow.
- **Topic cards:** the same, as whole-card buttons; hover lifts 3px onto Raised hover and nudges the Yellow arrow disc 4px right.
- **Doors (Home):** Create is Yellow with the Ink edge; Join is White with the Ink edge. Both Raised, display-scale headings.
- **Topics pane (Home):** an Ink field with On-Ink text and Yellow focus; its topic cards stay White.
- **Open seat:** dashed Ink edge, no fill, no shadow, a Yellow pulse dot.

### Navigation

The app header is a full-width Ink bar (72px min height). The brand is On-Ink White display type; links are On-Ink text actions; the current page is Yellow text with a 4px Yellow bar under the text only. The Preview badge is a Yellow-outlined pill. Under 560px the signed-in name is visually hidden and the bar wraps. Participant rows retain display name, A/B identity, a self label and a plain-language stance; membership is not a claim of online presence.

Back navigation does not become a Leave or Cancel action without the corresponding product contract. Prototype navigation must not imply real authentication, room synchronization or microphone processing.

### Welcome stage (`#/welcome`, Persuade surface)

A sanctioned exception for this one page, recorded so it is not mistaken for app-wide permission.

- **Act fields:** six snap-aligned acts alternate Ink stage, Cream, Ink, Yellow, Cream, Ink stage. Text on Ink is On-Ink White; on Cream and Yellow it is Ink.
- **Floor bands:** each staged act has a floor band across its lower 40% (34% on the opening stage, 26% on the close, about 30% under 760px) in a deeper shade of its own field, `floor-cream` on Cream, `primary-hover` on Yellow, `stage-floor` on Ink, topped by a 2px floor edge (Ink 22% / 28% on light fields, `stage-edge` on Ink). Floors are ground, not surfaces; they are exempt from the contrast floor.
- **Lectern and name plate:** a White name plate (12px radius, 2px edge, Archivo 800 side name) on a tapered lectern body. Unlit, the body is Muted; lit (the visitor's side), the body turns Yellow, the plate edge turns Yellow and a Yellow podium light rises behind it. On the opening act the lecterns are the try-it buttons (`aria-pressed`), lifting 4px on hover and pressing to 97%. FOR always stands left, AGAINST right.
- **Podium light:** a soft radial pool of Yellow (White on the Yellow act) behind the chosen side. This is the one place a gradient is allowed.
- **Cards on the stage:** seats, transcript lines and the feedback note use the app's card treatment (White, Ink edge, Raised). The quoted words in feedback sit on a Yellow 8px chip.
- **Honesty labels:** every staged act names its example data ("Example room", "Example feedback · not a real result"); unbuilt steps carry a "Coming in a later release" pill.
- **Act rail:** fixed dots (Ink with a White ring; current act Yellow, scaled 1.3, with its name in an Ink pill). Hidden under 760px.
- **Snap:** mandatory vertical snap; proximity under 760px wide or 640px tall; none under reduced motion.

### Auth stage (sign in, register, account created, recovery)

A second sanctioned exception, built from the welcome stage's materials, for these routes only.

- **Stage:** full-screen Ink, no app header and no dev bar. A Yellow podium light (radial) sits behind the plate.
- **Top bar:** brand in On-Ink display type linking to `#/welcome`; the Sign in / Create account switch as Yellow text actions after an On-Ink 84% prompt (prompt hidden under 560px). Focus on the stage is Yellow.
- **Plate:** the form is one White plate (up to 36rem, 2px Yellow edge, 16px radius, dark-stage drop). It enters with the page; the plate itself takes no focus outline.
- **Lectern:** a tapered Yellow body under the plate reaching the floor, carrying the live name in display type (two lines at most) and a Label detail: "Welcome back" on sign-in, `Welcome, <name>` with the level after registering, the typed name and chosen level while registering, "Account recovery" on recovery. Decorative and `aria-hidden`; it rises 1.5rem on entry, 80ms after the plate.
- **Floor band:** `stage-floor` with a 2px `stage-edge` top; ground, not a surface. Secondary routes (Preview rooms, Back to sign in) sit on it as a Yellow foot line.
- **Register:** three steps (Account, Your name, English level) whose headings are the step's question; the step bar and directional slide follow the account steps. The optional level keeps the four CEFR choices on one row inside the plate from 360px, then a dashed Ink "I'm not sure" entry (8px radius, solid on hover) to the quick guide.
- **Quick guide:** a modal dialog (White, 2px Ink edge, 16px radius, 40rem wide, dark-stage drop over an Ink 72% backdrop; full-screen without edge or radius under 560px). One statement per screen in display type, then Yes / Sometimes / Not yet answer cards (1.5px Border edge, Ink on hover, Yellow with Ink edge when selected), a progress bar and count, Back and Continue. The result shows the level as a Yellow display-type chip (Ink edge, Raised) with `Use <level>` (primary) and "Choose myself" (secondary).

### State patterns

Pair pending, success, unavailable and error states with concise wording. Keep valid non-sensitive input while explaining how to recover. Do not announce unchanged background refreshes. Missing consent, room capacity and service failures cannot be hidden by optimistic visual transitions.

### Proposed local device checks

The user selected a proposed local microphone/speaker check in Figma. Start/Play is explicit; no microphone request or playback happens on page load. Closing a check returns to the same underlying setup. The design covers permission waiting, a level meter (Ink active segments on White, with textual status), stop/release, permission/device/no-signal recovery, bounded speaker playback and learner-confirmed audibility. Local checks do not grant either participant's room-audio consent. Track release, playback, focus containment/restoration and physical-device behavior remain future implementation tests; the Figma examples perform no media operations.

## Do's and Don'ts

### Do:

- **Do** give every feature surface a 3:1 boundary against its ground: the 1.5px Ink edge on White or Yellow over Cream, or an Ink fill.
- **Do** let Ink or Yellow own a whole region when the region has one job (header bar, topics pane, Create door).
- **Do** raise surfaces you can act on with the one Raised shadow, and deepen it on hover only when the whole surface is the action.
- **Do** draw disabled controls with a dashed Border boundary and Muted text.
- **Do** use plain English, persistent labels and explicit recovery actions.
- **Do** keep focus visible (Ink on light, Yellow on Ink), targets comfortable and reading order stable across widths.
- **Do** retain the exact product boundaries around room membership and consent, and label example data as example.

### Don't:

- **Don't** place a White or Yellow surface on Cream without the Ink edge; a fill-only card on Cream is 1.09:1 or 1.35:1.
- **Don't** use a Divider rule as the only boundary of a feature surface.
- **Don't** bring back rejected companion accents, pastel panels or decorative metrics; gradients are limited to the podium light on the welcome and auth stages.
- **Don't** add a second elevation, a glow or a hard offset shadow.
- **Don't** grey out disabled controls with a fill.
- **Don't** use white text on yellow, clipped focus rings or colour-only status communication.
- **Don't** carry the welcome stage's alternating fields, floor bands or lecterns into app screens; the auth stage (sign in, register, account created, recovery) and the room stage (live debate and wrap-up) are the exceptions.
- **Don't** present a Figma prototype or the welcome's example screens as evidence of working authentication, audio, transcript or feedback.
