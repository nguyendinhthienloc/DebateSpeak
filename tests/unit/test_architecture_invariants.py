import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent

# Forbidden hardcoded absolute machine paths pattern (Windows & POSIX)
FORBIDDEN_PATH_PATTERN = re.compile(
    r"(?:[A-Za-z]:\\[Uu]sers\\|[A-Za-z]:\\APCS|/home/[a-zA-Z0-9_-]+/|/Users/[a-zA-Z0-9_-]+/)"
)


def test_zero_hardcoded_paths_in_codebase():
    """Invariant Check: No hardcoded machine paths in Python or TypeScript source files."""
    code_extensions = {".py", ".ts", ".tsx", ".toml"}
    scan_dirs = ["api", "workers", "tests"]

    violations = []
    for dir_name in scan_dirs:
        dir_path = REPO_ROOT / dir_name
        if not dir_path.exists():
            continue
        for file_path in dir_path.rglob("*"):
            if file_path.suffix in code_extensions and file_path.is_file():
                # Skip __pycache__
                if "__pycache__" in file_path.parts:
                    continue
                content = file_path.read_text(encoding="utf-8", errors="ignore")
                for line_no, line in enumerate(content.splitlines(), start=1):
                    # Ignore the test assertion regex itself
                    if "FORBIDDEN_PATH_PATTERN" in line:
                        continue
                    if FORBIDDEN_PATH_PATTERN.search(line):
                        violations.append(
                            f"{file_path.relative_to(REPO_ROOT)}:{line_no} -> {line.strip()}"
                        )

    assert not violations, "Hardcoded absolute paths found:\n" + "\n".join(violations)


def test_env_example_contains_required_keys():
    """Invariant Check: .env.example exists and contains template keys."""
    env_example = REPO_ROOT / ".env.example"
    assert env_example.exists(), ".env.example must exist at repo root"
    content = env_example.read_text(encoding="utf-8")
    assert "DATABASE_URL=" in content
    assert "REDIS_URL=" in content
