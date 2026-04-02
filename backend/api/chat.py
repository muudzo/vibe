from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.services.chat_service import ChatService
from backend.api import schemas
from uuid import UUID
from typing import List

router = APIRouter(prefix="/api/chats", tags=["chats"])

@router.post("/", response_model=schemas.ChatRead)
def create_chat(chat: schemas.ChatCreate, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.create_chat(user_id=chat.user_id, title=chat.title)

@router.post("/{chat_id}/messages", response_model=schemas.MessageRead)
def add_message(chat_id: UUID, message: schemas.MessageCreate, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.add_message(chat_id=chat_id, role=message.role, content=message.content, client_id=message.client_id)

@router.get("/{chat_id}/history", response_model=List[schemas.MessageRead])
def get_chat_history(chat_id: UUID, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.get_chat_history(chat_id=chat_id)
