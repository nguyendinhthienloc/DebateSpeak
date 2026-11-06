import { useState } from 'react';
import { ActionLink, BackToRooms, Choices, Field, Note, PageHeading } from '../components/ui';

const levels = ['A2', 'B1', 'B2', 'C1'];

export function SignInPage({ created = false }: { created?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  return <div className="auth-form stack-16">
    <PageHeading title="Sign in">Create a room or join your partner.</PageHeading>
    {created && <Note title="Account created · example" tone="success">This is a sample confirmation. No account has been created.</Note>}
    <Field label="Email" type="email" autoComplete="off" placeholder="learner@example.invalid" />
    <div className="field">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="sign-in-password">Password</label>
        <button type="button" className="action action-text reveal" aria-controls="sign-in-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
      </div>
      <input id="sign-in-password" type={showPassword ? 'text' : 'password'} autoComplete="off" placeholder="Enter your password" />
    </div>
    <ActionLink to="/rooms">Preview rooms</ActionLink>
    <ActionLink to="/register" variant="text">Create account</ActionLink>
    <p className="small muted">Preview only. Sign-in, audio and debate start are not connected.</p>
  </div>;
}

export function RegisterPage() {
  const [level, setLevel] = useState('B1');
  const [showPassword, setShowPassword] = useState(false);
  return <div className="auth-form stack-16">
    <PageHeading title="Create your account">Practice a clear point of view, with a partner.</PageHeading>
    <Field label="Email" type="email" autoComplete="off" placeholder="name@example.com" />
    <Field label="Password" type={showPassword ? 'text' : 'password'} autoComplete="off" placeholder="Create a password" hint="Use 12–128 characters. Spaces and password managers are welcome." />
    <button type="button" className="action action-text" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide password' : 'Show password'}</button>
    <Field label="Display name (optional)" placeholder="Your display name" hint="If left empty, your name will be Learner." />
    <Choices label="Your English level" options={levels} value={level} onChange={setLevel} />
    <p className="small muted">Choose your current level. You can change it later; this is not a certification.</p>
    <ActionLink to="/account-created">Preview account confirmation</ActionLink>
    <ActionLink to="/sign-in" variant="text">Already have an account? Sign in</ActionLink>
    <p className="small muted">Preview only. Nothing is submitted or saved.</p>
  </div>;
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
      <p id="profile-limit" className="small muted">Sample profile. Saving will be available when accounts are connected.</p>
      <BackToRooms />
      <ActionLink to="/sign-in" variant="secondary" className="short-action">Back to sign in</ActionLink>
    </div>
  </div>;
}
