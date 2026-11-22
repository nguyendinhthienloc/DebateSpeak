import { useEffect, useRef, useState } from 'react';
import { ActionLink, PageHeading } from './components/ui';
import { clearSession, finishRestoring, hasSession, setExpiryHandler, setSession, useSession } from './auth/session';
import { logout, refresh } from './auth/api';
import type { TokenResponse, UserResponse } from './auth/contracts';
import { ProfilePage, RegisterPage, SignInPage } from './pages/AccountPages';
import { DeleteAccountPage, RequireSession, SessionsPage } from './pages/AccountSettingsPages';
import { AdminUsersPage } from './pages/AdminPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { HomePage } from './pages/HomePage';
import { CreateRoomPage } from './pages/rooms/CreateRoomPage';
import { JoinDialog } from './pages/rooms/JoinDialog';
import { RoomPage } from './pages/rooms/RoomPage';
import { WelcomePage } from './pages/WelcomePage';
import { AuthStage } from './components/AuthStage';
import { AppBar } from './components/Headers';
import { matchDynamicRoute, rememberInvite, routes, takeInvite, useRoute } from './routes';

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
  const dynamic = matchDynamicRoute(path);
  const title = route?.label ?? (dynamic?.kind === 'join' ? 'Join a room' : dynamic?.kind === 'room' ? 'Room' : 'Page not found');
  const main = useRef<HTMLElement>(null);
  const [topicId, setTopicId] = useState<string>();
  const [stage, setStage] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserResponse>();
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [notice, setNotice] = useState<string>();
  const { session, expired, restoring } = useSession();
  const isWelcome = path === '/welcome';
  const isAuth = ['/sign-in', '/register', '/account-created', '/forgot-password', '/reset-password', '/verify-email'].includes(path);

  useEffect(() => {
    document.title = `${title} · DebateSpeak AI`;
    main.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [path, title]);

  useEffect(() => {
    if (!['/sign-in', '/account-created'].includes(path)) setRegisteredUser(undefined);
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

  // A signed-out visitor with an invite signs in first, then comes back to it.
  const inviteCode = dynamic?.kind === 'join' ? dynamic.code : undefined;
  useEffect(() => {
    if (!inviteCode || session || restoring) return;
    rememberInvite(inviteCode);
    window.location.hash = '/sign-in';
  }, [inviteCode, session, restoring]);

  function signedIn(response: TokenResponse) {
    setSession(response);
    setRegisteredUser(undefined);
    const invite = takeInvite();
    window.location.hash = invite ? `/join/${invite}` : '/home';
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

  function pickTopic(id: string) {
    setTopicId(id);
    window.location.hash = '/rooms/new';
  }

  function registered(user: UserResponse) {
    setRegisteredUser(user);
    window.location.hash = '/account-created';
  }

  function page() {
    if (dynamic?.kind === 'room') return <RequireSession title="Room"><RoomPage roomId={dynamic.roomId} onStage={setStage} /></RequireSession>;
    if (dynamic?.kind === 'join') return <RequireSession title="Home"><HomePage onPickTopic={pickTopic} /><JoinDialog code={dynamic.code} /></RequireSession>;
    switch (path) {
      case '/sign-in': return <SignInPage registered={registeredUser} expired={expired} notice={notice} onSignedIn={signedIn} />;
      case '/register': return <RegisterPage onRegistered={registered} />;
      case '/forgot-password': return <RecoveryPage mode="request" initialEmail={recoveryEmail || session?.user.email} onEmailAccepted={setRecoveryEmail} />;
      case '/reset-password': return <RecoveryPage mode="reset" initialEmail={recoveryEmail} onEmailAccepted={setRecoveryEmail} />;
      case '/verify-email': return <RecoveryPage mode="verify" initialEmail={recoveryEmail} onEmailAccepted={setRecoveryEmail} />;
      case '/account-created': return <SignInPage registered={registeredUser} expired={expired} onSignedIn={signedIn} />;
      case '/welcome': return <WelcomePage />;
      case '/home': return <RequireSession title="Home"><HomePage onPickTopic={pickTopic} /></RequireSession>;
      case '/rooms/new': return <RequireSession title="Create room"><CreateRoomPage initialTopicId={topicId} /></RequireSession>;
      case '/profile': return <ProfilePage onSignOut={signOut} />;
      case '/account/sessions': return <RequireSession title="Active sessions"><SessionsPage onSignOut={signOut} /></RequireSession>;
      case '/account/delete': return <RequireSession title="Delete account"><DeleteAccountPage onDeleted={accountDeleted} /></RequireSession>;
      case '/admin/users': return <RequireSession title="Manage accounts"><AdminUsersPage /></RequireSession>;
      default: return <div className="stack-20"><PageHeading title="Page not found">This link does not match a page.</PageHeading><ActionLink to="/home" className="short-action">Back to home</ActionLink></div>;
    }
  }

  const content = <main id="main" className={isWelcome ? 'welcome-main' : isAuth ? 'auth-main' : stage ? 'stage-main' : 'shell-inner'} ref={main} tabIndex={-1} key={path}>
    {page()}
  </main>;
  const bare = isWelcome || isAuth || stage;

  return <div className="app-shell">
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    {!bare && <AppBar path={path} onSignOut={signOut} />}
    {isAuth ? <AuthStage path={path}>{content}</AuthStage> : content}
    {!bare && import.meta.env.DEV && <footer className="shell-inner dev-bar">
      <label htmlFor="preview-screen">Preview screen</label>
      <select id="preview-screen" value={route?.path ?? ''} onChange={event => { window.location.hash = event.target.value; }}>
        {!route && <option value="" disabled>Page not found</option>}
        {routes.map(item => <option key={item.path} value={item.path}>{item.label}</option>)}
      </select>
    </footer>}
  </div>;
}
