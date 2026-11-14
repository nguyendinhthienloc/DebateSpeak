# Data model

Status: draft, pending team and reviewer approval.

| Entity | Fields used by FG-03 | Rules |
| --- | --- | --- |
| Topic (`debate_topics`) | id, title, active | Seeded; only active topics can be chosen (FR-10) |
| Room (`debate_rooms`) | id, topic_id, creator_id, invite_code, status, format, duration_seconds, stance_mode, created_at, lobby_expires_at, started_at | Invite code unique, eight characters; lobby expires 30 minutes after creation; `started_at` is the one proposed addition and is null until LIVE |
| Participant (`debate_participants`) | room_id, user_id, label A or B, stance | Primary key (room_id, user_id); unique (room_id, label); stance null in LOBBY, PRO or CON at READY (FR-11) |

Status values: LOBBY, READY, LIVE, ENDED, CANCELLED (FR-12).
Format: FREE_FLOW or TIMED_TURNS. Stance mode: RANDOM or CREATOR_PICKS.
Duration: 60 to 1800 seconds, default 600.

Join locks the room row, so capacity is two under concurrency; unique constraints back it up.
Consent timestamp stays null in this slice. Existing table and column names are kept;
the `started_at` column needs a migration once approved (task T004).
The frontend holds room data in memory only and reloads it from the API.
