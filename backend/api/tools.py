from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.services.tool_service import ToolService
from backend.models.chat import ToolCall
from backend.api import schemas
from uuid import UUID
from typing import List
from datetime import datetime
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/tools", tags=["tools"])
limiter = Limiter(key_func=get_remote_address)

@router.get("/pending/{chat_id}", response_model=List[schemas.ToolCallRead])
@limiter.limit("20/minute")
def get_pending_tools(request: Request, chat_id: UUID, db: Session = Depends(get_db)):
    return db.query(ToolCall).filter(ToolCall.chat_id == chat_id, ToolCall.status == "pending").all()

@router.post("/{tool_call_id}/approve")
@limiter.limit("10/minute")
def approve_tool(request: Request, tool_call_id: UUID, db: Session = Depends(get_db)):
    tool_call = db.query(ToolCall).filter(ToolCall.id == tool_call_id).first()
    if not tool_call:
        raise HTTPException(status_code=404, detail="Tool call not found")
    
    if tool_call.status != "pending":
        raise HTTPException(status_code=400, detail="Tool call is not in pending status")
    
    tool_call.status = "approved"
    tool_call.approved_at = datetime.utcnow()
    db.commit()
    
    service = ToolService(db)
    return service.execute_tool(tool_call)

@router.post("/{tool_call_id}/deny")
@limiter.limit("10/minute")
def deny_tool(request: Request, tool_call_id: UUID, db: Session = Depends(get_db)):
    tool_call = db.query(ToolCall).filter(ToolCall.id == tool_call_id).first()
    if not tool_call:
        raise HTTPException(status_code=404, detail="Tool call not found")
    
    tool_call.status = "denied"
    db.commit()
    return {"status": "denied"}
