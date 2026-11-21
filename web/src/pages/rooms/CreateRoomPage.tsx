import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { ActionLink, Choices, PageHeading } from '../../components/ui';
import { createRoom } from '../../rooms/api';
import type { RoomFormat, Side, Topic } from '../../rooms/contracts';
import { useTopics } from '../../rooms/useTopics';
import './rooms.css';

const narrowQuery = '(max-width: 959px)';
function subscribeNarrow(callback: () => void) {
  const list = window.matchMedia(narrowQuery);
  list.addEventListener('change', callback);
  return () => list.removeEventListener('change', callback);
}
const useNarrow = () => useSyncExternalStore(subscribeNarrow, () => window.matchMedia(narrowQuery).matches);

const lengths = ['5 min', '10 min', '15 min', '20 min'];
const formats: Record<string, RoomFormat> = { 'Free flow': 'FREE_FLOW', 'Timed turns': 'TIMED_TURNS' };
const sides: Record<string, Side | 'RANDOM'> = { For: 'FOR', Random: 'RANDOM', Against: 'AGAINST' };
const topicMeta = (topic: Topic) => `${topic.category} · ${topic.cefr_level}`;

function MotionList({ topics, value, onPick }: { topics: Topic[]; value: string; onPick: (id: string) => void }) {
  return <fieldset className="motion-list">
    <legend className="sr-only">Motion</legend>
    {topics.map((topic, index) => <label key={topic.id} className="motion-option" style={{ '--i': index } as CSSProperties}>
      <input type="radio" name="motion" value={topic.id} checked={topic.id === value} onChange={() => onPick(topic.id)} />
      <span className="motion-option-text">{topic.motion}</span>
      <span className="motion-option-meta small">{topicMeta(topic)}{topic.id === value && <Check size={18} aria-hidden="true" />}</span>
    </label>)}
  </fieldset>;
}

/** Pick a motion and the room terms on one screen, then create the room and open it. */
export function CreateRoomPage({ initialTopicId }: { initialTopicId?: string }) {
  const { topics, failed, retry } = useTopics();
  const narrow = useNarrow();
  const [topicId, setTopicId] = useState(initialTopicId);
  const [length, setLength] = useState('10 min');
  const [format, setFormat] = useState('Free flow');
  const [side, setSide] = useState('Random');
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const controller = useRef<AbortController>();
  useEffect(() => () => controller.current?.abort(), []);

  const topic = topics?.find(item => item.id === topicId) ?? topics?.[0];
  if (!topics || !topic) {
    return <div className="stack-20">
      <PageHeading title="Create a room" />
      {failed || topics
        ? <div className="stack-12" role="alert"><p>The motions could not be loaded.</p><button type="button" className="action action-secondary short-action" onClick={retry}>Try again</button></div>
        : <p className="small muted" role="status">Loading motions…</p>}
    </div>;
  }
  const chosen = topic;

  function pick(id: string) {
    setTopicId(id);
    if (narrow) { setOpen(false); toggle.current?.focus(); }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(false);
    const request = new AbortController();
    controller.current = request;
    createRoom({ topic_id: chosen.id, format: formats[format], duration_minutes: parseInt(length, 10), side: sides[side] }, request.signal).then(
      room => { window.location.hash = `/rooms/${room.id}`; },
      () => { if (!request.signal.aborted) { setPending(false); setError(true); } });
  }

  const list = <MotionList topics={topics} value={chosen.id} onPick={pick} />;
  return <div className="create">
    <form className="create-form" data-testid="create-form" noValidate onSubmit={submit}>
      <div className="create-motion">
        <p className="label">Motion</p>
        <h1>{chosen.motion}</h1>
        <p className="small muted">{topicMeta(chosen)}</p>
        {narrow && <button ref={toggle} type="button" className="action action-secondary short-action" aria-expanded={open}
          aria-controls="motion-pane" onClick={() => setOpen(value => !value)}>Choose another motion</button>}
      </div>
      {narrow && open && <div id="motion-pane" className="create-pane" data-testid="motion-pane">{list}</div>}
      {format === 'Timed turns'
        ? <div className="field"><p className="label">Length</p><p>About 7 minutes</p><p className="small muted">Timed turns have fixed phases.</p></div>
        : <Choices label="Length" options={lengths} value={length} onChange={setLength} />}
      <Choices label="Format" options={Object.keys(formats)} value={format} onChange={setFormat} />
      <Choices label="Your side" options={Object.keys(sides)} value={side} onChange={setSide} />
      {error && <p role="alert" className="small field-error">The room could not be created. Try again.</p>}
      <div className="action-bar action-bar-sticky create-actions">
        <button type="submit" className="action action-primary">Create room</button>
        <ActionLink to="/home" variant="text" className="short-action">Back to home</ActionLink>
      </div>
    </form>
    {!narrow && <section className="create-pane" data-testid="motion-pane" aria-labelledby="motions-heading">
      <h2 id="motions-heading">Choose a motion</h2>
      {list}
    </section>}
  </div>;
}
