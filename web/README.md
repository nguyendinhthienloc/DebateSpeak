# DebateSpeak UI scaffold

Responsive page layouts and navigation based on the selected Cream & Yellow
Figma design. This is a design preview: no accounts, rooms, audio, transcription
or AI services are connected. Sample codes and participants are illustrative.

## Run

Use Node.js 20 or newer. From `web/`:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The default page is sign-in; use the page
links or **Preview screen** selector at the bottom to explore every screen.
Primary actions labeled **Preview** navigate to sample outcomes without sending
form values anywhere. Profile saving and audio checks are intentionally disabled.
Room setting selections live only in memory and reset on reload; lobby screens
are fixed Figma examples, not the output of a room service.

## Routes

Paths follow `/#/` so direct links and reload work on static hosting without
server rewrites. Browser back/forward, page titles and focus follow navigation.

| Hash path | Screen |
| --- | --- |
| `#/sign-in` | Sign in |
| `#/register` | Registration |
| `#/account-created` | Account confirmation example |
| `#/rooms` | Room entry |
| `#/rooms/new` | Setup summary and preview |
| `#/rooms/new/settings` | Room settings |
| `#/profile` | Profile |
| `#/invite` | Invitation example |
| `#/rooms/waiting` | Waiting lobby example |
| `#/rooms/ready` | Ready lobby example |
| `#/rooms/full` | Full-room recovery example |
| `#/rooms/expired` | Expired-room recovery example |

Unknown routes show a recovery page. Shared controls live in `src/components/`,
page families in `src/pages/`, navigation in `src/routes.ts`, and visual tokens in
`src/index.css`. Inter is bundled locally through `@fontsource/inter`.

## Verify

```sh
npm run build
npm run lint
npx playwright install chromium
npm run test:e2e
```

Browser checks cover history/reload, unknown routes, focus and keyboard controls,
all routes at 320/390/1102/1440px, local settings, and absence of service calls,
media requests or stored credentials. This does not verify backend acceptance
criteria. See [the scoped implementation contract](../docs/design/UI_SCAFFOLD.md).
