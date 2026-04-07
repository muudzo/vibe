from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.services.chat_service import ChatService
from backend.api import schemas
from uuid import UUID
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/chats", tags=["chats"])
limiter = Limiter(key_func=get_remote_address)

@router.post("/", response_model=schemas.ChatRead)
@limiter.limit("5/minute")
def create_chat(request: Request, chat: schemas.ChatCreate, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.create_chat(user_id=chat.user_id, title=chat.title)

@router.post("/{chat_id}/messages", response_model=schemas.MessageRead)
@limiter.limit("20/minute")
def add_message(request: Request, chat_id: UUID, message: schemas.MessageCreate, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.add_message(chat_id=chat_id, role=message.role, content=message.content, client_id=message.client_id)

@router.get("/{chat_id}/history", response_model=List[schemas.MessageRead])
@limiter.limit("30/minute")
def get_chat_history(request: Request, chat_id: UUID, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.get_chat_history(chat_id=chat_id)
