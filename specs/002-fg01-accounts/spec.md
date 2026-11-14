# Feature Specification: FG-01 accounts end to end (PA3 Part E)

Created: 2026-11-14. Feature: `002-fg01-accounts`. Status: backend on
`backend-tai`, verified end to end on 2026-11-14 (JDK 17, PostgreSQL 16, real browser); see [tasks](tasks.md).

PA3 Part E grades one functional group across UI, API and data persistence.
FG-03 has no room API, so Part E is FG-01 (accounts and profiles, UC-01-01 to
UC-01-08). The frontend half is specified in
[001-frontend-baseline](../001-frontend-baseline/spec.md) (US1, US4). This
feature adds the API and database half against the same contract.

This spec was written after most of the code. It records the agreed contract;
it does not claim that Spec Kit preceded the backend work.

## User Scenarios & Testing

### US1 — Register and sign in (P1)
A learner registers with email, password, display name and CEFR level, then
signs in. The account survives a backend restart.
Independent check: register, restart the API, sign in with the same password.

### US2 — Stay signed in and sign out (P1)
After sign-in, reloading the page keeps the learner signed in through the
HttpOnly refresh cookie. Sign out ends that session on the server.
Independent check: sign in, reload (still signed in), sign out, reload (signed out).

### US3 — Manage the profile (P2)
A signed-in learner reads and edits display name, CEFR level, native language
and goals. Email and role cannot be changed here.
Independent check: save, reload, values persist.

### US4 — Manage sessions and delete the account (P2)
A learner lists signed-in devices, signs out another device, or deletes the
account with their password.
Independent check: two browsers; revoke one from the other; it must sign in again.

### US5 — Recover access (P3)
Request a reset code by email, reset the password, verify an email address.
Both code requests return 202 whether or not the email exists.
Independent check: real email received; old password rejected after reset.

### US6 — Admin suspends and reactivates (P3)
An `ADMIN` finds an account by email, suspends it with a reason, or reactivates
it. A suspended user cannot sign in (403 `account_suspended`). An admin cannot
suspend their own account.

### Edge Cases
Duplicate email (409), wrong password (401), invalid fields (422), expired or
reused code, refresh-token replay, wrong delete password (403), non-admin on
`/admin/*` (403), unknown email on admin lookup (404).

## Requirements

- FR-001: Endpoints, request/response shapes and status codes follow
  [web/API_CONTRACT.md](../../web/API_CONTRACT.md) and
  [web/API_INTEGRATION.md](../../web/API_INTEGRATION.md) exactly.
- FR-002: Users, sessions, codes and suspensions persist in PostgreSQL 16.
- FR-003: Passwords and codes are stored only as hashes.
- FR-004: Access JWTs are short-lived and sent only as `Authorization: Bearer`;
  refresh tokens live only in an HttpOnly cookie and rotate on use.
- FR-005: `/users/me`, `/auth/sessions` and `/admin/*` reject requests without
  a valid access token; `/admin/*` also requires role `ADMIN`.
- FR-006: Secrets (JWT key, mail credentials, database password) come from
  environment variables, never from committed files.

## Key Entities

User (`users`), session = refresh-token family (`auth_sessions`), one-time code
(`auth_codes`), suspension audit row (`account_suspensions`). Details: [plan](plan.md).

## Success Criteria

- SC-001: Every 001 account screen works against the real API with no mocks.
- SC-002: Data survives an API restart.
- SC-003: The narrated video shows US1–US4 and US6 working.

## Out of scope (PA3)

FG-03 room API, data export before deletion, cancelling deletion, admin user
list and audit view, consent controls (FG-01 N-02).
