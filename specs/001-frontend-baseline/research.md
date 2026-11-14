# Baseline decisions

- Root `.specify/` already contains Spec Kit 1.1.3 templates, scripts and skills.
  No frontend `spec.md`, `plan.md` or `tasks.md` feature directory existed.
- Earlier frontend work used `docs/superpowers/` and architecture/proposal notes.
  Keep them as history; this baseline is dated when it was actually written.
- Reuse the installed Spec Kit scripts, rather than reinstalling or changing branches.
- Use a short Markdown contract for the backend developer, as requested.
  It describes the client’s current expectations; it does not invent room APIs.
- Source evidence: `web/src/auth/api.ts`, `contracts.ts`, `validation.ts`,
  `pages/AccountPages.tsx`, `pages/RecoveryPage.tsx`, `routes.ts` and `api/app/main.py`.
- Backend verification policy, code lifetime and real email delivery need backend
  implementation. No choice about these is disguised as a completed feature.
