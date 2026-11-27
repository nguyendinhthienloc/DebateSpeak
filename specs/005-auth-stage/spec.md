# 005 — Sign-in and sign-up on the stage

Status: in progress on `feature/SCRUM-53-ui-refresh`, 2026-11-17.

## Why

Sign-in and registration used the generic app frame: a narrow form floating on
Cream with a detached Ink card beside it. They shared nothing with the welcome
page a signed-out visitor had just seen. The user asked to remake the whole
flow in the same colour theme.

## Decisions confirmed by the user, 2026-11-17

1. **Scope:** sign in, registration, "Account created" sign-in, and the
   recovery screens (forgot, reset, verify). Recovery stays disabled
   (UC-01-05 not enabled): its forms are redesigned but remain behind
   `RECOVERY_ENABLED = false`, and the routes keep showing the
   "not available in this build" screen.
2. **Frame:** auth routes drop the app header and the "Preview screen" dev bar
   and get their own full-screen frame, like the welcome page.
3. **Standalone:** the side picked on the welcome page does not carry into auth.
4. **Structure:** "Name plate on the stage", chosen on the decision page.
5. **Registration in three steps:** (1) email and password, (2) display name,
   (3) English level, optional, with an "I'm not sure" quick guide.

## Frame

- Full-screen Ink stage, floor band across the lower part (`stage-floor`, 2px
  `stage-edge`), a soft Yellow podium light behind the form.
- Top bar: brand (links to `#/welcome`) on the left; on the right, the switch
  between the two flows ("New to DebateSpeak? Create account" or "Have an
  account? Sign in").
- The form is one White plate (2px Yellow edge, 16px radius) centred on the
  stage, standing on a Yellow lectern that reaches the floor. The lectern's
  front carries a name plate: "Welcome back" on sign-in; during registration it
  shows the display name and level as they are entered (decorative, hidden from
  assistive technology; the fields are the source of truth).
- Fields, choices and errors keep their existing components and stay on White.
  No text is typed or read on Ink.
- Secondary routes ("Preview rooms" on sign-in, "Back to sign in" on recovery)
  sit on the floor below the lectern, so the plate ends at its primary action.
- After registering, the sign-in lectern reads "Welcome, <display name>" with
  the chosen level.

## Registration

| Step | Fields | Advances with |
|---|---|---|
| 1 · Account | Email, Password | Continue (local validation, no request) |
| 2 · Your name | Display name (optional) | Continue (local length check) |
| 3 · English level | A2, B1, B2, C1, none selected; "I'm not sure" | Create account |

Each step's heading is its own question: "Create your account", "What should
we call you?", "How do you speak English today?". The "Step n of 3" label and
bar stay below the heading.

- Server errors on email or password return to step 1; on display name to
  step 2; on level stay on step 3. The invalid field is focused.
- **Optional level.** The API requires `cefr_level`. When no level is chosen,
  the request sends B1, and the step says so beside the button: "No level
  chosen? You'll start at B1. Change it in Profile anytime."
- **Quick guide ("I'm not sure").** A modal dialog, one statement per screen,
  progress bar, Back and Close. Each statement is a self-assessment about
  speaking, answered Yes / Sometimes / Not yet:

  | Level | Statement |
  |---|---|
  | A2 | I can say what I think about a simple topic, in short sentences. |
  | B1 | I can give a reason for my opinion and keep talking for a minute. |
  | B2 | I can answer someone who disagrees with me without long pauses. |
  | C1 | I can argue a complex point fluently and choose precise words. |

  Suggestion: climb from A2; "Yes" reaches a level and continues; "Sometimes"
  reaches it and stops; "Not yet" stops below it. The floor is A2, the lowest
  level offered. The result screen shows the suggested level, says it is a
  starting point and not a test result, and offers "Use B1" (fills the choice
  and closes) or "Choose myself" (closes). Nothing is sent or stored.

## Not changed

API calls and payloads (`docs/api/fg01-auth-contract.md`), validation rules and messages,
session handling, autocomplete attributes, the password Show/Hide control,
keyboard focus on errors, and the absence of recovery links on sign-in.

## Checks

- Playwright: register reaches step 3 in three steps; step 2 server/local
  errors return to step 2; no level sends B1; the guide suggests a level from
  its answers, fills the choice, and sends no request; auth routes have no app
  header or dev bar; recovery routes stay inert.
- Reflow at 320px with 200% text; reduced motion removes all animation.
- Updated on purpose: register step labels ("Step n of 3"), the extra Continue
  on step 2, and the reflow test reading routes from `#/rooms` instead of
  sign-in.
