# Implementation Plan: FG-03 Room & Live Session Management
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058)*

Target Feature: `006-fg03-rooms`  
Branch: `feature/SCRUM-60-fg03-backend` (Backend) & `feature/SCRUM-61-fg03-frontend` (Frontend)  
Status: Planned for PA4 Increment 2

---

## 1. Architecture & Component Decomposition

FG-03 connects Frontend UI to Spring Boot Backend and PostgreSQL persistence across 3 tiers:

1. **Backend Service (`api/authify/`)**:
   - `RoomEntity`: JPA entity mapping to `rooms` table.
   - `RoomRepository`: Spring Data JPA repository for room lookup by invite code or active player.
   - `RoomService`: Transactional service containing pure state transitions (`WAITING` $\rightarrow$ `READY` $\rightarrow$ `IN_DEBATE`).
   - `RoomController`: Exposes `/api/v1/rooms` REST endpoints.
2. **Frontend UI (`web/src/`)**:
   - `RoomSetupPage.tsx`: Host configures debate motion and creates room.
   - `JoinRoomModal.tsx`: Debater enters 8-character invite code.
   - `LobbyPage.tsx`: Real-time waiting room showing Affirmative/Negative debaters and Ready button.
3. **Database (`PostgreSQL 16`)**:
   - Durable persistence ensuring room state survives server restarts.

---

## 2. Technical Decisions & Invariant Preservation

* **Zero Hardcoded Paths**: API endpoints configured via `VITE_API_BASE_URL` in frontend; DB URLs loaded from `DATABASE_URL` in Spring Boot.
* **Pure State Machine**: Transition logic is executed with immutable checks:
  ```java
  public RoomState nextState(RoomEntity room) {
      if (room.isAffirmativeReady() && room.isNegativeReady()) {
          return RoomState.READY;
      }
      return RoomState.WAITING;
  }
  ```
* **Thread-Safe Joins**: `joinRoom()` uses optimistic locking or database row locking (`SELECT FOR UPDATE`) to eliminate race conditions when multiple users attempt to join the same room simultaneously.

---

## 3. Verification & Testing Strategy

1. **Unit Tests (Backend)**:
   - Valid room creation and code uniqueness.
   - Correct stance assignment (Host = Affirmative, Guest = Negative).
   - Rejecting 3rd user with HTTP 409 Conflict.
2. **Integration Tests (Full Stack)**:
   - End-to-end flow: User A creates room $\rightarrow$ User B joins with invite code $\rightarrow$ User A clicks Ready $\rightarrow$ User B clicks Ready $\rightarrow$ Room transitions to `READY`.
