# DebateSpeak AI — Product Context

<!-- impeccable:product-schema 1 -->

Captured by Codex on 2026-10-29 from the sources below and the user's init interview. This is a product-context summary, not evidence of implemented features, human review, or validated learning outcomes. Engineering constraints remain governed by [AGENTS.md](AGENTS.md); the delivery schedule follows [docs/ROADMAP.md](docs/ROADMAP.md).

## Platform

web

Responsive browser application for desktop and mobile web. Native mobile applications are not part of the documented scope.

## Users

- Intended learners span self-selected CEFR levels A2, B1, B2, and C1: university students, non-native professionals, developing English learners, and novice academic debaters.
- Their job is to practice spontaneous English with another person, respond to disagreement, and identify specific improvements in expression and reasoning.
- **Primary audience remains undecided**, as explicitly requested by the user. Do not silently prioritize university B1–B2 learners in future product decisions.
- The Vision Document proposes consenting university participants for an initial pilot and B1–B2 speech for transcription evaluation. These are evaluation populations, not a confirmed primary market. Participation by minors requires separately reviewed safeguards.
- Moderators/admins curate topics, handle abuse reports and account restrictions, and oversee authorized operational actions.
- **Human Evaluator scope is unresolved.** The proposal includes an assigned-debate grading role in the MVP; the Vision Document describes learner and moderator roles and excludes a separate teacher dashboard. Preserve this conflict until the team resolves it; do not infer that a grading role and a teacher dashboard are equivalent.

## Product Purpose

DebateSpeak AI connects two people for spoken English debate and turns their exchange into actionable, transcript-linked language and reasoning feedback. The intended outcome is a repeatable practice-to-reflection loop: participate, understand specific weaknesses, choose follow-up practice, and return for another session.

Success means understandable consent, reliable conversation, clear recovery when something fails, and focused feedback a learner can act on. Scores support reflection; they do not measure personal worth or certify proficiency. Learning benefits and quality targets require evaluation.

## Positioning

The intended distinction is the combination of live human disagreement, independent speaker tracks, and post-debate reflection across language, argument quality, and selected factual claims in one workflow. Feedback is traceable to the learner's transcript and includes uncertainty and concrete remediation.

Treat this as the product's intended mechanism, not a verified claim of market uniqueness. Existing competitor comparisons are historical project research, not current capability audits.

## Operating Context

- Two authenticated people use separate browsers, potentially on different networks, with microphones and preferably headphones. The MVP uses invite-based joining and assumes a willing partner is available; automatic matching is deferred.
- Full-product journey: sign in, choose a topic, create/join a room, review processing and consent, explicitly test the microphone, debate, review a transcript/report, and choose follow-up practice.
- Full-product room lifecycle: `LOBBY → READY → LIVE → ENDED`, with `CANCELLED` for applicable terminal cases. Being present or reaching READY is not consent.
- Live interaction prioritizes audibility, participant presence, mute, connection status, and leaving. Detailed criticism belongs after the debate and must not compete with conversation.
- **Current frontend workflow (2026-11-14):** implement from `web/src/`, DESIGN.md and Spec Kit requirements; verify in the browser. Frontend development is independent of Figma. Both Foundations and Build 1 flow links are historical references. Read, edit or sync Figma only when the user explicitly requests it.

## Capabilities and Constraints

### Intended complete product

The ten functional groups cover accounts/profiles, topics/difficulty, rooms/sessions, live audio, transcription/attribution, language analysis, argument analysis, fact-checking, evaluation/consensus, and personalized reports/history. Include necessary moderation, abuse reporting, and data-control workflows within the documented scope.

Reports combine speaker-linked quotes, language metrics, argument findings, selected evidence checks with source links, and follow-up practice. Distinguish Supported, Partially Supported, Contradicted, Insufficient Evidence, and Not Verifiable claims; expose contested results. Missing analysis must remain visibly partial or unavailable.

### Increment boundaries

- PA2/Sprint 2 is documents only. Product-context capture and design planning do not authorize product implementation.
- Build 1 in PA3/Sprint 3 covers registration, login/refresh/logout, the learner's own CEFR profile, room creation, invite joining, and participant-only room snapshots. Two participants reach READY; a third is rejected.
- Build 1 uses seeded topics, not a working topic catalog/admin API. It has no microphone capture, media connection, transcription, analysis jobs, debate start, or WebSocket. LIVE stays disabled even with two participants. Planned room format/duration settings do not imply implemented live timing.
- Later room/session management follows in PA3, LiveKit audio and streaming STT in PA4, and coaching, reports, consensus, and the complete demonstration in PA5. Consult the roadmap before committing scope.

### Engineering and human safeguards

- Preserve Vite + React + TypeScript + Tailwind CSS SPA architecture; no SSR. Backend requirements are Python 3.11+ FastAPI, SQLAlchemy 2 async ORM, Alembic, PostgreSQL 16, Redis 7, and ARQ.
- Use LiveKit Cloud for independent speaker audio tracks and vendor-independent `STTAdapter`, `LLMAdapter`, and `SearchAdapter` boundaries. Heavy analysis stays outside the audio-critical path.
- No remote audio streaming or transcription before explicit, uncoerced consent from both debaters. A later local microphone test requires an explicit action and browser permission, with no upload, storage, or transcription before dual consent. Build 1 does not capture microphones at all.
- Declining consent must not block ordinary account use. Either participant can end a live session. Preserve dignity and avoid cognitive overload or disruptive correction during speech.
- Every retained language/argument critique must quote the referenced speaker's transcript verbatim, explain the specific failure, and provide a repair. A matching quote does not prove transcription or critique correctness. Do not treat accent as poor reasoning or infer motives.
- No raw-audio persistence by default. The Vision Document targets 90-day transcript retention, immediate hiding after a deletion request, and hard deletion within seven days. Provider-side retention and shared-debate deletion behavior still require resolution before real learner use.
- Use portable relative/dynamically resolved paths, protect credentials, preserve passing branches, and update architecture/proposal specifications before implementation. Submission PDFs use the shared Markdown-to-PDF pipeline in `report/pdf/`.

### Deferred features and open decisions

- Deferred in the Vision Document: video, audience rooms, tournaments, public rankings/ELO, automatic partner matching, payments, separate teacher dashboards, advanced phoneme-level scoring, multi-provider judge panels, sophisticated proficiency progression, and multi-region infrastructure. The proposal also identifies audience participation as post-MVP.
- Build 1 UI is English only, confirmed by the user on 2026-10-29. Behavior, layout, states and accessibility are planned in [the Build 1 UX brief](docs/pa2/BUILD1_UX_BRIEF.md); the selected Cream & Yellow visual system is recorded in [DESIGN.md](DESIGN.md). The [complete Build 1 Figma flow](docs/design/BUILD1_FIGMA_FLOW.md) is built as editable desktop/mobile screens with fixed-sample prototype navigation; frontend account forms and room/profile previews now exist; backend integration remains unfinished.
- Open: primary audience priority, human Evaluator scope, localization beyond Build 1, provider retention and shared-debate deletion behavior, a numeric AI processing budget, and provider integration details.
- At init, no visual system or logo asset was confirmed. The user subsequently selected Cream & Yellow; preserve that colour direction and the current Inter typography. A binding logo asset remains undecided.

## Brand Commitments

User-selected on 2026-10-29: **Cream & Yellow** (formerly Speak Up). Use soft cream `#F6F5F1`, white surfaces `#FFFFFF`, saturated yellow action/accent `#FFD000`, and ink text/outlines `#1C201E`. Keep one unified yellow family, readable darker secondary actions, and no pastel status panels. The active Figma colour-variable collection is `DebateSpeak / Cream & Yellow`; see [the selected colour system](docs/design/MOTIVATION_PALETTES.md).

Use the established product name **DebateSpeak AI**. Coaching is direct, clinically precise, evidence-grounded, and constructive: no false praise, personal insults, invented errors, or unsupported claims. Pair criticism with specific remediation and communicate uncertainty plainly. This coaching standard does not require hostile onboarding or punitive interface copy.

## Evidence on Hand

- [Vision Document](docs/requirements/VISION_DOCUMENT.md): intended audience, product experience, ten functional groups, safeguards, deferred scope, and unverified acceptance targets.
- [Project Proposal](docs/requirements/PROJECT_PROPOSAL.md): purpose, functional groups, architecture context, and the human Evaluator scope that needs alignment.
- [Build 1 specification](docs/architecture/G1_SPEC_BUILD1.md): concrete auth/lobby contracts, state guards, error cases, and an acceptance matrix explicitly marked NOT RUN.
- [Roadmap](docs/ROADMAP.md) and [repository guidelines](AGENTS.md): authoritative schedule and engineering invariants.
- `web/` contains the React/Vite scaffold. Its introductory screen is not evidence of working auth, rooms, audio, or AI coaching, nor a confirmed design system. Its absolute "zero-hallucination" wording must not become a product guarantee.
- The Vision Document's evaluation targets include audio/transcript/report latency, attribution, usability, and feedback quality. They are targets, not measured results or approved marketing claims. No learner-research findings, testimonials, certified learning gains, or completed acceptance tests are established by these sources.

## Product Principles

1. Protect voluntary participation, privacy, and dignity throughout the debate lifecycle.
2. Preserve conversation quality before adding analysis or visual interruption.
3. Make criticism traceable, honest about uncertainty, and actionable.
4. Deliver complete, testable increments and describe capability boundaries accurately.
5. Keep learning and reflection ahead of winning, rankings, or unsupported proficiency claims.

## Accessibility & Inclusion

Consent, microphone controls, and report navigation must support keyboard use and readable status text. Communicate errors with recovery guidance and adapt feedback to the learner's selected CEFR level. Show permission failures and connection/processing states clearly; avoid repeated disruptive alerts.

Responsive mobile layouts are intended. The Vision Document calls for testing the latest two stable desktop Chrome, Edge, and Firefox releases; mobile audio behavior remains best effort until verified. Do not imply accessibility certification, universal browser support, or equivalent speech-recognition accuracy across untested accents and proficiency groups.
