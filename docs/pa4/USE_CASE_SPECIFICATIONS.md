# PA4 — Revised Use-Case Specifications (Second Submission)
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Ticket: **SCRUM-54**, PA4 Part A. Revision date: **2026-11-23**. Owner: **Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead**. Assigned reviewer: **Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead**. This is a specification ready for peer review, not a claim that the live product or peer review is complete.

## 1. Revision scope and sources
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

This second submission preserves the 54 PA3 use-case identifiers, revises eleven room/audio use cases, and adds **UC-04-05** for typed debate turns. All **55** specifications appear in this document. The other 43 entries retain their PA3 functional behavior and priority; their prototype references are historical links, not new UI evidence. The revised [use-case model](USE_CASE_MODEL.md) supplies the complete actor, requirement and relationship index. [Changes.md](Changes.md) records changes separately for the model and these specifications.

PA4 Part E targets **FG-03 Room and Session Management + FG-04 Real-Time Audio**. FG-01 remains the PA3 implementation baseline. Seeded motion selection supports room creation; it does not claim completion of FG-02 topic management. Streaming STT, AI analysis, reports, video, audiences, solo AI practice and private side chat are not completion claims of this ticket. Typing is an approved follow-up after the graded voice flow, not a reason to delay that flow or claim FG-05 is delivered.

| Source | Use and precedence within this revision |
|---|---|
| [PA4 assignment](../assignments/PA4-2026.pdf), Part A and submission rules | Revise both model and specifications; one Changes.md with separate document sections; English Markdown and PDF; section attribution. |
| [PA3 specifications](../pa3/USE_CASE_SPECIFICATIONS.md), [model](../pa3/USE_CASE_MODEL.md), [catalogue](../pa3/use_cases.json) | Prior submitted baseline; stable IDs, actors and FR-01–60 mappings. |
| [PA4 scope](README.md) and [Tuấn's tasks](tuan/TODO.md) | FG-03/FG-04 delivery and SCRUM-54 ownership. |
| [Room flow design, 2026-11-19](../superpowers/specs/2026-11-19-room-flow-design.md) | Current room state, consent, input modes, routes, token and typed-turn contract. Its explicit corrections supersede older room-flow wording for this revision. |
| [Room flow plan](../superpowers/plans/2026-11-19-room-flow.md) | Implementation sequence and integration checkpoints; not execution evidence. |
| [Vision Document](../requirements/VISION_DOCUMENT.md), §§4–5 | Full-product user needs, two willing learners, privacy, recovery and the PA3 FG-01 boundary. |
| [Architecture specification](../architecture/SOFTWARE_ARCHITECTURE_SPEC.md), §§3, 4, 6, 15 | Existing FR/NFR identifiers and safety rules; discrepancies are listed in §7 rather than silently rewriting another owner's document. |
| [Room client](../../web/src/rooms/api.ts), [contracts](../../web/src/rooms/contracts.ts), [room page](../../web/src/pages/rooms/RoomPage.tsx) | Merged frontend behavior inspected at PA4 base commit `7676197`; not proof of a working room backend. |

**TA-feedback status.** No specific PA3 TA comments were supplied for this revision or located in the PA3/PA4 repository documents. Moodle and instructor email were not accessed. This revision follows the current team workflow, with Triết responsible for frontend. The changes below therefore address documented contract gaps and current design decisions; they are not attributed to an invented TA review. Any later TA comments must be recorded verbatim or faithfully summarized with their source in Changes.md and mapped to the affected sections.

## 2. Shared contracts
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### 2.1 Identity, privacy and honest outcomes
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

The server derives identity from the authenticated session. A body-supplied user ID, browser role or invite code does not grant participant privileges. Room snapshots, turns and media tokens require current membership. Read access to an absent or nonmember room returns a non-disclosing unavailable outcome. Invite lookup returns only the deliberately limited preview after authentication; it never grants a seat or media access. Moderator/Admin, human Evaluator, Teacher and Audience rights remain individually scoped, with optional actors disabled outside their specified future scope.

Room creation, seating, side assignment, readiness and lifecycle changes must be atomic. A successful loading animation is not confirmation of a server write. A retry cannot create an extra participant, start a second debate or reset the timer. After an ambiguous mutation response, reconcile authorized server state before repeating an operation. If creation/typed-send deduplication cannot be reconciled, show an unconfirmed outcome and require a deliberate recovery; do not blindly repeat the POST or claim a lost request never committed. Detailed deduplication mechanics belong to the backend contract, not an invented frontend endpoint.

Never log passwords, access/refresh/media tokens, raw invite codes or private transcript content. Render learner names and typed turns as text. Do not put credentials into URLs or browser storage. An invite code may appear only in the designated invitation hash (`#/join/:code`); it is not an authentication credential. The room's stable address uses its room ID (`#/rooms/:id`).

### 2.2 Room lifecycle and time authority
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

| State | Meaning and allowed exits |
|---|---|
| `LOBBY` | One creator seat; invitation open for a second distinct learner. May become READY or CANCELLED. |
| `READY` | Two occupied seats. Personal consent/readiness may still be false. May become LOBBY, LIVE or CANCELLED. |
| `LIVE` | Both current readiness submissions were accepted; `started_at` is the shared publication boundary. May become ENDED only. |
| `ENDED` | Finished session; no further capture, publication or typed submissions. Terminal. |
| `CANCELLED` | Closed/expired before LIVE; no debate started. Terminal. |

The server enforces two distinct debaters even under concurrent joins. Invite codes contain eight uppercase characters, are normalized for case/whitespace, and expire with the lobby after 30 minutes. A guest leaving READY reopens LOBBY, clears both ready flags and restarts the 30-minute deadline. A creator leaving/cancelling before LIVE cancels the room. Expiry cancels LOBBY/READY, invalidates the invite and prevents a late join/start; LIVE is governed by session time, not lobby expiry. Terminal states never reopen.

Random sides are assigned once when the second learner joins; a creator's selected side yields the opposite side for the partner. FREE_FLOW offers 5, 10, 15 or 20 minutes. TIMED_TURNS uses the fixed approximately seven-minute format in the current design, without a free-flow duration selector. The backend must return the authoritative phase schedule; the older phase wording is ambiguous about per-speaker durations, so this revision does not invent exact phase boundaries. Turn markers guide speaking and never automatically mute anyone.

The second accepted Ready atomically sets LIVE and `started_at = server acceptance time + 3 seconds`. Clients use `server_now` to align their countdown and publish no audio before `started_at`. There is no separate public Start or arbitrary state-patch endpoint. Poll every two seconds in LOBBY/READY and every five seconds in LIVE; stop on terminal state, exit or lost authorization. A transient poll failure preserves the last view and healthy audio while marking synchronization unavailable; stale state alone cannot grant new readiness or media access. The server owns debate expiry and the 60-second disconnect deadline.

### 2.3 Independent consent, microphone and typed participation
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Each learner sees an unchecked personal agreement explaining audio routing, transcription, future AI processing, transcript/typed-content retention and deletion, and how to withdraw. The notice must disclose actual availability: PA4 does not promise a generated feedback report, functioning speech transcription or saved raw audio. Presence, account terms, the partner's choice and browser microphone permission are not consent. No countdown or language pressures a learner to agree. Declining has no account penalty and Leave remains available.

| Personal input | Condition for pressing I'm ready | Media grant after authorized LIVE |
|---|---|---|
| `VOICE` | Current explicit consent and a passed local test for the selected microphone. | Publish own audio and subscribe to the partner's permitted audio. |
| `TYPE` | Current explicit consent and deliberate Type instead selection; no microphone test required. | Subscribe only; never request or publish microphone audio. |

Ready sends `consent: true` and the chosen input mode; Not ready yet deletes that personal readiness while the room is READY. The current body has no mic-test attestation field: the browser must enforce its local-test gate, while the server verifies membership, state, expiry, current personal consent/input and the atomic start decision. A local test is not a server-verifiable measurement and no new field is claimed as implemented. Failed or unconfirmed consent saves cannot authorize start.

A mic test starts only after an explicit Test click. It is local: no upload, recording, STT or LiveKit publication. Release all test tracks and the audio context on pass, failure, cancel, mode/device change or route exit. Browser denial offers retry instructions, Type instead or Leave without a repeated permission loop. The voice test must be repeated for a changed device. Type mode may listen to a voice partner without granting capture permission.

Consent withdrawal during LIVE stops local capture immediately and requests the shared End action; it does not merely mute audio and leave processing active. A READY withdrawal racing the second Ready must reconcile authoritative state: if LIVE already won, stop local capture and end instead of retrying DELETE indefinitely. Ending/disconnection cleanup must stop capture and subscriptions for both participants. Closing a browser or losing connectivity never authorizes background capture.

### 2.4 Room and media interaction contract
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

The following paths are relative to `/api/v1`. They describe the target interaction contract, not a declaration that these endpoints exist in the merged backend.

| Request | Observable purpose / authorization |
|---|---|
| `GET /topics` | Authenticated seeded-motion list for room setup. |
| `POST /rooms` | Create a room from topic, format, duration and side; return snapshot. |
| `POST /rooms/lookup` | Authenticated invite preview; code in body; no seat allocation. |
| `POST /rooms/join` | Claim the open seat atomically or return the caller's existing room. |
| `GET /rooms/{id}` | Current participant-only room snapshot. |
| `POST /rooms/{id}/leave` | Before LIVE: guest leaves or creator cancels. |
| `POST /rooms/{id}/cancel` | Creator-only pre-LIVE cancellation. |
| `PUT /rooms/{id}/ready` | Persist own consent/input/readiness; second Ready starts once. |
| `DELETE /rooms/{id}/ready` | Withdraw own readiness while READY. |
| `POST /rooms/{id}/token` | Short-lived room-scoped token only while LIVE and currently authorized. |
| `POST /rooms/{id}/turns` | Save a 1–500 character typed turn only during LIVE. |
| `GET /rooms/{id}/turns?after={seq}` | Participant-only ordered typed-turn recovery. |
| `POST /rooms/{id}/end` | Either participant ends LIVE; preserve an already-ended outcome. |

Snapshots carry room ID/code/status, motion, format/duration, expiry/start/end timestamps, end reason, `server_now` and participants with ID/name/side/creator/ready/input. Clients use the snapshot rather than reconstructing authority from URL, local flags or countdown. End metadata must identify a manual ending where supplied. The LiveKit room name is **the room ID**, never its invitation code. Tokens are held only in memory; TYPE cannot publish audio; the configured production service is LiveKit Cloud. Local media development does not establish Cloud acceptance.

### 2.5 Errors, recovery and accessibility
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

| Condition | Required outcome and next action |
|---|---|
| Validation failure (`400`/`422`, as the actual backend contract defines) | Explain the invalid field, preserve nonsensitive input and perform no invalid mutation. |
| `401` | Recover through the FG-01 session contract once where supported; otherwise stop private/media access and sign in. Never repeatedly retry an ambiguous mutation. |
| `403` / participant read `404` | Stop private polling/capture; disclose no unauthorized room or transcript details. |
| Invalid/expired invite | Show that the invite does not work; allow another code, a new invitation or room creation. |
| `409` full/not joinable/stale transition | Preserve authoritative capacity/state; reload the caller's authorized room or offer another room. |
| `429` | Respect retry timing and keep resubmission disabled during it. |
| Timeout, offline or `5xx` | Show pending/unavailable honestly; reconcile writes before retry. A failed poll alone must not tear down healthy consented audio. |
| Malformed success payload | Do not treat it as confirmed creation, joining, readiness, media or turn persistence. |
| End request unconfirmed | Stop local media now; display that ending for the partner is unconfirmed and reconcile when reachable. |

Preserve the Cream & Yellow design and existing typography; the focused Ink stage applies to LIVE/ENDED. Keep controls labelled and keyboard accessible with visible focus, readable text states and reflow at 320px. An invite dialog traps and restores focus and supports Escape/Not now. Destructive End asks “End for both of you?” without hiding the safe-exit path. Reduced motion removes animated spotlight/countdown transitions. Announce phase changes, one minute remaining and the ending politely; do not announce every speaker change. Do not show scores, coaching alerts or talk-time competition during the debate.

### 2.6 Inherited account, evidence and report contracts
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

FG-01 follows the PA3 account specifications and [account integration guide](../../web/API_INTEGRATION.md). Registration finishes signed out. Access credentials stay in memory; a host-only HttpOnly refresh cookie supports the documented refresh lifecycle. Revocation/expiry cannot be bypassed by room membership. Unknown email and wrong password share an invalid-credentials outcome; account suspension is revealed only after a correct password. Recovery/verification availability depends on verified email delivery, not the existence of a screen. The PA3 BCrypt and schema-migration deviations remain disclosed in [PA3 Changes](../pa3/Changes.md).

The unchanged future specifications retain their evidence guards: independent speaker tracks, idempotent final transcript segments, and nonempty verbatim quotes from the correct learner's segment for every retained language/argument critique. A grounding match does not prove a criticism correct. Low-confidence STT is not a confirmed learner error. Every critique includes a concrete correction or practice action. Default fact checking selects at most eight claims and preserves uncertain/contested outcomes; the single-judge MVP is labelled and confidence-capped at 0.8. Reports are post-debate and may be partial/unavailable. Fewer than 60 seconds of actual speech is insufficient for speech assessment; wall-clock time and typed turns cannot be counted as speech. Typed content may later receive language/argument feedback, never pronunciation or speaking-fluency scores.

These later-product rules are design constraints only. PA4 wrap-up states “Feedback report: coming in a later release”; it does not enqueue or claim a functioning AI report as part of this revision.

### 2.7 Inherited authentication session lifecycle
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

The following account contract is carried forward from PA3; its historical implementation status was not re-tested by SCRUM-54.

FR-01's full-product session behavior is part of UC-01-02, not a separate user goal or a mandatory include from registration. Registration always finishes signed out. The inherited design follows G1 sections 5 and 7; the PA3 baseline describes it (PA3 Changes.md row 1.12).

- **PA3 baseline:** Implements the full-product lifecycle below. The access JWT stays in runtime memory. On page load the app calls `/auth/refresh` once to restore the session; on access expiry it tries one refresh before asking the user to sign in.
- **Full-product sign-in:** A valid login returns a short-lived access JWT (15 minutes under G1) and sets a host-only HttpOnly refresh cookie, Secure on HTTPS and SameSite=Lax. Neither access nor refresh credentials enter localStorage/sessionStorage; JavaScript never receives the refresh value. Auth requests use the configured trusted Origin, client header and credentialed fetch.
- **Renewal:** When access expires, serialize refresh attempts and allow at most one refresh attempt for an ordinary protected-request recovery. The server atomically consumes the current refresh credential and issues its successor plus a new access JWT. Rotation preserves the family's original seven-day absolute expiry. Retry the protected request only after confirmed renewal and only when its retry contract permits it.
- **Expiry, revocation or replay:** A missing, expired, revoked or replayed refresh credential produces a generic invalid-session outcome. Replay revokes the entire family. Clear in-memory credentials and return to sign-in without a retry loop; server checks prevent revoked families or ineligible accounts from retaining access.
- **Lost renewal response:** Do not automatically repeat a potentially consumed refresh credential. Clear in-memory access and require sign-in. Concurrent-tab replay likewise requires re-authentication.
- **Sign-out:** UC-01-04 revokes the identifiable current family and clears the refresh cookie; an already absent/revoked session is an idempotent success. This does not sign out every device. Network failure leaves revocation unconfirmed as specified in UC-01-04 E1.

Refresh-session behavior is implemented in PA3 (`specs/002-fg01-accounts`). Password recovery remains conditional on UC-01-05 being implemented and enabled; otherwise offer sign-in only and do not expose an actionable recovery link.

## 3. Use-case specifications
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

All 55 entries follow the stable catalogue order. Revised PA4 entries replace eleven room/audio specifications; UC-04-05 is new. The 43 retained entries preserve PA3 functional content and priority, subject to §2. Historical prototype links are design references, not current implementation evidence. PA3 co-owner edits by Nguyễn Bảo Minh Triết (24125047), Frontend & WebRTC/Audio Lead, remain attributable to the linked PA3 source; no new review by Triết or Lộc is asserted.

## FG-01 — Account and profile
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-01-01 — Register account
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Create an account without granting media or AI-processing consent.

| Field | Specification |
|---|---|
| Actors | Visitor |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-01 |
| Trigger | Visitor selects Create account. |
| Preconditions | Visitor is signed out and can reach the registration page. |

**Basic flow — main success scenario**

1. Visitor enters an email, password and optional display name and self-assessed CEFR level.
2. System validates the fields and explains that account creation grants no media or analysis consent.
3. Visitor submits; system normalizes email comparison and atomically creates the account and default profile.
4. System confirms registration and directs the visitor to sign in; no session or microphone is started.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, optional profile values are omitted. | System uses Learner and B1 defaults; registration may continue. |
| A2 | After step 4, the visitor verifies their email. | Visitor enters the emailed code on Verify email, or requests a new one. Verification never signs in, and a verification code is never accepted as a reset code. |
| E1 | At step 2, email/password/display name/CEFR is invalid. | Show field errors, retain nonsensitive fields, clear the password, and create no account. |
| E2 | At step 3, email already exists. | Return EMAIL_EXISTS without creating another account; offer sign-in, and recovery only when UC-01-05 is implemented and enabled. |
| E3 | At step 3, throttling or a failed/ambiguous response occurs. | Apply §2.5 error handling: respect Retry-After or reconcile by sign-in before retrying; offer recovery only when UC-01-05 is implemented and enabled. Never claim success without confirmation. |

**Postconditions — success:** One account and its profile exist; the visitor remains signed out.

**Postconditions — minimum guarantee:** A failed atomic write leaves neither a partial account nor a partial profile.

**Special requirements:** Email at most 254 characters; password 12–128 without trimming; display name 1–80; CEFR A2/B1/B2/C1. Password hashing occurs server-side (Argon2id specified; the PA3 build uses BCrypt, PA3 Changes.md row 1.13). No passwords in screenshots/logs. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-01 basic-flow prototype](../pa3/screenshots/uc-01-01.png)

[PA3 prototype: UC-01-01 alternative and exception prototype states](../pa3/screenshots/uc-01-01-alternatives.png)

### UC-01-02 — Sign in
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Authenticate and recover an authorized application session.

| Field | Specification |
|---|---|
| Actors | Visitor |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-01 |
| Trigger | Visitor selects Sign in. |
| Preconditions | Visitor has an account and is signed out. |

**Basic flow — main success scenario**

1. Visitor enters email and password and submits once.
2. System validates credentials and account eligibility without revealing which check failed.
3. System establishes the authorized session and returns the learner identity using the explicit reduced-PA3 or full-product contract in §2.7.
4. System opens the menu or a previously requested authorized page without creating a room or requesting microphone permission.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 4, an invite destination was preserved. | After sign-in, reopen invite entry; joining still requires its own capacity/state checks. |
| E1 | At step 2, credentials are wrong or the account is deleted. | Show the same generic invalid-credentials message; issue no session. |
| E2 | At step 2, fields are malformed or login is rate limited. | Show validation or retry timing; retain email, clear password. |
| E3 | At step 3, session creation or network confirmation fails. | Apply §2.5 error handling and remain signed out until a valid login response is received; do not show a fake logged-in screen. |
| E4 | At step 2, the password is correct but the account is suspended. | Say the account is suspended (403 `account_suspended`); issue no session. |

**Postconditions — success:** A verified session identifies the user and enables only their authorized actions.

**Postconditions — minimum guarantee:** Failed sign-in grants no access and discloses no account eligibility details.

**Special requirements:** §§2.5 and 2.7 define auth errors and the FR-01 session lifecycle, including renewal, expiry, replay and lost-response handling. Keep access tokens only in runtime memory; never expose server secrets. Refresh rotation is implemented in PA3. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-02 basic-flow prototype](../pa3/screenshots/uc-01-02.png)

[PA3 prototype: UC-01-02 alternative and exception prototype states](../pa3/screenshots/uc-01-02-alternatives.png)

### UC-01-03 — Maintain learner profile
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Maintain display name, native language, self-assessed CEFR and goals.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-02 |
| Trigger | Learner opens Profile and chooses Edit. |
| Preconditions | Learner is authenticated and editing their own profile. |

**Basic flow — main success scenario**

1. System loads the learner current display name, native language, CEFR and goals.
2. Learner changes the supported fields and reviews the self-assessment explanation.
3. System validates the update against the authenticated identity and saves it atomically.
4. System displays the saved values and confirms the save; the header shows the new display name.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, learner cancels or makes no changes. | Leave the saved profile unchanged and return to the read view. |
| E1 | At step 3, fields are invalid or include identity/role changes. | Reject the update, show errors, and preserve the saved profile. |
| E2 | At step 3, identity expires or the save response is lost. | Require sign-in or reload the authorized profile to reconcile; keep nonsensitive draft values until resolved. |

**Postconditions — success:** Only permitted own-profile fields are updated.

**Postconditions — minimum guarantee:** No other account changes; invalid requests leave the saved profile unchanged.

**Special requirements:** CEFR is self-assessed, never certified. Native language is free text up to 64 characters; up to five goals, one per line, each up to 120 characters. Never accept user_id, role, email or password_hash as editable profile fields. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-03 basic-flow prototype](../pa3/screenshots/uc-01-03.png)

[PA3 prototype: UC-01-03 alternative and exception prototype states](../pa3/screenshots/uc-01-03-alternatives.png)

### UC-01-04 — Sign out
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** End the current session without keeping the account active in this browser.

| Field | Specification |
|---|---|
| Actors | Authenticated user |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-03 |
| Trigger | User selects Sign out. |
| Preconditions | An authenticated user has a browser session; the sign-out auth contract is available. |

**Basic flow — main success scenario**

1. System stops local media if any and closes private subscriptions/polling for this browser.
2. System submits sign-out using the current auth session and clears local credential state.
3. Server invalidates the session according to its auth contract and clears any session cookie.
4. System returns to sign-in and prevents cached private views from remaining visible.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, session already expired or was revoked. | Treat sign-out as idempotent and show the signed-out page. |
| E1 | At step 3, the network is unavailable. | Clear local access immediately, disclose that server revocation is unconfirmed, and advise signing in again to check Active sessions (UC-01-06). |
| A2 | At step 1, a LIVE room is open. | Stop this browser capture promptly and follow leave/end rules; sign-out does not authorize background recording. |

**Postconditions — success:** This browser is signed out; confirmed server revocation is reflected honestly.

**Postconditions — minimum guarantee:** Local capture and private views stop even if the server cannot be reached.

**Special requirements:** Do not claim all devices signed out. Back navigation must not reveal cached private data; no-store applies to private resources. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-04 basic-flow prototype](../pa3/screenshots/uc-01-04.png)

[PA3 prototype: UC-01-04 alternative and exception prototype states](../pa3/screenshots/uc-01-04-alternatives.png)

### UC-01-05 — Recover forgotten password
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Regain account access through a verified password-reset process.

| Field | Specification |
|---|---|
| Actors | Visitor; Learner (from Profile, Change password) |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-03 |
| Trigger | Visitor selects Forgot password, or a signed-in learner selects Change password on Profile. |
| Preconditions | The recovery screens are enabled. The API implements them; the PA3 UI keeps them switched off until real email delivery is verified. |

**Basic flow — main success scenario**

1. Visitor submits an email address to the recovery form.
2. System returns a uniform acknowledgement and sends a single-use, expiring reset code if the account is eligible.
3. Visitor enters the email, the code and a new valid password on Reset password.
4. System verifies and consumes the reset credential atomically, changes the password, ends every existing session of the account and directs the visitor to sign in.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, email is unknown or ineligible. | Show the same acknowledgement; do not disclose account existence. |
| E1 | At step 3, the code is expired, invalid or already used. | Do not change the password; offer a fresh recovery request. |
| E2 | At step 4, password is invalid or delivery/service fails. | Keep the account unchanged; show a generic recovery error or retry path without displaying the reset credential. |

**Postconditions — success:** A verified reset changes the password once; visitor signs in separately.

**Postconditions — minimum guarantee:** No password change occurs without a verified, unused recovery credential.

**Special requirements:** The backend enforces code expiry and single use and stores only code hashes. A successful reset ends every session of the account. An email-verification code is never accepted as a reset code. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-05 basic-flow prototype](../pa3/screenshots/uc-01-05.png)

[PA3 prototype: UC-01-05 alternative and exception prototype states](../pa3/screenshots/uc-01-05-alternatives.png)

### UC-01-06 — Review active sessions
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect own authenticated sessions without exposing session credentials.

| Field | Specification |
|---|---|
| Actors | Authenticated user |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-03 |
| Trigger | User opens Active sessions. |
| Preconditions | User is authenticated. |

**Basic flow — main success scenario**

1. System authorizes the current account and retrieves only its sessions.
2. System displays nonsecret session metadata and marks the current browser.
3. User inspects each device, its sign-in time and its last activity.
4. System reconciles expired sessions and shows the current authorized list.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, no other active session exists. | Show an explicit current-session-only or empty state, not sample devices. |
| E1 | At step 1, the session expires or another account is requested. | Require sign-in or deny access without returning another account session metadata. |
| E2 | At step 4, retrieval fails. | Show the error with Try again; do not imply a device was revoked. |
| A2 | At step 3, the user signs out another device. | After a separate confirmation the server ends that session, and that device must sign in again. On the current device the action is Sign out here (UC-01-04). |

**Postconditions — success:** User sees a current or explicitly stale list of their sessions.

**Postconditions — minimum guarantee:** Session credentials and other users sessions are never exposed.

**Special requirements:** Signing out one other device at a time is supported; there is no action that signs out all devices. Never show raw access/refresh tokens, token hashes or full secret cookie values. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-06 basic-flow prototype](../pa3/screenshots/uc-01-06.png)

[PA3 prototype: UC-01-06 alternative and exception prototype states](../pa3/screenshots/uc-01-06-alternatives.png)

### UC-01-07 — Delete own account and data
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Immediately disable the account and erase associated learning data within seven days.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-04 |
| Trigger | Learner selects Delete account. |
| Preconditions | Learner is authenticated as the account to delete. |

**Basic flow — main success scenario**

1. System explains immediate loss of access and deletion of associated learning data within seven days.
2. Learner reviews the affected data, enters their password and ticks a separate confirmation.
3. System verifies identity, atomically soft-deletes the account and invalidates access.
4. System schedules cascading erasure of transcripts, analysis, reports and optional chat, then shows a nonsecret confirmation.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, learner cancels. | Close the confirmation; account and data remain unchanged. |
| E1 | At step 3, identity is stale, the password is wrong or confirmation is missing. | Reject deletion and require authorized confirmation; do not enqueue erasure. |
| E2 | At step 4, erasure processing is temporarily unavailable. | Keep the account disabled, retain a retryable deletion job and expose outstanding status to authorized administration. |
| A2 | At step 3, deletion was already accepted. | Return the existing deletion outcome rather than scheduling duplicate jobs. |

**Postconditions — success:** Account access is disabled immediately and associated hard deletion is due within seven days.

**Postconditions — minimum guarantee:** Cancellation changes nothing; accepted deletion never silently restores access when a worker fails.

**Special requirements:** Confirm erasure scope across derived artifacts and future chat. The PA3 build soft-deletes the account and signs out every device at once; the scheduled hard-delete job is not built yet. Do not promise instant physical deletion or preserve shareable report links after revocation. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-07 basic-flow prototype](../pa3/screenshots/uc-01-07.png)

[PA3 prototype: UC-01-07 alternative and exception prototype states](../pa3/screenshots/uc-01-07-alternatives.png)

### UC-01-08 — Suspend or reactivate account
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Restrict or restore account access using authorized moderation.

| Field | Specification |
|---|---|
| Actors | Admin (role `ADMIN`) |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-05 |
| Trigger | Admin opens Manage accounts and looks up an account by its exact email. |
| Preconditions | Moderator/Admin is authenticated with account-moderation permission. |

**Basic flow — main success scenario**

1. System verifies role and loads the authorized moderation status.
2. Admin selects Suspend, enters a reason and confirms; or selects Reactivate.
3. System validates the transition, applies the access restriction/restoration and records the actor and reason.
4. System refreshes the account status without exposing private learning content.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, admin cancels or requests an already-applied status. | Leave status unchanged or return the existing result without duplicate action. |
| E1 | At step 1, caller lacks permission. | Deny the action without loading sensitive account details. |
| E2 | At step 3, the record changed or the write fails. | Reload the current moderation status; do not show an unconfirmed suspension/reactivation. |
| E3 | At step 1, the account found is the admin's own. | Offer no suspend or reactivate action; the server also rejects self-suspension. |
| E4 | At step 1, no account uses the email. | Say that no account uses this email; change nothing. |

**Postconditions — success:** An authorized moderation decision changes account access with an attributable record.

**Postconditions — minimum guarantee:** Unauthorized or failed requests cannot change account access.

**Special requirements:** Suspension is distinct from account deletion; reactivation does not undo a pending erasure or authorize transcript browsing. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-01-08 basic-flow prototype](../pa3/screenshots/uc-01-08.png)

[PA3 prototype: UC-01-08 alternative and exception prototype states](../pa3/screenshots/uc-01-08-alternatives.png)

## FG-02 — Topics and difficulty
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-02-01 — Browse and select topics
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Find a curated topic by category, text and CEFR before creating a room.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `PA3`; user-goal; design status, not implementation evidence |
| Requirements | FR-06 |
| Trigger | Learner opens Topics or chooses a topic while creating a room. |
| Preconditions | Learner is authenticated; curated topics or the explicitly documented seed-topic list are available. |

**Basic flow — main success scenario**

1. System displays active curated topics with category and CEFR difficulty.
2. Learner enters search text and optionally changes category/difficulty filters.
3. System returns matching active topics and shows the selected filters.
4. Learner opens a motion, reviews its detail and selects it for the room-creation form.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 3, there are no matches. | Show an empty state and Clear filters; preserve the query without inventing topics. |
| A2 | At step 2, personalized recommendations are requested. | Run UC-02-03 only when enabled; normal browsing remains available. |
| E1 | At step 4, the topic was retired after loading. | Reject selection for a new room, refresh the list and keep unrelated form choices. |
| E2 | At step 3, catalog retrieval fails. | Show a retry state; use documented seed options only when that build explicitly supports them. |

**Postconditions — success:** An active topic is selected; no room or audio is created merely by browsing.

**Postconditions — minimum guarantee:** No unavailable topic is silently substituted and no unauthorized catalog mutation occurs.

**Special requirements:** PA3 topic API/filter is extra scope; a static seed list must be labelled accurately. CEFR choices are A2/B1/B2/C1. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-02-01 basic-flow prototype](../pa3/screenshots/uc-02-01.png)

[PA3 prototype: UC-02-01 alternative and exception prototype states](../pa3/screenshots/uc-02-01-alternatives.png)

### UC-02-02 — Manage topic library
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Create, edit, tag and retire public topics without corrupting existing debate history.

| Field | Specification |
|---|---|
| Actors | Moderator / Admin |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-07 |
| Trigger | Admin selects Create, Edit or Retire topic. |
| Preconditions | Admin is authenticated and authorized to curate topics. |

**Basic flow — main success scenario**

1. System loads the authorized topic editor with motion, category, difficulty and suggested-vocabulary fields.
2. Admin enters a new motion or edits an existing topic, or selects Retire.
3. System validates the fields and asks confirmation before retiring an active topic.
4. System saves the decision and updates availability for new rooms while preserving historical debate references.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 3, retirement is cancelled. | Keep the topic active and return to the editor. |
| E1 | At step 3, required fields or CEFR tags are invalid. | Show inline errors and preserve the last committed topic. |
| E2 | At step 4, another edit won or saving fails. | Reload the current version and retain the admin draft for reconciliation. |
| E3 | At step 1, role is insufficient. | Deny access; do not expose editing controls as authorization. |

**Postconditions — success:** The validated topic change is saved and reflected in future catalog results.

**Postconditions — minimum guarantee:** Failed edits do not corrupt historical rooms or partially modify public topics.

**Special requirements:** Retirement is a state change, not a destructive delete of motions referenced by finished debates. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-02-02 basic-flow prototype](../pa3/screenshots/uc-02-02.png)

[PA3 prototype: UC-02-02 alternative and exception prototype states](../pa3/screenshots/uc-02-02-alternatives.png)

### UC-02-03 — Get personalized topic recommendations
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Find topics appropriate to self-assessed CEFR and observed practice needs.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-08 |
| Trigger | At topic discovery, learner requests Recommended topics. |
| Preconditions | Learner is authenticated; recommendations are enabled and the curated catalog is available. |

**Basic flow — main success scenario**

1. System reads the learner self-assessed CEFR and available, authorized practice observations.
2. System ranks active topics using those inputs and explains the matching reason.
3. Learner reviews or dismisses a recommendation.
4. A selected topic returns to ordinary room creation; learner may instead browse without personalization.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, no history exists. | Use the self-assessed level only and disclose the limited basis. |
| A2 | At step 2, no suitable topic is active. | Show no recommendations and offer the complete curated catalog. |
| E1 | At step 2, ranking is unavailable. | Keep browsing usable and avoid a fabricated personal rationale. |

**Postconditions — success:** Learner receives transparent optional topic suggestions or an honest fallback.

**Postconditions — minimum guarantee:** No recommendation changes the learner CEFR or forces topic selection.

**Special requirements:** This extends UC-02-01; it does not block browsing, certify ability, or infer weaknesses from another learner data. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-02-03 basic-flow prototype](../pa3/screenshots/uc-02-03.png)

[PA3 prototype: UC-02-03 alternative and exception prototype states](../pa3/screenshots/uc-02-03-alternatives.png)

### UC-02-04 — Propose a custom topic
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Submit a topic for moderation before it becomes publicly available.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, Moderator / Admin |
| Scope / kind | `stretch`; user-goal; design status, not implementation evidence |
| Requirements | FR-09 |
| Trigger | Learner chooses Propose topic. |
| Preconditions | Learner is authenticated; custom-topic moderation is enabled. |

**Basic flow — main success scenario**

1. Learner enters a proposed motion, category and suggested difficulty.
2. System validates the submission and records it as pending moderation.
3. Admin reviews the pending proposal using authorized moderation controls.
4. System publishes only an approved curated topic, or records a rejection and shows the proposer its status.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, learner cancels. | Discard the unsent draft without creating a public topic. |
| E1 | At step 2, content is empty, invalid or rate limited. | Show the reason and preserve safe draft text; no queue item is created. |
| A2 | At step 3, admin rejects or requests revision. | Keep the proposal nonpublic and show the moderation outcome to its proposer. |
| E2 | At step 4, publication fails. | Keep the proposal pending/retryable; do not list it publicly as approved. |

**Postconditions — success:** The proposal has an attributable pending, approved or rejected moderation outcome.

**Postconditions — minimum guarantee:** A learner submission is never automatically a public topic.

**Special requirements:** Stretch design only. The public-topic editor and this submission queue have different permissions. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-02-04 basic-flow prototype](../pa3/screenshots/uc-02-04.png)

[PA3 prototype: UC-02-04 alternative and exception prototype states](../pa3/screenshots/uc-02-04-alternatives.png)

## FG-03 — Room and session management
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-03-01 — Create debate room
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Create one two-person room with a chosen seeded motion and a real invitation, without starting capture.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | Revised PA4, FG-03; user-goal; target behavior, integration not yet demonstrated. |
| Requirements | FR-10, FR-12; Vision N-01 and N-02. |
| Trigger | Signed-in learner selects Create room. |
| Preconditions | A valid session and reachable room/topic services; at least one active seeded motion. |

**Basic flow — main success scenario**

1. System loads seeded motions and offers motion, format, duration and the learner's side on one setup page.
2. Learner selects an active motion, FREE_FLOW with 5/10/15/20 minutes or fixed TIMED_TURNS, and For, Against or Random.
3. Learner submits once. Server validates the settings and authenticated identity, creates LOBBY and its creator membership atomically, and generates an expiring eight-character invite.
4. System validates the response and opens `#/rooms/:id`, showing the invitation, motion, expiry and one occupied seat.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, TIMED_TURNS is selected. | Replace the length selector with About 7 minutes; use the server's fixed schedule, without automatic muting. |
| E1 | At step 1, topics are unavailable/empty. | Explain that a motion cannot be selected; retry or return Home, with no fabricated topic or room. |
| E2 | At step 3, topic/options are invalid or expired. | Show safe validation feedback; create neither room nor orphan membership. |
| E3 | At step 3, a generated invite collides. | Retry secure generation within the server's bounded policy; never expose a duplicate live code. |
| E4 | At step 4, creation response is lost, malformed or unavailable. | Apply §2.1 reconciliation; show unconfirmed creation and never blindly create another room. |

**Postconditions — success:** One LOBBY with one creator, an authoritative snapshot and a 30-minute invitation exists.

**Postconditions — minimum guarantee:** A failed transaction leaves no partial room; no token, microphone, STT or AI processing starts.

**Special requirements:** Create fields follow the current room client: topic ID, format, duration in minutes and side. Capacity is two distinct learners. Polling/readiness/consent follow §2. Screenshot or mocked success alone cannot establish persistence.

**Acceptance scenarios:** AC-01, AC-02, AC-03 in §4. Current UI source: [CreateRoomPage](../../web/src/pages/rooms/CreateRoomPage.tsx).

### UC-03-02 — Join invited room
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Preview an invitation and deliberately take the open seat, without duplicate seating or unauthorized disclosure.

| Field | Specification |
|---|---|
| Actors | Learner / Debater; Visitor proceeds through UC-01-02 first. |
| Scope / kind | Revised PA4, FG-03; user-goal; target behavior. |
| Requirements | FR-11, FR-12; Vision N-01 and N-02. |
| Trigger | Learner opens `#/join/:code` or submits a code on Home. |
| Preconditions | A valid invite is available; a verified session is required before lookup/join. |

**Basic flow — main success scenario**

1. Learner opens the invitation. If signed out, system preserves the invitation through sign-in/registration without automatically taking a seat.
2. System normalizes the code and requests an authenticated limited preview. Home remains behind an accessible join dialog.
3. Learner reviews the creator/motion/terms and selects Take the open seat.
4. Server locks the room, checks membership before new-seat allocation, and rechecks expiry and joinable state.
5. For a new second learner, server atomically reserves the seat, assigns opposing sides and moves LOBBY to READY.
6. System opens the authorized room by ID. Presence enables agreement controls, not audio capture.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2 or 4, caller already occupies a seat, including the creator using their own invite. | Return their authorized room destination; allocate no second seat or READY self-transition. |
| A2 | At step 3, learner selects Not now or Escape. | Close the dialog, restore focus and return Home; create no membership. |
| E1 | At step 2 or 4, code is wrong/expired/cancelled. | Show an unusable-invite outcome without private contents; allow another code or room creation. |
| E2 | At step 4, a third distinct learner or concurrent join loser attempts entry. | Return full/not-joinable conflict; retain exactly two seats and disclose no private snapshot. |
| E3 | At step 4, room became LIVE or terminal after preview. | Reject the new join; preview did not reserve a seat. |
| E4 | At step 5 or 6, response fails or is lost. | Reconcile through the same identity/membership before retry; no duplicate seat or repeated side assignment. |

**Postconditions — success:** Caller occupies exactly one seat; the room is READY with opposing sides, or the existing member returns to their current room.

**Postconditions — minimum guarantee:** No lookup reserves a seat, capacity never exceeds two, and sign-in does not grant consent.

**Special requirements:** Eight uppercase characters after normalization. Room IDs and invite codes have distinct purposes (§2.1). Invalid/full lookup responses must not expose private membership. UI: [JoinDialog](../../web/src/pages/rooms/JoinDialog.tsx).

**Acceptance scenarios:** AC-04 through AC-07.

### UC-03-03 — View lobby and readiness
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** See current room membership and own readiness while keeping presence separate from permission to transmit.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | Revised PA4, FG-03; user-goal; target behavior. |
| Requirements | FR-12; Vision N-01 and N-02. |
| Trigger | Participant opens/reloads `#/rooms/:id` or receives the next polled snapshot. |
| Preconditions | Current authenticated room membership. |

**Basic flow — main success scenario**

1. Server verifies membership, applies any lobby expiry and returns the current snapshot.
2. In LOBBY, system displays the giant invitation, expiry, creator seat and empty partner seat.
3. In READY, system displays both learners/sides, personal consent, microphone/type choice and independent ready states.
4. System polls every two seconds before LIVE and moves to the authoritative next view without changing the room address.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 4, guest leaves READY. | Display the reopened LOBBY and cleared readiness; show the refreshed expiry. |
| A2 | At step 1 or 4, creator cancels or lobby expires. | Show CANCELLED with a Home/create-room recovery; no media was shared. |
| E1 | At step 1, session/membership is invalid. | Use §2.5 non-disclosing recovery; show no participants or invitation. |
| E2 | At step 4, a temporary poll fails. | Retain the last snapshot, mark synchronization unavailable and retry; do not infer new consent or start. |
| A3 | At step 4, learner leaves, signs out or reaches a terminal state. | Stop polling and release any local test media. |

**Postconditions — success:** The participant sees the authorized state, with seats, consent and personal readiness separately represented.

**Postconditions — minimum guarantee:** Stale UI cannot independently authorize start/publication or expose another room.

**Special requirements:** READY is an occupied-seat state, not “both agreed”. The room page may render LIVE only after a valid authoritative snapshot; the current merged LIVE heading is not an implemented audio stage.

**Acceptance scenarios:** AC-08, AC-09, AC-21.

### UC-03-04 — Give or withdraw processing consent
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Give an informed personal decision for this debate and withdraw it without pressure or account penalty.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | Revised PA4, FG-03; user-goal; target behavior. |
| Requirements | FR-13; Vision N-02; PA4-TYPED-01 when input is TYPE. |
| Trigger | Learner checks their agreement, presses I'm ready / Not ready yet, or chooses to leave/end. |
| Preconditions | Authenticated participant can view the notice for this room. |

**Basic flow — main success scenario**

1. System explains authorized processing, actual service availability, retention/deletion and leaving, using an unchecked personal checkbox. It includes that typed debate content is saved and may be analysed later.
2. Learner deliberately agrees, then chooses VOICE and passes a local mic check or selects Type instead without a microphone request.
3. Learner presses I'm ready. Server accepts only that authenticated learner's `consent: true` and input mode through PUT ready.
4. System displays confirmed personal readiness. Before LIVE, Not ready yet invokes DELETE ready and updates the authoritative personal state.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, learner declines or leaves. | Keep own readiness false, stop any test capture and allow departure without account penalty. |
| E1 | At step 3, consent save fails or membership/notice is no longer current. | Treat consent/readiness as unconfirmed; no optimistic media start. |
| A2 | At step 4, partner is still deciding. | Show neutral readiness wording; do not nag, count down consent or infer their agreement. |
| E2 | At step 4, withdrawal races the second Ready. | Reconcile; if LIVE already committed, stop local capture and request End rather than treating the 409 as successful withdrawal. |
| A3 | During LIVE, learner withdraws. | Stop local capture immediately and end for both through UC-03-06; muting alone is insufficient. |

**Postconditions — success:** Current own consent and readiness are confirmed or withdrawn and enforced against that learner's identity.

**Postconditions — minimum guarantee:** Unknown/declined consent cannot start publication; withdrawal never depends on AI or successful local animation.

**Special requirements:** The current ready body does not carry a notice-version or mic-attestation field. Server-side durable consent/audit details require backend confirmation (§7); this document does not claim those fields are shipped. Browser mic permission remains separate from consent.

**Acceptance scenarios:** AC-10, AC-11, AC-12, AC-16.

### UC-03-05 — Start debate
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Start exactly one shared session when the second current personal readiness submission is accepted.

| Field | Specification |
|---|---|
| Actors | Learner / Debater; LiveKit Cloud for voice media. |
| Scope / kind | Revised PA4, FG-03; user-goal; target behavior. |
| Requirements | FR-12, FR-13, FR-19; PA4-TYPED-01 for type-mode start. |
| Trigger | Second participant presses I'm ready; there is no separate Start endpoint. |
| Preconditions | Two distinct authenticated participants occupy unexpired READY; each has made their own current consent/input choice; VOICE users have passed their local check. |

**Basic flow — main success scenario**

1. Server includes UC-03-13 in the same protected start decision to revalidate current state, seats, consent/input and expiry.
2. Server atomically accepts the second Ready, creates one LIVE session and records the shared start three seconds ahead.
3. Both clients load the authoritative LIVE snapshot, align to `server_now` and show a three-second countdown.
4. Authorized voice clients obtain current scoped tokens and connect to the room ID. TYPE clients receive no audio-publish grant.
5. At `started_at`, permitted microphones publish on independent tracks; the debate clock starts and the stage exposes mute, connection and End controls. Typed participation follows UC-04-05.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 1, consent, membership, expiry or readiness is invalid. | Reject with safe gate/recovery guidance; do not transition or transmit. |
| A1 | At step 2, simultaneous readiness submissions/retries occur. | Commit at most one session/start time; reconcile the same authorized snapshot without restarting the clock. |
| E2 | At step 3, a participant reloads after the start. | Load current LIVE/time; never replay a fresh three-second start; voice rejoins muted. |
| E3 | At step 4 or 5, token/media setup fails. | Show connecting/unavailable rather than healthy audio; no unauthorized fallback. Recover through UC-04-03 or allow End. |
| A2 | At step 4 or 5, one/both learners chose TYPE. | Do not request their mic or require them to pass a voice check; fully typed sessions need no audio publication. |

**Postconditions — success:** One consented LIVE session exists with one shared start time and only permitted participation modes.

**Postconditions — minimum guarantee:** Failure/race cannot bypass consent, duplicate sessions, publish early or silently switch TYPE to VOICE.

**Special requirements:** The server checks room/consent authority, not the truth of an unauthenticated client claim about mic quality. Local mic gating remains the browser's responsibility. LIVE is a session state, not proof a track is connected or STT is running.

**Acceptance scenarios:** AC-10 through AC-15.

### UC-03-06 — Leave or end debate
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Leave a pre-debate room or end the shared live session with prompt capture cleanup and an honest final view.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | Revised PA4, FG-03; user-goal; target behavior. |
| Requirements | FR-12, FR-15; Vision N-02 and N-03. |
| Trigger | Participant selects Leave/Cancel before LIVE or confirms End during LIVE. |
| Preconditions | Current participant; creator permission is required for cancellation. |

**Basic flow — main success scenario**

1. System keeps Leave/End accessible. During LIVE, End asks “End for both of you?”; confirming stops local capture promptly.
2. Server verifies caller, current state and the applicable leave/cancel/end authority.
3. Before LIVE: a guest departure clears ready flags and reopens LOBBY with a new 30-minute deadline; creator departure cancels the room and invite.
4. During LIVE: either participant ends it once; server records ENDED/end time/reason and makes further tokens and typed writes unavailable.
5. Clients disconnect media, stop all tracks/subscriptions and show wrap-up: motion, participants, actual duration and ending, with Home/new-room actions. Feedback remains explicitly unavailable until its later release.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, learner cancels the End confirmation. | Keep the consented session running with controls available. |
| E1 | At step 2, server cannot be reached. | Stop local capture now; disclose that ending for the partner is unconfirmed, and reconcile/retry when reachable. |
| A2 | At step 2, an already-ended/cancelled result is encountered. | Preserve terminal state and its original outcome; no duplicate end/analysis work or reopening. |
| A3 | At step 4, timer or disconnect grace expires first. | Keep the server's committed reason/time; show UC-03-07/UC-04-03 outcome. |
| A4 | During capture, route exit, Back or sign-out occurs. | Release local media/subscriptions immediately; notify the server where possible and let the authoritative disconnect policy cover an unconfirmed departure. |

**Postconditions — success:** A departure or terminal outcome is persisted, capture ends, and both clients can recover to an honest final view.

**Postconditions — minimum guarantee:** Exit does not wait for AI, scoring or successful network confirmation; terminal states cannot resume.

**Special requirements:** End also ends typed participation. No “report ready” or successful analysis queue is claimed in PA4. Read-token expiry alone is insufficient cleanup for an already connected media participant; server termination/revocation must be verified in integration.

**Acceptance scenarios:** AC-16, AC-17, AC-18, AC-22.

### UC-03-07 — Follow debate and turn timers
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Follow server-owned debate time without forcing silence or adding cognitive pressure.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | Revised PA4, FG-03; user-goal; target behavior. |
| Requirements | FR-14; Vision N-03. |
| Trigger | A LIVE snapshot supplies the shared start and duration. |
| Preconditions | Current room membership and authoritative timing metadata. |

**Basic flow — main success scenario**

1. System aligns the clock using `server_now`, `started_at` and authoritative duration.
2. FREE_FLOW displays overall remaining time in a quiet progress bar and digits. TIMED_TURNS also shows the current phase, side and phase time from the backend's fixed schedule.
3. System reconciles server snapshots and announces phase changes and one minute left politely; it never flashes or auto-mutes a speaker.
4. At overall expiry, server records ENDED with timer reason. Clients stop capture and show wrap-up.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 1 or 3, clock differs, browser sleeps or polling fails. | Reconcile from server time/state; mark stale timing instead of restarting or extending the debate. |
| A1 | At step 2, a turn phase expires. | Advance the guidance marker only; both retain control of their own microphones. |
| A2 | At step 4, manual End/disconnect already won. | Preserve that authoritative end reason/time and stop the timer. |
| E2 | At step 4, the server is unreachable at known expiry. | Stop local publication at the known deadline, show end confirmation pending and reconcile; never continue indefinitely. |

**Postconditions — success:** Both learners see timing derived from one server session; overall expiry ends the debate once.

**Postconditions — minimum guarantee:** Local clock manipulation, reloads and stale snapshots never create more debate time or a new start.

**Special requirements:** Exact TIMED_TURNS phase durations remain a backend-contract confirmation (§7). Do not infer an exact schedule from the About 7 minutes label or ambiguous legacy prose.

**Acceptance scenarios:** AC-14, AC-17, AC-19.

### UC-03-08 — Report abusive behavior
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Submit a room or transcript abuse report while retaining accessible leave/end controls.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-16 |
| Trigger | Learner selects Report abuse. |
| Preconditions | Learner is an authenticated participant with access to the room or transcript being reported. |

**Basic flow — main success scenario**

1. System opens a report form while preserving a readily accessible leave/end action.
2. Learner selects a reason, optionally references an authorized transcript segment and enters factual context.
3. System validates membership and stores the report for the moderation queue.
4. System confirms receipt privately without promising a verdict or forcing continued participation.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, learner cancels or chooses Leave/End. | Discard the unsent report and permit immediate exit. |
| E1 | At step 3, reason/reference is invalid or outside room access. | Reject the report with safe field feedback; expose no other transcript. |
| E2 | At step 3, reporting is unavailable or rate limited. | Show pending/not sent with a retry option; leaving remains available. |
| A2 | At step 3, a retry duplicates the same submission. | Return the existing report receipt instead of spamming the queue. |

**Postconditions — success:** An authorized report is queued with an honest receipt.

**Postconditions — minimum guarantee:** Reporting failure never blocks exit or publicly labels a participant guilty.

**Special requirements:** Report details are not posted to the opponent or fed to a public leaderboard. Moderator access is limited to the evidence needed for the case. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-03-08 basic-flow prototype](../pa3/screenshots/uc-03-08.png)

[PA3 prototype: UC-03-08 alternative and exception prototype states](../pa3/screenshots/uc-03-08-alternatives.png)

### UC-03-09 — Review abuse and close room
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Review submitted reports and apply authorized room closure with an audit record.

| Field | Specification |
|---|---|
| Actors | Moderator / Admin |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-17 |
| Trigger | Admin opens a pending abuse report. |
| Preconditions | Admin has report-review and room-closure permission. |

**Basic flow — main success scenario**

1. System loads the report and the minimum authorized supporting context.
2. Admin reviews it, chooses an outcome and records a reason.
3. For closure, system rechecks the current room and applies CANCELLED before LIVE or ENDED during LIVE.
4. System stops active transmission when needed, notifies participants neutrally and records the moderation outcome.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, report is dismissed or needs further review. | Record that outcome without changing room state or making a guilt claim. |
| A2 | At step 3, room already ended/was cancelled. | Keep the terminal state and record review without duplicate end jobs. |
| E1 | At step 1, caller lacks permission. | Deny access without disclosing evidence or participant details. |
| E2 | At step 3, closure fails. | Keep the moderation outcome pending and retry from current room state; do not announce confirmed closure. |

**Postconditions — success:** An attributable moderation outcome and any authorized closure are persisted.

**Postconditions — minimum guarantee:** No unauthorized closure or private-content disclosure occurs.

**Special requirements:** Do not add LIVE→CANCELLED to simplify closure. A moderation permission is not blanket permission to browse every learner transcript. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-03-09 basic-flow prototype](../pa3/screenshots/uc-03-09.png)

[PA3 prototype: UC-03-09 alternative and exception prototype states](../pa3/screenshots/uc-03-09-alternatives.png)

### UC-03-10 — Use private room text chat
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Exchange room chat only when enabled; keep it separate from transcript and AI inputs by default.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `post-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-58 |
| Trigger | Creator enables room chat and a participant opens it. |
| Preconditions | Post-MVP feature is separately approved and enabled; two authenticated debaters occupy the room. |

**Basic flow — main success scenario**

1. System checks creator authority and enables the private two-debater text channel.
2. Participant composes and submits a message.
3. System validates room membership and stores the message separately from the speech transcript.
4. System delivers it to the other debater; chat stays excluded from AI processing unless both separately opted in.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, creator has not enabled chat. | Show chat unavailable and accept no messages. |
| E1 | At step 3, caller is an audience member/nonparticipant or the message is invalid. | Reject submission without exposing chat history. |
| E2 | At step 4, delivery confirmation is lost. | Show pending and reconcile the message identity before retry, avoiding duplicates. |
| A2 | At step 4, either debater declines chat analysis or account data is deleted. | Exclude chat from analysis and include its stored records in the applicable deletion cascade. |

**Postconditions — success:** An authorized private message is stored separately and delivered with processing restrictions.

**Postconditions — minimum guarantee:** Chat never silently becomes transcript or AI input.

**Special requirements:** Design only; no class/group chat, audience publishing, public messaging or moderation bot is added by this use case. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-03-10 basic-flow prototype](../pa3/screenshots/uc-03-10.png)

[PA3 prototype: UC-03-10 alternative and exception prototype states](../pa3/screenshots/uc-03-10-alternatives.png)

### UC-03-11 — Practise solo with an AI opponent
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Practise with generated opponent turns after a separate TTS contract and personal capture-consent design.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider |
| Scope / kind | `post-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-59 |
| Trigger | Learner chooses Solo practice. |
| Preconditions | Post-MVP solo-practice feature, a reviewed solo consent model and a TTS adapter contract exist; learner is authenticated. |

**Basic flow — main success scenario**

1. System labels the opponent as AI and explains text generation, speech synthesis and personal audio processing.
2. Learner explicitly grants their own processing consent and initiates a local mic test.
3. System creates the separately specified solo session and obtains a bounded generated opponent turn through LLMAdapter.
4. System speaks the AI turn through the future TTS adapter and exchanges turns with the consenting learner.
5. Learner ends practice; system stops capture and shows the permitted session outcome.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 1, solo/TTS/consent prerequisites are not implemented. | Show unavailable; do not repurpose a two-human room or fake a consenting second person. |
| A1 | At step 2, learner declines or withdraws consent. | Start no capture, or stop immediately and end an active solo session. |
| E2 | At step 3 or 4, LLM/TTS fails or exceeds budget. | Stop generated audio, disclose the unavailable turn and allow a safe retry/end without fabricated responses. |

**Postconditions — success:** A separately authorized solo session finishes with the AI identity and processing basis explicit.

**Postconditions — minimum guarantee:** No other human audio is used and an AI never counts as a consenting human.

**Special requirements:** This design intentionally does not weaken the current FR-11 two-debater invariant. Solo states, TTS and token/cost controls require future architectural approval. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-03-11 basic-flow prototype](../pa3/screenshots/uc-03-11.png)

[PA3 prototype: UC-03-11 alternative and exception prototype states](../pa3/screenshots/uc-03-11-alternatives.png)

### UC-03-12 — Authorize and join audience access
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Admit capped, non-publishing audience access only with both debaters' consent.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, Audience member, LiveKit Cloud |
| Scope / kind | `post-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-60 |
| Trigger | Creator requests audience access and an invited audience member attempts to join. |
| Preconditions | Post-MVP audience feature is enabled; creator and both debaters have current room access. |

**Basic flow — main success scenario**

1. Creator sets a bounded audience allowance and explains which media/transcript would be shared.
2. Each debater independently grants or declines audience sharing.
3. System verifies both grants and audience identity/capacity before issuing subscribe-only access.
4. Audience member views only authorized media/transcript while the system enforces no publishing and no grading rights.
5. System revokes audience subscriptions when consent is withdrawn or the room ends.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, either debater declines or has not answered. | Keep audience outside the room and expose no audio or transcript. |
| E1 | At step 3, audience cap is reached or invite/identity is invalid. | Deny entry without leaking room content. |
| E2 | At step 4, audience attempts to publish or grade. | Reject the operation; audience status does not grant evaluator or debater rights. |
| A2 | At step 5, either debater revokes sharing. | Revoke access promptly; a reconnect must revalidate current grants. |

**Postconditions — success:** Authorized audience can receive only permitted content under current dual sharing consent.

**Postconditions — minimum guarantee:** Audience never occupies either debater seat, publishes audio or receives unconsented content.

**Special requirements:** Audience capacity values and revocation latency need the future media contract; no unlimited audience or account-role bypass is assumed. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-03-12 basic-flow prototype](../pa3/screenshots/uc-03-12.png)

[PA3 prototype: UC-03-12 alternative and exception prototype states](../pa3/screenshots/uc-03-12-alternatives.png)

[PA3 prototype: Future authorized subscribe-only audience scenario; both debaters independently approve sharing, no publishing or real media](../pa3/screenshots/uc-03-12-authorized.png)

### UC-03-13 — Validate start readiness
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Validate the current authority for the second Ready within the same atomic start decision.

| Field | Specification |
|---|---|
| Actors | Learner / Debater through UC-03-05; no independent user-facing Validate action. |
| Scope / kind | Revised PA4, FG-03; supporting use case, mandatory include of UC-03-05. |
| Requirements | FR-12, FR-13, FR-19; PA4-TYPED-01 for input-specific gating. |
| Trigger | UC-03-05 processes the readiness request that may start the room. |
| Preconditions | Authenticated request reaches the authoritative room transaction. |

**Basic flow — main success scenario**

1. Server locks/revalidates the room and checks that the caller is one of its two distinct current members.
2. Server checks READY and a pre-debate expiry strictly later than server time.
3. Server checks both personal consent/readiness/input records and valid VOICE/TYPE modes; the browser gates each VOICE submission on its current local mic test.
4. Server authorizes a single LIVE/start-time commit in the same transaction. Later token grants separately recheck LIVE, identity and mode before media connection.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 1 or 2, identity, seats, state or expiry is invalid. | Deny without private-data leakage; expired pre-debate rooms become CANCELLED, never LIVE. |
| E2 | At step 3, either personal consent/readiness is absent or stale. | Block start and return a safe missing-gate outcome. |
| A1 | At step 3, a participant uses TYPE. | Require their explicit consent/input, with no mic request/test or publish grant. |
| E3 | At step 4, a concurrent withdrawal/departure changed authority. | Abort/revalidate atomically; no reusable start permit from an earlier snapshot. |

**Postconditions — success:** Only the checked current transaction can authorize one start.

**Postconditions — minimum guarantee:** No independent Validate call, cached “passed” flag or stale room snapshot bypasses a failed consent/state check.

**Special requirements:** Do not invent a backend-verified microphone-quality measurement, public Validate endpoint or global media health preflight. A media connection failure after LIVE follows UC-04-03/End and cannot be described as successful audio.

**Acceptance scenarios:** AC-10 through AC-13, AC-15, AC-16.

## FG-04 — Real-time audio
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-04-01 — Select and test microphone
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Deliberately test the selected input locally and retain an accessible alternative when voice is unavailable.

| Field | Specification |
|---|---|
| Actors | Learner / Debater; browser/device as supporting environment. |
| Scope / kind | Revised PA4, FG-04; user-goal; target behavior. |
| Requirements | FR-19; Vision N-02 and N-03. |
| Trigger | Learner clicks Test microphone on the READY screen. |
| Preconditions | Room setup is open; browser supports local audio capture in its permitted context. |

**Basic flow — main success scenario**

1. System explains the local-only test. Only the explicit click requests microphone permission.
2. Learner selects an available input and speaks; system shows a local level meter.
3. System detects a usable signal and reports the check passed for that device.
4. System releases the test stream/audio context. With personal consent checked, the VOICE readiness control may now be enabled.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 1, permission/context/API is unavailable or blocked. | Show browser guidance, deliberate retry, Type instead or Leave; keep VOICE Ready disabled. |
| E2 | At step 2, device is missing/busy/unplugged or signal stays silent. | Release resources and show recovery; passing is not inferred from permission alone. |
| A1 | At step 2 or 3, learner cancels, leaves or switches to TYPE. | Release tracks/context and invalidate pending test callbacks; make no server/media request from the test. |
| A2 | After step 3, learner selects a different device. | Invalidate the old pass and test the new input before VOICE readiness. |

**Postconditions — success:** Selected device has a current local pass and test capture is released.

**Postconditions — minimum guarantee:** No test audio is uploaded, recorded, transcribed or published; failure never satisfies VOICE readiness.

**Special requirements:** READY still means both seats are occupied. Browser permission does not grant processing consent. Current local implementation: [useMicCheck](../../web/src/rooms/useMicCheck.ts); exact signal thresholds are implementation details, not a proficiency measure.

**Acceptance scenarios:** AC-10, AC-11, AC-12.

### UC-04-02 — Exchange audio and control mute
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Exchange two-way audio on isolated tracks and control only one's own microphone after dual consent and the shared start.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LiveKit Cloud |
| Scope / kind | Revised PA4, FG-04; user-goal; target behavior, real media integration pending. |
| Requirements | FR-18, FR-20; NFR-01; Vision N-03. |
| Trigger | Authorized LIVE reaches `started_at`, or a voice participant presses Mute/Unmute. |
| Preconditions | Current membership and both consents; LIVE room; valid scoped grants; local voice gate for publishing. |

**Basic flow — main success scenario**

1. Server issues a short-lived token scoped to authenticated participant identity and room ID, only while LIVE. VOICE may publish audio; TYPE may subscribe only.
2. Client connects to LiveKit; at or after the shared start, permitted voice capture publishes on that participant's own track and the partner's authorized track is subscribed.
3. System displays real connection/mute/speaking state. The learner can mute/unmute only their own audio while continuing to hear the partner.
4. The focused stage keeps End and connection recovery available. Optional STT/AI failure cannot block otherwise healthy consented audio.
5. End, revoked authorization/consent or route exit releases capture and media resources under UC-03-06.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 1, room is pre-LIVE/terminal, identity is not a member, or consent is invalid. | Deny media authorization; no token through a creator/invite shortcut. |
| A1 | At step 1 or 2, input is TYPE. | Never request/publish microphone audio or show a misleading Mute control; listening remains allowed. |
| E2 | At step 2 or 3, capture, autoplay, token or transport setup fails. | Show the actual blocked/connecting outcome and deliberate recovery; do not claim successful unmute/audio. |
| A2 | At step 3, mute is selected. | Stop transmission of own speech while preserving partner audio and a clear muted state. |
| E3 | At step 4, media drops. | Invoke UC-04-03; a transient room poll failure alone preserves healthy audio. |
| A3 | At step 4, optional video/overlays are absent. | Continue the core audio flow; future UC-04-04/UC-08-02 are not enabled by PA4. |

**Postconditions — success:** Actual consented tracks exchange audio with correct speaker identity and observable own-mute control.

**Postconditions — minimum guarantee:** No remote control of the opponent's mic, TYPE capture, pre-start publication or transmission after confirmed end.

**Special requirements:** NFR-01's median one-way latency target is at most 500 ms under the defined network test, not a measurement from this documentation task. Raw audio is not persisted by default. Show Transcribing only when a real authorized worker is running; a static design status chip is not proof of STT.

**Acceptance scenarios:** AC-13, AC-15, AC-20, AC-21, AC-22.

### UC-04-03 — Recover a dropped connection
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Restore the same authorized participant within the server's 60-second grace or end safely without restarting time.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LiveKit Cloud for media recovery. |
| Scope / kind | Revised PA4, FG-04; user-goal; target behavior. |
| Requirements | FR-15, FR-21; Vision N-03. |
| Trigger | Live participant media/session connectivity is lost, or a participant reloads LIVE. |
| Preconditions | The learner was a current participant of a LIVE room. |

**Basic flow — main success scenario**

1. System shows connection/reconnecting status and the server-owned grace deadline; the partner sees a neutral lost-connection message.
2. Client attempts bounded recovery for the same authenticated identity and room, without allocating another seat.
3. Server rechecks membership, consent, input mode, LIVE and the grace deadline; client reloads the current timer/snapshot and missed persisted typed turns where enabled.
4. If still authorized before grace expiry, client restores the same session. A voice participant returning after reload starts muted with an explicit notice; unmuting requires deliberate action.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 3, grace elapsed or room ended. | Preserve/record ENDED with the appropriate reason; stop media and show wrap-up. |
| E2 | At step 3, identity, consent or membership no longer authorizes access. | Deny recovery, release capture and use sign-in/end recovery without leaking private state. |
| A1 | At step 1, only the snapshot poll failed and media is healthy. | Mark state sync unavailable and retry the poll; do not create a media-disconnect deadline solely for this failure or tear down audio. |
| E3 | At step 2, connectivity remains unavailable. | Show recovery/end controls, keep retries bounded and allow safe local exit; client cannot extend grace. |
| A2 | At step 4, input is TYPE. | Restore turns/current state without requesting a mic; TYPE never becomes VOICE on reconnect. |

**Postconditions — success:** Same participant/seat/session resumes under current grants, or the room ends once after its authoritative deadline.

**Postconditions — minimum guarantee:** No duplicate seat, renewed consent by assumption, extended timer or reopened terminal room.

**Special requirements:** How the backend detects presence and enforces grace is an explicit integration dependency (§7). The ready/room poll endpoints alone do not prove this mechanism exists. Speech-analysis thresholds do not decide whether reconnection is allowed.

**Acceptance scenarios:** AC-14, AC-21, AC-23.

### UC-04-04 — Enable optional live video
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Add video only through a separately consented optional flow that preserves audio priority.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LiveKit Cloud |
| Scope / kind | `stretch`; user-goal; design status, not implementation evidence |
| Requirements | FR-22 |
| Trigger | Learner opts into video at media setup or during LIVE. |
| Preconditions | Optional video is explicitly enabled and separately specified; consented audio already works. |

**Basic flow — main success scenario**

1. System explains optional video sharing and requests a separate personal opt-in.
2. Learner explicitly grants camera permission and selects a device.
3. System verifies current audience/participant sharing permissions and publishes the authorized video track.
4. Learner can turn video off independently; system keeps audio controls and audio priority intact.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, learner declines or optional video is disabled. | Continue the audio-only debate with no penalty or camera request. |
| E1 | At step 2, camera permission/device fails. | Show recovery and remain audio-only; never infer permission from mic access. |
| E2 | At step 3, bandwidth degrades or sharing consent is revoked. | Stop video first and disclose its state while preserving authorized audio where possible. |

**Postconditions — success:** Only separately authorized optional video is visible and independently stoppable.

**Postconditions — minimum guarantee:** Video failure/decline never prevents the core audio workflow or activates hidden camera capture.

**Special requirements:** Stretch design; no video recording is implied. This is an extension of UC-04-02 and does not expand existing audience permissions. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-04-04 basic-flow prototype](../pa3/screenshots/uc-04-04.png)

[PA3 prototype: UC-04-04 alternative and exception prototype states](../pa3/screenshots/uc-04-04-alternatives.png)

### UC-04-05 — Participate through typed debate turns
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

**Description / goal:** Participate by typing instead of speaking, or supplement voice with a typed turn that is explicitly debate content.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | New PA4 follow-up after graded voice flow; user-goal; implementation pending. |
| Requirements | PA4-TYPED-01; supports FR-13 and FR-15; distinct from FR-58 private side chat. |
| Trigger | Learner chooses Type instead during READY or opens Type during LIVE. |
| Preconditions | Current participant; both consented to debate-content processing; server confirms LIVE before sending. |

**Basic flow — main success scenario**

1. In READY, a learner may choose TYPE for the whole debate, with no mic request/test; a VOICE learner may also open Type during LIVE without silently changing input mode.
2. During LIVE, system displays a quiet typed-turn panel/sheet with a labelled text box and Send.
3. Learner submits 1–500 characters. Server derives speaker identity from auth and validates current membership, LIVE and content length.
4. Server persists the turn as transcript content with `source = TYPED`, stable ordering and speaker attribution, then confirms the saved turn.
5. The partner receives the ordered turn and sees the writer/text in the stage spotlight. Authorized reload/cursor recovery retrieves the same saved turns without duplicate display.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 3, text is empty/too long or the room is no longer LIVE. | Reject without appending content; preserve a safe local draft and explain the recovery/ended state. |
| E2 | At step 3, caller is a nonmember or tries to spoof the speaker/source. | Deny without revealing turn history; speaker/source are server-owned. |
| E3 | At step 4, persistence/response fails or is ambiguous. | Show pending/unconfirmed and reconcile saved turns before resending; never claim saved based only on local display. Deduplication details need the backend contract. |
| A1 | At step 5, both learners use TYPE. | Display Live · Typed debate · Saved to transcript only when saving works; request no microphones and show no fluency/pronunciation claims. |
| A2 | At step 5, a TYPE learner has a VOICE partner. | Allow listening without capture, keep Type available and omit own Mute. |

**Postconditions — success:** One attributed typed turn is persisted and available to the partner and authorized reload under the same debate.

**Postconditions — minimum guarantee:** No microphone is opened for TYPE, no turn is stored outside current room authorization, and side chat is not silently analysed.

**Special requirements:** PA4-TYPED-01 is a local traceability ID for the approved room design, not a fabricated global FR-61. Backend/schema and Spec Kit owners must adopt the typed-content contract before implementation. It does not deliver speech STT or permit later fluency/pronunciation scoring of text.

**Acceptance scenarios:** AC-12, AC-24, AC-25, AC-26.

## FG-05 — Transcription and attribution
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-05-01 — View speaker-attributed live transcript
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Read partial and finalized timestamped transcript text linked deterministically to each speaker's track.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, STT / diarization provider |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-23, FR-24, FR-25, FR-26 |
| Trigger | Learner opens the live transcript while speech occurs. |
| Preconditions | Learner belongs to a consented LIVE room; authorized STT and transcript transport are available. |

**Basic flow — main success scenario**

1. System checks room membership and processing consent, then subscribes the worker to independent participant tracks.
2. STT returns timestamped partial text; system displays it with the deterministic track-linked speaker and provisional status.
3. When a final result arrives, system validates timing/confidence, persists the segment idempotently and replaces the partial text.
4. System updates both debaters views and lets the learner inspect low-confidence words or flag a mis-transcribed segment.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, both learners speak simultaneously. | Display two attributable streams with overlap metadata rather than merging speaker identities. |
| A2 | At step 3, a final/event is duplicated or replays after reconnect. | Upsert by session/speaker/sequence and de-duplicate client events; show one final segment. |
| E1 | At step 2 or 3, STT fails or timing/confidence is missing. | Mark transcription unavailable/uncertain; keep healthy audio running and do not invent text or metrics. |
| A3 | At step 4, learner flags recognition error or confidence is low. | Mark the affected span for exclusion from confirmed language criticism; preserve the original attributable evidence. |
| E2 | At step 1, consent or membership is revoked. | Stop the subscription/capture path and deny further transcript delivery. |

**Postconditions — success:** Authorized readers see speaker-linked partial/final text with honest confidence and no duplicate final segments.

**Postconditions — minimum guarantee:** No unconsented transcription or guessed speaker identity is used as confirmed learner evidence.

**Special requirements:** Partial hypotheses are not persisted. Final segments include word timing/confidence where required; preserve fillers rather than cleaning away learning signals. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-05-01 basic-flow prototype](../pa3/screenshots/uc-05-01.png)

[PA3 prototype: UC-05-01 alternative and exception prototype states](../pa3/screenshots/uc-05-01-alternatives.png)

### UC-05-02 — Review and export full transcript
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Review an authorized finished transcript and download text or Markdown.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-27 |
| Trigger | Learner opens Transcript or selects Export text/Markdown. |
| Preconditions | Learner is authenticated and is a participant in the ended debate. |

**Basic flow — main success scenario**

1. System verifies participant access and loads finalized segments in stable time/speaker order.
2. System shows speaker labels, timestamps, recognition caveats and any flagged spans.
3. Learner selects text or Markdown export and reviews its content scope.
4. System generates the authorized export and starts a local download.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, no speech or only partial transcript exists. | Show an empty/partial view and label any export accordingly; do not manufacture missing turns. |
| E1 | At step 1 or 4, membership/data availability changed or debate was deleted. | Deny access without returning transcript bytes or another participant metadata. |
| E2 | At step 4, generation/download fails. | Keep the review view usable and offer retry; do not claim a file was downloaded. |

**Postconditions — success:** Learner can review and optionally download only the authorized transcript version.

**Postconditions — minimum guarantee:** An export failure changes neither transcript nor access permissions.

**Special requirements:** No raw audio download is implied. Exported filenames and Markdown text must be safe and must not include session credentials. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-05-02 basic-flow prototype](../pa3/screenshots/uc-05-02.png)

[PA3 prototype: UC-05-02 alternative and exception prototype states](../pa3/screenshots/uc-05-02-alternatives.png)

### UC-05-03 — Use mixed-audio diarization fallback
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Recover speaker-attributed text for an explicitly supported mixed-audio input without replacing track attribution by default.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, STT / diarization provider |
| Scope / kind | `stretch`; user-goal; design status, not implementation evidence |
| Requirements | FR-28 |
| Trigger | Learner is offered the supported mixed-audio fallback after the primary track path cannot be used. |
| Preconditions | Stretch mixed-audio path is enabled and separately authorized; participants have explicitly consented. |

**Basic flow — main success scenario**

1. System explains that mixed-audio diarization has lower speaker-attribution certainty and is outside MVP scoring.
2. Learner explicitly accepts the fallback; system validates membership and current processing consent.
3. System sends only the authorized mixed stream through the configured fallback/diarization service.
4. System displays timestamped fallback text and uncertain speaker labels without treating them as deterministic track identity.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, learner declines or fallback is disabled. | Send no mixed audio; allow a safe primary-path retry or ending the session. |
| E1 | At step 3, provider is unavailable or consent is withdrawn. | Stop fallback transmission and show unavailable status without recording by default. |
| E2 | At step 4, diarization cannot confidently identify the speaker. | Show unknown/uncertain speaker and exclude the span from speaker-specific MVP scoring. |

**Postconditions — success:** An explicitly authorized fallback produces transparently limited transcript text.

**Postconditions — minimum guarantee:** The primary deterministic attribution contract is never silently replaced by statistical labels.

**Special requirements:** The proposed mixed-audio WebSocket is future-only; this use case adds no working upload endpoint to PA3. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-05-03 basic-flow prototype](../pa3/screenshots/uc-05-03.png)

[PA3 prototype: UC-05-03 alternative and exception prototype states](../pa3/screenshots/uc-05-03-alternatives.png)

## FG-06 — English language analysis
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-06-01 — Review language corrections
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Receive CEFR-appropriate grammar and vocabulary feedback quoting the learner's exact transcript.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-30, FR-31 |
| Trigger | Learner opens Language feedback. |
| Preconditions | Learner has authorized access to an ended debate with usable own finalized transcript and CEFR context. |

**Basic flow — main success scenario**

1. System loads eligible own-speaker segments and excludes flagged/low-confidence evidence from confirmed error claims.
2. Language Coach returns schema-validated grammar/vocabulary items with exact quote, correction and explanation.
3. System invokes UC-06-05 for every retained item and ranks valid findings by learning impact/frequency.
4. System displays a CEFR-appropriate number of priority items and links each to its original transcript context.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, usable speech is insufficient or no grounded issue is found. | Explain limited evidence/no retained findings; do not invent errors or issue false praise. |
| E1 | At step 2, provider times out or returns invalid schema. | Retry the schema repair once as specified; then mark the language section unavailable. |
| E2 | At step 3, quote/speaker/segment validation fails. | Discard the item with an internal reason; never display fabricated learner wording. |
| A2 | At step 4, learner inspects an uncertain or flagged transcription. | Show the recognition caveat and evidence flag workflow rather than treating the criticism as confirmed. |

**Postconditions — success:** Displayed corrections are attributable, CEFR-appropriate and paired with concrete remediation.

**Postconditions — minimum guarantee:** Unavailable analysis never becomes a fabricated correction or a zero score.

**Special requirements:** Default priority-item caps: A2 3, B1 5, B2 7, C1 10. Do not interrupt LIVE speech with dense feedback; a matched quote alone does not prove a grammar error. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-06-01 basic-flow prototype](../pa3/screenshots/uc-06-01.png)

[PA3 prototype: UC-06-01 alternative and exception prototype states](../pa3/screenshots/uc-06-01-alternatives.png)

### UC-06-02 — Review speaking metrics
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect deterministic pace, fillers, pauses, talk-time and lexical metrics with measurement limits.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-29 |
| Trigger | Learner opens Speaking metrics. |
| Preconditions | Learner can access own finalized transcript with sufficient validated word timing. |

**Basic flow — main success scenario**

1. System selects eligible speaker segments and validates word/speech-time inputs.
2. Deterministic code computes WPM, filler rate, pause profile, talk-time share, MATTR lexical diversity and mean sentence length.
3. System displays the measured values with units, sample size and short definitions.
4. Learner opens a metric explanation and the supporting transcript range.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, there is no speech or a denominator/window has insufficient data. | Display Not enough data for affected metrics; do not divide by zero or fabricate zero-performance scores. |
| E1 | At step 2, word timestamps are absent, unordered or invalid. | Mark timing-dependent metrics unavailable and expose the measurement limitation. |
| A2 | At step 3, overlapping speech occurs. | Compute each participant from their own track/timestamps and explain overlap rather than merging counts. |

**Postconditions — success:** Learner sees reproducible own-speaker measurements or explicitly unavailable values.

**Postconditions — minimum guarantee:** No LLM estimates replace missing deterministic measurements.

**Special requirements:** WPM excludes silences over 2 seconds; pauses use at least 0.8 seconds; MATTR uses window 50. Filler handling needs context for words such as like/so; metrics are formative, not proficiency certification. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-06-02 basic-flow prototype](../pa3/screenshots/uc-06-02.png)

[PA3 prototype: UC-06-02 alternative and exception prototype states](../pa3/screenshots/uc-06-02-alternatives.png)

### UC-06-03 — Review recurring language patterns
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect evidenced recurring errors within and across own debates.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-32 |
| Trigger | Learner opens Recurring language patterns. |
| Preconditions | Learner is authenticated; recurring-pattern analysis is enabled and grounded feedback exists. |

**Basic flow — main success scenario**

1. System loads only authorized retained findings from the selected debate/date range.
2. System groups comparable categories and counts distinct grounded examples.
3. System shows recurring patterns with source debate links, example quotes and a suggested practice focus.
4. Learner opens an example to inspect context or changes the comparison range.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, too few eligible findings exist. | Show insufficient history and the available examples without inventing recurrence. |
| A2 | At step 2, rubric/prompt versions or transcript eligibility differ. | Separate incompatible groups and disclose comparison limits. |
| E1 | At step 4, source evidence was deleted or flagged. | Remove/recompute the affected example/count and show unavailable evidence rather than a broken authoritative claim. |

**Postconditions — success:** Pattern summaries are backed by accessible, comparable own-speaker evidence.

**Postconditions — minimum guarantee:** No other learner history is exposed or used to infer personal weaknesses.

**Special requirements:** Avoid diagnosing a stable personal defect from one sentence. Counts are observations of retained evidence, not certified error rates. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-06-03 basic-flow prototype](../pa3/screenshots/uc-06-03.png)

[PA3 prototype: UC-06-03 alternative and exception prototype states](../pa3/screenshots/uc-06-03-alternatives.png)

### UC-06-04 — Review pronunciation assessment
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Receive separately authorized pronunciation assessment without equating accent with reasoning quality.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, Pronunciation provider |
| Scope / kind | `stretch`; user-goal; design status, not implementation evidence |
| Requirements | FR-33 |
| Trigger | Learner opts into Pronunciation assessment. |
| Preconditions | Stretch assessment provider and an explicit audio-processing consent contract are available. |

**Basic flow — main success scenario**

1. System explains the external provider, needed audio and indicative assessment limits.
2. Learner explicitly permits the assessment and initiates any required sample capture.
3. System sends only the authorized sample through the assessment adapter.
4. System shows provider-qualified word-level feedback and a concrete practice suggestion, then stops sample capture.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, learner declines or cancels. | Send no sample and keep ordinary transcript/language feedback usable. |
| E1 | At step 3, audio is unusable or provider fails. | Show insufficient audio/unavailable status, stop capture and allow a deliberate retry. |
| E2 | At step 4, provider result is unsupported/invalid. | Withhold the assessment rather than converting STT confidence into a pronunciation score. |

**Postconditions — success:** Learner receives separately authorized, clearly limited pronunciation feedback.

**Postconditions — minimum guarantee:** No undisclosed sample upload, raw-audio retention or accent-based reasoning judgment occurs.

**Special requirements:** STT confidence is not pronunciation accuracy. Provider selection, sample retention and limits require a future reviewed contract; no working provider is claimed here. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-06-04 basic-flow prototype](../pa3/screenshots/uc-06-04.png)

[PA3 prototype: UC-06-04 alternative and exception prototype states](../pa3/screenshots/uc-06-04-alternatives.png)

### UC-06-05 — Validate cited transcript evidence
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** As a mandatory feedback subcase, reject missing, empty, non-verbatim, cross-speaker or cross-segment citations.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `future-mvp`; supporting; design status, not implementation evidence |
| Requirements | FR-30, FR-37 |
| Trigger | Language/Argument feedback invokes mandatory evidence validation. |
| Preconditions | A feedback consumer supplies authorized transcript segments and a candidate item with speaker, segment and quote. |

**Basic flow — main success scenario**

1. System validates the candidate schema and requires a nonblank quote and speaker/segment reference.
2. System resolves exactly the referenced segment within the authorized transcript and verifies its speaker.
3. System checks that the quote is an exact contiguous substring of that segment without fuzzy correction or cross-segment concatenation.
4. System returns accepted evidence or a structured rejection so the parent workflow keeps only valid items.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 1, the quote is empty/whitespace or references are missing. | Reject the candidate; require a new attributable item rather than guessing evidence. |
| E2 | At step 2, the segment is absent, unauthorized, or belongs to another speaker. | Reject without leaking the other transcript or remapping speaker identity. |
| E3 | At step 3, quote is paraphrased, normalized, reordered or stitched across segments. | Reject the nonverbatim quote; do not silently rewrite it to pass. |
| A1 | At step 4, exact words match but recognition is low-confidence/flagged. | Provenance may match, but the parent eligibility policy withholds confirmed learner-error claims. |

**Postconditions — success:** Accepted evidence has a nonempty verbatim quote in the correct authorized speaker segment.

**Postconditions — minimum guarantee:** Invalid evidence never reaches learner-facing feedback as a valid citation.

**Special requirements:** Supporting behavior; the learner-facing prototype is a citation/context inspector, not a private model-debug endpoint. Grounding is provenance validation and does not establish critique correctness. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-06-05 basic-flow prototype](../pa3/screenshots/uc-06-05.png)

[PA3 prototype: UC-06-05 alternative and exception prototype states](../pa3/screenshots/uc-06-05-alternatives.png)

## FG-07 — Argument analysis
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-07-01 — Review argument structure and rebuttals
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect claims, reasons, rebuttals, relevance and evidence quality using attributable transcript context.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-34, FR-35, FR-36 |
| Trigger | Learner opens Argument analysis. |
| Preconditions | Learner may access an ended debate with sufficient eligible dialogue and topic context. |

**Basic flow — main success scenario**

1. System loads the authorized dialogue and topic with speaker/turn attribution.
2. Argument Coach identifies main claims, reasons, counterarguments, concessions and rebuttal links.
3. System validates structured output and invokes UC-06-05 for every quoted critique.
4. System displays a context-linked argument map and explanations of relevance, evidence use and unanswered points, each paired with a concrete repair.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, transcript is incomplete or speech is insufficient. | Label the analysis partial/unavailable and avoid declaring an opponent point definitively unanswered without the needed context. |
| E1 | At step 2 or 3, provider/schema/evidence validation fails. | Repair once where specified, discard invalid findings and show the section status. |
| A2 | At step 4, evidence supports multiple interpretations. | Describe the uncertainty and show surrounding turns rather than assigning hidden motives. |
| A3 | At step 4, optional fallacy analysis is requested. | Open UC-07-02 only when enabled; basic argument review remains usable. |

**Postconditions — success:** Argument findings are attributable to the dialogue and offer specific reasoning improvements.

**Postconditions — minimum guarantee:** Grammar, accent and personal traits never substitute for argument-quality evidence.

**Special requirements:** A rebuttal assessment must identify the opponent point and the learner response, not simply label a speaker weak. Detailed analysis belongs after the debate. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-07-01 basic-flow prototype](../pa3/screenshots/uc-07-01.png)

[PA3 prototype: UC-07-01 alternative and exception prototype states](../pa3/screenshots/uc-07-01-alternatives.png)

### UC-07-02 — Review potential logical fallacies
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect a potential fallacy with exact evidence, context, explanation and a specific repair.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-37 |
| Trigger | Learner opens Potential logical fallacies. |
| Preconditions | Optional fallacy analysis is enabled and the learner can access eligible argument context. |

**Basic flow — main success scenario**

1. System selects a candidate reasoning pattern with speaker and surrounding turn context.
2. Argument Coach proposes a potential fallacy label, exact quote and explanation of the reasoning failure.
3. System invokes UC-06-05 and checks that the explanation is supported by the cited context.
4. System displays the potential label, transcript link and a concrete reformulation/remediation.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, no defensible pattern is found. | Show no retained fallacy findings without inventing a label or falsely praising the entire argument. |
| E1 | At step 3, quote fails provenance or context does not justify the label. | Suppress the finding; do not accuse the learner based on a keyword alone. |
| E2 | At step 2, provider fails. | Mark optional analysis unavailable while preserving the core argument review. |

**Postconditions — success:** Any visible fallacy finding is qualified, evidenced and paired with a reasoning repair.

**Postconditions — minimum guarantee:** No personal attack, motive attribution or ungrounded accusation is displayed.

**Special requirements:** Use potential when interpretation is uncertain. Ad hominem/strawman/false-dilemma labels need actual reasoning context, not isolated wording. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-07-02 basic-flow prototype](../pa3/screenshots/uc-07-02.png)

[PA3 prototype: UC-07-02 alternative and exception prototype states](../pa3/screenshots/uc-07-02-alternatives.png)

## FG-08 — Fact checking
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-08-01 — Inspect claim verdicts and evidence
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect bounded fact checks, five-way verdicts, source snippets, uncertainty and evaluator disagreement.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider, Search / evidence provider |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-38, FR-39, FR-40, FR-41, FR-43 |
| Trigger | Learner opens Claim evidence. |
| Preconditions | Learner can access a debate with selected attributable factual claims; fact-checking is enabled. |

**Basic flow — main success scenario**

1. System ranks check-worthy factual claims, selects within the default eight-claim budget and shows which claims were checked.
2. SearchAdapter retrieves bounded source snippets for the selected claim; system sanitizes and de-duplicates external content.
3. Evidence Evaluator and Skeptic independently assess the same evidence and produce schema-valid five-way verdicts.
4. Deterministic rules preserve disagreement as Contested; system displays the verdict, uncertainty, source links and exact supporting snippets.
5. Learner inspects sources and the scope/limitations of the evidence search.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, claim is opinion, prediction, vague or below selection budget/rank. | Label Not verifiable or Not selected as appropriate; do not imply unchecked claims are true. |
| E1 | At step 2, no reliable source is found or search fails. | Show Insufficient evidence/no sources found or unavailable stage, not a source-free certainty claim. |
| A2 | At step 3, evaluators disagree. | Show both assessments and Contested rather than hiding the weaker/contradictory result. |
| E2 | At step 3, schema/provider output remains invalid after the allowed repair. | Mark that stage unavailable and keep any valid evidence explicitly partial. |
| E3 | At step 5, a source link is unavailable or content changed. | Retain the cited snippet/retrieval context with a limitation; do not claim a fresh verification. |

**Postconditions — success:** Selected claims have inspectable evidence/limitations and transparent verdict disagreement.

**Postconditions — minimum guarantee:** Search failure or model agreement never becomes proof of absolute truth.

**Special requirements:** External text is untrusted data, never instructions. Default limits: top eight claims, up to five results/query, snippets truncated to 1,000 characters. Exact snippet quotes and provenance remain visible. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-08-01 basic-flow prototype](../pa3/screenshots/uc-08-01.png)

[PA3 prototype: UC-08-01 alternative and exception prototype states](../pa3/screenshots/uc-08-01-alternatives.png)

### UC-08-02 — Show optional live fact-check overlay
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Opt into bounded live evidence overlays without delaying audio or presenting uncertain claims as settled.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider, Search / evidence provider |
| Scope / kind | `stretch`; user-goal; design status, not implementation evidence |
| Requirements | FR-42 |
| Trigger | Learner opts into live fact-check overlays. |
| Preconditions | Optional live overlay is enabled and learner is in a consented LIVE audio session. |

**Basic flow — main success scenario**

1. System explains the optional overlay, bounded claim selection and uncertain results.
2. Learner enables it; system processes eligible final turns asynchronously under the claim budget.
3. System shows a compact nonblocking evidence/status card only when a valid result exists.
4. Learner expands the evidence or hides the overlay while audio/end controls remain accessible.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, learner declines or hides the overlay. | Continue the audio debate without live cards; post-debate evidence review remains available. |
| E1 | At step 3, processing is slow, rate limited or fails. | Delay/drop optional cards and show unavailable status; never buffer or pause audio for fact checking. |
| A2 | At step 3, evaluators disagree or evidence is absent. | Show Contested/insufficient evidence, not a confident live accusation. |

**Postconditions — success:** Optional compact cards expose evidence without disrupting the debate.

**Postconditions — minimum guarantee:** Overlay availability never becomes a prerequisite for speaking or ending.

**Special requirements:** Stretch extension of UC-04-02. Keep critical feedback post-debate by default and avoid repeated alerts during socially intense discussion. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-08-02 basic-flow prototype](../pa3/screenshots/uc-08-02.png)

[PA3 prototype: UC-08-02 alternative and exception prototype states](../pa3/screenshots/uc-08-02-alternatives.png)

## FG-09 — Evaluation and consensus
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-09-01 — Review debate evaluation and consensus
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect a versioned rubric, deterministic consensus and contested flags with an honest single-judge baseline.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-44, FR-45 |
| Trigger | Learner opens Evaluation and consensus. |
| Preconditions | Learner may access an ended debate and its available versioned analysis inputs. |

**Basic flow — main success scenario**

1. System loads the versioned debate rubric and the available argument/evidence summaries.
2. Debate Judge produces six schema-valid 0–100 dimension scores per speaker: ArgumentQuality, Relevance, Evidence, Reasoning, Rebuttal and Counterarguments, with quoted/contextual rationales and qualitative fallacy/clarity notes.
3. Deterministic consensus validates score ranges, records available evaluators and flags relevant disagreement.
4. System displays dimension explanations, uncertainty and the honest single-evaluator baseline alongside source findings.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, inputs are missing or speech is insufficient. | Label evaluation partial/unavailable and do not assign a fabricated overall zero or winner. |
| E1 | At step 2, schema/range validation fails. | Use the defined one repair attempt, then mark that stage failed. |
| A2 | At step 3, a future multi-judge score spread exceeds 15/100. | Flag Contested and show the disagreement; do not silently average it away. |
| A3 | At step 4, submitted human grades have current dual sharing permission. | Offer UC-09-06 beside AI evaluation without overwriting either result. |

**Postconditions — success:** Learner can inspect a qualified, versioned evaluation and its agreement limits.

**Postconditions — minimum guarantee:** A score is never presented as certified proficiency or an undisputed factual verdict.

**Special requirements:** Architecture Section 11.3 defines six numeric dimensions per speaker—ArgumentQuality, Relevance, Evidence, Reasoning, Rebuttal and Counterarguments—each 0–100; fallacy/clarity notes remain qualitative. Both speakers therefore have twelve numeric values in a complete evaluation. MVP uses one debate judge and self-reported confidence at most 0.8; claim Evaluator/Skeptic disagreement is separate from debate-score consensus. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-09-01 basic-flow prototype](../pa3/screenshots/uc-09-01.png)

[PA3 prototype: UC-09-01 alternative and exception prototype states](../pa3/screenshots/uc-09-01-alternatives.png)

### UC-09-02 — Configure analysis and inspect usage
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Manage provider/model, prompt versions, flags and budgets without exposing secrets to the client.

| Field | Specification |
|---|---|
| Actors | Moderator / Admin |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-46 |
| Trigger | Admin opens Analysis settings or Usage. |
| Preconditions | Admin is authenticated with configuration/usage permission; versioned settings exist. |

**Basic flow — main success scenario**

1. System loads nonsecret provider/model identifiers, prompt/rubric versions, flags, evaluator count and budget settings.
2. Admin reviews aggregated usage/cost estimates and edits permitted settings.
3. System validates supported combinations, limits and feature scope and asks confirmation for an impactful change.
4. System saves a versioned configuration and shows which future jobs use it; existing results keep their recorded versions.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, admin only inspects usage or cancels editing. | Leave settings unchanged and distinguish estimates from measured token usage. |
| E1 | At step 3, provider/model/limit combination is invalid. | Reject the change with field guidance; retain the last valid configuration. |
| E2 | At step 1 or 4, role is invalid or a concurrent save/failure occurs. | Deny or reload/reconcile the current version; do not announce an unconfirmed rollout. |
| A2 | At step 2, usage data is incomplete. | Show missing periods/unknown costs rather than fabricated totals. |

**Postconditions — success:** Authorized settings are versioned and usage is inspectable without secret disclosure.

**Postconditions — minimum guarantee:** Failed configuration writes do not change the active valid settings or historical rubric provenance.

**Special requirements:** API keys belong only in server-side environment/secret management, never browser fields or screenshots. Configuring a feature cannot bypass consent or approve a deferred capability. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-09-02 basic-flow prototype](../pa3/screenshots/uc-09-02.png)

[PA3 prototype: UC-09-02 alternative and exception prototype states](../pa3/screenshots/uc-09-02-alternatives.png)

### UC-09-03 — Run optional heterogeneous judge panel
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Enable three or more different judge models only under reviewed budget and consensus rules.

| Field | Specification |
|---|---|
| Actors | Moderator / Admin, LLM provider |
| Scope / kind | `stretch`; user-goal; design status, not implementation evidence |
| Requirements | FR-47 |
| Trigger | Admin chooses a heterogeneous judge panel for an eligible ended debate. |
| Preconditions | Stretch panel feature is approved; Admin has permission and a reviewed multi-model budget/consensus policy. |

**Basic flow — main success scenario**

1. Admin selects at least three different supported judge models and a bounded budget.
2. System validates feature approval, model diversity, schemas and available quota.
3. System runs independent versioned judgments on the same eligible summaries.
4. Deterministic aggregation displays per-model outcomes, score spread, confidence policy and Contested status where required.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| E1 | At step 2, fewer than three distinct models or unsupported configuration is selected. | Reject panel activation and preserve the baseline setting. |
| E2 | At step 3, a provider fails or budget is exhausted. | Stop bounded work, expose the actual completed panel size and label the result partial. |
| A1 | At step 4, scores differ by more than 15/100. | Mark Contested and show individual scores instead of claiming consensus. |

**Postconditions — success:** A reviewed optional panel produces transparent per-model and aggregate results.

**Postconditions — minimum guarantee:** Incomplete panels never masquerade as three independent completed judges.

**Special requirements:** Not the MVP default; approval and provider configuration are prerequisites. Different prompts to one model do not meet the heterogeneous-model requirement. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-09-03 basic-flow prototype](../pa3/screenshots/uc-09-03.png)

[PA3 prototype: UC-09-03 alternative and exception prototype states](../pa3/screenshots/uc-09-03-alternatives.png)

### UC-09-04 — Assign a human evaluator
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Assign a reviewer to an ended debate only after both debaters authorize transcript and grade sharing.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, Human evaluator |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-55, FR-56 |
| Trigger | Creator requests assignment of a human evaluator. |
| Preconditions | Creator is a debater in an ENDED room; conditional human evaluation is enabled. |

**Basic flow — main success scenario**

1. Creator selects an eligible human evaluator for the finished debate.
2. System explains transcript/grade sharing and obtains explicit current approval from both debaters.
3. System verifies ENDED, creator authority, both grants and evaluator eligibility.
4. System records the assignment and grants that evaluator access only to this debate and the versioned grading card.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, either debater declines or has not approved. | Keep assignment inactive; evaluator receives no transcript or grade access. |
| E1 | At step 3, room is LIVE, caller is not creator or evaluator is ineligible. | Reject assignment without exposing private content. |
| E2 | At step 4, save fails or a sharing grant is revoked. | Keep access disabled/revoke it promptly and reconcile the assignment before retry. |

**Postconditions — success:** A named evaluator is assigned only under current dual sharing authorization for an ended debate.

**Postconditions — minimum guarantee:** No assignment preview leaks transcripts before both debaters agree.

**Special requirements:** Evaluator is a separate role from Admin. Record assignment and consent provenance; this use case does not create classes or give global learner access. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-09-04 basic-flow prototype](../pa3/screenshots/uc-09-04.png)

[PA3 prototype: UC-09-04 alternative and exception prototype states](../pa3/screenshots/uc-09-04-alternatives.png)

### UC-09-05 — Submit human grading card
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Score only an assigned ended debate using the versioned shared rubric while preserving AI grades separately.

| Field | Specification |
|---|---|
| Actors | Human evaluator |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-55, FR-56 |
| Trigger | Evaluator opens the assigned grading card. |
| Preconditions | Human evaluator is authenticated, assigned to this ENDED debate and sharing grants remain valid. |

**Basic flow — main success scenario**

1. System rechecks assignment, ended state and current sharing grants before loading the permitted transcript.
2. System displays the versioned card with the Debate Judge's six 0–100 dimensions for each speaker: ArgumentQuality, Relevance, Evidence, Reasoning, Rebuttal and Counterarguments.
3. Evaluator enters all twelve numeric values, adds evidence-based comments and qualitative fallacy/clarity notes, and explicitly submits.
4. System validates and stores the human grade separately, recording evaluator, timestamp, card version and rubric version.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 3, evaluator saves no submission or leaves the card. | Keep any unsubmitted work private; debaters see no draft grade. |
| E1 | At step 1 or 4, assignment/consent was revoked or room is not ENDED. | Deny read/write access and expose no transcript or draft grade. |
| E2 | At step 4, required dimensions or score ranges are invalid. | Show field errors and do not publish a partial grading card. |
| E3 | At step 4, response is lost or submission repeats. | Reconcile the existing submission identity rather than creating duplicate grades. |

**Postconditions — success:** A complete attributable human grade is submitted separately from AI evaluation.

**Postconditions — minimum guarantee:** No unauthorized grade, draft disclosure or overwrite of AI scores occurs.

**Special requirements:** All six dimensions from Architecture Section 11.3 are required for each speaker, with individual values in 0–100; fallacy/clarity notes are qualitative rather than additional numeric dimensions. Rubric/card versions and evaluator identity remain visible to authorized debaters. Submit is explicit; drafting never implies publication. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-09-05 basic-flow prototype](../pa3/screenshots/uc-09-05.png)

[PA3 prototype: UC-09-05 alternative and exception prototype states](../pa3/screenshots/uc-09-05-alternatives.png)

### UC-09-06 — View shared human grades
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** See submitted human and AI evaluations side by side only while dual sharing authorization permits access.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-55, FR-56 |
| Trigger | Learner opens Human grade from the evaluation view. |
| Preconditions | Learner is a debater in the ended room; a human grade was submitted and both sharing grants remain valid. |

**Basic flow — main success scenario**

1. System checks debate membership, submitted status and current dual sharing consent.
2. System loads the human grade with evaluator identity, submission time and card/rubric versions.
3. System displays human and AI evaluations side by side with their separate provenance.
4. Learner inspects dimension comments and supporting permitted transcript context.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, grading is assigned but not submitted. | Show Awaiting submission without exposing scores or comments from drafts. |
| E1 | At step 1 or 4, either sharing grant is revoked or membership is unauthorized. | Hide the human-grade content and deny further retrieval. |
| A2 | At step 3, human and AI scores differ. | Show both with their distinct rationale/versions; do not silently replace one with an average. |
| E2 | At step 2, retrieval fails. | Show unavailable/retry without leaking cached grades to an unauthorized session. |

**Postconditions — success:** Authorized learners see only submitted, currently shared human grades beside independent AI results.

**Postconditions — minimum guarantee:** No draft or revoked human grade becomes visible.

**Special requirements:** Extension of UC-09-01; human grading is not required for the core AI evaluation view to work. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-09-06 basic-flow prototype](../pa3/screenshots/uc-09-06.png)

[PA3 prototype: UC-09-06 alternative and exception prototype states](../pa3/screenshots/uc-09-06-alternatives.png)

## FG-10 — History and learning reports
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

### UC-10-01 — Review personalized learning report
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Review a post-debate summary, evidenced feedback and a concrete practice plan without fabricated completeness.

| Field | Specification |
|---|---|
| Actors | Learner / Debater, LLM provider |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-48, FR-49 |
| Trigger | Learner opens Learning report. |
| Preconditions | Learner can access their ended debate and the available transcript/analysis stages. |

**Basic flow — main success scenario**

1. System checks participation and loads stage statuses plus the learner own eligible findings.
2. System combines available summary, language metrics, argument findings, claim evidence and evaluation with explicit section provenance.
3. Learning Coach proposes a short CEFR-appropriate practice plan whose recommendations refer to grounded examples.
4. System displays the report with priority actions, transcript links and any incomplete/unavailable sections.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, processing is queued/running. | Show real stage progress and only completed sections; offer UC-10-04 when appropriate. |
| E1 | At step 2 or 3, a provider/stage fails or evidence is insufficient. | Publish a clearly partial report or insufficient-speech explanation; never invent missing findings/scores. |
| E2 | At step 3, a practice recommendation has no valid supporting evidence. | Discard/revise the recommendation rather than fabricating learner weaknesses. |
| A2 | At step 4, optional PDF export is requested. | Invoke UC-10-05 only if enabled and authorized. |

**Postconditions — success:** Learner sees an honest personalized report with evidence-linked, actionable practice.

**Postconditions — minimum guarantee:** A partial report never appears complete and private opponent details are not included beyond the authorized shared debate context.

**Special requirements:** Report generation is post-debate and asynchronous. Clinical critique requires a precise repair; do not give participation-trophy praise or certified CEFR advancement claims. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-10-01 basic-flow prototype](../pa3/screenshots/uc-10-01.png)

[PA3 prototype: UC-10-01 alternative and exception prototype states](../pa3/screenshots/uc-10-01-alternatives.png)

### UC-10-02 — Browse own debate history
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Find past authorized debates and open their transcript and report.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-50 |
| Trigger | Learner opens My debates. |
| Preconditions | Learner is authenticated. |

**Basic flow — main success scenario**

1. System retrieves only the learner participant-scoped debate history.
2. System lists topic, date, session state and report availability using stable pagination.
3. Learner selects a debate and chooses its report or transcript.
4. System rechecks resource access and opens the selected authorized detail view.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, learner has no debates. | Show an empty state and a path to topic/room creation rather than example personal history. |
| A2 | At step 2, a debate has incomplete analysis. | Show processing/partial status; opening it follows UC-10-04/UC-10-01. |
| E1 | At step 4, debate was deleted or access changed. | Remove the stale entry/show unavailable without exposing content. |
| E2 | At step 1 or 2, history loading fails. | Preserve the selected position/filter and offer retry; do not show stale history as current. |

**Postconditions — success:** Learner navigates only their authorized prior debate records.

**Postconditions — minimum guarantee:** History and detail queries cannot be widened by changing a supplied user or debate ID.

**Special requirements:** No public leaderboard, opponent profile browsing or teacher access is implied. Empty history remains empty until actual sessions exist. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-10-02 basic-flow prototype](../pa3/screenshots/uc-10-02.png)

[PA3 prototype: UC-10-02 alternative and exception prototype states](../pa3/screenshots/uc-10-02-alternatives.png)

### UC-10-03 — Review longitudinal progress
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Compare observed metrics and recurring patterns while exposing missing data and non-certified proficiency limits.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-51 |
| Trigger | Learner opens Progress and selects a time range. |
| Preconditions | Learner is authenticated; longitudinal analysis is enabled and eligible own history exists. |

**Basic flow — main success scenario**

1. System selects own eligible reports and checks metric/rubric versions for comparability.
2. System aggregates observed score/metric trends and recurring grounded patterns.
3. System plots dated observations with sample counts, missing periods and version boundaries.
4. Learner opens a point/pattern to inspect the underlying debate evidence and chooses a practice focus.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, too few comparable observations exist. | Show available sessions and Not enough comparable data; draw no fabricated trend. |
| A2 | At step 2, rubric/metric versions changed. | Separate series or label a comparison boundary; do not connect incompatible scores as continuous improvement. |
| E1 | At step 4, source data was deleted or a finding invalidated. | Recompute/remove affected observations and explain gaps. |

**Postconditions — success:** Learner can inspect measured historical patterns and their evidence limits.

**Postconditions — minimum guarantee:** No trend certifies proficiency gains or infers nonexistent past performance.

**Special requirements:** Privacy/deletion rules apply to aggregates too. Missing/failed reports are gaps, not zero scores; avoid implying statistical certainty from small samples. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-10-03 basic-flow prototype](../pa3/screenshots/uc-10-03.png)

[PA3 prototype: UC-10-03 alternative and exception prototype states](../pa3/screenshots/uc-10-03-alternatives.png)

### UC-10-04 — Track analysis status and retry
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Inspect queued/running/failed stages and request a bounded retry while keeping partial results clearly labelled.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `should`; user-goal; design status, not implementation evidence |
| Requirements | FR-52 |
| Trigger | Learner opens analysis status or selects Retry failed stages. |
| Preconditions | Learner is authenticated and authorized for the ended debate report. |

**Basic flow — main success scenario**

1. System loads actual queued, running, completed and failed stage records with permitted progress detail.
2. System marks the report partial and identifies retryable failed stages without exposing provider traces.
3. Learner requests a retry; server rechecks permission, current job state and remaining attempt/budget limits.
4. System enqueues only permitted failed work, preserves valid completed results and updates status until completion/failure.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, all stages completed. | Open the complete report and do not create another job. |
| A2 | At step 3, a retry is already queued/running or request repeats. | Return the existing job/status rather than duplicate costly work. |
| E1 | At step 3, retry is exhausted, rate limited or provider remains unavailable. | Explain the bounded retry state and preserve the labelled partial report. |
| E2 | At step 4, enqueue fails or source data was deleted. | Keep the old valid sections, show the failed retry accurately and do not claim regeneration completed. |

**Postconditions — success:** A bounded retry has an actual job/status and completed valid results remain available.

**Postconditions — minimum guarantee:** Repeated clicks cannot create unbounded provider calls or turn an incomplete report into a fake success.

**Special requirements:** Stage retry policy and usage are server-controlled. Deletion wins over regeneration; never recreate erased learner data from stale jobs. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-10-04 basic-flow prototype](../pa3/screenshots/uc-10-04.png)

[PA3 prototype: UC-10-04 alternative and exception prototype states](../pa3/screenshots/uc-10-04-alternatives.png)

### UC-10-05 — Export report PDF
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Download an authorized report without silently including other learners' private details.

| Field | Specification |
|---|---|
| Actors | Learner / Debater |
| Scope / kind | `stretch`; user-goal; design status, not implementation evidence |
| Requirements | FR-53 |
| Trigger | Learner selects Export PDF from report review. |
| Preconditions | Learner can access a report; optional report-PDF export has been implemented. |

**Basic flow — main success scenario**

1. System rechecks report ownership/membership and loads the selected report version.
2. System displays which sections and limitations will be included, with any partial status retained.
3. Learner confirms export; system creates the authorized PDF with evidence links and version/date context.
4. System starts the download without creating a public sharing link.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, report is partial. | Offer a clearly labelled partial export or wait; never title it complete. |
| E1 | At step 1 or 3, access was revoked or data deleted. | Cancel export and deliver no report bytes. |
| E2 | At step 3 or 4, rendering/download fails. | Show retryable export failure; the saved report stays unchanged. |

**Postconditions — success:** An authorized local PDF preserves report provenance and limitations.

**Postconditions — minimum guarantee:** No export leaks secrets, unshared human grades or unrelated opponent data.

**Special requirements:** Stretch product feature; distinct from compiling PA3 submission documents with latexmk. A local download is not consent to publish the report. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-10-05 basic-flow prototype](../pa3/screenshots/uc-10-05.png)

[PA3 prototype: UC-10-05 alternative and exception prototype states](../pa3/screenshots/uc-10-05-alternatives.png)

### UC-10-06 — Process deletion and retention requests
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Apply authorized erasure and retention policies across transcripts, analyses, reports and optional chat.

| Field | Specification |
|---|---|
| Actors | Moderator / Admin |
| Scope / kind | `future-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-54, FR-04 |
| Trigger | Admin opens the deletion queue or a retention item becomes due. |
| Preconditions | Admin has deletion/retention permission and an authorized request or due retention record exists. |

**Basic flow — main success scenario**

1. System verifies request provenance, affected identity and applicable retention/deletion policy.
2. Admin reviews the scoped records and confirms the authorized erasure/policy action.
3. System disables affected access and schedules/removes transcript, analysis, report, derived aggregates and optional chat according to the request.
4. System verifies progress, records noncontent audit status and shows completed or outstanding deletion work.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 2, admin cancels a not-yet-accepted manual action. | Do not widen erasure scope; an existing accepted account-deletion deadline still applies. |
| E1 | At step 1, requester/role/scope is invalid. | Deny action without exposing unrelated private records. |
| E2 | At step 3 or 4, a store/worker fails. | Keep access revoked, retain retryable scoped work and expose the outstanding deadline rather than claiming completion. |
| A2 | At step 3, records are already erased. | Treat the erasure idempotently and confirm absence without recreating data. |

**Postconditions — success:** Authorized erasure/retention is applied with verifiable completion or explicit outstanding work.

**Postconditions — minimum guarantee:** A deletion failure never restores access or silently leaves derived private artifacts visible.

**Special requirements:** Default transcript retention is 90 days and user-configurable; accepted account hard deletion is due within seven days. Audit status must not retain erased transcript/quote contents. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-10-06 basic-flow prototype](../pa3/screenshots/uc-10-06.png)

[PA3 prototype: UC-10-06 alternative and exception prototype states](../pa3/screenshots/uc-10-06-alternatives.png)

### UC-10-07 — View consented student dashboards
*Performed (PA3 baseline): Trần Lê Anh Tuấn (24125107) | Reviewer (PA4): Nguyễn Đình Thiên Lộc (24125093) | Edited (PA4 references): Trần Lê Anh Tuấn (24125107)*

**Revision status:** Retained from PA3; functional behavior and original priority unchanged. Historical implementation notes are not new SCRUM-54 test results.

**Description / goal:** Give read-only access only for students who already joined a class and explicitly shared; revoke access at any time. Class creation, rosters and assignments remain undesigned.

| Field | Specification |
|---|---|
| Actors | Teacher, Learner / Debater |
| Scope / kind | `post-mvp`; user-goal; design status, not implementation evidence |
| Requirements | FR-57 |
| Trigger | Student chooses dashboard sharing or Teacher opens a consented student dashboard. |
| Preconditions | Post-MVP dashboard sharing is separately approved; student already joined a class and authenticated Teacher has an existing relationship. |

**Basic flow — main success scenario**

1. Student reviews the read-only sharing scope and explicitly grants or revokes dashboard access.
2. System verifies the existing relationship and current student sharing decision for each Teacher request.
3. System shows only the allowed dashboard/report summary in a read-only view with student identity and sharing status.
4. Student can revoke access at any time; system blocks subsequent reads and clears the Teacher view on refresh/update.

**Alternative and exception flows**

| Branch | Condition / extension point | Outcome and recovery |
|---|---|---|
| A1 | At step 1, student declines or has not joined the relevant class. | Show no accessible dashboard; do not infer sharing from institutional membership. |
| E1 | At step 2 or 4, consent is revoked, relation absent or Teacher identity is invalid. | Deny access and expose no student report data. |
| E2 | At step 3, Teacher attempts edit/delete/comment. | Reject the write; dashboard sharing grants read-only authority. |
| A2 | At step 3, no report exists or loading fails. | Show empty/unavailable data, never example student performance. |

**Postconditions — success:** Only a currently authorized Teacher can read the explicitly shared existing dashboard.

**Postconditions — minimum guarantee:** No class membership alone exposes student learning data and no write authority is granted.

**Special requirements:** Design-only FR-57 boundary. Class creation, rosters, invitations and assignments remain undesigned long-term goals; this use case neither implements nor models those workflows. Shared permission, consent, accessibility and failure contracts in Section 2 apply.

**Historical UI prototype references:** The linked PA3 design states are retained for reference only; they do not show current service/media completion.

[PA3 prototype: UC-10-07 basic-flow prototype](../pa3/screenshots/uc-10-07.png)

[PA3 prototype: UC-10-07 alternative and exception prototype states](../pa3/screenshots/uc-10-07-alternatives.png)

## 4. Acceptance scenarios for the revised slice
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

These are executable acceptance criteria for feature owners to verify against the real API/database/media services. They have **not** been run as full-stack tests by this documentation ticket. Source-inspected mocked browser tests can support a UI claim only; they cannot prove persistence, consent enforcement, isolation or LiveKit transport.

| ID | Given / when | Required observable result |
|---|---|---|
| AC-01 | Signed-in learner creates FREE_FLOW with an active motion and supported length/side. | One persisted room/creator seat; returned ID opens LOBBY and invitation; no media request. |
| AC-02 | Invalid motion/options or colliding generated invitation. | Invalid input creates no partial record; collision is retried safely without duplicate invitation. |
| AC-03 | Room creation response is lost or malformed. | Outcome remains unconfirmed until reconciled; no automatic duplicate creation. |
| AC-04 | Signed-out learner follows an invitation, signs in and explicitly joins. | Invite destination survives; exactly one deliberate seat allocation reaches READY. |
| AC-05 | Creator/existing guest opens the same invitation or repeats Join. | Return the same room/seat without capacity increase or second side assignment. |
| AC-06 | Two different guests race for one free seat; a third tries afterward. | At most one wins; DB retains exactly two distinct participants; loser learns no private snapshot. |
| AC-07 | Code is wrong, expired, cancelled, or room became LIVE after preview. | No new membership; safe explanation and another-code/Home/create recovery. |
| AC-08 | Guest leaves READY or creator leaves/cancels before LIVE. | Guest: LOBBY, both ready flags cleared, fresh 30-minute expiry. Creator: CANCELLED, invite invalid. |
| AC-09 | Participant poll fails temporarily or nonmember reads a room. | Temporary failure is marked stale; unauthorized read reveals no room/participant data. |
| AC-10 | READY screen mounts or consent checkbox is checked without Test. | Zero microphone requests/publications; VOICE Ready stays disabled until the selected-device test passes. |
| AC-11 | Test passes, is denied/silent, device changes, or learner leaves during permission resolution. | Resources always release; only a current pass unlocks VOICE; denial/silence offer recovery without loops. |
| AC-12 | Learner selects Type instead and gives consent; one/both choose TYPE. | No mic request/test required for TYPE; readiness uses TYPE; any media token is subscribe-only. |
| AC-13 | Participant is missing consent or both Ready calls race. | Missing consent cannot start. Otherwise one session and one shared start three seconds ahead; no early publication. |
| AC-14 | Browser reloads LIVE or its clock differs. | Same room/time; no new countdown/session; voice rejoin is muted with a visible notice. |
| AC-15 | Nonmember, READY participant, terminal room or TYPE participant requests a publish token. | Unauthorized token/publish is denied; legitimate LIVE token uses room ID and current identity, never the invite code. |
| AC-16 | Ready withdrawal races second Ready, or consent is withdrawn during LIVE. | Authoritative state is reconciled; if LIVE, local capture stops and shared End is requested. |
| AC-17 | Timer expires, manual End races it, or End repeats. | One terminal outcome with stable end metadata; no further publication/turns and no reopened state. |
| AC-18 | End request cannot reach the server. | Local capture stops immediately; UI says partner ending is unconfirmed; later state reconciliation occurs. |
| AC-19 | TIMED_TURNS phase changes or device sleeps/resumes. | Actual server schedule is restored; neither phase change nor advice auto-mutes a debater. |
| AC-20 | Two consented VOICE learners use real isolated tracks and toggle mute. | Both hear the partner; only own speech transmission changes; speaking/mute state matches tracks. |
| AC-21 | Snapshot polling fails while audio remains healthy; actual media then disconnects. | Poll failure preserves audio. Real disconnect uses visible server-owned grace and bounded recovery. |
| AC-22 | Back, route exit, sign-out or confirmed End occurs during capture. | Local tracks/context and media subscriptions release; a confirmed end stops both participants' media. |
| AC-23 | Same learner reconnects before/after the 60-second deadline. | Before: same seat/time/current grants. After: ENDED and no media; no client extension of grace. |
| AC-24 | Participant sends 1–500 characters during LIVE and partner reloads. | One ordered, attributed TYPED record persists and is recovered without duplicate display. |
| AC-25 | Empty/oversize text, forged speaker/nonmember write, or terminal write is attempted. | Reject with no appended record or history leakage; typed text is rendered as text. |
| AC-26 | Typed-send response is lost or service is unavailable. | Mark pending/unconfirmed; reconcile saved content before resend, never claim unsaved text persisted. |

Accessibility checks apply to all scenarios: keyboard/focus and dialog recovery, 320px reflow, reduced motion, neutral consent wording and accessible safe exit. Audio latency must be measured separately under NFR-01; a functional exchange alone does not establish the latency target.

## 5. Implementation evidence at the PA4 base
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Evidence cutoff: `7676197` (origin/pa4 fetched on 2026-11-23). The table records source inspection; no new runtime product verification is implied.

| Area | Source evidence | Limit / remaining work |
|---|---|---|
| Room setup, lookup/join and invitation | `web/src/pages/rooms/CreateRoomPage.tsx`, `JoinDialog.tsx`, `InviteView.tsx`; room client in `web/src/rooms/api.ts`. | Frontend requests exist; merged backend room persistence is absent. |
| Personal agreement and local microphone check | `web/src/pages/rooms/AgreeView.tsx`, `web/src/rooms/useMicCheck.ts`; `web/tests/room-agree.spec.ts`. | Browser-test definitions mock the service/mic boundary; they are not proof of dual-browser enforcement. TYPE selection is not implemented in the merged Agree view. |
| Polling/state vocabulary | `web/src/rooms/useRoom.ts`, `contracts.ts`. | Two-/five-second intervals and target snapshot types exist; backend authority and invalidation need integration. |
| LIVE/ENDED UI | `web/src/pages/rooms/RoomPage.tsx`. | Current fallback renders the motion heading. A functioning stage, token exchange, timers and wrap-up are not claimed. |
| Room/media/turn backend | `api/authify/src/main/java/org/debatespeak/authify/`. | Merged code contains account services, not room, LiveKit-token or typed-turn services; design paths are targets. |
| Typed content and STT/AI | Approved room design; no typed-turn methods in the merged room client. | Typed persistence/delivery remains a follow-up. STT/AI/report availability cannot be inferred from consent wording or a future status chip. |

Tuấn owns this analysis revision. Nguyễn Bảo Minh Triết (24125047), Frontend & WebRTC/Audio Lead, owns frontend. Nguyễn Hồng Tấn Tài (24125078), Backend & Real-Time Media Lead, owns backend contracts and room/media implementation. Nguyễn Anh Khoa (24125058), AI Audio & Speech Pipeline Lead, owns the assigned Spec Kit artifacts. Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead, owns checklist/freeze and this ticket's assigned peer review. This document neither changes those assignments nor updates someone else's checklist.

## 6. Consistency with the Vision and PA3
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

| Vision need / existing scope | PA4 revision |
|---|---|
| N-01: practice with a real person | Preserve two authenticated distinct learners, seeded motion setup and deliberate invite joining. |
| N-02: control capture, processing and retention | Separate seats, consent, mic test, input mode and actual publication; expose withdrawal/exit and actual service availability. |
| N-03: intelligible conversation and recovery | Isolated tracks, own mute, safe polling failures, shared time and bounded reconnection; no coaching interruptions or automatic muting. |
| N-04–N-06: learning feedback and history | Retain later-product specifications with grounding and uncertainty guards; PA4 wrap-up does not pretend a report exists. |
| N-07: safety and operating controls | Preserve authorized moderation designs as deferred; safe leaving does not wait for abuse-report delivery. |
| PA3 FG-01 delivery | Retain account use cases and known limitations; no new account/backend implementation is introduced. |
| Private chat FR-58 | Remains a separate deferred channel; UC-04-05 typed debate content has its own explicit consent/persistence semantics. |

The full-product vision remains broader than PA4. Old PA3 statements that FG-03 is the current PA3 focus and roadmap statements that PA4 delivers FG-04/FG-05 are historical inconsistencies, not completion evidence. This revision explicitly names the actual PA3 FG-01 baseline and current PA4 FG-03/FG-04 target.

## 7. Owner confirmations and review handoff
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

The following cross-owner items require contract/implementation confirmation outside SCRUM-54:

| Item | Required confirmation / integration action |
|---|---|
| Older room documentation | Backend/spec owners reconcile WAITING/IN_DEBATE, POST ready/start, invite-code media rooms and token-on-create wording with current LOBBY/READY/LIVE, PUT ready and room-ID token rules. |
| TIMED_TURNS schedule | Backend owner provides exact phase durations/turn ownership and authoritative schedule; About 7 minutes is a UI label, not an exact tested timing contract. |
| Consent persistence and revocation | Backend owner confirms durable current consent, withdrawal/start race handling, and active LiveKit participant cleanup; browser flags and short token expiry alone do not prove enforcement. |
| Ambiguous POST outcomes | Backend/frontend owners define creation and typed-send reconciliation/deduplication so retries do not duplicate content. No undocumented endpoint or idempotency field is asserted here. |
| Presence / disconnect grace | Backend owner defines authoritative presence detection and the 60-second deadline. Snapshot polling failure alone is not media disconnection. |
| Spec Kit paths and ticket references | New plan uses `specs/006-fg03-rooms/` and `specs/007-fg04-audio/`; older TODO files still say 003/004. Those directories are not yet present at the base; implementation owners reconcile their own ticket/spec references. |
| TA comments and peer review | Incorporate any actual later PA3 TA feedback with source in Changes.md. Lộc reviews this revision; assigned reviewer attribution never means review already occurred. |

These items do not change another owner's code or mark feature acceptance complete. Document checks and PDF-build results belong to Changes.md; product acceptance remains AC-01–AC-26 pending real implementation/integration evidence.
