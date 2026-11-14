import { ActionLink, Field, Note, PageHeading } from '../components/ui';

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

export function ExpiredRoomPage() {
  return <div className="stack-20"><PageHeading title="This room has expired">The invitation is no longer available.</PageHeading><Note title="Room closed · example" tone="warning">Set up a new room or ask your partner for a fresh invite.</Note><ActionLink to="/rooms" className="short-action">Back to rooms</ActionLink><p className="small muted">No audio or transcription started in this room.</p></div>;
}
