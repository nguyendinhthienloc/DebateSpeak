import { useEffect, useState } from 'react';
import { useSession } from '../../auth/session';
import { countdownLeft } from '../../rooms/clock';
import type { RoomSnapshot } from '../../rooms/contracts';
import { fatal, useRoom } from '../../rooms/useRoom';
import { AgreeView } from './AgreeView';
import { InviteView } from './InviteView';
import { LiveStage } from './LiveStage';
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
export function RoomPage({ roomId, onStage }: { roomId: string; onStage: (on: boolean) => void }) {
  const { session } = useSession();
  const { room, error, apply } = useRoom(roomId);
  const [firstRoom, setFirstRoom] = useState<RoomSnapshot>();
  if (room && !firstRoom) setFirstRoom(room);
  // Opening the page on a debate already under way means a reload or a return: rejoin muted.
  const rejoined = firstRoom?.status === 'LIVE' && countdownLeft(firstRoom, Date.parse(firstRoom.server_now)) === 0;
  const staged = room?.status === 'LIVE' || room?.status === 'ENDED';
  useEffect(() => { onStage(staged); }, [staged, onStage]);
  useEffect(() => () => onStage(false), [onStage]);
  const [seen, setSeen] = useState(room);
  const [partnerLeft, setPartnerLeft] = useState<string>();
  const [left, setLeft] = useState(false);
  if (room !== seen) {
    // A guest who leaves before the start sends the room back to LOBBY with one seat.
    const gone = seen?.participants.find(person => !room?.participants.some(other => other.user_id === person.user_id));
    setSeen(room);
    setPartnerLeft(room?.status === 'LOBBY' && gone ? gone.display_name : room && room.participants.length > 1 ? undefined : partnerLeft);
  }

  if (left) return <RoomNotice title="You left the room">No audio was shared.</RoomNotice>;
  if (!room) {
    if (fatal(error)) {
      return <RoomNotice title="This room is not available">You may not be part of it, or it may no longer exist.</RoomNotice>;
    }
    return <p className="small muted" role="status">{error ? 'The room could not be reached. Trying again…' : 'Opening the room…'}</p>;
  }

  return <div data-testid="room-view" data-status={room.status}>
    {room.status === 'CANCELLED' ? <Closed room={room} userId={session?.user.id} />
      : room.status === 'LOBBY' ? <InviteView room={room} onChange={apply} partnerLeft={partnerLeft} />
      : room.status === 'READY' ? <AgreeView room={room} onChange={apply} onLeft={() => setLeft(true)} />
      : room.status === 'LIVE' ? <LiveStage room={room} onChange={apply} rejoined={rejoined} />
      : <h1>{room.motion}</h1>}
  </div>;
}
