import type { ReactNode } from 'react';
import { ActionLink } from './ui';
import { useSession } from '../auth/session';

/** The Ink bar with brand and navigation, for signed-in app pages. */
export function AppBar({ path, onSignOut }: { path: string; onSignOut: () => void }) {
  const { session } = useSession();
  return <header className="app-bar">
    <div className="shell-inner header-bar">
      <a className="brand" href={session ? '#/home' : '#/welcome'}>DebateSpeak AI</a>
      <div className="header-actions">
        {session && <p className="small muted header-user" role="status">Signed in as {session.user.display_name}</p>}
        {session && <ActionLink to="/home" variant="text" current={path === '/home'}>Home</ActionLink>}
        <ActionLink to="/profile" variant="text" className="account-link" current={path === '/profile'}>Account</ActionLink>
        {session && <button type="button" className="action action-text" onClick={onSignOut}>Sign out</button>}
      </div>
    </div>
  </header>;
}

/** Brand plus at most one action, for the welcome page, the auth stage and the debate stage. Without `brandHref` the brand is plain text. */
export function StageBar({ brandHref, className = '', children }: { brandHref?: string; className?: string; children?: ReactNode }) {
  return <header className={`stage-bar ${className}`.trim()}>
    {brandHref ? <a className="stage-brand" href={brandHref}>DebateSpeak AI</a> : <span className="stage-brand">DebateSpeak AI</span>}
    {children}
  </header>;
}
