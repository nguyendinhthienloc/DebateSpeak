# Build the PA2 Vision Document

The authoritative source is [VISION_DOCUMENT.md](../../docs/requirements/VISION_DOCUMENT.md).
The submission output is [VISION_DOCUMENT.pdf](../../docs/requirements/VISION_DOCUMENT.pdf).
Both Mermaid diagrams are rendered locally from the fenced blocks in that Markdown;
the PDF contains rendered diagrams, not their source code.

Prerequisites: Python 3.11+, Node.js supported by Mermaid CLI, and a TeX distribution
with `latexmk`, `pdflatex`, Vietnamese T5 fonts, and the packages required by Pandoc's
LaTeX template (`lmodern`, `bookmark`, `longtable`, `booktabs`, `array`, `graphicx`,
`xcolor`, and `geometry`).
TeX tools must be on `PATH`. Pandoc on `PATH` is preferred; the local installation
below is a fallback. Package downloads require network access.

From the repository root, install document tooling into the ignored build directory:

```sh
python -m pip install --target report_build/tools pypandoc_binary==1.17
npm install --prefix report_build/mermaid --no-audit --no-fund @mermaid-js/mermaid-cli@12.0.0
```

Then build:

```sh
python report/vision/build.py
```

The script resolves paths relative to itself, extracts and renders the two Mermaid
blocks, converts the document to LaTeX with Pandoc, and runs:

```sh
latexmk -pdf -interaction=nonstopmode -halt-on-error report.tex
```

That command runs inside `report_build/vision/`. All generated Markdown, diagram
files, LaTeX, logs, and auxiliary files stay there. The completed PDF is copied
beside the original Markdown only after compilation succeeds. The script does not
install dependencies, modify Jira, commit files, or mark a human review complete.

For text extraction during quality review, an optional local tool can be installed:

```sh
python -m pip install --target report_build/tools pypdf==6.21.2
```

Review the generated PDF for clipped text, table wrapping, readable diagrams,
Vietnamese names, and source links before submission. The initial draft explicitly
records pending human review and includes an AI-assistance entry for the team's
PA2 usage report.
