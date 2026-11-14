# Tasks: frontend baseline

Checked items record existing work inspected on 2026-11-14, not work originally
developed through Spec Kit. Unchecked items are future integration work.

## Setup and shared foundation

- [x] T001 Record frontend scope in `specs/001-frontend-baseline/spec.md` and `plan.md`.
- [x] T002 Provide shared style, controls and hash navigation in `web/src/index.css`, `components/ui.tsx` and `routes.ts`.

## US1 — Account access

Independent check: registration → sign-in → named learner in rooms.

- [x] T003 [US1] Implement forms, validation and memory session in `web/src/pages/AccountPages.tsx` and `web/src/auth/`.
- [x] T004 [US1] Cover accepted/rejected requests and expiry in `web/tests/auth.spec.ts`.

## US2 — Verification and recovery

Independent check: request a code, handle expired code, verify or reset successfully.

- [x] T005 [US2] Implement verification/reset forms and API calls in `web/src/pages/RecoveryPage.tsx` and `web/src/auth/api.ts`.
- [x] T006 [US2] Cover recovery, throttling and narrow layouts in `web/tests/recovery.spec.ts`.

## US3 — Room and profile previews

Independent check: change room settings, explore sample lobbies, reload to reset.

- [x] T007 [US3] Provide previews in `web/src/pages/RoomPages.tsx`, `RoomSetupPage.tsx` and `AccountPages.tsx`.
- [x] T008 [US3] Cover navigation and setting behavior in `web/tests/scaffold.spec.ts` and `setup-refinement.spec.ts`.

## Handoff and remaining integration

- [x] T009 Publish the concise backend handoff in `web/API_CONTRACT.md`; link from `web/README.md`.
- [ ] T010 Confirm verification-required login behavior with the backend developer and record it in `web/API_CONTRACT.md`.
- [ ] T011 Validate real backend/email integration using `specs/001-frontend-baseline/quickstart.md`; record results there.

## Order

- [x] T012 [US2] Add verification/Profile reset entry points and memory-only email handoff in `web/src/pages/RecoveryPage.tsx`, `AccountPages.tsx` and `App.tsx`.
- [x] T013 [US2] Add regression coverage for the verification-to-reset journey in `web/tests/recovery.spec.ts`.

## US4 — Account management (FG-01 scaffold, 2026-11-14)

Independent check: each US4 endpoint with controlled success and failure responses.

- [x] T014 [US4] Add authenticated requests, refresh-on-load and logout in `web/src/auth/api.ts` and `session.ts`.
- [x] T015 [US4] Connect Profile to `GET/PATCH /users/me` in `web/src/pages/AccountPages.tsx`.
- [x] T016 [US4] Add active sessions and account deletion in `web/src/pages/AccountSettingsPages.tsx`.
- [x] T017 [US4] Add admin suspend/reactivate in `web/src/pages/AdminPage.tsx`.
- [x] T018 [US4] Cover US4 flows in `web/tests/account-management.spec.ts`.
- [x] T019 Publish the backend handoff for US4 in `web/API_INTEGRATION.md`.
- [x] T021 Keep the signed-in role after a profile save; block self-suspension (FR-009).
- [ ] T020 Run these screens against the Spring Boot API (`specs/002-fg01-accounts` T005–T013).

Shared foundation precedes US1–3. US1 is the first account journey; US2 and US3
can be checked independently after it. Different test files can be reviewed in
parallel. T010 precedes T011. Build real account integration before claiming a
complete account increment; room service work needs its own specification.
