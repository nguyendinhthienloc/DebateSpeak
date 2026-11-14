# Manual checks

Status: draft, pending team and reviewer approval. Run only after the backend, seed data
and frontend wiring exist; until then none of these has been run.

Prerequisite: two accounts (learners A and B), a third account C, and one seeded active
topic, in separate browsers.

1. A signs in, opens room setup, picks the topic, keeps defaults, creates. Expect LOBBY, invite code and link.
2. A tries invalid settings (CREATOR_PICKS without stance, duration 5). Expect 422 messages and no room.
3. B signs in and joins with the code in lower case with spaces. Expect READY, opposing stances, on both screens within about two seconds.
4. C joins with the same code. Expect the room-full message, no names.
5. B submits the code again. Expect the same room and no extra participant.
6. Reload A's page, sign in, confirm the same room loads. Request the room as C; expect 404.
7. Start from READY (if approved). Expect both screens LIVE with the same server start time. Confirm the browser asks for no microphone.
8. Repeat start. Expect the original start time. Try start on a LOBBY room; expect 409.
9. Let a lobby pass 30 minutes (or shorten it in a test database). Expect CANCELLED and a code that no longer joins.
10. Stop the backend while polling. Expect a calm retry message and no raw error text.

Record results in this file after running.
