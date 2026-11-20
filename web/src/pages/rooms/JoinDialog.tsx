import { useEffect, useRef, useState } from 'react';
import { ActionLink } from '../../components/ui';
import { joinRoom, lookupRoom, RoomApiError } from '../../rooms/api';
import type { RoomPreview } from '../../rooms/contracts';
import './rooms.css';

type State =
  | { kind: 'loading' }
  | { kind: 'preview'; preview: RoomPreview }
  | { kind: 'error'; title: string; detail: string };

function failure(reason: unknown): State {
  const error = reason instanceof RoomApiError ? reason : undefined;
  if (error?.status === 404) return { kind: 'error', title: 'This invite no longer works', detail: 'Ask your partner for a new code, or create a room.' };
  if (error?.status === 409) return { kind: 'error', title: 'This room already has two debaters', detail: 'Try another code, or create a room.' };
  return { kind: 'error', title: 'The invite could not be opened', detail: 'Check your connection, then open the link again.' };
}

function terms(preview: RoomPreview) {
  const length = preview.format === 'TIMED_TURNS' ? 'Timed turns · about 7 min' : `Free flow · ${Math.round(preview.duration_seconds / 60)} min`;
  const sides = preview.stance_mode === 'CREATOR_PICKS' ? `${preview.creator_name} picked a side. You take the other.` : 'Sides are assigned at random.';
  return [length, sides];
}

/** The invite, shown as a modal over Home. Closing it in any way returns to `#/home`. */
export function JoinDialog({ code }: { code: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [joining, setJoining] = useState(false);
  const join = useRef<AbortController>();

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    lookupRoom(code, controller.signal).then(preview => {
      if (preview.room_id) window.location.hash = `/rooms/${preview.room_id}`;
      else setState({ kind: 'preview', preview });
    }, reason => { if (!controller.signal.aborted) setState(failure(reason)); });
    return () => controller.abort();
  }, [code]);

  // Each state replaces the dialog's buttons, so give focus to the first action again.
  useEffect(() => {
    dialog.current?.querySelector<HTMLElement>('a, button')?.focus();
  }, [state.kind]);

  useEffect(() => () => join.current?.abort(), []);

  function takeSeat() {
    if (joining) return;
    setJoining(true);
    const request = new AbortController();
    join.current = request;
    joinRoom(code, request.signal).then(
      room => { window.location.hash = `/rooms/${room.id}`; },
      reason => { if (!request.signal.aborted) { setJoining(false); setState(failure(reason)); } });
  }

  const notNow = <button type="button" className="action action-secondary" onClick={() => dialog.current?.close()}>Not now</button>;
  return <dialog ref={dialog} className="join-dialog" aria-labelledby="join-title" onClose={() => { window.location.hash = '/home'; }}>
    {state.kind === 'loading' && <>
      <h2 id="join-title">Opening the invite…</h2>
      <div className="action-bar">{notNow}</div>
    </>}
    {state.kind === 'preview' && <>
      <h2 id="join-title">{state.preview.creator_name} invited you to debate</h2>
      <div className="stack-8">
        <p className="label">Motion</p>
        <p className="join-motion">{state.preview.motion}</p>
      </div>
      <ul className="join-terms">{terms(state.preview).map(line => <li key={line}>{line}</li>)}</ul>
      <div className="action-bar">
        <button type="button" className="action action-primary" onClick={takeSeat}>Take the open seat</button>
        {notNow}
      </div>
    </>}
    {state.kind === 'error' && <>
      <h2 id="join-title">{state.title}</h2>
      <p>{state.detail}</p>
      <div className="action-bar">
        <ActionLink to="/rooms/new">Create a room</ActionLink>
        {notNow}
      </div>
    </>}
  </dialog>;
}
