# TODO — Lộc (DevOps & QA / Release Custodian)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

Status checked against Jira and GitHub on 2026-11-22.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Create `pa4` from `pa3`; merge `pa3` → `dev` first | SCRUM-68 | n/a | TBD | Done (`pa4` exists; `pa3` → `dev` merged in PR #67) |
| Deployment Diagram (Mermaid): Docker Compose, Caddy TLS, Postgres, Redis, LiveKit Cloud, Web client | SCRUM-59 | `feature/SCRUM-61-deployment-diagram` (local, wrong number: should be SCRUM-59) | TBD | In Progress |
| Sprint 4 Weekly Report: Sprint Planning, 2 Scrum Check-ins, Sprint Review minutes; Jira board screenshots | SCRUM-67 | `feature/SCRUM-67-pa4-weekly-report` (local) | TBD | In Progress |
| Build all PA4 Markdown docs to PDF via `report/pdf/build.py`; fix any font/table overflow errors | SCRUM-68 | `feature/SCRUM-68-pa4-pdfs` | TBD | To Do (waits for Parts A–D docs) |
| Manage freeze checklist `docs/pa4/CHECKLIST.md`; export Git log; package `PA4-Group02.zip` | SCRUM-68 | n/a | TBD | In Progress (checklist exists, every row still Missing) |
| Refine waiting and ready lobbies; verify UI accessibility | SCRUM-52 | not started | TBD | To Do |
| Team guide: how to call graphify and Spec Kit (optional) | SCRUM-68 | `feature/SCRUM-68-graphify` | TBD | In Review |
| Review Tuấn's Changes.md and Use-Case Specifications (Part A) | SCRUM-54 (review) | n/a (review) | TBD | To Do (blocked: files not written yet) |
| Review Triết's FG-03 frontend (Room Setup + Lobby UI) | SCRUM-61 (review) | n/a (review) | TBD | Done (PR #70 merged into `pa4`) |

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
