# Rate limiter configuration using slowapi
# NOTE: This file sets up the rate limiter for the FastAPI application using the slowapi

from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

def custom_rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": "RATE_LIMIT_EXCEEDED",
            "message": "Too many requests. Please try again after few minutes."
        }
    )