# Developer guide: run and test the web app

How to start the frontend, add the mock room API, demo the microphone check and
typed turns, and what is built today. Sections 1 to 3 work on `pa4`; section 4
needs the typed-turns branch. Commands are for PowerShell and run from `web/`
unless a step says otherwise.

## 1. Start the frontend

Check out `pa4` (or your feature branch made from it), then:

```powershell
git fetch origin
cd web
npm ci
npm run dev
```

Open `http://localhost:5173`. With no API running you can browse the welcome,
sign-in and register screens, and the **Preview screen** selector at the bottom
(development only) opens every screen with sample data. Signing in needs an API:
the mock (section 2) or the real backend (section 6).

## 2. Apply the mock room API

The backend has no room endpoints yet, so rooms run only against
`web/mock-local/`, a Vite plugin that fakes auth and the room API in memory. It
runs only with the dev server and is never part of `npm run build`.

The folder arrives with the typed-turns branch. On plain `pa4`, once that
branch is pushed, copy it from there without staging it (from `web/`):

```powershell
git restore --source origin/feature/SCRUM-xx-typed-turns --worktree -- mock-local
```

1. **Run it.** `npm run dev` can stay running; the mock uses another port:

   ```powershell
   npm run dev -- --config mock-local/vite.mock.config.ts
   ```

2. Open `http://localhost:5174`. Accounts: `linh@example.com` and
   `sam@example.com`, password `debate-practice`. You can register more.

Notes:

- **Use two browser windows that do not share cookies**, for example a normal
  window and a private one. Two tabs in the same window become the same user
  after a reload.
- Data lives in memory and resets when the server restarts.
- Mocked: sign in, register, refresh, sign out, profile, the sessions list,
  topics, every room endpoint, and typed turns. Not mocked: the LiveKit token
  (the live stage says "Audio is not connected"), revoking a session, account
  deletion, admin.
- Rooms waiting for a partner or for Ready expire after 30 minutes.

## 3. Demo the microphone check

Run the mock (section 2). Use `http://localhost`: browsers allow the microphone
only on `localhost` or HTTPS, so the Network URL Vite prints (your LAN IP) will
not work from a phone.

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
7. When both are ready, the room goes live. On `pa4` the page then shows only
   the motion: the live stage is not merged yet (see section 5).

Also try:

| Do this | You should see |
| --- | --- |
| Stay silent for 6 seconds after **Test microphone** | "We can't hear anything yet. Check that the microphone is on, then test again." |
| Block the microphone in the browser prompt | "Your browser is blocking the microphone…", and Ready stays locked |
| Plug in a second microphone | A **Microphone** list to pick from |
| Window B clicks **Leave room** | B sees "You left the room. No audio was shared."; A's seat reopens |
| Window A clicks **Cancel room** on the invite screen, before B joins | The room closes; the code stops working |
| Window A (the creator) clicks **Leave room** on the agree screen | The room closes for both |

## 4. Demo typed turns (typed-turns branch)

Branch `feature/SCRUM-xx-typed-turns`. It builds on the live stage from
`feature/SCRUM-63-fg04-livekit-frontend`, so it also shows the countdown, clock,
end and wrap up. Run the mock (section 2) and use two windows as in section 3.
No microphone is needed.

1. Windows A and B: create and join a room (section 3, steps 1 and 2).
2. In each window, click **Type instead** under "Check your microphone", tick
   **I agree for this debate**, then click **I'm ready**. The consent list now
   says "Anything you type is saved in your transcript and analysed by AI."
3. After a 3-second countdown both see the live stage with the **Typed turns**
   panel open and no **Mute** button. The badge reads
   "Live · Typed debate · Saved to transcript".
4. Window A: write in **Type your turn**, click **Send**. The box clears, the
   turn appears in A's panel and in the spotlight.
5. Window B: the same turn appears within about 5 seconds (the page asks every
   5 seconds; with real LiveKit it would arrive at once).
6. Reload window B: the turns are still there, and B rejoins the debate.
7. **End debate**, then **End for both of you**: both see **Debate finished**.

"Audio is not connected. Try again" stays on screen: the mock issues no
LiveKit token. Typed turns do not need it.

| Also try | You should see |
| --- | --- |
| Choose **Type instead**, then **Use my microphone** | Back to the microphone test; Ready locked until it passes |
| One window types, the other passes the mic test | The typist has the panel open; the speaker opens it with **Type** |
| Paste more than 500 characters | The box stops at 500; the counter shows what is left |
| Type `<b>hi</b>` | Shown as plain text, not bold |
| Stop the mock server, then **Send** | "Your turn was not sent. Try again." and your words stay in the box |

Automated: `npx playwright test tests/room-type.spec.ts`.

## 5. What is available now

As of 2026-11-26:

| Area | Frontend | Backend | How to test |
| --- | --- | --- | --- |
| FG-01 accounts: sign in, register, profile, sessions, sign out, delete, admin suspend | On `pa4` | On `pa4` (`api/authify`) | Real backend (section 6) |
| FG-01 recovery: forgot, verify, reset password | Off: "Account recovery is not available in this build" | Endpoints exist | Not testable in the UI |
| FG-03 rooms: topics, create, invite code and link, join, full room, leave, cancel, agree, mic check, ready | On `pa4` | None yet (SCRUM-60) | Mock API (sections 2 and 3) |
| FG-04 live stage: countdown, clock, LiveKit audio, mute, end, wrap up | Branch `feature/SCRUM-63-fg04-livekit-frontend`, not merged | None yet (SCRUM-62) | Mock API without audio; tests for audio |
| Typed turns ("Type instead") | Branch `feature/SCRUM-xx-typed-turns`, not merged | None yet | Mock API (section 4) |
| FG-02, FG-05 to FG-10: transcription, feedback, reports and the rest | Not built | Not built | Not available |

Room checks to click through with the mock:

| Check | Expected |
| --- | --- |
| **Join with code**, 4 characters | "Enter the 8-character code from your partner." |
| **Join with code**, 8 wrong characters | "This invite no longer works" |
| A third account uses a full room's code | "This room already has two debaters" |
| Open `#/rooms/<made-up id>` | "This room is not available" with a way home |
| **Copy code** / **Copy invite link** | Copied confirmation |

## 6. Real backend for FG-01 (two terminals)

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
Restart Vite after editing `.env`, and remove the line to go back to the mock.

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

## 7. Automated tests

```powershell
npx playwright install chromium
npm run build
npm run lint
npm run test:e2e
```

One file: `npx playwright test tests/room-agree.spec.ts` (add `--headed` to
watch). Tests mock all HTTP, the microphone and LiveKit, so no API is needed.
They reuse a dev server already on port 5173.
