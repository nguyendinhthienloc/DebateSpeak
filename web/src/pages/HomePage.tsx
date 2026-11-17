import { useState, type CSSProperties, type FormEvent } from 'react';
import { ActionLink, Field } from '../components/ui';
import { useSession } from '../auth/session';
import { normalizeInviteCode } from '../inviteCode';
import './home.css';

// Sample content until the topic catalogue (FG-02) and history (FG-10) exist.
const sampleTopics = [
  { motion: 'Social media does more harm than good for teenagers', meta: 'Society · B1' },
  { motion: 'Cities should ban private cars from the centre', meta: 'Environment · B1' },
  { motion: 'Homework should be optional in secondary school', meta: 'Education · B1' },
  { motion: 'Online friendships are as real as offline ones', meta: 'Society · B2' },
];
const sampleDebates = [
  { motion: 'Remote work beats the office', date: '12 Nov', partner: 'Minh', report: 'Report ready' },
  { motion: 'Exams should be replaced by projects', date: '8 Nov', partner: 'An', report: 'Processing' },
];

const order = (index: number) => ({ '--i': index }) as CSSProperties;

function greeting(hour = new Date().getHours()) {
  if (hour < 12) return 'Good morning';
  return hour < 18 ? 'Good afternoon' : 'Good evening';
}

export function HomePage() {
  const { session } = useSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!normalizeInviteCode(code)) {
      setError('Enter the 8-character code from your partner.');
      document.getElementById('invite-code')?.focus();
      return;
    }
    // Build 1 has no join API: open the invitation preview. The code is never put in the URL.
    setError(undefined);
    window.location.hash = '/invite';
  }

  return <div className="home">
    <p className="lead home-greeting">{greeting()}, {session?.user.display_name ?? 'Learner'}.</p>
    <div className="home-doors">
      <section className="home-door home-door-create" aria-labelledby="create-heading" style={order(0)}>
        <h1 id="create-heading">Create a room</h1>
        <p>Pick a motion and invite your partner with a code.</p>
        <div className="home-door-actions">
          <ActionLink to="/rooms/new" className="home-create">Set up room</ActionLink>
          <span className="small">Free flow · 10 min · Stances at random</span>
        </div>
      </section>
      <section className="home-door home-door-join" aria-labelledby="join-heading" style={order(1)}>
        <h2 id="join-heading">Join with code</h2>
        <p>Your partner sends an 8-character code.</p>
        <form className="home-join" noValidate onSubmit={join}>
          <Field id="invite-code" name="code" label="Invite code" autoComplete="off" autoCapitalize="characters"
            spellCheck={false} maxLength={11} placeholder="K7Q2 M9XA" value={code} error={error}
            onChange={event => setCode(event.target.value)} />
          <button className="action action-primary" type="submit">Join</button>
        </form>
      </section>
    </div>
    <p className="small muted">Creating or joining a room never starts audio or transcription.</p>
    <section className="home-section" aria-labelledby="topics-heading" style={order(2)}>
      <div className="home-section-head"><h2 id="topics-heading">Sample topics</h2><span className="home-tag">Sample</span></div>
      <ul className="home-topics">
        {sampleTopics.map(topic => <li key={topic.motion} className="home-topic">
          <span className="home-topic-motion">{topic.motion}</span><span className="small muted">{topic.meta}</span>
        </li>)}
      </ul>
    </section>
    <section className="home-section" aria-labelledby="history-heading" style={order(3)}>
      <div className="home-section-head"><h2 id="history-heading">Recent debates</h2><span className="home-tag">Sample</span></div>
      <div className="home-table">
        <table>
          <thead><tr><th scope="col">Motion</th><th scope="col">Date</th><th scope="col">Partner</th><th scope="col">Report</th></tr></thead>
          <tbody>{sampleDebates.map(debate => <tr key={debate.motion}>
            <td>{debate.motion}</td><td>{debate.date}</td><td>{debate.partner}</td><td>{debate.report}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
    <p className="small muted home-note">Topics and history show sample content. No real debate is listed.</p>
  </div>;
}
