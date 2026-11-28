import type { Page } from '@playwright/test';

type FakeRoom = { emit(event: string, ...args: unknown[]): void };

declare global {
  interface Window {
    __lk: {
      rooms: FakeRoom[]; connected: number; mic: boolean; micEverOn: boolean; open(): void;
      devices: { deviceId: string; label: string; kind: string }[]; switched: [string, string][];
      /** setVolume calls on remote participants, as [identity, volume]. */
      volumes: [string, number][];
    };
  }
}

/** A stand-in for the `livekit-client` module, so the real audio layer in src/rooms/debateAudio.ts runs. */
const fakeModule = `
const lk = window.__lk;
export const ConnectionQuality = { Excellent: 'excellent', Good: 'good', Poor: 'poor', Lost: 'lost' };
export const RoomEvent = new Proxy({}, { get: (_, name) => name });
export const Track = { Kind: { Audio: 'audio' }, Source: { Microphone: 'microphone' } };
export class Room {
  static async getLocalDevices(kind) { return lk.devices.filter(device => device.kind === kind); }
  constructor() {
    this.handlers = {};
    this.remoteParticipants = new Map();
    this.canPlaybackAudio = true;
    this.active = { audioinput: 'default', audiooutput: 'default' };
    this.localParticipant = {
      async setMicrophoneEnabled(on) { lk.mic = on; if (on) lk.micEverOn = true; },
      async publishData() {},
      getTrackPublication() { return undefined; },
    };
    lk.rooms.push(this);
  }
  on(event, handler) { (this.handlers[event] ||= []).push(handler); return this; }
  emit(event, ...args) { (this.handlers[event] || []).forEach(handler => handler(...args)); }
  async connect() { await lk.gate; lk.connected += 1; }
  async disconnect() { lk.mic = false; this.emit('Disconnected'); }
  async startAudio() {}
  getActiveDevice(kind) { return this.active[kind]; }
  async switchActiveDevice(kind, id) { lk.switched.push([kind, id]); this.active[kind] = id; return true; }
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
    const devices = [
      { deviceId: 'mic-1', label: 'Built-in microphone', kind: 'audioinput' }, { deviceId: 'mic-2', label: 'USB headset', kind: 'audioinput' },
      { deviceId: 'spk-1', label: 'Speakers', kind: 'audiooutput' }, { deviceId: 'spk-2', label: 'Headphones', kind: 'audiooutput' },
    ];
    Object.assign(window, { __lk: { rooms: [], connected: 0, mic: false, micEverOn: false, gate, open: () => release(), devices, switched: [], volumes: [] } });
  }, hold);
  await page.route('**/node_modules/.vite/deps/livekit-client.js*', route =>
    route.fulfill({ contentType: 'text/javascript', body: fakeModule }));
}
