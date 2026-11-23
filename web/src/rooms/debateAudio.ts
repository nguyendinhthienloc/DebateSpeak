import type { Participant, RemoteTrack, Room } from 'livekit-client';

/** What the stage hears from the audio layer. Participant identity is the user id. */
export type AudioEvent =
  | { type: 'speakers'; ids: string[] }
  | { type: 'connection'; quality: 'good' | 'poor' | 'lost' }
  | { type: 'partner'; present: boolean; muted: boolean }
  | { type: 'playback-blocked' }
  | { type: 'turn'; seq: number }
  | { type: 'dropped' };

export interface DebateAudio {
  connect(options: { url: string; token: string; publishMic: boolean; startMuted: boolean; deviceId?: string }): Promise<void>;
  setMuted(muted: boolean): Promise<void>;
  resumePlayback(): Promise<void>;
  announceTurn(seq: number): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(listener: (event: AudioEvent) => void): () => void;
}

type LiveKit = typeof import('livekit-client');

/** Wires a LiveKit room to the stage's events. Loaded on demand so LiveKit stays out of the main bundle. */
function wire(kit: LiveKit, emit: (event: AudioEvent) => void): Room {
  const { ConnectionQuality, Room: LiveKitRoom, RoomEvent, Track } = kit;
  const qualities: Partial<Record<string, 'good' | 'poor' | 'lost'>> = {
    [ConnectionQuality.Excellent]: 'good',
    [ConnectionQuality.Good]: 'good',
    [ConnectionQuality.Poor]: 'poor',
    [ConnectionQuality.Lost]: 'lost',
  };
  const room = new LiveKitRoom({ audioCaptureDefaults: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  const partner = (): Participant | undefined => [...room.remoteParticipants.values()][0];
  const partnerState = (present = Boolean(partner())) =>
    emit({ type: 'partner', present, muted: present ? !partner()?.isMicrophoneEnabled : false });

  room
    .on(RoomEvent.ActiveSpeakersChanged, speakers => emit({ type: 'speakers', ids: speakers.map(speaker => speaker.identity) }))
    .on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      const mapped = qualities[quality];
      if (participant.isLocal && mapped) emit({ type: 'connection', quality: mapped });
    })
    .on(RoomEvent.Reconnecting, () => emit({ type: 'connection', quality: 'poor' }))
    .on(RoomEvent.Reconnected, () => emit({ type: 'connection', quality: 'good' }))
    .on(RoomEvent.Disconnected, () => emit({ type: 'dropped' }))
    .on(RoomEvent.ParticipantConnected, () => partnerState(true))
    .on(RoomEvent.ParticipantDisconnected, () => partnerState(false))
    .on(RoomEvent.TrackMuted, () => partnerState())
    .on(RoomEvent.TrackUnmuted, () => partnerState())
    .on(RoomEvent.AudioPlaybackStatusChanged, () => { if (!room.canPlaybackAudio) emit({ type: 'playback-blocked' }); })
    .on(RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
      if (topic !== 'turn') return;
      try {
        const seq = Number(JSON.parse(new TextDecoder().decode(payload)).seq);
        if (Number.isInteger(seq)) emit({ type: 'turn', seq });
      } catch { /* not a turn message */ }
    })
    .on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
      if (track.kind !== Track.Kind.Audio) return;
      const element = track.attach();
      element.dataset.remote = '';
      document.body.append(element);
    })
    .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => track.detach().forEach(element => element.remove()));
  return room;
}

function liveKitAudio(): DebateAudio {
  const listeners = new Set<(event: AudioEvent) => void>();
  let room: Room | undefined;
  let publishing = false;
  let muted = false;
  let closed = false;
  // After our own disconnect, LiveKit's events are not news.
  const emit = (event: AudioEvent) => { if (!closed) listeners.forEach(listener => listener(event)); };

  return {
    async connect({ url, token, publishMic, startMuted, deviceId }) {
      muted = startMuted;
      const kit = await import('livekit-client');
      if (closed) return;
      room = wire(kit, emit);
      await room.connect(url, token);
      if (closed) { await room.disconnect(true); return; }
      publishing = publishMic;
      // Mute may have been pressed while connecting.
      if (publishMic && !muted) await room.localParticipant.setMicrophoneEnabled(true, deviceId ? { deviceId } : undefined);
      if (room.remoteParticipants.size > 0) emit({ type: 'partner', present: true, muted: ![...room.remoteParticipants.values()][0].isMicrophoneEnabled });
      if (!room.canPlaybackAudio) emit({ type: 'playback-blocked' });
    },
    async setMuted(next) {
      muted = next;
      if (room && publishing) await room.localParticipant.setMicrophoneEnabled(!next);
    },
    async resumePlayback() {
      await room?.startAudio();
    },
    async announceTurn(seq) {
      await room?.localParticipant.publishData(new TextEncoder().encode(JSON.stringify({ seq })), { reliable: true, topic: 'turn' });
    },
    async disconnect() {
      closed = true;
      await room?.disconnect(true);
      document.querySelectorAll('audio[data-remote]').forEach(element => element.remove());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

/** LiveKit audio for a debate. In development, tests may swap in a recorder through `window.__debateAudioFactory`. */
export function createDebateAudio(): DebateAudio {
  if (import.meta.env.DEV) {
    const factory = (window as { __debateAudioFactory?: () => DebateAudio }).__debateAudioFactory;
    if (factory) return factory();
  }
  return liveKitAudio();
}
