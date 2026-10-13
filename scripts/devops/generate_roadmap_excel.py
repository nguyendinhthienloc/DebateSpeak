#!/usr/bin/env python3
"""
Generate an executive-grade Excel roadmap workbook for:
Nguyễn Đình Thiên Lộc (24125093) - DevOps & QA / Fact-Checking Lead (R5)
DebateSpeak AI Project
"""

import sys
from pathlib import Path
import xlsxwriter

def build_roadmap_excel(output_path: Path):
    workbook = xlsxwriter.Workbook(str(output_path))
    
    # Define Palette & Formats
    NAVY = "#1E3A8A"
    BLUE = "#2563EB"
    LIGHT_BLUE = "#DBEAFE"
    HEADER_BG = "#1E293B"
    ZEBRA_BG = "#F8FAFC"
    BORDER_COLOR = "#CBD5E1"
    
    title_fmt = workbook.add_format({
        "bold": True,
        "font_size": 16,
        "font_color": "#1E3A8A",
        "font_name": "Calibri",
        "align": "left",
        "valign": "vcenter",
    })
    
    subtitle_fmt = workbook.add_format({
        "font_size": 10,
        "font_color": "#64748B",
        "font_name": "Calibri",
        "italic": True,
        "align": "left",
        "valign": "vcenter",
    })
    
    header_fmt = workbook.add_format({
        "bold": True,
        "font_size": 11,
        "font_color": "#FFFFFF",
        "bg_color": HEADER_BG,
        "font_name": "Calibri",
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
        "text_wrap": True,
    })
    
    cell_left = workbook.add_format({
        "font_size": 10,
        "font_name": "Calibri",
        "align": "left",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
    })
    
    cell_center = workbook.add_format({
        "font_size": 10,
        "font_name": "Calibri",
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
    })
    
    cell_currency = workbook.add_format({
        "font_size": 10,
        "font_name": "Calibri",
        "align": "right",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
        "num_format": "$#,##0.0000",
    })
    
    cell_num = workbook.add_format({
        "font_size": 10,
        "font_name": "Calibri",
        "align": "right",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
        "num_format": "#,##0",
    })
    
    # Status badges
    status_done = workbook.add_format({
        "bold": True,
        "font_size": 10,
        "font_name": "Calibri",
        "bg_color": "#D1FAE5",
        "font_color": "#065F46",
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
    })
    
    status_in_progress = workbook.add_format({
        "bold": True,
        "font_size": 10,
        "font_name": "Calibri",
        "bg_color": "#FEF3C7",
        "font_color": "#92400E",
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
    })
    
    status_planned = workbook.add_format({
        "font_size": 10,
        "font_name": "Calibri",
        "bg_color": "#F1F5F9",
        "font_color": "#475569",
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
    })
    
    prio_critical = workbook.add_format({
        "bold": True,
        "font_size": 10,
        "font_name": "Calibri",
        "bg_color": "#FEE2E2",
        "font_color": "#991B1B",
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
    })
    
    prio_major = workbook.add_format({
        "font_size": 10,
        "font_name": "Calibri",
        "bg_color": "#FEF3C7",
        "font_color": "#B45309",
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": BORDER_COLOR,
    })

    # ==========================================
    # SHEET 1: Multi-Sprint WBS (All Tasks)
    # ==========================================
    ws1 = workbook.add_worksheet("Sprint WBS (Tasks)")
    ws1.set_tab_color("#1E3A8A")
    
    ws1.merge_range("A1:I1", "DebateSpeak AI — DevOps & QA / Fact-Checking Lead WBS", title_fmt)
    ws1.merge_range("A2:I2", "Owner: Nguyễn Đình Thiên Lộc (Student ID: 24125093) | Role: R5 | 5 Sprints (PA1–PA5)", subtitle_fmt)
    
    headers_ws1 = [
        "Task ID", "Sprint / PA", "Category", "Task Description & Objective",
        "Deliverable / File Artifact", "Reviewer", "Story Points", "Priority", "Status"
    ]
    
    for col_idx, h in enumerate(headers_ws1):
        ws1.write(3, col_idx, h, header_fmt)
        
    tasks_data = [
        # Sprint 1
        ("T1.1", "Sprint 1 (PA1)", "DevOps / CI", "Repository setup, monorepo layout, code style linters (Ruff, ESLint), GitHub Actions CI", ".github/workflows/ci.yml", "R2 (Tài)", 3, "CRITICAL", "In Progress"),
        ("T1.2", "Sprint 1 (PA1)", "DevOps / Infra", "Docker Compose setup for local dev (PostgreSQL 16, Redis 7, LiveKit dev) & clean .env.example", "docker-compose.yml, .env.example", "R2 (Tài)", 3, "CRITICAL", "Done"),
        ("T1.6", "Sprint 1 (PA1)", "Management", "Setup Dev Tools, Scrum Process & Incremental Slices specification", "docs/management/DEV_TOOLS_AND_PROCESS.md", "R2 (Tài)", 3, "MAJOR", "Done"),
        ("T1.8", "Sprint 1 (PA1)", "QA / Testing", "Draft comprehensive QA & Testing Plan (Unit, Integration, Audio chaos, Golden sets)", "docs/testing/TESTING_PLAN.md", "R3 (Khoa)", 5, "CRITICAL", "Done"),
        ("T1.9", "Sprint 1 (PA1)", "Academic / LaTeX", "Configure latexmk academic report compilation pipeline & compile submission PDF", "report/report.tex, report/build/report.pdf", "R1 (Triết)", 2, "MAJOR", "Done"),
        
        # Sprint 2
        ("T2.1", "Sprint 2 (PA2)", "Management", "Author Project Plan: Goals, deliverables, risks, 5-sprint schedule, build plan", "docs/pa2/PROJECT_PLAN.md", "R1 (Triết)", 5, "CRITICAL", "Planned"),
        ("T2.R", "Sprint 2 (PA2)", "QA / Review", "Verify Backend Build 1: PostgreSQL migrations, Argon2id auth, JWT rotation, and room lobby endpoints", "api/tests/unit/test_auth.py", "R2 (Tài)", 2, "MAJOR", "Planned"),
        
        # Sprint 3
        ("T3.1", "Sprint 3 (PA3)", "Management", "Revised Project Plan & Vision Document with Changes.md (incorporating TA feedback)", "docs/pa3/Changes.md", "R1 (Triết)", 3, "MAJOR", "Planned"),
        ("T3.R", "Sprint 3 (PA3)", "QA / Testing", "E2E testing of Functional Group 03 (Room & Live Session Management) with mock clients", "tests/e2e/test_rooms_lobby.py", "R1 (Triết)", 3, "CRITICAL", "Planned"),
        
        # Sprint 4
        ("T4.4", "Sprint 4 (PA4)", "DevOps / Infra", "Author Deployment Diagram & setup Caddy TLS reverse proxy on staging VM (mic permission HTTPS)", "docs/pa4/DEPLOYMENT_DIAGRAM.md, Caddyfile", "R2 (Tài)", 5, "CRITICAL", "Planned"),
        ("T4.7", "Sprint 4 (PA4)", "Management", "Sprint 4 AI Usage Report & Weekly Report (Scrum metrics, token consumption)", "docs/pa4/WEEKLY_REPORT.md", "R1 (Triết)", 2, "MAJOR", "Planned"),
        ("T4.R", "Sprint 4 (PA4)", "QA / Audio", "Validate audio streaming pipeline under latency & packet loss chaos tests (Playwright fake media)", "tests/e2e/test_audio_stream.py", "R3 (Khoa)", 3, "CRITICAL", "Planned"),
        
        # Sprint 5
        ("T5.1", "Sprint 5 (PA5)", "QA / Testing", "Execute Test Plan & Refine Test Cases: Negative edge cases, state machine violations, grounding guard", "docs/pa5/TEST_EXECUTION_REPORT.md", "R2 (Tài)", 5, "CRITICAL", "Planned"),
        ("T5.2", "Sprint 5 (PA5)", "QA / Defects", "Document pass/fail matrix, triage bug reports, and verify zero open P0/P1 defects", "docs/pa5/DEFECT_MATRIX.md", "R4 (Tuấn)", 3, "CRITICAL", "Planned"),
        ("T5.3", "Sprint 5 (PA5)", "Fact-Checking", "Fact-Checking Engine Hardening: Claim detection threshold, search retrieval sanitization, and Skeptic consensus", "workers/analysis/factcheck.py", "R2 (Tài)", 5, "CRITICAL", "Planned"),
        ("T5.6", "Sprint 5 (PA5)", "Management", "Author Final Reflective Report: SDLC critique, tooling evaluation, individual workload distribution", "docs/pa5/REFLECTIVE_REPORT.md", "All Leads", 5, "CRITICAL", "Planned"),
        ("T5.7", "Sprint 5 (PA5)", "DevOps / Release", "Final Codebase Freeze, tag release v5.0-final, and package submission ZIP archive", "PA5-Group01.zip", "All Leads", 2, "CRITICAL", "Planned"),
    ]
    
    for row_idx, data in enumerate(tasks_data, start=4):
        ws1.write(row_idx, 0, data[0], cell_center)
        ws1.write(row_idx, 1, data[1], cell_left)
        ws1.write(row_idx, 2, data[2], cell_center)
        ws1.write(row_idx, 3, data[3], cell_left)
        ws1.write(row_idx, 4, data[4], cell_left)
        ws1.write(row_idx, 5, data[5], cell_center)
        ws1.write(row_idx, 6, data[6], cell_num)
        
        # Priority style
        p_style = prio_critical if data[7] == "CRITICAL" else prio_major
        ws1.write(row_idx, 7, data[7], p_style)
        
        # Status style
        if data[8] == "Done":
            s_style = status_done
        elif data[8] == "In Progress":
            s_style = status_in_progress
        else:
            s_style = status_planned
        ws1.write(row_idx, 8, data[8], s_style)
        
    ws1.set_column("A:A", 10)
    ws1.set_column("B:B", 16)
    ws1.set_column("C:C", 16)
    ws1.set_column("D:D", 50)
    ws1.set_column("E:E", 35)
    ws1.set_column("F:F", 12)
    ws1.set_column("G:G", 12)
    ws1.set_column("H:H", 12)
    ws1.set_column("I:I", 14)
    ws1.freeze_panes(4, 0)

    # ==========================================
    # SHEET 2: Immediate Tactical Action Plan
    # ==========================================
    ws2 = workbook.add_worksheet("Immediate Action Plan")
    ws2.set_tab_color("#2563EB")
    
    ws2.merge_range("A1:G1", "Immediate Tactical Action Plan — Next 7 Days", title_fmt)
    ws2.merge_range("A2:G2", "Priority sequence to unblock team members (Tài, Triết, Khoa, Tuấn)", subtitle_fmt)
    
    headers_ws2 = ["Step", "Action Item", "Target Directory / File", "Why It Matters", "Unblocks Whom?", "Est. Time", "Status"]
    for col_idx, h in enumerate(headers_ws2):
        ws2.write(3, col_idx, h, header_fmt)
        
    actions = [
        ("Step 1", "Local Docker Compose Infrastructure Setup", "docker-compose.yml, .env.example", "Run PostgreSQL 16, Redis 7, LiveKit locally with 1 command", "Everyone", "Completed", "Done"),
        ("Step 2", "Update README.md with Quick Start & Health Checks", "README.md", "Teammates and evaluators can boot and verify the system in 2 mins", "Everyone / Graders", "Completed", "Done"),
        ("Step 3", "Monorepo Directory Layout Scaffolding", "api/, web/, workers/, tests/, scripts/", "Establishes clean architecture layout per TESTING_PLAN.md", "Tài (R2), Triết (R1)", "15 mins", "In Progress"),
        ("Step 4", "Backend & Frontend Linter Configurations", "api/pyproject.toml, web/eslint.config.js", "Enforce Ruff, Mypy, ESLint so code committed is clean and formatted", "All coders", "30 mins", "Planned"),
        ("Step 5", "GitHub Actions CI Pipeline (.github/workflows/ci.yml)", ".github/workflows/ci.yml", "Automates linting, security audits (pip-audit), tests, and latexmk build", "All PRs", "1 hour", "Planned"),
        ("Step 6", "Draft PA2 Project Plan Document (T2.1)", "docs/pa2/PROJECT_PLAN.md", "Formal PA2 deliverable: Goals, risks, 5-sprint schedule, build roadmap", "Course submission", "2 hours", "Planned"),
    ]
    
    for row_idx, act in enumerate(actions, start=4):
        ws2.write(row_idx, 0, act[0], cell_center)
        ws2.write(row_idx, 1, act[1], cell_left)
        ws2.write(row_idx, 2, act[2], cell_left)
        ws2.write(row_idx, 3, act[3], cell_left)
        ws2.write(row_idx, 4, act[4], cell_center)
        ws2.write(row_idx, 5, act[5], cell_center)
        s_style = status_done if act[6] == "Done" else (status_in_progress if act[6] == "In Progress" else status_planned)
        ws2.write(row_idx, 6, act[6], s_style)
        
    ws2.set_column("A:A", 10)
    ws2.set_column("B:B", 40)
    ws2.set_column("C:C", 35)
    ws2.set_column("D:D", 45)
    ws2.set_column("E:E", 18)
    ws2.set_column("F:F", 14)
    ws2.set_column("G:G", 14)
    ws2.freeze_panes(4, 0)

    # ==========================================
    # SHEET 3: QA & Testing Matrix
    # ==========================================
    ws3 = workbook.add_worksheet("QA & Testing Matrix")
    ws3.set_tab_color("#059669")
    
    ws3.merge_range("A1:F1", "QA Testing Strategy & Quality Gates (NFR-15 Enforcement)", title_fmt)
    ws3.merge_range("A2:F2", "Automated gates required for merging into develop and releasing to main", subtitle_fmt)
    
    headers_ws3 = ["Test Level", "Target Component", "Testing Framework", "Success Criterion", "CI Automation", "Frequency"]
    for col_idx, h in enumerate(headers_ws3):
        ws3.write(3, col_idx, h, header_fmt)
        
    qa_levels = [
        ("Unit Testing", "Backend Auth, Room State Machine, Pydantic schemas", "pytest, pytest-asyncio", ">= 70% line coverage on core business logic", "Yes (GitHub Actions)", "Every PR"),
        ("Integration Testing", "FastAPI + PostgreSQL + Redis (Token minting, session state)", "pytest, respx, testcontainers / service containers", "100% pass on state transition fixtures", "Yes (GitHub Actions)", "Every PR"),
        ("Frontend Unit & Component", "React components, audio volume bars, transcript viewer", "Vitest, React Testing Library", "Zero rendering regressions, 100% pass", "Yes (GitHub Actions)", "Every PR"),
        ("E2E WebRTC Smoke Test", "Two mock users entering room, subscribing to audio", "Playwright with fake media flags", "Room transitions from LOBBY -> LIVE -> COMPLETED", "Yes (Scheduled/PR)", "Nightly & PR"),
        ("Security & Vulnerability", "Python packages (pip-audit), npm dependencies, secrets scan", "pip-audit, npm audit, Gitleaks", "Zero critical/high vulnerabilities; 0 secret leaks", "Yes (GitHub Actions)", "Every commit"),
        ("Golden Set LLM Eval", "Language Coach, Argument Coach, Consensus Judge", "Golden evaluation benchmark scripts", "0 hallucinated quotes; 100% quote grounding", "Semi-automated", "Weekly sprint end"),
        ("Academic LaTeX Build", "Course PDF submission report (report/report.tex)", "latexmk -pdf", "0 compilation fatal errors, clean PDF output", "Yes (GitHub Actions)", "Every push to docs/report"),
    ]
    
    for row_idx, q in enumerate(qa_levels, start=4):
        ws3.write(row_idx, 0, q[0], cell_center)
        ws3.write(row_idx, 1, q[1], cell_left)
        ws3.write(row_idx, 2, q[2], cell_left)
        ws3.write(row_idx, 3, q[3], cell_left)
        ws3.write(row_idx, 4, q[4], cell_center)
        ws3.write(row_idx, 5, q[5], cell_center)
        
    ws3.set_column("A:A", 22)
    ws3.set_column("B:B", 42)
    ws3.set_column("C:C", 30)
    ws3.set_column("D:D", 45)
    ws3.set_column("E:E", 20)
    ws3.set_column("F:F", 18)
    ws3.freeze_panes(4, 0)

    # ==========================================
    # SHEET 4: Cost & Budgeting Model
    # ==========================================
    ws4 = workbook.add_worksheet("Cost & Budget Model")
    ws4.set_tab_color("#D97706")
    
    ws4.merge_range("A1:G1", "DebateSpeak AI — Operational Cost Model (Per 10-Minute Debate)", title_fmt)
    ws4.merge_range("A2:G2", "Standardized calculation enforcing NFR-14 (Cost Control < $0.25 / debate budget)", subtitle_fmt)
    
    headers_ws4 = ["Cost Category", "Service / Provider", "Usage Metric (10-Min Debate)", "Unit Pricing ($)", "Estimated Cost ($)", "Optimization Guardrail", "Risk / Buffer"]
    for col_idx, h in enumerate(headers_ws4):
        ws4.write(3, col_idx, h, header_fmt)
        
    cost_rows = [
        ("WebRTC Audio Routing", "LiveKit Cloud Free Tier", "20 participant-minutes (2 debaters x 10 min)", 0.0000, 0.0000, "Free tier covers 10,000 mins/mo (~500 debates)", "Zero cost within quota"),
        ("Speech-to-Text (STT)", "Deepgram Nova-2 Streaming", "20 audio-minutes (2 independent speaker tracks)", 0.0043, 0.0860, "Fallback: self-hosted faster-whisper ($0.00)", "Medium (highest variable cost)"),
        ("LLM: Language Coach", "Gemini 1.5 Flash / GPT-4o-mini", "~4,000 input tokens, 800 output tokens", 0.00025, 0.0015, "Chunk by speaker turn (~300 words), not whole transcript", "Low (ultra-cheap flash models)"),
        ("LLM: Argument Coach", "Gemini 1.5 Flash / GPT-4o-mini", "~4,000 input tokens, 1,000 output tokens", 0.00025, 0.0016, "Only process substantive argument turns", "Low"),
        ("LLM: Claim Detection", "Gemini 1.5 Flash / GPT-4o-mini", "~3,000 input tokens, 500 output tokens", 0.00025, 0.0010, "Sentence-by-sentence check-worthiness filter", "Low"),
        ("LLM: Skeptic & Judge", "Gemini 1.5 Flash / GPT-4o-mini", "~4,000 input tokens, 1,500 output tokens", 0.00025, 0.0020, "Pass summarized coach outputs, not raw audio text", "Low"),
        ("Search / Fact-Checking", "Serper API / Tavily", "Top 8 check-worthy claims x 2 queries = 16 queries", 0.0010, 0.0160, "Strict cap at Top-N claims (N=8) with score >= 0.6", "Medium (queries blow up if not capped)"),
        ("Fixed Hosting (Monthly)", "Hetzner Cloud VPS (CPX21)", "1 month staging VM (3 vCPU, 4GB RAM, Caddy HTTPS)", 10.00, 0.0200, "Amortized across ~500 debate sessions/mo", "Fixed ~$10/month"),
    ]
    
    for row_idx, c in enumerate(cost_rows, start=4):
        ws4.write(row_idx, 0, c[0], cell_left)
        ws4.write(row_idx, 1, c[1], cell_left)
        ws4.write(row_idx, 2, c[2], cell_left)
        ws4.write(row_idx, 3, c[3], cell_currency)
        ws4.write(row_idx, 4, c[4], cell_currency)
        ws4.write(row_idx, 5, c[5], cell_left)
        ws4.write(row_idx, 6, c[6], cell_left)
        
    # Summary row
    sum_row = len(cost_rows) + 4
    ws4.merge_range(sum_row, 0, sum_row, 3, "TOTAL ESTIMATED COST PER 10-MINUTE DEBATE", header_fmt)
    ws4.write_formula(sum_row, 4, f"=SUM(E5:E{sum_row})", cell_currency)
    ws4.merge_range(sum_row, 5, sum_row, 6, "CONFIRMED WELL BELOW $0.25 BUDGET LIMIT (NFR-14)", status_done)
    
    ws4.set_column("A:A", 24)
    ws4.set_column("B:B", 30)
    ws4.set_column("C:C", 40)
    ws4.set_column("D:D", 16)
    ws4.set_column("E:E", 18)
    ws4.set_column("F:F", 45)
    ws4.set_column("G:G", 30)
    ws4.freeze_panes(4, 0)

    workbook.close()
    print(f"Excel workbook successfully written to: {output_path}")

if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parent.parent.parent
    out = repo_root / "docs" / "management" / "DEVOPS_QA_ROADMAP.xlsx"
    build_roadmap_excel(out)
