# Build 1 — Registration, Login and Room Lobby UX Brief

Performed: Codex, AI-assisted design planning at the user's request. Reviewed: pending human confirmation; no team-member review attributed. Edited: Codex.

Date: 2026-10-29. Status: proposed brief for confirmation, not implemented or usability-tested. PA2 planning only; implementation belongs to PA3. User-confirmed choices: English-only UI for Build 1; plan behavior and layout now, select visual style in Figma later.

Authority: [AGENTS.md](../../AGENTS.md), [PRODUCT.md](../../PRODUCT.md), [Gate G1 specification](../architecture/G1_SPEC_BUILD1.md), [Vision Document](../requirements/VISION_DOCUMENT.md), and [roadmap](../ROADMAP.md). Contract references below refer to Gate G1 sections. Proposed client routes and interface copy are design recommendations, not new API requirements.

## 1. Job, audience and success
Performed: Codex. Reviewed: pending human confirmation. Edited: Codex.

Mode: Operate. A learner needs to access an account, create a practice room or join an invited partner, and understand whether both participants have arrived. Keep language approachable across the supported A2–C1 range. The primary audience remains undecided; this brief does not resolve it or add an Evaluator flow.

The focal moment is a calm, explicit change from “Waiting for your partner” to “Both participants have joined.” Success is two authenticated browsers showing the same persisted room, two named participants with opposing stances, and READY. It is not a live debate. State clearly: “This build supports room setup only. Audio and debate start are not available.” Do not request microphone permissions or imply a partner is currently online: a room snapshot proves membership, not live presence.

## 2. Direction and scope
Performed: Codex. Reviewed: pending human confirmation. Edited: Codex.

Use task-led screens with one primary action per active form. Keep the selected topic, settings, participant count and room state readable together. Do not turn registration into a marketing page, add a dashboard of empty future features, or make users complete unrelated onboarding to join an invitation.

The existing `web/src/App.tsx` is an introductory scaffold, not an established auth/lobby design system. This brief selects no palette, fonts, component styling or visual world. Current workflow (2026-11-14): frontend implementation is independent of Figma and is verified in the browser using DESIGN.md, web/src/ and Spec Kit. Both historical Figma links are optional references. Read/edit/sync Figma only when explicitly requested. The original PA2 design sequence is superseded.

Include registration, login/session recovery, create/join choice, room settings, waiting/READY/expired lobby, own display-name/CEFR editing, and logout. Exclude password reset, verification email, social login, automatic matching, a topic-management API, leave/cancel/start operations, mic tests, audio, transcription and coaching. Those functions have no Build 1 contracts; do not show actionable controls for them.

## 3. Screen sequence and interaction
Performed: Codex. Reviewed: pending human confirmation. Edited: Codex.

Proposed client route names are implementation-independent and require no backend route changes.

| Screen | Hierarchy and primary action | Result |
|---|---|---|
| Register, `/register` | Heading, email, password, optional display name and CEFR, “Create account”, link to sign in | Successful registration opens login with an account-created notice; it does not sign the learner in |
| Login, `/login` | Heading, email, password, “Sign in”, link to register | Continue to the pending invitation or authenticated room entry |
| Room entry, `/rooms` | “Join a room” with invite input; separate “Create a room” path; account access | Submit a code, or open room setup without competing form submissions |
| Create room, `/rooms/new` | Seeded topic selection, expandable settings, summary, “Create room” | Navigate only after the server returns the new room |
| Lobby, `/rooms/:id` | Room state and participant count, topic/settings, participants/stances, invite sharing, expiry, build limitation | Poll the persisted snapshot; remain on the same screen when the partner joins |
| Own profile | Display name and CEFR, “Save changes”, account logout | Update only the caller's editable fields; no role, email or password editing |

**Registration and login.** Use persistent labels and standard email/password autofill semantics. Allow password managers, paste, and an accessible show/hide password control. Passwords are 12–128 characters with no invented composition rule; never trim or normalize them. Email allows at most 254 characters and trims surrounding whitespace. Optional display name is 1–80 trimmed characters when supplied; omission uses `Learner`. CEFR offers only A2/B1/B2/C1 with B1 as the contract default, described as self-assessed rather than certified. Name and CEFR remain editable later. Do not add consent-to-recording checkboxes to account creation.

**Invitation continuity.** A signed-out invite recipient signs in or registers before joining. Preserve the pending code during this same-tab auth journey and restore it into the join form; sign-in itself should not silently join a room. Keep codes out of analytics, logs and unrelated outgoing URLs. Prefer a URL fragment for a proposed shared invite link; the final link format requires implementation review. Build links from the frontend origin. Never trust a return URL supplied by an external origin. Passwords and credentials must not be persisted for this continuity feature.

**Room setup.** Provide a finite, explicitly seeded list with real backend topic IDs and readable titles. No search/recommendation promises. Defaults: free-flow format, ten-minute duration, random stance assignment. Additional settings expose free-flow/timed-turn format, duration of 60–1800 integer seconds, and random/creator-picks stance. A minutes/seconds input may translate to the contract's seconds; validate the final integer. Show PRO/CON choice only for creator-picks and do not send it for random mode. Explain that format and duration describe the planned debate; no live timer runs in Build 1.

**Waiting lobby.** Show one participant and an explicitly empty second seat, not a simulated profile or typing/online indicator. Display the eight-character invite code as selectable text with “Copy code” and, when the reviewed link format exists, “Copy invite link”. Only announce copy success after a successful clipboard write; if blocked, offer manual selection. Sharing is an intentional user action, never a public room listing.

**READY.** Show both server-returned names, A/B labels and opposing PRO/CON stances. Stances can be unassigned while waiting. Do not infer assignment locally. Replace the waiting message in place and announce the change once. Omit a “Start debate” button; use explanatory text for the unavailable next stage. Do not show live controls or a running debate countdown.

**Navigation and expiry.** Provide “Back to rooms”, not “Leave room”: navigation stops polling but does not remove membership or release a seat. State this consequence near the action. Logout also does not cancel the room. The lobby expires 30 minutes after creation according to server timestamps; show its expiry time, not a speech timer. Only a confirmed CANCELLED snapshot establishes expiry/cancellation; when a local estimate reaches expiry, refresh rather than asserting a new server state. The expired view offers navigation to room entry/create. Do not fabricate a cancellation or leave endpoint.

## 4. Responsive layout and content ranges
Performed: Codex. Reviewed: pending human confirmation. Edited: Codex.

Desktop: keep auth forms in a comfortable reading column; no decorative split panel is required. Room entry separates join and create clearly. In the lobby, the room state, topic and participants form the main column, with invite details/settings in an adjacent supporting area when width permits. Show a text account action without a large application sidebar.

Mobile: use one column in the same logical reading order: state, topic/summary, participants, sharing/details, navigation. Keep one obvious form action; avoid side-by-side form fields and bottom bars that the software keyboard could obscure. Allow content to scroll with the focused field and its error visible. Do not rely on hover, dragging or landscape orientation.

Design frames should cover a narrow 320–390 CSS-pixel viewport, a tablet width around 768, and desktop around 1280–1440, with intermediate reflow and zoom checks. These are review samples, not rigid breakpoints. At 200% zoom retain controls and reading order; review 400% reflow at a narrow equivalent viewport without page-level horizontal scrolling.

Use real content ranges: zero/one/two participant slots as appropriate to loading and membership, names up to 80 characters, eight-character codes, and all four CEFR values. Two identical display names must remain distinguishable by A/B and “You”. Test long names, emails, topic titles and unbroken strings; wrap rather than hide essential meaning. Topic title limits are unspecified, so do not invent a truncation-dependent layout. Never display participants' emails in the room.

## 5. Loading, failure and recovery states
Performed: Codex. Reviewed: pending human confirmation. Edited: Codex.

Keep normal labels readable while a form action shows “Creating account…”, “Signing in…”, “Joining…” or “Creating room…”. Prevent duplicate submissions for the active form; do not freeze unrelated navigation. Pending is not success. Preserve non-sensitive values and field focus where possible. Do not log passwords or expose server exception text.

| Trigger / contract response | User-facing state and recovery |
|---|---|
| Initial session restoration | Show “Checking your session…” before protected content; no flash of another user's room or stale account UI |
| Registration 409 `EMAIL_EXISTS` | “An account already uses this email. Sign in instead.” Keep email and provide the real login path; this reflects the explicit account-disclosure trade-off |
| Login 401 `INVALID_CREDENTIALS` | “Could not sign in with those details.” Do not distinguish wrong password, missing account, suspension or deletion |
| 422 validation | Inline field guidance plus a concise linked error summary; preserve entered values without echoing passwords or secret values into messages |
| Auth 403 `ORIGIN_REJECTED` | Explain that the request was blocked and offer reload/retry from the app's trusted address; do not suggest disabling browser protections |
| No valid seeded topic / `TOPIC_UNAVAILABLE` | Explain that the topic cannot be used, block create if there is no valid choice, and let the learner select another or retry loading available data |
| Unknown/expired invitation, 404 `ROOM_UNAVAILABLE` | “This invite is unavailable or has expired. Check the code or ask for a new one.” Keep the code editable; do not reveal which private room exists |
| 409 `ROOM_FULL` | “This room already has two participants.” Offer code correction or room creation; no participant names or room details in the rejection |
| 409 `ROOM_NOT_JOINABLE` | “This room cannot be joined.” Keep code and offer room entry; do not disclose private room contents |
| Room GET 404 / malformed identifier 422 | Show a neutral unavailable/invalid-room view with a route to room entry; do not reveal whether a nonmember's room exists |
| Initial room GET pending | Structural placeholder or short loading text without invented participant data; controls that need room data are unavailable |
| Poll network failure / 503 | Keep the last confirmed snapshot visibly marked as possibly outdated with “Room status could not be updated”; hide stale data if authorization fails, and offer retry without duplicate polling loops |
| 429 | Explain when retry is available using `Retry-After`; avoid repeated alerts or automatic request storms |
| Server-confirmed CANCELLED | “This room has expired.” Stop polling and offer room entry/create; do not label this as a completed debate |
| Clipboard failure | Keep selectable invite text and explain manual copying; do not show a false “Copied” notice |
| Lost response to room creation | Say room creation could not be confirmed; do not automatically replay POST or claim rollback. The contract has no idempotency key or own-room list to recover the ID; a retry can create another room |
| Lost response to join | Preserve code and allow deliberate retry; repeated joining by the same member is idempotent under the contract |
| Logout pending/failure | On confirmed 204, clear session data and show login. On a lost/failed response, hide protected local data but state that server sign-out was not confirmed; offer retry without claiming revocation |

Poll room GET every two seconds, with at most one request in flight. Stop on logout, navigation away, terminal room state, or terminal authorization/unavailable response. READY still needs polling to detect server expiry. Do not announce unchanged responses. A transient error may pause automatic polling and offer deliberate retry; never run overlapping timers or silently treat stale data as current. This is lobby synchronization, not the later live reconnect protocol.

For an ordinary protected-request 401, permit one serialized session refresh attempt, then retry the protected read if successful. Failed or ambiguous refresh returns the learner to login; never automatically replay a refresh whose response was lost. Preserve the non-sensitive destination, clear credentials, and use a clear session-ended notice without implying a particular cause. Reauthentication may also occur across tabs; prevent a refresh/error loop. Do not store access or refresh credentials in localStorage/sessionStorage.

## 6. Accessibility and interaction review
Performed: Codex. Reviewed: pending human confirmation. Edited: Codex.

- Use semantic headings, landmarks, forms, labels and buttons. Link field errors through descriptions and invalid-state semantics; an error summary should focus and link to the relevant fields after failed submission. Do not validate aggressively while a learner is still typing.
- Keyboard users can complete every flow with visible focus, sensible Tab order and no trap. Enter submits the active form only. Route changes move focus to the new heading; a background poll never moves it. The profile editor is preferably a page or inline section to avoid unnecessary modal focus management.
- Use polite status announcements for pending/success, copy result and a single meaningful room-state change. Announce submitted errors appropriately; do not repeatedly announce each poll, every second until expiry, or unchanged participant counts.
- Distinguish waiting, ready, unavailable and error states with text, not color or icons alone. Stance and participant labels must be written out; do not require recognition of an avatar or animation.
- Adopt WCAG 2.2 AA as the proposed design-review target, subject to team confirmation, not a claim of conformance. Check contrast, focus visibility/obscuration, text resizing, reflow and touch target spacing. Prefer comfortable approximately 44 CSS-pixel touch targets; do not claim this alone establishes accessibility.
- Respect reduced motion and avoid pulsing speaker indicators, auto-playing media or celebratory transitions. Inline English guidance must explain CEFR, stance and invite errors without relying on technical vocabulary.
- Authentication permits password managers and copy/paste. No cognitive puzzle, inaccessible CAPTCHA or mandatory memorization is introduced by this brief.

## 7. Figma handoff and acceptance review
Performed: Codex. Reviewed: pending human confirmation. Edited: Codex.

Prepare paired mobile/desktop frames for register, login, room entry, create with expanded settings, waiting lobby, READY and expired/unavailable views; include the own-profile interaction and the state variants in section 5. Annotate proposed routes separately from API paths. Connect the registration-to-login journey and the creator/partner paths with the READY transition. Document keyboard order, focus destinations, live announcements, non-sensitive draft retention and server/client authority on each relevant frame. Avoid invented testimonials, learner gains or implemented-feature claims.

Figma audit checks: real contract-backed controls only; English copy; complete two-person flow; invitation continuation through auth; loading/error/empty variants; narrow-screen reflow; long content; keyboard/focus behavior; no capture/start/leave/cancel promise; stale snapshots and expiry represented accurately. These are historical prototype audit criteria. Current frontend checks verify runtime behavior in the browser; no Figma review or sync is a prerequisite.

| Review scenario | Observable design requirement | G1 trace |
|---|---|---|
| Register/login and edit own CEFR | Registration ends at login; generic login failure; only supported profile fields editable | A01–A03 |
| Session recovery/logout | One refresh attempt, no replay loop, explicit sign-out failure, protected content cleared | A04–A05 |
| Creator and invited partner | Real seeded topic, persisted room, two slots, server-assigned opposing stances at READY | A06, A12 |
| Full/invalid room and repeated join | Third user sees no private snapshot; repeat member join does not add a seat | A07–A08, A11 |
| State and consent boundaries | READY has no microphone access or start control; navigation does not pretend to leave/cancel | A09–A10 |
| Responsive and accessible use | Equivalent completion and recoverable errors across sizes, zoom, keyboard and assistive-technology review | Proposed UX checks; not yet run |

Open decisions: final Figma destination and visual direction; exact client route/invite-link format; review ownership and WCAG target confirmation; handling recovery of an ambiguous create result if the team later extends the API. Primary audience and Evaluator scope remain open in PRODUCT.md and do not block this learner-only flow. No prototype, product code, test result or human approval is claimed by this brief.
