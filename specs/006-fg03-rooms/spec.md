# Feature Specification: FG-03 Room & Live Session Management (PA4 Part E)
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058)*

Created: 2026-11-24. Feature: `006-fg03-rooms`. Status: In Progress.
Target Build: Build 2 / Build 3 Integration (PA4 Increment 2).
Companion Docs: [SOFTWARE_ARCHITECTURE_SPEC.md](../../docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md) (§6), [G1_SPEC_BUILD1.md](../../docs/architecture/G1_SPEC_BUILD1.md).

---

## 1. Executive Summary & Problem Formulation

In spoken educational debate, unstructured voice rooms or ad-hoc video conferences create chaotic turn-taking, lack role accountability, and fail to enforce competitive debate formats.

**FG-03 (Room & Live Session Management)** provides the deterministic lifecycle controller for debate matches. It enables authenticated learners to create private debate rooms with an 8-character uppercase invite code, select debate motions and sides (Affirmative vs. Negative), match with an opponent, coordinate mutual readiness in a lobby, and transition cleanly into live debate sessions while strictly rejecting unauthorized third-party interlopers with HTTP 409 Conflict.

---

## 2. User Scenarios & Acceptance Criteria

### US1 — Create Debate Room as Host (P1)
**User Story:** As an authenticated debater, I want to create a debate room with a chosen motion and stance so that I can invite an opponent to practice with me.

* **Acceptance Criteria (AC-1.1):** When a user sends `POST /api/v1/rooms` with `{ "topic_id": "...", "stance": "AFFIRMATIVE" }`, the system generates an 8-character uppercase alphanumeric `invite_code` (e.g. `DEB-8A3F`).
* **AC-1.2:** The room is initialized in the `WAITING` state with host assigned to the selected stance and the opponent slot set to `null`.
* **AC-1.3:** Response returns `201 Created` with room ID, invite code, host identity, topic metadata, and initial state.

### US2 — Join Debate Room via Invite Code (P1)
**User Story:** As an invited debater, I want to join an existing room using an 8-character invite code so that I can enter the lobby and take the opposing stance.

* **Acceptance Criteria (AC-2.1):** When a user sends `POST /api/v1/rooms/join` with `{ "invite_code": "DEB-8A3F" }`, the system validates the code.
* **AC-2.2:** If the room is in `WAITING` state and has an open slot, the user is assigned the remaining opposite stance (e.g. `NEGATIVE`).
* **AC-2.3:** Room state remains `WAITING` until both participants explicitly signal ready.
* **AC-2.4:** Response returns `200 OK` with full room details and participant identities.

### US3 — Mutual Readiness & Debate Trigger in Lobby (P1)
**User Story:** As a debater in the lobby, I want to review the selected motion, see my opponent's status, and toggle my "Ready" status so that the debate starts only when both sides are prepared.

* **Acceptance Criteria (AC-3.1):** Each debater can send `POST /api/v1/rooms/{id}/ready` to toggle readiness (`is_ready: true`).
* **AC-3.2:** When debater 1 is ready and debater 2 is not, the room remains in `WAITING` (1/2 ready).
* **AC-3.3:** The instant both debaters are `is_ready: true`, the room state deterministically transitions from `WAITING` to `READY` and triggers the debate countdown.
* **AC-3.4:** When the countdown completes, state transitions to `IN_DEBATE`.

### US4 — Room Closure & Lifecycle Termination (P2)
**User Story:** As a debater or system administrator, I want completed or abandoned rooms to terminate cleanly so that system resources are released.

* **Acceptance Criteria (AC-4.1):** When the debate timer elapses or both debaters conclude their speeches, the room transitions from `IN_DEBATE` to `CONCLUDED`.
* **AC-4.2:** If a debater leaves before debate starts or the room remains idle past the 30-minute timeout, the room transitions to `ABANDONED`.
* **AC-4.3:** No new media streams or state mutations are accepted for `CONCLUDED` or `ABANDONED` rooms.

---

## 3. Edge Cases & Invariant Constraints

1. **Third-Party Intruder Rejection (409 Conflict):**
   - When a 3rd user attempts to join a room that already has 2 participants (`host` and `guest`), the API immediately responds with `409 Conflict` and error code `ROOM_FULL`.
2. **Invalid / Stale Code (404 Not Found):**
   - If an invite code does not exist or has expired, respond with `404 Not Found` and message `INVALID_INVITE_CODE`.
3. **Invalid State Transition (422 / 400 Bad Request):**
   - Attempting to join a room in `IN_DEBATE` or `CONCLUDED` state returns `409 Conflict` with `ROOM_ALREADY_ACTIVE` or `ROOM_CLOSED`.
4. **Self-Opponent Guard:**
   - A user cannot join their own created room as their own opponent. Attempting to join with the host's authentication token returns `400 Bad Request` with `CANNOT_JOIN_OWN_ROOM`.
5. **Deterministic State Machine Invariant:**
   - Room state transitions follow a strict directed acyclic graph:
     `WAITING` $\rightarrow$ `READY` $\rightarrow$ `IN_DEBATE` $\rightarrow$ `CONCLUDED` (or `ABANDONED`). Reverse transitions (e.g. `IN_DEBATE` $\rightarrow$ `WAITING`) are structurally prohibited.

---

## 4. REST API Contract & Data Schema

### 4.1. Endpoints

| Method | Endpoint | Auth | Success | Errors | Description |
|---|---|---|---|---|---|
| `POST` | `/api/v1/rooms` | Bearer JWT | `201 Created` | 400, 401 | Create room, generate 8-char invite code |
| `POST` | `/api/v1/rooms/join` | Bearer JWT | `200 OK` | 400, 401, 404, 409 | Join room with invite code |
| `POST` | `/api/v1/rooms/{id}/ready` | Bearer JWT | `200 OK` | 401, 403, 404, 409 | Toggle player readiness |
| `GET` | `/api/v1/rooms/{id}` | Bearer JWT | `200 OK` | 401, 403, 404 | Poll or fetch current room & debater status |
| `POST` | `/api/v1/rooms/{id}/leave` | Bearer JWT | `200 OK` | 401, 404 | Leave room; triggers abandonment if unstarted |

### 4.2. Database Schema (`rooms` table)

```sql
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_code VARCHAR(12) UNIQUE NOT NULL,
    topic_id UUID REFERENCES topics(id),
    state VARCHAR(20) NOT NULL DEFAULT 'WAITING',
    affirmative_user_id UUID REFERENCES users(id),
    negative_user_id UUID REFERENCES users(id),
    affirmative_ready BOOLEAN NOT NULL DEFAULT FALSE,
    negative_ready BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE,
    concluded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_invite_code ON rooms(invite_code);
CREATE INDEX idx_rooms_state ON rooms(state);
```
