# Functional groups vs. screens and routes

Checked 2026-11-17 against `web/src/routes.ts` (18 hash routes) and the
functional requirements in `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md`.
Only Must (M) and Should (S) requirements are listed; Could (C) items such as
video, chat, solo AI, audience and the teacher dashboard are left out.
"Screen" means a route; "in-screen" means a panel or dialog on an existing route.

## Summary

- **FG-01 accounts:** covered.
- **FG-03 rooms:** partly covered by sample routes. There is no main menu
  and no real room route (`#/rooms/:code`); the router only matches fixed paths.
- **FG-02, FG-10 and admin moderation/AI:** no screens.
- **FG-04 to FG-09:** no screens. They need the live room and the report,
  so they come in PA4/PA5 (see `docs/ROADMAP.md`).

## Gaps

| FG | Requirement | Today | Missing screen or route | Sprint |
|---|---|---|---|---|
| 01 | FR-01–05 accounts, sessions, delete, suspend | `/sign-in` … `/admin/users` | none | PA3 |
| 02 | FR-06 browse/search topics | none | `#/topics` (search, category and CEFR filters) | PA3/PA5 |
| 02 | FR-07 curate topics | none | `#/admin/topics`, `#/admin/topics/:id` (create, edit, retire) | PA5 |
| 02 | FR-08 recommended topics | none | in-screen on the main menu ("Topics for B1") | PA5 |
| 03 | Main menu (FR-06, FR-10, FR-11 entry, FG-10 history entry) | `/rooms` is a join/create page | `#/home`, the landing page after sign-in (draft: [main-menu.md](main-menu.md)) | PA3 |
| 03 | FR-10–12 real room | `/rooms/waiting`, `/rooms/ready`, `/rooms/full`, `/rooms/expired` are fixed samples | `#/rooms/:code`, one route whose states are LOBBY, READY, full and expired. **The router needs path parameters.** | PA3 |
| 03 | FR-13 dual consent | none | in-screen consent panel on `#/rooms/:code` | PA4 |
| 03 | FR-14, FR-15 timer, leave, end | none | `#/rooms/:code/live` | PA4 |
| 03 | FR-16 report abuse | none | in-screen dialog (live room, transcript) | PA5 |
| 03 | FR-17 review reports, force-close | none | `#/admin/reports`, `#/admin/reports/:id` | PA5 |
| 04 | FR-18–21 audio, mic test, mute, connection | disabled "Test microphone" buttons | mic check dialog on `#/rooms/:code`; audio controls on `/live` | PA4 |
| 05 | FR-23–26 live transcript | none | panel on `#/rooms/:code/live` | PA4 |
| 05 | FR-27 view/export transcript | none | `#/debates/:id/transcript` | PA5 |
| 06–09 | FR-29–45 language, argument, facts, judge, consensus | none | `#/debates/:id/report` with tabs: Summary, Language, Argument, Facts, Judge | PA5 |
| 10 | FR-52 report status and retry | none | processing/partial state of `#/debates/:id/report` | PA5 |
| 10 | FR-48, FR-49 report and practice | none | Summary tab of the report | PA5 |
| 10 | FR-50 past debates | none | `#/history` | PA5 |
| 10 | FR-51 progress over time | none | `#/history/progress` (or a History tab) | PA5 |
| 09 | FR-46 providers, flags, usage | none | `#/admin/ai` | PA5 |
| — | FR-54 data deletion requests | none | `#/admin/data-requests` | PA5 |
| — | FR-55, FR-56 human Evaluator (S) | none | `#/evaluate`, `#/evaluate/:id`. **Scope unresolved in PRODUCT.md; do not build until the team decides.** | PA5? |

## Smaller issues found

- Done in SCRUM-53: sign-in now lands on the main menu (`#/home`).
- There is no admin landing page. With 5 admin areas planned, `#/admin`
  should list them; the Profile page link is enough only while there is one.
- The header has only Account and Sign out; it needs main navigation
  (Home, Topics, History, Profile) once those screens exist.
- The "Preview screen" footer selector lists every route. It should be
  hidden in production builds (it is a team review tool).
