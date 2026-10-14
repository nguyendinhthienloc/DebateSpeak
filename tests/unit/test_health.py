from app.main import app
from fastapi.testclient import TestClient

from workers.health import get_worker_status

client = TestClient(app)


def test_api_health_endpoint():
    """Verify that the FastAPI /health endpoint returns 200 OK and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "debatespeak-api"
    assert "version" in data


def test_worker_status_probe():
    """Verify worker health probe returns ready status."""
    status = get_worker_status()
    assert status["status"] == "ready"
    assert status["service"] == "debatespeak-worker"
