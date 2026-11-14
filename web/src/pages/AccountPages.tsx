import { useState } from 'react';
import { ActionLink, BackToRooms, Choices, Field, Note, PageHeading } from '../components/ui';
import type { FormEvent } from 'react';
import { login, register } from '../auth/api';
import { cefrLevels, type CefrLevel, type TokenResponse } from '../auth/contracts';
import { useAuthForm } from '../auth/useAuthForm';
import { validateCredentials, validateRegistration } from '../auth/validation';

const levels = cefrLevels;

function PasswordField({ value, onChange, error, creating = false }: {
  value: string; onChange: (value: string) => void; error?: string; creating?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const id = creating ? 'register-password' : 'sign-in-password';
  return <div className="stack-8">
    <Field id={id} name="password" label="Password" required
      type={showPassword ? 'text' : 'password'} autoComplete={creating ? 'new-password' : 'current-password'}
      value={value} onChange={event => onChange(event.target.value)} error={error}
      placeholder={creating ? 'Create a password' : 'Enter your password'}
      hint={creating ? 'Use 12–128 characters. Spaces and password managers are welcome.' : undefined} />
    <button type="button" className="action action-text self-start" aria-controls={id}
      aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? 'Hide password' : 'Show password'}
    </button>
  </div>;
}

function FormError({ message }: { message: string }) {
  return message ? <div className="note note-error" role="alert"><p className="small field-error">{message}</p></div> : null;
}

export function SignInPage({ registeredEmail, expired = false, onSignedIn }: {
  registeredEmail?: string; expired?: boolean; onSignedIn: (response: TokenResponse) => void;
}) {
  const [email, setEmail] = useState(registeredEmail ?? '');
  const [password, setPassword] = useState('');
  const { form, pending, errors, message, validate, run } = useAuthForm();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { email: email.trim(), password };
    setEmail(input.email);
    if (validate(validateCredentials(input))) void run(signal => login(input, signal), onSignedIn);
  }

  return <form ref={form} className="auth-form stack-16" noValidate onSubmit={submit} aria-busy={pending}>
    <PageHeading title="Sign in">Create a room or join your partner.</PageHeading>
    {registeredEmail && <div role="status"><Note title="Account created" tone="success">Sign in with your email and password.</Note></div>}
    {expired && <p role="status" className="small">Your session expired. Sign in again.</p>}
    <FormError message={message} />
    <Field name="email" label="Email" type="email" required autoComplete="username" autoCapitalize="none" spellCheck={false}
      value={email} onChange={event => setEmail(event.target.value)} error={errors.email} placeholder="learner@example.com" />
    <PasswordField value={password} onChange={setPassword} error={errors.password} />
    <button className="action action-primary" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
    <ActionLink to="/register" variant="text">Create account</ActionLink>
    <p className="small muted">For now, reload signs you out. Rooms and audio remain previews.</p>
    <ActionLink to="/rooms" variant="text">Preview rooms</ActionLink>
  </form>;
}

export function RegisterPage({ onRegistered }: { onRegistered: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [level, setLevel] = useState<CefrLevel>('B1');
  const { form, pending, errors, message, validate, run } = useAuthForm();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = displayName.trim();
    const input = { email: email.trim(), password, ...(name ? { display_name: name } : {}), cefr_level: level };
    setEmail(input.email);
    if (validate(validateRegistration(input))) {
      void run(signal => register(input, signal), response => onRegistered(response.email));
    }
  }

  return <form ref={form} className="auth-form stack-16" noValidate onSubmit={submit} aria-busy={pending}>
    <PageHeading title="Create your account">Practice a clear point of view, with a partner.</PageHeading>
    <FormError message={message} />
    <Field name="email" label="Email" type="email" required autoComplete="username" autoCapitalize="none" spellCheck={false}
      value={email} onChange={event => setEmail(event.target.value)} error={errors.email} placeholder="name@example.com" />
    <PasswordField creating value={password} onChange={setPassword} error={errors.password} />
    <Field name="display_name" label="Display name (optional)" autoComplete="nickname" placeholder="Your display name"
      value={displayName} onChange={event => setDisplayName(event.target.value)} error={errors.display_name}
      hint="If left empty, your name will be Learner." />
    <Choices label="Your English level" options={levels} value={level} onChange={value => setLevel(value as CefrLevel)} error={errors.cefr_level} />
    <p className="small muted">Choose your current level. You can change it later; this is not a certification.</p>
    <button className="action action-primary" type="submit" disabled={pending}>{pending ? 'Creating account…' : 'Create account'}</button>
    <ActionLink to="/sign-in" variant="text">Already have an account? Sign in</ActionLink>
  </form>;
}

export function ProfilePage() {
  const [level, setLevel] = useState('B1');
  return <div className="stack-20">
    <PageHeading title="Your profile">Keep your display name and English level up to date.</PageHeading>
    <div className="form-column stack-20">
      <Field label="Display name" defaultValue="Learner A" />
      <Choices label="English level" options={levels} value={level} onChange={setLevel} />
      <p className="small muted">Your email and account role cannot be changed here.</p>
      <button type="button" className="action action-primary" disabled aria-describedby="profile-limit">Save changes</button>
      <p id="profile-limit" className="small muted">Sample profile. Profile saving is not connected yet.</p>
      <BackToRooms />
      <ActionLink to="/sign-in" variant="secondary" className="short-action">Back to sign in</ActionLink>
    </div>
  </div>;
}
