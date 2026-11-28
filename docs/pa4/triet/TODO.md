# TODO — Triết (Frontend & WebRTC/Audio Lead)

Sprint 4 (PA4). Scope and rules: [../README.md](../README.md). Branch from `pa4`, PR into `pa4`.

| Task | Jira | Branch | Due | Status |
|---|---|---|---|---|
| C4 Level 3: Frontend Component Diagram (React routes, contexts, hooks, LiveKit components) | SCRUM-58 | `feature/SCRUM-58-c4-frontend-components` | TBD | To Do |
| FG-03 Frontend: Room Setup page, Join Room modal, Lobby state sync, Ready button | SCRUM-63 | `feature/SCRUM-63-fg03-frontend` | TBD | To Do |
| FG-04 Frontend: LiveKit Client SDK integration (audio track publish/subscribe, mic mute/unmute, dual-consent UI, active speaker indicator) | SCRUM-64 | `feature/SCRUM-64-fg04-livekit-frontend` | TBD | To Do |
| Record, narrate and publish YouTube demo video for FG-03 + FG-04 (English narration, 2-browser session) | SCRUM-70 | `feature/SCRUM-70-demo-video` | TBD | To Do |
| Review Tài's C4 Level 1 System Context Diagram (Part B) | SCRUM-60 (review) | n/a (review) | TBD | To Do |

## C4 Level 3 — Frontend Component Diagram (SCRUM-58)

**Owner:** Nguyễn Bảo Minh Triết — **24125047** — **Frontend & WebRTC/Audio Lead**  
**Reviewer:** Nguyễn Anh Khoa (24125058)  
**Deliverable:** `docs/pa4/ARCHITECTURE_C4_COMPONENTS_FE.md`

Internal decomposition of the **React SPA container** as it actually exists in `web/src/`:
- Pages: `AuthPages`, `LobbyPage`, `RoomSetupPage`, `DebateRoomPage`
- Routing: React Router setup in `App.tsx` / `routes.ts`
- Contexts: Auth context, Room context
- Hooks: `useAuth`, `useLiveKit`, `useRoom`
- Components: `ui.tsx`, `PreviewTools`, Audio components
- LiveKit integration: `@livekit/components-react`, `livekit-client`

> [!IMPORTANT]
> Component diagram must match `web/src/` file structure at the time of submission. Aspirational components not yet implemented must NOT appear.

## FG-03 Frontend (SCRUM-63)

**Owner:** Nguyễn Bảo Minh Triết — **24125047**  
**Reviewer:** Nguyễn Đình Thiên Lộc (24125093)  
**Deliverable:** `web/src/pages/rooms/`, updated `web/src/pages/LobbyPage.tsx`

Acceptance criteria:
- Create Room flow: form → 8-char invite code displayed
- Join Room flow: enter code → redirect to Lobby
- Lobby: shows both participants' names and stances; READY button activates when both joined
- State syncs live (polling or WebSocket) with backend

## FG-04 Frontend — LiveKit (SCRUM-64)

**Owner:** Nguyễn Bảo Minh Triết — **24125047**  
**Reviewer:** Nguyễn Anh Khoa (24125058)  
**Deliverable:** `web/src/components/audio/`, `web/src/hooks/useLiveKit.ts`

Acceptance criteria:
- Dual-consent: both users must click "Allow microphone" before audio activates
- Publish local audio track; subscribe to remote audio track
- Mute/unmute toggle with visible state
- Active speaker indicator (highlights speaking participant)

## Demo Video (SCRUM-70)

**Owner:** Nguyễn Bảo Minh Triết — **24125047**  
**Reviewer:** All members  
**Deliverable:** YouTube link added to `docs/pa4/DEMO_VIDEO.md`

Script: open two browser tabs as User A (Affirmative) and User B (Negative); narrate in English the full flow: register → create room → join via code → lobby ready → start debate → live audio conversation → end session.

## Follow-up after the demo: typist switches to voice mid-debate

Not built. A debater who chose Type stays a typist: input is fixed at Ready, and the media token
publishes only for `VOICE` (`RoomService.java`, `canPublish`). Today only voice can fall back to typing.
Needs, in order:
1. Backend (Tài): change the seat to `VOICE` during LIVE (for example `PUT /rooms/{id}/input`) and issue a token that can publish.
2. Frontend: "Use my microphone" in the audio settings gear for typists: voice consent first, then browser mic permission, then reconnect with the new token (short audio gap).
3. Specs: UC-04-01/02, architecture spec, room-flow design (typing is one-way today).
4. Partner sees the switch (chip from "Typing" to "Live").
