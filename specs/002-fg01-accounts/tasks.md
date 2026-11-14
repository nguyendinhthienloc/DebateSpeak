# Tasks: FG-01 accounts end to end

Checked = done and visible in the repository. Unchecked = still to verify or do.
Frontend tasks are in [001 tasks](../001-frontend-baseline/tasks.md).

## Setup

- [x] T001 Spec, plan and tasks for the FG-01 backend slice (this folder).
- [x] T002 Commit `api/authify` sources, `pom.xml` and Maven wrapper (Tài, commit `3f5e8f1`).
- [x] T002a Merge `backend-tai` without `target/` and the unrelated `slide.md`; set Java 17 in `pom.xml`.
- [x] T003 Read the JWT key and mail credentials from environment variables; placeholders in `.env.example`.
- [ ] T003a **Urgent (Tài):** revoke the Gmail app password and stop using the old JWT key; both remain in the `backend-tai` commit history.

## Data

- [x] T004 Entities and repositories for `users`, `auth_sessions`, `auth_codes`, `account_suspensions` (tables created in PostgreSQL).
- [x] T005 Run against `docker compose up -d db` and confirm tables are created.

## US1–US2 Access and sessions

- [x] T006 Register, login, refresh (rotating cookie), logout endpoints.
- [x] T007 Verify reload keeps the session and sign out ends it, using the real API (browser run).

## US3–US4 Profile, sessions, deletion

- [x] T008 `/users/me` GET/PATCH/DELETE, `/auth/sessions` list and revoke.
- [x] T009 Verify with two clients: revoke one session from the other; the revoked one cannot refresh.

## US5 Recovery

- [x] T010 forgot-password, resend-verification, verify-email, reset-password with hashed one-time codes.
- [ ] T011 Enable recovery in the frontend (`RECOVERY_ENABLED` in `web/src/pages/RecoveryPage.tsx`) after a real email is received.

## US6 Admin

- [x] T012 Admin lookup, suspend with reason, reactivate; self-suspension rejected.
- [x] T013 Verify a suspended user gets 403 `account_suspended` at sign-in, and a wrong password still gets 401.

## Polish

- [x] T014 Restrict CEFR to A2–C1 to match the contract.
- [x] T015 Record the narrated video of US1–US4 and US6 (Part E): https://youtu.be/SzKVxb9nO2c

## Verification record (2026-11-14)

- Build: `mvnw clean package` on JDK 17 from commit `3f5e8f1` (with `java.version` set to 17).
- API: 29 of 30 scripted checks pass (register, duplicate, CEFR, login, refresh rotation, profile,
  role change rejected, sessions, revoke, admin find/suspend/reactivate, self-suspension, logout,
  delete with password, deleted login). The failing check expected 403 for a missing client header on
  login; the backend enforces that header only on `/auth/refresh` and `/auth/logout`.
- Browser: the real frontend on Vite against the API passes register, sign in, reload keeps the
  session, profile save persists, active sessions, sign out, admin suspend and reactivate, and
  nothing in browser storage.
- Not run: forgot-password, resend-verification, verify-email and reset-password, because they send
  real email through the committed SMTP account.
