# Room flow design

Date: 2026-11-19. Status: approved by the user, with typing as a replacement for
voice. Mode: Operate, with the debate screen as a focused stage.

Covers PA4 Part E: FG-03 rooms and FG-04 live audio, from creating a room to the
end of the debate. Performer and peer review are to be recorded by the branch
owner; no approval is claimed here.

## Intent

Two learners need to get from "let's debate" to a live spoken debate without
confusion, pressure or fake screens. Today the room flow is eight sample routes
with a fixed code and disabled buttons. It becomes one real room page driven by
server state, connected to the API and to LiveKit audio.

## Goals

- One room address (`#/rooms/:id`) from the waiting lobby to the end of the debate.
- Real create, invite, join, consent, mic check, live audio and end.
- No audio leaves a browser until both debaters have agreed.
- A learner who can't or doesn't want to speak can debate by typing.
- Every failed or abandoned path says what happened and offers a next step.
- Keep Cream & Yellow. No new colours, fonts, radii or shadows.

## Non-goals

Feedback reports (PA5), rematch, QR invites, typed motions, topic browsing
(FG-02), debate history (FG-10), abuse reports (FR-16), audience seats and video.

## Anti-goals

The work fails, even if it runs, if it does any of these:

- Pressures someone to consent: countdowns, nagging, or "your partner is waiting".
- Shows feedback, scores or talk-time meters during the debate.
- Mutes a speaker automatically.
- Shows sample data as if it were real.

## Decisions

Chosen by the user from visual options in the Room Flow Picker.

| Decision | Chosen | Also considered |
|---|---|---|
| Dark stage | Debate only | Whole room; Cream throughout |
| Setup layout | Everything on one page | Quick card; three steps |
| Choosing a motion | Pick from a seeded list | Deal one at a time; list plus typed motion |
| Waiting lobby | Giant invite | Invite beside seats; face to face |
| Joining | Pop-up over Home | Full invitation page; straight into the room |
| Consent and mic | Side by side | One at a time; shared checklist |
| Starting | Both press Ready | Either person; host only |
| Debate screen | Spotlight | Two lecterns; split screen |
| Debate clock | Progress bar | Big clock; small corner clock |
| After the debate | Stay on the stage | Clear summary page; debate again |
| Who builds the screens | Triết | Claude; split the work |

User notes:

- **Setup:** space must not go to waste, including the area under and beside the form.
- **Headers:** use one or two header styles across the whole site.
- **Debate:** add an option to type, which can replace voice for the debate. It must
  stay quiet on screen, because speaking is the main focus.

## Flow

| Step | Room state | Screen |
|---|---|---|
| Create | none, then `LOBBY` | `#/rooms/new` |
| Invite | `LOBBY` | `#/rooms/:id`, giant invite |
| Join | `LOBBY` to `READY` | `#/join/:code`, pop-up over Home |
| Agree | `READY` | `#/rooms/:id`, consent and mic check |
| Debate | `LIVE` | `#/rooms/:id`, Ink stage |
| Wrap up | `ENDED` | `#/rooms/:id`, Ink stage |

`CANCELLED` covers a room closed by its creator or left to expire.

The sample routes `/rooms`, `/rooms/new/settings`, `/invite`, `/rooms/waiting`,
`/rooms/ready`, `/rooms/full` and `/rooms/expired` are removed. The router gains
path parameters.

## Screens

### Create (`#/rooms/new`)

Two columns from 960px, together filling the content height at 1440 by 900:

- **Left:** the selected motion in display type, then Length (5, 10, 15, 20 min),
  Format (Free flow, Timed turns), Your side (For, Random, Against) and Create room.
- **Right:** the motion list as an Ink pane, using Home's topics pane treatment.
  Each row shows the motion, category and level. Selecting a row updates the left column.

Below 960px: one column, the selected motion first, the list opened by "Choose
another motion", and Create room stuck to the bottom of the screen.

Timed turns has fixed phases lasting 6.5 minutes (architecture spec section 6.4),
so choosing it replaces the Length control with "About 7 minutes".

### Invite (`LOBBY`)

The motion and "Waiting for your partner · 1 of 2 joined" on top. A Yellow panel
holds the code at giant size in two groups of four, **Copy invite link** (primary)
and **Copy code**, with "Expires in 29 minutes". Your seat and the open seat sit
below. **Cancel room** is a quiet text action. The page moves to Agree by itself
when the partner joins.

### Join (`#/join/:code`)

Home stays behind a modal dialog showing who invited you, the motion, the terms,
**Take the open seat** and **Not now**. The same dialog opens from the code field
on Home. It traps focus, and Esc or Not now returns to `#/home`.

- Wrong, expired or full codes show their message inside the dialog.
- Someone already in the room goes straight to it.
- A signed-out visitor signs in or registers, then returns to the invite.

The code may appear in the hash, because a fragment is never sent to the server.
This replaces the "code is never put in the URL" comment in `HomePage.tsx`.

### Agree (`READY`)

Both seats show names and sides. Two cards sit side by side:

1. **Agree to this debate:** a plain list of what happens, then an unticked checkbox.
2. **Check your microphone:** device picker, explicit Test button, level meter and
   "We can hear you". The test stays in the browser and the mic is released afterwards.
   It uses the same noise suppression as the debate, and passes after about one second of
   sound at a normal speaking level (RMS above 0.08); background noise alone does not pass.
   A quiet **Type instead** action skips the mic request and the test for this debate.
   If no microphone is found, a notice says so and offers Type instead.

**I'm ready** unlocks when the box is ticked and either the browser has allowed the mic
(Test pressed; hearing speech is not required) or Type instead is on. A blocked mic still
keeps it locked. In the debate, the live audio settings
([2026-11-28 design](2026-11-28-live-audio-settings-design.md)) are the fallback. After pressing it, the button becomes **Not ready yet**, which withdraws consent. The
partner sees only "Sam hasn't finished yet". **Leave room** is always available.

When the second person presses Ready, both screens count down from 3 and the mics
open at the shared start time.

### Debate (`LIVE`)

Full-screen Ink stage with the stage header and no app navigation.

- **Status chip:** "Live · Transcribing · Audio not saved".
- **Clock:** a slim bar across the top showing time remaining, with exact digits at
  the end. It never flashes or changes colour. A polite status reads "1 minute left".
- **Spotlight:** the speaker's name at giant size in Yellow, labelled with their side.
  "You" is added for your own name.
- **Partner chip:** always shows the other person's name, side, and muted or
  connection state, so they keep a presence on screen.
- **Dock:** connection status, **Type** (quiet text action), **Mute** and **End debate**.
  End debate asks "End for both of you?" before acting.

Spotlight rules:

- Hold a speaker for at least 1.2 seconds, so names don't flicker.
- If both speak at once, show both names at equal size.
- In silence, keep the last speaker and change the label to "Quiet".
- A typed turn takes the spotlight like speech: the writer's name with the text under
  it, held for at least 6 seconds or until the next turn.

In timed turns, the bar is divided into phases and a line under it names the phase,
the turn holder and the turn time left. Nobody is muted when a turn ends.

### Typing instead of speaking

Typing can replace voice for one debater or both, for the whole debate. Voice stays
the default, and the Type controls stay visually quiet.

- **Choosing it:** Type instead on the Agree screen puts that person in type mode until
  the debate ends. No microphone is requested, and Mute is hidden. Someone using voice
  can also open Type at any time.
- **Writing:** Type opens a side panel on desktop and a bottom sheet on phones, with a
  text box (500 characters), Send, and the typed turns so far. In type mode it starts open.
- **Reading:** a sent turn appears in the partner's spotlight by itself, so it can't be
  missed. A person in type mode still hears a partner who is speaking.
- **Saving:** typed turns are debate content. They are saved in `transcript_segments`
  with `source = TYPED` and survive a reload.
- **Consent:** the consent list adds "Anything you type is saved in your transcript and
  analysed by AI."
- **Status chip:** when both debaters type, it reads "Live · Typed debate · Saved to transcript".
- **PA5:** typed turns can receive argument and language feedback, but never fluency or
  pronunciation feedback.

### Wrap up (`ENDED`)

The stage stays and the mic is released first. It shows "Debate finished", the
length, the motion, who you debated, how it ended, and the label "Feedback report:
coming in a later release". Actions are **Back to home** and **Set up another room**.

## Headers

Three header styles exist today: the app bar, the welcome nav and the auth bar.
They become two shared components:

- **App bar:** the Ink bar with brand and navigation, for signed-in app pages.
- **Stage bar:** brand plus at most one action, for welcome, auth, debate and wrap-up.
  During a debate the brand is plain text, so nobody leaves by accident.

The "Preview · sample rooms" badge is removed once rooms are real. The "Preview
screen" dropdown is hidden in production builds.

## Room contract

All paths sit under `/api/v1`.

| Request | Purpose | Rules |
|---|---|---|
| `GET /topics` | Seeded motions | Signed-in users |
| `POST /rooms` | Create a room | Returns the room snapshot |
| `POST /rooms/lookup` | Preview a room by code | Code in the body. Errors for wrong, expired or full |
| `POST /rooms/join` | Take the open seat | Row lock. Second participant moves the room to `READY` |
| `GET /rooms/{id}` | Room snapshot | Participants only |
| `POST /rooms/{id}/leave` | Leave before the debate | See rules below |
| `POST /rooms/{id}/cancel` | Close the room | Creator only. Frees the code |
| `PUT /rooms/{id}/ready` | Consent, input mode, ready | Body: `consent`, `input` (`VOICE` or `TYPE`). Second call moves the room to `LIVE` |
| `DELETE /rooms/{id}/ready` | Withdraw | Only while `READY` |
| `POST /rooms/{id}/token` | LiveKit token | Only in `LIVE`. Short-lived. Type mode can't publish audio |
| `POST /rooms/{id}/turns` | Save a typed turn | Only in `LIVE`. 1 to 500 characters |
| `GET /rooms/{id}/turns?after={seq}` | Read typed turns | Participants only |
| `POST /rooms/{id}/end` | End the debate | Either participant |

The snapshot carries: `id`, `code`, `status`, `motion`, `format`, `duration_seconds`,
`expires_at`, `started_at`, `ended_at`, `end_reason`, `server_now`, and participants
with `user_id`, `display_name`, `side`, `is_creator`, `ready` and `input`.

Rules:

- **States:** `LOBBY`, `READY`, `LIVE`, `ENDED`, `CANCELLED`. Invalid moves return 409.
- **Sides:** assigned on `LOBBY` to `READY`. The partner takes the opposite of a chosen side.
- **Leaving:** a guest leaving `READY` reopens the seat, clears ready flags and restarts
  the 30-minute expiry. A creator leaving `LOBBY` or `READY` cancels the room.
- **Start time:** `started_at` is the moment of the second Ready plus 3 seconds.
  Clients use `server_now` to correct clock differences.
- **Time limit:** the server is the authority on when a debate ends.
- **LiveKit room name:** the room id, never the invite code.
- **Updates:** poll every 2 seconds before the debate and every 5 seconds during it.
- **Reload during a debate:** rejoin with the mic muted and say so on screen.

## Corrections to existing documents

| Topic | Today | This design |
|---|---|---|
| State names | Tài's TODO: `WAITING`, `IN_DEBATE` | Architecture spec names |
| Consent | Tài's TODO starts when both are ready, with no consent | Ready includes consent and mic check |
| Token timing | Spec 6.2 issues a token after creation | Only in `LIVE` |
| Mic denied | Spec 6.5 blocks `READY` | Blocks pressing I'm ready |
| API paths | Spec uses `/debates/rooms/{id}` | `/rooms/{id}` |
| Start endpoint | Spec has `POST .../start` | Replaced by `PUT .../ready` |
| Room route | `route-gaps.md` plans `#/rooms/:code` | `#/rooms/:id` and `#/join/:code` |
| Start guard | Spec requires a passed mic test from both | Required only for voice |
| Mic test | Must pass before I'm ready | Mic must be allowed; live audio settings are the fallback (2026-11-28) |
| Typed turns | FR-58 covers only a side chat kept out of analysis | New requirement: typed turns are debate content, with a `source` column on `transcript_segments` |
| Spec folders | PA4 plan: 003 and 004 | `specs/006-fg03-rooms`, `specs/007-fg04-audio` |

## Other endings

| Situation | Learner sees | Way out |
|---|---|---|
| Room full | This room already has two debaters | Try another code, or create a room |
| Code wrong or expired | This invite no longer works | Ask for a new code, or create a room |
| Creator cancels | Linh closed this room | Back to home |
| Guest leaves before start | Sam left. The seat is open again | Invite shows again |
| Learner declines | You left the room. No audio was shared | Back to home |
| Mic blocked | Browser-specific steps to allow it | Try again, type instead, or leave |
| Partner drops during debate | Sam lost connection. Waiting up to 60 seconds | Resumes, or ends and shows Wrap up |
| Partner ends the debate | Sam ended the debate | Wrap up |

## Constraints

- `DESIGN.md` needs one recorded exception: the stage for `LIVE` and `ENDED`. It also
  needs the header rule and the new parts above.
- Update the architecture spec and proposal before code, as AGENTS.md requires.
- Keyboard use throughout, visible focus, and reflow at 320px.
- Under reduced motion, spotlight and countdown changes are instant.
- Speaker changes are not announced to screen readers. Phase changes, one minute
  left and the end of the debate are.
- `.env.example` gains the LiveKit variables with empty values.

## Build order

Owners follow the PA4 plan: Nguyễn Bảo Minh Triết (24125047, Frontend & WebRTC/Audio
Lead) builds the screens, and Nguyễn Hồng Tấn Tài (24125078, Backend & Real-Time Media
Lead) builds the API.

| Step | Work | Owner | Done when |
|---|---|---|---|
| 0 | Merge this branch into `pa4`, agree this contract, write specs 006 and 007 | Team | Tài and Triết confirm the contract |
| 1 | Route parameters, room shell, two headers | Triết | Every room state opens by URL with mocked data |
| 2 | Topics, create, invite, join, leave, cancel, expiry | Tài, Triết | Two browsers reach `READY`; a third account is refused |
| 3 | Agree, mic check, Ready, countdown | Tài, Triết | No start without both consents; mic requested only after a click |
| 4 | Token, audio, spotlight, clock, mute, reconnect, end | Tài, Triết | Two browsers with simulated mics receive each other's audio |
| 5 | Wrap up, every ending, accessibility, demo video | Triết | The full cycle passes in two browsers |
| 6 | Typing instead of speaking | Tài, Triết | Typed turns reach the partner, survive a reload and are saved |

Typing comes last, so the graded voice flow is finished first.

## Left to the builder

- Seeded motion wording, with at least eight motions across levels.
- Database layout, within the snapshot and rules above.
- How the server detects the time limit and a lost participant.
- Component and file structure inside `web/src/`.
