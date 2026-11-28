# TODO — Lộc (DevOps & QA / Release Custodian)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

Status checked against Jira and GitHub on 2026-11-28.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Create `pa4` from `pa3`; merge `pa3` → `dev` first | SCRUM-68 | n/a | TBD | Done (`pa4` exists; `pa3` → `dev` merged in PR #67) |
| Deployment Diagram (Mermaid): Docker Compose, Caddy TLS, Postgres, Redis, LiveKit Cloud, Web client | SCRUM-59 | `feature/SCRUM-68-graphify` (PR #74) | TBD | Done (PR #74 merged into `pa4`; PDF built) |
| Sprint 4 Weekly Report: Sprint Planning, 2 Scrum Check-ins, Sprint Review minutes; Jira board screenshots | SCRUM-67 | `feature/SCRUM-68-graphify` (PR #74) | TBD | Done (PR #74 merged into `pa4`: Planning, Check-in 1 & 2, Sprint Review, `jira-board.png` + PDFs) |
| Build all PA4 Markdown docs to PDF via `report/pdf/build.py`; fix any font/table overflow errors | SCRUM-68 | `feature/SCRUM-68-graphify` (PR #74) | TBD | In Progress (all existing Parts A–F PDFs built cleanly; waits only on `DEMO_VIDEO.md`) |
| Manage freeze checklist `docs/pa4/CHECKLIST.md`; export Git log; package `PA4-Group02.zip` | SCRUM-68 | `feature/SCRUM-68-graphify` (PR #74) | TBD | In Progress (waiting only on E6/E7 YouTube demo video before freeze & `PA4-Group02.zip` per `AGENTS.md` §10) |
| Refine waiting and ready lobbies; verify UI accessibility | SCRUM-52 | n/a | TBD | Deferred / Closed for PA4 (not required by `docs/assignments/PA4_OVERVIEW.md`; superseded by Triết's FG-03/04 room UI in PR #70, #71, #73, #82) |
| Team guide: how to call graphify and Spec Kit (optional) | SCRUM-68 | `feature/SCRUM-68-graphify` (PR #74) | TBD | Done (PR #74 merged into `pa4`) |
| Review Tuấn's Changes.md and Use-Case Specifications (Part A) | SCRUM-54 (review) | n/a (review) | TBD | Done (PR #72 fixed & merged into `pa4`; also fixed & merged PR #78, #79, #82, #83) |
| Review Triết's FG-03 frontend (Room Setup + Lobby UI) | SCRUM-61 (review) | n/a (review) | TBD | Done (PR #70 & #82 merged into `pa4`) |

Jira numbers fixed on 2026-11-22: the Deployment Diagram is SCRUM-59 (not 61), the sprint
branch, freeze checklist and package are one issue, SCRUM-68 (SCRUM-69 does not exist), and
Triết's FG-03 frontend is SCRUM-61 (SCRUM-63 is FG-04 frontend). In Jira, SCRUM-59, 67 and 68
are still To Do; move them to In Progress.

## Deployment Diagram (SCRUM-59)

**Owner:** Nguyễn Đình Thiên Lộc — **24125093** — **DevOps & QA Lead**  
**Reviewer:** Nguyễn Anh Khoa (24125058)  
**Deliverable:** `docs/pa4/DEPLOYMENT_DIAGRAM.md`

Map all containers from `docker-compose.yml` to infrastructure nodes. Describe:
- Node: Developer workstation (Docker Compose local)
- Node: LiveKit Cloud SFU (external cloud service)
- Node: Browser (React SPA)
- Communication: HTTP/HTTPS between browser ↔ Caddy reverse proxy ↔ Spring Boot; WebSocket ↔ Spring Boot; WebRTC ↔ LiveKit; TCP ↔ Postgres/Redis

> [!IMPORTANT]
> Must match the actual `docker-compose.yml` topology exactly.

## Weekly Report (SCRUM-67)

**Owner:** Nguyễn Đình Thiên Lộc — **24125093**  
**Reviewer:** Trần Lê Anh Tuấn (24125107)  
**Deliverable:** `docs/pa4/WEEKLY_REPORT.md`, `docs/pa4/MEETINGS/`

Required content:
- Sprint 4 Planning meeting notes (day 1)
- Scrum Check-in 1 & 2 notes
- Sprint Review & Retrospective notes
- Jira board screenshots showing task progression
- Burndown chart screenshot

## Team guide: graphify and Spec Kit

**Deliverable:** [`docs/reference/AI_SKILLS_GUIDE.md`](../../reference/AI_SKILLS_GUIDE.md)  
Done so far: graphify installed and run on the repo; `.graphifyignore` added; `graphify-out/` ignored by git.

## Submission package (SCRUM-68)

Freeze happens when every CHECKLIST row is `complete`. Then:
1. Export git log: `git log --oneline > PA4-Group02/GIT_LOG.txt`
2. Build zip: `PA4-Group02.zip`
3. Merge `pa4` → `dev`
