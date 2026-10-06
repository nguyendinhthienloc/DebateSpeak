# DebateSpeak AI — Development Roadmap & Incremental Lifecycle

This document outlines the end-to-end development roadmap and incremental delivery milestones for **DebateSpeak AI**, tracking the progression from foundational architecture to a fully hardened, multi-agent real-time debate platform.

---

## 1. Incremental Development Model (5 Sprints mapped to PA1–PA5)

The project follows a strict **Incremental Development Lifecycle**, delivering functional, verified vertical slices across **5 Sprints** that align directly with engineering milestones and course assignments:

| Sprint | Assignment | Primary Capability Delivered | Verification Milestone / Build |
|---|---|---|---|
| **Sprint 1** | **PA1 (Weeks 1–2)** | **Project Conception & Setup:** 10 Functional Groups, Survey, Contract, Dev Process | CI pipeline green, Docker Compose skeleton, LaTeX report |
| **Sprint 2** | **PA2 (Weeks 3–4)** | **Planning & Core Foundation:** Project Plan, Vision Doc, Spec Kit init in `/src` | **Build 1:** User Auth + Room Lobby state machine skeleton |
| **Sprint 3** | **PA3 (Weeks 5–6)** | **Use-Case Modeling & First Functional Slice:** Specs, UI prototypes, Changes.md | **Build 2:** Full-stack implementation of FG-03 + narrated video demo |
| **Sprint 4** | **PA4 (Weeks 7–8)** | **Architecture & Second Slice:** C4 Context/Container/Component/Deployment | **Build 3:** Full-stack audio & streaming STT (FG-04 & FG-05) + demo |
| **Sprint 5** | **PA5 (Weeks 9–10)** | **Testing, Hardening & Final Presentation:** Test plan, refined tests, reflective report | **Build 4 (Final):** 15-min live demo showcasing all 10 FGs |

---

## 2. Sprint Milestones & Release Strategy

### Sprint 1: Project Conception & Foundation Setup
- Core problem framing: 10 distinct functional groups covering spoken debate education.
- Survey of existing platforms (ArguFight, Khaos Live, ELSA Speak).
- Repository infrastructure, CI/CD linters (Ruff, ESLint, GitHub Actions), and containerized dev environment.
- Architecture specification and testing strategy design.

### Sprint 2: Planning, Core Foundation & Build 1
- Vision Document and Project Plan formulation.
- Specification Kit setup (`/src/constitution.md`).
- **Build 1:** User authentication (Argon2id, JWT), database models (SQLAlchemy / PostgreSQL), and Room Lobby state machine.

### Sprint 3: Use-Case Modeling & Build 2 (First Functional Slice)
- Formal use case specifications and sequence diagrams.
- UI prototyping and component design in Tailwind CSS.
- **Build 2:** End-to-end slice connecting frontend room lobby to backend state machine, topic selection, and synchronized debate start.

### Sprint 4: System Architecture & Build 3 (Media & Speech Slice)
- C4 architectural models (Context, Container, Component, Deployment).
- LiveKit Cloud WebRTC integration for bidirectional audio tracks.
- Silero VAD vocal segmentation and streaming STT adapter integration.
- **Build 3:** Live peer audio debate with synchronized speech-to-text generation and speaker attribution.

### Sprint 5: Multi-Agent Intelligence, Testing & Build 4 (Final Product)
- Language Coach (grammar/lexical scoring), Argument Coach (rebuttal analysis), and Fact-Checking search adapter.
- Deterministic Consensus Engine and quote-grounding validation guards.
- Automated E2E testing (Playwright), audio chaos tests, and golden-set LLM evaluation.
- **Build 4:** Complete production release with live 15-minute multi-agent demonstration and comprehensive analytical reports.

---

## 3. Related Management Documents

- [Sprint Tasks & Work Breakdown Structure](management/SPRINT_TASKS.md)
- [Development Tools & Engineering Process](management/DEV_TOOLS_AND_PROCESS.md)
- [Team Contract & Operating Rules](management/TEAM_CONTRACT.md)
- [Software Architecture Specification](architecture/SOFTWARE_ARCHITECTURE_SPEC.md)
- [Testing & Quality Assurance Plan](testing/TESTING_PLAN.md)

