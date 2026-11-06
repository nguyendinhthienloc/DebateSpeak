import { useState } from 'react';
import { ActionLink, BackToRooms, Choices, Field, Note, PageHeading } from '../components/ui';
import type { RoomSettings } from '../roomSettings';

const motion = 'Should universities offer a four-day week?';

export function RoomsPage({ full = false }: { full?: boolean }) {
  return <div className="stack-20 room-controls">
    <PageHeading title="Find your practice room">Join your partner with an invite code, or set up a room for the two of you.</PageHeading>
    <div className="form-column stack-24">
      <div className="stack-16">
        <Field label="Invite code" placeholder="Enter the 8-character code" defaultValue={full ? 'ABCD2345' : ''} maxLength={8} autoComplete="off" spellCheck={false} hint="Sample only. Codes are not checked or submitted." />
        {full && <Note title="This room already has two participants" tone="error">Example error. Check the code, ask for another invite, or create a new room.</Note>}
        <ActionLink to="/invite">Preview invitation</ActionLink>
      </div>
      <h2>Starting a new room?</h2>
      <p className="muted">Choose a topic and share an invite with your partner.</p>
      <ActionLink to="/rooms/new" variant="secondary">Create a room</ActionLink>
    </div>
  </div>;
}

function AudioChecks() {
  return <section className="audio-checks stack-12" aria-labelledby="audio-heading">
    <h2 id="audio-heading">Check your audio</h2>
    <p className="label">Optional · this device only</p>
    <p id="audio-limit" className="small">Audio checks are not available in this scaffold. No recording, upload or room connection.</p>
    <div className="flex gap-3 audio-actions">
      <button type="button" className="action action-secondary flex-1" disabled aria-describedby="audio-limit">Test microphone</button>
      <button type="button" className="action action-secondary flex-1" disabled aria-describedby="audio-limit">Test speaker</button>
    </div>
  </section>;
}

function RoomPreview({ settings }: { settings: RoomSettings }) {
  return <aside className="stack-32" id="room-preview" tabIndex={-1} aria-label="Room preview and audio checks">
    <section className="room-preview stack-16" aria-labelledby="preview-heading">
      <h2 id="preview-heading">Room preview</h2>
      <p className="headline">{motion}</p>
      <p className="accent">{settings.format} · {settings.duration || '10'} minutes</p>
      <p className="small">{settings.assignment === 'Random' ? 'Stances assigned at random' : 'You choose your stance'}</p>
      <hr /><h2>You</h2>
      <p className="small">{settings.assignment === 'Random' ? 'Stance assigned when your partner joins' : settings.stance}</p>
      <hr /><h2>Partner · Open seat</h2>
      <p className="small">{settings.assignment === 'Random' ? 'Stance assigned when your partner joins' : settings.stance === 'In favor (PRO)' ? 'Against (CON)' : 'In favor (PRO)'}</p>
      <hr /><p className="small">Your invite code appears after you create the room.</p>
    </section>
    <AudioChecks />
  </aside>;
}

export function CreateRoomPage({ editing, settings, onChange }: { editing: boolean; settings: RoomSettings; onChange: (settings: RoomSettings) => void }) {
  function update(key: keyof RoomSettings, value: string) { onChange({ ...settings, [key]: value }); }
  return <div className="stack-20 room-controls">
    <PageHeading title="Set up your room">{editing ? 'Choose the topic and a few simple rules before inviting your partner.' : 'Start with these defaults, or change the room settings.'}</PageHeading>
    <div className="setup-columns">
      <div className="stack-20">
        <p className="label">Topic</p>
        <section className="stack-8 topic" aria-label="Selected topic"><h2>{motion}</h2><p className="small">Available topic</p><hr /></section>
        <button className="action action-text mobile-preview-link" type="button" onClick={() => {
          document.getElementById('room-preview')?.focus();
          document.getElementById('room-preview')?.scrollIntoView({ block: 'start' });
        }}>Preview and audio checks</button>
        {editing ? <>
          <Choices label="Format" options={['Free flow', 'Timed turns']} value={settings.format} onChange={value => update('format', value)} describe />
          <Field label="Duration (minutes)" type="number" min={1} max={30} value={settings.duration} onChange={event => update('duration', event.target.value)} onBlur={() => update('duration', String(Math.min(30, Math.max(1, Number(settings.duration) || 10))))} hint="Choose from 1 to 30 minutes." />
          <Choices label="Stance assignment" options={['Random', 'I choose']} value={settings.assignment} onChange={value => update('assignment', value)} describe />
          {settings.assignment === 'I choose' && <Choices label="Your stance" options={['In favor (PRO)', 'Against (CON)']} value={settings.stance} onChange={value => update('stance', value)} describe />}
          <p className="small muted">You and your partner receive opposite stances when both have joined.</p>
        </> : <div className="stack-8">
          <h2 className="label">Room settings</h2>
          <div><p>{settings.format} · {settings.duration} minutes</p><p>{settings.assignment === 'Random' ? 'Random stances' : `Your stance: ${settings.stance}`}</p></div>
          <ActionLink to="/rooms/new/settings" variant="text">Change settings</ActionLink>
        </div>}
        <div className="stack-6 small muted"><p className="label">Room setup only</p><p>Creating a room does not start room audio or transcription.</p></div>
        <ActionLink to={editing ? '/rooms/new' : '/rooms/waiting'}>{editing ? 'Use these settings' : 'Preview waiting lobby'}</ActionLink>
        <BackToRooms />
      </div>
      <RoomPreview settings={settings} />
    </div>
  </div>;
}

export function InvitationPage() {
  return <div className="stack-20 room-controls">
    <PageHeading title="Join your partner">Preview the invitation before joining a room.</PageHeading>
    <div className="form-column stack-20">
      <Field label="Invite code" value="ABCD2345" readOnly hint="Example code · no real invitation" />
      <ActionLink to="/rooms/ready">Preview ready lobby</ActionLink>
      <p className="small muted">Check the code before joining. This scaffold does not reserve a seat.</p>
      <ActionLink to="/rooms" variant="secondary">Use a different code</ActionLink>
      <p className="small muted">Joining does not start audio or transcription.</p>
    </div>
  </div>;
}

export function LobbyPage({ ready = false }: { ready?: boolean }) {
  const [copyStatus, setCopyStatus] = useState('');
  async function copyCode() {
    try { await navigator.clipboard.writeText('ABCD2345'); setCopyStatus('Example code copied. It cannot be used to join a room.'); }
    catch { setCopyStatus('Copy is unavailable. Select the example code above to copy it.'); }
  }
  return <div className="stack-20 room-controls">
    <section className="stack-12">
      <h1>{motion}</h1>
      <p className="label">{ready ? 'Room setup complete · 2 of 2 joined' : 'Waiting for your partner · 1 of 2 joined'}</p>
      <p className="small">Free flow · 10 minutes · Stances assigned at random</p><hr />
    </section>
    <div className={`lobby-columns ${ready ? '' : 'waiting'}`}>
      <section className="participants" aria-labelledby="participants-heading">
        <h2 id="participants-heading">Participants and stances</h2>
        <div className="participant stack-8"><h2>Learner A · You</h2><p className="muted">A · {ready ? 'In favor (PRO)' : 'Stance assigned when your partner joins'}</p></div><hr />
        <div className="participant stack-8"><h2>{ready ? 'Learner B' : 'Your partner has not joined yet'}</h2><p className="muted">B · {ready ? 'Against (CON)' : 'Open seat'}</p></div>
      </section>
      <section className="invitation stack-12" aria-labelledby="code-heading">
        <hr /><h2 id="code-heading">Room code</h2>
        <div className="code-row"><p className="headline">ABCD2345</p>{ready
          ? <button type="button" className="action action-secondary" disabled aria-describedby="lobby-media-limit">Test microphone</button>
          : <button type="button" className="action action-primary" onClick={copyCode}>Copy code</button>}</div>
        <p className="small muted">{ready ? 'Both seats are filled in this example.' : 'Example code · no real invitation'}</p>
        <p className="small muted">Expires at 15:30 · Example time</p>
        {copyStatus && <p className="small" role="status">{copyStatus}</p>}
      </section>
    </div>
    <p id="lobby-media-limit" className="small muted">Audio and debate start are not available in this build.</p>
    <div className="stack-6"><ActionLink to="/rooms" variant={ready ? 'primary' : 'secondary'} className="short-action">Back to rooms</ActionLink><p className="small muted">Sample room · no seat is reserved.</p></div>
  </div>;
}

export function ExpiredRoomPage() {
  return <div className="stack-20"><PageHeading title="This room has expired">The invitation is no longer available.</PageHeading><Note title="Room closed · example" tone="warning">Set up a new room or ask your partner for a fresh invite.</Note><ActionLink to="/rooms" className="short-action">Back to rooms</ActionLink><p className="small muted">No audio or transcription started in this room.</p></div>;
}
