import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ActionLink } from '../components/ui';
import { StageBar } from '../components/Headers';
import { useSession } from '../auth/session';
import './welcome.css';

type Side = 'FOR' | 'AGAINST';
const sides: readonly Side[] = ['FOR', 'AGAINST'];
const motion = 'Cities should ban private cars from the centre';
const acts = ['Try a motion', 'Invite a partner', 'Debate out loud', 'Read the transcript', 'Get feedback', 'Your turn'] as const;
// One example exchange: PRO opens, CON answers.
const transcript: { side: Side; text: string }[] = [
  { side: 'FOR', text: 'I think cars is bad for the air in the centre, so the city should ban them.' },
  { side: 'AGAINST', text: 'People who cannot walk far need a car to reach the centre.' },
  { side: 'FOR', text: 'Buses can carry those people, and the air is cleaner for everyone.' },
  { side: 'AGAINST', text: 'Buses do not run at night, so a ban hurts night workers.' },
];
const feedback: Record<Side, { quote: string; language: string; argument: string }> = {
  FOR: { quote: 'I think cars is bad for the air', language: '“cars is” → “cars are”. A plural subject takes a plural verb.', argument: 'A claim without evidence. Add one example, such as a city that tried it.' },
  AGAINST: { quote: 'Buses do not run at night', language: 'Clear and correct. Try “do not run late at night” for precision.', argument: 'Strong rebuttal. Name who is hurt: “nurses on night shifts”.' },
};

function Tag({ coming = false }: { coming?: boolean }) {
  return <span className={`w-tag${coming ? ' w-tag-coming' : ''}`}>{coming ? 'Coming in a later release' : 'In preview'}</span>;
}

/** A lectern with a white name plate; the visitor's side is lit. */
function Podium({ side, mine, onChoose, small = false }: { side: Side; mine?: Side; onChoose?: (side: Side) => void; small?: boolean }) {
  const lit = mine === side;
  const who = lit ? 'You' : mine ? 'Your partner' : side === 'FOR' ? 'PRO · argues for it' : 'CON · argues against it';
  const plate = <><span className="w-nameplate"><b>{side}</b><span>{who}</span></span><span className="w-lectern-body" aria-hidden="true" /></>;
  return <div className={`w-podium${lit ? ' is-lit' : ''}${small ? ' is-small' : ''}`}>
    <span className="w-light" aria-hidden="true" />
    {onChoose
      ? <button type="button" className="w-lectern" aria-pressed={lit} onClick={() => onChoose(side)}>{plate}</button>
      : <div className="w-lectern">{plate}</div>}
  </div>;
}

/** The stage's two fixed positions: FOR on the left, AGAINST on the right. */
function Sides({ mine, render }: { mine: Side; render: (side: Side, yours: boolean) => ReactNode }) {
  return <div className="w-sides">
    {sides.map(side => <div key={side} className={`w-side${side === mine ? ' is-mine' : ''}`}>
      <p className="w-side-head"><b>{side}</b><span>{side === mine ? 'You' : 'Your partner'}</span></p>
      {render(side, side === mine)}
    </div>)}
  </div>;
}

export function WelcomePage() {
  const { session } = useSession();
  const [side, setSide] = useState<Side>();
  const [active, setActive] = useState(0);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const mine = side ?? 'FOR';
  const theirs: Side = mine === 'FOR' ? 'AGAINST' : 'FOR';

  // Snap the document while this page is open; the class is removed on leave.
  useEffect(() => {
    document.documentElement.classList.add('w-snap');
    return () => document.documentElement.classList.remove('w-snap');
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.act));
    }, { threshold: 0.55 });
    sections.current.forEach(section => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const act = (index: number) => ({
    ref: (element: HTMLElement | null) => { sections.current[index] = element; },
    id: `act-${index + 1}`, 'data-act': index, 'data-active': active === index || undefined,
    'aria-labelledby': `act-${index + 1}-title`,
  });
  const accountActions = session
    ? <ActionLink to="/home" className="w-btn w-btn-yellow">Open DebateSpeak</ActionLink>
    : <><ActionLink to="/register" className="w-btn w-btn-yellow">Create account</ActionLink>
      <ActionLink to="/sign-in" variant="secondary" className="w-btn w-btn-ghost">Sign in</ActionLink></>;

  return <div className="welcome">
    <StageBar>
      <nav className="w-nav-actions" aria-label="Account">
        {session
          ? <ActionLink to="/home" className="w-btn w-btn-yellow">Open DebateSpeak</ActionLink>
          : <><ActionLink to="/sign-in" variant="secondary" className="w-btn w-btn-ghost">Sign in</ActionLink>
            <ActionLink to="/register" className="w-btn w-btn-yellow">Create account</ActionLink></>}
      </nav>
    </StageBar>

    <nav className="w-progress" aria-label="Acts">
      {acts.map((name, index) => <a key={name} href={`#act-${index + 1}`} aria-current={active === index ? 'step' : undefined}
        onClick={event => { event.preventDefault(); sections.current[index]?.scrollIntoView(); }}>
        <span className="w-rail-label">{index + 1}. {name}</span>
      </a>)}
    </nav>

    <section className="w-act w-stage w-first" {...act(0)}>
      <div className="w-banner">
        <h1 id="act-1-title">{motion}</h1>
        <p className="w-banner-foot">Example motion · nothing is recorded</p>
      </div>
      <div className="w-podiums" role="group" aria-label="Choose a side">
        <Podium side="FOR" mine={side} onChoose={setSide} />
        <div className="w-centre" aria-live="polite">
          {side
            ? <><p className="w-centre-lead">You argue <b>{side}</b>. Your partner takes {theirs}.</p>
              <ActionLink to="/register" className="w-btn w-btn-yellow">Create account to find a partner</ActionLink></>
            : <p className="w-centre-lead">Step up to a podium. Your partner takes the other one.</p>}
        </div>
        <Podium side="AGAINST" mine={side} onChoose={setSide} />
      </div>
    </section>

    <section className="w-act w-cream w-staged" {...act(1)}>
      <div className="w-top">
        <header className="w-head">
          <h2 id="act-2-title">One code. One partner.</h2>
          <p>Send the code; your partner takes the other podium. Two seats, never a third. <Tag /></p>
        </header>
        <p className="w-code" aria-label="Example room code ABCD 2345">ABCD 2345</p>
      </div>
      <Sides mine={mine} render={(_, yours) => <div className={`w-seat${yours ? '' : ' w-seat-open'}`}>
        <span className="w-avatar" aria-hidden="true">{yours ? 'A' : <i />}</span>
        <b>{yours ? 'You are in' : 'Open seat'}</b><span>{yours ? 'Waiting in the lobby' : 'Waiting for your partner'}</span>
      </div>} />
      <p className="w-example">Example room</p>
    </section>

    <section className="w-act w-ink w-staged" {...act(2)}>
      <header className="w-head">
        <h2 id="act-3-title">Two microphones. Two separate tracks.</h2>
        <p>Each podium has its own audio track, so every line knows who said it. Audio starts only when you both agree. <Tag coming /></p>
      </header>
      <Sides mine={mine} render={(_, yours) => <div className={`w-track${yours ? ' is-mine' : ''}`}>
        <span className="w-wave" aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ '--h': `${18 + ((i * (yours ? 37 : 23)) % 72)}%`, '--d': `${(i % 7) * 90}ms` } as CSSProperties} />)}</span>
      </div>} />
      <p className="w-example">Example · 04:12 of 10:00</p>
    </section>

    <section className="w-act w-yellow w-staged" {...act(3)}>
      <header className="w-head">
        <h2 id="act-4-title">Every word, on its own side.</h2>
        <p>After the debate, read the exchange line by line, each on the speaker's side. <Tag coming /></p>
      </header>
      <Sides mine={mine} render={each => <ol className="w-transcript" aria-label={`Example transcript, ${each} lines`}>
        {transcript.filter(line => line.side === each).map(line => <li key={line.text}><p>{line.text}</p></li>)}
      </ol>} />
      <p className="w-example">Example transcript</p>
    </section>

    <section className="w-act w-cream w-staged" {...act(4)}>
      <header className="w-head">
        <h2 id="act-5-title">Feedback that quotes you.</h2>
        <p>Each note will quote your exact words, say what went wrong, and show a better way to say it. <Tag coming /></p>
      </header>
      <Sides mine={mine} render={(each, yours) => yours
        ? <div className="w-note">
          <p className="w-quote">“{feedback[each].quote}”</p>
          <p><b>Language</b>{feedback[each].language}</p>
          <p><b>Argument</b>{feedback[each].argument}</p>
        </div>
        : <div className="w-note w-note-other"><p>Your partner gets notes on their own words.</p></div>} />
      <p className="w-example">Example feedback · not a real result</p>
    </section>

    <section className="w-act w-stage w-close" {...act(5)}>
      <h2 id="act-6-title">Your turn at the podium.</h2>
      <p>{side ? `You argued ${side}. Bring one partner to argue ${theirs}.` : 'Bring one partner. Any English level from A2 to C1.'}</p>
      <div className="w-close-actions">
        {accountActions}
      </div>
      <div className="w-podiums w-podiums-small" aria-hidden="true">
        <Podium side="FOR" mine={side} small />
        <Podium side="AGAINST" mine={side} small />
      </div>
    </section>
  </div>;
}
