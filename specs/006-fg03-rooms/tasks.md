# Tasks & Work Breakdown: FG-03 Room & Live Session Management
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058)*

Target Feature: `006-fg03-rooms`  
Jira References: `SCRUM-60` (Backend - Tài), `SCRUM-61` (Frontend - Triết), `SCRUM-64` (Spec Kit - Khoa)

---

## 1. Backend Tasks (`api/authify/`) — Owner: Tài (24125078)

- [ ] **T1.1 (Model & Migration):** Define `RoomEntity` and `RoomState` enum (`WAITING`, `READY`, `IN_DEBATE`, `CONCLUDED`, `ABANDONED`). Create Flyway/JPA schema migration for `rooms` table.
- [ ] **T1.2 (Invite Code Generator):** Implement secure random 8-character uppercase alphanumeric code generator (e.g., `DEB-XXXX`) with uniqueness retry guard.
- [ ] **T1.3 (Repository Layer):** Implement `RoomRepository` with `findByInviteCode(String code)` and `findActiveRoomsByUserId(UUID userId)`.
- [ ] **T1.4 (RoomService Core):**
  - Implement `createRoom(UUID userId, UUID topicId, Stance stance)`.
  - Implement `joinRoom(UUID userId, String inviteCode)` with 409 Conflict check when room is full.
  - Implement `toggleReady(UUID roomId, UUID userId)`.
- [ ] **T1.5 (REST Controller):** Expose endpoints in `RoomController` (`POST /api/v1/rooms`, `POST /api/v1/rooms/join`, `POST /api/v1/rooms/{id}/ready`, `GET /api/v1/rooms/{id}`).
- [ ] **T1.6 (Unit Tests):** Author JUnit tests covering room creation, 409 full room rejection, and mutual readiness transitions.

---

## 2. Frontend Tasks (`web/src/`) — Owner: Triết (24125047)

- [ ] **T2.1 (API Client Contract):** Extend `web/src/api/` with typed room functions (`createRoom()`, `joinRoom()`, `toggleReady()`, `getRoom()`).
- [ ] **T2.2 (Room Setup Page):** Enhance `RoomSetupPage.tsx` to call `POST /api/v1/rooms` and display the generated 8-character code with one-click copy.
- [ ] **T2.3 (Join Room Modal):** Build code-entry modal with uppercase formatting and error feedback for invalid/full rooms.
- [ ] **T2.4 (Lobby State Synchronization):** Update `LobbyPage.tsx` to poll room status, show Affirmative vs. Negative cards, and activate the "Ready" button.
- [ ] **T2.5 (Ready Countdown):** Trigger debate countdown when both players are ready.

---

## 3. QA & Verification Tasks — Owner: Lộc (24125093) & Khoa (24125058)

- [ ] **T3.1 (E2E Test):** Playwright automated test simulating two browser contexts (Host and Guest) joining the same room and reaching `READY`.
- [ ] **T3.2 (Negative Edge Cases):** Test third browser attempting to join with the same code receives HTTP 409 and UI displays "Room is full".
