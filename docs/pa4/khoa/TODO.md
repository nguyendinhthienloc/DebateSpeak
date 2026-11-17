# TODO — Khoa (AI Audio & Speech Pipeline)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| C4 Level 2: Container Diagram (Mermaid) + protocol descriptions | SCRUM-55 | `feature/SCRUM-55-c4-container-diagram` | TBD | To Do |
| C4 Level 3: Backend Component Diagram (Spring Boot controllers/services/repos & Python workers) | SCRUM-56 | `feature/SCRUM-56-c4-backend-components` | TBD | To Do |
| Spec Kit artifacts: `specs/003-fg03-rooms/` and `specs/004-fg04-audio/` for FG-03 & FG-04 | SCRUM-57 | `feature/SCRUM-57-speckit-fg03-fg04` | TBD | To Do |
| Review Triết's C4 Level 3 Frontend Component Diagram | SCRUM-58 (review) | n/a (review) | TBD | To Do |
| Review Lộc's Deployment Diagram | SCRUM-61 (review) | n/a (review) | TBD | To Do |
| Review Tài's LiveKit Token API (FG-04) | SCRUM-65 (review) | n/a (review) | TBD | To Do |
| PDF compilation review: check all `docs/pa4/*.pdf` build correctly | SCRUM-66 (review) | n/a (review) | TBD | To Do |

## C4 Level 2 — Container Diagram (SCRUM-55)

**Owner:** Nguyễn Anh Khoa — **24125058** — **AI Audio & Speech Pipeline Lead**  
**Reviewer:** Nguyễn Hồng Tấn Tài (24125078)  
**Deliverable:** `docs/pa4/ARCHITECTURE_C4_CONTAINER.md`

Diagram must accurately reflect the **actual deployed containers**:
- React SPA (Vite build, served by Caddy)
- Spring Boot API (`api/authify/`) — REST + WebSocket
- PostgreSQL 16
- Redis 7 (session/job queue)
- LiveKit SFU (Cloud or local dev container)
- Python Worker (`workers/`) — async job processing via ARQ
- Communication protocols: HTTP/HTTPS, WebSocket (WS/WSS), TCP, LiveKit WebRTC signalling

> [!IMPORTANT]
> The diagram must match the actual `docker-compose.yml` and `api/authify/` source, not aspirational architecture. Discrepancy = penalty per rubric.

## C4 Level 3 — Backend Component Diagram (SCRUM-56)

**Owner:** Nguyễn Anh Khoa — **24125058**  
**Reviewer:** Nguyễn Hồng Tấn Tài (24125078)  
**Deliverable:** `docs/pa4/ARCHITECTURE_C4_COMPONENTS_BE.md`

Internal decomposition of the **Spring Boot API container**:
- Controllers: `AuthController`, `RoomController`, `LiveKitController`
- Services: `AuthService`, `RoomService`, `TokenService`
- Repositories: `UserRepository`, `RoomRepository`
- Security: `JwtFilter`, `SecurityConfig`
- Python Worker components: `STTAdapter`, `LLMAdapter`, `ARQ worker`

## Spec Kit for FG-03 & FG-04 (SCRUM-57)

**Owner:** Nguyễn Anh Khoa — **24125058**  
**Reviewer:** Trần Lê Anh Tuấn (24125107)  
**Deliverable:** `specs/003-fg03-rooms/`, `specs/004-fg04-audio/`

Each spec directory must contain: `spec.md`, `plan.md`, `tasks.md`, `quickstart.md`.
