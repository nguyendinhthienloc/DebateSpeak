# Account recovery implementation plan

Goal: API-ready verification and password recovery in the existing account style.
Scope approved: frontend only; skip Figma. Reuse existing form controls and HTTP
client. Architecture/proposal recovery sections define proposed contracts.

1. Add browser contract tests for request, verification, reset, expired codes,
   malformed responses, validation and credential storage; observe missing UI.
2. Extend API types/client with code and exact status guards. Build recovery
   pages with existing auth shell and controls; add routes and entry links.
3. Document backend contracts in web README. Run build, lint and full Playwright suite; inspect
   desktop/mobile renders and report backend limitations.
