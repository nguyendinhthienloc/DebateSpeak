# Implementation Plan: FG-04 real-time audio

Date: 2026-11-27. [Specification](spec.md). Backend owner: Tài. Frontend owner: Triết.

## Summary

The browser talks to LiveKit Cloud directly. The API only signs a short-lived
access token once the room is `LIVE` and both debaters have consented. Media
never passes through Spring Boot. Typed turns (PR #73) are plain REST.

## Technical Context

| Layer | Choice |
|---|---|
| Frontend | `livekit-client` 2.x, loaded on demand: `web/src/rooms/debateAudio.ts`, `pages/rooms/LiveStage.tsx` (PR #71, #73) |
| Media | LiveKit Cloud free tier (AGENTS.md §4); one audio track per speaker |
| API | Java 17, Spring Boot in `api/authify`; LiveKit server SDK for Java (`io.livekit:livekit-server`) to sign tokens |
| Database | PostgreSQL 16; reads 006 tables; `transcript_segments` for typed turns |
| Tests | Playwright with `web/tests/helpers/fakeLiveKit.ts` and `fakeAudio.ts`; Spring Boot test that decodes the token grants |

## Structure

```text
api/authify/src/main/java/org/debatespeak/authify/
├── controller/RoomController.java   # adds /token, /turns
├── service/MediaTokenService.java   # signs LiveKit JWTs, checks LIVE + both consents
├── service/TypedTurnService.java    # 1–500 chars, seq per room
└── entity/TranscriptSegmentEntity.java
```

## Data model

| Table | Change |
|---|---|
| `transcript_segments` | add `source` (`SPEECH`, `TYPED`); for typed rows `start_ms = end_ms = at_ms`, `words = '[]'` |

`seq` must be unique per session for typed turns. The architecture schema has
`UNIQUE (session_id, speaker_id, seq)`; the contract counts `seq` per room, so
the unique key needs to become `(session_id, seq)` or typed turns need their own
counter. Decide before coding.

## Contracts

All under `/api/v1`, bearer token required. Full shapes:
[web/API_CONTRACT.md](../../web/API_CONTRACT.md) (PR #73 version).

| Endpoint | Result |
|---|---|
| `POST /rooms/{id}/token` `{}` | `{"token":"<jwt>","url":"wss://…livekit.cloud"}`; 409 not live |
| `POST /rooms/{id}/turns` `{text}` | `{"seq":1,"user_id":"…","text":"…","at_ms":5000}`; 422, 409 |
| `GET /rooms/{id}/turns?after={seq}` | `{"turns":[TypedTurn]}`, ascending |

Token claims: `sub` = user id, `name` = display name, video grant
`roomJoin`, `room` = room id, `canSubscribe`, `canPublishData`, and
`canPublish` + `canPublishSources: ["microphone"]` only for `VOICE`.

Client-side LiveKit data message after a typed turn: topic `turn`, payload
`{"seq":n}`.

## Configuration

| Variable | Purpose |
|---|---|
| `LIVEKIT_URL` | Returned to the browser as `url` |
| `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Token signing; environment only |

`.env.example` already has these. Its values are LiveKit's local dev
defaults, not real keys; never commit Cloud credentials.

## Known gaps

- The 60-second disconnect rule is enforced by the client calling
  `/end`. If both browsers vanish, the room ends only at the time limit.
- No LiveKit webhooks, so the server cannot confirm who actually connected.
- The architecture spec (section 6.2) issues a token after room creation;
  this plan issues it only in `LIVE`. Update the architecture spec.
