# Tasks & Work Breakdown: FG-04 Real-Time Audio Communication
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058)*

Target Feature: `007-fg04-audio`  
Jira References: `SCRUM-62` (Backend Token - Tài), `SCRUM-63` (Frontend Audio - Triết), `SCRUM-64` (Spec Kit & STT - Khoa)

---

## 1. Backend Tasks (`api/authify/`) — Owner: Tài (24125078)

- [ ] **T1.1 (LiveKit Dependency):** Add `io.livekit:livekit-server` dependency or JWT claims builder to `pom.xml`.
- [ ] **T1.2 (Token Service):** Implement `LiveKitTokenService.generateAccessToken(UUID userId, String roomCode, boolean canPublish)`. Read `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` from environment.
- [ ] **T1.3 (Controller Endpoint):** Implement `LiveKitController` with `POST /api/v1/rooms/{id}/token`. Validate requester is an enrolled debater in room `{id}`. Return `200 OK` with token and server URL.
- [ ] **T1.4 (Security Tests):** Verify token expiration and 403 Forbidden on non-participant access.

---

## 2. Frontend Tasks (`web/src/`) — Owner: Triết (24125047)

- [ ] **T2.1 (LiveKit SDK Install):** Install `livekit-client` and `@livekit/components-react`.
- [ ] **T2.2 (Dual-Consent Prompt):** Implement `MicConsentModal.tsx` requiring explicit click before accessing `navigator.mediaDevices.getUserMedia()`.
- [ ] **T2.3 (useLiveKit Hook):** Author `useLiveKitRoom.ts` handling `room.connect()`, track publication, track subscription, and network disconnect events.
- [ ] **T2.4 (Audio Stage UI):** Build `AudioStage.tsx` with active speaker visual indicator (green border/pulse) and microphone level meter.
- [ ] **T2.5 (Mute / Unmute Controls):** Implement mute toggle button that calls `localParticipant.setMicrophoneEnabled(false)`.

---

## 3. Worker & Speech Ingestion Tasks — Owner: Khoa (24125058)

- [ ] **T3.1 (Track Listener):** Build Python track subscription consumer hooking into independent audio tracks by `participant_identity`.
- [ ] **T3.2 (STT Stream Forwarding):** Pipe live PCM16 frames from the debater's track into `STTAdapter` (using `LocalMockSTTAdapter` as offline fallback).
- [ ] **T3.3 (Attribution Tests):** Author automated pytest verifying that track A frames produce transcripts labeled with Debater A's identity and never Debater B's.
