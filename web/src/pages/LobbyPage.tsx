import { useState, type CSSProperties } from 'react';
import { ActionLink } from '../components/ui';
import { partnerStance, settingsLine, type RoomSettings } from '../roomSettings';

export function LobbyPage({ settings, ready = false }: { settings: RoomSettings; ready?: boolean }) {
  const [copyStatus, setCopyStatus] = useState('');
  async function copyCode() {
    try { await navigator.clipboard.writeText('ABCD2345'); setCopyStatus('Example code copied. It cannot be used to join a room.'); }
    catch { setCopyStatus('Copy is unavailable. Select the example code above to copy it.'); }
  }
  const random = settings.assignment === 'Random';
  const yours = random ? 'In favor (PRO)' : settings.stance;
  const theirs = random ? 'Against (CON)' : partnerStance(settings);
  const seats = [
    { key: 'A', name: 'Learner A · You', stance: ready ? yours : 'Stance assigned when your partner joins', open: false },
    { key: 'B', name: ready ? 'Learner B' : 'Waiting for your partner', stance: ready ? theirs : 'Open seat', open: !ready },
  ];
  const participants = <section className="participants" aria-labelledby="participants-heading">
    <h2 id="participants-heading" className="label">Participants and stances</h2>
    <div className="seats">
      {seats.map((seat, index) => <div key={seat.key} className={`participant seat${seat.open ? ' seat-open' : ''}`} style={{ '--i': index } as CSSProperties}>
        <span className="seat-avatar" aria-hidden="true">{seat.open ? <span className="seat-pulse" /> : seat.key}</span>
        <h3 className="participant-name">{seat.name}</h3>
        <p className="small muted">{seat.stance}</p>
      </div>)}
    </div>
  </section>;
  const invitation = <section className="invitation stack-12" aria-labelledby="code-heading">
    <h2 id="code-heading" className="label">Room code</h2>
    <p className="headline lobby-code">ABCD2345</p>
    {!ready && <button type="button" className="action action-primary" onClick={copyCode}>Copy code</button>}
    <p className="small muted">Expires at 15:30</p>
    {copyStatus && <p className="small" role="status">{copyStatus}</p>}
  </section>;
  return <div className="stack-32 room-controls">
    <section className="stack-8">
      <h1>{settings.motion}</h1>
      <p className="medium lobby-status"><span className={`status-dot${ready ? ' status-dot-ready' : ''}`} aria-hidden="true" />{ready ? 'Room setup complete · 2 of 2 joined' : 'Waiting for your partner · 1 of 2 joined'}</p>
      <p className="small muted">{settingsLine(settings)} · {random ? 'Stances assigned at random' : 'Stances chosen'}</p>
    </section>
    <div className={`lobby-columns ${ready ? 'ready' : 'waiting'}`}>
      {ready ? <>{participants}{invitation}</> : <>{invitation}{participants}</>}
    </div>
    <div className="action-bar">
      <p id="lobby-media-limit" className="small action-bar-note">Audio won't start until you both agree. Debate start isn't available yet.</p>
      {ready ? <>
        <button type="button" className="action action-primary" disabled aria-describedby="lobby-media-limit">Start debate</button>
        <button type="button" className="action action-secondary" disabled aria-describedby="lobby-media-limit">Test microphone</button>
        <ActionLink to="/rooms" variant="text">Back to rooms</ActionLink>
      </> : <ActionLink to="/rooms" variant="secondary">Back to rooms</ActionLink>}
    </div>
  </div>;
}
