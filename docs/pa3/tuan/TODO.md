# TODO — Tuấn (AI Orchestrator & Analysis)

Team deadline: **Fri 2026-11-13**. Scope and rules: [../README.md](../README.md). Branch from `pa3`, PR into `pa3`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Room state machine as a pure function + transition tests | SCRUM-28 | `feature/SCRUM-28-room-state-machine` | 11-04 | Local implementation tested; Tài review pending |
| Part C: use-case model, Mermaid diagrams for all 10 FGs | SCRUM-36 | `feature/SCRUM-36-use-case-model` | 11-09 | Local model and PDF prepared; Tài review pending |
| Part D: use-case specifications, every alternative flow (45 pts) | SCRUM-37 | `feature/SCRUM-37-use-case-specs` | 11-12 | Local specifications prepared; Lộc review pending |
| Part D: UI prototype screenshots for every use case | SCRUM-37 | `feature/SCRUM-37-use-case-specs` | 11-12 | Local prototypes prepared; Triết/Lộc review pending |
| *Extra:* `LLMAdapter` protocol + grounding guard (verbatim-quote check) with unit tests | SCRUM-47 | `feature/SCRUM-47-llm-adapter-grounding` | 11-12 | Local stretch implementation tested; peer review pending |

Integration dependency: Tài's SCRUM-26/38 room service consumes SCRUM-28. Part D flows and UI design remain co-owned with Triết; human review is pending.

Work record: [implementation guide](IMPLEMENTATION_GUIDE.md). These are artifact statuses, not Jira transitions or peer approvals. Initial delivery was local; on 2026-11-10 the user authorized a combined PR into `pa3`, reviewed by Nguyễn Anh Khoa (24125058), AI Audio & Speech Pipeline Lead. The table retains the Jira-assigned review references. SCRUM-26/38 own real room-service integration.
