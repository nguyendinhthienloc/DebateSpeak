# Implementation Plan: FG-04 Real-Time Audio Communication
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058)*

Target Feature: `007-fg04-audio`  
Branch: `feature/SCRUM-62-fg04-livekit-token-api` (Backend) & `feature/SCRUM-63-fg04-livekit-frontend` (Frontend)  
Status: Planned for PA4 Increment 2 (Build 3)

---

## 1. Architecture & Component Decomposition

FG-04 integrates WebRTC audio routing across 3 primary components:

1. **Backend Token Service (`api/authify/`)**:
   - `LiveKitTokenService`: Generates signed JWTs using `io.livekit:livekit-server` SDK or Java JWT (Auth0/Nimbus) using `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`.
   - `LiveKitController`: Endpoint `POST /api/v1/rooms/{id}/token` enforcing room membership.
2. **Frontend Media Client (`web/src/`)**:
   - SDK: `livekit-client` and `@livekit/components-react`.
   - `AudioStage.tsx`: Renders audio visualizer, participant avatars, and active speaker border.
   - `AudioControls.tsx`: Mute/unmute button, audio level meter, and consent dialog.
   - `useLiveKitRoom.ts`: Custom React hook encapsulating room connection, track publishing, and disconnection handlers.
3. **Audio Worker Ingestion (`api/app/`, `workers/`)**:
   - `LiveKitAudioListener`: Python Agent subscribing to server-side audio tracks and streaming frames to `STTAdapter`.

---

## 2. Technical Invariants & Security Enforcements

* **Zero Leaked Secrets (AGENTS.md §2)**: LiveKit API secret is strictly injected via environment variable `LIVEKIT_API_SECRET`. Never bundled in frontend code.
* **Ephemeral Tokens**: LiveKit JWT tokens expire after 1 hour (`ttl: 3600s`).
* **Audio Track Isolation**: Audio tracks are published as mono Opus with `echoCancellation: true`, `noiseSuppression: true`, and `autoGainControl: true`.

---

## 3. Testing & Verification Strategy

1. **Backend Unit Tests**:
   - Valid JWT token signing and claims verification.
   - Unauthorized user rejection (HTTP 403) when requesting a token for a room they are not enrolled in.
2. **Frontend Component Tests**:
   - Microphone consent modal state.
   - Active speaker highlighting when `onActiveSpeakersChanged` emits participant identity.
3. **LiveKit End-to-End Test**:
   - Two client instances connect to room `DEB-TEST`, publish audio, and verify bidirectional track delivery.
