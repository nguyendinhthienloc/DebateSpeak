import { useState } from 'react';
import { ActionLink } from '../components/ui';

const motion = 'Should universities offer a four-day week?';

export function LobbyPage({ ready = false }: { ready?: boolean }) {
  const [copyStatus, setCopyStatus] = useState('');
  async function copyCode() {
    try { await navigator.clipboard.writeText('ABCD2345'); setCopyStatus('Example code copied. It cannot be used to join a room.'); }
    catch { setCopyStatus('Copy is unavailable. Select the example code above to copy it.'); }
  }
  const participants = <section className="participants" aria-labelledby="participants-heading">
    <h2 id="participants-heading" className="label">Participants and stances</h2>
    <div className="participant"><h3 className="participant-name">Learner A · You</h3><p className="small muted">A · {ready ? 'In favor (PRO)' : 'Stance assigned when your partner joins'}</p></div>
    <div className="participant"><h3 className="participant-name">{ready ? 'Learner B' : 'Your partner has not joined yet'}</h3><p className="small muted">B · {ready ? 'Against (CON)' : 'Open seat'}</p></div>
  </section>;
  const invitation = <section className="invitation stack-12" aria-labelledby="code-heading">
    <h2 id="code-heading" className="label">Room code</h2>
    <div className="code-row"><p className="headline">ABCD2345</p>{ready
      ? <button type="button" className="action action-secondary" disabled aria-describedby="lobby-media-limit">Test microphone</button>
      : <button type="button" className="action action-primary" onClick={copyCode}>Copy code</button>}</div>
    <div className="stack-6 small muted"><p>{ready ? 'Both seats are filled in this example.' : 'Example code · no real invitation'}</p><p>Expires at 15:30 · Example time</p></div>
    {copyStatus && <p className="small" role="status">{copyStatus}</p>}
  </section>;
  return <div className="stack-20 room-controls">
    <section className="stack-8">
      <h1>{motion}</h1>
      <p className="label">{ready ? 'Room setup complete · 2 of 2 joined' : 'Waiting for your partner · 1 of 2 joined'}</p>
      <p className="small muted">Free flow · 10 minutes · Stances assigned at random</p>
    </section>
    <div className={`lobby-columns ${ready ? 'ready' : 'waiting'}`}>
      {ready ? <>{participants}{invitation}</> : <>{invitation}{participants}</>}
    </div>
    <p id="lobby-media-limit" className="small muted">Audio and debate start are not available in this build.</p>
    <div className="stack-6"><ActionLink to="/rooms" variant={ready ? 'primary' : 'secondary'} className="short-action">Back to rooms</ActionLink><p className="small muted">Sample room · no seat is reserved.</p></div>
  </div>;
}
