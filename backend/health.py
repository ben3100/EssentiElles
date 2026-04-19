"""
Health check and monitoring endpoints
"""
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """
    Basic health check endpoint
    Returns 200 if service is running
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "EssentiElles API",
        "version": "1.0.0"
    }


@router.get("/health/detailed")
async def detailed_health_check(db: AsyncIOMotorClient = Depends()):
    """
    Detailed health check including database connectivity
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "EssentiElles API",
        "version": "1.0.0",
        "checks": {}
    }
    
    # Check database connection
    try:
        await db.admin.command('ping')
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "Connected to MongoDB"
        }
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status["status"] = "unhealthy"
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": str(e)
        }
    
    # Check environment variables
    required_env_vars = ["MONGO_URL", "DB_NAME", "JWT_SECRET"]
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        health_status["status"] = "unhealthy"
        health_status["checks"]["environment"] = {
            "status": "unhealthy",
            "message": f"Missing environment variables: {', '.join(missing_vars)}"
        }
    else:
        health_status["checks"]["environment"] = {
            "status": "healthy",
            "message": "All required environment variables are set"
        }
    
    return health_status


@router.get("/metrics")
async def get_metrics():
    """
    Basic metrics endpoint for monitoring
    Can be extended with Prometheus metrics
    """
    return {
        "timestamp": datetime.now().isoformat(),
        "uptime": "N/A",  # Implement actual uptime tracking
        "requests_total": "N/A",  # Implement request counter
        "errors_total": "N/A",  # Implement error counter
    }
