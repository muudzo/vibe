from sqlalchemy.orm import Session
from backend.models.chat import Chat, Message
from uuid import UUID
import uuid

class ChatService:
    def __init__(self, db: Session):
        self.db = db

    def create_chat(self, user_id: str, title: str = None) -> Chat:
        chat = Chat(user_id=user_id, title=title)
        self.db.add(chat)
        self.db.commit()
        self.db.refresh(chat)
        return chat

    def add_message(self, chat_id: UUID, role: str, content: str, client_id: str = None) -> Message:
        # Idempotency check: if client_id is provided, check if message already exists
        if client_id:
            existing_message = self.db.query(Message).filter(Message.client_id == client_id).first()
            if existing_message:
                return existing_message

        message = Message(chat_id=chat_id, role=role, content=content, client_id=client_id)
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def get_chat_history(self, chat_id: UUID):
        return self.db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at.asc()).all()
