# Sprint Planning (PA3, Sprint 3)
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058)*

**Methodology:** Scrum
**Sprint dates:** 3–13 November 2026 (Jira sprint "Sprint 3 (PA3)")
**Sprint goal (from Jira):** Use-case model and specs, revised plan and vision, FG-03 built end to end on Build 1, video demo.

## Sprint goal as scoped on 2026-11-03
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058)*

Build 1 is cut to what FG-03 needs. The database with mock data comes first. FG-01 and FG-02 and the PA4/PA5 preparation items are extras, done only if FG-03 and the documents are on track. See `docs/pa3/Changes.md`, section 1.

## Planned tasks and owners
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058)*

| Task | Jira | Owner(s) | Reviewer | Planned deliverable |
|---|---|---|---|---|
| Revised Project Plan and Changes.md (Part A) | SCRUM-35 | Tuấn (reassigned from Tài, 2026-11-14) | Lộc | `docs/requirements/PROJECT_PLAN.md`, `docs/pa3/Changes.md` |
| Revised Vision Document (Part B) | SCRUM-35 | Khoa | Lộc | `docs/requirements/VISION_DOCUMENT.md` |
| Use-case model with Mermaid diagrams (Part C) | SCRUM-36 | Tuấn | Tài | `docs/pa3/USE_CASE_MODEL.md` |
| Use-case specifications and prototypes (Part D) | SCRUM-37 | Triết, Tuấn | Tài | `docs/pa3/USE_CASE_SPECIFICATIONS.md`, prototypes |
| Build 1 backend: auth and migrations | SCRUM-24, 41 | Tài | Tuấn | Auth API, migrations, seed |
| Build 1 backend: room lifecycle API | SCRUM-26 | Tài | Tuấn | Room API |
| Room state machine and transition tests | SCRUM-28 | Tuấn | Tài | `domain/rooms.py` and tests |
| Frontend shell, register and login | SCRUM-25 | Triết | Tài | Frontend auth pages |
| Lobby UI | SCRUM-27 | Triết | Tài | Lobby UI |
| FG-03 backend and frontend integration (Part E) | SCRUM-38 | Tài, Triết | Lộc | Integrated FG-03 flow |
| Narrated FG-03 demo video (Part E) | SCRUM-39 | Tài | Lộc | Video link |
| Docker database starts clean | SCRUM-42 | Lộc | Khoa | `docker compose up db` |
| CI migrate and seed job | SCRUM-43 | Lộc | Khoa | `ci.yml` job |
| AI usage log and weekly report (Part F) | SCRUM-40 | Khoa | Lộc | `docs/pa3/AI_USAGE_LOG.md`, `docs/pa3/WEEKLY_REPORT.md` |

## Risks and actions
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058)*

- **FG-03 integration gap:** migrations, auth API, room API and UI were not all on `pa3` at the 2026-11-10 check-in. Integrate in small steps.
- **Single-owner dependency:** SCRUM-41, 24, 26 and 38 all sit with Tài. A delay in the first blocks the rest.
- **Status drift:** Jira and documents disagreed on several tickets. Reconcile before submission and treat the repository as evidence.

## Decisions
*Performed: Nguyễn Anh Khoa (24125058); Review: Nguyễn Đình Thiên Lộc (24125093), pending; Edited: Nguyễn Anh Khoa (24125058)*

- Build 1 is shrunk to what FG-03 needs (Changes.md, section 1).
- Extras (FG-02 topic API, LiveKit token spike, STT adapter, mic setup spike, CI job) are cut first if FG-03 slips.
- No status is claimed without a merged PR or verified artifact.
