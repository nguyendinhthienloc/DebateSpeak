*Author: Group Member 1 | Reviewer: Group Member 5 | Editor: Group Member 2*

# DebateSpeak AI — Engineering Task Breakdown & Role Matrix (TASKS.md)

| Field | Value |
|---|---|
| Project Name | **DebateSpeak AI** |
| Target Timeline | 8 Weeks (4 Sprints × 2 Weeks) |
| Team Size | 5 Engineers |
| Companion Documents | [DEBATESPEAK_SPEC.md](DEBATESPEAK_SPEC.md), [ROADMAP_AND_EXECUTION.md](ROADMAP_AND_EXECUTION.md), [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) |

---

## 1. Team Role Allocation Matrix

To prevent engineering overlaps and establish clear ownership, the 5 team members are assigned dedicated subsystem areas:

| Role ID | Role Title | Short Title | Primary Ownership | Primary Technologies |
|---|---|---|---|---|
| **R1** | **Frontend & WebRTC/Audio Engineer** | `FE/Audio` | Next.js client, Tailwind UI, room lobby, audio controls, live transcript rendering, report viewer | Next.js, React, TypeScript, Tailwind CSS, LiveKit Client SDK |
| **R2** | **Backend & Real-Time Media Engineer** | `BE/Media` | FastAPI service, PostgreSQL models/migrations, JWT auth, room state machine, LiveKit token minting, WebSocket hub | FastAPI, SQLAlchemy, Alembic, PostgreSQL, Redis, LiveKit API |
| **R3** | **Speech & Real-Time Pipeline Engineer** | `Speech/Worker` | Audio track subscription worker (LiveKit agent), Silero VAD, streaming STT adapter, track-to-speaker attribution, disfluency tracking | Python, LiveKit Agents, Silero VAD, faster-whisper / hosted STT API |
| **R4** | **AI Analysis & Agent Orchestrator** | `AI/Agents` | Language Coach, Argument Coach, Debate Judge, Consensus Engine, quote grounding guard, Pydantic schemas | Python, Pydantic v2, OpenAI-compatible APIs, Redis Queue (ARQ) |
| **R5** | **Fact-Checking, DevOps & QA Lead** | `DevOps/QA` | Claim detector, search integration, evidence evaluator, Docker/Caddy staging deployment, CI/CD, Playwright E2E | Docker Compose, Caddy (TLS), GitHub Actions, Search API, Playwright, pytest |

---

## 2. Sprint-by-Sprint Work Breakdown Structure (WBS)

### Sprint 1 (Weeks 1–2): Foundation, Infrastructure & Authentication

**Sprint Goal:** Working web application with registration/login, user profiles with CEFR level selection, topic library browsing, room creation/joining (capacity = 2), and CI/CD baseline.

| Task ID | Task Description | Assignee | Deliverable / PR Output | FR / NFR | Dep |
|---|---|---|---|---|---|
| **T1.1** | Repository setup, monorepo layout (`web/`, `api/`, `workers/`), code style linters (Ruff, ESLint, Prettier), GitHub Actions CI pipeline | **R5** | `.github/workflows/ci.yml`, root scripts | NFR-15 | None |
| **T1.2** | Docker Compose setup for local dev (PostgreSQL 16, Redis 7, LiveKit dev server) & `.env.example` template | **R5** | `docker-compose.yml`, `.env.example` | NFR-15 | T1.1 |
| **T1.3** | PostgreSQL initial schema & Alembic migrations (`users`, `user_profiles`, `debate_topics`, `debate_rooms`, `debate_participants`) | **R2** | `api/migrations/versions/001_initial.py` | FR-01, FR-02 | T1.2 |
| **T1.4** | Authentication system: Argon2id password hashing, JWT access/refresh token rotation, middleware | **R2** | `api/app/auth/`, unit tests | FR-01, FR-03 | T1.3 |
| **T1.5** | Next.js project init, Tailwind CSS setup, design tokens, responsive layout shell, auth pages (Login, Register) | **R1** | `web/app/(auth)/`, form validations | NFR-11 | T1.1 |
| **T1.6** | Profile management: CEFR level selector (A2, B1, B2, C1), target speaking goals, settings update API & UI | **R1, R2** | `web/app/profile/`, `api/app/auth/me.py` | FR-02 | T1.4, T1.5 |
| **T1.7** | Topic management API & seed catalog: CRUD for admins, category/difficulty filtering for learners (≥30 seed topics) | **R2** | `api/app/topics/`, `scripts/seed_topics.py` | FR-06, FR-07 | T1.3 |
| **T1.8** | Topic browsing & selection UI: category filter, CEFR badges, search bar | **R1** | `web/app/topics/` | FR-06 | T1.7, T1.5 |
| **T1.9** | Room lifecycle API: `create_room`, `join_room` via 8-character invite code, row-locked capacity check (max 2) | **R2** | `api/app/rooms/` (state: `LOBBY`) | FR-10, FR-11 | T1.3, T1.4 |
| **T1.10** | Room Lobby UI: Create room dialog, invite code sharing, waiting for opponent view | **R1** | `web/app/rooms/[id]/lobby/` | FR-10, FR-11 | T1.9 |
| **T1.11** | Spike: LiveKit standalone connectivity test (2 web clients connect to local LiveKit server, verify echo) | **R1, R3** | Spike PR / test page | FR-18 | T1.2 |
| **T1.12** | Adapter Protocol definitions: create `STTAdapter`, `LLMAdapter`, and `SearchAdapter` abstract interfaces + test mocks | **R4** | `api/app/adapters/` | NFR-15 | T1.1 |

---

### Sprint 2 (Weeks 3–4): Live Debate Room, Real-Time Audio & Staging Deployment

**Sprint Goal:** Two human users on separate networks can join the same debate room, pass microphone verification and consent, talk over real-time WebRTC audio with visible timers/mute states, and have the session recorded.

| Task ID | Task Description | Assignee | Deliverable / PR Output | FR / NFR | Dep |
|---|---|---|---|---|---|
| **T2.1** | LiveKit server token minting service: short-lived, room-scoped JWTs with audio-only publisher permissions | **R2** | `api/app/rooms/tokens.py` | FR-18, NFR-10 | T1.9 |
| **T2.2** | LiveKit client integration in web app: connect to room using minted token, manage audio tracks | **R1** | `web/components/audio/LiveKitRoom.tsx` | FR-18 | T2.1, T1.11 |
| **T2.3** | Pre-debate mic test & device selector modal: mic permissions check, visual volume level meter, recovery guidance | **R1** | `web/components/audio/MicCheckModal.tsx` | FR-19 | T2.2 |
| **T2.4** | Room state machine engine: enforce `LOBBY` → `READY` → `LIVE` → `ENDED` transitions, validate server-side | **R2** | `api/app/rooms/state.py` | FR-12 | T1.9 |
| **T2.5** | Real-time WebSocket signaling hub: room presence, state transitions, timer synchronization | **R2** | `api/app/rooms/ws.py` | FR-12, FR-15 | T2.4 |
| **T2.6** | Consent gate modal & audit logging: require explicit dual consent before starting debate | **R1, R2** | `web/components/room/ConsentModal.tsx` | FR-13, NFR-09 | T2.4 |
| **T2.7** | In-room debate UI: speaker cards, speaking/active visualizer, mute/unmute buttons, connection health indicator | **R1** | `web/app/rooms/[id]/live/` | FR-20, FR-21 | T2.2, T2.5 |
| **T2.8** | Debate timers: overall session countdown & timed-turn format speaker indicator (free-flow vs timed turns) | **R1** | `web/components/room/DebateTimer.tsx` | FR-14 | T2.5 |
| **T2.9** | Disconnect & reconnection handler: 60-second grace window, auto-reconnect, auto-end if abandoned | **R2, R1** | Reconnection logic & banner | FR-15, NFR-07 | T2.5 |
| **T2.10** | End-of-debate flow: manual end button, timer expiry hook, session creation (`debate_sessions`) | **R2** | `api/app/rooms/session.py` | FR-12, FR-15 | T2.4 |
| **T2.11** | Setup LiveKit Cloud account & configure production credentials in staging environment | **R5** | Secret management & configuration | NFR-16 | T2.1 |
| **T2.12** | **Staging Deployment (Hybrid Option E):** Deploy web, API, PostgreSQL, Redis to cloud VM with Caddy reverse proxy (automated TLS) | **R5** | Production Docker Compose, staging domain | NFR-16 | T1.2, T2.11 |
| **T2.13** | Acceptance Test AC-2.8: Validate two-user spoken debate across two different networks (e.g. mobile hotspot vs Wi-Fi) | **R5, R1** | Test execution signoff report | AC-2.8 | T2.12 |

---

### Sprint 3 (Weeks 5–6): Speech-to-Text Pipeline, Diarization & AI Analysis Engine

**Sprint Goal:** Real-time audio stream transcription with per-participant track attribution, live transcript display in the UI, asynchronous agent analysis (Language Coach, Argument Coach, Claim Detector, and Fact Checker).

| Task ID | Task Description | Assignee | Deliverable / PR Output | FR / NFR | Dep |
|---|---|---|---|---|---|
| **T3.1** | LiveKit transcription bot agent: join room as silent subscriber, hook into participant audio tracks | **R3** | `workers/transcription/agent.py` | FR-23, FR-24 | T2.1, T2.12 |
| **T3.2** | Silero VAD integration: split audio stream into speech bursts, discard silence, measure pause durations | **R3** | `workers/transcription/vad.py` | FR-29 | T3.1 |
| **T3.3** | Streaming STT adapter implementation (hosted STT API / `faster-whisper`), word-level timestamps & confidence | **R3** | `workers/transcription/stt.py` | FR-23, FR-25 | T3.2, T1.12 |
| **T3.4** | Transcript persistence & Redis pub/sub publisher: idempotent segment storage by `(session_id, speaker_id, seq)` | **R3, R2** | `api/app/transcript/store.py` | FR-24, FR-25 | T3.3 |
| **T3.5** | Real-time transcript WebSocket stream: broadcast partial & final text events to both web clients | **R2** | `api/app/transcript/ws.py` | FR-26 | T3.4, T2.5 |
| **T3.6** | Live transcript UI component: auto-scrolling view, speaker name labels, partial word streaming, confidence flags | **R1** | `web/components/transcript/LiveTranscript.tsx` | FR-26 | T3.5 |
| **T3.7** | Asynchronous job dispatcher (Redis/ARQ): background task coordinator for post-debate analysis stages | **R2** | `workers/analysis/queue.py` | NFR-05 | T2.10 |
| **T3.8** | Deterministic speech metrics calculator: WPM, filler word count/rate, pause profile, talk-time ratio, MATTR | **R4** | `workers/analysis/metrics.py` | FR-29 | T3.4 |
| **T3.9** | Language Coach agent: prompt design, grammar/vocab extraction, CEFR adaptation, quote grounding validator | **R4** | `workers/analysis/language.py` | FR-30, FR-31, NFR-13 | T3.7, T3.8 |
| **T3.10** | Argument Coach agent: identify claims, supports, rebuttal quality, counterargument handling, logical fallacies | **R4** | `workers/analysis/argument.py` | FR-34, FR-35, FR-36 | T3.7 |
| **T3.11** | Claim Detector agent: classify sentences (factual vs opinion), score check-worthiness, extract top-N claims (N=8) | **R5** | `workers/analysis/claim_detector.py` | FR-38 | T3.7 |
| **T3.12** | Search & Evidence retrieval pipeline: query formulation, search API execution (Serper/Tavily), HTML sanitization | **R5** | `workers/analysis/search.py` | FR-39, SEC-03 | T3.11, T1.12 |
| **T3.13** | Evidence Evaluator & Skeptic agents: evaluate snippets, assign 5-level verdicts with uncertainty & source citations | **R5** | `workers/analysis/evidence.py` | FR-40, FR-43 | T3.12 |
| **T3.14** | Prompt injection security test suite: inject adversarial spoken phrases & web snippets, assert zero rule bypasses | **R5** | `tests/security/test_injection.py` | SEC-01, SEC-02 | T3.9, T3.13 |

---

### Sprint 4 (Weeks 7–8): Learning Reports, Evaluation, Hardening & Final Capstone Demo

**Sprint Goal:** Complete post-debate learning reports (scores, quoted feedback, verified sources, practice plan), user history & progress dashboard, admin moderation, full testing suite, and capstone presentation readiness.

| Task ID | Task Description | Assignee | Deliverable / PR Output | FR / NFR | Dep |
|---|---|---|---|---|---|
| **T4.1** | Debate Judge agent: rubric scoring (Argument, Evidence, Rebuttal, etc.) with structured JSON justification | **R4** | `workers/analysis/judge.py` | FR-44 | T3.10, T3.13 |
| **T4.2** | Deterministic Consensus Engine: calculate median, spread, and trigger `CONTESTED` flag for high evaluator variance | **R4** | `workers/analysis/consensus.py` | FR-45 | T4.1, T3.13 |
| **T4.3** | Learning Coach report synthesizer: compile language scores, debate scores, speech metrics, and personalized drills | **R4** | `workers/analysis/report.py` | FR-48, FR-49 | T4.2, T3.9 |
| **T4.4** | Report retrieval API & regeneration endpoint: support partial report states, retry failed analysis stages | **R2** | `api/app/analysis/reports.py` | FR-48, FR-52 | T4.3 |
| **T4.5** | Personalized Learning Report UI: comprehensive breakdown, score cards, expandable quoted corrections, source links | **R1** | `web/app/debates/[id]/report/` | FR-41, FR-48 | T4.4 |
| **T4.6** | Full transcript review UI with post-debate export (Markdown/Text) and segment error reporting ("Flag mis-transcription") | **R1** | `web/app/debates/[id]/transcript/` | FR-27 | T4.4, T3.4 |
| **T4.7** | Learner History & Progress Dashboard: past debates list, score trend charts (Recharts), recurring error patterns | **R1, R2** | `web/app/history/`, `api/app/analysis/trends.py` | FR-50, FR-51, FR-32 |
| **T4.8** | Privacy & Data Management: user account deletion, individual debate deletion (cascading purge), data retention worker | **R2** | `api/app/auth/gdpr.py` | FR-04, FR-54, NFR-09 | T4.4 |
| **T4.9** | Moderator/Admin console: abuse report review queue, room force-close action, user suspension, AI token usage metrics | **R1, R2** | `web/app/admin/`, `api/app/admin/` | FR-05, FR-16, FR-17, FR-46 |
| **T4.10** | End-to-End automated testing suite (Playwright): multi-browser simulation of 2-user debate, audio flow, and report check | **R5** | `tests/e2e/test_full_debate.spec.ts` | NFR-08 | T4.5, T2.12 |
| **T4.11** | Academic evaluation harness: evaluate transcription WER, claim detection precision/recall, and judge consistency on golden set | **R5, R4** | `scripts/eval_golden.py`, evaluation report | Section 2 (Spec) | T4.3, T3.3 |
| **T4.12** | User usability study: conduct trial runs with ≥6 pairs of English learners, collect SUS questionnaire & feedback | **All (Lead: R1)** | `docs/user_study_results.md` | NFR-11 | T4.5, T2.12 |
| **T4.13** | Production freeze, security audit, database automated backup cron, offline demo fallback video & slides prep | **R5, All** | Final slide deck & demo backup script | AC-4.8, AC-4.9 | All |

---

## 3. Individual Member Workload & Ownership Summary

```
+--------------------------------------------------------------------------------------------------+
| ROLE 1: FRONTEND & WEBRTC/AUDIO ENGINEER (R1)                                                    |
| Focus: User Interface, Real-Time WebRTC Media Player, Debate Experience, Interactive Reports     |
| Tasks: T1.5, T1.6, T1.8, T1.10, T1.11, T2.2, T2.3, T2.6, T2.7, T2.8, T2.9, T3.6, T4.5, T4.6, T4.7 |
+--------------------------------------------------------------------------------------------------+
| ROLE 2: BACKEND & REAL-TIME MEDIA ENGINEER (R2)                                                  |
| Focus: Core API, PostgreSQL Relational Data, WebSockets, LiveKit Token Minting, Job Queueing    |
| Tasks: T1.3, T1.4, T1.6, T1.7, T1.9, T2.1, T2.4, T2.5, T2.6, T2.9, T2.10, T3.4, T3.5, T3.7, T4.4, T4.8, T4.9 |
+--------------------------------------------------------------------------------------------------+
| ROLE 3: SPEECH & REAL-TIME PIPELINE ENGINEER (R3)                                                |
| Focus: LiveKit Bot Worker, Audio Track Hook, VAD Speech Segmentation, Streaming STT Engine       |
| Tasks: T1.11, T3.1, T3.2, T3.3, T3.4                                                            |
+--------------------------------------------------------------------------------------------------+
| ROLE 4: AI ANALYSIS & AGENT ORCHESTRATOR (R4)                                                    |
| Focus: Language Coach, Argument Coach, Judge, Consensus Engine, Hallucination/Grounding Guards    |
| Tasks: T1.12, T3.8, T3.9, T3.10, T4.1, T4.2, T4.3, T4.11                                        |
+--------------------------------------------------------------------------------------------------+
| ROLE 5: FACT-CHECKING, DEVOPS & QA LEAD (R5)                                                     |
| Focus: Claim Detection, Web Search/Evidence, Cloud Deployment, CI/CD, Security, E2E Testing     |
| Tasks: T1.1, T1.2, T2.11, T2.12, T2.13, T3.11, T3.12, T3.13, T3.14, T4.10, T4.11, T4.13        |
+--------------------------------------------------------------------------------------------------+
```

---

## 4. Definition of Done & Hand-off Checkpoints

Before any pull request (PR) or task is marked **DONE**, it must satisfy:
1. **Automated Verification:** Associated unit/integration tests pass in GitHub Actions (`pytest`, `vitest`, `playwright`).
2. **Code Quality:** `ruff check` (Python) and `eslint` (TypeScript) pass with 0 errors and 0 warnings.
3. **Traceability:** PR description explicitly references its Task ID (e.g., `Closes T2.4`).
4. **Security Check:** No plaintext API keys or secrets committed; all new endpoints enforce user ownership/authorization checks.
5. **No Regressions on Staging:** Staging deployment continues passing health checks (`/api/health`) and maintains two-way audio integrity.
