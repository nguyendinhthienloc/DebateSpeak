import { useEffect, useId, useRef, useState } from 'react';
import { useSession } from '../../auth/session';
import { clearReady, leaveRoom, setReady } from '../../rooms/api';
import type { Participant, RoomSnapshot } from '../../rooms/contracts';
import { useMicCheck, type MicStatus } from '../../rooms/useMicCheck';
import { SideTag } from './InviteView';

const micText: Record<MicStatus, string> = {
  idle: 'Not tested yet. The test stays in this browser.',
  requesting: 'Allow the microphone in your browser.',
  listening: 'Say a few words…',
  passed: 'We can hear you',
  blocked: '',
  silent: "We can't hear anything yet. Check that the microphone is on, then test again.",
};
const segments = 10;

function Seat({ person, you }: { person: Participant; you: boolean }) {
  return <li className="agree-seat">
    <span className="participant-name">{person.display_name}{you && ' (You)'}</span>
    {person.side && <SideTag side={person.side} />}
  </li>;
}

/** Both debaters agree and check their microphone before either can start. Nothing here pressures the partner. */
export function AgreeView({ room, onChange, onLeft }: { room: RoomSnapshot; onChange: (room: RoomSnapshot) => void; onLeft: () => void }) {
  const { session } = useSession();
  const mic = useMicCheck();
  const [agreed, setAgreed] = useState(false);
  const [typeInstead, setTypeInstead] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const controller = useRef<AbortController>();
  const deviceField = useId();
  useEffect(() => () => controller.current?.abort(), []);

  const me = room.participants.find(person => person.user_id === session?.user.id);
  const partner = room.participants.find(person => person !== me);
  const minutes = Math.round(room.duration_seconds / 60);
  const canBeReady = agreed && (typeInstead || mic.status === 'passed');

  function send(action: (signal: AbortSignal) => Promise<RoomSnapshot>, done: (room: RoomSnapshot) => void) {
    if (pending) return;
    setPending(true);
    setFailed(false);
    const request = new AbortController();
    controller.current = request;
    action(request.signal).then(
      next => { setPending(false); done(next); },
      () => { if (!request.signal.aborted) { setPending(false); setFailed(true); } });
  }

  const ready = () => send(signal => setReady(room.id, typeInstead ? 'TYPE' : 'VOICE', signal), onChange);
  const notReady = () => send(signal => clearReady(room.id, signal), onChange);
  const leave = () => { mic.stop(); send(signal => leaveRoom(room.id, signal), onLeft); };

  return <div className="agree">
    <div className="stack-8">
      <p className="label">Motion</p>
      <h1>{room.motion}</h1>
    </div>
    <ul className="agree-seats" aria-label="Debaters">
      {me && <Seat person={me} you />}
      {partner && <Seat person={partner} you={false} />}
    </ul>
    {partner && <p className="small">{partner.ready ? `${partner.display_name} is ready` : `${partner.display_name} hasn't finished yet`}</p>}
    <div className="agree-cards">
      <section className="agree-card" aria-labelledby="agree-heading">
        <h2 id="agree-heading">Agree to this debate</h2>
        <ul className="agree-list">
          <li>{room.format === 'TIMED_TURNS' ? `You debate ${partner?.display_name ?? 'your partner'} in timed turns, about 7 minutes.` : `You debate ${partner?.display_name ?? 'your partner'} live for ${minutes} minutes.`}</li>
          <li>Your microphone opens only when you both press I'm ready.</li>
          <li>What you say is transcribed as you speak. The audio itself is not saved.</li>
          <li>Anything you type is saved in your transcript and analysed by AI.</li>
          <li>Either of you can end the debate at any time.</li>
        </ul>
        <label className="agree-check">
          <input type="checkbox" checked={agreed || Boolean(me?.ready)} disabled={me?.ready} onChange={event => setAgreed(event.target.checked)} />
          <span>I agree for this debate</span>
        </label>
      </section>
      <section className="agree-card" aria-labelledby="mic-heading">
        <h2 id="mic-heading">Check your microphone</h2>
        {typeInstead ? <>
          <p>You will type your turns in this debate. No microphone is used.</p>
          <button type="button" className="action action-text agree-switch" onClick={() => setTypeInstead(false)}>Use my microphone</button>
        </> : <>
          {mic.devices.length > 1 && <div className="field">
            <label htmlFor={deviceField}>Microphone</label>
            <select id={deviceField} value={mic.deviceId ?? ''} onChange={event => mic.selectDevice(event.target.value)}>
              {!mic.deviceId && <option value="">Default</option>}
              {mic.devices.map(device => <option key={device.deviceId} value={device.deviceId}>{device.label || 'Microphone'}</option>)}
            </select>
          </div>}
          <div className="mic-meter" aria-hidden="true">
            {Array.from({ length: segments }, (_, index) => <span key={index} className={index < Math.round(Math.min(1, mic.level * 4) * segments) || mic.status === 'passed' ? 'on' : undefined} />)}
          </div>
          <p className="small" role="status">{micText[mic.status]}</p>
          {mic.status === 'blocked' && <p className="small field-error" role="alert">
            Your browser is blocking the microphone. Allow it from the icon next to the address bar, then test again.
          </p>}
          <button type="button" className="action action-secondary short-action" disabled={mic.status === 'requesting' || mic.status === 'listening'}
            onClick={() => { void mic.start(); }}>Test microphone</button>
          <button type="button" className="action action-text agree-switch" onClick={() => { mic.stop(); setTypeInstead(true); }}>Type instead</button>
        </>}
      </section>
    </div>
    <div className="action-bar action-bar-sticky">
      {me?.ready
        ? <button type="button" className="action action-secondary" onClick={notReady}>Not ready yet</button>
        : <button type="button" className="action action-primary" disabled={!canBeReady || pending} aria-describedby="ready-hint" onClick={ready}>I'm ready</button>}
      <button type="button" className="action action-text" onClick={leave}>Leave room</button>
    </div>
    <p id="ready-hint" className="small muted">
      {me?.ready ? 'You are ready. The debate starts when you both are.' : 'Tick the box and pass the microphone test, or choose Type instead.'}
    </p>
    {failed && <p className="small field-error" role="alert">That did not go through. Try again.</p>}
  </div>;
}
