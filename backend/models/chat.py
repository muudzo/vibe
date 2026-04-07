from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from backend.core.database import Base

class Chat(Base):
    __tablename__ = "chats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=False)
    title = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Index on user_id and created_at for fast retrieval of user chat history
    __table_args__ = (
        Index("ix_chats_user_id_created_at", "user_id", "created_at"),
    )

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(String, unique=True, nullable=True) # For idempotency
    role = Column(String, nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Index on chat_id and created_at for fast message history retrieval
    __table_args__ = (
        Index("ix_messages_chat_id_created_at", "chat_id", "created_at"),
        Index("ix_messages_client_id", "client_id"),
    )

class ToolCall(Base):
    __tablename__ = "tool_calls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    tool_name = Column(String, nullable=False)
    arguments = Column(String, nullable=False) # JSON string
    status = Column(String, default="pending") # pending, approved, denied, executed
    result = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # Index for checking pending approvals quickly
    __table_args__ = (
        Index("ix_tool_calls_chat_id_status", "chat_id", "status"),
    )
