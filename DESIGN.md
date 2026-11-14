---
name: DebateSpeak AI — Cream & Yellow
description: Soft neutral surfaces, ink typography and decisive yellow actions for spoken-debate practice.
colors:
  primary: "#FFD000"
  primary-hover: "#E6B900"
  background: "#F6F5F1"
  surface: "#FFFFFF"
  ink: "#1C201E"
  muted: "#515751"
  border: "#7A817A"
  link: "#665000"
  success: "#16623D"
  warning: "#815000"
  error: "#A82344"
  disabled: "#DEDFDA"
  contrast-surface: "#1C201E"
  on-contrast: "#FFFFFF"
  focus-on-contrast: "#FFD000"
typography:
  account-page-title:
    fontFamily: "Inter"
    fontSize: "2rem desktop / 1.75rem narrow"
    fontWeight: 600
    lineHeight: 1.25
  headline:
    fontFamily: "Inter"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0em"
  title:
    fontFamily: "Inter"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0em"
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
rounded:
  control: "12px"
  room-control: "6px"
  room-field: "4px"
  room-surface: "0px"
spacing:
  tight: "4px"
  related: "8px"
  control: "12px"
  standard: "16px"
  group: "20px"
  mobile-gutter: "24px"
  desktop-gutter: "32px"
  section: "40px"
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
    backgroundColor: "{colors.disabled}"
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
    rounded: "{rounded.room-control}"
    height: "48px"
  room-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.room-field}"
    height: "48px"
---

# Design System: DebateSpeak AI

## Current implementation authority (2026-11-14)

Frontend work is independent of Figma. The current visual authority is this
file, `web/src/index.css`, `web/src/pages/account.css`, shared components and
rendered browser checks. Keep Cream & Yellow, Inter, responsive layouts and
accessible controls. Figma updates require an explicit user request; neither
Foundations nor Build 1 flow is a dependency, approval gate or sync requirement.
The older Figma details below are historical design research, not current
implementation instructions. For account APIs use `web/API_CONTRACT.md`.
Recovery pages reuse account geometry and expose Change password after email
verification and from Profile. That action requests a separate password-reset
code; verification alone never grants password-change authorization.

## SCRUM-49 local account refinement — November 14, 2026
Performed: Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead — pending. Edited: Trần Lê Anh Tuấn (24125107).

The user requested implementation and a local before/after preview against the selected Cream & Yellow direction and the current sign-in screenshot. Account pages use the scoped account-page-title role (2rem, 600, 1.25; 1.75rem narrow), a 27rem task column, 1.25rem related-field rhythm and 1.5rem group separation. Labels/supporting text retain 0.875rem; essential body text remains 1rem. Existing room-specific type and geometry remain separate. The CSS semantic variables are the implementation reference; no design sidecar exists in this checkout.

Place the named password visibility control in the same bordered field group, preserving a 44px target, visible focus, value and autocomplete. Account CEFR choices retain native radio semantics and add a visible check and Selected text. The sample-profile notice precedes editing; saving stays disabled with an adjacent explanation. Registration success appears only after the existing validated API response. Add only the local Vietnamese 400/600 subset under its Unicode range, retaining Latin 400/600 and a usable system fallback. No decorative palette, imagery, shadows or additional font weight is introduced.

Tuấn explicitly waived new Figma edits after reporting that Triết said they were not required. Existing Figma frames remain unchanged. The implementation and attached browser evidence are prepared for peer review; no teammate approval is claimed.

## Overview

**Creative North Star: "Cream & Yellow"**

A quiet, readable interface for a socially demanding activity. Cream grounds the experience; ink carries language and structure; saturated yellow identifies deliberate actions. Confidence comes from clear controls, readable states and specific guidance rather than decoration or promises of improvement.

Historical reference only: the original visual exploration used [Foundations — Cream & Yellow](https://www.figma.com/design/atfafBv5VA3RxNrfHrn1gl?node-id=26-5) and the [complete Build 1 flow](https://www.figma.com/design/atfafBv5VA3RxNrfHrn1gl?node-id=34-18), with the `DebateSpeak / Cream & Yellow` colour collection and its single `Default` mode. The canvas contains 68 desktop/mobile screens, including two focus specimens, plus 24 proposed local-audio overlay states. The proposed checks are documented in [the Create Room concept](docs/design/CREATE_ROOM_PREVIEW_AUDIO_CONCEPT.md); they do not change the Build 1 media contract. Product behavior remains governed by [PRODUCT.md](PRODUCT.md), [the UX brief](docs/pa2/BUILD1_UX_BRIEF.md) and [Gate G1](docs/architecture/G1_SPEC_BUILD1.md).

**Key Characteristics:**

- Soft neutral backgrounds with one saturated brand hue.
- Flat, task-led screens with explicit labels and restrained framing.
- Editable components and semantic colour bindings.
- Calm, direct English copy that preserves learner dignity.

## Colors

### Primary

Signal Yellow is the single action/accent family. Use its hover value for state feedback, not as a second decorative palette. Yellow controls use Ink text and an Ink boundary; white text on yellow is prohibited. The room flow now uses open topic/participant sections rather than large rounded yellow enclosures. Yellow concentrates on deliberate actions and selected settings. The Create Room preview uses Ink with White text; these are existing palette colours, recorded through semantic contrast aliases. The darker Ochre link role provides readable secondary actions on white or cream.

### Neutral

Cream is the page canvas. White belongs to fields and deliberately separated content surfaces. Ink carries primary text and focus outlines; Muted carries supporting explanations; Border defines fields and separators. Do not tint each section a different pastel.

### Semantic roles

Success, Warning and Error are text/status roles with explicit wording. Their surfaces stay white. Informational secondary actions use Ochre. A learner must be able to distinguish states without identifying a hue.

**The One Accent Rule.** Concentrate yellow on useful action or selection. Do not distribute it as unrelated decorative strips.

**The Ink on Yellow Rule.** Use the specified dark text and control boundary. Recorded ink-on-yellow contrast is 11.20:1; the yellow fill alone does not establish the control boundary.

The selected opaque-pair checks record Ink on Cream 15.10:1, supporting text on Cream 6.80:1, White on Ink 16.47:1 and Yellow focus on Ink 11.20:1. Room fields/secondary controls now use Ink boundaries; the legacy Border role remains for unchanged auth/profile controls. The microphone meter uses Ink active segments against White, with textual status. These are colour checks, not full accessibility conformance.

## Typography

Use Inter throughout, with regular 400 and semibold 600 weights. The actual Figma hierarchy is 28px headlines, 20px section titles, 16px body and 14px labels/supporting text. Line height is 1.45 with ordinary tracking. No display serif, decorative uppercase or monospace identity is established.

Headings explain the task. Room motions and invite codes use the existing 28px semibold headline style; participant names and section headings use 20px semibold, with 16px stance text. Participant labels and stances remain readable data, not display ornaments. Long names, email addresses and debate motions wrap rather than losing essential meaning. Use a neutral system-sans fallback only when Inter is unavailable; a fallback is not evidence of a font match.

## Layout

Create Room uses a 510px setup column and 488px preview/device-check column with a 40px gap inside the 1038px desktop content area. The preview is a single square Ink surface, showing the selected motion/settings, provisional stances and an open partner seat. No invite code or live presence is invented before creation. Mobile stacks preview and optional checks after the main form; a 44px Preview and audio checks action scrolls to them. Audio overlays use up to 480px desktop or 342px mobile width, reduced to viewport minus 48px on narrower phones.

Room setup shows defaults first. **Change settings** opens the full form; **Use these settings** returns to the summary before creation. Mobile Figma references use a fixed 390 × 844 viewport with vertical overflow and one page scroll area. Keep actions in normal flow with bottom padding. Geometry and top/bottom renders were inspected; real touch, keyboard and zoom behavior require later runtime checks.

Use related groups, generous separation and a logical reading order. The approved reference frames are 1102px desktop and 390px mobile. Desktop gutters are 32px; mobile gutters 24px. Desktop sign-in uses a 368px form column. Desktop room layouts put participants beside invitation details. Mobile waiting screens place the invitation first so sharing is immediately available; READY screens put participants first. At narrow phone widths, place the code above Copy code when they cannot fit comfortably on one row.

Internal containers should fill available width and text should grow vertically. Reflow at 320px has been checked in temporary Figma specimens. No production CSS breakpoint has been established by these frames; choose the stacking threshold from content fit during the later frontend build.

**The Topic First Rule.** In room views, the motion is the main heading. A compact membership status supports it; do not repeat the same state in a giant heading and a banner.

Visitor mode and screen-specific routes, sequence and prototype assumptions belong in the surface brief, not in global design tokens.

## Elevation & Depth

Flat by default. Cream/white surface separation and thin borders establish structure. The selected system has no shadow vocabulary, glass layers, gradients or ornamental halos. Keyboard-focus outlines are functional state feedback and must remain unclipped.

## Shapes

Unchanged auth/profile controls retain their 12px corners. Room-specific actions use 6px corners, room fields 4px, and content surfaces 0px. Open sections use spacing and thin rules instead of enclosing cards. Participant rows keep 16px vertical padding and an 8px name-to-stance gap. The Ink preview and local-check overlay are square functional surfaces; avoid nested decorative containers. Text actions retain 44px-high targets even when their visible label is small. Primary and secondary controls are 48px high. Fields use a 1px boundary; keyboard focus uses a 3px outside Ink outline.

## Components

### Buttons and text actions

Primary buttons pair Signal Yellow with Ink labels and a 1px Ink boundary. Hover uses the selected darker yellow. Focus adds a 3px outside outline without moving layout. Loading retains an action-specific label; disabled uses the neutral disabled surface and Muted text. Secondary controls are white with a Border outline. Text actions use Ochre with 44px targets.

Do not let a label extend outside its control. Reserve one clear primary action for the current task; error recovery must have a visible action when retry is available. While waiting for a partner, Copy code is primary and Back to rooms is secondary. READY retains its completed-state navigation hierarchy.

The [Room controls foundations](https://www.figma.com/design/atfafBv5VA3RxNrfHrn1gl?node-id=66-8) contain separate room button/input families, preserving existing auth/profile assets. Room controls use Ink boundaries. Keyboard focus is a 3px external Ink outline on light surfaces and a 3px Yellow outline on Ink; leave enough padding to avoid clipping. The keyboard-focus Create Room specimens show the primary action outline explicitly.

### Choice groups

CEFR, format and stance choices reuse the button components: the selected option uses Signal Yellow with Ink text, while unselected options use the white secondary treatment. Keep options grouped under a persistent descriptive label. Room format and stance groups now include explicit Selected text so meaning survives without the yellow fill. Keep CEFR cues/help as a separate follow-up. Do not introduce an additional accent family. Figma choice links illustrate fixed sample outcomes and are not a live form implementation.

### Fields

Use persistent external labels, white input surfaces, readable supporting text and explicit field errors. Passwords support a named Show/Hide control. Do not use a placeholder as the only label or invent password composition rules. The focus outline must remain visible outside the field and its parent container.

### Navigation and participants

The header uses the product name and a readable Account action. Participant rows retain display name, A/B identity, a self label and a plain-language stance. Membership is not a claim of online presence.

Back navigation does not become a Leave or Cancel action without the corresponding product contract. Prototype navigation must not imply real authentication, room synchronization or microphone processing.

### State patterns

Pair pending, success, unavailable and error states with concise wording. Keep valid non-sensitive input while explaining how to recover. Do not announce unchanged background refreshes. Missing consent, room capacity and service failures cannot be hidden by optimistic visual transitions.

### Proposed local device checks

The user selected a proposed local microphone/speaker check in Figma. Start/Play is explicit; no microphone request or playback happens on page load. Closing a check returns to the same underlying setup. The design covers permission waiting, a level meter, stop/release, permission/device/no-signal recovery, bounded speaker playback and learner-confirmed audibility. Local checks do not grant either participant's room-audio consent. Track release, playback, focus containment/restoration and physical-device behavior remain future implementation tests; the Figma examples perform no media operations.

## Do's and Don'ts

- **Do** preserve the cream canvas and single yellow action family.
- **Do** use plain English, persistent labels and explicit recovery actions.
- **Do** keep focus visible, targets comfortable and reading order stable across widths.
- **Do** retain the exact product boundaries around room membership and consent.
- **Don't** bring back rejected companion accents, pastel panels, gradients or decorative metrics.
- **Don't** use white text on yellow, clipped focus rings or colour-only status communication.
- **Don't** frame sparse participant rows as repeated decorative cards.
- **Don't** present a Figma prototype as evidence of working authentication, audio or backend acceptance tests.
