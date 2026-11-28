# Live audio settings (gear) — design

Date: 2026-11-28. Ticket: SCRUM-63 (FG-04 frontend). Branch: `feature/SCRUM-63-audio-settings` from `pa4`.
Status: built on `feature/SCRUM-63-audio-settings`. Size: small change.

## Why

During a debate, a debater's mic can stop (device disabled in OS sound settings, headset
unplugged). Today nothing on the stage notices: LiveKit either moves to the OS default mic
silently or mutes the track, while the Mute button still says "Mute". The partner hears
silence and the speaker does not know. The gear is the in-debate fallback: see that the mic
stopped, pick another mic or speaker, check it picks up sound, and carry on. The clock keeps
running; no backend change.

Because the gear exists, the lobby mic test becomes a light step instead of a hard gate.

## Approaches

- **A. Pop-up from the dock, bottom sheet on phones (chosen).** Small, next to Mute, closes in one tap.
- B. Second side panel in the Type panel's slot. Rejected: clashes with the Type panel; covers the stage on phones.
- C. Row expanding inside the dock. Rejected: three controls do not fit the dock on phones.

## Design

**Gear button.** In the dock's actions, before End debate: a quiet icon button (lucide
`Settings`), `aria-label="Audio settings"`, `aria-expanded`, enabled once the debate has started.
Shown to typists too (speaker and volume only).

**Panel.** Follows the Type panel pattern in DESIGN.md: White with an Ink edge on the stage.
From 760px it opens above the dock, anchored to the gear; below 760px it is a bottom sheet.
Closes on the close button, Escape, or a click outside; focus returns to the gear. Opening or
closing it never restarts or stops the mic. Contents, top to bottom:

1. **Microphone** (voice users only): `<select>` of audio inputs, current one selected.
   Changing it switches the live track. Under it, the mic meter (the existing segment meter,
   Ink on White) driven by the live published track, with a text status: "We can hear you",
   "No sound yet", or "Microphone stopped". Under it, a **Mute microphone** toggle that
   uses the same state as Mute in the dock (added 2026-11-28 at the user's request).
2. **Speaker**: `<select>` of audio outputs. Shown only where the browser can route output
   (feature-detect `setSinkId`); hidden on Safari.
3. **Partner volume**: native `<input type="range">` 0–100, default 100, labelled with the
   partner's name and the value. Themed for a White surface: Ink 18% track, Ink fill, Yellow
   thumb with a 2px Ink edge, Ink focus ring (as inside the Type panel). Session-only.

**Mic stopped.** When LiveKit mutes our track itself or reports a device error, the stage shows
an alert: "Your microphone stopped. Open audio settings" (the link opens the panel), and the
Mute button flips to Unmute so it tells the truth. Picking a working mic or pressing Unmute
retries; a failure there shows the same alert instead of being swallowed.

**No microphone: pop-up and fall back to type.** A non-modal notice (White, Ink edge,
`role="alert"`, dismissable; the debate and clock carry on behind it) titled "No microphone
found", body "Connect a microphone, or keep going by typing.", actions **Type instead** and
**Dismiss**. It never switches mode by itself.
- Lobby: shown when Test finds no input device (`NotFoundError`), instead of the wrong
  "browser is blocking" message. Type instead = the existing Type instead.
- Stage: shown when the mic stops and no input device is left. Type instead opens the Type
  panel and focuses its text box; no backend change, since a voice debater may already type
  (room-flow design, "Someone using voice can also open Type at any time"). When a mic
  appears again (`devicechange`), the notice gives way to the "Open audio settings" alert.

**Lobby choice carries over.** The mic chosen in the lobby is passed into the debate's connect
(today it is dropped).

**Lobby test, lighter.** For voice, I'm ready needs the mic to be allowed by the browser
(Test pressed and permission granted), not a passed level check. Blocked still stops voice.
Reason: without a permission grant before the start, the browser's permission prompt would
appear when the clock starts, and a denial there cannot be fixed from the gear.

## Architecture

- `src/rooms/debateAudio.ts` stays the only module that touches LiveKit (lazy-loaded). The
  `DebateAudio` interface grows: list devices by kind, switch device by kind, set partner
  volume, expose the local mic track for the meter, and a new `mic` event (live / stopped).
- The stage (`LiveStage.tsx`) owns panel state; the panel is its own component next to
  `TypePanel.tsx`. The meter reads the live track with an analyser; no second `getUserMedia`.
- Test fakes (`tests/helpers/fakeAudio.ts`, `fakeLiveKit.ts`) gain the new methods; every
  existing room test keeps passing.

## Goals / non-goals / anti-goals

- Goals: see a dead mic; switch mic and speaker mid-debate; check the mic; set partner volume;
  carry on by typing when there is no mic.
- Non-goals: pausing the clock; input gain; remembering choices across debates; backend changes.
- Anti-goals: a panel that hides Mute, End or the speaker's name; any mic capture for typists;
  a mic restart just from opening the panel.

## Documents to update after the code (agreed order)

- `docs/superpowers/specs/2026-11-19-room-flow-design.md` §131 and the corrections table (owner: the user).
- `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md` READY→LIVE guard (line 444) and line 1325 (owner to confirm).
- `specs/007-fg04-audio/spec.md` US4 (Khoa).
- `DESIGN.md` Room stage: audio settings panel and slider (owner to confirm).
- `docs/pa4/Changes.md` new row (Tuấn; drafted for him), PDF rebuilt by him.

## Left to the builder

Exact device-list refresh timing (on open and on `devicechange`), meter threshold reuse from
`useMicCheck`, how RoomPage hands the lobby device id to the stage.
