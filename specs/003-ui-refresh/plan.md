# UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Each design task names the `/impeccable` command to run for it.

**Goal:** Give every web screen a display typeface, wider weight contrast, short purposeful motion, shorter copy, split registration into two steps on `#/register`, and add a main menu at `#/home`.

**Architecture:** CSS tokens in `web/src/index.css` carry type and motion; components opt in through existing classes. Registration stays one `<form>` with an internal `step` state; the step shown is derived during render so server errors on step-1 fields switch back before `useAuthForm` focuses the invalid input.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind 3, plain CSS, Playwright, `@fontsource-variable/archivo`, `@fontsource/inter`.

**Spec:** [spec.md](spec.md)

## Global Constraints

- Hash routes stay; `#/register` is one route for both steps.
- Fonts self-hosted only; every font request originates from the dev server.
- Display face: Archivo Variable, headings weight 800, `font-stretch: 87.5%`. Body Inter 400; labels/buttons Inter 600; Inter 300 only at 1.125rem or larger.
- Palette, 48px controls, 3px focus outline, flat surfaces unchanged.
- Motion durations 120ms / 200ms / 320ms; easing `cubic-bezier(.22, 1, .36, 1)`; no animation or transition under `prefers-reduced-motion: reduce`.
- Animations only animate in from a visible end state: if they don't run, content is fully visible.
- No passwords or step data in the URL, `localStorage` or `sessionStorage`.
- Test-asserted strings (headings, button names, error text) stay unchanged.
- Commits: short plain messages, no AI attribution (CLAUDE.md §5). Never commit to `pa3`, `dev` or `main`.

## Review Focus

1. Enter in a step-1 field must continue to step 2, not send `POST /auth/register`.
2. A 409 or 422 on email/password returned from step 2 must show step 1 with values kept and the field focused; a `cefr_level` or `display_name` error must stay on step 2.
3. Back from step 2 keeps email and password in the fields.
4. With motion disabled, no element sits at `opacity: 0` and step changes are instant.
5. Long Vietnamese names and headings in the heavy display face at 320px / 200% text cause no horizontal scroll.

---

### Task 0: Branch and spec updates

**Files:**
- Modify: `DESIGN.md` (frontmatter `typography`, add `motion`; sections Typography, Do's and Don'ts)
- Modify: `PRODUCT.md` (Brand Commitments and "preserve … the current Inter typography" sentence)
- Modify: `docs/architecture/SOFTWARE_ARCHITECTURE_SPEC.md:59`, `:1349`
- Modify: `docs/requirements/PROJECT_PROPOSAL.md:253`
- Create: `specs/003-ui-refresh/tasks.md` (task list mirroring this plan)
- Modify: `specs/README.md` (link 003)

- [ ] **Step 1:** Resolve the two open decisions in `spec.md` (ticket number, doc owner) with the user.
- [ ] **Step 2:** `git switch pa3 && git pull && git switch -c feature/SCRUM-<nn>-ui-refresh` (superpowers:using-git-worktrees if isolating).
- [ ] **Step 3:** Update the docs above: Archivo for display roles, Inter 300/400/600 for text roles, the motion tokens from Global Constraints, the two-step register flow. Keep each edit to the sentence that states the old rule.
- [ ] **Step 4:** Commit: `git commit -m "docs: spec UI refresh (type, motion, register steps)"`.

### Task 1: Baseline analysis

`/impeccable critique web/src` then `/impeccable audit web/src`.

**Files:**
- Create: `web/scripts/screens.mjs` (Playwright script: every path in `src/routes.ts` at 390 and 1102 px, saves PNGs to an output dir given as argument; output not committed)
- Modify: `specs/003-ui-refresh/spec.md` (append "Baseline findings", max 10 lines)

- [ ] **Step 1:** Run `npm run dev`, then `node scripts/screens.mjs <scratch-dir>/before`. Expected: 36 PNGs.
- [ ] **Step 2:** Run critique and audit; record findings that this plan does not already cover. Anything outside scope goes in the spec as a follow-up, not into this branch.
- [ ] **Step 3:** Commit script and findings: `git commit -m "chore: screen capture script and baseline findings"`.

### Task 2: Type system

`/impeccable typeset web/src`

**Files:**
- Modify: `web/package.json` (add `@fontsource-variable/archivo@^5.3.0`)
- Modify: `web/src/index.css` (imports, tokens, `h1`, `h2`, `.brand`, `.participant-name`, new `.lead`)
- Modify: `web/src/pages/account.css` (`.account-page h1`)
- Test: `web/tests/account-refinement.spec.ts`

**Interfaces:**
- Produces CSS tokens: `--font-display`, `--type-display` (`clamp(2.25rem, 1.75rem + 2vw, 3rem)`), `--weight-display: 800`, `--stretch-display: 87.5%`; class `.lead` (Inter 300, 1.125rem, line-height 1.5, ink colour).

- [ ] **Step 1: Write the failing test** `display face loads locally for headings with Vietnamese coverage`:

```ts
await page.goto('/#/profile');
const h1 = page.locator('h1');
expect(await h1.evaluate(e => getComputedStyle(e).fontFamily)).toContain('Archivo');
expect(await h1.evaluate(e => getComputedStyle(e).fontWeight)).toBe('800');
await page.evaluate(() => document.fonts.load('800 32px "Archivo Variable"', 'Nguyễn Đình Thiên Lộc'));
expect(fonts.some(u => u.includes('archivo-vietnamese'))).toBe(true);
expect(fonts.every(u => new URL(u).origin === 'http://127.0.0.1:5173')).toBe(true);
```

- [ ] **Step 2:** `npx playwright test account-refinement -g "display face"`. Expected: FAIL (font family is Inter).
- [ ] **Step 3:** `npm i @fontsource-variable/archivo`; import its `wdth.css` (check the declared family name in that file) and Inter `latin-300.css` plus a Vietnamese 300 `@font-face` matching the existing 400/600 blocks. Add the tokens; apply display to `h1`, `h2`, `.brand`, `.participant-name`, the room motion heading and the invite code (`font-variant-numeric: tabular-nums`). Headings: line-height 1.05 for display size, `letter-spacing: -0.015em`.
- [ ] **Step 4:** `npx playwright test account-refinement`. Expected: all PASS, including the existing 320px/200% reflow and blocked-font tests.
- [ ] **Step 5:** Commit: `git commit -m "feat(web): Archivo display type and weight scale"`.

### Task 3: Motion tokens and page enter

`/impeccable animate web/src`

**Files:**
- Modify: `web/src/index.css` (tokens, keyframes `enter`, reduced-motion block; move the account-only transition rule here)
- Modify: `web/src/pages/account.css` (remove the now-global transition block)
- Test: `web/tests/scaffold.spec.ts`

**Interfaces:**
- Produces: `--ease-out`, `--dur-1: 120ms`, `--dur-2: 200ms`, `--dur-3: 320ms`; keyframes `enter` (from `opacity: 0; transform: translateY(.5rem)`), `reveal` (from `opacity: 0; transform: translateY(-.25rem)`), `pop` (from `transform: scale(.6)`).

- [ ] **Step 1: Write the failing tests** `pages animate in` and `reduced motion disables every animation`:

```ts
await page.goto('/#/rooms');
expect(await page.locator('main').evaluate(e => getComputedStyle(e).animationName)).toBe('enter');
// reduced motion
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto('/#/register');
expect(await page.locator('main').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
expect(await page.locator('main').evaluate(e => getComputedStyle(e).opacity)).toBe('1');
```

- [ ] **Step 2:** Run them. Expected: FAIL on `animationName`.
- [ ] **Step 3:** Animate `main` with `enter` at `--dur-3` (it remounts per route via `key={path}`); buttons `:active { transform: scale(.98) }`; `.choice-check` uses `pop`; `.note` and `[role=status] > .note` use `reveal`; transitions on colour/border at `--dur-1`. One `@media (prefers-reduced-motion: reduce)` block sets `animation: none` and `transition: none` on everything.
- [ ] **Step 4:** Run `npx playwright test`. Expected: all PASS (the existing "reduced motion … 0s" test still holds).
- [ ] **Step 5:** Commit: `git commit -m "feat(web): motion tokens and page enter"`.

### Task 4: Two-step registration

`/impeccable onboard web/src/pages/AccountPages.tsx` for the step flow.

**Files:**
- Modify: `web/src/pages/AccountPages.tsx` (`RegisterPage`)
- Modify: `web/src/components/ui.tsx` (add `StepIndicator`)
- Modify: `web/src/pages/account.css` (step indicator, step slide)
- Modify: `web/tests/auth.spec.ts`, `web/tests/account-refinement.spec.ts` (register tests click Continue first)
- Test: `web/tests/register-steps.spec.ts` (new)

**Interfaces:**
- Produces: `StepIndicator({ current, labels }: { current: number; labels: readonly string[] })` rendering `Step {current} of {labels.length} · {label}` as text plus a bar; `aria-live="polite"`.
- `RegisterPage` keeps its props. Internal: `const [chosen, setChosen] = useState<1 | 2>(1)`, `const step = errors.email || errors.password ? 1 : chosen`. Step labels `['Account', 'Learning profile']`. Step 1 submit runs `validateCredentials` and sets `chosen = 2`; step 2 submit runs the existing `validateRegistration` + `register`. Step container keyed by `step` with `data-direction="forward" | "back"` for the slide; each step's `h2` has `tabIndex={-1}` and receives focus on step change (not on first mount). Step 2 has a secondary `Back` button (`type="button"`).

- [ ] **Step 1: Write the failing tests** in `register-steps.spec.ts`:
  - `step 1 continues without calling the API`: fill email/password, press Enter → `getByText('Step 2 of 2 · Learning profile')` visible, register POST count 0.
  - `step 1 blocks invalid credentials`: click `Continue` empty → email focused, `Enter your email address.` visible, still step 1.
  - `back keeps values`: go to step 2, click `Back` → email and password inputs keep their values.
  - `409 returns to step 1 with email focused`: route register → 409; submit step 2 → `An account already uses this email.` visible, Email focused, password value kept.
  - `422 cefr error stays on step 2`: route → 422 `cefr_level` → group `Your English level` focused, `Step 2 of 2` visible.
  - `step change is instant under reduced motion`: emulate reduce, continue → step 2 container `animationName` is `none`.
  - `no step data in URL or storage`: after step 2, URL ends `#/register`, storage lengths `[0, 0]`.
- [ ] **Step 2:** `npx playwright test register-steps`. Expected: FAIL (no Continue button).
- [ ] **Step 3:** Implement `StepIndicator` and the step logic described above. Step slide: keyframes from `translateX(1.5rem)` (forward) or `-1.5rem` (back) with opacity 0, `--dur-3`; progress bar fill animates `transform: scaleX()` at `--dur-3`. Apply the spec's register copy changes.
- [ ] **Step 4:** Update existing register tests: after `fillCredentials`, click `Continue`; CEFR keyboard test advances to step 2 first; reflow test also checks step 2 at 320px/200%.
- [ ] **Step 5:** `npx playwright test`. Expected: all PASS.
- [ ] **Step 6:** Commit: `git commit -m "feat(web): split registration into two steps"`.

### Task 5: Shorter copy across screens

`/impeccable clarify web/src` then `/impeccable distill web/src`.

**Files:**
- Modify: `web/src/pages/AccountPages.tsx`, `AccountSettingsPages.tsx`, `AdminPage.tsx`, `RoomEntryPages.tsx`, `RoomSetupPage.tsx`, `RecoveryPage.tsx`, `web/src/App.tsx` (footer)
- Modify: `web/src/components/ui.tsx` (`PageHeading` renders its child as `.lead` when given)

- [ ] **Step 1:** Apply exactly the spec's copy table (register rows are done in Task 4). Do not touch a string listed by `grep -rhoE "getByText\('[^']+'|name: '[^']+'" tests`.
- [ ] **Step 2:** `npm run lint && npx playwright test`. Expected: all PASS.
- [ ] **Step 3:** Commit: `git commit -m "feat(web): shorten page descriptions"`.

### Task 6: Weight contrast and room screens

`/impeccable bolder` on headings, brand, motion and invite code; `/impeccable quieter` on helper text; `/impeccable layout web/src/pages` for spacing after the heavier type.

**Files:**
- Modify: `web/src/index.css`, `web/src/pages/setup.css`, `web/src/pages/LobbyPage.tsx`, `RoomSetupPage.tsx`, `RoomEntryPages.tsx`
- Test: `web/tests/lobby-refinement.spec.ts`

- [ ] **Step 1: Write the failing test** `lobby participants stagger in`: on `#/rooms/ready`, each `.participant` has `animationName` `enter` and a non-zero `animationDelay` on the second row.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Room motion heading and invite code at `--type-display`; participant names display 700; helper `.small.muted` stays Inter 400 (no 300 at small sizes). Participant rows animate `enter` with `animation-delay: calc(var(--i) * 60ms)`, `--i` set inline per row. Recheck room spacing after the heavier headings.
- [ ] **Step 4:** `npx playwright test`. Expected: all PASS.
- [ ] **Step 5:** Commit: `git commit -m "feat(web): bolder room headings and lobby motion"`.

### Task 7: Main menu (`#/home`)

`/impeccable` new surface, code-led, inside the existing world: build to the locked "Twin doors" sketch and the [main-menu.md](main-menu.md) brief; the mock (desktop, phone, states) is the visual reference.

**Files:**
- Modify: `web/src/routes.ts` (add `{ path: '/home', label: 'Home' }` first in the list)
- Create: `web/src/pages/HomePage.tsx`, `web/src/pages/home.css`
- Modify: `web/src/App.tsx` (render `/home`; `signedIn` goes to `/home`; brand links to `#/home` when signed in; header gains a `Home` link before `Account`)
- Modify: `web/tests/auth.spec.ts:37`, `:131` (post-sign-in URL is `#/home`)
- Test: `web/tests/home.spec.ts` (new)
- Modify: `web/API_CONTRACT.md` only if it gains a join-by-code note (it has none today; do not invent an endpoint)

**Interfaces:**
- Consumes: `.lead` and display tokens (Task 2), `enter` keyframes and motion tokens (Task 3), `RequireSession` from `AccountSettingsPages.tsx`, `useSession()`.
- Produces: `HomePage()` (no props; App wraps it as `<RequireSession title="Home">`); `normalizeInviteCode(value: string): string | undefined` exported from `HomePage.tsx` (removes spaces and hyphens, uppercases, returns the code only if it matches `/^[A-Z0-9]{8}$/`).

**Build 1 limits (keep them visible, do not fake them):**
- No join API exists: a valid code navigates to the existing `#/invite` preview and is never put in the URL or storage. "No room uses this code" waits for the room API.
- Topics and History have no routes: the header shows only Home, Account and Sign out; "All topics" and "All debates" links are left out; sample topic cards are not links.
- Sample sections are titled "Sample topics" and "Recent debates" with a "Sample" tag; sample history has no scores. Footer line: "Topics and history show sample content. No real debate is listed."

- [ ] **Step 1: Write the failing tests** in `home.spec.ts` (sign in through the mocked login like `auth.spec.ts`):
  - `sign-in lands on the main menu`: after login, URL matches `/#\/home$/`, heading `Create a room` visible, `Good evening`/`Hello` greeting contains the display name `Linh`.
  - `create door opens room setup`: click link `Set up room` → URL `/#\/rooms\/new$/`.
  - `join validates the code locally`: fill `Invite code` with `K7Q2`, click `Join` → `Enter the 8-character code from your partner.` visible, input `aria-invalid="true"` and focused, URL still `#/home`.
  - `valid code opens the invitation preview`: fill ` k7q2-m9xa `, click `Join` → URL `/#\/invite$/`, `page.url()` does not contain `K7Q2M9XA`, storage lengths `[0, 0]`.
  - `samples are labelled and carry no scores`: `getByText('Sample', { exact: true })` count 2; `main` text does not match `/\d+\s*\/\s*\d+|score/i`.
  - `signed out shows the sign-in prompt`: `goto('/#/home')` with refresh mocked 401 → `Sign in to see this page.` visible.
  - `home reflows`: at 320px and 200% root font size, `scrollWidth <= innerWidth`; one `h1`.
- [ ] **Step 2:** `npx playwright test home`. Expected: FAIL (route not found).
- [ ] **Step 3:** Implement per the brief: greeting in `.lead`; `.home-doors` grid (2 columns, 1 under 900px); Create door yellow with Ink border and an Ink `Set up room` link (`ActionLink` to `/rooms/new`, white text); Join door white with `Field` label `Invite code`, `autoComplete="off"`, `maxLength={11}`, yellow `Join` submit; doors and sections use `enter` with 60ms stagger via `--i`. Greeting by local hour: `Good morning` before 12, `Good afternoon` before 18, else `Good evening`.
- [ ] **Step 4:** Update `auth.spec.ts:37` and `:131` to `/#\/home$/`; run `npx playwright test`. Expected: all PASS.
- [ ] **Step 5:** Commit: `git commit -m "feat(web): main menu at #/home"`.

### Task 8: Polish and verification

`/impeccable polish web/src`, then `/impeccable audit web/src`, then the detector.

- [ ] **Step 1:** `node scripts/screens.mjs <scratch-dir>/after`; compare with `before` at 390 and 1102 px, plus spot checks at 320 and 1440. Fix what one look shows, then look once more.
- [ ] **Step 2:** `C:/…/impeccable.cmd detect --json web/src` (path from the impeccable context output). Fix or justify each finding.
- [ ] **Step 3:** `npm run build && npm run lint && npx playwright test`. Expected: build OK, 0 lint errors, all tests PASS. (superpowers:verification-before-completion)
- [ ] **Step 4:** Commit fixes: `git commit -m "fix(web): UI refresh polish"`.
- [ ] **Step 5:** superpowers:requesting-code-review on the branch; then push and open a PR into `pa3` **without a reviewer**; set the Jira issue to In Review.
