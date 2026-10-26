# PA2 Tasks: Who Does What

Sprint 2 (PA2). Each member's section lists what they build, what they review, and the branch to create. Step-by-step checkboxes, gates and the definition of done are in [CHECKLIST.md](CHECKLIST.md). If this file and the checklist disagree, update both in the same PR.

## Shared branch rules

1. Branch from the latest `pa2`: `git checkout pa2`, `git pull origin pa2`, then `git checkout -b <branch>`.
2. Every PR targets `pa2`. Never target `dev` or `main` from a feature branch.
3. One performer, one reviewer per task. Reviewer approves and CI passes, then the performer merges and deletes the branch.
4. Build 1 branches (marked *after G1*) wait until the G1 PR is merged into `pa2`.

Sprint end: Lộc opens one PR `pa2` → `dev`, reviewed by Tài.

---

## 1. Lộc (R5, DevOps & QA / Release Custodian)

**Status as of 2026-10-26** (checked against `pa2` and the remote branches; Jira status is as of 2026-10-24)

**You build**

| Task | Branch | Reviewer | Jira key | Status |
|---|---|---|---|---|
| T2.3 Spec Kit evidence (checklist §6) | `feature/T2.3-speckit-evidence` | Tài | SCRUM-22 | In progress: branch pushed, PR not yet open, not merged to `pa2`. Constitution amendment needs all five leads' consensus. Training log in `SPECKIT_TRAINING.md` is empty. |
| Jira project setup (checklist A-6) | — (no branch) | — | | Partial: `SCRUM` project exists and tasks are imported. Sprint and Epic setup not verified. |
| Final `pa2` → `dev` PR (after Sprint Review) | `pa2` → `dev` | Tài | | Not started (depends on Sprint Review) |

**You review**

- G1 spec (Tuấn): SCRUM-19 To Do, not started
- T2.5 Build 1 backend (Tài): SCRUM-24 In Progress, no review yet
- T2.7 room API (Tài): SCRUM-26 To Do, not started
- T2.7 lobby UI (Triết): SCRUM-27 To Do, not started

**Also:** Milestone 1 demo lead (checklist §11), Jira SCRUM-30 To Do. M1-7 (CI green on `pa2`) not verified.

**Not done:** T2.3 merge, all four reviews, the M1 demo, the final PR to `dev`, and the M1-7 CI check.

---

## 2. Triết (R1, Frontend & WebRTC/Audio Lead)

**You build**

| Task | Branch | Reviewer | Jira key |
|---|---|---|---|
| T2.2 Vision Document assembly (checklist §5) | `feature/T2.2-vision-document` | Tuấn | SCRUM-21 |
| T2.6 Build 1 frontend (checklist §9) | `feature/T2.6-frontend-auth` (*after G1*) | Tài | SCRUM-25 |
| T2.7 lobby UI, R-1 to R-4 (checklist §10) | `feature/T2.7-lobby-ui` (*after G1*) | Lộc | SCRUM-27 |
| Your own B-5 feature paragraphs (checklist B-5) | `feature/B5-drafts-<first-name>` | Tuấn | |

**You review**

- T2.4 weekly report and AI log (Khoa)
- B-5 drafts from Khoa, Tài and Lộc

**Also:** merge the approved B-5 drafts into `feature/T2.2-vision-document` (checklist B-5.3).

---

## 3. Tài (R2, Backend & Real-Time Media Lead)

**You build**

| Task | Branch | Reviewer | Jira key |
|---|---|---|---|
| T2.5 Build 1 backend: auth and migrations (checklist §8) | `feature/T2.5-auth-backend` (*after G1*) | Lộc | SCRUM-24 |
| T2.7 room API, R-5 and R-6 (checklist §10) | `feature/T2.7-room-api` (*after G1*) | Lộc | SCRUM-26 |
| B-6.1 room lifecycle diagram (checklist B-6.1) | with T2.5 | Lộc | |

**You review**

- T2.3 Spec Kit evidence (Lộc)
- T2.6 frontend (Triết)
- T2.8 room state machine (Tuấn)
- T2.9 M1 smoke test (Khoa)

---

## 4. Khoa (R3, AI Audio & Speech Pipeline Lead)

**You build**

| Task | Branch | Reviewer | Jira key |
|---|---|---|---|
| T2.4 AI Usage Report and Weekly Report, with minutes and AI log (checklist §7) | `feature/T2.4-weekly-report` | Triết | SCRUM-23 |
| T2.9 Milestone 1 end-to-end smoke test, R-7 (checklist §10) | `feature/T2.9-m1-smoke-e2e` | Tài | SCRUM-29 |
| Your own B-5 feature paragraphs (checklist B-5) | `feature/B5-drafts-khoa` | Triết | |

**You review**

- T2.1 Project Plan (Tuấn)

---

## 5. Tuấn (R4, AI Analysis & Orchestrator Lead)

**You build**

| Task | Branch | Reviewer | Jira key |
|---|---|---|---|
| Gate G1 spec (checklist §3) | `feature/G1-spec-build1` | Lộc | SCRUM-19 |
| T2.1 Project Plan (checklist §4) | `feature/T2.1-project-plan` | Khoa | SCRUM-20 |
| T2.8 room state machine and transition tests, BE-4.1 and R-6 (checklist §8, §10) | `feature/T2.8-room-state-machine` (*after G1*) | Tài | SCRUM-28 |
| Your own B-5 feature paragraphs (checklist B-5) | `feature/B5-drafts-<first-name>` | Triết | |

**You review**

- T2.2 Vision Document (Triết)
- Triết's B-5 drafts

---

Jira project key: `SCRUM` (project named "DebateSpeak"). Each member signs in to Jira with their own account. Keys are filled in from the Jira import (12 issues in the SCRUM project). Epics: Build 1 = SCRUM-15, Build 2 = SCRUM-16, Build 3 = SCRUM-17, Build 4 = SCRUM-18.
