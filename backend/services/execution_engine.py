from backend.services.docker_service import DockerService
import logging

logger = logging.getLogger(__name__)

class ExecutionEngine:
    def __init__(self, docker_service: DockerService):
        self.docker_service = docker_service

    def run_shell(self, command: str, session_id: str = None):
        """
        Orchestrates shell command execution and logs the result.
        """
        logger.info(f"Executing shell command in session {session_id}: {command}")
        output = self.docker_service.execute_command(command, session_id=session_id)
        return {
            "output": output,
            "status": "completed"
        }
