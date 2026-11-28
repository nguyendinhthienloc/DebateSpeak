import type { Page } from '@playwright/test';

type Connect = { url: string; token: string; publishMic: boolean; startMuted: boolean; deviceId?: string };

declare global {
  interface Window {
    __audio: {
      connects: Connect[]; disconnects: number; resumed: number; announced: number[]; muted: boolean[];
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
      emit(event) { listeners.forEach(listener => listener(event)); },
    };
    window.__debateAudioFactory = () => ({
      async connect(options: Connect) { window.__audio.connects.push(options); },
      async setMuted(muted: boolean) { window.__audio.muted.push(muted); },
      async resumePlayback() { window.__audio.resumed += 1; },
      async announceTurn(seq: number) { window.__audio.announced.push(seq); },
      async disconnect() { window.__audio.disconnects += 1; },
      subscribe(listener: (event: unknown) => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    });
  });
}
