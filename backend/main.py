from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from backend.api.chat import router as chat_router
from backend.core.config import settings

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Hello from the Unified AI Agent Backend!"}
