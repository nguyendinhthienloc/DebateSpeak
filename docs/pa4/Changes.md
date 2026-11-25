# PA4 — Changes from the PA3 Submission
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Ticket: **SCRUM-54**, PA4 Part A. Revision date: **2026-11-23**. Owner: **Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead**. Assigned reviewer: **Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead**.

This is the **single Changes.md for PA4**. Revised documents have separate sections below. “Written” describes a document change, not passing product acceptance, a completed TA response or teammate approval. The original PA3 files remain unchanged so the comparison can be reproduced.

## 1. Revision basis and TA-feedback status
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Baseline: [PA3 use-case model](../pa3/USE_CASE_MODEL.md), [specifications](../pa3/USE_CASE_SPECIFICATIONS.md) and [54-entry catalogue](../pa3/use_cases.json) as present at PA4 base **`7676197`**. That base contains merged FG-01 account code and the newer room setup/invite/agreement frontend. It does not contain a working merged room/audio backend. Revisions use the [2026-11-19 room design](../superpowers/specs/2026-11-19-room-flow-design.md), [PA4 scope](README.md), [Vision](../requirements/VISION_DOCUMENT.md) and source inspection.

No specific PA3 TA comments were supplied for this task or found in the checked PA3/PA4 repository documents. Moodle and instructor email were not accessed. This revision follows the current team workflow, with Triết responsible for frontend. This is not evidence that the group received no feedback; TA-feedback verification remains open. The revision does not fabricate comments, reasons, review dates or approvals. Actual later feedback must be added here with its source and mapped to the affected change IDs.

## 2. Revised document: Use-Case Model
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Document: [USE_CASE_MODEL.md](USE_CASE_MODEL.md). Compared with the [PA3 model](../pa3/USE_CASE_MODEL.md).

| # | Document | Change | Why | Status |
|---|---|---|---|---|
| M-01 | Model §§1, 4 | Preserve all 54 PA3 IDs and FR-01–60 links; add UC-04-05 rather than reusing an existing ID. | Keep traceability stable and distinguish new typed debate content. | Written. |
| M-02 | Model §§1, 4 | Name FG-01 as the PA3 baseline and FG-03/FG-04 as PA4's graded target; mark eleven core room/audio cases revised. | Older roadmap/PA3 wording conflicts with actual sprint scope. | Written. |
| M-03 | Model §§2–3 | Retain role boundaries and redraw current FG-03/FG-04 actor-goal diagrams in Mermaid. | Separate users/external systems from internal components and avoid claiming future roles are implemented. | Written. |
| M-04 | Model §§3.1, 5 | Keep UC-03-05 include UC-03-13, now triggered by the second Ready in the same atomic decision. | Start is no longer a separate UI/API action; stale permits cannot authorize media. | Written. |
| M-05 | Model §3.2 | Model typed participation as independent of audio; keep optional video and private side chat deferred. | Both learners may type without invoking voice; FR-58 side chat has different processing semantics. | Written. |
| M-06 | Model §3.3 | Add explicit LOBBY, READY, LIVE, ENDED and CANCELLED state constraints and pre-/post-start exit behavior. | Presence is not consent; READY withdrawal, expiry and terminal states need one consistent meaning. | Written. |
| M-07 | Model §§4–5 | Retain complete ten-group catalogue, actor mappings and all nine original include/extend relationships; label future scope. | A focused PA4 revision must not silently remove later-product requirements or imply they shipped. | Written. |
| M-08 | Model §6 | Record source evidence and current missing service integration separately from the goal model. | Diagrams and mocked tests do not establish working end-to-end functionality. | Written. |

## 3. Revised document: Use-Case Specifications
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Document: [USE_CASE_SPECIFICATIONS.md](USE_CASE_SPECIFICATIONS.md). Compared with the [PA3 specifications](../pa3/USE_CASE_SPECIFICATIONS.md). All 55 detailed entries are included; 43 retain PA3 functional content and priority, eleven are revised and one is new.

| # | Document | Change | Why | Status |
|---|---|---|---|---|
| S-01 | Specs §1 | Define current sources, scope, base commit and unknown TA-feedback status. | Make the revision reproducible and avoid invented feedback/completion claims. | Written. |
| S-02 | Specs §§2.1–2.2; UC-03-01 | Replace broad legacy duration wording with current setup options: FREE_FLOW 5/10/15/20 minutes or fixed TIMED_TURNS; seeded motion and side selection. | Match the current design/client while exposing the unresolved exact timed-turn schedule. | Written. |
| S-03 | Specs §§2.1, 2.4; UC-03-02 | Add limited invite lookup, explicit join modal, preserved sign-in destination, existing-member return and concurrent-seat rejection. | Preview is not a seat reservation; own invitations must not duplicate membership. | Written. |
| S-04 | Specs §2.2; UC-03-03 | Specify room-ID route, two-/five-second polling, stale-view handling and terminal cleanup. | Keep one authoritative room view without treating stale snapshots as consent. | Written. |
| S-05 | Specs §2.3; UC-03-04 | Make consent independent, unchecked, noncoercive and input-specific; add withdrawal/start race recovery. | Being in READY and browser permission do not authorize processing. | Written. |
| S-06 | Specs §§2.2–2.4; UC-03-05, UC-03-13 | Replace separate Start with PUT ready; second current Ready starts once, three seconds ahead using server time. | Align the current room contract and prevent duplicate sessions/early publication. | Written. |
| S-07 | Specs §2.3; UC-03-13, UC-04-01 | Distinguish local mic-test gating from server checks; acknowledge no mic-attestation field in the current request. | Do not claim the backend can verify a browser-only quality check. | Written. |
| S-08 | Specs §2.2; UC-03-06 | Define guest leave/reset, creator cancellation, either-participant End, unconfirmed ending and route-exit cleanup. | Preserve safe exit and stable terminal outcomes without waiting for AI. | Written. |
| S-09 | Specs §2.2; UC-03-07 | Specify shared clock/expiry and non-enforced turn markers; exact phase schedule remains a named contract dependency. | A display label or ambiguous legacy prose cannot establish exact timing. | Written. |
| S-10 | Specs §2.3; UC-04-01 | Require explicit local Test, selected-device validation, track/context release and permission-recovery alternatives. | Prevent unintended capture and false readiness; support a dignified way to decline voice. | Written. |
| S-11 | Specs §2.4; UC-04-02 | Restrict tokens to current LIVE members, use room ID for LiveKit, prohibit TYPE publication and require actual track-state indicators. | Supersede token-on-create/invite-code-room wording and avoid pretending audio/STT is connected. | Written. |
| S-12 | Specs §2.2; UC-04-03 | Separate poll failure from media disconnect, preserve healthy audio and restore the same seat/time within server-owned 60-second grace; reload muted. | Recovery must not duplicate identity, restart time or turn a temporary control-plane failure into dropped audio. | Written. |
| S-13 | Specs §§2.3, 2.6; UC-04-05 | Add typed debate turns with 1–500 characters, consent, attributed TYPED persistence and ordered reload recovery. | Implement the approved alternative to speech without redefining FR-58 or claiming text proves speaking fluency. | Written; follow-up implementation pending. |
| S-14 | Specs §§2.5–2.7; retained entries | Carry forward account, security and grounding contracts, correct shared-section references and link historical prototypes rather than presenting old images as new UI evidence. | Preserve baseline behavior and original contributions while keeping the second submission readable and honest. | Written. |
| S-15 | Specs §4 | Add AC-01–AC-26 covering normal flows, races, invalid states, consent, cleanup, recovery and typing. | Give feature owners observable acceptance outcomes without claiming those scenarios were executed. | Written; real product checks pending. |
| S-16 | Specs §§5–7 | Record merged frontend limits, absent room/media backend and cross-owner contract confirmations. | Distinguish specified behavior, source inspection and actual runtime evidence. | Written; integration requires owner confirmation. |

## 4. Supporting task record
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Only [Tuấn's TODO](tuan/TODO.md) is updated for this ticket's local completion/review handoff. Other members' tasks and the Lộc-owned shared checklist remain under their owners. No product code, PA3 baseline, backend specification, Jira status, remote branch or PR is changed by this local document revision. Packaging/freeze and shared PDF submission assembly remain Lộc's responsibility; local review PDFs can be generated before that without creating a submission folder.

AI-use record for later SCRUM-71 collection: on 2026-11-23, Tuấn requested Codex assistance to inspect the PA3/PA4 sources, revise the model/specifications/change log, and validate/build the documents. This records AI assistance, not a claim that Tuấn manually authored every line or that a teammate reviewed the result. Tuấn's assessment/confirmation can be collected when consolidating the sprint log.

## 5. Validation and handoff
*Performed: Trần Lê Anh Tuấn (24125107) | Reviewer: Nguyễn Đình Thiên Lộc (24125093) | Edited: Trần Lê Anh Tuấn (24125107)*

Local checks executed on **2026-11-23**:

| Check | Result / evidence |
|---|---|
| Catalogue/specification coverage | Passed: 55 unique IDs in both documents; all 54 PA3 IDs preserved, eleven revised cases and one new case. |
| Preserved behavior and traceability | Passed: the functional content of 43 retained entries matches PA3 after reference-only normalization; all original actor/FR mappings and FR-01–60 coverage remain; all nine original relationships retained. |
| Specification structure | Passed: every entry has actors, scope, requirements, trigger, preconditions, numbered main steps, exception/recovery branches, success/minimum guarantees and special requirements. |
| Review attribution and links | Passed: all 106 report sections identify performer, assigned reviewer and editor; all 132 relative document/source/prototype links resolve. |
| Revised-slice acceptance definitions | AC-01–AC-26 are present and unique. They are criteria for feature owners, not executed full-stack tests. |
| Document safety | No machine-specific absolute paths or credential patterns found in the new reports. No environment/configuration or product code changed. |
| Mermaid and PDF compilation | Three model diagrams render successfully. All three Markdown reports compile through `report/pdf/build.py` using Pandoc and `latexmk -pdf`. |
| PDF content and layout | All 55 use-case IDs and 26 acceptance IDs survive PDF conversion. No TeX overfull-box warnings or extracted words outside the checked page bounds. Selected source, room-flow, diagram and change-table pages were rendered and visually inspected. |
| PA3 preservation | Original PA3 documents remain unchanged. |

Rebuild from the repository root with the prerequisites in [the PDF guide](../../report/pdf/README.md):

```sh
python report/pdf/build.py docs/pa4/USE_CASE_MODEL.md \
  --subtitle "PA4 Part A / Group 02" --date "November 23, 2026"
python report/pdf/build.py docs/pa4/USE_CASE_SPECIFICATIONS.md \
  --subtitle "PA4 Part A / Group 02" --date "November 23, 2026"
python report/pdf/build.py docs/pa4/Changes.md \
  --subtitle "PA4 Part A / Group 02" --date "November 23, 2026"
```

Local PDF tooling used an installed Pandoc/Mermaid dependency set and Chrome. Windows TeX execution required running the existing pipeline outside the restricted process sandbox; no repository build script or system installation was changed.

Handoff: [model PDF](USE_CASE_MODEL.pdf), [specification PDF](USE_CASE_SPECIFICATIONS.pdf) and [change-log PDF](Changes.pdf). The authoring/validation work is ready for **Lộc's assigned peer review**. Product runtime acceptance and any later TA feedback remain separate; no human approval, Jira transition, publication or sprint freeze is claimed.

**Revalidation — 2026-11-24.** Rechecked the ticket deliverables against PA4 Part A and the current room design. All coverage, reference, attribution and document-safety checks passed again. Additional checks verified the actual requirement fields in all 54 inherited-ID specifications against their original FR mappings, consecutive main-flow step numbers, unique alternative/exception labels, valid referenced step numbers and a single PA4 Changes.md. All three PDFs were rebuilt with the existing latexmk pipeline; page-bound and overfull-box checks passed (model: 10 pages; specifications: 66 pages; change log: 6 pages). The reviewer labels preserve the requested wording without a pending suffix. No substantive specification defect was found in this audit. Actual PA3 TA feedback and completion of human peer review remain unverified; automated document checks do not establish either.
