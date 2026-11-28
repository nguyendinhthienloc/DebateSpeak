# PA4 — Changes from the PA3 Submission
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewed: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Ticket: **SCRUM-54**, PA4 Part A. Revision date: **2026-11-23** (finalized **2026-11-28**). Owner: **Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead**. Assigned reviewer: **Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead**.

This is the **single Changes.md for PA4**. The original PA3 files remain unchanged so the comparison can be reproduced. Retained PA3 sections preserve original authorship and review credits from **Nguyễn Bảo Minh Triết (24125047)** and **Nguyễn Hồng Tấn Tài (24125078)**.

## 1. Revision basis and TA-feedback status
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewed: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Baseline: [PA3 use-case model](../pa3/USE_CASE_MODEL.md), [specifications](../pa3/USE_CASE_SPECIFICATIONS.md) and [54-entry catalogue](../pa3/use_cases.json). Revisions incorporate the [2026-11-19 room design](../superpowers/specs/2026-11-19-room-flow-design.md), [PA4 scope](README.md), [Vision](../requirements/VISION_DOCUMENT.md), [Room API contract](../../web/API_CONTRACT.md), and source inspection of merged `pa4` commits (PR #70, #71, #73, #78, #80, #82).

**TA-feedback status:** No PA3 TA feedback received as of 2026-11-28 (checked Moodle). Revisions below therefore address documented contract gaps and current PA4 design decisions without fabricating TA comments.

## 2. Revised document: Use-Case Model
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewed: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Document: [USE_CASE_MODEL.md](USE_CASE_MODEL.md). Compared with the [PA3 model](../pa3/USE_CASE_MODEL.md).

| # | Document | Change | Why | Status |
|---|---|---|---|---|
| M-01 | Model §§1, 4 | Preserve all 54 PA3 IDs and FR-01–60 links; add UC-04-05 rather than reusing an existing ID. | Keep traceability stable and distinguish new typed debate content. | Done |
| M-02 | Model §§1, 4 | Name FG-01 as the PA3 baseline and FG-03/FG-04 as PA4's graded target; mark eleven core room/audio cases revised. | Older roadmap/PA3 wording conflicts with actual sprint scope. | Done |
| M-03 | Model §§2–3 | Retain role boundaries and redraw current FG-03/FG-04 actor-goal diagrams in Mermaid. | Separate users/external systems from internal components and avoid claiming future roles are implemented. | Done |
| M-04 | Model §§3.1, 5 | Keep UC-03-05 include UC-03-13, now triggered by the second Ready in the same atomic decision. | Start is no longer a separate UI/API action; stale permits cannot authorize media. | Done |
| M-05 | Model §3.2 | Model typed participation as independent of audio; keep optional video and private side chat deferred. | Both learners may type without invoking voice; FR-58 side chat has different processing semantics. | Done |
| M-06 | Model §3.3 | Add explicit LOBBY, READY, LIVE, ENDED and CANCELLED state constraints and pre-/post-start exit behavior. | Presence is not consent; READY withdrawal, expiry and terminal states need one consistent meaning. | Done |
| M-07 | Model §§4–5 | Retain complete ten-group catalogue, actor mappings and all nine original include/extend relationships; label future scope. | A focused PA4 revision must not silently remove later-product requirements or imply they shipped. | Done |
| M-08 | Model §6 | Record source evidence and integration status separately from the goal model. | Diagrams and mocked tests do not establish working end-to-end functionality. | Done |
| M-09 | Model §§3–4 | Restore PA3 System Overview diagram and all 8 retained FG Mermaid diagrams (`FG-01`, `FG-02`, `FG-05`–`FG-10`); remove raw `\clearpage` text; restore PA3 credits. | Ensure the second submission retains full model coverage without shrinking diagrams or dropping co-author attribution. | Done |

## 3. Revised document: Use-Case Specifications
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewed: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Document: [USE_CASE_SPECIFICATIONS.md](USE_CASE_SPECIFICATIONS.md). Compared with the [PA3 specifications](../pa3/USE_CASE_SPECIFICATIONS.md). All 55 detailed entries are included; 43 retain PA3 functional content and priority, eleven are revised and one is new.

| # | Document | Change | Why | Status |
|---|---|---|---|---|
| S-01 | Specs §1 | Define current sources, scope, base commit, Moodle TA-feedback check, and PA3 credits. | Make the revision reproducible and avoid invented feedback/completion claims. | Done |
| S-02 | Specs §§2.1–2.2; UC-03-01 | Replace broad legacy duration wording with current setup options: FREE_FLOW 5/10/15/20 minutes or fixed TIMED_TURNS (`390 s`); seeded motion and side selection. | Match the current design/client and contract. | Done |
| S-03 | Specs §§2.1, 2.4; UC-03-02 | Add limited invite lookup, explicit join modal, preserved sign-in destination, existing-member return and concurrent-seat rejection. | Preview is not a seat reservation; own invitations must not duplicate membership. | Done |
| S-04 | Specs §2.2; UC-03-03 | Specify room-ID route, two-/five-second polling, stale-view handling and terminal cleanup. | Keep one authoritative room view without treating stale snapshots as consent. | Done |
| S-05 | Specs §2.3; UC-03-04 | Make consent independent, unchecked, noncoercive and input-specific; add withdrawal/start race recovery. | Being in READY and browser permission do not authorize processing. | Done |
| S-06 | Specs §§2.2–2.4; UC-03-05, UC-03-13 | Replace separate Start with PUT ready; second current Ready starts once, three seconds ahead using server time. | Align the current room contract and prevent duplicate sessions/early publication. | Done |
| S-07 | Specs §2.3; UC-03-13, UC-04-01 | Distinguish local mic-test gating from server checks; acknowledge no mic-attestation field in the current request. | Do not claim the backend can verify a browser-only quality check. | Done |
| S-08 | Specs §2.2; UC-03-06 | Define guest leave/reset, creator cancellation, either-participant End, unconfirmed ending and route-exit cleanup. | Preserve safe exit and stable terminal outcomes without waiting for AI. | Done |
| S-09 | Specs §2.2; UC-03-07 | Specify shared clock/expiry and non-enforced turn markers. | Keep timing aligned across client and server. | Done |
| S-10 | Specs §2.3; UC-04-01 | Require explicit local Test, selected-device validation, track/context release and permission-recovery alternatives. | Prevent unintended capture and false readiness; support a dignified way to decline voice. | Done |
| S-11 | Specs §2.4; UC-04-02 | Restrict tokens to current LIVE members, use room ID for LiveKit, prohibit TYPE publication and require actual active-speaker/track-state indicators. | Supersede token-on-create/invite-code-room wording and avoid pretending STT is connected. | Done |
| S-12 | Specs §2.2; UC-04-03 | Separate poll failure from media disconnect, preserve healthy audio and restore the same seat/time within server-owned 60-second grace; reload muted. | Recovery must not duplicate identity, restart time or turn a temporary control-plane failure into dropped audio. | Done |
| S-13 | Specs §§2.3, 2.6; UC-04-05 | Add typed debate turns with 1–500 characters, consent, attributed TYPED persistence and ordered reload recovery. | Implement the approved alternative to speech without redefining FR-58 or claiming text proves speaking fluency. | Done |
| S-14 | Specs §§2.5–2.7; retained entries | Carry forward account, security and grounding contracts, correct shared-section references and link historical prototypes rather than presenting old images as new UI evidence. | Preserve baseline behavior and original contributions while keeping the second submission readable and honest. | Done |
| S-15 | Specs §4 | Add AC-01–AC-26 covering normal flows, races, invalid states, consent, cleanup, recovery and typing. | Provide observable acceptance scenarios across FG-03 and FG-04. | Done |
| S-16 | Specs §§5–7 | Record source inspection, README state-name mapping (`WAITING/READY/IN_DEBATE` to `LOBBY/READY/LIVE`), and cross-owner contract confirmations. | Distinguish specified behavior, source inspection and runtime evidence. | Done |
| S-17 | Specs §§2.2, 7; UC-03-07 | Align `TIMED_TURNS` duration (`390 s`), `Token expiry` wording, and `active speaker` terminology with PR #73 and PR #78. | Resolve PR #72 review comments cleanly before merging into `pa4`. | Done |

## 4. Validation & Build Handoff
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewed: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107), Nguyễn Đình Thiên Lộc (24125093)*

All 55 use-case IDs, FR-01–60 traceability, 11+ Mermaid diagrams, and 26 acceptance criteria (AC-01–AC-26) compile cleanly to PDF via `report/pdf/build.py`: [USE_CASE_MODEL.pdf](USE_CASE_MODEL.pdf), [USE_CASE_SPECIFICATIONS.pdf](USE_CASE_SPECIFICATIONS.pdf), and [Changes.pdf](Changes.pdf).
