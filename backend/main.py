from fastapi import FastAPI
from backend.api.chat import router as chat_router
from backend.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Hello from the Unified AI Agent Backend!"}
