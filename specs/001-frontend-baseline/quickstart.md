# Run and check

From `web/`, run `npm ci`, then `npm run dev`. Open the printed URL.
Use `npm run build`, `npm run lint` and `npm run test:e2e` for frontend checks.
Playwright may need `npx playwright install chromium` on a new machine.

Browser tests currently intercept account responses; passing them does not prove
the backend works. Once the endpoints in [the contract](contracts/auth.md) exist:

1. Set `VITE_API_BASE_URL` in the root `.env`, restart Vite and allow its origin in CORS.
2. Register, then sign in; check the returned learner name and reload behavior.
3. Request a verification code from `/#/verify-email`; receive it and verify.
4. Request a reset code from `/#/forgot-password`; reset at `/#/reset-password`.
5. Confirm the new password works, old password fails, reused/expired codes fail
   and the backend revokes previous sessions.
6. Check wrong input, duplicate registration, unknown email, throttling and service failure.

Room setup, lobby and profile screens are sample previews; do not count them as
successful room/profile integration.
