from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class MessageBase(BaseModel):
    role: str
    content: str
    client_id: Optional[str] = None

class MessageCreate(MessageBase):
    pass

class MessageRead(MessageBase):
    id: UUID
    chat_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ToolCallRead(BaseModel):
    id: UUID
    chat_id: UUID
    tool_name: str
    arguments: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatBase(BaseModel):
    title: Optional[str] = None

class ChatCreate(ChatBase):
    user_id: str

class ChatRead(ChatBase):
    id: UUID
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ChatWithHistory(ChatRead):
    messages: List[MessageRead]
