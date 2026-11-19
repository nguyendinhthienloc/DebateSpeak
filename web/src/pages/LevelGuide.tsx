import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { cefrLevels, type CefrLevel } from '../auth/contracts';

type Answer = 'yes' | 'some' | 'not';
const answers: { value: Answer; label: string }[] = [
  { value: 'yes', label: 'Yes' }, { value: 'some', label: 'Sometimes' }, { value: 'not', label: 'Not yet' },
];
// One self-assessment statement per level, in level order.
const statements: Record<CefrLevel, string> = {
  A2: 'I can say what I think about a simple topic, in short sentences.',
  B1: 'I can give a reason for my opinion and keep talking for a minute.',
  B2: 'I can answer someone who disagrees with me without long pauses.',
  C1: 'I can argue a complex point fluently and choose precise words.',
};

/** Climb from A2: "Yes" reaches a level and continues, "Sometimes" reaches it and stops, "Not yet" stops below it. Floor A2. */
function suggestLevel(given: Answer[]): CefrLevel {
  let reached = 0;
  for (const [index, answer] of given.entries()) {
    if (answer === 'not') break;
    reached = index;
    if (answer === 'some') break;
  }
  return cefrLevels[reached];
}

/** "I'm not sure" quick guide. Closes with the level to use, or with nothing. Sends and stores nothing. */
export function LevelGuide({ onDone }: { onDone: (level?: CefrLevel) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [given, setGiven] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<Answer>();
  const index = given.length;
  const finished = index > 0 && (given[index - 1] !== 'yes' || index === cefrLevels.length);
  const suggested = finished ? suggestLevel(given) : undefined;

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  function close(level?: CefrLevel) {
    dialog.current?.close(level ?? '');
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current) return;
    setGiven([...given, current]);
    setCurrent(undefined);
  }

  function back() {
    setCurrent(given[index - 1]);
    setGiven(given.slice(0, -1));
  }

  return <dialog ref={dialog} className="guide" aria-labelledby="guide-title"
    onClose={() => onDone((dialog.current?.returnValue || undefined) as CefrLevel | undefined)}>
    <div className="guide-top">
      <button type="button" className="guide-close" aria-label="Close quick guide" onClick={() => close()}><X size={22} aria-hidden="true" /></button>
      <div className="guide-bar" aria-hidden="true">
        {cefrLevels.map((level, step) => <span key={level} className={finished || step < index ? 'done' : undefined} />)}
      </div>
      <p className="guide-count">{finished ? 'Done' : `${index + 1} of up to ${cefrLevels.length}`}</p>
    </div>
    {suggested
      ? <div className="guide-body guide-result" key="result" data-step>
        <span className="guide-level" aria-hidden="true">{suggested}</span>
        <h2 id="guide-title">We suggest {suggested}</h2>
        <p>A starting point from your answers, not a test result. You can change it anytime.</p>
        <div className="guide-actions">
          <button type="button" className="action action-secondary" onClick={() => close()}>Choose myself</button>
          <button type="button" className="action action-primary" onClick={() => close(suggested)}>Use {suggested}</button>
        </div>
      </div>
      : <form className="guide-body" key={index} data-step={index > 0 || undefined} onSubmit={next}>
        <h2 id="guide-title" className="guide-statement">“{statements[cefrLevels[index]]}”</h2>
        <fieldset className="guide-answers">
          <legend>Is this true for you when you speak English?</legend>
          {answers.map(answer => <label key={answer.value} className="guide-answer">
            <input type="radio" name="guide-answer" value={answer.value} checked={current === answer.value} onChange={() => setCurrent(answer.value)} />
            <span>{answer.label}</span>
          </label>)}
        </fieldset>
        <div className="guide-actions">
          {index > 0 && <button type="button" className="action action-secondary" onClick={back}>Back</button>}
          <button type="submit" className="action action-primary" disabled={!current}>Continue</button>
        </div>
      </form>}
  </dialog>;
}
