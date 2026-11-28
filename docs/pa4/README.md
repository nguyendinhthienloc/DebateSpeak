# PA4 — Sprint 4

Deadline **TBD** (see assignment PDF). Jira: Sprint 4 (PA4). Each member's tasks: `loc/`, `triet/`, `tai/`, `khoa/`, `tuan/` → `TODO.md`.

## How to work (everyone)
1. `git checkout pa3 && git pull`, then `git checkout -b pa4` (Lộc creates the sprint branch once).
2. Branch task branches from `pa4`: `feature/SCRUM-<nn>-<short-name>`.
3. Open the PR **into `pa4`**, never into `dev` or `main`. One teammate reviews; a merged PR counts as reviewed.
4. Never commit directly to `pa4` for code. Only Lộc commits planning docs straight to it.
5. Lộc merges `pa4` into `dev` once, at the end of the sprint.
6. To call Spec Kit (`/speckit-*`) or graphify, see [AI_SKILLS_GUIDE.md](../reference/AI_SKILLS_GUIDE.md).

## What PA4 grades (75 pts total)

| Part | Topic | Points |
|---|---|---|
| A | Revised Use-Case Specification (2nd submission) + `Changes.md` | 5 |
| B | Software Architecture: System Context Diagram (C4 Level 1) | 15 |
| C | Software Architecture: Container & Component Diagrams (C4 Level 2 & 3) | 20 |
| D | Deployment Diagram | 5 |
| E | Implement 2 Functional Groups (FG-03 + FG-04) using Spec Kit + YouTube demo | 25 |
| F | AI Usage Report & Weekly Report | 5 |

## Functional Groups for Part E (Build 3)

- **FG-03: Room & Live Session Management** — Tài (backend) + Triết (frontend). Full-stack: create room, 8-char invite code, lobby state machine WAITING→READY→IN_DEBATE, DB persistence.
- **FG-04: Real-Time Audio Communication** — Tài (LiveKit token API) + Triết (LiveKit client SDK). Full-stack: WebRTC audio tracks, dual-consent mic activation, mute/unmute, active speaker.

## Submission package

| # | Item | Owner |
|---|---|---|
| S1 | `PA4-Group02/` folder with all docs as `.md` and `.pdf` | Lộc |
| S2 | Git log export | Lộc |
| S3 | Source code (no `node_modules`, build output, or `.env`) | Lộc |
| S4 | `.zip` of the package | Lộc |
| S5 | `pa4` → `dev` merge once the package is complete | Lộc |
