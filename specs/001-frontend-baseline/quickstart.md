# Run and check

From `web/`, run `npm ci`, then `npm run dev`. Open the printed URL.
Use `npm run build`, `npm run lint` and `npm run test:e2e` for frontend checks.
Playwright may need `npx playwright install chromium` on a new machine.

Browser tests currently intercept account responses; passing them does not prove
the backend works. Once the endpoints in [the contract](../../web/API_CONTRACT.md) exist:

1. Set `VITE_API_BASE_URL` in the root `.env`, restart Vite and allow its origin in CORS.
2. Register, then sign in; check the returned learner name and reload behavior.
3. Request a verification code from `/#/verify-email`; receive it and verify.
4. Request a reset code from `/#/forgot-password`; reset at `/#/reset-password`.
5. Confirm the new password works, old password fails, reused/expired codes fail
   and the backend revokes previous sessions.
6. Check wrong input, duplicate registration, unknown email, throttling and service failure.

Room setup, lobby and profile screens are sample previews; do not count them as
successful room/profile integration.

## Investigation: verification and password changes (2026-11-14)

- Reproduced missing Change password navigation after email verification.
  Added it to verification success and Profile; carry email only in memory.
- Reproduced stale signed-in status after a successful reset; now clear the
  frontend session on validated reset success.
- Reset codes and verification codes are separate. Test both expired-code
  recovery and the full verify → request fresh reset code → set password flow.
- Backend source inspection: `api/app/main.py` registers only `/health`, with
  no auth router. Real register/login/verify/reset calls cannot work against
  this checkout's backend until the six documented endpoints are implemented.
  Backend runtime checks could not start: FastAPI is absent from the available
  Python environment. Browser tests use intercepted responses, not real email.
- FG-03 has a pure room-state helper at `api/app/domain/rooms.py` and UI previews;
  neither provides persisted authenticated room/session APIs.
