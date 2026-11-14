# Decisions and sources

Status: draft, pending team and reviewer approval.

- Contract paths and shapes reuse `docs/architecture/G1_SPEC_BUILD1.md` sections 4 and 6
  (`POST /rooms`, `POST /rooms/join`, `GET /rooms/{id}`). Older `/debates/rooms*` paths are not used.
- State graph: `api/app/domain/rooms.py` and G1 section 3. LOBBY to READY, LOBBY or READY to
  CANCELLED, READY to LOBBY, READY to LIVE, LIVE to ENDED. Self-transitions are invalid.
- Polling every two seconds follows G1 section 1; WebSocket is not needed before Increment 2.
- Invite code, expiry (30 minutes) and join order follow G1 sections 2 and 6.
- Tasks and owners come from the Tài and Triết task lists in `docs/pa3/` and `docs/pa3/Changes.md`.
- The start endpoint is new relative to G1 and needs approval (open questions 1 and 2).
- Java versus Python: see the decision note in the architecture spec; unconfirmed.
- Not decided here: Java libraries, migration tool, load of the polling.
