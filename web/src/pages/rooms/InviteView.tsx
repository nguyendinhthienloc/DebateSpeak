import { useEffect, useRef, useState } from 'react';
import { useSession } from '../../auth/session';
import { cancelRoom } from '../../rooms/api';
import type { RoomSnapshot, Side } from '../../rooms/contracts';

/** A side pill that always carries the word, so side never depends on colour. */
export function SideTag({ side }: { side: Side }) {
  return <span className={`side-tag side-${side.toLowerCase()}`}>{side === 'FOR' ? 'For' : 'Against'}</span>;
}

const unavailable = 'Copy is unavailable. Select the code above to copy it.';

/** The creator's waiting screen: the invite code, both seats and a way to close the room. */
export function InviteView({ room, onChange, partnerLeft }: { room: RoomSnapshot; onChange: (room: RoomSnapshot) => void; partnerLeft?: string }) {
  const { session } = useSession();
  const [copied, setCopied] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelFailed, setCancelFailed] = useState(false);
  const controller = useRef<AbortController>();
  useEffect(() => () => controller.current?.abort(), []);

  const me = room.participants.find(person => person.user_id === session?.user.id) ?? room.participants[0];
  const code = room.code ?? '';
  const link = `${window.location.origin}${window.location.pathname}#/join/${code}`;
  const minutes = Math.max(1, Math.ceil((Date.parse(room.expires_at) - Date.parse(room.server_now)) / 60000));

  async function copy(text: string, done: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(done);
    } catch {
      setCopied(unavailable);
    }
  }

  function cancel() {
    if (cancelling) return;
    setCancelling(true);
    setCancelFailed(false);
    const request = new AbortController();
    controller.current = request;
    cancelRoom(room.id, request.signal).then(onChange, () => {
      if (!request.signal.aborted) { setCancelling(false); setCancelFailed(true); }
    });
  }

  return <div className="invite">
    <div className="stack-8">
      <p className="label">Motion</p>
      <h1>{room.motion}</h1>
      <p>Waiting for your partner · 1 of 2 joined</p>
    </div>
    {partnerLeft && <p className="invite-left" role="status">{partnerLeft} left. The seat is open again.</p>}
    <section className="invite-panel" aria-labelledby="invite-heading">
      <h2 id="invite-heading" className="label">Invite code</h2>
      <p className="invite-code">{code.slice(0, 4)} {code.slice(4)}</p>
      <div className="action-bar">
        <button type="button" className="action action-primary" onClick={() => copy(link, 'Invite link copied')}>Copy invite link</button>
        <button type="button" className="action action-secondary" onClick={() => copy(code, 'Code copied')}>Copy code</button>
      </div>
      <p className="small">Expires in {minutes} {minutes === 1 ? 'minute' : 'minutes'}</p>
      <p className="small invite-copied" role="status">{copied}</p>
    </section>
    <div className="seats">
      {me && <div className="seat">
        <span className="seat-avatar" aria-hidden="true">{me.display_name.slice(0, 1).toUpperCase()}</span>
        <p className="participant-name">{me.display_name} (You)</p>
        {me.side ? <SideTag side={me.side} /> : <p className="small muted">Side at random</p>}
      </div>}
      <div className="seat seat-open">
        <span className="seat-pulse" aria-hidden="true" />
        <p className="participant-name">Open seat</p>
        <p className="small muted">Your partner joins with the code.</p>
      </div>
    </div>
    <div className="stack-8">
      <button type="button" className="action action-text invite-cancel" onClick={cancel}>Cancel room</button>
      {cancelFailed && <p className="small field-error" role="alert">The room could not be closed. Try again.</p>}
    </div>
  </div>;
}
