# Frontend specifications

[001 — Frontend baseline](001-frontend-baseline/spec.md) records the current
account forms and room/profile previews.
[002 — FG-01 accounts end to end](002-fg01-accounts/spec.md) adds the Spring Boot
API and PostgreSQL half (PA3 Part E). Start with its
[short backend handoff](../web/API_CONTRACT.md) to connect auth.
[003 — UI refresh](003-ui-refresh/spec.md) adds display type, motion, two-step
registration, shorter copy and a main menu (SCRUM-53).
[004 — Welcome page and contrast system](004-welcome-contrast/spec.md) adds the
signed-out landing page and replaces the low-contrast surface rules.
[005 — Sign-in and sign-up on the stage](005-auth-stage/spec.md) remakes the
auth flow in the welcome page's stage and adds a three-step registration.
[006 — FG-03 rooms end to end](006-fg03-rooms/spec.md) adds the room API and
database behind the finished room screens (PA4, SCRUM-64).
[007 — FG-04 real-time audio](007-fg04-audio/spec.md) adds the LiveKit token
API, mute and active speaker on top of 006 (PA4, SCRUM-64).

Spec Kit was already installed in `.specify/`; frontend adoption starts with this
retrospective baseline on 2026-11-14. Earlier `docs/superpowers/` documents remain
historical context, not evidence that Spec Kit was used before implementation.

For future work, update or create the feature’s `spec.md`, `plan.md` and `tasks.md`
before coding. Update its contract when requests/responses change. Keep contracts
short, written for the developer connecting the services, with examples and
outstanding integration work plainly stated. Keep architecture/proposal in sync.

Spec Kit’s selected feature is local `.specify/feature.json`. To check this
baseline explicitly from PowerShell at the repository root:

```powershell
$env:SPECIFY_FEATURE_DIRECTORY = 'specs/001-frontend-baseline'
& ./.specify/scripts/powershell/check-prerequisites.ps1 -RequireSpec -RequireTasks -IncludeTasks
```
