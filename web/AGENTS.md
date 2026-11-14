# Frontend working rules

Follow the repository root `AGENTS.md`. Before frontend code changes, update
the matching Spec Kit feature and architecture/proposal requirements.

- Implement in Vite + React + TypeScript + Tailwind. Use the existing shared
  controls, Cream & Yellow tokens and Inter typography.
- Frontend code and browser evidence are the current UI authority. Neither
  historical Figma link is an implementation dependency. Read, update or sync
  Figma only when the user explicitly asks.
- Keep the human backend handoff in `API_CONTRACT.md` short and consistent with
  `src/auth/`. Routes belong in `src/routes.ts`; support direct links/reload.
- Use relative imports and environment-based API URLs. Never hardcode local
  filesystem paths, credentials or service secrets. Never store passwords,
  codes or access tokens in URLs or browser storage.
- Email verification and password reset use separate codes and authorization.
  Only show success after a validated API response; preserve a recovery path.
- Clearly label service previews. Do not start microphone/audio processing or
  claim real account/room persistence from mocked browser-test responses.
- Run build, lint and relevant Playwright checks; inspect changed layouts at
  mobile/desktop widths. Document unresolved backend requirements honestly.
