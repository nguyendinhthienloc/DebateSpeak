import { useState, type FormEvent } from 'react';
import { ActionLink, Field, Note, PageHeading } from '../components/ui';
import { findUser, setSuspended } from '../auth/api';
import { isEmail, type AdminUser } from '../auth/contracts';
import { useSession } from '../auth/session';
import { useAuthForm } from '../auth/useAuthForm';
import { FormError } from './AccountPages';
import './account.css';

/** UC-01-08. The link is hidden for non-admins; the server is the only authority on role. */
export function AdminUsersPage() {
  const { session } = useSession();
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<AdminUser>();
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [changed, setChanged] = useState('');
  const search = useAuthForm();
  const action = useAuthForm();

  if (session?.user.role !== 'ADMIN') {
    return <div className="account-page account-form">
      <PageHeading title="Manage accounts" />
      <p className="muted">Only administrators can manage accounts.</p>
      <ActionLink to="/profile" variant="text">Back to profile</ActionLink>
    </div>;
  }

  function lookUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    setEmail(value);
    setUser(undefined);
    setConfirming(false);
    setChanged('');
    if (search.validate(isEmail(value) ? {} : { email: 'Enter a valid email address.' })) {
      void search.run(signal => findUser(value, signal), setUser);
    }
  }

  function apply(target: AdminUser, suspend: boolean) {
    const text = reason.trim();
    if (suspend && !action.validate(text && [...text].length <= 500 ? {} : { reason: 'Give a reason of up to 500 characters.' })) return;
    void action.run(signal => setSuspended(target.id, suspend, text, signal), updated => {
      setUser(updated);
      setConfirming(false);
      setReason('');
      setChanged(updated.is_suspended ? 'Account suspended. The user is signed out everywhere.' : 'Account reactivated.');
    });
  }

  return <div className="account-page account-form">
    <PageHeading title="Manage accounts">Find an account by email, then suspend or reactivate it.</PageHeading>
    <form ref={search.form} className="account-fields" noValidate onSubmit={lookUp} aria-busy={search.pending}>
      <FormError message={search.message} />
      <Field name="email" label="Account email" type="email" autoCapitalize="none" spellCheck={false}
        value={email} onChange={event => setEmail(event.target.value)} error={search.errors.email} />
      <button type="submit" className="action action-secondary" disabled={search.pending}>{search.pending ? 'Searching…' : 'Find account'}</button>
    </form>
    {user && <section className="admin-user" aria-labelledby="admin-user-heading" aria-busy={action.pending}>
      <h2 id="admin-user-heading">{user.display_name}</h2>
      <p className="small">{user.email} · {user.role === 'ADMIN' ? 'Admin' : 'Learner'}</p>
      <p className="small"><span className="account-status">{user.is_suspended ? 'Suspended' : 'Active'}</span></p>
      {changed && <div role="status"><Note title="Saved" tone="success">{changed}</Note></div>}
      <FormError message={action.message} />
      {user.id === session.user.id
        ? <p className="small muted">This is your account. Another administrator must change its status.</p>
        : user.is_suspended
        ? <button type="button" className="action action-primary" disabled={action.pending} onClick={() => apply(user, false)}>
          {action.pending ? 'Reactivating…' : 'Reactivate account'}</button>
        : <form ref={action.form} className="account-fields" noValidate onSubmit={event => { event.preventDefault(); if (confirming) apply(user, true); else setConfirming(true); }}>
          <Field name="reason" label="Reason for suspension" value={reason} onChange={event => setReason(event.target.value)}
            error={action.errors.reason} hint="Recorded for audit. The user does not see it here." />
          {confirming && <p className="small" role="status">Suspend {user.email}? They are signed out on every device and cannot sign in until reactivated.</p>}
          <button type="submit" className="action action-primary" disabled={action.pending}>
            {action.pending ? 'Suspending…' : confirming ? 'Confirm suspension' : 'Suspend account'}</button>
          {confirming && <button type="button" className="action action-text" onClick={() => setConfirming(false)}>Cancel</button>}
        </form>}
    </section>}
    <nav className="account-secondary" aria-label="Account settings">
      <ActionLink to="/profile" variant="text">Back to profile</ActionLink>
    </nav>
  </div>;
}
