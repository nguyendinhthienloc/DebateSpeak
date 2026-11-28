import type { Page } from '@playwright/test';

type FakeRoom = { emit(event: string, ...args: unknown[]): void };

declare global {
  interface Window {
    __lk: { rooms: FakeRoom[]; connected: number; mic: boolean; micEverOn: boolean; open(): void };
  }
}

/** A stand-in for the `livekit-client` module, so the real audio layer in src/rooms/debateAudio.ts runs. */
const fakeModule = `
const lk = window.__lk;
export const ConnectionQuality = { Excellent: 'excellent', Good: 'good', Poor: 'poor', Lost: 'lost' };
export const RoomEvent = new Proxy({}, { get: (_, name) => name });
export const Track = { Kind: { Audio: 'audio' } };
export class Room {
  constructor() {
    this.handlers = {};
    this.remoteParticipants = new Map();
    this.canPlaybackAudio = true;
    this.localParticipant = {
      async setMicrophoneEnabled(on) { lk.mic = on; if (on) lk.micEverOn = true; },
      async publishData() {},
    };
    lk.rooms.push(this);
  }
  on(event, handler) { (this.handlers[event] ||= []).push(handler); return this; }
  emit(event, ...args) { (this.handlers[event] || []).forEach(handler => handler(...args)); }
  async connect() { await lk.gate; lk.connected += 1; }
  async disconnect() { lk.mic = false; this.emit('Disconnected'); }
  async startAudio() {}
}
`;

/**
 * Serves the fake module in place of Vite's pre-bundled livekit-client. With `hold`, LiveKit's connect waits
 * until the test calls `window.__lk.open()`.
 */
export async function installFakeLiveKit(page: Page, { hold = false } = {}) {
  await page.addInitScript(holdConnect => {
    let release = () => {};
    const gate = holdConnect ? new Promise<void>(resolve => { release = resolve; }) : Promise.resolve();
    Object.assign(window, { __lk: { rooms: [], connected: 0, mic: false, micEverOn: false, gate, open: () => release() } });
  }, hold);
  await page.route('**/node_modules/.vite/deps/livekit-client.js*', route =>
    route.fulfill({ contentType: 'text/javascript', body: fakeModule }));
}
