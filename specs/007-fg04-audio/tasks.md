# Tasks: FG-04 real-time audio

Checked = done and merged on `pa4`. "In review" = written, PR open, not merged.
Unchecked = not started. Backend: Tài (SCRUM-62). Frontend: Triết (SCRUM-63).

## Setup

- [x] T001 Token and typed-turn contract in `web/API_CONTRACT.md` (on `pa4`; typed turns in PR #73).
- [ ] T002 Spec, plan and tasks for FG-04 (this folder, SCRUM-64). Khoa to check, Tuấn to review.
- [ ] T003 Create the LiveKit Cloud project; share keys out of band, never in git (Tài).
- [ ] T004 Update architecture spec 6.2 (token only in `LIVE`) and add `source` to `transcript_segments`.

## Frontend (Triết)

- [x] T010 Mic permission, device selection and mic test before Ready (`useMicCheck.ts`, PR #70).
- [ ] T011 [US1] In review (PR #71): `debateAudio.ts` connects with the token and plays the partner's track.
- [ ] T012 [US2] In review (PR #71): no mic track for `TYPE`; nothing before `LIVE`.
- [ ] T013 [US3] In review (PR #71): mute/unmute, partner state, active speaker, muted after reload.
- [ ] T014 [US4] In review (PR #71): connection quality, Try again, Turn on sound, end after 60 s away.
- [ ] T015 [US5] In review (PR #73): typed turns panel and `useTypedTurns.ts`.
- [ ] T016 In review: `web/tests/room-{audio,live,rules,wrap,type}.spec.ts` with fake LiveKit.

## Backend token API (Tài) — not started

- [ ] T020 [US1] Add the LiveKit server SDK and read the three `LIVEKIT_*` variables.
- [ ] T021 [US1] `POST /rooms/{id}/token`: participant of a `LIVE` room only, else 409/403/404.
- [ ] T022 [US2] Refuse unless both participants have `consent_given_at`.
- [ ] T023 [US2] Publish-microphone grant only for `input = VOICE`.
- [ ] T024 Test that decodes the token and checks identity, room and grants.

## Backend typed turns (Tài) — not started

- [ ] T030 [US5] Add `source` to `transcript_segments`; settle the `seq` unique key (see plan).
- [ ] T031 [US5] `POST /rooms/{id}/turns` (trim, 1–500, 422) and `GET …/turns?after=`.

## Verification

- [ ] T040 Two real browsers on different networks: hear each other, mute shows on both, active speaker moves.
- [ ] T041 Request a token in `READY` and as a `TYPE` debater; confirm 409 and no audio grant.
- [ ] T042 Close one tab; the other sees the debate end with `DISCONNECT` after 60 s.
- [ ] T043 Record the result here with the commit hash.
