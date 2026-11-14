# Tuấn — PA3 local implementation and review guide
Performed: Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: assigned human reviewers, pending. Edited: Trần Lê Anh Tuấn (24125107).

Prepared 2026-11-09; publication authorization updated 2026-11-10. The four assigned tickets have code/design deliverables. Initial delivery was local; the user subsequently authorized a feature-branch commit, push and PR into `pa3`, with Nguyễn Anh Khoa (24125058), AI Audio & Speech Pipeline Lead, as PR reviewer. No Jira transition or human approval is claimed. This guide explains the implementation, verification and exact integration boundary; it is not a claim that FG-03 already works end to end.

## 1. Deliverables by ticket
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: assigned human reviewers, pending. Edited: Trần Lê Anh Tuấn (24125107).

| Ticket | Files | Behavior / result |
|---|---|---|
| SCRUM-28 | Room domain module and room tests | Five room statuses, six legal edges, strict graph validation and pure immutable lifecycle guards |
| SCRUM-36 | Use-case model, PDF and JSON catalogue | 54 use cases covering FR-01–60; actor boundaries, full traceability, 11 Mermaid diagrams |
| SCRUM-37 | Detailed specifications, PDF, state manifest and prototypes | 54 complete specifications, 201 explicit alternate/error outcomes, offline interactive prototype and screenshots |
| SCRUM-47 | LLM adapter, grounding module and two test modules | Async vendor-independent LLM contract, strict JSON/schema validation, deterministic citation acceptance/rejection |

The architecture and proposal were updated before implementation. `.gitignore` protects every `.env*` file except `.env.example`; local Python, browser and document dependencies live in ignored `.venv/` and `report_build/`. No new environment variable or provider credential is needed for the delivered domain code. The optional `BROWSER_EXECUTABLE` variable affects document screenshot tooling only.

## 2. SCRUM-28 — how the lifecycle works
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Nguyễn Hồng Tấn Tài (24125078), Backend & Real-Time Media Lead — pending. Edited: Trần Lê Anh Tuấn (24125107).

`transition(current, target)` validates only the graph. Legal edges are LOBBY→READY/CANCELLED, READY→LOBBY/LIVE/CANCELLED and LIVE→ENDED. All other edges, including self-transitions and reopening terminal states, raise `InvalidTransition`. `RoomStatus` is a Python 3.11+ string enum. Passing raw strings instead of enum members is an explicit type error.

`guarded_transition` additionally requires a `TransitionReason` and frozen `LifecycleContext`. The context contains only server-derived facts: authenticated actor/creator identities, the relevant membership snapshot, consent/mic-ready identity sets, expiry, feature/media availability and trusted scheduled-event authority. It performs no clock reads, I/O or mutation. LIVE defaults to disabled. A start needs exactly two different participants, current consent and mic readiness for both, an unexpired room, actual media availability and an enabled live capability. A member can end LIVE even if media or consent has failed. Timers and reconnect expiry require trusted service authority.

### 2.1 Room-service integration contract
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Tài (24125078), pending. Edited: Trần Lê Anh Tuấn (24125107).

SCRUM-26/38 own the real transactional room API/UI integration. Do not accept `trusted_service`, expiry, media capability or other authorization facts from request bodies. Inside the service's locked room transaction:

1. Authenticate the actor, reload and lock the room, and derive facts from current membership, consent and capability records.
2. On join, include the candidate in the proposed two-member snapshot. Existing-member retries return the authorized room snapshot without requesting a READY self-transition. On leave, supply the pre-leave membership snapshot.
3. Call `guarded_transition` for the actual lifecycle reason.
4. Persist membership, stance assignment, readiness changes and status together, then notify/poll clients using the existing contract. An error rolls back the operation.

```python
from app.domain.rooms import (
    LifecycleContext, RoomStatus, TransitionReason, guarded_transition,
)

# Facts are supplied by the authenticated service, not an HTTP request model.
context = LifecycleContext(
    creator_id="learner-a",
    actor_id="learner-b",
    participant_ids=("learner-a", "learner-b"),
)
new_status = guarded_transition(
    RoomStatus.LOBBY,
    RoomStatus.READY,
    reason=TransitionReason.PARTICIPANT_JOINED,
    context=context,
)
assert new_status is RoomStatus.READY
```

At an actual existing service/API boundary, map `INVALID_TRANSITION` and lifecycle conflicts to 409, `FORBIDDEN` to 403, and hide absent/nonmember room reads as 404 per G1. Do not create an arbitrary status-changing endpoint to demonstrate the graph. Graph support for LIVE is not a Build 1 permission to start media.

## 3. SCRUM-47 — model adapter and evidence guard
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: peer review pending. Edited: Trần Lê Anh Tuấn (24125107).

The code is in `api/app/adapters/llm.py` and `api/app/domain/grounding.py`, with corresponding tests under `tests/unit/`. `LLMAdapter` specifies the existing asynchronous `complete_json` signature. `LLMResult` validates the parsed JSON object, nonempty model name and nonnegative token/latency metadata; non-JSON values and nonfinite numbers are rejected recursively. The requested Pydantic response schema can be checked using `validate_completion`. Tests use a fake adapter defined only in the tests. No production method returns fake AI feedback, and no vendor SDK, model endpoint or paid request was added.

`TranscriptSegment`, `Citation` and `FeedbackItem` are frozen validated models. Feedback has concrete explanation and remediation, and one or more citations. `ground_feedback` accepts an item only if every citation identifies the exact finalized transcript segment in the same debate, belonging to the same feedback speaker, and contains a nonblank verbatim substring. Missing/ambiguous segment IDs, another speaker/debate, partial transcription, empty quotes, paraphrases and stitched/normalized quotes fail closed. Accepted items and rejected items with stable reasons are returned separately without modifying inputs. Quote matching establishes source presence and attribution; it never establishes diagnosis correctness or transcript accuracy.

## 4. SCRUM-36/37 — model, specification and prototype
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Tài (24125078) for SCRUM-36; Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead, for SCRUM-37 — pending. Edited: Trần Lê Anh Tuấn (24125107).

The shared catalogue supplies stable UC IDs, actors, scopes and FR mappings. The model has one overview plus one diagram per FG. The specifications reuse those IDs and describe preconditions, triggers, numbered main steps, step-linked alternatives/exceptions, success/minimum guarantees and special requirements. Every UC embeds main and alternate prototype evidence. The supporting readiness and citation inspectors explain visible outcomes; they do not invent public API endpoints.

The clickable prototype was removed on 2026-11-15; its screenshots are in [`../screenshots/`](../screenshots/). It has search/navigation, basic/outcome views, recovery links, validation examples, separate consent decisions, blocked start, destructive confirmation, moderator decisions and six rubric dimensions per debater. All content is illustrative. Future, Should and post-MVP screens are labelled accordingly. Teacher class management is intentionally outside scope. Nguyễn Bảo Minh Triết (24125047), Frontend & WebRTC/Audio Lead, remains the SCRUM-37 co-owner; no participation or review approval is fabricated.

## 5. Verification and reproduction
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: human verification pending. Edited: Trần Lê Anh Tuấn (24125107).

The local Python 3.14 environment satisfies the project's Python 3.11+ minimum. The full existing and new backend suite passes: 135 tests, including 131 ticket-specific tests. Ruff lint and formatting checks pass for `api/`, `workers/` and `tests/`. A dependency deprecation warning from the installed FastAPI/Starlette TestClient does not fail the tests. The host supplied `DEBUG=release`; local verification explicitly uses `DEBUG=false` rather than changing production code for the host setting.

PowerShell, from the repository root with the local environment:

```powershell
$env:PYTHONPATH = 'api;.'
$env:APP_ENV = 'testing'
$env:DEBUG = 'false'
.venv/Scripts/python.exe -m pytest tests -q -o asyncio_default_fixture_loop_scope=function
.venv/Scripts/python.exe -m ruff check api workers tests
.venv/Scripts/python.exe -m ruff format --check api workers tests
.venv/Scripts/python.exe report/pa3/validate_deliverables.py
```

On macOS/Linux use `.venv/bin/python` and `PYTHONPATH=api:.`. The domain modules have no OS-specific paths or service dependencies.

Document/browser tooling can be installed locally using the existing [PDF instructions](../../../report/pdf/README.md). The prototype helper additionally uses Playwright:

```sh
npm install --prefix report_build/mermaid --no-audit --no-fund @mermaid-js/mermaid-cli@12.0.0 playwright
python report/pa3/build_prototypes.py
node report/pa3/capture_prototypes.mjs
python report/pa3/validate_deliverables.py
python report/pdf/build.py docs/pa3/USE_CASE_MODEL.md
python report/pdf/build.py docs/pa3/USE_CASE_SPECIFICATIONS.md
```

Pandoc, latexmk, TeX fonts and an installed/headless browser must be available per that tooling guide. Use `PUPPETEER_EXECUTABLE_PATH` if Mermaid should use an installed browser. Source-relative PNG lookup was added to the existing PDF builder, using dynamically resolved paths. No alternative PDF renderer replaces latexmk.

## 6. What local completion does and does not establish
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: assigned human reviewers, pending. Edited: Trần Lê Anh Tuấn (24125107).

Code, design documents, screenshots and their local verification are prepared for review. Authentication/room endpoints, database transactions, concurrent real joins, LiveKit connectivity and a real AI coaching pipeline are not implemented by these four tickets; no end-to-end FG-03 or deployment pass is claimed. Those product paths remain with their assigned integration tickets. The independent unit/domain work is explicitly contracted and does not replace the vertical product increment.

The Jira screenshots name Tài for SCRUM-28/36 and Lộc for SCRUM-37, with Triết checking co-owned UI design; SCRUM-47's reviewer is not specified there. For the combined PR, the user explicitly selected Nguyễn Anh Khoa (24125058), AI Audio & Speech Pipeline Lead, on 2026-11-10. Human review remains pending. Do not mark Jira Done until the required reviewed PR is merged. Publication is authorized on a feature branch only; no merge or Jira action is authorized by the PR request.
