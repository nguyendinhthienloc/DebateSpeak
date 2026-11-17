# Main menu (`#/home`) — draft brief

Status: draft, 2026-11-17. Not built. Visual mock (private):
<https://claude.ai/artifact/P7z2oy5LazEijDnxuqAY5N> (desktop, phone, states).

## Job and audience

Signed-in learners, A2–C1, arriving to start practice. Mode: Operate. They
must do one of two things in seconds: create a room or join a partner's.

## Decisions (user, 2026-11-17)

- **Start or join leads.** Topics and history sit below.
- **Topics and history show sample content,** each section tagged "Sample",
  plus a footer line: "Topics and history show sample content. No real
  debate is listed." Sample history shows no scores.
- **Structure: Twin doors** (chosen on the Impeccable decision page over
  "Lifecycle strip" and "Code gate").

## Layout

1. Header: brand (display face), main nav Home · Topics · History · Profile
   (current page marked with a 4px yellow underline), "Signed in as …",
   Sign out. Until Topics and History have routes, the nav is Home,
   Account and Sign out.
2. Greeting in Inter 300, 22px ("Good evening, Linh.").
3. Two equal doors, side by side on desktop, stacked under 900px:
   - **Create a room** in yellow with ink border, 64px display heading,
     one line, ink "Set up room" button (white text), default settings line.
   - **Join with code** in white, with a labelled "Invite code" field and a
     yellow "Join" button.
4. One line under the doors: "Creating or joining a room never starts audio
   or transcription."
5. Topics: 4 topic cards (2 columns under 900px, 1 on phones). With sample
   content the section is "Sample topics" and cards are not links; with
   FG-02 it becomes "Topics for B1" (the learner's level, FR-08), cards open
   room setup with that topic, and an "All topics" link appears.
6. History: table (motion, date, partner, report status); stacked rows on
   phones. With sample content the section is "Recent debates"; "All
   debates" appears with FG-10.

## States

- Join: a code that isn't 8 letters/digits (spaces and hyphens ignored) →
  "Enter the 8-character code from your partner."; a valid code opens the
  `#/invite` preview (no join API in Build 1). With the room API: unknown
  code → "No room uses this code. Check it with your partner, or ask for a
  new one."; full or expired → the existing full/expired messages.
- History with real data and no debates: "No debates yet." plus "Create your
  first room" (replaces the sample once FG-10 exists).
- Signed out: `#/home` shows the standard "Sign in to see this page." prompt,
  like other signed-in pages.

## Motion

Page enter (fade and 8px rise, 320ms), doors stagger 60ms apart, topic
cards stagger after them. Doors lift 2px on hover. All off with reduced
motion. Uses the tokens in [plan.md](plan.md) Task 3.

## Open issues

- **Yellow door vs. the One Accent Rule.** DESIGN.md keeps yellow for actions
  and selections. A full yellow panel is the create action itself, so it is
  arguably in bounds, but the doc should say so when it is updated (plan
  Task 0), or the door becomes white with a yellow button.
- Join accepts the code with or without the space; the API contract for
  join-by-code (FR-11) needs checking before build.
- Sample topics are written by us, not from a catalogue; FG-02 replaces them.
- Implementation: [plan.md](plan.md) Task 7.
