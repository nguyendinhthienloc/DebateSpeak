import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Participant, TypedTurn } from '../../rooms/contracts';

const maxLength = 500;

/** Typed turns so far and a box to send one. Turns render as plain text only. */
export function TypePanel({ turns, participants, meId, send, sending, error, onClose }: {
  turns: TypedTurn[]; participants: Participant[]; meId?: string;
  send: (text: string) => Promise<boolean>; sending: boolean; error?: string; onClose: () => void;
}) {
  const [text, setText] = useState('');
  const field = useId();
  const nameOf = (id: string) => (id === meId ? 'You' : participants.find(person => person.user_id === id)?.display_name ?? 'Partner');

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    if (await send(value)) setText('');
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  }

  return <section className="type-panel" id="type-panel" aria-labelledby="type-heading">
    <div className="type-head">
      <h2 id="type-heading">Typed turns</h2>
      <button type="button" className="type-close" onClick={onClose}>Close</button>
    </div>
    <ol className="type-log" role="log" aria-label="Typed turns">
      {turns.map(turn => <li key={turn.seq}><span className="type-who">{nameOf(turn.user_id)}</span><span className="type-text">{turn.text}</span></li>)}
    </ol>
    {turns.length === 0 && <p className="small muted">No typed turns yet.</p>}
    <form className="type-form" onSubmit={submit}>
      <label htmlFor={field}>Type your turn</label>
      <textarea id={field} rows={3} maxLength={maxLength} value={text} onChange={event => setText(event.target.value)} onKeyDown={onKeyDown} />
      <div className="type-send">
        <span className="small muted">{maxLength - text.length} characters left</span>
        <button type="submit" className="action action-primary" disabled={sending || !text.trim()}>Send</button>
      </div>
      {error && <p className="small field-error" role="alert">{error}</p>}
    </form>
  </section>;
}
