# AGENTS.md — Autonomous AI Agent Operating Guidelines & Constraints

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & CODING ASSISTANTS:**  
> This file defines strict, non-negotiable operational invariants for any AI agent (Antigravity, Cursor, GitHub Copilot, Claude, GPT, etc.) modifying or generating code in this repository.

---

## 1. Zero Absolute/Hardcoded Paths Policy

1. **NO HARDCODED ABSOLUTE PATHS:**
   - Never write machine-specific or OS-specific absolute paths such as:
     - `D:\APCS\...`
     - `C:\Users\Thien Loc\...`
     - `/home/user/...`
     - `/Users/...`
   - All file operations, module imports, configuration loaders, and asset references **must use relative paths** or resolve paths dynamically via standard environment helpers:
     - Python: `pathlib.Path(__file__).resolve().parent`, `os.environ.get("BASE_DIR", ".")`
     - TypeScript / React: `import.meta.env`, relative module imports (`./`, `../`), or project path aliases (`@/`) defined in `tsconfig.json`.

2. **PORTABILITY ACROSS ENVIRONMENTS:**
   - The codebase must run cleanly and identically across Windows, macOS, Linux (Docker), and cloud CI/CD runners without file path modifications.

---

## 2. Strict Credential & Secret Protection (`.env`)

1. **NEVER COMMIT SECRETS OR `.ENV` FILES:**
   - Under no circumstances may an agent commit, stage, or hardcode:
     - `.env`
     - `.env.local`
     - `.env.production`
     - Secret keys (`AIza...`, `gsk_...`, `sk-...`, LiveKit API secrets, JWT secrets, database passwords).
2. **USE `.env.example` WITH PLACEHOLDERS ONLY:**
   - Any new configuration variable must be added to `.env.example` with empty/template values (e.g. `LLM_API_KEY=`).
3. **GITIGNORE ENFORCEMENT:**
   - Verify that `.env*` (except `.env.example`), `.venv/`, `node_modules/`, `__pycache__/`, and build artifacts are strictly listed in `.gitignore`.

---

## 3. Team Member Identity & Role Attribution

All documentation, task cards, and Git contributions must strictly attribute the 5 official team members using their verified student IDs and assigned full-stack lead roles:

| Student ID | Full Name | Short Name | Official Team Role |
|---|---|---|---|
| **24125093** | **Nguyễn Đình Thiên Lộc** | **Lộc** | **DevOps & QA / Fact-Checking Lead** |
| **24125047** | **Nguyễn Bảo Minh Triết** | **Triết** | **Frontend & WebRTC/Audio Lead** |
| **24125078** | **Nguyễn Hồng Tấn Tài** | **Tài** | **Backend & Real-Time Media Lead** |
| **24125058** | **Nguyễn Anh Khoa** | **Khoa** | **AI Audio & Speech Pipeline Lead** |
| **24125107** | **Trần Lê Anh Tuấn** | **Tuấn** | **AI Orchestrator & Analysis Lead** |

Every authored section or document header must include attribution adhering to PA1-2026 guidelines (e.g. `*Author: Nguyễn Bảo Minh Triết (24125047) | Reviewer: Nguyễn Đình Thiên Lộc (24125093)*`).

---

## 4. Software Architecture Invariants

1. **Frontend Architecture:**
   - Single-Page Application (SPA) built with **Vite + React (TypeScript) + Tailwind CSS**.
   - No server-side rendering (SSR) frameworks. Responsive layout for both desktop and mobile web.
2. **Backend Architecture:**
   - **FastAPI (Python 3.11+)** with async endpoints, SQLAlchemy 2 async ORM, and Alembic migrations.
   - Database: **PostgreSQL 16**. Cache & Job Queue: **Redis 7** (using ARQ for async tasks).
3. **Real-Time Media & Audio:**
   - Use **LiveKit Cloud** free tier for audio routing to guarantee WebRTC connectivity across NAT/firewalls.
   - Audio is processed on independent tracks per speaker to provide deterministic speaker attribution.
4. **Speech-to-Text & Diarization:**
   - Provider-agnostic STT adapter (`STTAdapter`): Cloud streaming STT API for live rooms with local transcription fallback.
5. **LLM Coaching Engine:**
   - Provider-agnostic LLM adapter (`LLMAdapter`): Configurable via environment variables (cloud-hosted or self-hosted endpoint).
   - **Grounding Guard:** Every language and argument feedback item must cite a verbatim quote from the student's transcript segment. Never hallucinate learner errors.

---

## 5. Specification-Driven Development Rules

1. **SPEC BEFORE CODE:**
   - Do not write code before updating the corresponding specifications in `docs/analysis-and-design/SOFTWARE_ARCHITECTURE_SPEC.md` and `docs/requirements/PROJECT_PROPOSAL.md`.
2. **CLEAN ARCHITECTURE & NO PLACEHOLDERS:**
   - Never commit stub functions with `pass` or `TODO` without a defined ticket or contract.
   - Keep business logic decoupled from third-party vendor APIs using abstract adapter protocols (`LLMAdapter`, `STTAdapter`, `SearchAdapter`).
3. **ACADEMIC REPORTING (LATEXMK):**
   - Project reports, submission PDFs, and deliverables must be compiled using **`latexmk`** (`latexmk -pdf report.tex`) to ensure reproducible, high-quality typography.

## 6. Incremental Development & Vertical Slices Policy

1. **INCREMENTAL, WORKING SOFTWARE OVER BIG-BANG RELEASES:**
   - Every sprint, user story, and pull request must deliver an **end-to-end, vertically sliced, testable increment** of functionality.
   - Do not build isolated horizontal layers in silos (e.g. creating 20 empty database tables or 15 mocked UI pages with zero connection). Every feature increment must connect UI -> API -> Database/Service.
2. **VERIFIED WORKING STATE PRESERVATION:**
   - The `develop` and `main` branches must remain in a releasable, passing state at all times.
   - Never break existing working features to introduce partial code for future sprints. Stubs must be feature-flagged or confined to isolated branches until integration tests pass.
3. **INCREMENT PROGRESSION PATH:**
   - **Increment 1 (PA1/Sprint 1):** Walking Skeleton (Auth, Topic Selection, Room State Machine).
   - **Increment 2 (PA2/Sprint 2):** Live Audio Core (WebRTC LiveKit connection, synchronized audio exchange, staging HTTPS).
   - **Increment 3 (PA3/Sprint 3):** Real-time Intelligence (VAD, Streaming STT, Language & Argument Coach pipeline).
   - **Increment 4 (PA4/Sprint 4):** Complete Product (Personalized Learning Reports, Consensus Engine, Longitudinal Trends).
