import { useState, useSyncExternalStore } from 'react';
import { ActionLink, BackToRooms, Choices, Field, PageHeading } from '../components/ui';
import { clampDuration, partnerStance, settingsLine, type RoomSettings } from '../roomSettings';
import './setup.css';

const motion = 'Should universities offer a four-day week?';

const narrowQuery = '(max-width: 760px)';
function subscribeNarrow(callback: () => void) {
  const list = window.matchMedia(narrowQuery);
  list.addEventListener('change', callback);
  return () => list.removeEventListener('change', callback);
}
const useNarrow = () => useSyncExternalStore(subscribeNarrow, () => window.matchMedia(narrowQuery).matches);

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

type Ticks = { line: number; seats: number };
const rowClass = (tick: number) => (tick ? 'preview-row flash' : 'preview-row');

function PreviewBody({ settings, ticks }: { settings: RoomSettings; ticks: Ticks }) {
  const random = settings.assignment === 'Random';
  return <section className="preview-card stack-16" aria-labelledby="preview-heading">
    <h2 id="preview-heading">Room preview</h2>
    <p className="headline">{motion}</p>
    <p key={`line-${ticks.line}`} className={rowClass(ticks.line)}>{settingsLine(settings)}</p>
    <div key={`seats-${ticks.seats}`} className={`${rowClass(ticks.seats)} stack-12`}>
      <div><p className="label">You</p>{!random && <p className="small">{settings.stance}</p>}</div>
      <div><p className="label">Partner · Open seat</p>{!random && <p className="small">{partnerStance(settings)}</p>}</div>
      {random && <p className="small">Stances are assigned at random when your partner joins.</p>}
    </div>
    <p className="small muted">Your invite code appears after you create the room.</p>
  </section>;
}

export function CreateRoomPage({ editing, settings, onChange }: { editing: boolean; settings: RoomSettings; onChange: (settings: RoomSettings) => void }) {
  const narrow = useNarrow();
  const [ticks, setTicks] = useState<Ticks>({ line: 0, seats: 0 });
  function update(key: keyof RoomSettings, value: string) {
    if (settings[key] === value) return;
    const row = key === 'format' || key === 'duration' ? 'line' : 'seats';
    setTicks(current => ({ ...current, [row]: current[row] + 1 }));
    onChange({ ...settings, [key]: value });
  }
  return <div className="stack-20 room-controls">
    <PageHeading title="Set up your room">{editing ? 'Choose the topic and a few simple rules before inviting your partner.' : 'Start with these defaults, or change the room settings.'}</PageHeading>
    <div className="setup-columns">
      <div className="stack-20">
        <p className="label">Topic</p>
        <section className="stack-8 topic" aria-label="Selected topic"><h2>{motion}</h2><p className="small">Available topic</p><hr /></section>
        {editing ? <>
          <Choices label="Format" options={['Free flow', 'Timed turns']} value={settings.format} onChange={value => update('format', value)} describe />
          <Field label="Duration (minutes)" type="number" min={1} max={30} value={settings.duration} onChange={event => update('duration', event.target.value)} onBlur={() => update('duration', clampDuration(settings.duration))} hint="Choose from 1 to 30 minutes." />
          <Choices label="Stance assignment" options={['Random', 'I choose']} value={settings.assignment} onChange={value => update('assignment', value)} describe />
          {settings.assignment === 'I choose' && <Choices label="Your stance" options={['In favor (PRO)', 'Against (CON)']} value={settings.stance} onChange={value => update('stance', value)} describe />}
          <p className="small muted">You and your partner receive opposite stances when both have joined.</p>
        </> : <div className="stack-8">
          <h2 className="label">Room settings</h2>
          <div><p>{settingsLine(settings)}</p><p>{settings.assignment === 'Random' ? 'Random stances' : `Your stance: ${settings.stance}`}</p></div>
          <ActionLink to="/rooms/new/settings" variant="text">Change settings</ActionLink>
        </div>}
        <div className="stack-6 small muted"><p className="label">Room setup only</p><p>Creating a room does not start room audio or transcription.</p></div>
        <ActionLink to={editing ? '/rooms/new' : '/rooms/waiting'}>{editing ? 'Use these settings' : 'Preview waiting lobby'}</ActionLink>
        <BackToRooms />
      </div>
      {narrow
        ? <div className="stack-16">
          <details className="preview-details">
            <summary><span className="preview-summary"><span>Preview details</span><span className="small muted">{settingsLine(settings)}</span></span></summary>
            <PreviewBody settings={settings} ticks={ticks} />
          </details>
          <AudioChecks />
        </div>
        : <aside className="stack-32" aria-label="Room preview and audio checks">
          <PreviewBody settings={settings} ticks={ticks} />
          <AudioChecks />
        </aside>}
    </div>
  </div>;
}