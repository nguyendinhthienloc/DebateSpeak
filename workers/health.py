"""Worker health verification and state probe."""


def get_worker_status() -> dict[str, str]:
    """Return worker operational state for health checks."""
    return {
        "status": "ready",
        "service": "debatespeak-worker",
    }
