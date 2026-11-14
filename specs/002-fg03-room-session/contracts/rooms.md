# Room API contract

Status: draft, pending team and reviewer approval. Not implemented.

Prefix `/api/v1`. JSON, UUID strings, UTC timestamps. Bearer access token on every call.
Shapes and errors follow `docs/architecture/G1_SPEC_BUILD1.md` sections 4 and 6.
Server identity comes from the token, never the body. Unknown request fields give 422.

## Endpoints

| Method and path | Request | Success | Errors | FR |
| --- | --- | --- | --- | --- |
| POST `/rooms` | `topic_id`; optional `format`, `duration_seconds`, `stance_mode`, `creator_stance` | 201 room, status LOBBY | 401 INVALID_SESSION; 422 VALIDATION_ERROR or TOPIC_UNAVAILABLE | FR-10 |
| POST `/rooms/join` | `invite_code` | 200 room; second joiner makes READY; member retry is idempotent | 401; 404 ROOM_UNAVAILABLE; 409 ROOM_FULL or ROOM_NOT_JOINABLE; 422 | FR-11, FR-12 |
| GET `/rooms/{id}` | none | 200 room for a participant | 401; 404 ROOM_UNAVAILABLE for absent room or non-member; 422 malformed UUID | FR-11, FR-12 |
| POST `/rooms/{id}/start` | none | 200 room, status LIVE with `started_at` | 401; 404; 409 INVALID_TRANSITION or START_NOT_ALLOWED | FR-12 |
| POST `/rooms/{id}/cancel` | none | 200 room, status CANCELLED | 401; 403 FORBIDDEN; 404; 409 INVALID_TRANSITION | FR-12 |
| POST `/rooms/{id}/end` | none | 200 room, status ENDED | 401; 404; 409 INVALID_TRANSITION | FR-12 |

The last three are proposals, subject to open questions 1 to 3 in [spec.md](../spec.md).

## Room response

```json
{
  "id": "<room UUID>",
  "topic_id": "<topic UUID>",
  "creator_id": "<user UUID>",
  "invite_code": "<eight characters>",
  "status": "READY",
  "format": "FREE_FLOW",
  "duration_seconds": 600,
  "stance_mode": "RANDOM",
  "created_at": "<UTC timestamp>",
  "lobby_expires_at": "<UTC timestamp>",
  "started_at": null,
  "server_time": "<UTC timestamp>",
  "participants": [
    {"user_id": "<UUID>", "display_name": "Learner", "label": "A", "stance": "PRO"},
    {"user_id": "<UUID>", "display_name": "Partner", "label": "B", "stance": "CON"}
  ]
}
```

`started_at` and `server_time` are proposed additions so both clients can compute the
same countdown. Emails and consent data are never returned, and the invite code is
never returned to non-participants.

## Error shape

`application/problem+json` with `type`, `title`, `status`, `code`, `detail`; 422 adds
`errors: [{field, message}]` without echoing submitted values. 429 carries Retry-After; 503 is sanitized.

## Rules

- Create defaults: FREE_FLOW, 600 seconds, RANDOM. CREATOR_PICKS requires `creator_stance` PRO or CON.
- Join order: authenticate, validate code, lock room, apply expiry, reject non-joinable states, return existing member, reject full, insert B and set READY.
- Invite codes are trimmed and uppercased on input and never logged.
- No endpoint accepts a status value from the client.
