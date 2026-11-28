import { useEffect, useRef, useState } from 'react';
import { useSession } from '../../auth/session';
import { StageBar } from '../../components/Headers';
import { endRoom, getMediaToken } from '../../rooms/api';
import { countdownLeft, formatClock, phaseAt, secondsLeft, serverOffsetMs, timedPhases } from '../../rooms/clock';
import type { Participant, RoomSnapshot } from '../../rooms/contracts';
import { createDebateAudio, type DebateAudio } from '../../rooms/debateAudio';
import { initialSpotlight, nextSpotlight, type SpotlightState } from '../../rooms/spotlight';
import { useTypedTurns } from '../../rooms/useTypedTurns';
import { SideTag } from './InviteView';
import { TypePanel } from './TypePanel';
import './stage.css';

type Connection = 'connecting' | 'good' | 'poor' | 'lost';
const connectionText: Record<Connection, string> = {
  connecting: 'Connecting audio…', good: 'Connected', poor: 'Weak connection', lost: 'Connection lost. Reconnecting…',
};
const partnerWaitMs = 60_000;
const turnTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

function Spotlight({ spot, room, me }: { spot: SpotlightState; room: RoomSnapshot; me?: Participant }) {
  const people = spot.ids.map(id => room.participants.find(person => person.user_id === id)).filter((person): person is Participant => Boolean(person));
  if (spot.mode === 'idle' || people.length === 0) {
    return <div className="spotlight"><p className="spot-label">The floor is open</p></div>;
  }
  return <div className={`spotlight${spot.mode === 'both' ? ' spotlight-both' : ''}`}>
    {people.map(person => <div className="spot-person" key={person.user_id}>
      <p className="spot-label">
        {person.side && <SideTag side={person.side} />}
        <span>{spot.mode === 'quiet' ? 'Quiet' : spot.mode === 'typed' ? 'Typed' : 'Speaking'}</span>
        {person === me && <span className="spot-you">You</span>}
      </p>
      <p className="spot-name" data-testid="spotlight-name">{person.display_name}</p>
      {spot.mode === 'typed' && <p className="spot-text" data-testid="spotlight-text">{spot.text}</p>}
    </div>)}
  </div>;
}

/**
 * The live debate on the Ink stage. Audio connects once the shared countdown reaches zero and
 * disconnects when the stage unmounts (Back, the debate ending, or leaving the page).
 */
export function LiveStage({ room, onChange, rejoined, deviceId }: {
  room: RoomSnapshot; onChange: (room: RoomSnapshot) => void; rejoined: boolean; deviceId?: string;
}) {
  const { session } = useSession();
  const me = room.participants.find(person => person.user_id === session?.user.id);
  const partner = room.participants.find(person => person !== me);
  const publishMic = me?.input !== 'TYPE';
  const bothType = room.participants.length === 2 && room.participants.every(person => person.input === 'TYPE');

  const [offset, setOffset] = useState(() => serverOffsetMs(room, Date.now()));
  const [now, setNow] = useState(() => Date.now());
  const [muted, setMuted] = useState(rejoined);
  const [connection, setConnection] = useState<Connection>('connecting');
  const [audioFailed, setAudioFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [partnerPresent, setPartnerPresent] = useState<boolean>();
  const [partnerMuted, setPartnerMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [spot, setSpot] = useState(initialSpotlight);
  const [confirming, setConfirming] = useState(false);
  const [endFailed, setEndFailed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(!publishMic);
  const audio = useRef<DebateAudio>();
  const speakers = useRef<string[]>([]);
  const endButton = useRef<HTMLButtonElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const askedToEnd = useRef(false);
  const mutedNow = useRef(muted);
  mutedNow.current = muted;
  const typed = useTypedTurns(room.id, {
    announce: seq => { void audio.current?.announceTurn(seq); },
    onArrive: turn => setSpot(state => nextSpotlight(state, { type: 'typed', id: turn.user_id, text: turn.text }, Date.now())),
  });
  const refreshTurns = typed.refresh;

  useEffect(() => { setOffset(serverOffsetMs(room, Date.now())); }, [room]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);
  // Re-apply the latest speakers so a held name changes once its hold time is over.
  useEffect(() => {
    const timer = window.setInterval(() => setSpot(state => nextSpotlight(state, { type: 'speakers', ids: speakers.current }, Date.now())), 400);
    return () => window.clearInterval(timer);
  }, []);

  const serverNow = now + offset;
  const countdown = countdownLeft(room, serverNow);
  const started = countdown === 0;
  const left = secondsLeft(room, serverNow);

  useEffect(() => {
    if (!started) return;
    const instance = createDebateAudio();
    const controller = new AbortController();
    let connected = false;
    const unsubscribe = instance.subscribe(event => {
      if (event.type === 'speakers') {
        speakers.current = event.ids;
        setSpot(state => nextSpotlight(state, event, Date.now()));
      } else if (event.type === 'connection') setConnection(event.quality);
      else if (event.type === 'partner') { setPartnerPresent(event.present); setPartnerMuted(event.muted); }
      else if (event.type === 'playback-blocked') setBlocked(true);
      else if (event.type === 'turn') refreshTurns();
      else if (event.type === 'dropped') setAudioFailed(true);
    });
    setAudioFailed(false);
    setConnection('connecting');
    getMediaToken(room.id, controller.signal)
      .then(({ token, url }) => {
        if (controller.signal.aborted) return;
        connected = true;
        audio.current = instance;
        return instance.connect({ url, token, publishMic, startMuted: mutedNow.current, deviceId }).then(() => { if (!controller.signal.aborted) setConnection('good'); });
      })
      .catch(() => { if (!controller.signal.aborted) setAudioFailed(true); });
    return () => {
      controller.abort();
      unsubscribe();
      audio.current = undefined;
      if (connected) void instance.disconnect();
    };
  }, [started, room.id, publishMic, attempt, refreshTurns, deviceId]);

  // A partner who drops gets 60 seconds to come back before the debate ends for both.
  useEffect(() => {
    if (partnerPresent !== false) return;
    const timer = window.setTimeout(() => {
      endRoom(room.id, 'DISCONNECT', new AbortController().signal).then(onChange, () => {});
    }, partnerWaitMs);
    return () => window.clearTimeout(timer);
  }, [partnerPresent, room.id, onChange]);

  useEffect(() => {
    if (confirming) { askedToEnd.current = true; confirmButton.current?.focus(); }
    else if (askedToEnd.current) { askedToEnd.current = false; endButton.current?.focus(); }
  }, [confirming]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    void audio.current?.setMuted(next);
  }

  function end() {
    setEndFailed(false);
    endRoom(room.id, 'MANUAL', new AbortController().signal).then(onChange, () => { setEndFailed(true); setConfirming(false); });
  }

  const timed = room.format === 'TIMED_TURNS';
  const turn = timed && started ? phaseAt(room.duration_seconds - left) : undefined;
  const holderOf = (side: Participant['side']) => {
    if (!side) return 'Both';
    const holder = room.participants.find(person => person.side === side);
    return holder === me ? 'You' : holder?.display_name ?? side;
  };
  // Phase changes are announced to screen readers; the turn line already shows them on screen.
  const phaseNews = turn ? `${turn.phase.label}: ${holderOf(turn.phase.side)}` : '';
  const minuteNews = left > 0 && left <= 60 ? '1 minute left' : '';
  const partnerText = partnerPresent === false ? 'Lost connection' : partner?.input === 'TYPE' ? 'Typing'
    : partnerPresent === undefined ? 'Connecting…' : partnerMuted ? 'Muted' : 'Live';

  let start = 0;
  return <div className={`stage${panelOpen ? ' stage-with-panel' : ''}`}>
   <div className="stage-col">
    <StageBar className="stage-head">
      <p className="stage-chip">{bothType ? 'Live · Typed debate · Saved to transcript' : 'Live · Transcribing · Audio not saved'}</p>
    </StageBar>
    <div className="stage-clock">
      <div className="clock-bar" role="progressbar" aria-label="Time left" aria-valuemin={0} aria-valuemax={room.duration_seconds}
        aria-valuenow={left} aria-valuetext={`${formatClock(left)} left`}>
        <span className="clock-fill" style={{ width: `${(left / room.duration_seconds) * 100}%` }} />
        {timed && timedPhases.slice(0, -1).map((phase, index) => {
          start += phase.seconds;
          return <span key={index} className="clock-tick" style={{ left: `${(start / room.duration_seconds) * 100}%` }} />;
        })}
      </div>
      <span className="clock-digits" data-testid="clock-digits">{formatClock(left)}</span>
    </div>
    {turn && <p className="turn-line" data-testid="turn-line">{turn.phase.label} · {holderOf(turn.phase.side)} · {turnTime(turn.turnLeft)}</p>}
    <p className="sr-only" role="status">{phaseNews}</p>
    <p className="stage-status" role="status">{minuteNews}</p>
    <h1 className="stage-motion">{room.motion}</h1>

    <div className="stage-floor">
      {started
        ? <Spotlight spot={spot} room={room} me={me} />
        : <div className="stage-countdown" data-testid="countdown"><p className="spot-label">Starting in</p><p className="countdown-number">{countdown}</p></div>}
    </div>

    <div className="stage-notes">
      {partnerPresent === false && partner && <p className="stage-alert" role="status">{partner.display_name} lost connection. Waiting up to 60 seconds.</p>}
      {rejoined && muted && publishMic && <p className="stage-note">You're muted after rejoining.</p>}
      {blocked && <button type="button" className="action action-primary" onClick={() => { void audio.current?.resumePlayback(); setBlocked(false); }}>Turn on sound</button>}
      {audioFailed && <p className="stage-alert" role="alert">Audio is not connected. <button type="button" className="stage-link" onClick={() => setAttempt(value => value + 1)}>Try again</button></p>}
      {endFailed && <p className="stage-alert" role="alert">The debate could not be ended. Try again.</p>}
    </div>

    {partner && <div className="partner-chip" data-testid="partner-chip">
      <span className="partner-name">{partner.display_name}</span>
      {partner.side && <SideTag side={partner.side} />}
      <span className="partner-state">{partnerText}</span>
    </div>}

    <div className="stage-dock">
      <p className="dock-connection">{started ? connectionText[connection] : 'Audio opens at the start'}</p>
      {confirming
        ? <div className="dock-actions" role="group" aria-labelledby="end-question">
          <p id="end-question" className="dock-question">End for both of you?</p>
          <button ref={confirmButton} type="button" className="action stage-danger" onClick={end}>End for both of you</button>
          <button type="button" className="action stage-quiet" onClick={() => setConfirming(false)}>Keep debating</button>
        </div>
        : <div className="dock-actions">
          <button type="button" className="action stage-quiet stage-type" aria-expanded={panelOpen} aria-controls="type-panel"
            onClick={() => setPanelOpen(open => !open)}>Type</button>
          {publishMic && <button type="button" className="action stage-quiet" disabled={!started} onClick={toggleMute}>{muted ? 'Unmute' : 'Mute'}</button>}
          <button ref={endButton} type="button" className="action stage-danger" onClick={() => setConfirming(true)}>End debate</button>
        </div>}
    </div>
   </div>
    {panelOpen && <TypePanel turns={typed.turns} participants={room.participants} meId={me?.user_id} send={typed.send}
      sending={typed.sending} error={typed.error} onClose={() => setPanelOpen(false)} />}
  </div>;
}
