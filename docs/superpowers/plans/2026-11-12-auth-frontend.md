# Authentication Frontend Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Track progress below.

**Goal:** Deliver API-ready registration and sign-in using the existing design.
**Architecture:** Keep account presentation separate from a typed HTTP client,
validation and memory-only session store. Browser tests replace only HTTP responses.
**Tech Stack:** Existing Vite, React, TypeScript, Tailwind and Playwright; no new runtime dependencies.
**Spec:** `docs/superpowers/specs/2026-11-12-auth-frontend-design.md` (user approved).

## Global constraints

- Preserve the existing Cream & Yellow UI and hash navigation.
- Follow G1 register/login JSON contracts; no backend or database implementation.
- Never persist passwords or tokens in browser storage or URLs.
- Require valid API success; no runtime fake accounts or optimistic authentication.
- Keep room/media functionality explicitly labeled previews.
- Update architecture and proposal before product code (already done).

## Review focus

- Slow responses and route changes must not submit twice or navigate from an abandoned form.
- Malformed 2xx responses must not authenticate or claim account creation.
- Errors must never echo sensitive server payloads or submitted credentials.
- Unicode password lengths and surrounding spaces must survive unchanged.
- Reload, expiry and direct confirmation links must not fabricate an active session or success.

## Task 1: Contract and forms

**Files:** `web/src/auth/{contracts,api,session,validation,useAuthForm}.ts`,
`web/src/pages/AccountPages.tsx`, `web/src/components/ui.tsx`,
`web/src/App.tsx`, `web/src/routes.ts`, `web/src/index.css`,
`web/vite.config.ts`, `web/src/vite-env.d.ts`, `.env.example`,
`web/tests/auth.spec.ts`, `web/tests/scaffold.spec.ts`.

**Interfaces:** `register(input, signal): Promise<UserResponse>`;
`login(input, signal): Promise<TokenResponse>`; `setSession(tokenResponse)`;
`getAccessToken(): string | null`; `useSession()`; validation returns field errors.

- [x] Write HTTP-boundary browser tests for register → login → rooms, including
  exact payloads, client headers, credentials and absence of stored secrets.
- [x] Run the new happy-path test; expect failure because forms do not submit.
- [x] Implement typed client, runtime response checks, bounded/cancellable fetch,
  validation, real forms and memory session. Keep preview room navigation available.
- [x] Run happy-path, existing preview tests, lint and build; expect pass.

## Task 2: Failure and lifecycle behavior

**Files:** Same auth modules and `web/tests/auth.spec.ts`.
**Interfaces:** Consumes Task 1 client/forms/session; exposes safe errors and expiry.

- [x] Add browser cases for validation, Unicode/password spaces, 401/403/409/422/429,
  network/unavailable/timeout, malformed success, pending guard, aborted navigation,
  untrusted confirmation links, session expiry and reload.
- [x] Run tests before any uncovered-behavior implementation; inspect actual failures.
- [x] Complete missing behavior, rerun the full browser suite; expect pass.

## Task 3: Handoff and review

**Files:** `web/README.md`, spec/proposal/architecture status, this plan.
**Interfaces:** Documents `VITE_API_BASE_URL` and the exact existing G1 contracts.

- [x] Document backend connection, response examples, CORS/proxy requirements,
  memory-session limits and frontend-only verification.
- [x] Run build, lint, full browser suite and Impeccable detector; inspect mobile
  and desktop screenshots, including validation and pending states.
- [x] Obtain a fresh code review, address material findings, and verify again.
- [x] Leave reviewable changes in the current checkout; do not publish or merge.

## Execution record

- User approved the scoped design on 2026-11-12 and asked to proceed.
- Baseline: frontend build, lint and all 4 existing browser tests passed.
- Ruling: execute inline in the existing `feature/UI-scaffold` checkout, preserving
  the already-reviewed spec changes; no extra worktree/approval round or commits.
- Pre-flight: Task 2 consumes the exact G1 fields defined in Task 1; Task 3 documents
  the same configurable API prefix and memory-only session. No interface conflict.
- Task 1: happy-path test observed RED (preview links do not submit), then GREEN.
  Initial validation/error/lifecycle cases also observed RED before implementation.
- Task 2: 29 browser tests passed, including CEFR error accessibility (RED then GREEN).
- Ruling: the initial request-count test included Vite's five auth module imports;
  count only POSTs to the API prefix, rather than treating modules as API requests.
- Final review: fresh reviewer found a P2 malformed-user-response validation gap.
  Both blank-email success regressions observed RED; tightened email/name bounds
  and RFC3339 UTC calendar validation before the final suite.
- Final: Ruling: backend persistence, JWT verification, refresh/logout, room access
  control and full FG-01 acceptance are excluded by the approved frontend scope;
  document them as unverified backend responsibilities, never as passing features.
- Detector: only the generic Inter-font warning; retain Inter because it is the
  explicitly selected repository typography. No mechanical layout finding.
- Task 3: complete. Final verification: `npm run build` and `npm run lint` passed;
  `npm run test:e2e` passed all 43 tests. Review finding fixed and covered for both
  endpoints. Custom API-prefix smoke check passed; seven screenshots captured,
  mobile/desktop default, validation and pending views inspected.
- Kept all changes uncommitted in the current checkout. No merge, push, runtime
  fake-account store or backend implementation was introduced.
