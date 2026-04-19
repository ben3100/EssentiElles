"""
Pytest configuration and fixtures
"""
import pytest
from motor.motor_asyncio import AsyncIOMotorClient
import os


@pytest.fixture(scope="session")
def mongodb_url():
    """MongoDB test database URL"""
    return os.getenv("MONGO_URL_TEST", "mongodb://localhost:27017/")


@pytest.fixture(scope="session")
async def mongodb_client(mongodb_url):
    """Create MongoDB client for tests"""
    client = AsyncIOMotorClient(mongodb_url)
    yield client
    client.close()


@pytest.fixture
async def test_db(mongodb_client):
    """Create test database"""
    db_name = "essentielles_test"
    db = mongodb_client[db_name]
    
    yield db
    
    # Cleanup: drop all collections after test
    for collection_name in await db.list_collection_names():
        await db[collection_name].drop()
