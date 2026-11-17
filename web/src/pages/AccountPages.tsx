import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ActionLink, BackToRooms, Choices, Field, Note, PageHeading, StepIndicator } from '../components/ui';
import type { FormEvent } from 'react';
import { AuthApiError, getProfile, login, register, updateProfile } from '../auth/api';
import { cefrLevels, type CefrLevel, type ProfileResponse, type TokenResponse } from '../auth/contracts';
import { updateSessionUser, useSession } from '../auth/session';
import { useAuthForm } from '../auth/useAuthForm';
import { validateCredentials, validateProfile, validateRegistration } from '../auth/validation';
import './account.css';

const levels = cefrLevels;
const registerSteps = ['Account', 'Learning profile'] as const;

export function PasswordField({ value, onChange, error, creating = false }: {
  value: string; onChange: (value: string) => void; error?: string; creating?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const id = creating ? 'register-password' : 'sign-in-password';
  return <Field id={id} name="password" label="Password" required
      type={showPassword ? 'text' : 'password'} autoComplete={creating ? 'new-password' : 'current-password'}
      value={value} onChange={event => onChange(event.target.value)} error={error}
      placeholder={creating ? 'Create a password' : 'Enter your password'}
      hint={creating ? '12–128 characters. Spaces allowed.' : undefined}
      trailingAction={<button type="button" className="password-toggle" aria-controls={id}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      <span>{showPassword ? 'Hide' : 'Show'}</span>
    </button>} />;
}

export function FormError({ message }: { message: string }) {
  return message ? <div className="note note-error" role="alert"><p className="small field-error">{message}</p></div> : null;
}

export function SignInPage({ registeredEmail, expired = false, notice, onSignedIn }: {
  registeredEmail?: string; expired?: boolean; notice?: string; onSignedIn: (response: TokenResponse) => void;
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

  return <form ref={form} className="account-page auth-form account-form" noValidate onSubmit={submit} aria-busy={pending}>
    <PageHeading title="Sign in" />
    {registeredEmail && <div role="status"><Note title="Account created" tone="success">Sign in with your email and password.</Note></div>}
    {expired && <p role="status" className="small">Your session expired. Sign in again.</p>}
    {notice && <p role="status" className="small">{notice}</p>}
    <FormError message={message} />
    <div className="account-fields">
      <Field name="email" label="Email" type="email" required autoComplete="username" autoCapitalize="none" spellCheck={false}
      value={email} onChange={event => setEmail(event.target.value)} error={errors.email} placeholder="learner@example.com" />
      <PasswordField value={password} onChange={setPassword} error={errors.password} />
    </div>
    <button className="action action-primary" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
    <div className="account-switch"><span className="muted">New to DebateSpeak?</span><ActionLink to="/register" variant="text">Create account</ActionLink></div>
    <div className="account-limit">
      <ActionLink to="/rooms" variant="text">Preview rooms</ActionLink>
    </div>
  </form>;
}

export function RegisterPage({ onRegistered }: { onRegistered: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [level, setLevel] = useState<CefrLevel>('B1');
  const [chosen, setChosen] = useState<1 | 2>(1);
  const [moved, setMoved] = useState(false);
  const { form, pending, errors, message, validate, run } = useAuthForm();
  // Errors on step-1 fields (local or from the server) always show step 1, in the same render,
  // so useAuthForm can focus the invalid input.
  const step = errors.email || errors.password ? 1 : chosen;

  function go(next: 1 | 2) {
    setChosen(next);
    setMoved(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = displayName.trim();
    const input = { email: email.trim(), password, ...(name ? { display_name: name } : {}), cefr_level: level };
    setEmail(input.email);
    if (step === 1) {
      if (validate(validateCredentials({ email: input.email, password }))) go(2);
      return;
    }
    if (validate(validateRegistration(input))) {
      void run(signal => register(input, signal), response => onRegistered(response.email));
    }
  }

  return <form ref={form} className="account-page auth-form account-form register-form" noValidate onSubmit={submit} aria-busy={pending}>
    <PageHeading title="Create your account" />
    <StepIndicator current={step} labels={registerSteps} focus={Object.keys(errors).length === 0} />
    <FormError message={message} />
    <div className="register-viewport"><div key={step} className="register-step account-fields" data-direction={moved ? (step === 1 ? 'back' : 'forward') : undefined}>
      {step === 1 ? <>
        <Field name="email" label="Email" type="email" required autoComplete="username" autoCapitalize="none" spellCheck={false}
        value={email} onChange={event => setEmail(event.target.value)} error={errors.email} placeholder="name@example.com" />
        <PasswordField creating value={password} onChange={setPassword} error={errors.password} />
      </> : <>
        <Field name="display_name" label="Display name (optional)" autoComplete="nickname" placeholder="Your display name"
        value={displayName} onChange={event => setDisplayName(event.target.value)} error={errors.display_name}
        hint="Leave blank to appear as Learner." />
        <Choices label="Your English level" options={levels} value={level} onChange={value => setLevel(value as CefrLevel)} error={errors.cefr_level} describe />
        <p className="small muted">Self-assessed, not a certification. Change it anytime.</p>
      </>}
    </div></div>
    {step === 1
      ? <button className="action action-primary" type="submit" disabled={pending}>Continue</button>
      : <div className="register-actions">
        <button className="action action-secondary" type="button" onClick={() => { validate({}); go(1); }} disabled={pending}>Back</button>
        <button className="action action-primary" type="submit" disabled={pending}>{pending ? 'Creating account…' : 'Create account'}</button>
      </div>}
    <div className="account-switch"><span className="muted">Already have an account?</span><ActionLink to="/sign-in" variant="text">Sign in</ActionLink></div>
  </form>;
}

export function ProfilePage({ onSignOut }: { onSignOut: () => void }) {
  const { session } = useSession();
  return session ? <SignedInProfile key={session.user.id} onSignOut={onSignOut} /> : <SampleProfile />;
}

function SampleProfile() {
  const [level, setLevel] = useState('B1');
  return <div className="account-page profile-page account-form">
    <PageHeading title="Your profile" />
    <div className="account-profile-notice"><span className="account-status">Sample profile</span><p className="small muted">Try the fields below. Your changes stay on this screen and are not saved.</p></div>
    <div className="account-fields">
      <Field label="Display name" defaultValue="Learner A" />
      <Choices label="English level" options={levels} value={level} onChange={setLevel} describe />
      <p className="small muted">Level is self-assessed. Email and role can't be changed here.</p>
    </div>
    <div className="account-save">
      <button type="button" className="action action-primary" disabled aria-describedby="profile-limit">Save changes</button>
      <p id="profile-limit" className="small muted">This sample is not connected to an account. Sign in to save your profile.</p>
    </div>
    <nav className="account-secondary" aria-label="Profile navigation">
      <ActionLink to="/forgot-password" variant="text">Change password</ActionLink>
      <BackToRooms />
      <ActionLink to="/sign-in" variant="text">Back to sign in</ActionLink>
    </nav>
  </div>;
}

function SignedInProfile({ onSignOut }: { onSignOut: () => void }) {
  const [profile, setProfile] = useState<ProfileResponse>();
  const [loadError, setLoadError] = useState('');
  const [reload, setReload] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [goals, setGoals] = useState('');
  const [level, setLevel] = useState<CefrLevel>('B1');
  const [saved, setSaved] = useState(false);
  const { form, pending, errors, message, validate, run } = useAuthForm();
  const { session } = useSession();

  useEffect(() => {
    const controller = new AbortController();
    setLoadError('');
    getProfile(controller.signal).then(value => {
      setProfile(value);
      setDisplayName(value.display_name);
      setNativeLanguage(value.native_language ?? '');
      setGoals(value.goals.join('\n'));
      setLevel(value.cefr_level);
    }, error => {
      if (!controller.signal.aborted) setLoadError(error instanceof AuthApiError ? error.message : 'Could not load your profile.');
    });
    return () => controller.abort();
  }, [reload]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = {
      display_name: displayName.trim(),
      native_language: nativeLanguage.trim() || null,
      goals: goals.split('\n').map(goal => goal.trim()).filter(Boolean),
      cefr_level: level,
    };
    setSaved(false);
    if (validate(validateProfile(input))) {
      void run(signal => updateProfile(input, signal), value => {
        setProfile(value);
        // A profile response may omit role; keep the one from sign-in.
        updateSessionUser({ ...value, role: value.role ?? session?.user.role });
        setSaved(true);
      });
    }
  }

  const isAdmin = session?.user.role === 'ADMIN';
  return <form ref={form} className="account-page profile-page account-form" noValidate onSubmit={submit} aria-busy={pending || !profile}>
    <PageHeading title="Your profile" />
    {loadError && <div className="note note-error" role="alert"><p className="small field-error">{loadError}</p>
      <button type="button" className="action action-text" onClick={() => setReload(reload + 1)}>Try again</button></div>}
    {!profile && !loadError && <p role="status" className="small muted">Loading your profile…</p>}
    {profile && <>
      <p className="small muted">Signed in as {profile.email}</p>
      {saved && <div role="status"><Note title="Profile saved" tone="success">Your changes are saved.</Note></div>}
      <FormError message={message} />
      <div className="account-fields">
        <Field name="display_name" label="Display name" autoComplete="nickname" value={displayName}
          onChange={event => setDisplayName(event.target.value)} error={errors.display_name} />
        <Field name="native_language" label="Native language (optional)" value={nativeLanguage}
          onChange={event => setNativeLanguage(event.target.value)} error={errors.native_language} placeholder="Vietnamese" />
        <Choices label="English level" options={levels} value={level} onChange={value => setLevel(value as CefrLevel)} error={errors.cefr_level} describe />
        <div className="field">
          <label htmlFor="profile-goals">Learning goals (optional)</label>
          <textarea id="profile-goals" name="goals" rows={4} value={goals} onChange={event => setGoals(event.target.value)}
            aria-invalid={errors.goals ? true : undefined} aria-describedby={`profile-goals-hint${errors.goals ? ' profile-goals-error' : ''}`}
            placeholder={'Reduce filler words\nImprove rebuttal structure'} />
          <p id="profile-goals-hint" className="small muted">One goal per line, up to 5.</p>
          {errors.goals && <p id="profile-goals-error" className="small field-error">{errors.goals}</p>}
        </div>
        <p className="small muted">Level is self-assessed. Email and role can't be changed here.</p>
      </div>
      <div className="account-save">
        <button type="submit" className="action action-primary" disabled={pending}>{pending ? 'Saving…' : 'Save changes'}</button>
      </div>
    </>}
    <nav className="account-secondary" aria-label="Account settings">
      <ActionLink to="/forgot-password" variant="text">Change password</ActionLink>
      <ActionLink to="/account/sessions" variant="text">Active sessions</ActionLink>
      <ActionLink to="/account/delete" variant="text">Delete account</ActionLink>
      {isAdmin && <ActionLink to="/admin/users" variant="text">Manage accounts</ActionLink>}
      <button type="button" className="action action-text" onClick={onSignOut}>Sign out</button>
    </nav>
  </form>;
}
