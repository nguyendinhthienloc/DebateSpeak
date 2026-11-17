# TODO — Lộc (DevOps & QA / Release Custodian)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Create `pa4` sprint branch from `pa3`; merge `pa3` → `dev` first | SCRUM-53 | n/a | TBD | To Do |
| Deployment Diagram (Mermaid): Docker Compose, Caddy TLS, Postgres, Redis, LiveKit Cloud, Web client | SCRUM-61 | `feature/SCRUM-61-deployment-diagram` | TBD | To Do |
| Sprint 4 Weekly Report: Sprint Planning, 2 Scrum Check-ins, Sprint Review minutes; Jira board screenshots | SCRUM-67 | `feature/SCRUM-67-pa4-weekly-report` | TBD | To Do |
| Build all PA4 Markdown docs to PDF via `report/pdf/build.py`; fix any font/table overflow errors | SCRUM-68 | `feature/SCRUM-68-pa4-pdfs` | TBD | To Do |
| Manage freeze checklist `docs/pa4/CHECKLIST.md`; export Git log; package `PA4-Group02.zip` | SCRUM-69 | n/a | TBD | To Do |
| Review Tuấn's Changes.md and Use-Case Specifications (Part A) | SCRUM-54 (review) | n/a (review) | TBD | To Do |
| Review Triết's FG-03 frontend (Room Setup + Lobby UI) | SCRUM-63 (review) | n/a (review) | TBD | To Do |

## Deployment Diagram (SCRUM-61)

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

## Submission package (SCRUM-69)

Freeze happens when every CHECKLIST row is `complete`. Then:
1. Export git log: `git log --oneline > PA4-Group02/GIT_LOG.txt`
2. Build zip: `PA4-Group02.zip`
3. Merge `pa4` → `dev`
