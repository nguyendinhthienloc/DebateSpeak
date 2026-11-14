"""Check PA3 model/spec/prototype traceability and local deliverable assets."""

import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PA3 = ROOT / "docs" / "pa3"


def main() -> None:
    catalogue = json.loads((PA3 / "use_cases.json").read_text(encoding="utf-8"))
    state_data = json.loads((PA3 / "prototype_states.json").read_text(encoding="utf-8"))
    cases = catalogue["use_cases"]
    ids = [case["id"] for case in cases]
    assert len(ids) == len(set(ids)), "Duplicate use-case IDs"
    assert ids == [case["id"] for case in state_data["use_cases"]], (
        "State inventory mismatch"
    )
    requirements = {fr for case in cases for fr in case["requirements"]}
    assert requirements == {f"FR-{n:02d}" for n in range(1, 61)}, "FR coverage mismatch"
    assert {case["fg"] for case in cases} == {f"FG-{n:02d}" for n in range(1, 11)}
    model = (PA3 / "USE_CASE_MODEL.md").read_text(encoding="utf-8")
    spec = (PA3 / "USE_CASE_SPECIFICATIONS.md").read_text(encoding="utf-8")
    assert len(re.findall(r"^```mermaid$", model, re.MULTILINE)) == 11, (
        "Expected overview + 10 FG diagrams"
    )
    assert re.findall(r"^### (UC-\d{2}-\d{2})", spec, re.MULTILINE) == ids, (
        "Spec inventory mismatch"
    )
    for document in [model, spec]:
        lines = document.splitlines()
        in_code = False
        for index, line in enumerate(lines):
            if line.startswith("```"):
                in_code = not in_code
            if line.startswith("#") and not in_code:
                attribution = lines[index + 1]
                assert all(
                    word in attribution
                    for word in ["Performed:", "Reviewed:", "Edited:"]
                ), line
    for case in cases:
        assert case["id"] in model
    for relation in catalogue["relationships"]:
        assert relation["source"] in ids and relation["target"] in ids
    for case in state_data["use_cases"]:
        branches = case["alternatives"]
        assert len(branches) >= 3, case["id"]
        assert len({item["id"] for item in branches}) == len(branches), case["id"]
        assert all(item["detail"] and item["outcome"] for item in branches)
    images = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", spec)
    for relative in images:
        filename = PA3 / relative
        assert filename.is_file(), f"Missing image: {relative}"
        header = filename.read_bytes()[:24]
        assert header[:8] == b"\x89PNG\r\n\x1a\n", relative
        width, height = struct.unpack(">II", header[16:24])
        assert width >= 300 and height >= 100, relative
    javascript = (PA3 / "prototypes" / "prototype.js").read_text(encoding="utf-8")
    for identifier in ids:
        assert f'"{identifier}": [' in javascript, (
            f"Missing UI composition: {identifier}"
        )
    payload = {
        "use_cases": len(ids),
        "requirements": len(requirements),
        "functional_groups": 10,
        "mermaid_diagrams": 11,
        "alternative_states": sum(
            len(case["alternatives"]) for case in state_data["use_cases"]
        ),
        "embedded_screenshots": len(images),
        "status": "passed",
    }
    destination = ROOT / "report_build" / "pa3-document-validation.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload))


if __name__ == "__main__":
    main()
