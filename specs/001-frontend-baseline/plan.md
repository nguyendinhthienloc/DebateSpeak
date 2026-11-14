# Implementation Plan: Frontend baseline

Date: 2026-11-14. [Specification](spec.md).
Retrospective adoption of Spec Kit; no new product behavior in this documentation task.

## Summary

Keep the existing frontend and map its account journeys and previews to a single
Spec Kit baseline. Keep the backend developer handoff in [../../web/API_CONTRACT.md](../../web/API_CONTRACT.md).
Future feature work updates its specification and contract before code changes.

Current revision: expose password reset from verification success and Profile,
retain the accepted email in App memory across recovery routes, and clear
credentials on navigation. Reuse existing endpoints and account-page CSS.
Regression tests cover the entire verify → request reset → reset journey.
Frontend implementation is independent of Figma; both historical links are
optional reference material. Read/edit/sync Figma only on explicit request.

Revision 2026-11-14 (US4): one shared `request()` in `web/src/auth/api.ts`
adds Bearer auth for signed-in calls. On load the app calls `/auth/refresh`
once; on token expiry it tries refresh before showing "session expired". New
screens: active sessions, delete account and admin accounts. Profile uses
`/users/me` when signed in and keeps its labelled sample otherwise. The backend
handoff for these endpoints is `web/API_INTEGRATION.md`.

## Technical Context

Vite 5, React 18, TypeScript 5 and Tailwind 3 SPA; hash routing; Inter typography.
Account requests use fetch; session and room settings stay in memory.
Playwright covers browser behavior; TypeScript build and ESLint check source.
Target: mobile and desktop browsers; no database changes in this baseline.
Requests time out after 15 seconds; no measured performance claim is made.

## Constitution Check

- Portable paths, existing environment configuration and no committed credentials.
- Existing SPA stack retained; no new vendors, audio capture or consent changes.
- Spec-before-code was not followed through Spec Kit for earlier frontend work.
  This baseline records that gap, rather than rewriting history.
- Frontend-only scope was explicitly approved by the user. This is not the
  complete UI → API → database increment required for FG-01 acceptance.
- Current source paths are `web/` and `api/`; Spec Kit lives in root `.specify/` and `specs/`. Constitution path references have been corrected without changing governance requirements.

## Project Structure

| Location | Responsibility |
| --- | --- |
| `web/src/pages/AccountPages.tsx`, `RecoveryPage.tsx` | US1–2 forms |
| `web/src/auth/` | Typed requests, validation, memory session |
| `web/src/pages/RoomPages.tsx`, `RoomSetupPage.tsx`, `roomSettings.ts` | US3 previews |
| `web/src/pages/AccountSettingsPages.tsx`, `AdminPage.tsx` | US4 sessions, deletion, admin |
| `web/src/App.tsx`, `routes.ts`, `components/ui.tsx`, `index.css` | Navigation and shared style |
| `web/tests/` | Auth, recovery, scaffold and room-setting checks |
| `api/authify/` | Spring Boot API for every FG-01 endpoint; see `specs/002-fg01-accounts` |

## Delivery and Validation

1. Record current behavior in spec, model and tasks; retain older design notes as history.
2. Publish one short contract for all six account endpoints; link it from the web README.
3. Validate Spec Kit prerequisites, document links and contract-to-client consistency.
4. When the backend exists, run the manual integration checks in [quickstart.md](quickstart.md).

## Scope Exception

The frontend-only delivery is the user’s explicit scope, not a waiver of backend
security or a declaration that a complete vertical slice has shipped. Outstanding
integration checks stay unchecked in tasks.md. Rechecked after documenting the design.
