import type { Participant, RemoteTrack, Room } from 'livekit-client';

/** What the stage hears from the audio layer. Participant identity is the user id. */
export type AudioEvent =
  | { type: 'speakers'; ids: string[] }
  | { type: 'connection'; quality: 'good' | 'poor' | 'lost' }
  | { type: 'partner'; present: boolean; muted: boolean }
  | { type: 'playback-blocked' }
  | { type: 'turn'; seq: number }
  | { type: 'dropped' }
  /** Our own mic: `stopped` when LiveKit or the device stopped it without the debater pressing Mute. */
  | { type: 'mic'; state: 'live' | 'stopped' };

export type DeviceKind = 'audioinput' | 'audiooutput';
export interface AudioDevice { id: string; label: string }

/** Whether this browser can send the partner's voice to a chosen speaker (not Safari). */
export function canChooseSpeaker(): boolean {
  return typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype;
}

export interface DebateAudio {
  connect(options: { url: string; token: string; publishMic: boolean; startMuted: boolean; deviceId?: string }): Promise<void>;
  setMuted(muted: boolean): Promise<void>;
  resumePlayback(): Promise<void>;
  announceTurn(seq: number): Promise<void>;
  disconnect(): Promise<void>;
  /** Devices of one kind, without asking for permission. */
  listDevices(kind: DeviceKind): Promise<AudioDevice[]>;
  activeDevice(kind: DeviceKind): string | undefined;
  /** Rejects when the device cannot be used. */
  switchDevice(kind: DeviceKind, id: string): Promise<void>;
  /** The published microphone track, for a level meter. Never stop it. */
  micTrack(): MediaStreamTrack | undefined;
  /** The partner's loudness, 0 to 1. Kept for this debate and applied again when they rejoin. */
  setPartnerVolume(volume: number): void;
  subscribe(listener: (event: AudioEvent) => void): () => void;
}

type LiveKit = typeof import('livekit-client');

/** Wires a LiveKit room to the stage's events. Loaded on demand so LiveKit stays out of the main bundle. */
function wire(kit: LiveKit, emit: (event: AudioEvent) => void, userMuted: () => boolean, volume: () => number): Room {
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
    // LiveKit reports our own mic here too, including when it mutes a track whose device went away.
    .on(RoomEvent.TrackMuted, (publication, participant) => {
      if (!participant.isLocal) partnerState();
      else if (publication.source === Track.Source.Microphone && !userMuted()) emit({ type: 'mic', state: 'stopped' });
    })
    .on(RoomEvent.TrackUnmuted, (publication, participant) => {
      if (!participant.isLocal) partnerState();
      else if (publication.source === Track.Source.Microphone) emit({ type: 'mic', state: 'live' });
    })
    .on(RoomEvent.MediaDevicesError, (_error, kind) => { if (kind === 'audioinput') emit({ type: 'mic', state: 'stopped' }); })
    // A partner who joins before publishing their mic only becomes unmuted here; mute events need a published track.
    .on(RoomEvent.TrackPublished, () => partnerState())
    .on(RoomEvent.TrackUnpublished, () => partnerState())
    .on(RoomEvent.AudioPlaybackStatusChanged, () => { if (!room.canPlaybackAudio) emit({ type: 'playback-blocked' }); })
    .on(RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
      if (topic !== 'turn') return;
      try {
        const seq = Number(JSON.parse(new TextDecoder().decode(payload)).seq);
        if (Number.isInteger(seq)) emit({ type: 'turn', seq });
      } catch { /* not a turn message */ }
    })
    .on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _publication, participant) => {
      if (track.kind !== Track.Kind.Audio) return;
      const element = track.attach();
      element.dataset.remote = '';
      document.body.append(element);
      participant.setVolume(volume());
    })
    .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => track.detach().forEach(element => element.remove()));
  return room;
}

function liveKitAudio(): DebateAudio {
  const listeners = new Set<(event: AudioEvent) => void>();
  let room: Room | undefined;
  let kit: LiveKit | undefined;
  let publishing = false;
  let muted = false;
  let volume = 1;
  let closed = false;
  // After our own disconnect, LiveKit's events are not news.
  const emit = (event: AudioEvent) => { if (!closed) listeners.forEach(listener => listener(event)); };
  const micTrack = () => (kit ? room?.localParticipant.getTrackPublication(kit.Track.Source.Microphone)?.track?.mediaStreamTrack : undefined);

  return {
    async connect({ url, token, publishMic, startMuted, deviceId }) {
      muted = startMuted;
      kit = await import('livekit-client');
      if (closed) return;
      room = wire(kit, emit, () => muted, () => volume);
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
    async listDevices(kind) {
      const { Room: LiveKitRoom } = kit ?? await import('livekit-client');
      const devices = await LiveKitRoom.getLocalDevices(kind, false);
      return devices.filter(device => device.deviceId).map(device => ({ id: device.deviceId, label: device.label }));
    },
    micTrack,
    setPartnerVolume(next) {
      volume = next;
      room?.remoteParticipants.forEach(participant => participant.setVolume(next));
    },
    activeDevice(kind) {
      // The live track knows the real input, even after LiveKit fell back to another one.
      const track = kind === 'audioinput' ? micTrack() : undefined;
      return track?.getSettings().deviceId ?? room?.getActiveDevice(kind);
    },
    async switchDevice(kind, id) {
      if (!room || !(await room.switchActiveDevice(kind, id))) throw new Error(`Could not use ${kind} ${id}`);
      // A mic LiveKit had to stop comes back on the new device, unless the debater muted it.
      if (kind === 'audioinput' && publishing && !muted) await room.localParticipant.setMicrophoneEnabled(true, { deviceId: id });
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
