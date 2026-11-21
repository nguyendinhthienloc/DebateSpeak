import type { ReactNode } from 'react';
import { ActionLink } from './ui';
import { StageBar } from './Headers';
import '../pages/auth.css';

/** Full-screen Ink stage for sign-in, registration and recovery: brand, the switch between flows, a podium light and a floor. */
export function AuthStage({ path, children }: { path: string; children: ReactNode }) {
  const registering = path === '/register';
  return <div className="auth-stage">
    <span className="auth-light" aria-hidden="true" />
    <StageBar brandHref="#/welcome">
      <p className="auth-switch">
        <span className="auth-switch-prompt">{registering ? 'Have an account?' : 'New to DebateSpeak?'}</span>
        {registering
          ? <ActionLink to="/sign-in" variant="text">Sign in</ActionLink>
          : <ActionLink to="/register" variant="text">Create account</ActionLink>}
      </p>
    </StageBar>
    {children}
  </div>;
}

/** The form plate (children) standing on a Yellow lectern whose front shows a name plate. The lectern is decoration; `foot` sits on the floor. */
export function Podium({ name, detail, foot, children }: { name: string; detail?: string; foot?: ReactNode; children: ReactNode }) {
  return <div className="auth-podium">
    {children}
    <div className="auth-lectern" aria-hidden="true">
      <b>{name}</b>
      {detail && <span>{detail}</span>}
    </div>
    <div className="auth-floor">{foot && <p className="auth-foot">{foot}</p>}</div>
  </div>;
}
