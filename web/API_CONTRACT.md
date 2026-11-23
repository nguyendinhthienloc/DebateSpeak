# Room API contract (FG-03, FG-04)

What the backend needs to build next. The room screens are finished and call
every endpoint below; their tests mock them. `api/authify` has none of them yet.

- Shapes the UI accepts: `src/rooms/contracts.ts`. Calls: `src/rooms/api.ts`.
- Behaviour and wording: [room flow spec](../docs/superpowers/specs/2026-11-19-room-flow-design.md).
- Auth and accounts are built; their contract moved to [docs/api/](../docs/api/fg01-auth-contract.md).

## Connect

Same as auth: prefix `/api/v1`, JSON, `credentials: include`,
`X-DebateSpeak-Client: web`, and `Authorization: Bearer <access token>` on every
room call. **Add `PUT` to the CORS methods** (Ready uses it).

A **401 signs the user out**, so use it only for a missing or bad token. The UI
has its own message for 404 and 409 on lookup and join, and for 403/404 on
`GET /rooms/{id}`; other errors get a generic "try again". Error bodies are
optional (`{"code":"room_full"}` is fine); the UI reads only the status.

## Endpoints

"Snapshot" is the room object below. Success may be 200 or 201.

| Method and path | Who, when | Body | Success | Errors | Ticket |
| --- | --- | --- | --- | --- | --- |
| `GET /topics` | signed in | | `{"topics":[Topic]}` | | SCRUM-60 |
| `POST /rooms` | signed in | `topic_id`, `format`, `duration_minutes`, `side` | Snapshot (`LOBBY`) | | SCRUM-60 |
| `POST /rooms/lookup` | signed in | `code` | Preview | 404 wrong/expired/closed, 409 full | SCRUM-60 |
| `POST /rooms/join` | signed in | `code` | Snapshot (`READY`) | 404, 409 | SCRUM-60 |
| `GET /rooms/{id}` | participants | | Snapshot | 403/404: "not available" | SCRUM-60 |
| `POST /rooms/{id}/cancel` | creator, `LOBBY`/`READY` | `{}` | Snapshot (`CANCELLED`) | 409 | SCRUM-60 |
| `POST /rooms/{id}/leave` | participant, `READY` | `{}` | Snapshot | 409 | SCRUM-60 |
| `PUT /rooms/{id}/ready` | participant, `READY` | `{"consent":true,"input":"VOICE"\|"TYPE"}` | Snapshot | 422 no consent, 409 | SCRUM-60 |
| `DELETE /rooms/{id}/ready` | participant, `READY` | | Snapshot | 409 | SCRUM-60 |
| `POST /rooms/{id}/end` | participant, `LIVE` | `{"reason":"MANUAL"\|"DISCONNECT"}` | Snapshot (`ENDED`) | 409 | SCRUM-60 |
| `POST /rooms/{id}/token` | participant, `LIVE` | `{}` | `{"token","url"}` | 409 not live | SCRUM-62 |
| `POST /rooms/{id}/turns` | participant, `LIVE` | `{"text"}`, 1–500 chars | TypedTurn | 422, 409 | typed turns |
| `GET /rooms/{id}/turns?after={seq}` | participants | | `{"turns":[TypedTurn]}`, `seq > after`, ascending | | typed turns |

`side` is `FOR`, `AGAINST` or `RANDOM`. `format` is `FREE_FLOW` or
`TIMED_TURNS`. `duration_minutes` is 5, 10, 15 or 20; for `TIMED_TURNS` ignore it
and use 390 seconds.

## Shapes

Snapshot (all ids are strings, times UTC ISO-8601):

```json
{
  "id": "9b2f…", "code": "K7Q2M9XA", "status": "READY",
  "motion": "Cities should ban private cars from the centre",
  "format": "FREE_FLOW", "duration_seconds": 600,
  "expires_at": "2026-11-19T10:30:00Z", "started_at": null, "ended_at": null,
  "end_reason": null, "ended_by": null, "server_now": "2026-11-19T10:00:00Z",
  "participants": [
    { "user_id": "d817…", "display_name": "Linh", "side": "FOR", "is_creator": true, "ready": false, "input": null }
  ]
}
```

- `status`: `LOBBY`, `READY`, `LIVE`, `ENDED`, `CANCELLED`.
- `code`: 8 characters (shown as `K7Q2 M9XA`); `null` once the room is cancelled or ended.
- `side`: `null` until `READY`. `input`: `null` until that person presses Ready.
- `server_now`: on **every** snapshot; the clock is corrected with it.
- `end_reason`: `MANUAL`, `TIMER`, `DISCONNECT`, `CANCELLED` or `EXPIRED`.
  `ended_by` is the user id for `MANUAL`, otherwise `null`.

Topic: `{"id":"topic-1","motion":"…","category":"Society","cefr_level":"B1"}`.

Preview: `{"room_id":null,"motion":"…","creator_name":"Linh","format":"FREE_FLOW","duration_seconds":600,"stance_mode":"CREATOR_PICKS"}`.
`room_id` is set only when the caller already has a seat; the UI then opens the
room instead of offering the seat. `stance_mode` is `RANDOM` or `CREATOR_PICKS`.

TypedTurn: `{"seq":1,"user_id":"d817…","text":"Buses can replace cars.","at_ms":5000}`.
`seq` counts up from 1 per room; `at_ms` is milliseconds since `started_at`.

## Rules

- **Invalid moves return 409.** Join and Ready run under a row lock on the room.
- **Join:** the second person moves the room to `READY` and sides are assigned
  (the opposite of the creator's choice, or random). A third account gets 409.
  Nobody ever gets a second seat; lookup gives a seated caller their `room_id`.
- **Ready:** needs `consent: true`. The second Ready moves the room to `LIVE`
  with `started_at` = now + 3 s, creating exactly one debate session.
- **Leave:** a guest leaving `READY` reopens the seat, clears both ready flags and
  restarts the 30-minute expiry (`LOBBY`). The creator leaving cancels the room.
- **Expiry:** a `LOBBY` room past `expires_at` becomes `CANCELLED`, `EXPIRED`.
- **Time limit:** the server ends the room at `started_at + duration_seconds`
  (`TIMER`). Applying expiry and the time limit on every read is enough.
- **Disconnect:** the UI calls end with `DISCONNECT` after the partner has been
  gone from LiveKit for 60 s.
- **Polling:** each open room polls `GET /rooms/{id}` every 2 s before the debate
  and every 5 s during it. Keep it cheap.

## LiveKit token

- Room name = room id (never the code). Identity = user id. Name = display name.
- Grants: subscribe and publish data for everyone; publish microphone audio
  only when the person's `input` is `VOICE`.
- Short-lived (a few minutes); the UI asks for a new token each time it connects.
- `url` is the LiveKit server address the browser connects to (`LIVEKIT_URL`).
  Key and secret come from the environment only.

## Typed turns

Trim the text; refuse empty or over 500 characters with 422. Store it as plain
text in `transcript_segments` with `source = 'TYPED'`: it is debate content and
is analysed like speech. After saving, the UI sends a LiveKit data message
`{"seq":n}` on topic `turn`, so the partner fetches it at once; it also polls
every 5 s.

## Check against the frontend

Set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in the repo-root `.env`, run
`npm run dev` in `web/`, and play one full debate in two browsers (create, join,
Ready, talk or type, end). The exact request bodies the UI sends are in
`tests/helpers/rooms.ts` and `tests/room-*.spec.ts`. Those tests mock the API, so
passing them does not prove the backend works.
