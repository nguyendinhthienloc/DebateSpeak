# Main menu (`#/home`) — brief

Status: built on `feature/SCRUM-53-ui-refresh` (plan Task 7), 2026-11-17. Visual mock (private):
<https://claude.ai/artifact/P7z2oy5LazEijDnxuqAY5N> (desktop, phone, states).

## Direction contract

THESIS: start or join is the whole first screen; two equal doors replace the usual dashboard of cards.
OWN-WORLD: Cream & Yellow (DESIGN.md): cream ground, a full yellow Create door with an ink button, a white Join door, ink 1px borders, Archivo 800 semi-condensed headings, Inter text.
STORY: the learner sees two clear ways in, learns that neither starts audio, then sees labelled samples of what topics and history will hold.
FIRST VIEWPORT: header (brand, signed-in line, Home marked current, Account, Sign out); greeting; the two doors side by side at 64px headings, Create on the left; the audio note under them.
FORM: "Twin doors", position 1 of 7 on the grounded list, dealt in the surface roll; seed:58f673b3f5224554
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

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
2. Greeting in Inter 300, 22px ("Good evening, Linh."); "Signed in as …" sits in the header.
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

One entrance: the page fades and rises 8px (320ms), the doors stagger 60ms
apart, then the topic cards. Doors do not lift on hover: they are regions,
not links, and a panel that moves under the pointer flickers. All off with
reduced motion. Uses the tokens in [plan.md](plan.md) Task 3.

## Open issues

- Resolved: DESIGN.md (Do's and Don'ts) allows a fully yellow panel only when
  the panel is itself the action, as the Create door is.
- Join accepts the code with or without the space; the API contract for
  join-by-code (FR-11) needs checking before build.
- Sample topics are written by us, not from a catalogue; FG-02 replaces them.
- Implementation: [plan.md](plan.md) Task 7.
