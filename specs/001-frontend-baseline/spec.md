# Feature Specification: Frontend baseline

Created: 2026-11-14. Status: retrospective record of the current frontend.
Feature: `001-frontend-baseline`. Existing branch: `feature/UI-scaffold`.

This records work already built; it does not claim Spec Kit preceded that work.
The user approved frontend-only account forms. Backend integration is unfinished.

Revision 2026-11-14: account verification success and Profile must expose a
Change password link to the password-reset request. That request issues a
separate reset code; email verification never authorizes a password change.
Preserve the email in memory between recovery steps, clear codes/passwords on
navigation, and never use URLs or storage for credentials. Frontend source and
browser evidence govern implementation; Figma is updated only on explicit request.
Successful password reset clears any existing frontend session; server-side
session revocation remains a backend requirement.

Revision 2026-11-14 (FG-01 account management scaffold): add API-ready screens
for the remaining FG-01 use cases (UC-01-03 profile, UC-01-04 sign out, UC-01-06
active sessions, UC-01-07 account deletion, UC-01-08 admin suspend/reactivate)
and restore a session on reload through the refresh cookie (FR-01). Endpoints
follow SOFTWARE_ARCHITECTURE_SPEC §14 and the account-management section added
on this date. Backend implementation is still absent; screens show success only
after validated responses.

## User Scenarios & Testing

### US1 — Create an account and sign in (P1)

Learners can create an account and sign in before practising with a partner.
This is the first usable account journey.

Acceptance: successful registration opens sign-in with the email prefilled;
successful sign-in opens rooms with the learner’s name. Invalid details show
recoverable errors. Failed requests never show success. Reload requires sign-in.
Independent check: register and sign in with controlled service responses.

### US2 — Verify email and recover access (P1)

Learners can request an email code, verify their email or choose a new password.
This restores access without exposing whether someone else has an account.

Acceptance: requests show neutral confirmation; valid code submission shows
success; an expired code offers a new request. Reset does not sign the user in.
Independent check: request a code and submit valid, invalid and expired codes.

### US3 — Explore room setup and account previews (P2)

Learners can explore room setup, invitations, lobby outcomes and their profile.
These screens communicate the intended experience before room services exist.

Acceptance: room settings update the local preview; duration stays within
1–30 minutes; opposite stances are shown. Reload resets settings. Profile saving
and audio checks stay disabled. No room creation or microphone use is claimed.
Independent check: change settings and navigate sample waiting/ready/full/expired
screens, then reload and confirm the preview resets.

### US4 — Manage my account (P2)

Signed-in learners can keep their profile current, sign out, review and revoke
active sessions, and delete their account. Administrators can suspend and
reactivate accounts.

Acceptance: reload restores the session only when `/auth/refresh` succeeds.
Profile loads from and saves to `/users/me`. Sign out always clears the local
session and says so if the server did not confirm. Sessions list shows the
current device and can revoke others; revoking the current one signs out.
Deletion needs the password and an explicit confirmation, then signs out.
Admin tools appear only for `ADMIN` users; the server still authorizes them.
A 401 on any signed-in request ends the session and asks for sign-in again.
Signed-out visits to these screens offer sign-in; Profile keeps its labelled sample.
Independent check: controlled responses for each endpoint, success and failure.

### Edge Cases

Empty/invalid input, double submission, unavailable service, timeout, throttling,
malformed response, expired session/code, direct links, unknown routes, narrow
screens and keyboard-only use must leave a clear recovery path.

## Requirements

- FR-001: Account forms show success only after an accepted service response (US1–2).
- FR-002: Errors retain editable input and focus the first invalid field (US1–2).
- FR-003: Passwords/codes are never stored in browser storage or navigation links (US1–2).
- FR-004: All screens use the established Cream & Yellow style and keyboard controls (US1–3).
- FR-005: Room/profile examples remain visibly labelled previews (US3).
- FR-006: Account and preview journeys never start microphone capture (US1–3).
- FR-007: Signed-in requests send the access token only in the `Authorization`
  header; the refresh token stays in an HttpOnly cookie the frontend never reads (US4).
- FR-008: Destructive actions (delete account, revoke session, suspend) require
  an explicit confirmation step and show the consequence before submitting (US4).
- FR-009: Saving the profile keeps the signed-in role when the profile response
  omits `role`; an admin cannot suspend their own account from the UI (US4).

### Key Entities

Learner account; temporary signed-in session; email code; local room settings;
learner profile (display name, native language, CEFR level, goals); active
session (one refresh-token family); admin account view.
Room examples are sample content, not saved rooms.

## Success Criteria

- SC-001: All listed account journeys reach their expected success/recovery state.
- SC-002: Screens fit 320px and desktop widths without horizontal scrolling.
- SC-003: Forms work with a keyboard and announce errors or confirmations.
- SC-004: Exploring previews creates no rooms and requests no microphone access.

## Assumptions

English-only responsive web UI. Email delivery, account persistence, verification
enforcement, live rooms and audio are outside this baseline. Refresh, logout,
profile, sessions, deletion and admin calls are frontend-ready but need the backend.
Controlled-response browser checks establish frontend behavior, not live integration.
