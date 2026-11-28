# Feature Specification: FG-04 Real-Time Audio Communication (PA4 Part E)
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058), Nguyễn Bảo Minh Triết (24125047)*

Created: 2026-11-24. Feature: `007-fg04-audio`. Status: In Progress.
Target Build: Build 3 (PA4 Increment 2 — Media & Speech Core).
Companion Docs: [SOFTWARE_ARCHITECTURE_SPEC.md](../../docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md) (§6.3, §7.1), [AGENTS.md](../../AGENTS.md) (§4.3, §7.3).

---

## 1. Executive Summary & Problem Formulation

In competitive oral debate, participants require crystal-clear, low-latency audio transmission across NAT and corporate firewalls without experiencing voice packet loss or echo feedback. Furthermore, for AI coaching to work reliably, the system must deterministically attribute every spoken sentence to the exact speaker without relying on fragile multi-speaker audio separation algorithms.

**FG-04 (Real-Time Audio Communication)** integrates **LiveKit Cloud SFU** (Selective Forwarding Unit) via WebRTC. It provides scoped, ephemeral token issuance, enforces a strict **Dual-Consent Safety Gate** before microphone activation, maintains **independent WebRTC audio tracks per speaker** for deterministic attribution, and delivers live audio controls (mute/unmute, volume meters, active speaker indicators) to debaters.

---

## 2. User Scenarios & Acceptance Criteria

### US1 — Request LiveKit Room Token (P1)
**User Story:** As an authenticated debater inside a confirmed room, I want to receive a signed WebRTC access token so that my browser can connect to the media server.

* **Acceptance Criteria (AC-1.1):** When a participant calls `POST /api/v1/rooms/{id}/token`, the backend verifies the user is a registered participant in room `{id}`.
* **AC-1.2:** The backend signs a LiveKit Access Token JWT containing:
  - `identity`: the user's permanent UUID.
  - `name`: the user's display name.
  - `room`: the room's unique `invite_code`.
  - `grants`: `canPublish: true`, `canSubscribe: true`, `canPublishData: true`, `canPublishVideo: false`.
* **AC-1.3:** Response returns `200 OK` with `{ "token": "<jwt>", "url": "wss://livekit.cloud" }`.
* **AC-1.4:** Non-participants requesting a token receive `403 Forbidden`.

### US2 — Dual-Consent Microphone Safety Gate (P1)
**User Story:** As a debater concerned about privacy, I want audio streaming and recording to begin only when both participants explicitly consent so that no unexpected eavesdropping occurs.

* **Acceptance Criteria (AC-2.1):** The browser will **never** request browser microphone permission on page load.
* **AC-2.2:** When entering the debate room, a prominent "Enable Microphone" permission prompt is presented.
* **AC-2.3:** Audio tracks remain un-published until **both** debaters click "I Consent & Enable Microphone".
* **AC-2.4:** A debater may revoke consent at any time, immediately muting and unpublishing their local audio track.

### US3 — Bidirectional Audio Streaming & Speaker Indication (P1)
**User Story:** As a debater during an active round, I want to speak into my microphone and hear my opponent with minimal latency, and visually see who is speaking.

* **Acceptance Criteria (AC-3.1):** Each debater publishes a 16 kHz or 48 kHz mono Opus-encoded WebRTC audio track to the LiveKit SFU.
* **AC-3.2:** The opponent receives and subscribes to this track; round-trip audio latency remains $< 300\text{ ms}$ under normal broadband conditions.
* **AC-3.3:** When Debater A speaks above the audio threshold, an "Active Speaker" indicator (glowing avatar/border) highlights Debater A in both browsers within $150\text{ ms}$.

### US4 — In-Debate Audio Controls: Mute, Reconnect & Level Meter (P2)
**User Story:** As a debater, I want to mute my microphone, adjust audio input levels, and automatically recover if my network drops.

* **Acceptance Criteria (AC-4.1):** Clicking the "Mute" toggle immediately disables the local audio track without dropping the WebRTC session; UI displays "Microphone Muted".
* **AC-4.2:** Real-time volume level meter reflects microphone input amplitude.
* **AC-4.3:** If connection drops, the LiveKit client automatically attempts exponential backoff reconnection for up to 15 seconds before reporting a connection error to the user.
* **AC-4.4:** A gear on the stage opens audio settings: microphone and speaker pickers, the AC-4.2 level meter (read from the published track, no second capture) and the partner's volume. Opening it never restarts the mic.
* **AC-4.5:** If the microphone stops without the debater pressing Mute (device disabled or unplugged), the stage says so, the toggle shows Unmute, and audio settings are one click away. With no microphone left, a notice offers Type instead. The clock keeps running.

---

## 3. Deterministic Speaker Attribution & Pipeline Integration

In strict accordance with `AGENTS.md` Section 4.3:

```
[Debater A Browser] --(WebRTC Track A: identity=User_A)--> [LiveKit SFU] --> [Python Audio Worker]
[Debater B Browser] --(WebRTC Track B: identity=User_B)--> [LiveKit SFU] --> [Python Audio Worker]
```

* **Independent Media Tracks:** Audio is **never mixed server-side**. LiveKit forwards separate audio tracks per speaker.
* **Track-to-Participant Binding:** The Python Audio Worker (`C7`) hooks into `on_track_subscribed(track, publication, participant)`.
* **Zero Diarization Error:** Because every audio frame carries the track's immutable `participant.identity`, the speaker label for generated transcripts is **100% deterministic** without any probabilistic clustering or acoustic diarization ambiguity.

---

## 4. REST API Contract & Data Schema

### 4.1. Endpoints

| Method | Endpoint | Auth | Success | Errors | Description |
|---|---|---|---|---|---|
| `POST` | `/api/v1/rooms/{id}/token` | Bearer JWT | `200 OK` | 401, 403, 404 | Generates signed LiveKit WebRTC access token |
| `GET` | `/api/v1/rooms/{id}/audio-status` | Bearer JWT | `200 OK` | 401, 404 | Checks dual-consent status and participant connection states |

### 4.2. Token Payload Structure (JWT Claims)

```json
{
  "sub": "user-uuid-123",
  "name": "Alex Nguyen",
  "iss": "debatespeak-api",
  "exp": 1700860800,
  "video": {
    "room": "DEB-8A3F",
    "roomJoin": true,
    "canPublish": true,
    "canSubscribe": true,
    "canPublishData": true,
    "canPublishSources": ["microphone"]
  }
}
```
