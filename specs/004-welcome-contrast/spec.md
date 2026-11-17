# 004 — Welcome page and contrast system

Status: in progress on `feature/SCRUM-53-ui-refresh`, 2026-11-17.

## Why the UI read as bland (diagnosis)

Text contrast was never the problem (Ink on Cream 15.1:1). Surface contrast was:

| Boundary | Ratio | Rule that caused it |
|---|---|---|
| White card on Cream | 1.09:1 | "White belongs to fields and separated surfaces" on a Cream canvas |
| Hairline divider on Cream | 1.32:1 | "Open sections use spacing and thin rules instead of enclosing cards" |
| Yellow panel on Cream | 1.35:1 | "The One Accent Rule": yellow only on small controls |
| Disabled control on Cream | 1.23:1 | Grey `disabled` fill, no boundary |

Supporting rules made it worse: "Flat by default, no shadow vocabulary",
"no pastel panels / don't tint sections", and SCRUM-49's "no decorative palette,
imagery or shadows". Together they allowed only the softest rendition of the
Cream & Yellow palette: every feature sat at about 1:1 against the page, so
nothing stood out. WCAG 1.4.11 asks 3:1 for component boundaries.

## New rules (replace the ones above)

1. **Contrast floor.** Every feature surface (panel, card, seat, topic, pane)
   has a boundary of at least 3:1 against its ground: a 1.5px Ink edge, or a
   fill that is itself 3:1 (Ink on Cream, or Yellow on Ink).
2. **Committed colour.** Yellow and Ink may own whole regions: the app header
   is an Ink bar, Home's topics column is an Ink field, the Create door is
   Yellow. The welcome page alternates full Yellow, Ink and Cream fields.
3. **One raised elevation.** A soft, offset, ink-tinted shadow (`--raised`) marks
   surfaces you can act on; hover deepens it. No glow, no hard offset block.
4. **Disabled is drawn, not greyed.** Transparent fill, 1.5px dashed Border
   (3.67:1 on Cream), Muted text.
5. **Darker supporting text and dividers.** Muted `#454B46`; dividers at 28% Ink.

Palette values, type, radius and motion tokens are unchanged.

## Welcome page (`#/welcome`)

Decisions confirmed by the user, 2026-11-17:

- **Route:** new `#/welcome`, the default entry for signed-out visitors.
  `#/sign-in` still works directly; signed-in visitors still go to `#/home`.
- **First screen:** try-it-first. An example motion with two side buttons;
  choosing a side answers in place and points to creating an account.
- **Scroll:** full-height sections with scroll snap; each section shows one
  step of the loop (pick a side, invite, debate, transcript, feedback) and ends
  with sign-in / create account.
- **Honesty:** unbuilt steps (live audio, transcript, feedback reports) show the
  intended screen with example data and a "Coming in a later release" tag.
  Nothing claims learning outcomes, users or accuracy.
- **Mode:** Persuade. Structure chosen on the Impeccable decision page; the
  direction contract lives in the surface brief, not in source.

Acceptance: one `h1`; keyboard reaches every action; snap and motion off under
reduced motion; no horizontal scroll at 320–1920px; no network request from
the try-it control.
