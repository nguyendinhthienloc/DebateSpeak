"""Render the PA2 vision from its Markdown source using Mermaid, Pandoc, latexmk."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "docs" / "requirements" / "VISION_DOCUMENT.md"
BUILD = ROOT / "report_build" / "vision"


def required_tool(name: str, fallback: Path | None = None) -> str:
    found = shutil.which(name)
    if found:
        return found
    if fallback is not None and fallback.is_file():
        return str(fallback)
    raise SystemExit(f"Missing {name}. Follow report/vision/README.md to install it.")


def run(arguments: list[str]) -> None:
    subprocess.run(arguments, cwd=BUILD, check=True)


def main() -> None:
    BUILD.mkdir(parents=True, exist_ok=True)
    pandoc_name = "pandoc.exe" if shutil.which("cmd.exe") else "pandoc"
    pandoc = required_tool(
        "pandoc", ROOT / "report_build/tools/pypandoc/files" / pandoc_name
    )
    latexmk = required_tool("latexmk")
    node = required_tool("node")
    mermaid = ROOT / "report_build/mermaid/node_modules/@mermaid-js/mermaid-cli/src/cli.js"
    if not mermaid.is_file():
        raise SystemExit("Missing Mermaid CLI. Follow report/vision/README.md.")

    markdown = SOURCE.read_text(encoding="utf-8")
    blocks = re.findall(r"```mermaid\n(.*?)\n```", markdown, flags=re.DOTALL)
    if len(blocks) != 2:
        raise SystemExit("The PA2 vision must contain exactly two Mermaid workflows.")

    (BUILD / "mermaid.json").write_text(
        json.dumps({
            "theme": "neutral",
            "themeVariables": {"fontSize": "16px", "fontFamily": "Arial, sans-serif"},
            "flowchart": {
                "htmlLabels": False, "curve": "linear", "useMaxWidth": False,
                "wrappingWidth": 300, "nodeSpacing": 30, "rankSpacing": 25,
                "padding": 10,
            },
        }),
        encoding="utf-8",
    )
    for index, block in enumerate(blocks, start=1):
        stem = f"workflow-{index}"
        (BUILD / f"{stem}.mmd").write_text(block + "\n", encoding="utf-8")
        run([
            node, str(mermaid), "--input", f"{stem}.mmd",
            "--output", f"{stem}.pdf", "--backgroundColor", "white",
            "--configFile", "mermaid.json", "--size", "1400",
        ])
        markdown = markdown.replace(
            f"```mermaid\n{block}\n```",
            "\\begin{center}\n"
            f"\\includegraphics[width=\\linewidth,height=0.68\\textheight,keepaspectratio]{{{stem}.pdf}}\n"
            "\\end{center}",
            1,
        )

    # Pandoc supplies the title; retain the source's attribution and all body text.
    markdown = markdown.split("\n", 1)[1].lstrip()
    markdown = re.sub(r"^## ", "# ", markdown, flags=re.MULTILINE)
    markdown = re.sub(
        r"^(\*\*Workflow [12].*)$", lambda m: "\\clearpage\n\n" + m[1],
        markdown, flags=re.MULTILINE,
    )
    markdown = markdown.replace(
        "# 6. Non-Functional", "\\clearpage\n\n# 6. Non-Functional", 1
    )
    (BUILD / "vision.md").write_text(markdown, encoding="utf-8")
    (BUILD / "header.tex").write_text(
        r"""\usepackage{graphicx}
\pagestyle{plain}
\setlength{\emergencystretch}{3em}
\DeclareUnicodeCharacter{2192}{\ensuremath{\rightarrow}}
\DeclareUnicodeCharacter{2264}{\ensuremath{\leq}}
\DeclareUnicodeCharacter{2265}{\ensuremath{\geq}}
""",
        encoding="utf-8",
    )
    run([
        pandoc, "vision.md", "--from=markdown+pipe_tables+link_attributes-implicit_figures",
        "--to=latex", "--standalone", "--output=report.tex",
        "--metadata=title:DebateSpeak AI",
        "--metadata=subtitle:Vision Document — PA2 / Group 02",
        "--metadata=date:October 25, 2026",
        "--variable=documentclass:article", "--variable=papersize:a4",
        "--variable=fontsize:10pt", "--variable=geometry:margin=20mm",
        "--variable=fontenc:T5", "--variable=colorlinks:true",
        "--variable=linkcolor:blue", "--variable=urlcolor:blue",
        "--include-in-header=header.tex",
    ])
    run([latexmk, "-pdf", "-interaction=nonstopmode", "-halt-on-error", "report.tex"])
    destination = SOURCE.with_suffix(".pdf")
    shutil.copyfile(BUILD / "report.pdf", destination)
    print(f"Created {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
