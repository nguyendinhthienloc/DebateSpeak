"""
PA4 Jira Issue Creator
======================
Creates all Sprint 4 (PA4) Jira issues for the DebateSpeak project.

Usage:
    python create_pa4_jira_issues.py

Required environment variables (set in your shell before running):
    JIRA_EMAIL=your-atlassian-email@example.com
    JIRA_API_TOKEN=your-atlassian-api-token
    JIRA_SITE=ndtloc0304.atlassian.net
    JIRA_PROJECT_KEY=SCRUM

How to get an API token:
    1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
    2. Click "Create API token" -> copy the token
    3. Set: $env:JIRA_API_TOKEN = "your-token-here"
    4. Set: $env:JIRA_EMAIL = "your-email@example.com"

This script will NOT delete existing issues. It only creates new ones.
"""

import os
import json
import urllib.request
import urllib.error
import base64
import sys

# --- Configuration ---
SITE = os.environ.get("JIRA_SITE", "ndtloc0304.atlassian.net")
EMAIL = os.environ.get("JIRA_EMAIL", "")
TOKEN = os.environ.get("JIRA_API_TOKEN", "")
PROJECT_KEY = os.environ.get("JIRA_PROJECT_KEY", "SCRUM")

if not EMAIL or not TOKEN:
    print("ERROR: Set JIRA_EMAIL and JIRA_API_TOKEN environment variables.")
    print("  PowerShell: $env:JIRA_EMAIL='you@example.com'")
    print("              $env:JIRA_API_TOKEN='your-token'")
    sys.exit(1)

BASE_URL = f"https://{SITE}/rest/api/3"
CREDENTIALS = base64.b64encode(f"{EMAIL}:{TOKEN}".encode()).decode()
HEADERS = {
    "Authorization": f"Basic {CREDENTIALS}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

# --- Assignee account IDs ---
# These must be the actual Atlassian account IDs for each member.
# Run: python create_pa4_jira_issues.py --list-users  to find them.
# Or fill these in after running --list-users once.
ASSIGNEES = {
    "khoa":  "712020:6a6f9de7-dcf2-4624-bf62-cc7d6df57ad6",   # 24125058 - Nguyễn Anh Khoa
    "loc":   "712020:cdb370c9-eb05-40cd-bcef-8e3d06e97a33",   # 24125093 - Nguyễn Đình Thiên Lộc
    "triet": "712020:81a2cf28-73d9-4ba2-a56b-4a49e7182e70",   # 24125047 - Nguyễn Bảo Minh Triết
    "tai":   "6122b540ec0a83006a162b82",   # 24125078 - Nguyễn Hồng Tấn Tài
    "tuan":  "712020:ac502ed8-bf45-4dd6-81f2-f72a113b3ebb",   # 24125107 - Trần Lê Anh Tuấn
}

# --- PA4 Issues to create ---
# Format: (summary, description, assignee_key, story_points, label)
PA4_ISSUES = [
    # Part A — Revised Use-Case Specs
    (
        "PA4-A: Revised Use-Case Specifications (2nd submission) + Changes.md",
        (
            "Second iteration of use-case specs addressing TA feedback from PA3.\n\n"
            "Deliverables:\n"
            "- docs/pa4/Changes.md (MANDATORY — missing = 0 pts for Part A)\n"
            "- docs/pa4/USE_CASE_SPECIFICATIONS.md (revised flows for FG-03 and FG-04)\n\n"
            "Reviewer: Nguyễn Đình Thiên Lộc (24125093)"
        ),
        "tuan", 3, "pa4-part-a"
    ),
    # Part B — System Context Diagram
    (
        "PA4-B: C4 Level 1 System Context Diagram + Tech Stack description",
        (
            "Full tech stack description + C4 Level 1 System Context Diagram in Mermaid.\n\n"
            "Deliverable: docs/pa4/ARCHITECTURE_C4_CONTEXT.md\n\n"
            "Must include:\n"
            "- Tech stack: React+Vite, Spring Boot 3, PostgreSQL 16, Redis 7, LiveKit Cloud, Python workers\n"
            "- Mermaid flowchart with DebateSpeak system + actors (Student, Admin) + external systems\n"
            "- Prose explanation of each actor and external dependency\n\n"
            "Reviewer: Trần Lê Anh Tuấn (24125107)"
        ),
        "tai", 5, "pa4-part-b"
    ),
    # Part C — Container Diagram
    (
        "PA4-C1: C4 Level 2 Container Diagram (Mermaid) + protocol descriptions",
        (
            "C4 Level 2 Container Diagram accurately reflecting docker-compose.yml.\n\n"
            "Deliverable: docs/pa4/ARCHITECTURE_C4_CONTAINER.md\n\n"
            "Containers: React SPA, Spring Boot API, PostgreSQL 16, Redis 7, LiveKit SFU, Python Worker\n"
            "Protocols: HTTP/HTTPS, WebSocket, TCP, LiveKit WebRTC signalling\n\n"
            "WARNING: Diagram must match actual source code. Discrepancy = penalty.\n\n"
            "Reviewer: Nguyễn Hồng Tấn Tài (24125078)"
        ),
        "khoa", 5, "pa4-part-c"
    ),
    (
        "PA4-C2: C4 Level 3 Backend Component Diagram (Spring Boot + Python workers)",
        (
            "Internal decomposition of the Spring Boot API container.\n\n"
            "Deliverable: docs/pa4/ARCHITECTURE_C4_COMPONENTS_BE.md\n\n"
            "Components: AuthController, RoomController, LiveKitController, AuthService, RoomService,\n"
            "TokenService, UserRepository, RoomRepository, JwtFilter, SecurityConfig,\n"
            "Python workers: STTAdapter, LLMAdapter, ARQ worker\n\n"
            "Reviewer: Nguyễn Hồng Tấn Tài (24125078)"
        ),
        "khoa", 5, "pa4-part-c"
    ),
    (
        "PA4-C3: C4 Level 3 Frontend Component Diagram (React SPA)",
        (
            "Internal decomposition of the React SPA container.\n\n"
            "Deliverable: docs/pa4/ARCHITECTURE_C4_COMPONENTS_FE.md\n\n"
            "Components: React Router (App.tsx/routes.ts), Auth/Room contexts, hooks (useAuth, useLiveKit,\n"
            "useRoom), Pages (AuthPages, LobbyPage, RoomSetupPage, DebateRoomPage),\n"
            "Components (ui.tsx, PreviewTools, Audio components), LiveKit SDK integration\n\n"
            "WARNING: Only include components that actually exist in web/src/.\n\n"
            "Reviewer: Nguyễn Anh Khoa (24125058)"
        ),
        "triet", 5, "pa4-part-c"
    ),
    # Part D — Deployment Diagram
    (
        "PA4-D: Deployment Diagram (Mermaid) + infrastructure description",
        (
            "Mermaid deployment diagram mapping containers to infrastructure nodes.\n\n"
            "Deliverable: docs/pa4/DEPLOYMENT_DIAGRAM.md\n\n"
            "Nodes: Developer workstation (Docker Compose), LiveKit Cloud (external), Browser (React SPA)\n"
            "Protocols: HTTP/HTTPS (browser→Caddy→Spring Boot), WebSocket, WebRTC, TCP (Postgres/Redis)\n\n"
            "Reviewer: Nguyễn Anh Khoa (24125058)"
        ),
        "loc", 2, "pa4-part-d"
    ),
    # Part E — FG-03 Backend
    (
        "PA4-E1: FG-03 Backend — Room API, state machine, DB (Spring Boot)",
        (
            "Full-stack backend for FG-03 Room & Live Session Management.\n\n"
            "Deliverable: api/authify/src/main/java/org/debatespeak/authify/room/\n\n"
            "Endpoints:\n"
            "- POST /api/v1/rooms → create room, return 8-char invite_code\n"
            "- POST /api/v1/rooms/join → join by invite_code (409 if full)\n"
            "- POST /api/v1/rooms/{id}/ready → mark ready; auto-transition when both ready\n\n"
            "DB: rooms table (id, invite_code, state, topic_id, affirmative_user_id, negative_user_id)\n"
            "State machine: WAITING→READY→IN_DEBATE→ENDED (pure function, unit tested)\n\n"
            "Reviewer: Trần Lê Anh Tuấn (24125107)"
        ),
        "tai", 8, "pa4-part-e"
    ),
    # Part E — FG-03 Frontend
    (
        "PA4-E2: FG-03 Frontend — Room Setup, Join modal, Lobby UI (React)",
        (
            "Full-stack frontend for FG-03 Room & Live Session Management.\n\n"
            "Deliverable: web/src/pages/rooms/, web/src/pages/LobbyPage.tsx\n\n"
            "Acceptance criteria:\n"
            "- Create Room: form → 8-char invite code displayed\n"
            "- Join Room: enter code → redirect to Lobby\n"
            "- Lobby: shows both participants' names and stances\n"
            "- READY button activates when both participants have joined\n"
            "- State syncs live with backend (polling or WebSocket)\n\n"
            "Reviewer: Nguyễn Đình Thiên Lộc (24125093)"
        ),
        "triet", 8, "pa4-part-e"
    ),
    # Part E — FG-04 Backend
    (
        "PA4-E3: FG-04 Backend — LiveKit token generation endpoint (Spring Boot)",
        (
            "LiveKit token API for FG-04 Real-Time Audio Communication.\n\n"
            "Deliverable: api/authify/src/main/java/org/debatespeak/authify/livekit/\n\n"
            "Endpoint: POST /api/v1/rooms/{id}/token\n"
            "Returns: { 'token': '<signed-jwt>', 'url': '<livekit_server_url>' }\n"
            "Token grants: publish audio, subscribe to remote audio, room = invite_code\n"
            "Uses LIVEKIT_API_KEY and LIVEKIT_API_SECRET from environment (never hardcoded)\n\n"
            "Reviewer: Nguyễn Anh Khoa (24125058)"
        ),
        "tai", 5, "pa4-part-e"
    ),
    # Part E — FG-04 Frontend
    (
        "PA4-E4: FG-04 Frontend — LiveKit Client SDK, audio tracks, dual-consent (React)",
        (
            "LiveKit WebRTC audio integration for FG-04.\n\n"
            "Deliverable: web/src/components/audio/, web/src/hooks/useLiveKit.ts\n\n"
            "Acceptance criteria:\n"
            "- Dual-consent: both users must click 'Allow microphone' before audio activates\n"
            "- Publish local audio track; subscribe to remote audio track\n"
            "- Mute/unmute toggle with visible state indicator\n"
            "- Active speaker indicator (highlights speaking participant)\n\n"
            "Reviewer: Nguyễn Anh Khoa (24125058)"
        ),
        "triet", 5, "pa4-part-e"
    ),
    # Part E — Spec Kit
    (
        "PA4-E5: Spec Kit artifacts for FG-03 (rooms) and FG-04 (audio)",
        (
            "Spec Kit specification and test artifacts for the two new functional groups.\n\n"
            "Deliverables:\n"
            "- specs/003-fg03-rooms/spec.md, plan.md, tasks.md, quickstart.md\n"
            "- specs/004-fg04-audio/spec.md, plan.md, tasks.md, quickstart.md\n\n"
            "Reviewer: Trần Lê Anh Tuấn (24125107)"
        ),
        "khoa", 3, "pa4-part-e"
    ),
    # Part E — Demo Video
    (
        "PA4-E6: Narrated YouTube demo video for FG-03 + FG-04",
        (
            "Record and publish a narrated demo showing FG-03 and FG-04 end-to-end.\n\n"
            "Deliverable: YouTube link added to docs/pa4/DEMO_VIDEO.md\n\n"
            "Script: 2 browser tabs (Affirmative + Negative user), narrate in English:\n"
            "register → create room → join via invite code → lobby ready state → start debate\n"
            "→ live WebRTC audio conversation → end session\n\n"
            "Reviewer: All members"
        ),
        "triet", 2, "pa4-part-e"
    ),
    # Part F — AI Usage Log
    (
        "PA4-F1: AI Usage Log — Sprint 4 entries for all 5 members",
        (
            "Collect and compile AI tool usage entries from all team members for Sprint 4.\n\n"
            "Deliverable: docs/pa4/AI_USAGE_LOG.md\n\n"
            "One section per member; for each AI interaction record:\n"
            "- Tool name, task category, prompt description, output quality assessment\n\n"
            "Format matches docs/pa3/AI_USAGE_LOG.md\n\n"
            "Reviewer: Nguyễn Đình Thiên Lộc (24125093)"
        ),
        "tuan", 2, "pa4-part-f"
    ),
    # Part F — Weekly Report
    (
        "PA4-F2: Weekly Report — Sprint 4 Scrum meetings, Jira screenshots",
        (
            "Sprint 4 weekly report covering all Scrum ceremonies.\n\n"
            "Deliverable: docs/pa4/WEEKLY_REPORT.md, docs/pa4/MEETINGS/\n\n"
            "Required content:\n"
            "- Sprint Planning meeting notes (Day 1)\n"
            "- Scrum Check-in 1 & 2 notes\n"
            "- Sprint Review & Retrospective notes\n"
            "- Jira board screenshots showing task progression\n"
            "- Burndown chart screenshot\n\n"
            "Reviewer: Trần Lê Anh Tuấn (24125107)"
        ),
        "loc", 2, "pa4-part-f"
    ),
    # Submission
    (
        "PA4-S: Create pa4 sprint branch; manage freeze checklist; package PA4-Group02.zip",
        (
            "Sprint 4 DevOps tasks for release custodian.\n\n"
            "Steps:\n"
            "1. Create pa4 branch from pa3 (after pa3 → dev merge)\n"
            "2. Manage docs/pa4/CHECKLIST.md (single owner, Lộc only)\n"
            "3. Build all pa4 Markdown to PDF via report/pdf/build.py\n"
            "4. After freeze: git log export, build PA4-Group02.zip\n"
            "5. Merge pa4 → dev\n\n"
            "Reviewer: All members (checklist sign-off)"
        ),
        "loc", 3, "pa4-submission"
    ),
]


def api_request(method, path, data=None):
    url = f"{BASE_URL}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"  HTTP {e.code} for {method} {path}: {error_body[:300]}")
        return None


def list_users():
    """List all project members so you can fill in ASSIGNEES dict."""
    print("Fetching project members...")
    result = api_request("GET", f"/user/assignable/search?project={PROJECT_KEY}&maxResults=50")
    if result:
        for u in result:
            print(f"  {u.get('displayName', '?'):40s} accountId={u.get('accountId', '?')}")
    else:
        print("Failed to fetch users. Check your credentials.")


def create_issues():
    created = []
    skipped = []

    for summary, desc, assignee_key, points, label in PA4_ISSUES:
        assignee_id = ASSIGNEES.get(assignee_key)

        issue_data = {
            "fields": {
                "project": {"key": PROJECT_KEY},
                "summary": summary,
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [{"type": "text", "text": desc}]
                        }
                    ]
                },
                "issuetype": {"name": "Story"},
                "labels": [label, "pa4"],
            }
        }

        # Add assignee if account ID is known
        if assignee_id:
            issue_data["fields"]["assignee"] = {"accountId": assignee_id}

        print(f"Creating: {summary[:70]}...")
        result = api_request("POST", "/issue", issue_data)
        if result and "key" in result:
            key = result["key"]
            print(f"  ✓ Created {key}")
            created.append((key, summary[:60]))
        else:
            print(f"  ✗ Failed to create issue")
            skipped.append(summary[:60])

    print(f"\n--- Summary ---")
    print(f"Created: {len(created)} issues")
    for key, summary in created:
        print(f"  {key}: {summary}")
    if skipped:
        print(f"Failed: {len(skipped)}")
        for s in skipped:
            print(f"  - {s}")


if __name__ == "__main__":
    if "--list-users" in sys.argv:
        list_users()
    else:
        print(f"Creating PA4 Jira issues in project {PROJECT_KEY} on {SITE}...")
        print(f"NOTE: Assignee IDs are not filled in — issues will be unassigned.")
        print(f"      Run with --list-users first, then fill in the ASSIGNEES dict.\n")
        create_issues()
