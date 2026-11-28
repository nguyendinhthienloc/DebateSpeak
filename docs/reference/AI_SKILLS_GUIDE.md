# How to call graphify and Spec Kit

Both tools are "skills": instruction files that your AI assistant loads when you type a
slash command. A skill only works in an assistant that has it installed. That is why
`/speckit-specify` does nothing in Claude Code today: Spec Kit is installed for GitHub
Copilot only.

| Tool | What it does | Works today in | Command |
|---|---|---|---|
| Spec Kit | Writes `spec.md`, `plan.md`, `tasks.md` for a feature, then implements it | GitHub Copilot Chat (VS Code) | `/speckit-specify <feature>` |
| graphify | Builds a map of the code so the assistant can answer "where is X / what uses Y" | Claude Code, after a one-time install on your machine | `/graphify .` or `graphify query "..."` |

## Spec Kit

Spec Kit 1.1.3 is installed in this repo for Copilot. Its skills are in
`.github/skills/speckit-*`, its templates and scripts in `.specify/`, and every feature
gets a folder under `specs/` (for example `specs/005-auth-stage/`).

### Call it in VS Code (Copilot Chat)

1. Open the repo root in VS Code and open Copilot Chat in **Agent** mode.
2. Type `/speckit-` and pick a command from the list. Write your request after it.
3. Run the commands in this order for a new feature:

| Step | Command | Output |
|---|---|---|
| 1 | `/speckit-specify Room lobby: two debaters join with an 8-character code...` | new `specs/<nnn>-<name>/spec.md` and branch |
| 2 | `/speckit-clarify` (optional) | answers open questions inside `spec.md` |
| 3 | `/speckit-plan Spring Boot + PostgreSQL, React SPA, see AGENTS.md` | `plan.md`, `data-model.md`, `contracts/` |
| 4 | `/speckit-tasks` | `tasks.md` |
| 5 | `/speckit-analyze` (optional) | consistency check of spec, plan and tasks |
| 6 | `/speckit-implement` | code, following `tasks.md` |

Other commands: `/speckit-checklist` (quality checklist for a spec), `/speckit-constitution`
(edit `.specify/memory/constitution.md`; only with team agreement),
`/speckit-taskstoissues` (tasks to GitHub issues; we use Jira, so skip it).

`/speckit-specify` creates its own branch. Rename it to our pattern before pushing:
`git branch -m feature/SCRUM-<nn>-<short-name>`.

### Use it in Claude Code

Not installed yet. One person runs this once at the repo root, on a feature branch, and
opens a PR:

```powershell
specify integration install claude
```

It adds `.claude/skills/speckit-*`. After the PR is merged, `/speckit-specify` and the
others work in Claude Code the same way. Until then, ask Claude in plain words:
"follow `.github/skills/speckit-specify/SKILL.md` for: <feature>".

## graphify

Optional. It helps you find your way around the code, but no task or review needs it.

graphify parses the code locally (no AI, nothing leaves your machine) and writes
`graphify-out/`: `graph.json`, `GRAPH_REPORT.md` and `graph.html`. That folder is in
`.gitignore`, so each person builds their own. What it skips is in `.graphifyignore`.

### One-time install (each person)

Needs Python 3.11+ and [uv](https://docs.astral.sh/uv/) (`winget install astral-sh.uv`).

```powershell
uv tool install graphifyy
graphify install
```

The package is `graphifyy` (two y's); the command is `graphify`. `graphify install`
registers `/graphify` in Claude Code. For other assistants use
`graphify vscode install` (Copilot Chat) or `graphify antigravity install`.

### Build the graph

From the repo root:

```powershell
graphify extract . --code-only
graphify cluster-only . --no-label
```

After you pull or change code, refresh it (fast, no AI):

```powershell
graphify update .
```

### Ask it questions

In a terminal:

```powershell
graphify query "how does a room move from WAITING to READY"
graphify explain "RoomRuleViolation"
graphify path "JoinDialog()" "rooms/api.ts"
graphify god-nodes
```

Names must match a node: functions end in `()`. If a name exists twice, graphify lists
both; pass the `id` it prints instead.

In Claude Code: `/graphify query "..."`, or just ask an architecture question once
`graphify-out/` exists. Open `graphify-out/graph.html` in a browser to explore by
clicking.

`/graphify .` inside Claude Code also reads the docs and specs, not just code. That uses
the assistant's model and tokens; the commands above do not.

### Known quirk

`docs/pa3/prototypes/` holds an old copy of the `authify` code, so `AuthService` and
`UserEntity` appear twice. Ignore the copy under `docs/pa3/prototypes/`.
