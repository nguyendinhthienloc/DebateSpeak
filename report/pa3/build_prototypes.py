"""Refresh the offline prototype data from the reviewed PA3 source inventories."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PA3 = ROOT / "docs" / "pa3"


def main() -> None:
    catalogue = json.loads((PA3 / "use_cases.json").read_text(encoding="utf-8"))
    states = json.loads((PA3 / "prototype_states.json").read_text(encoding="utf-8"))
    identifiers = {item["id"] for item in catalogue["use_cases"]}
    state_ids = {item["id"] for item in states["use_cases"]}
    if identifiers != state_ids:
        raise SystemExit(
            f"Prototype state inventory mismatch: {identifiers ^ state_ids}"
        )
    payload = json.dumps(
        {"catalogue": catalogue, "states": states}, ensure_ascii=False, indent=2
    )
    (PA3 / "ui-prototypes" / "data.js").write_text(
        "// Generated from ../use_cases.json and ../prototype_states.json.\n"
        f"window.PA3_DATA = {payload};\n",
        encoding="utf-8",
    )
    print(f"Prepared offline data for {len(identifiers)} use cases.")


if __name__ == "__main__":
    main()
