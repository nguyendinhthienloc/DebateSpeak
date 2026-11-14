import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ActionLink, Field, Note, PageHeading } from '../components/ui';
import { recoverAccount } from '../auth/api';
import { isEmail, type FieldErrors } from '../auth/contracts';
import { useAuthForm } from '../auth/useAuthForm';
import { PasswordField } from './AccountPages';

export function RecoveryForm({ mode }: { mode: 'request' | 'verify' | 'reset' }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [resent, setResent] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const { form, pending, errors, message, validate, run } = useAuthForm();
  const verifying = mode === 'verify';
  const requesting = mode === 'request';

  useEffect(() => { if (done) result.current?.focus(); }, [done]);

  function emailErrors(): FieldErrors {
    return isEmail(email.trim()) ? {} : { email: 'Enter a valid email address (up to 254 characters).' };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = emailErrors();
    const input = { email: email.trim(), code: code.trim() };
    if (!requesting && (input.code.length < 6 || input.code.length > 128)) {
      fields.code = 'Enter the code from your email (6–128 characters).';
    }
    if (mode === 'reset' && ([...password].length < 12 || [...password].length > 128)) {
      fields.password = 'Use 12–128 characters.';
    }
    if (!validate(fields)) return;
    setResent(false);
    void run(signal => requesting
      ? recoverAccount('forgot-password', { email: input.email }, signal)
      : verifying ? recoverAccount('verify-email', input, signal)
        : recoverAccount('reset-password', { ...input, password }, signal), () => {
      setCode('');
      setPassword('');
      setDone(true);
    });
  }

  function resend() {
    if (!validate(emailErrors())) return;
    setResent(false);
    void run(signal => recoverAccount('resend-verification', { email: email.trim() }, signal), () => setResent(true));
  }

  if (done) return <div ref={result} tabIndex={-1} className="auth-form stack-16">
    <PageHeading title={requesting ? 'Check your email' : verifying ? 'Email verified' : 'Password updated'}>
      {requesting ? 'If an account matches that email, we’ll send a code to reset your password.'
        : verifying ? 'Your email is verified. You can return to sign in.'
          : 'Your new password is ready. Sign in to continue.'}
    </PageHeading>
    {requesting ? <>
      <p className="small muted">Check your spam folder too. Use the most recent code you receive.</p>
      <ActionLink to="/reset-password">Enter reset code</ActionLink>
      <button className="action action-secondary" type="button" onClick={() => setDone(false)}>Try another email or resend</button>
      <ActionLink to="/sign-in" variant="text">Back to sign in</ActionLink>
    </> : <ActionLink to="/sign-in">Back to sign in</ActionLink>}
  </div>;

  return <form ref={form} className="auth-form stack-16" noValidate onSubmit={submit} aria-busy={pending}>
    <PageHeading title={requesting ? 'Forgot password?' : verifying ? 'Verify your email' : 'Reset password'}>
      {requesting ? 'Enter your email and we’ll help you get back to your account.'
        : verifying ? 'Enter your email and the code from your inbox to confirm it’s you.'
          : 'Enter the code from your email and choose a new password.'}
    </PageHeading>
    {message && <div className="note note-error" role="alert"><p className="small field-error">{message}</p></div>}
    {resent && <div role="status"><Note title="Check your inbox">If your account needs verification, we’ll send a new code. Check your spam folder too.</Note></div>}
    <Field name="email" label="Email" type="email" required autoComplete="username" autoCapitalize="none" spellCheck={false}
      value={email} onChange={event => { setEmail(event.target.value); setResent(false); }} error={errors.email} placeholder="learner@example.com" />
    {!requesting && <Field name="code" label="Email code" required autoComplete="one-time-code" autoCapitalize="none" spellCheck={false}
      value={code} onChange={event => setCode(event.target.value)} error={errors.code} placeholder="Enter your code"
      hint="Use the most recent code sent to your email." />}
    {mode === 'reset' && <PasswordField creating value={password} onChange={setPassword} error={errors.password} />}
    <button className="action action-primary" type="submit" disabled={pending}>
      {pending ? 'Please wait…' : requesting ? 'Send reset code' : verifying ? 'Verify email' : 'Reset password'}
    </button>
    {verifying && <button className="action action-secondary" type="button" disabled={pending} onClick={resend}>Send a new code</button>}
    {requesting && <ActionLink to="/reset-password" variant="text">Already have a reset code?</ActionLink>}
    {mode === 'reset' && <ActionLink to="/forgot-password" variant="text">Request a new code</ActionLink>}
    <ActionLink to="/sign-in" variant="text">Back to sign in</ActionLink>
  </form>;
}

// UC-01-05 is not implemented or enabled in this build, so recovery stays inert.
const RECOVERY_ENABLED = false;

export function RecoveryPage({ mode }: { mode: 'request' | 'verify' | 'reset' }) {
  if (RECOVERY_ENABLED) return <RecoveryForm mode={mode} />;
  return <div className="auth-form stack-16">
    <PageHeading title="Account recovery is not available in this build" />
    <ActionLink to="/sign-in" variant="text">Back to sign in</ActionLink>
  </div>;
}
