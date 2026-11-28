import type { Page } from '@playwright/test';

type Connect = { url: string; token: string; publishMic: boolean; startMuted: boolean; deviceId?: string };
type Kind = 'audioinput' | 'audiooutput';
type Device = { id: string; label: string };

declare global {
  interface Window {
    __audio: {
      connects: Connect[]; disconnects: number; resumed: number; announced: number[]; muted: boolean[];
      devices: Record<Kind, Device[]>; active: Record<Kind, string>; switched: [Kind, string][]; failSwitch: boolean; failUnmute: boolean;
      /** Peak volume of the fake live mic (0 is silence); `track` is that mic once the stage asked for it. */
      micTone: number; track?: MediaStreamTrack;
      emit(event: unknown): void;
    };
    __debateAudioFactory?: () => unknown;
  }
}

/** Replaces LiveKit with a recorder. Tests drive audio events through `window.__audio.emit(event)`. */
export async function installFakeAudio(page: Page) {
  await page.addInitScript(() => {
    const listeners = new Set<(event: unknown) => void>();
    window.__audio = {
      connects: [], disconnects: 0, resumed: 0, announced: [], muted: [],
      devices: {
        audioinput: [{ id: 'mic-1', label: 'Built-in microphone' }, { id: 'mic-2', label: 'USB headset' }],
        audiooutput: [{ id: 'spk-1', label: 'Speakers' }, { id: 'spk-2', label: 'Headphones' }],
      },
      active: { audioinput: 'mic-1', audiooutput: 'spk-1' }, switched: [], failSwitch: false, failUnmute: false, micTone: 0,
      emit(event) { listeners.forEach(listener => listener(event)); },
    };
    window.__debateAudioFactory = () => ({
      async connect(options: Connect) { window.__audio.connects.push(options); },
      async setMuted(muted: boolean) {
        window.__audio.muted.push(muted);
        if (!muted && window.__audio.failUnmute) throw new Error('no microphone');
      },
      async resumePlayback() { window.__audio.resumed += 1; },
      async announceTurn(seq: number) { window.__audio.announced.push(seq); },
      async disconnect() { window.__audio.disconnects += 1; },
      micTrack() {
        if (!window.__audio.track) {
          const context = new AudioContext();
          const output = context.createMediaStreamDestination();
          if (window.__audio.micTone) {
            const tone = context.createOscillator();
            const gain = context.createGain();
            gain.gain.value = window.__audio.micTone;
            tone.connect(gain).connect(output);
            tone.start();
          }
          window.__audio.track = output.stream.getAudioTracks()[0];
        }
        return window.__audio.track;
      },
      async listDevices(kind: Kind) { return window.__audio.devices[kind]; },
      activeDevice(kind: Kind) { return window.__audio.active[kind]; },
      async switchDevice(kind: Kind, id: string) {
        if (window.__audio.failSwitch) throw new Error('device failed');
        window.__audio.switched.push([kind, id]);
        window.__audio.active[kind] = id;
      },
      subscribe(listener: (event: unknown) => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    });
  });
}
