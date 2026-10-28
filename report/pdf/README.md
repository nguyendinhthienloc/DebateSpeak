# Markdown to PDF

This is the repository's only `latexmk` flow. Every submission PDF is converted from its Markdown source with one command:

```sh
python report/pdf/build.py <markdown file>
```

Examples:

```sh
python report/pdf/build.py docs/requirements/VISION_DOCUMENT.md --subtitle "Vision Document — PA2 / Group 02" --date "October 25, 2026"
python report/pdf/build.py docs/pa2/PROJECT_PLAN.md --subtitle "Project Plan — PA2 / Group 02"
```

The PDF is written next to the Markdown file with the same name. The title comes from the first `# ` line. Mermaid blocks, if any, are rendered locally and embedded as diagrams. Generated files stay in the ignored `report_build/` folder, and nothing is committed for you.

## Prerequisites

Python 3.11+, a TeX distribution with `latexmk`, `pdflatex` and Vietnamese T5 fonts (packages `lmodern`, `bookmark`, `longtable`, `booktabs`, `array`, `graphicx`, `xcolor`, `geometry`), and Pandoc. Pandoc on `PATH` is preferred; the local install below is a fallback. Node.js and Mermaid CLI are needed only for documents with Mermaid diagrams. Package downloads require network access.

From the repository root, install the document tooling into the ignored build folder:

```sh
python -m pip install --target report_build/tools pypandoc_binary==1.17
npm install --prefix report_build/mermaid --no-audit --no-fund @mermaid-js/mermaid-cli@12.0.0
```

## Check the result

Review each PDF for clipped text, table wrapping, readable diagrams, Vietnamese names and source links before submission. The Markdown file is the source of truth: fix the Markdown, never the PDF.
