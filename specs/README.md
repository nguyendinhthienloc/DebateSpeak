# Frontend specifications

[001 — Frontend baseline](001-frontend-baseline/spec.md) records the current
account forms and room/profile previews.
[002 — FG-01 accounts end to end](002-fg01-accounts/spec.md) adds the Spring Boot
API and PostgreSQL half (PA3 Part E). Start with its
[short backend handoff](../web/API_CONTRACT.md) to connect auth.

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
