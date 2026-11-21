# Deployment Diagram — PA4

| Metadata | Value |
|---|---|
| **Document** | UML Deployment Diagram Specification |
| **Sprint** | Sprint 4 (PA4) — Increment 2 |
| **Task** | SCRUM-61 |
| **Owner** | Nguyễn Đình Thiên Lộc (24125093) — DevOps & QA / Fact-Checking Lead |
| **Reviewer** | Nguyễn Anh Khoa (24125058) — AI Audio & Speech Pipeline Lead |
| **Date** | November 22, 2026 |
| **Status** | In Review |

---

## 1. Scope & Execution Context

This document specifies the UML deployment topology for DebateSpeak AI during Sprint 4 (PA4 / Build 3). It details the physical/virtual nodes, execution environments, runtime artifacts, networks, port bindings, and communication protocols currently active in the repository.

Per project guidelines and DevOps invariants, this specification reflects the actual topology existing in the codebase rather than idealized future architecture. Containerized services match `docker-compose.yml` exactly. Non-containerized processes are documented as they currently execute on the host developer workstation.

---

## 2. UML Deployment Diagram

The diagram below maps the runtime deployment topology across the Client Workstation, Developer Workstation, Docker Compose engine, and External Cloud services.

```mermaid
flowchart TB
    subgraph CLIENT ["Node: Client Workstation"]
        subgraph BROWSER_ENV ["Execution Environment: Modern Web Browser"]
            SPA["Artifact: React 18 SPA\nPackage: debatespeak-web\nFramework: Vite + Tailwind CSS"]
        end
    end

    subgraph WORKSTATION ["Node: Developer Workstation (Local Host OS)"]
        subgraph HOST_PROCS ["Host Runtime Execution"]
            VITE["Vite Development Server\nRuntime: Node.js v20+\nPort: 5173 (host)"]
            API["Backend API Process\nRuntime: Python FastAPI / Java Spring Boot\nPort: 8000 (host)"]
            WORKER["Background Task Worker\nRuntime: Python ARQ Process\nModule: workers/health.py"]
        end

        subgraph DOCKER_COMPOSE ["Execution Environment: Docker Compose Engine"]
            subgraph DOCKER_NET ["Bridge Network: debatespeak-network"]
                DB[("Container: debatespeak-db\nImage: postgres:16-alpine\nInternal Port: 5432\nHost Port: 5432\nVolume: debatespeak_postgres_data")]
                REDIS[("Container: debatespeak-redis\nImage: redis:7-alpine\nInternal Port: 6379\nHost Port: 6379\nVolume: debatespeak_redis_data")]
                LIVEKIT["Container: debatespeak-livekit\nImage: livekit/livekit-server:latest\nMode: --dev --bind 0.0.0.0\nPorts: 7880 (HTTP/WS), 7881 (TCP), 7882 (UDP)"]
            end
        end
    end

    subgraph CLOUD ["Node: External Cloud Infrastructure"]
        LK_CLOUD["Managed Service: LiveKit Cloud SFU\nEndpoint: wss://*.livekit.cloud\nProtocols: WSS / WebRTC (UDP/TCP)"]
    end

    %% Client Links
    SPA -->|"HTTP / WebSocket (HMR)\nlocalhost:5173"| VITE
    SPA -->|"HTTP REST / WebSocket\nlocalhost:8000"| API
    SPA -.->|"HTTP/WS Signaling: 7880\nWebRTC Audio: UDP 7882 / TCP 7881\n[Local Mode]"| LIVEKIT
    SPA -.->|"WSS Signaling / HTTPS: 443\nWebRTC Audio: UDP / TCP\n[Cloud Mode]"| LK_CLOUD

    %% Host to Container Links
    API -->|"TCP (PostgreSQL wire)\nlocalhost:5432"| DB
    API -->|"TCP (Redis protocol)\nlocalhost:6379"| REDIS
    API -.->|"HTTP API / WS: 7880\nToken & Room Admin [Local Mode]"| LIVEKIT
    API -.->|"HTTPS / WSS: 443\nToken & Room Admin [Cloud Mode]"| LK_CLOUD

    WORKER -->|"TCP (ARQ Queue Poll)\nlocalhost:6379"| REDIS
```

---

## 3. Node Inventory & Execution Environments

### 3.1 Node: Client Workstation (`<<device>>`)
* **Execution Environment:** Modern Web Browser (Chromium / Firefox / WebKit).
* **Artifact:** `debatespeak-web` Single-Page Application (SPA) built with React 18, TypeScript, and Tailwind CSS.
* **Responsibilities:** Renders room lobbies, captures local microphone input (WebRTC `getUserMedia`), manages dual-consent audio toggles, and connects to the WebRTC SFU for audio exchange.

### 3.2 Node: Developer Workstation (`<<device>>`)
The local development machine hosts both uncontainerized developer runtime processes and containerized backing services.

#### 3.2.1 Host Runtime Processes
* **Vite Development Server:** Runs directly on the host using Node.js (`pnpm run dev` in `web/`). Binds to port `5173` (`host: true` in `web/vite.config.ts`) and serves assets and Hot Module Replacement (HMR).
* **Backend API Process:** Executes on the host binding to port `8000`. Exposes REST endpoints and WebSocket room handlers:
  * Python FastAPI implementation: `uvicorn app.main:app --port 8000` (dependencies in `api/pyproject.toml`).
  * Spring Boot implementation: `./mvnw spring-boot:run` in `api/authify/` (configured with `server.port=8000`).
* **Background Worker Process:** Python process executing asynchronous background tasks (`workers/health.py`, ARQ job queue).

#### 3.2.2 Docker Compose Engine (`<<executionEnvironment>>`)
Manages containerized stateful backing infrastructure defined in `docker-compose.yml`. All containers communicate across the custom bridge network `debatespeak-network`.
1. **`debatespeak-db`:**
   * Image: `postgres:16-alpine`.
   * Host Port Binding: `5432:5432`.
   * Persistence: Named volume `debatespeak_postgres_data` mapped to `/var/lib/postgresql/data`.
   * Health Check: `pg_isready` interval 5s, timeout 5s, retries 5.
2. **`debatespeak-redis`:**
   * Image: `redis:7-alpine`.
   * Host Port Binding: `6379:6379`.
   * Persistence: Named volume `debatespeak_redis_data` mapped to `/data`.
   * Health Check: `redis-cli ping` interval 5s, timeout 3s, retries 5.
3. **`debatespeak-livekit`:**
   * Image: `livekit/livekit-server:latest`.
   * Execution Command: `["--dev", "--bind", "0.0.0.0"]`.
   * Host Port Bindings:
     * `7880:7880` — HTTP REST API & WebSocket signaling.
     * `7881:7881` — WebRTC over TCP fallback.
     * `7882:7882/udp` — WebRTC over UDP media transport.
   * Health Check: `wget -qO- http://localhost:7880/` interval 5s, timeout 5s, retries 5.

### 3.3 Node: External Cloud Services (`<<cloud>>`)
* **LiveKit Cloud SFU:** Managed cloud WebRTC Selective Forwarding Unit (`wss://*.livekit.cloud`).
* **Operational Mode Determination:**
  * When `LIVEKIT_URL=http://localhost:7880`, the client and backend route all media traffic to the local `debatespeak-livekit` container.
  * When `LIVEKIT_URL` is configured with cloud credentials (`wss://<project>.livekit.cloud`), LiveKit Cloud replaces the local container for WebRTC audio routing. This mode is used when testing across separate physical machines where local UDP hole punching is restricted.

---

## 4. Communication Protocols & Port Matrix

| Link Origin | Link Destination | Protocol | Port | Purpose / Traffic Description |
|---|---|---|---|---|
| Browser SPA | Vite Dev Server | HTTP / WebSocket | 5173 | Asset delivery, script bundling, and Vite HMR |
| Browser SPA | Backend API | HTTP / WebSocket | 8000 | Auth, room state sync, dual consent, LiveKit token acquisition |
| Browser SPA | Local LiveKit Container | HTTP / WebSocket | 7880 | WebRTC signaling in local development mode |
| Browser SPA | Local LiveKit Container | WebRTC (UDP) | 7882 | Real-time bidirectional audio stream exchange |
| Browser SPA | Local LiveKit Container | WebRTC (TCP) | 7881 | Fallback audio transport when UDP packets are blocked |
| Browser SPA | LiveKit Cloud SFU | HTTPS / WSS | 443 | WebRTC signaling in cloud deployment mode |
| Browser SPA | LiveKit Cloud SFU | WebRTC (UDP/TCP) | Dynamic / 443 | Low-latency cloud audio streaming |
| Backend API | `debatespeak-db` | TCP (PostgreSQL) | 5432 | User credentials, room metadata, session persistence |
| Backend API | `debatespeak-redis` | TCP (Redis) | 6379 | Session caching, lock management, pub/sub signaling |
| Backend API | Local LiveKit Container | HTTP / WebSocket | 7880 | Room creation, participant token minting, webhook events |
| Backend API | LiveKit Cloud SFU | HTTPS / WSS | 443 | Cloud room creation and token signing |
| Python Worker | `debatespeak-redis` | TCP (Redis) | 6379 | Polling and consumption of background ARQ tasks |

---

## 5. Planned, Not Yet Deployed Infrastructure

The following components are referenced in planning documents (`docs/pa4/loc/TODO.md`, `README.md`) but are not yet implemented in `docker-compose.yml` or repo code:

1. **Caddy Reverse Proxy & TLS Termination:**
   * *Status:* Planned. Not present in `docker-compose.yml`.
   * *Purpose:* Terminate TLS (HTTPS on 443) and proxy to frontend (5173) and API (8000). Modern browsers enforce `navigator.mediaDevices.getUserMedia` only on `localhost` or secure HTTPS contexts. Caddy with internal TLS is planned for multi-device LAN testing.
2. **Containerized API & Web Services:**
   * *Status:* Planned. Neither `api/` nor `web/` contains a production `Dockerfile`.
   * *Purpose:* Both frontend and backend currently run as uncontainerized host processes during local development.
3. **Dedicated Speech & AI Worker Containers:**
   * *Status:* Prototype only.
   * *Purpose:* Silero VAD, streaming speech-to-text (STT), and multi-agent LLM analysis services currently exist as prototype scripts (`workers/health.py`) rather than dedicated containerized daemons.

---

## 6. Discrepancies and Inconsistencies

In accordance with the Brutal Honesty invariant (AGENTS.md Section 8), this section documents every technical discrepancy between planning documentation, architecture invariants, and the codebase:

1. **TODO vs. `docker-compose.yml` Service Scope:**
   * `docs/pa4/loc/TODO.md` describes communication between "browser <-> Caddy reverse proxy <-> Spring Boot" and lists Docker Compose as managing these services.
   * *Fact:* The actual `docker-compose.yml` contains **strictly three services**: `debatespeak-db` (Postgres), `debatespeak-redis` (Redis), and `debatespeak-livekit` (LiveKit Server). There is no Caddy service, no Spring Boot container, and no web client container.
2. **Backend Stack Duality (FastAPI vs. Spring Boot):**
   * AGENTS.md rule 4.2 states the backend is "Java (Spring Boot), chosen by Tài on 2026-11-14".
   * *Fact:* The codebase contains **two concurrent backend implementations**:
     * A Python FastAPI backend in `api/app/` with LiveKit token generation, room state machine, and database models.
     * A Java 17 Spring Boot application in `api/authify/` with authentication controllers and JPA entities.
     Both configure port 8000. They cannot bind concurrently on the same host interface.
3. **Database Port Discrepancy in Spring Boot Properties:**
   * `docker-compose.yml` binds PostgreSQL to host port `5432:5432`.
   * `.env.example` defines `DATABASE_URL` with port `5432`.
   * *Fact:* `api/authify/src/main/resources/application.properties` specifies default `spring.datasource.url=jdbc:postgresql://localhost:5433/debatespeak`. A connection attempt using default properties will fail unless the environment variable overrides the port to 5432.
4. **LiveKit Deployment Ambiguity (Local Container vs. Cloud):**
   * The architecture documents frequently emphasize LiveKit Cloud free tier as an invariant (AGENTS.md Section 4.3), while `docker-compose.yml` provisions a local `livekit/livekit-server:latest` container in `--dev` mode.
   * *Fact:* The active SFU endpoint is determined strictly by the `LIVEKIT_URL` environment variable. In local development without cloud API credentials, the local Docker container is active; in cloud mode, the container is redundant.
