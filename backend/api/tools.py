from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models.chat import ToolCall
from backend.api import schemas
from uuid import UUID
from typing import List
from datetime import datetime
from slowapi import Limiter
from slowapi.util import get_remote_address
from backend.services.docker_service import DockerService
from backend.services.execution_engine import ExecutionEngine
from backend.services.file_service import FileService
from pydantic import BaseModel

router = APIRouter(prefix="/tools", tags=["tools"])
limiter = Limiter(key_func=get_remote_address)


# Initialize services
docker_service = DockerService()
execution_engine = ExecutionEngine(docker_service)
file_service = FileService(docker_service)

class ShellRequest(BaseModel):
    command: str
    session_id: str = None

class FileWriteRequest(BaseModel):
    path: str
    content: str
    session_id: str = None

class FileReadRequest(BaseModel):
    path: str
    session_id: str = None

@router.post("/shell")
@limiter.limit("10/minute")
def run_shell(request: ShellRequest):
    return execution_engine.run_shell(request.command, session_id=request.session_id)

@router.post("/files/write")
@limiter.limit("20/minute")
def write_file(request: FileWriteRequest):
    return file_service.write_file(request.path, request.content, session_id=request.session_id)

@router.post("/files/read")
@limiter.limit("20/minute")
def read_file(request: FileReadRequest):
    output = file_service.read_file(request.path, session_id=request.session_id)
    return {"content": output}

@router.post("/files/list")
@limiter.limit("20/minute")
def list_files(request: FileReadRequest):
    output = file_service.list_files(request.path, session_id=request.session_id)
    return {"files": output}

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
