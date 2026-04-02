from fastapi import FastAPI
from backend.api.chat import router as chat_router

app = FastAPI(title="Unified AI Agent API")

app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "Hello from the Unified AI Agent Backend!"}
