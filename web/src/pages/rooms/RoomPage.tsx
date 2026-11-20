import { useState } from 'react';
import { useSession } from '../../auth/session';
import type { RoomSnapshot } from '../../rooms/contracts';
import { fatal, useRoom } from '../../rooms/useRoom';
import { InviteView } from './InviteView';
import { RoomNotice } from './RoomNotice';
import './rooms.css';

function Closed({ room, userId }: { room: RoomSnapshot; userId?: string }) {
  if (room.end_reason === 'EXPIRED') {
    return <RoomNotice title="This invite no longer works" createAction>Ask your partner for a new code, or create a room.</RoomNotice>;
  }
  const creator = room.participants.find(person => person.is_creator);
  const who = creator?.user_id === userId ? 'You' : creator?.display_name ?? 'The host';
  return <RoomNotice title={`${who} closed this room`}>The debate did not start, and no audio was shared.</RoomNotice>;
}

/** One page for a room in every state. Later views replace the placeholder for each status. */
export function RoomPage({ roomId }: { roomId: string }) {
  const { session } = useSession();
  const { room, error, apply } = useRoom(roomId);
  const [seen, setSeen] = useState(room);
  const [partnerLeft, setPartnerLeft] = useState<string>();
  if (room !== seen) {
    // A guest who leaves before the start sends the room back to LOBBY with one seat.
    const gone = seen?.participants.find(person => !room?.participants.some(other => other.user_id === person.user_id));
    setSeen(room);
    setPartnerLeft(room?.status === 'LOBBY' && gone ? gone.display_name : room && room.participants.length > 1 ? undefined : partnerLeft);
  }

  if (!room) {
    if (fatal(error)) {
      return <RoomNotice title="This room is not available">You may not be part of it, or it may no longer exist.</RoomNotice>;
    }
    return <p className="small muted" role="status">{error ? 'The room could not be reached. Trying again…' : 'Opening the room…'}</p>;
  }

  return <div data-testid="room-view" data-status={room.status}>
    {room.status === 'CANCELLED' ? <Closed room={room} userId={session?.user.id} />
      : room.status === 'LOBBY' ? <InviteView room={room} onChange={apply} partnerLeft={partnerLeft} />
      : <h1>{room.motion}</h1>}
  </div>;
}
