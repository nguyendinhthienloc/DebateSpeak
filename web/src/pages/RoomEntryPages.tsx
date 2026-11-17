import { ActionLink, Field, Note, PageHeading } from '../components/ui';
import { defaultSettings, settingsLine } from '../roomSettings';

export function RoomsPage({ full = false }: { full?: boolean }) {
  return <div className="stack-24 room-controls">
    <PageHeading title="Find your practice room" />
    <div className="room-panels">
      <section className="room-panel" aria-labelledby="join-room-heading">
        <h2 id="join-room-heading">Join with a code</h2>
        <Field label="Invite code" placeholder="Enter the 8-character code" defaultValue={full ? 'ABCD2345' : ''} maxLength={8} autoComplete="off" spellCheck={false} />
        {full && <Note title="This room already has two participants" tone="error">Check the code, ask for another invite, or create a new room.</Note>}
        <ActionLink to="/invite">Continue</ActionLink>
      </section>
      <section className="room-panel" aria-labelledby="new-room-heading">
        <h2 id="new-room-heading">Starting a new room?</h2>
        <p className="muted">Choose a topic and share an invite with your partner.</p>
        <ActionLink to="/rooms/new" variant="secondary">Create a room</ActionLink>
      </section>
    </div>
  </div>;
}

export function InvitationPage() {
  return <div className="stack-24 room-controls">
    <PageHeading title="Join your partner" />
    <div className="room-panels">
      <section className="room-panel" aria-labelledby="invite-motion">
        <p className="label">Motion</p>
        <h2 id="invite-motion" className="room-panel-motion">{defaultSettings.motion}</h2>
        <p className="small muted">{settingsLine(defaultSettings)} · Stances at random</p>
        <p className="medium room-panel-host">Learner A is waiting. You take the open seat.</p>
      </section>
      <section className="room-panel" aria-label="Invitation">
        <Field label="Invite code" value="ABCD2345" readOnly />
        <ActionLink to="/rooms/ready">Join room</ActionLink>
        <ActionLink to="/rooms" variant="secondary">Use a different code</ActionLink>
      </section>
    </div>
  </div>;
}

export function ExpiredRoomPage() {
  return <div className="stack-20"><PageHeading title="This room has expired">The invitation is no longer available.</PageHeading><Note title="Room closed" tone="warning">Set up a new room or ask your partner for a fresh invite.</Note><ActionLink to="/rooms" className="short-action">Back to rooms</ActionLink></div>;
}
