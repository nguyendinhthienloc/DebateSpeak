# DebateSpeak AI — Project Constitution & Governance (constitution.md)

> **Document Status:** Ratified & Enforced  
> **Target Audience:** All Team Members (Lộc, Triết, Tài, Khoa, Tuấn), AI Coding Agents (Copilot, Cursor, Antigravity, Claude, GPT), and Course Evaluators.  
> **Governance Authority:** Supersedes all ad-hoc conventions. Enforced via Automated CI/CD, Spec Kit (`/src`), and PR Review Gates.

---

## 1. Core Engineering Principles

### Principle I: Zero Absolute / Hardcoded Paths Policy (Portability Invariant)
1. **Strictly Prohibited:** Machine-specific, developer-specific, or OS-specific absolute paths (e.g., `D:\APCS\...`, `C:\Users\Thien Loc\...`, `/home/user/...`).
2. **Dynamic Resolution:** All file operations, module imports, configuration loaders, and asset references must use relative paths or runtime environment helpers:
   - **Python:** `pathlib.Path(__file__).resolve().parent`, `os.environ.get("BASE_DIR", ".")`
   - **TypeScript / React:** `import.meta.env`, relative module paths (`./`, `../`), or path aliases (`@/`) defined in `tsconfig.json`.
3. **Multi-Platform Interoperability:** The codebase must execute and pass tests identically across Windows, macOS, Linux (Docker containers), and GitHub Actions CI runners.

### Principle II: Strict Credential & Secret Protection
1. **Zero Secret Leakage:** Never commit, stage, or log `.env`, `.env.local`, `.env.production`, or active credentials (LiveKit API secrets, JWT secrets, database passwords, LLM API keys).
2. **Template Parity:** Any new environment variable must be registered in `.env.example` with empty/template placeholder values.
3. **Automated Enforcement:** Continuous integration must fail immediately if tracked secret patterns or un-ignored `.env` files are detected.

### Principle III: Specification-Driven Development (SDD & Spec Kit)
1. **Spec Before Code:** Architectural schemas, route contracts, Pydantic data models, and test matrices must be authored and reviewed in `/src` before implementation commits.
2. **Clean Architecture & No Placeholders:** No stub functions with bare `pass` or untracked `TODO`. Every code unit must map to an active requirement and test case.
3. **Vendor Decoupling:** Business logic must remain completely decoupled from third-party vendor APIs through abstract adapter interfaces:
   - `STTAdapter` (LiveKit agents, cloud streaming STT, local fallback)
   - `LLMAdapter` (Language coach, argument coach, consensus judge)
   - `SearchAdapter` (Fact-checking search retrieval)

### Principle IV: Incremental Vertical Slices (Working Software Invariant)
1. **Vertical Slices Over Horizontal Layers:** Every pull request and sprint deliverable must provide an end-to-end, testable increment (UI -> API -> DB/Service).
2. **Working State Preservation:** The `dev` and `main` branches (and the current sprint branch, e.g. `pa2`) must remain in a passing, releasable state. Existing working features must never be broken to support future increments.

### Principle V: Dual-Consent & Debate Psychological Safety
1. **Explicit Dual-Consent:** Real-time audio streaming, recording, and automated transcription must never initiate without explicit, uncoerced consent from both debaters in the room.
2. **Audio Integrity & Low Latency:** Low-latency WebRTC routing and deterministic speaker track separation take precedence over heavy real-time computation.

### Principle VI: Grounding Guard & Brutal Intellectual Honesty
1. **Grounding Guard (Zero Hallucination):** Every piece of language coaching, argument critique, and fallacy attribution must cite a verbatim quote from the student's transcript segment.
2. **No Participation Trophies:** AI evaluations must maintain clinical, objective precision. Flaws in reasoning, logical fallacies (strawman, ad hominem, false dilemma), and factual errors must be plainly called out and paired with constructive remediation.

### Principle VII: Team Attribution & Agent Candor
1. **Verified Attribution:** Documentation, task cards, and Git contributions attribute the five official team members by student ID and role (Lộc `24125093`, Triết `24125047`, Tài `24125078`, Khoa `24125058`, Tuấn `24125107`), as listed in `AGENTS.md` §3.
2. **Human Consequence Reasoning:** Before any architectural, code, or prompt decision, evaluate its effect on live debaters: dignity, cognitive load, and the fragile conversational rhythm of spontaneous speech.
3. **Agent Candor:** AI coding agents state technical debt, security flaws, brittle approaches, and incomplete stubs plainly. They never present an incomplete stub as functional.

---

## 2. Technology Stack & Architectural Boundaries

| Layer | Standard Technology | Non-Negotiable Invariants |
|---|---|---|
| **Frontend** | Vite + React (TypeScript) + Tailwind CSS | Single-Page Application (SPA) only; no SSR; responsive for mobile & desktop. |
| **Backend API** | FastAPI (Python 3.11+) | Async endpoints, SQLAlchemy 2 async ORM, Alembic migrations, Pydantic v2 validation. |
| **Database & Cache** | PostgreSQL 16 + Redis 7 | PostgreSQL for relational entities; Redis for pub/sub events and ARQ background job queue. |
| **Real-Time Audio** | LiveKit Cloud / LiveKit Server | Independent audio tracks per participant for deterministic speaker attribution. |
| **Staging Gateway** | Caddy Reverse Proxy | Automatic TLS/HTTPS encryption (strictly required by modern browsers for WebRTC/microphone access). |
| **Testing Harness** | pytest, pytest-asyncio, Playwright | Unit, integration, and end-to-end audio packet-drop chaos test coverage. |
| **Academic Reports** | latexmk (`latexmk -pdf report.tex`) | High-quality, reproducible academic document compilation for all project assignments. |

---

## 3. Development Workflow, Review Gates & Governance

1. **Jira Issue Integrity:**
   - Every sprint task has exactly one assignee and one designated reviewer.
   - Task completion dates progress naturally across the sprint; batch completions at sprint end are prohibited.
2. **Pull Request Quality Gates:**
   - Automated CI passing: Ruff linting & formatting (Python), ESLint & TSC (TypeScript), pytest suite, and secret scanning.
   - At least one approved code review from the designated peer reviewer before merging to the sprint branch (`pa2`), and the sprint branch merges to `dev` only after Sprint Review.
3. **Constitution Governance:**
   - This Constitution supersedes individual coding preferences.
   - Any amendment requires consensus across all 5 team leads and an updated version timestamp.

---

**Version:** 1.0.1 | **Ratified:** 2026-10-13 | **Last Amended:** 2026-10-21  
**Custodians:** Trần Lê Anh Tuấn (AI Orchestrator Lead) & Nguyễn Đình Thiên Lộc (DevOps & QA Lead)
