from sqlalchemy.orm import Session
from backend.models.chat import ToolCall
from backend.services.docker_service import DockerService
from uuid import UUID
import json
import logging

logger = logging.getLogger(__name__)
audit_logger = logging.getLogger("audit")

# List of tools that require explicit human approval
HIGH_RISK_TOOLS = ["shell_execute", "filesystem_write", "filesystem_delete"]

class ToolService:
    def __init__(self, db: Session):
        self.db = db
        self.docker = DockerService()

    def audit_log(self, event: str, details: dict):
        """Records a structured security/audit event."""
        audit_logger.info(f"AUDIT | {event} | {json.dumps(details)}")

    def request_tool_execution(self, chat_id: UUID, tool_name: str, arguments: dict):
        """
        Processes a tool call request. Decides if it needs approval or can execute.
        """
        self.audit_log("TOOL_REQUEST", {"chat_id": str(chat_id), "tool": tool_name, "args": arguments})
        is_high_risk = tool_name in HIGH_RISK_TOOLS
        
        # Create record
        tool_call = ToolCall(
            chat_id=chat_id,
            tool_name=tool_name,
            arguments=json.dumps(arguments),
            status="pending" if is_high_risk else "approved"
        )
        self.db.add(tool_call)
        self.db.commit()
        self.db.refresh(tool_call)
        
        if not is_high_risk:
            return self.execute_tool(tool_call)
        
        return {"id": str(tool_call.id), "status": "pending_approval", "tool": tool_name}

    def execute_tool(self, tool_call: ToolCall):
        """
        Actual execution logic (Shell, FS, etc.)
        """
        if tool_call.status != "approved":
            raise PermissionError("Tool call is not approved for execution")
            
        args = json.loads(tool_call.arguments)
        result = ""
        
        try:
            if tool_call.tool_name == "shell_execute":
                result = self.docker.execute_command(args.get("command", ""))
            
            tool_call.status = "executed"
            tool_call.result = result
            self.db.commit()
            return {"status": "success", "result": result}
        except Exception as e:
            logger.error(f"Tool execution failed: {e}")
            tool_call.status = "failed"
            tool_call.result = str(e)
            self.db.commit()
            raise
