import { useEffect, useRef, useState } from 'react';
import { ActionLink, PageHeading } from './components/ui';
import { clearSession, finishRestoring, hasSession, setExpiryHandler, setSession, useSession } from './auth/session';
import { logout, refresh } from './auth/api';
import type { TokenResponse } from './auth/contracts';
import { ProfilePage, RegisterPage, SignInPage } from './pages/AccountPages';
import { DeleteAccountPage, RequireSession, SessionsPage } from './pages/AccountSettingsPages';
import { AdminUsersPage } from './pages/AdminPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { CreateRoomPage } from './pages/RoomSetupPage';
import { ExpiredRoomPage, InvitationPage, RoomsPage } from './pages/RoomPages';
import { LobbyPage } from './pages/LobbyPage';
import { defaultSettings } from './roomSettings';
import { routes, useRoute } from './routes';

// One refresh per page load. Refresh tokens rotate, so a second concurrent call
// (e.g. React StrictMode re-running effects) would replay a consumed token.
let restoring: Promise<void> | undefined;
function restoreOnce() {
  restoring ??= refresh(new AbortController().signal)
    .then(response => { if (!hasSession()) setSession(response); }, () => {})
    .finally(finishRestoring);
}

export default function App() {
  const path = useRoute();
  const route = routes.find(item => item.path === path);
  const main = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [registeredEmail, setRegisteredEmail] = useState<string>();
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [notice, setNotice] = useState<string>();
  const { session, expired } = useSession();
  const isAuth = ['/sign-in', '/register', '/account-created', '/forgot-password', '/reset-password', '/verify-email'].includes(path);

  useEffect(() => {
    document.title = `${route?.label ?? 'Page not found'} · DebateSpeak AI`;
    main.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [path, route]);

  useEffect(() => {
    if (!['/sign-in', '/account-created'].includes(path)) setRegisteredEmail(undefined);
    if (path !== '/sign-in') setNotice(undefined);
  }, [path]);

  // Restore a session from the HttpOnly refresh cookie on load, and refresh on expiry.
  useEffect(() => {
    setExpiryHandler(() => { refresh(new AbortController().signal).then(setSession, () => clearSession(true)); });
    restoreOnce();
    return () => setExpiryHandler(undefined);
  }, []);

  useEffect(() => {
    if (expired) window.location.hash = '/sign-in';
  }, [expired]);

  function signedIn(response: TokenResponse) {
    setSession(response);
    setRegisteredEmail(undefined);
    window.location.hash = '/rooms';
  }

  function signOut() {
    clearSession();
    setNotice('Signing you out…');
    window.location.hash = '/sign-in';
    logout(new AbortController().signal).then(
      () => setNotice('You are signed out.'),
      () => setNotice('You are signed out on this device, but the server did not confirm it. Sign in and check Active sessions.'));
  }

  function accountDeleted() {
    clearSession();
    setNotice('Your account is deleted. Your data will be permanently removed within 7 days.');
    window.location.hash = '/sign-in';
  }

  function registered(email: string) {
    setRegisteredEmail(email);
    window.location.hash = '/account-created';
  }

  function page() {
    switch (path) {
      case '/sign-in': return <SignInPage registeredEmail={registeredEmail} expired={expired} notice={notice} onSignedIn={signedIn} />;
      case '/register': return <RegisterPage onRegistered={registered} />;
      case '/forgot-password': return <RecoveryPage mode="request" initialEmail={recoveryEmail || session?.user.email} onEmailAccepted={setRecoveryEmail} />;
      case '/reset-password': return <RecoveryPage mode="reset" initialEmail={recoveryEmail} onEmailAccepted={setRecoveryEmail} />;
      case '/verify-email': return <RecoveryPage mode="verify" initialEmail={recoveryEmail} onEmailAccepted={setRecoveryEmail} />;
      case '/account-created': return <SignInPage registeredEmail={registeredEmail} expired={expired} onSignedIn={signedIn} />;
      case '/rooms': return <RoomsPage />;
      case '/rooms/new':
      case '/rooms/new/settings': return <CreateRoomPage editing={path.endsWith('/settings')} settings={settings} onChange={setSettings} />;
      case '/profile': return <ProfilePage onSignOut={signOut} />;
      case '/account/sessions': return <RequireSession title="Active sessions"><SessionsPage onSignOut={signOut} /></RequireSession>;
      case '/account/delete': return <RequireSession title="Delete account"><DeleteAccountPage onDeleted={accountDeleted} /></RequireSession>;
      case '/admin/users': return <RequireSession title="Manage accounts"><AdminUsersPage /></RequireSession>;
      case '/invite': return <InvitationPage />;
      case '/rooms/waiting': return <LobbyPage />;
      case '/rooms/ready': return <LobbyPage ready />;
      case '/rooms/full': return <RoomsPage full />;
      case '/rooms/expired': return <ExpiredRoomPage />;
      default: return <div className="stack-20"><PageHeading title="Page not found">This preview link does not match a screen.</PageHeading><ActionLink to="/rooms" className="short-action">Back to rooms</ActionLink></div>;
    }
  }

  return <div className={`app-shell ${isAuth ? 'auth-shell' : ''}`}>
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <header className="app-header">
      <a className="brand" href="#/rooms">DebateSpeak AI</a>
      {!isAuth && <div className="header-actions">
        <ActionLink to="/profile" variant="text" className="account-link">Account</ActionLink>
        {session && <button type="button" className="action action-text" onClick={signOut}>Sign out</button>}
      </div>}
    </header>
    <main id="main" ref={main} tabIndex={-1} key={path}>
      {session && <p className="small mb-4" role="status">Signed in as {session.user.display_name}</p>}
      {page()}
    </main>
    <footer className="preview-tools">
      <div className="stack-6"><p className="label">{isAuth ? 'Account access' : 'Room design preview'}</p><p className="small muted">{isAuth ? 'Account forms use the configured API. Rooms and audio remain previews.' : 'Room and audio screens use sample data. No room is created or joined.'}</p></div>
      <div className="field preview-selector"><label htmlFor="preview-screen">Preview screen</label><select id="preview-screen" value={route?.path ?? ''} onChange={event => { window.location.hash = event.target.value; }}>
        {!route && <option value="" disabled>Page not found</option>}
        {routes.map(item => <option key={item.path} value={item.path}>{item.label}</option>)}
      </select></div>
    </footer>
  </div>;
}
