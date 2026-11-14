# Tasks: FG-01 accounts end to end

Checked = done and visible in the repository. Unchecked = still to verify or do.
Frontend tasks are in [001 tasks](../001-frontend-baseline/tasks.md).

## Setup

- [x] T001 Spec, plan and tasks for the FG-01 backend slice (this folder).
- [ ] T002 Commit `api/authify` sources, `pom.xml` and Maven wrapper; ignore `target/` (Tài).
- [ ] T003 Move JWT and mail secrets to environment variables; add placeholders to `.env.example` (Tài).

## Data

- [x] T004 Entities and repositories for `users`, `auth_sessions`, `auth_codes`, `account_suspensions` (compiled on `backend-tai`).
- [ ] T005 Run against `docker compose up -d db` and confirm tables are created.

## US1–US2 Access and sessions

- [x] T006 Register, login, refresh (rotating cookie), logout endpoints.
- [ ] T007 Verify reload keeps the session and sign out ends it, using the real API.

## US3–US4 Profile, sessions, deletion

- [x] T008 `/users/me` GET/PATCH/DELETE, `/auth/sessions` list and revoke.
- [ ] T009 Verify with two browsers: revoke one session from the other.

## US5 Recovery

- [x] T010 forgot-password, resend-verification, verify-email, reset-password with hashed one-time codes.
- [ ] T011 Enable recovery in the frontend (`RECOVERY_ENABLED` in `web/src/pages/RecoveryPage.tsx`) after a real email is received.

## US6 Admin

- [x] T012 Admin lookup, suspend with reason, reactivate; self-suspension rejected.
- [ ] T013 Verify a suspended user gets the suspended message at sign-in.

## Polish

- [ ] T014 Restrict CEFR to A2–C1 to match the contract.
- [ ] T015 Record the narrated video of US1–US4 and US6 (Part E).
