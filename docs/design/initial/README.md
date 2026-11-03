# DebateSpeak — Initial product design

Created October 25, 2026. Initial design study for team review.

Design preparation: Codex, AI-assisted. Responsible product-area owner: **Nguyễn Bảo Minh Triết (24125047), Frontend & WebRTC/Audio Lead**. Human review and approval are pending.

[Open the editable Figma design](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-2).

## Screen inventory

| Screen | Desktop | Mobile | Requirements |
|---|---|---|---|
| Login | [1440 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-3) | [390 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-8) | FG-01; FR-01, FR-03 |
| Registration | [1440 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-4) | [390 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-9) | FG-01; FR-01–02 |
| Main menu | [1440 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-5) | [390 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-10) | FG-02–03; FR-06, FR-10–11; FG-10 history entry |
| Lobby | [1440 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-6) | [390 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-11) | FG-03–04; FR-10–15, FR-19 |
| Profile | [1440 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-7) | [390 px](https://www.figma.com/design/AIMVZQMzuesvOLx1YiICsz?node-id=2-12) | FG-01; FR-02–04; FG-10 history entry |

These are native editable Figma text, frames, shapes, and component instances. They are static review compositions, not a wired prototype or implemented application. Long mobile frames represent scrollable content. Alex, the example email, debate motions, and invite code are illustrative content. Main-menu topic cards are examples, not claims about a populated database.

## References and visual direction

- [Project proposal](../../requirements/PROJECT_PROPOSAL.md), [vision](../../requirements/VISION_DOCUMENT.md), and [architecture requirements](../../architecture/SOFTWARE_ARCHITECTURE_SPEC.md) define product behavior.
- [Existing app survey](../../requirements/EXISTING_APP_SURVEY.md) and its ArguFight/Luyennoi screenshots inform the bold typography, deep ink panels, purple actions, and quiet light surfaces. No screenshot is embedded in the UI.
- Inter matches [the existing frontend stylesheet](../../../web/src/index.css). The initial palette adds purple `#6545DF`, ink `#19162D`, canvas `#F7F7FB`, and restrained lime `#D9F282` accents. These are proposed design tokens; they have not been added to application CSS.
- Shared foundations contain 51 variables (primitive colors, semantic aliases, spacing, radii), 8 text styles, and 4 component families with 12 variants: buttons, fields, checkboxes, navigation. The Figma file includes a compact preview of normal, hover, disabled, focus, and error appearances.

## Interaction contract for implementation

1. Registration creates an account and records a self-assessed CEFR level; native language and goals remain editable in the profile. Terms acceptance does not grant audio/transcription consent.
2. The main menu exposes topic browsing and eight-character invite entry. Room creation must collect the topic, stance mode, format, and duration before creating a room; the creation form is a subsequent design task.
3. The illustrated lobby contains one authenticated participant and one empty slot. The local mic test runs only after an explicit user action and does not publish audio or send it to transcription. Input-device choice, permission-denied recovery, and test-result states remain to be detailed.
4. Room presence, microphone readiness, personal readiness, and personal consent are separate gates. Each user controls only their own consent. Start remains disabled until both participants are present, consented, and ready. Backend enforcement is still required.
5. CEFR labels are self-assessments. No fabricated learner scores or history appear in the designs. The history entry stays empty until a debate is completed.
6. Profile updates require clear success/error feedback in implementation. Deleting an account requires a separate confirmation. Consent withdrawal, leaving a room, and ending a debate must remain accessible in the live-room design.

## Review status and remaining design work

All ten screens were visually inspected. The final structural check found no child overflow, no raster UI layers, and only Inter text. The screens contain 775 editable descendants, including 73 component instances. The main menu is taller than the other desktop views to preserve content without clipping.

This first pass does not include a live debate screen, transcript/report screens (FG-05–10), admin views, room-creation modal, recovery flows, confirmation dialogs, or a clickable prototype. Input and button variants provide a starting point for detailed state design; their presence is not proof that those flows are implemented. All functional-group mappings above indicate design intent, not full requirement coverage.

The [Figma state ledger](figma-state.json) records exact node IDs and validation evidence for subsequent editing. Application source code was not changed. No commit or push was made.
