import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ActionLink, Note, PageHeading } from '../components/ui';
import { AuthApiError, deleteAccount, listSessions, revokeSession } from '../auth/api';
import type { ActiveSession } from '../auth/contracts';
import { useSession } from '../auth/session';
import { useAuthForm } from '../auth/useAuthForm';
import { FormError, PasswordField } from './AccountPages';
import './account.css';

const formatTime = (value: string) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/** Shows the page only with a session; otherwise a sign-in prompt with the same heading. */
export function RequireSession({ title, children }: { title: string; children: ReactNode }) {
  const { session, restoring } = useSession();
  if (session) return <>{children}</>;
  return <div className="account-page account-form">
    <PageHeading title={title} />
    {restoring
      ? <p role="status" className="small muted">Checking your session…</p>
      : <>
        <p className="muted">Sign in to see this page.</p>
        <ActionLink to="/sign-in">Sign in</ActionLink>
      </>}
  </div>;
}

export function SessionsPage({ onSignOut }: { onSignOut: () => void }) {
  const [sessions, setSessions] = useState<ActiveSession[]>();
  const [loadError, setLoadError] = useState('');
  const [reload, setReload] = useState(0);
  const [confirming, setConfirming] = useState<string>();
  const [revoked, setRevoked] = useState(false);
  const { pending, message, run } = useAuthForm();

  useEffect(() => {
    const controller = new AbortController();
    setLoadError('');
    listSessions(controller.signal).then(setSessions, error => {
      if (!controller.signal.aborted) setLoadError(error instanceof AuthApiError ? error.message : 'Could not load your sessions.');
    });
    return () => controller.abort();
  }, [reload]);

  function revoke(id: string) {
    setRevoked(false);
    void run(signal => revokeSession(id, signal), () => {
      setConfirming(undefined);
      setRevoked(true);
      setSessions(current => current?.filter(item => item.id !== id));
    });
  }

  return <div className="account-page account-form" aria-busy={pending || !sessions}>
    <PageHeading title="Active sessions">Devices signed in to your account. Sign out any you do not recognise.</PageHeading>
    {loadError && <div className="note note-error" role="alert"><p className="small field-error">{loadError}</p>
      <button type="button" className="action action-text" onClick={() => setReload(reload + 1)}>Try again</button></div>}
    {!sessions && !loadError && <p role="status" className="small muted">Loading sessions…</p>}
    {revoked && <div role="status"><Note title="Session signed out" tone="success">That device must sign in again.</Note></div>}
    <FormError message={message} />
    {sessions && <ul className="session-list">
      {sessions.map(item => <li key={item.id} className="session-item">
        <p className="label">{item.device ?? 'Unknown device'}{item.current && <span className="account-status session-current">This device</span>}</p>
        <p className="small muted">Signed in {formatTime(item.created_at)} · Last active {formatTime(item.last_used_at)}</p>
        {item.current
          ? <button type="button" className="action action-secondary" onClick={onSignOut}>Sign out here</button>
          : confirming === item.id
            ? <div className="session-confirm">
              <p className="small">Sign out this device? It will need to sign in again.</p>
              <button type="button" className="action action-primary" disabled={pending} onClick={() => revoke(item.id)}>
                {pending ? 'Signing out…' : 'Confirm sign out'}</button>
              <button type="button" className="action action-text" disabled={pending} onClick={() => setConfirming(undefined)}>Cancel</button>
            </div>
            : <button type="button" className="action action-secondary" aria-label={`Sign out ${item.device ?? 'unknown device'}`}
              onClick={() => { setRevoked(false); setConfirming(item.id); }}>Sign out</button>}
      </li>)}
    </ul>}
    <nav className="account-secondary" aria-label="Account settings">
      <ActionLink to="/profile" variant="text">Back to profile</ActionLink>
    </nav>
  </div>;
}

export function DeleteAccountPage({ onDeleted }: { onDeleted: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const { form, pending, errors, message, validate, run } = useAuthForm();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) return;
    if (validate(password ? {} : { password: 'Enter your password.' })) {
      void run(signal => deleteAccount(password, signal), onDeleted);
    }
  }

  return <form ref={form} className="account-page account-form" noValidate onSubmit={submit} aria-busy={pending}>
    <PageHeading title="Delete account">This cannot be undone.</PageHeading>
    <Note title="What happens" tone="warning">
      You are signed out on every device straight away. Your profile, transcripts, analyses and reports
      are permanently deleted within 7 days.
    </Note>
    <FormError message={message} />
    <div className="account-fields">
      <PasswordField value={password} onChange={setPassword} error={errors.password} />
      <label className="delete-confirm">
        <input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />
        <span>I understand my account and debate data will be deleted.</span>
      </label>
    </div>
    <button type="submit" className="action action-primary" disabled={pending || !confirmed}>
      {pending ? 'Deleting…' : 'Delete my account'}</button>
    <nav className="account-secondary" aria-label="Account settings">
      <ActionLink to="/profile" variant="text">Keep my account</ActionLink>
    </nav>
  </form>;
}
