# Developer guide: run and test the web app

How to start the frontend, run the mock API, demo the microphone check, the live
stage and typed turns, and what is built today. Commands are for PowerShell and
run from `web/` unless a step says otherwise.

## What this branch adds to `pa4`

Branch `feature/SCRUM-xx-typed-turns`. It builds on
`feature/SCRUM-63-fg04-livekit-frontend` (PR #71), so merging it brings both.

| Part | What it adds | Tests |
| --- | --- | --- |
| Live debate stage (SCRUM-63) | Shared 3-second countdown; clock as a progress bar with exact digits; timed-turn phases; speaker spotlight; mute; LiveKit audio with **Try again** when it drops; reload rejoins muted; 60-second wait when the partner drops; **End debate** with confirmation | `room-live.spec.ts`, `room-rules.spec.ts`, `room-audio.spec.ts` |
| Wrap up (SCRUM-63) | **Debate finished** on the stage: how it ended, partner, length; the feedback report is marked "coming in a later release" | `room-wrap.spec.ts` |
| Typed turns | **Type instead** of the microphone test; a **Typed turns** panel (500 characters, plain text, kept after reload); a voice debater can open it with **Type** | `room-type.spec.ts` |
| Mock API | `web/mock-local/`: auth, rooms and typed turns in memory, two accounts | Used by sections 2 to 5 |
| Docs | [API_CONTRACT.md](API_CONTRACT.md) lists every room endpoint the backend must build; auth docs moved to [docs/api/](../docs/api/fg01-auth-contract.md); this guide | |

Nothing here needs a backend change to merge: all room endpoints are still
missing on the server (SCRUM-60, SCRUM-62), so the stage runs against the mock.

## 1. Start the frontend

```powershell
git fetch origin
cd web
npm ci
npm run dev
```

Open `http://localhost:5173`. With no API running you can browse the welcome,
sign-in and register screens, and the **Preview screen** selector at the bottom
(development only) opens every screen with sample data. Signing in needs an API:
the mock (section 2) or the real backend (section 7).

## 2. Run the mock API

The backend has no room endpoints yet, so rooms run only against
`web/mock-local/`, a Vite plugin that fakes auth, rooms and typed turns in
memory. It runs only with the dev server and is never part of `npm run build`.
`npm run dev` can stay running; the mock uses another port:

```powershell
npm run dev -- --config mock-local/vite.mock.config.ts
```

Open `http://localhost:5174`. Accounts: `linh@example.com` and
`sam@example.com`, password `debate-practice`. You can register more.

- **Use two browser windows that do not share cookies**, for example a normal
  window and a private one. Two tabs in the same window become the same user
  after a reload.
- Data lives in memory and resets when the server restarts.
- Mocked: sign in, register, refresh, sign out, profile, the sessions list,
  topics, every room endpoint and typed turns.
- Not mocked: the LiveKit token, so the live stage always says
  "Audio is not connected. Try again". Also revoking a session, account
  deletion and admin.
- Rooms waiting for a partner or for Ready expire after 30 minutes.

## 3. Demo the microphone check

Use `http://localhost`: browsers allow the microphone only on `localhost` or
HTTPS, so the Network URL Vite prints (your LAN IP) will not work from a phone.

1. **Window A** (normal): sign in as Linh, **Create a room**, pick a motion,
   format, length and side, then **Create room**. Click **Copy invite link**.
2. **Window B** (private): sign in as Sam, paste the link, then
   **Take the open seat**. Both windows switch to the agree screen with opposite
   sides.
3. In each window, tick **I agree for this debate**.
4. Click **Test microphone**. The browser asks for the microphone only now,
   never before. Allow it.
5. Say a few words. The meter moves, and after about one second of sound the
   status says **We can hear you**. The test then closes the microphone (the
   browser's mic indicator goes off).
6. **I'm ready** is enabled only after both the tick and the passed test. Click
   it. Click **Not ready yet** to withdraw.
7. When both are ready, the live stage opens (section 4).

| Also try | You should see |
| --- | --- |
| Stay silent for 6 seconds after **Test microphone** | "We can't hear anything yet. Check that the microphone is on, then test again." |
| Block the microphone in the browser prompt | "Your browser is blocking the microphone…", and Ready stays locked |
| Plug in a second microphone | A **Microphone** list to pick from |
| Window B clicks **Leave room** | B sees "You left the room. No audio was shared."; A's seat reopens |
| Window A clicks **Cancel room** on the invite screen, before B joins | The room closes; the code stops working |
| Window A (the creator) clicks **Leave room** on the agree screen | The room closes for both |

## 4. Demo the live stage

Get both windows ready (section 3, or **Type instead** from section 5).

| Do this | You should see |
| --- | --- |
| Both click **I'm ready** | A 3-second countdown in both windows, then the stage |
| Watch the clock | A progress bar and exact digits, the same in both windows |
| Create the room with **Timed turns** | The phase and who holds the turn: Opening, Rebuttal, Cross-talk, Closing (390 seconds in all) |
| **End debate**, then **Keep debating** | The question closes; nothing ends |
| **End debate**, then **End for both of you** | Both see **Debate finished**, "You ended the debate." for the one who ended it |
| Create a 5-minute room and wait | At zero both see "The debate ended when time ran out." |
| On **Debate finished** | Partner and length, "Feedback report: coming in a later release", **Back to home** and **Set up another room** |

Needs LiveKit, so only the automated tests cover it for now: hearing the
partner, **Mute**, the speaking spotlight, connection quality, the 60-second
partner wait, and **Turn on sound** when the browser blocks playback. Run
`npx playwright test tests/room-live.spec.ts tests/room-audio.spec.ts`.

## 5. Demo typed turns

No microphone needed.

1. Windows A and B: create and join a room (section 3, steps 1 and 2).
2. In each window, click **Type instead** under "Check your microphone", tick
   **I agree for this debate**, then click **I'm ready**. The consent list says
   "Anything you type is saved in your transcript and analysed by AI."
3. After the countdown both see the stage with the **Typed turns** panel open
   and no **Mute** button. The badge reads
   "Live · Typed debate · Saved to transcript".
4. Window A: write in **Type your turn**, click **Send**. The box clears, the
   turn appears in A's panel and in the spotlight.
5. Window B: the same turn appears within about 5 seconds (the page asks every
   5 seconds; with real LiveKit it arrives at once).
6. Reload window B: the turns are still there.
7. **End debate**, then **End for both of you**: both see **Debate finished**.

| Also try | You should see |
| --- | --- |
| Choose **Type instead**, then **Use my microphone** | Back to the microphone test; Ready locked until it passes |
| One window types, the other passes the mic test | The typist has the panel open; the speaker opens it with **Type** |
| Paste more than 500 characters | The box stops at 500; the counter shows what is left |
| Type `<b>hi</b>` | Shown as plain text, not bold |
| Stop the mock server, then **Send** | "Your turn was not sent. Try again." and your words stay in the box |

## 6. What is available now

As of 2026-11-26, once this branch is merged into `pa4`:

| Area | Frontend | Backend | How to test |
| --- | --- | --- | --- |
| FG-01 accounts: sign in, register, profile, sessions, sign out, delete, admin suspend | Built | Built (`api/authify`) | Real backend (section 7) |
| FG-01 recovery: forgot, verify, reset password | Off: "Account recovery is not available in this build" | Endpoints exist | Not testable in the UI |
| FG-03 rooms: topics, create, invite code and link, join, full room, leave, cancel, agree, mic check, ready | Built | None yet (SCRUM-60) | Mock API (sections 2 and 3) |
| FG-04 live stage: countdown, clock, end, wrap up | Built | None yet (SCRUM-60) | Mock API (section 4) |
| FG-04 live audio: LiveKit, mute, spotlight, reconnect | Built | No token endpoint yet (SCRUM-62) | Automated tests only |
| Typed turns | Built | None yet | Mock API (section 5) |
| FG-02, FG-05 to FG-10: transcription, feedback, reports and the rest | Not built | Not built | Not available |

More room checks with the mock:

| Check | Expected |
| --- | --- |
| **Join with code**, 4 characters | "Enter the 8-character code from your partner." |
| **Join with code**, 8 wrong characters | "This invite no longer works" |
| A third account uses a full room's code | "This room already has two debaters" |
| Open `#/rooms/<made-up id>` | "This room is not available" with a way home |
| **Copy code** / **Copy invite link** | Copied confirmation |

## 7. Real backend for FG-01 (two terminals)

Run the API from a second worktree, a separate folder on the same repository.
It keeps running while you switch branches in your main folder.

**Create the worktree** (once, from the repository root). `--detach` means
nothing can be committed to `pa4` from it:

```powershell
git fetch origin
git worktree add --detach ..\DebateSpeak-pa4 origin/pa4
```

Update it later with `git fetch origin` then
`git -C ..\DebateSpeak-pa4 checkout --detach origin/pa4`. Remove it with
`git worktree remove ..\DebateSpeak-pa4`.

**Terminal 1, backend:**

```powershell
cd ..\DebateSpeak-pa4
docker compose up -d db
cd api\authify
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/debatespeak"
$env:DATABASE_USERNAME="debatespeak"
$env:DATABASE_PASSWORD="debatespeak_dev_password"
$env:APP_JWT_SECRET="<any random string of 32+ characters>"
# Only for email codes: $env:SPRING_MAIL_USERNAME and $env:SPRING_MAIL_PASSWORD
.\mvnw spring-boot:run
```

Wait for `Started AuthifyApplication`, then open
`http://localhost:8000/api/v1/health`. Needs JDK 17+ (`java -version`).

**Terminal 2, frontend:** add this line to `.env` in your repository root (copy
`.env.example` if there is none; never commit `.env`), then from `web/` run
`npm run dev`:

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Open exactly `http://localhost:5173`; the API rejects other origins with 403.
Restart Vite after editing `.env`, and remove the line to go back to `/api/v1`.
The mock ignores this line.

Seeded accounts: `learner@example.com` and `admin@debatespeak.org`; passwords
are in `api/authify/.../service/AuthService.java`. Registering emails a code, so
without mail settings expect it to fail; use the seeded accounts.

| Check | Expected |
| --- | --- |
| Sign in as the learner; wrong password | Home opens; an error keeps you on Sign in |
| Reload while signed in | Still signed in |
| Profile: change name and level, save, reload | Changes kept |
| Sign in from a private window too, open Active sessions | Two sessions; revoking one asks first |
| Admin: `#/admin/users`, suspend the learner with a reason | Learner cannot sign in; reactivate restores it |
| Delete account (needs the password) | Signed out; the account cannot sign in |
| Sign out | Back to Sign in; reload stays signed out |

## 8. Automated tests

```powershell
npx playwright install chromium
npm run build
npm run lint
npm run test:e2e
```

One file: `npx playwright test tests/room-type.spec.ts` (add `--headed` to
watch). Tests mock all HTTP, the microphone and LiveKit, so no API is needed.
They reuse a dev server already on port 5173.
