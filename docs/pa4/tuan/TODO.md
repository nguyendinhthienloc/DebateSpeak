# TODO — Tuấn (AI Orchestrator & Analysis Lead)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| Part A: Revised Use-Case Model & Specifications (2nd submission) + `docs/pa4/Changes.md` | SCRUM-54 | `feature/SCRUM-54-revised-use-cases` | TBD | Ready for review (local, 2026-11-23) |
| Sprint 4 AI Usage Log: collect entries from all 5 members, write `docs/pa4/AI_USAGE_LOG.md` | SCRUM-71 | `feature/SCRUM-71-ai-usage-log` | TBD | To Do |
| Review Tài's C4 Level 1 System Context Diagram (Part B) | SCRUM-60 (review) | n/a (review) | TBD | To Do |
| Review Tài's FG-03 Backend (Room API & state machine) | SCRUM-62 (review) | n/a (review) | TBD | To Do |
| Review Khoa's Spec Kit artifacts (`specs/003-fg03-rooms/`, `specs/004-fg04-audio/`) | SCRUM-57 (review) | n/a (review) | TBD | To Do |

## Part A — Revised Use-Case Specifications (SCRUM-54)

**Owner:** Trần Lê Anh Tuấn — **24125107** — **AI Orchestrator & Analysis Lead**  
**Reviewer:** Nguyễn Đình Thiên Lộc (24125093)  
**Deliverable:** `docs/pa4/Changes.md`, `docs/pa4/USE_CASE_SPECIFICATIONS.md`, `docs/pa4/USE_CASE_MODEL.md`, plus their PDFs. The model is included because PA4 Part A explicitly requires revising both the model and specifications.

Work required:
1. Address any TA feedback received on PA3 use-case specs (check Moodle / email from instructor)
2. Revise flows for FG-03 (Room & Session Management) and FG-04 (Real-Time Audio) if they were marked incomplete or vague in PA3
3. Record every change in `docs/pa4/Changes.md` with format:

```
| # | Document | Change | Why | Status |
```

> [!IMPORTANT]
> `Changes.md` is **mandatory**. Missing file = 0 pts for Part A per rubric.

Attribution header (first line of every document):
`*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*`

## AI Usage Log (SCRUM-71)

**Owner:** Trần Lê Anh Tuấn — **24125107**  
**Reviewer:** Nguyễn Đình Thiên Lộc (24125093)  
**Deliverable:** `docs/pa4/AI_USAGE_LOG.md`

Interview each member and collect:
- Tool name (e.g., Antigravity, ChatGPT, GitHub Copilot, Claude)
- Task category (code generation, documentation, debugging, review)
- Specific prompt or task description
- Output quality assessment (helped / partially helped / not useful)

One section per member; format matches `docs/pa3/AI_USAGE_LOG.md`.

## SCRUM-54 local completion — 2026-11-23
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Branch: `feature/SCRUM-54-revised-use-cases`, based on PA4 commit `7676197`.

- [Revised model](../USE_CASE_MODEL.md) and [PDF](../USE_CASE_MODEL.pdf): full 55-entry catalogue, actor/FR mappings, three Mermaid diagrams and preserved relationships.
- [Revised specifications](../USE_CASE_SPECIFICATIONS.md) and [PDF](../USE_CASE_SPECIFICATIONS.pdf): eleven room/audio use cases revised, one typed-turn use case added, 43 baseline entries retained, 26 acceptance scenarios.
- [Changes](../Changes.md) and [PDF](../Changes.pdf): separate revision sections, source/feedback status, actual checks and peer-review handoff.

Document coverage, retained behavior, relative links, attribution and PDF compilation/layout checks passed. Detailed evidence and rebuild commands are in Changes.md §5. No product runtime tests, teammate approval or TA-feedback verification are inferred. The frontend remains Triết's work; no product code or other member's checklist/status is changed. This local handoff does not change Jira or publish a branch/PR.

AI use for later SCRUM-71 collection: Codex assisted with source inspection, document revision and validation/PDF work. This records the actual assistance; the final sprint-log assessment still needs Tuấn's confirmation.

Revalidated on 2026-11-24 against the ticket and PA4 Part A: document structure, FR mappings, flow/branch references, relative links, attribution and all three PDF builds/layout checks passed. The audit found no substantive specification defect; TA-feedback coverage and actual human review cannot be established without their evidence. Results are recorded in Changes.md §5.
