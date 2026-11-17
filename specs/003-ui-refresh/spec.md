# 003 — UI refresh: type, motion, register steps, shorter copy

Status: built on `feature/SCRUM-53-ui-refresh`, 2026-11-17; awaiting PR review.

## Job and audience

Learners (A2–C1) signing up, setting up a room and waiting for a partner.
Mode: Operate. Success is finishing the task quickly, without reading
paragraphs, while still seeing every consent and preview limit.

## Decisions (confirmed by the user, 2026-11-17)

1. **Register in steps, same URL.** `#/register` stays one route. Step 1:
   email and password. Step 2: display name, English level, microphone note.
   Browser Back leaves the form (accepted trade-off). No step data in the URL
   or browser storage.
2. **New display face plus Inter.** Headings, brand, room motion and invite
   code use a display face; body, labels, fields and buttons stay Inter.
   This replaces the recorded "Inter only, 400/600" commitment, so DESIGN.md,
   PRODUCT.md and the architecture/proposal specs change first.
3. **All screens in one pass.** Account, recovery, rooms, room setup, lobby,
   admin.
4. **Shorter descriptions.** Drop decorative subtitles; shorten helper text.
   Consent, preview and "not a certification" facts stay, in fewer words.
5. **Wider weight contrast.** Heavy display headings (800), Inter 400 body,
   Inter 300 only for large lead text (18px and up).
6. **Motion.** Purposeful, short, and fully off under reduced motion.
7. **Main menu at `#/home`.** The landing page after sign-in, "Twin doors"
   layout, sample topics and history. Brief: [main-menu.md](main-menu.md).

## Selected direction

- Display face: **Archivo** (variable, `wght` and `wdth` axes), self-hosted via
  `@fontsource-variable/archivo`. Semi-condensed and heavy, it reads like a
  debate podium card; it ships Latin, Latin Extended and Vietnamese subsets,
  so Vietnamese names in headings render in the same face.
- Cream & Yellow palette, flat surfaces, 48px controls and focus outlines are
  unchanged.
- Motion vocabulary: page enter (fade and 8px rise), register step slide
  (direction-aware), step progress fill, choice check scale-in, button press,
  status note reveal, lobby participant stagger. No shake on errors (punitive),
  no looping animation, nothing longer than 320ms.

## States and ranges

- Register step 2 can receive server errors for step-1 fields (409 email in
  use, 422 on email/password). Those return the learner to step 1 with the
  field focused and values kept.
- Enter on step 1 continues; it never sends the registration request.
- Names up to 80 characters (Vietnamese diacritics) in display headings;
  320px width at 200% text must not scroll horizontally.

## Copy changes (to approve)

| Screen | Before | After |
|---|---|---|
| Sign in | "Create a room or join your partner." | (removed) |
| Register | "Practice a clear point of view, with a partner." | (removed; step label replaces it) |
| Register | "Use 12–128 characters. Spaces and password managers are welcome." | "12–128 characters. Spaces allowed." |
| Register | "If left empty, your name will be Learner." | "Leave blank to appear as Learner." |
| Register | "Choose your current level. You can change it later; this is not a certification." | "Self-assessed, not a certification. Change it anytime." |
| Register | "Creating an account does not turn on your microphone or share anything for transcription or AI analysis. You choose that separately before each debate." | "Your microphone stays off. You choose what to share before each debate." |
| Profile | "Keep your display name and English level up to date." | (removed) |
| Profile | "Your level is a self-assessment, not a certification. Your email and account role cannot be changed here." | "Level is self-assessed. Email and role can't be changed here." |
| Rooms | "Join your partner with an invite code, or set up a room for the two of you." | (removed) |
| Invite | "Preview the invitation before joining a room." | (removed) |
| Room setup | "Start with these defaults, or change the room settings." | "Defaults below. Change them if you like." |
| Room setup | "Choose the topic and a few simple rules before inviting your partner." | "Pick a topic and rules." |
| Sessions | "Devices signed in to your account. Sign out any you do not recognise." | "Sign out any device you don't recognise." |
| Admin | "Find an account by email, then suspend or reactivate it." | (removed) |
| Footer | "Account forms use the configured API. Rooms and audio remain previews." | "Rooms and audio are previews." |

Strings asserted by Playwright tests (headings, button names, error text,
"Sample room · no seat is reserved.", "not connected") stay unchanged.

## Out of scope

Real-path routing (hash routes stay), new colours, shadows or gradients,
backend or API changes, Figma.

## Open decisions

- Jira ticket number for the branch `feature/SCRUM-<nn>-ui-refresh`.
- DESIGN.md has a named owner per section and AGENTS.md says one person
  edits one file: who edits DESIGN.md and PRODUCT.md for the font change.

## Baseline findings (Task 1, 2026-11-17)

Impeccable audit: 16/20 (Accessibility 3, Performance 4, Theming 3, Responsive 3,
Integrity 3); detector: 0 findings. Not already covered by this plan:

- Every page ends with the "Preview screen" selector, which is a team review tool;
  hide it in production builds (follow-up, see route-gaps.md).
- Room setup: "Change settings" is centred while "Back to rooms" is indented; text
  actions do not share one alignment. Fixed in Task 8 polish.
- Invite codes read as one 8-letter run (`ABCD2345`). Partners read them aloud;
  grouping 4 + 4 would help (follow-up; changes copy-code behaviour).
