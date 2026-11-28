# TODO — Khoa (AI Audio & Speech Pipeline)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| C4 Level 2: Container Diagram (Mermaid) + protocol descriptions | SCRUM-56 | `feature/SCRUM-56-c4-container-diagram` | TBD | Done (PR #78 merged into `pa4`) |
| C4 Level 3: Backend Component Diagram (Spring Boot controllers/services/repos & Python workers) | SCRUM-57 | `feature/SCRUM-57-c4-backend-components` | TBD | In Review (PR #79) |
| Spec Kit artifacts: `specs/006-fg03-rooms/` and `specs/007-fg04-audio/` for FG-03 & FG-04 | SCRUM-64 | `feature/SCRUM-64-speckit-fg03-fg04` | TBD | Done (PR #80 merged into `pa4`; audio worker PR #81 merged) |
| Review Triết's C4 Level 3 Frontend Component Diagram | SCRUM-58 (review) | n/a (review) | TBD | To Do |
| Review Lộc's Deployment Diagram | SCRUM-59 (review) | n/a (review) | TBD | To Do |
| Review Tài's LiveKit Token API (FG-04) | SCRUM-62 (review) | n/a (review) | TBD | Done (merged in PR #78) |
| PDF compilation review: check all `docs/pa4/*.pdf` build correctly | SCRUM-68 (review) | n/a (review) | TBD | To Do |

## C4 Level 2 — Container Diagram (SCRUM-56)

**Owner:** Nguyễn Anh Khoa — **24125058** — **AI Audio & Speech Pipeline Lead**  
**Reviewer:** Nguyễn Hồng Tấn Tài (24125078)  
**Deliverable:** `docs/pa4/ARCHITECTURE_C4_CONTAINER.md`

Diagram accurately reflects deployed and `[Planned]` containers across `docker-compose.yml`, `web/`, `api/authify/`, `api/app/`, and `workers/`.

## C4 Level 3 — Backend Component Diagram (SCRUM-57)

**Owner:** Nguyễn Anh Khoa — **24125058**  
**Reviewer:** Nguyễn Hồng Tấn Tài (24125078)  
**Deliverable:** `docs/pa4/ARCHITECTURE_C4_COMPONENTS_BE.md`

Internal decomposition of `api/authify/` (`SecurityConfig`, `GlobalExceptionHandler`, `AuthController`, `RoomController`, `AuthService`, `JwtService`, `EmailService`, `RoomService`, JPA repositories) and Python worker modules (`AudioPipelineManager`, `SpeakerAudioTrack`, `STTAdapter`, `LocalMockSTTAdapter`).

## Spec Kit for FG-03 & FG-04 (SCRUM-64)

**Owner:** Nguyễn Anh Khoa — **24125058**  
**Reviewer:** Trần Lê Anh Tuấn (24125107)  
**Deliverable:** `specs/006-fg03-rooms/`, `specs/007-fg04-audio/`

Each spec directory contains `spec.md`, `plan.md`, `tasks.md`, `quickstart.md`.
