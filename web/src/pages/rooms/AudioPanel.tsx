import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { canChooseSpeaker, type AudioDevice, type DebateAudio, type DeviceKind } from '../../rooms/debateAudio';
import { useTrackLevel } from '../../rooms/useTrackLevel';

const fallbackLabel: Record<DeviceKind, string> = { audioinput: 'Microphone', audiooutput: 'Speaker' };
const segments = 10;

/** The lobby's segment meter, fed by the live mic instead of a test. */
function LiveMeter({ track, stopped }: { track?: MediaStreamTrack; stopped: boolean }) {
  const { level, heard } = useTrackLevel(stopped ? undefined : track);
  const lit = Math.round(Math.min(1, level * 3) * segments);
  return <>
    <div className="mic-meter" aria-hidden="true">
      {Array.from({ length: segments }, (_, index) => <span key={index} className={index < lit ? 'on' : undefined} />)}
    </div>
    <p className="small" role="status">{stopped ? 'Microphone stopped' : heard ? 'We can hear you' : 'No sound yet'}</p>
  </>;
}

function DevicePicker({ label, kind, devices, value, onPick }: {
  label: string; kind: DeviceKind; devices: AudioDevice[]; value?: string; onPick: (kind: DeviceKind, id: string) => void;
}) {
  const field = useId();
  return <div className="field">
    <label htmlFor={field}>{label}</label>
    <select id={field} value={value ?? ''} onChange={event => onPick(kind, event.target.value)}>
      {!devices.some(device => device.id === value) && <option value="">Choose…</option>}
      {devices.map(device => <option key={device.id} value={device.id}>{device.label || fallbackLabel[kind]}</option>)}
    </select>
  </div>;
}

/**
 * Audio settings on the live stage. Opening or closing it never touches the mic; only a pick does.
 * `onClose(true)` asks the stage to put focus back on the gear.
 */
export function AudioPanel({ audio, publishMic, stopped, anchor, onClose, children }: {
  audio: DebateAudio; publishMic: boolean; stopped: boolean; anchor: RefObject<HTMLElement>;
  onClose: (refocus: boolean) => void; children?: ReactNode;
}) {
  const heading = useId();
  const panel = useRef<HTMLElement>(null);
  const speaker = canChooseSpeaker();
  const [inputs, setInputs] = useState<AudioDevice[]>([]);
  const [outputs, setOutputs] = useState<AudioDevice[]>([]);
  const [active, setActive] = useState<Partial<Record<DeviceKind, string>>>({});
  const [failed, setFailed] = useState(false);
  const [track, setTrack] = useState<MediaStreamTrack>();

  const load = useCallback(async () => {
    const [mics, speakers] = await Promise.all([
      publishMic ? audio.listDevices('audioinput') : [],
      speaker ? audio.listDevices('audiooutput') : [],
    ]);
    setInputs(mics);
    setOutputs(speakers);
    setActive({ audioinput: audio.activeDevice('audioinput'), audiooutput: audio.activeDevice('audiooutput') });
    if (publishMic) setTrack(audio.micTrack());
  }, [audio, publishMic, speaker]);

  useEffect(() => {
    void load();
    navigator.mediaDevices?.addEventListener?.('devicechange', load);
    return () => navigator.mediaDevices?.removeEventListener?.('devicechange', load);
  }, [load]);
  // A stop, a restart or a new device can replace the live track.
  useEffect(() => { if (publishMic) setTrack(audio.micTrack()); }, [audio, publishMic, stopped]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(true); };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !anchor.current?.contains(target)) onClose(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [anchor, onClose]);

  function pick(kind: DeviceKind, id: string) {
    setFailed(false);
    setActive(current => ({ ...current, [kind]: id }));
    audio.switchDevice(kind, id).then(
      () => {
        setActive(current => ({ ...current, [kind]: audio.activeDevice(kind) ?? id }));
        if (kind === 'audioinput') setTrack(audio.micTrack());
      },
      () => { setFailed(true); setActive(current => ({ ...current, [kind]: audio.activeDevice(kind) })); },
    );
  }

  return <section ref={panel} className="audio-panel" id="audio-panel" aria-labelledby={heading}>
    <div className="type-head">
      <h2 id={heading}>Audio settings</h2>
      <button type="button" className="type-close" onClick={() => onClose(true)}>Close</button>
    </div>
    {publishMic && <DevicePicker label="Microphone" kind="audioinput" devices={inputs} value={active.audioinput} onPick={pick} />}
    {publishMic && <LiveMeter track={track} stopped={stopped} />}
    {speaker && <DevicePicker label="Speaker" kind="audiooutput" devices={outputs} value={active.audiooutput} onPick={pick} />}
    {children}
    {failed && <p className="small field-error" role="alert">That device could not be used. Pick another one.</p>}
  </section>;
}
