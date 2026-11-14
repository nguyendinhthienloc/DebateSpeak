# Feature Specification: Frontend baseline

Created: 2026-11-14. Status: retrospective record of the current frontend.
Feature: `001-frontend-baseline`. Existing branch: `feature/UI-scaffold`.

This records work already built; it does not claim Spec Kit preceded that work.
The user approved frontend-only account forms. Backend integration is unfinished.

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

### Key Entities

Learner account; temporary signed-in session; email code; local room settings.
Room examples are sample content, not saved rooms.

## Success Criteria

- SC-001: All listed account journeys reach their expected success/recovery state.
- SC-002: Screens fit 320px and desktop widths without horizontal scrolling.
- SC-003: Forms work with a keyboard and announce errors or confirmations.
- SC-004: Exploring previews creates no rooms and requests no microphone access.

## Assumptions

English-only responsive web UI. Email delivery, account persistence, verification
enforcement, refresh/logout, live rooms and audio are outside this baseline.
Controlled-response browser checks establish frontend behavior, not live integration.
