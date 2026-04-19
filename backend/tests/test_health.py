"""
Tests for health check endpoints
"""
import pytest
from httpx import AsyncClient
from server import app


@pytest.mark.asyncio
async def test_health_check():
    """Test basic health check endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert data["service"] == "EssentiElles API"


@pytest.mark.asyncio
async def test_detailed_health_check():
    """Test detailed health check with database status"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health/detailed")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "checks" in data
        assert "database" in data["checks"]
        assert "environment" in data["checks"]


@pytest.mark.asyncio
async def test_metrics_endpoint():
    """Test metrics endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/metrics")
        
        assert response.status_code == 200
        data = response.json()
        assert "timestamp" in data
