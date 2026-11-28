import { StageBar } from '../../components/Headers';
import { ActionLink } from '../../components/ui';
import type { RoomSnapshot } from '../../rooms/contracts';
import './stage.css';

function howItEnded(room: RoomSnapshot, userId?: string) {
  if (room.end_reason === 'TIMER') return 'The debate ended when time ran out.';
  if (room.end_reason === 'DISCONNECT') return 'The debate ended after the connection was lost.';
  if (room.ended_by === userId) return 'You ended the debate.';
  const by = room.participants.find(person => person.user_id === room.ended_by);
  return by ? `${by.display_name} ended the debate.` : 'The debate ended.';
}

function length(room: RoomSnapshot) {
  if (!room.started_at || !room.ended_at) return undefined;
  const minutes = Math.round((Date.parse(room.ended_at) - Date.parse(room.started_at)) / 60_000);
  if (minutes < 1) return 'Under a minute';
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}

/** The end of a debate, still on the stage. Audio is already released: the live stage unmounts first. */
export function WrapUp({ room, userId }: { room: RoomSnapshot; userId?: string }) {
  const partner = room.participants.find(person => person.user_id !== userId);
  const duration = length(room);
  return <div className="stage wrap">
    <StageBar className="stage-head" />
    <div className="wrap-body">
      <h1 className="wrap-title">Debate finished</h1>
      <p className="stage-motion">{room.motion}</p>
      <dl className="wrap-facts">
        <div><dt>How it ended</dt><dd>{howItEnded(room, userId)}</dd></div>
        {partner && <div><dt>Partner</dt><dd>You debated {partner.display_name}{partner.side ? ` (${partner.side === 'FOR' ? 'For' : 'Against'})` : ''}.</dd></div>}
        {duration && <div><dt>Length</dt><dd>{duration}</dd></div>}
      </dl>
      <p className="wrap-report">Feedback report: coming in a later release</p>
      <div className="dock-actions">
        <ActionLink to="/home" className="stage-danger">Back to home</ActionLink>
        <ActionLink to="/rooms/new" variant="secondary" className="stage-quiet">Set up another room</ActionLink>
      </div>
    </div>
  </div>;
}
