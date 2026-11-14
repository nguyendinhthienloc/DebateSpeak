# PA3 use-case interaction prototypes
Performed: Trần Lê Anh Tuấn (24125107), AI Orchestrator & Analysis Lead. Reviewed: Nguyễn Bảo Minh Triết (24125047), Frontend & WebRTC/Audio Lead, and Nguyễn Đình Thiên Lộc (24125093), DevOps & QA / Fact-Checking Lead — pending. Edited: Trần Lê Anh Tuấn (24125107).

Open [index.html](index.html) directly in a browser. No development server is needed. Choose one of 54 use cases in the left navigation, then switch between Basic flow and Alternative & error flows. On small screens use the UC hash links from the specifications. All examples are fictional design compositions; no password, recording, account, provider request or deletion is transmitted or stored.

## Interaction and screenshot coverage
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Triết (24125047), 2026-11-14; Lộc (24125093), pending. Edited: Trần Lê Anh Tuấn (24125107).

The main screen combines the action view with a result preview. The alternative view contains one visible outcome screen per named alternative/exception branch, with a recovery control. Reviewer annotations explain the condition and expected outcome separately from the learner-facing notice. The 201 outcome screens are captured in 54 contact sheets. Each specification embeds its main screen and contact sheet. Six mobile examples use a 390-pixel viewport. The start and audience use cases additionally include authorized future-scenario screenshots; their default examples remain blocked.

Start is blocked by default in the Build 1 scenario. The design-scenario switch loads a fictional future session with independently recorded consents, passed mic tests and media capability; it is not a control that grants the partner's consent. End, consent withdrawal, confirmation before deletion, per-debater grading ranges, moderation decisions and personal camera choice have distinct preview outcomes. Submission validation is illustrative; server-side validation and authorization remain mandatory in the product.

## Regeneration
Performed: Trần Lê Anh Tuấn (24125107). Reviewed: Triết (24125047), 2026-11-14; Lộc (24125093), pending. Edited: Trần Lê Anh Tuấn (24125107).

From the repository root, with Python 3.11+ and Node installed:

```sh
python report/pa3/build_prototypes.py
node report/pa3/capture_prototypes.mjs
```

The capture helper imports Playwright installed under `report_build/mermaid/`. Install document/browser tooling with the commands in [the implementation guide](../tuan/IMPLEMENTATION_GUIDE.md). It uses an installed Chrome/Edge on Windows or the `BROWSER_EXECUTABLE` environment variable; otherwise install a Playwright Chromium browser. The browser runs headlessly; non-file requests are blocked. Validation results are written to ignored `report_build/pa3-prototype-validation.json`.

Edit the catalogue, specifications and `prototype_states.json` consistently. Then regenerate `data.js` and PNGs; do not hand-edit generated data. Screenshots are deliverable assets and must accompany the Markdown/PDF when copied elsewhere. Browser dependencies and local environments stay out of submission archives.
