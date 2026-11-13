# PA2 Resubmission Documents

Collected from the current branch first, with deleted training evidence recovered
from Git history. Original document contents and review/training statuses are
preserved.

| Deliverable | Included files | Source |
|---|---|---|
| Vision Document | [Markdown](VISION_DOCUMENT.md), [PDF](VISION_DOCUMENT.pdf) | Current `docs/requirements/` files; PDF is unchanged from `1868dce`. The Markdown includes revisions made after `5a0d9e8`. |
| Spec Kit and constitution | [constitution.md](constitution.md), [Spec Kit scaffold](spec-kit/.specify/), [agent skills](spec-kit/.github/skills/) | Current root-level `.specify/` and `.github/skills/`, originally initialized in `8e32cba`; constitution includes the later 1.0.1 amendment. |
| Spec Kit training | [Training register](SPECKIT_TRAINING.md), [Triết's training note](speckit-training-Triet.md) | Restored from `a1c2358`, including the note linked by the register. |
| Project Plan | [Markdown](PROJECT_PLAN.md), [PDF](PROJECT_PLAN.pdf) | Current `docs/requirements/PROJECT_PLAN.md`; PDF generated with `report/pdf/build.py` (Pandoc and `latexmk`). |

`constitution.md` is an identical, easy-to-find copy of
`spec-kit/.specify/memory/constitution.md`. The Spec Kit snapshot keeps its relative
directory structure; the obsolete duplicate under `src/` is unnecessary. Historical
`src/` references in the training documents describe the setup at the time.

Rebuild the Project Plan PDF from the repository root:

```sh
python report/pdf/build.py docs/resubmit/PROJECT_PLAN.md --subtitle "Project Plan - PA2 / Group 02"
```

The restored training register still has empty entries for Tài, Khoa and Tuấn and
pending constitution acknowledgements. Collecting these files does not complete
that evidence.
