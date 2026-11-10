import { useEffect, useRef, useState } from 'react';
import { ActionLink, PageHeading } from './components/ui';
import { ProfilePage, RegisterPage, SignInPage } from './pages/AccountPages';
import { CreateRoomPage } from './pages/RoomSetupPage';
import { ExpiredRoomPage, InvitationPage, LobbyPage, RoomsPage } from './pages/RoomPages';
import { defaultSettings } from './roomSettings';
import { routes, useRoute } from './routes';

export default function App() {
  const path = useRoute();
  const route = routes.find(item => item.path === path);
  const main = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState(defaultSettings);
  const isAuth = ['/sign-in', '/register', '/account-created'].includes(path);

  useEffect(() => {
    document.title = `${route?.label ?? 'Page not found'} · DebateSpeak AI`;
    main.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [path, route]);

  function page() {
    switch (path) {
      case '/sign-in': return <SignInPage />;
      case '/register': return <RegisterPage />;
      case '/account-created': return <SignInPage created />;
      case '/rooms': return <RoomsPage />;
      case '/rooms/new':
      case '/rooms/new/settings': return <CreateRoomPage editing={path.endsWith('/settings')} settings={settings} onChange={setSettings} />;
      case '/profile': return <ProfilePage />;
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
      {!isAuth && <ActionLink to="/profile" variant="text" className="account-link">Account</ActionLink>}
    </header>
    <main id="main" ref={main} tabIndex={-1} key={path}>{page()}</main>
    <footer className="preview-tools">
      <div className="stack-6"><p className="label">Design preview</p><p className="small muted">Sample screens only. Accounts, rooms and audio are not connected.</p></div>
      <div className="field preview-selector"><label htmlFor="preview-screen">Preview screen</label><select id="preview-screen" value={route?.path ?? ''} onChange={event => { window.location.hash = event.target.value; }}>
        {!route && <option value="" disabled>Page not found</option>}
        {routes.map(item => <option key={item.path} value={item.path}>{item.label}</option>)}
      </select></div>
    </footer>
  </div>;
}
