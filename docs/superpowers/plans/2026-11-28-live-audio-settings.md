# Live Audio Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A gear on the live stage opens an audio panel (mic picker with meter, speaker picker, partner volume) and the stage tells the debater when their mic stops; the lobby mic test becomes a light step.

**Architecture:** `src/rooms/debateAudio.ts` stays the only LiveKit module and grows a small device/volume API plus a `mic` event. A new `AudioPanel.tsx` beside `TypePanel.tsx` renders the controls; `LiveStage.tsx` owns open/close, volume and mic-stopped state. The lobby passes its chosen mic through `RoomPage.tsx`.

**Tech Stack:** Vite + React + TypeScript, livekit-client 2.x (lazy-loaded), lucide-react, Playwright e2e.

**Spec:** `docs/superpowers/specs/2026-11-28-live-audio-settings-design.md`

## Global Constraints

- Branch `feature/SCRUM-63-audio-settings`; one commit per task; stop for the user after each task. No push unless asked. No AI credit lines in commits.
- Only `debateAudio.ts` imports `livekit-client`; everything else uses the `DebateAudio` interface.
- No `getUserMedia` on the live stage outside LiveKit; never any mic capture for typists (`input === 'TYPE'`).
- Opening or closing the panel never calls `setMuted`, `switchDevice` or restarts the mic.
- The clock is untouched. No backend or API change.
- No-mic notice copy: title "No microphone found", body "Connect a microphone, or keep going by typing.", actions "Type instead" and "Dismiss". Non-modal, `role="alert"`, never switches mode by itself.
- Panel copy: heading "Audio settings"; labels "Microphone", "Speaker", "<partner name>'s volume"; meter status "We can hear you" / "No sound yet" / "Microphone stopped"; alert "Your microphone stopped." + link "Open audio settings".
- Every existing Playwright test keeps passing; `npm run lint` and `npm run build` stay clean (run from `web/`).

## Review Focus

- Pressing Mute must never raise the "microphone stopped" alert (LiveKit reports our own mute as `TrackMuted` too). Pinned in Task 3.
- Unmute after the device is gone rejects; the alert must show instead of an unhandled rejection. Pinned in Task 3.
- A partner who drops and rejoins must come back at the chosen volume, not 100%. Pinned in Task 5.
- Typists open the gear and get no mic picker and no mic request. Pinned in Task 2.
- Browsers without `setSinkId` (Safari) show no Speaker picker. Pinned in Task 2.

---

### Task 1: Lighter lobby test, no-mic notice, and the lobby mic carried into the debate

**Files:**
- Create: `web/src/pages/rooms/NoMicNotice.tsx`
- Modify: `web/src/rooms/useMicCheck.ts`, `web/src/pages/rooms/AgreeView.tsx`, `web/src/pages/rooms/RoomPage.tsx`, `web/src/pages/rooms/LiveStage.tsx` (connect call, line 114), `web/src/pages/rooms/rooms.css`
- Test: `web/tests/room-agree.spec.ts`, `web/tests/helpers/rooms.ts`

**Interfaces:**
- Produces: `NoMicNotice({ onType, onDismiss }: { onType: () => void; onDismiss: () => void })` — the notice from Global Constraints; class `no-mic-notice`, White with Ink edge, fixed near the top of the viewport, centred, `max-width: min(28rem, 100% - 32px)`; reused on the stage in Task 4. `MicStatus` adds `'missing'` (getUserMedia `NotFoundError` or `OverconstrainedError`). `fakeMic` option `missing?: boolean` (throws `NotFoundError`).
- Produces: `useMicCheck()` also returns `allowed: boolean` (true once `getUserMedia` succeeded in this view; stays true across `selectDevice`, `stop`). `AgreeView` prop `onMicChoice: (deviceId?: string) => void`, called with `mic.deviceId` when Ready is sent as VOICE. `LiveStage` prop `deviceId?: string`, passed to `instance.connect({ ..., deviceId })`. `fakeMic` option `devices?: string[]` (labels; ids `mic-1`, `mic-2`, …). `openReadyRoom` also returns `set(room)`.

- [ ] **Step 1: Write the failing tests** in `room-agree.spec.ts`
  - `Ready unlocks once the mic is allowed, before it hears speech`: `fakeMic({ signal: false })`, tick consent, click Test microphone → `I'm ready` enabled while status text is "Say a few words…".
  - Update `background noise alone does not pass the mic test`: keep the "We can't hear anything yet." assertion; `I'm ready` is now **enabled**.
  - Keep `a blocked mic explains recovery and keeps Ready locked` unchanged (must still pass).
  - `no microphone pops up a notice that offers typing`: `fakeMic({ signal: false, missing: true })`, Test → alert "No microphone found" visible, no "browser is blocking" text, `I'm ready` disabled; click "Type instead" → notice gone and "You will type your turns in this debate." visible. Second case: Dismiss → notice gone, still in voice mode.
  - `the mic chosen in the lobby is used in the debate`: `installFakeAudio`, `fakeMic({ signal: true, devices: ['Built-in microphone', 'USB headset'] })`, open READY room, Test, select "USB headset", tick, Ready; then `set()` a LIVE snapshot with `started_at` 1 s in the past, `server_now` now, and mock `/token` → `window.__audio.connects[0].deviceId === 'mic-2'`.
- [ ] **Step 2: Run** `npx playwright test tests/room-agree.spec.ts` → new/updated tests FAIL.
- [ ] **Step 3: Implement.** `canBeReady = agreed && (typeInstead || mic.allowed)`; `ready()` for voice calls `mic.stop()` then sends. Ready hint (not ready): "Tick the box and test your microphone, or choose Type instead." `RoomPage` keeps `const [micId, setMicId] = useState<string>()` and wires both props.
- [ ] **Step 4: Run** `npx playwright test tests/room-agree.spec.ts tests/room-session.spec.ts tests/room-audio.spec.ts` → PASS; `npm run lint` → clean.
- [ ] **Step 5: Commit** `feat(web): lighter mic test; use the lobby mic in the debate`

### Task 2: Gear and audio panel with mic and speaker pickers

**Files:**
- Create: `web/src/pages/rooms/AudioPanel.tsx`, `web/tests/room-audio-settings.spec.ts`
- Modify: `web/src/rooms/debateAudio.ts`, `web/src/pages/rooms/LiveStage.tsx`, `web/src/pages/rooms/stage.css`, `web/tests/helpers/fakeAudio.ts`, `web/tests/helpers/fakeLiveKit.ts`

**Interfaces:**
- Produces in `debateAudio.ts`:
  ```ts
  export type DeviceKind = 'audioinput' | 'audiooutput';
  export interface AudioDevice { id: string; label: string }
  export function canChooseSpeaker(): boolean; // 'setSinkId' in HTMLMediaElement.prototype
  // added to DebateAudio:
  listDevices(kind: DeviceKind): Promise<AudioDevice[]>;   // [] before connect
  activeDevice(kind: DeviceKind): string | undefined;      // input: live track's getSettings().deviceId, else LiveKit's active device
  switchDevice(kind: DeviceKind, id: string): Promise<void>; // rejects if LiveKit returns false/throws
  ```
  `listDevices` uses `Room.getLocalDevices(kind, false)` (no permission prompt). After a successful `audioinput` switch, if the user has not muted, call `setMicrophoneEnabled(true, { deviceId: id })` so a stopped mic comes back.
- Produces `AudioPanel({ audio, publishMic, onClose, children }: { audio: DebateAudio; publishMic: boolean; onClose: () => void; children?: ReactNode })` — `children` is where Tasks 4–5 add the meter and slider.
- Fakes: `window.__audio` gains `switched: [DeviceKind, string][]`, `devices: Record<DeviceKind, AudioDevice[]>` (default two inputs `mic-1` "Built-in microphone", `mic-2` "USB headset"; two outputs `spk-1` "Speakers", `spk-2` "Headphones"), `active: Record<DeviceKind, string>`, `failSwitch: boolean`. `fakeLiveKit` gains static `Room.getLocalDevices`, `room.switchActiveDevice` (records on `lk.switched`, returns true), `room.getActiveDevice`.

- [ ] **Step 1: Write the failing tests** in `room-audio-settings.spec.ts` (use `openLiveRoom`):
  - `the gear opens audio settings and closes back to the gear`: button `Audio settings` enabled after start; click → region "Audio settings" visible, `aria-expanded="true"`; Escape closes and focus is on the gear; `__audio.muted` and `__audio.switched` are both empty.
  - `choosing another microphone switches the live mic`: select "USB headset" under "Microphone" → `__audio.switched` equals `[['audioinput', 'mic-2']]`.
  - `choosing a speaker routes the partner's voice`: select "Headphones" → `[['audiooutput', 'spk-2']]`.
  - `a failed switch says so`: `failSwitch = true`, pick a mic → alert inside the panel "That device could not be used. Pick another one."
  - `typists get no microphone picker`: `myInput: 'TYPE'`, `fakeMic` installed → open panel, no "Microphone" combobox, `__mic.requests === 0`.
  - `no speaker picker where the browser cannot route sound`: init script deletes `HTMLMediaElement.prototype.setSinkId` → no "Speaker" combobox.
  - In `room-audio.spec.ts`: `the real audio layer switches the mic through LiveKit` (fakeLiveKit) → `lk.switched` has `['audioinput','mic-2']`.
- [ ] **Step 2: Run** `npx playwright test tests/room-audio-settings.spec.ts tests/room-audio.spec.ts` → FAIL.
- [ ] **Step 3: Implement.**
  - Gear: in `dock-actions` before End debate, `<button className="action stage-quiet stage-gear" aria-label="Audio settings" aria-expanded aria-controls="audio-panel" disabled={!started}>` with lucide `Settings` (20px, `aria-hidden`). Keep a ref to return focus on close.
  - Panel: `<section id="audio-panel" className="audio-panel" aria-labelledby=…>` heading "Audio settings" and a Close button (same look as `type-close`). Loads devices on mount and on `navigator.mediaDevices` `devicechange`; selects reflect `activeDevice`. Closes on Escape and pointerdown outside panel and gear.
  - CSS (`stage.css`): `.stage-dock { position: relative }`. From 760px the panel is `position: absolute; right: 0; bottom: calc(100% + 8px); width: min(22rem, 100%)`; below 760px a fixed bottom sheet like `.type-panel`. White surface, Ink text, `:focus-visible` Ink, dark-stage drop `0 2px 4px rgb(0 0 0 / .3), 0 40px 80px -30px rgb(0 0 0 / .8)`. `.stage-gear` is a 44×44px target and keeps that width under 560px.
- [ ] **Step 4: Run** `npx playwright test tests/room-*.spec.ts` → PASS; `npm run lint && npm run build` → clean.
- [ ] **Step 5: Commit** `feat(web): audio settings gear on the live stage`

### Task 3: Tell the debater when their mic stops

**Files:**
- Modify: `web/src/rooms/debateAudio.ts`, `web/src/pages/rooms/LiveStage.tsx`, `web/tests/helpers/fakeAudio.ts`, `web/tests/helpers/fakeLiveKit.ts`
- Test: `web/tests/room-audio-settings.spec.ts`, `web/tests/room-audio.spec.ts`

**Interfaces:**
- Produces: `AudioEvent` adds `{ type: 'mic'; state: 'live' | 'stopped' }`. `wire(kit, emit, userMuted: () => boolean)`: `TrackMuted` for the local microphone while `!userMuted()` → `stopped`; `TrackUnmuted` for the local microphone → `live`; `MediaDevicesError` with kind `audioinput` → `stopped`. `setMuted` keeps rejecting on failure. Fake recorder gains `failUnmute: boolean` (its `setMuted(false)` rejects when set).

- [ ] **Step 1: Write the failing tests**
  - `a stopped mic shows an alert and the true mute state`: `__audio.emit({ type: 'mic', state: 'stopped' })` → alert "Your microphone stopped." with button "Open audio settings"; dock button reads "Unmute"; clicking the link opens the panel.
  - `the alert clears when the mic is live again`: then emit `live` → alert gone.
  - `a failed unmute shows the alert`: `failUnmute = true`, Mute, Unmute → alert visible, button reads "Unmute", no page error (`page.on('pageerror')` count 0).
  - In `room-audio.spec.ts` with fakeLiveKit: `LiveKit muting the mic on its own raises the alert` — emit `TrackMuted` with `{ source: 'microphone' }, { isLocal: true }` → alert; `pressing Mute does not raise the alert` — click Mute, then emit the same `TrackMuted` → no alert.
- [ ] **Step 2: Run** `npx playwright test tests/room-audio-settings.spec.ts tests/room-audio.spec.ts` → new tests FAIL.
- [ ] **Step 3: Implement.** LiveStage: `micStopped` state; on `stopped` set it and `setMuted(true)` (UI only, no `audio.setMuted`); on `live` clear it and `setMuted(false)`. `toggleMute` catches the rejection → `micStopped = true`, `muted = true`. Alert lives in `stage-notes`, `role="alert"`, link styled `stage-link`.
- [ ] **Step 4: Run** `npx playwright test tests/room-*.spec.ts` → PASS; lint and build clean.
- [ ] **Step 5: Commit** `feat(web): say when the microphone stops during a debate`

### Task 4: No mic on the stage: notice and fall back to typing

**Files:**
- Modify: `web/src/pages/rooms/LiveStage.tsx`, `web/src/pages/rooms/TypePanel.tsx` (accept `autoFocus?: boolean` for its textarea)
- Test: `web/tests/room-audio-settings.spec.ts`

**Interfaces:**
- Consumes: `NoMicNotice` (Task 1), `mic` event and `micStopped` (Task 3), `listDevices('audioinput')` (Task 2).
- Produces: LiveStage `noMic` state = `micStopped && inputs.length === 0`, rechecked on each `stopped` event and on `navigator.mediaDevices` `devicechange`. While `noMic`, the notice replaces the "Your microphone stopped." alert; Dismiss hides it until the next `stopped` event.

- [ ] **Step 1: Write the failing tests**
  - `with no microphone left, the stage offers typing`: `__audio.devices.audioinput = []`, emit `mic stopped` → alert "No microphone found"; click "Type instead" → Type panel open, its text box focused, notice gone; no `setMuted` or token calls added.
  - `the notice gives way when a mic is plugged back in`: then set inputs back to one device and dispatch `devicechange` on `navigator.mediaDevices` → notice gone, "Your microphone stopped." alert with "Open audio settings" shown.
  - `a stopped mic with another mic available shows only the settings alert`: default devices, emit `stopped` → no "No microphone found".
- [ ] **Step 2: Run** `npx playwright test tests/room-audio-settings.spec.ts` → FAIL.
- [ ] **Step 3: Implement** as in Interfaces; Type instead calls `setPanelOpen(true)` with focus on the text box.
- [ ] **Step 4: Run** `npx playwright test tests/room-*.spec.ts` → PASS; lint and build clean.
- [ ] **Step 5: Commit** `feat(web): offer typing when no microphone is left`

### Task 5: Mic meter in the panel

**Files:**
- Create: `web/src/rooms/useTrackLevel.ts`
- Modify: `web/src/rooms/debateAudio.ts`, `web/src/rooms/useMicCheck.ts` (export `threshold` as `speechThreshold`), `web/src/pages/rooms/AudioPanel.tsx`, `web/src/pages/rooms/LiveStage.tsx`, `web/tests/helpers/fakeAudio.ts`, `web/tests/helpers/fakeLiveKit.ts`
- Test: `web/tests/room-audio-settings.spec.ts`

**Interfaces:**
- Produces: `DebateAudio.micTrack(): MediaStreamTrack | undefined` (local microphone publication's `mediaStreamTrack`). `useTrackLevel(track?: MediaStreamTrack): { level: number; heard: boolean }` — analyser over `new MediaStream([track])`, RMS clamped 0–1, `heard` true if level exceeded `speechThreshold` in the last 1500 ms; closes its `AudioContext` on unmount/track change; never calls `getUserMedia` and never stops the track. `AudioPanel` gains `stopped: boolean`. Fake recorder gains `micTone: number | 0` (builds a tone track via `AudioContext` when non-zero; `micTrack()` returns it).

- [ ] **Step 1: Write the failing tests**
  - `the meter hears the live mic`: `micTone = 0.5` → open panel → status "We can hear you", at least one `.mic-meter span.on`; `__mic.requests === 0` (with `fakeMic` installed).
  - `the meter says when there is no sound`: `micTone = 0` → "No sound yet".
  - `the meter says when the mic stopped`: emit `mic stopped` → "Microphone stopped".
  - Closing the panel leaves the tone track `readyState === 'live'`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** Meter reuses `.mic-meter` markup from AgreeView (10 segments, same `min(1, level * 3)` scale), `aria-hidden`, with the status as `role="status"` text. Voice users only.
- [ ] **Step 4: Run** `npx playwright test tests/room-*.spec.ts` → PASS; lint and build clean.
- [ ] **Step 5: Commit** `feat(web): live mic meter in audio settings`

### Task 6: Partner volume slider

**Files:**
- Modify: `web/src/rooms/debateAudio.ts`, `web/src/pages/rooms/AudioPanel.tsx`, `web/src/pages/rooms/LiveStage.tsx`, `web/src/pages/rooms/stage.css`, `web/tests/helpers/fakeAudio.ts`, `web/tests/helpers/fakeLiveKit.ts`
- Test: `web/tests/room-audio-settings.spec.ts`, `web/tests/room-audio.spec.ts`

**Interfaces:**
- Produces: `DebateAudio.setPartnerVolume(volume: number): void` (0–1; stored, applied to the current remote participant via `setVolume`, and re-applied on every `TrackSubscribed`). LiveStage keeps `volume` (0–100, default 100) so it survives closing the panel. Fake recorder records `volumes: number[]`.

- [ ] **Step 1: Write the failing tests**
  - `the partner volume slider sets their volume`: slider labelled "Sam's volume" starts at 100; fill to 40 → `__audio.volumes` ends with `0.4`; value text "40%"; close and reopen → still 40.
  - In `room-audio.spec.ts` (fakeLiveKit): `the partner comes back at the chosen volume` — set 40, emit `TrackSubscribed` for a new remote participant's audio track → that participant's `setVolume` called with `0.4`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** Native `<input type="range" min=0 max=100 step=5>` with `--fill: <value>%`. CSS: track 6px, radius 999px, `linear-gradient(var(--ink) 0 var(--fill), rgb(28 32 30 / .18) var(--fill))` on `::-webkit-slider-runnable-track`; `::-moz-range-track` Ink 18% and `::-moz-range-progress` Ink; thumb 20px circle `var(--accent)` with `2px solid var(--ink)` on both engines; `:focus-visible` Ink outline. Value shown as text next to the label.
- [ ] **Step 4: Run** `npx playwright test` (full suite) → PASS; lint and build clean. Check the panel by eye at 1280px and 375px in both voice and type modes.
- [ ] **Step 5: Commit** `feat(web): partner volume slider in audio settings`

### Task 7: Documents after the code

**Files:**
- Modify: `docs/superpowers/specs/2026-11-19-room-flow-design.md` (line 131 and the corrections table), `docs/superpowers/specs/2026-11-28-live-audio-settings-design.md` (status → built)

- [ ] **Step 1:** Room-flow design: I'm ready unlocks when the box is ticked and the mic is allowed (or Type instead); add a corrections row "Mic test | Must pass before Ready | Must be allowed; the live audio settings are the fallback".
- [ ] **Step 2:** Draft, in chat, the text for documents owned by others: a `docs/pa4/Changes.md` row for Tuấn; the READY→LIVE guard wording for `SOFTWARE_ARCHITECTURE_SPEC.md` (lines 444, 1325); a US4 note for Khoa's `specs/007-fg04-audio/spec.md`; an "Audio settings" entry for DESIGN.md Room stage. Do not edit those files.
- [ ] **Step 3: Commit** `docs: lighter mic test and live audio settings`
