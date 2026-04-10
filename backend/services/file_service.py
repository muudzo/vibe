from backend.services.docker_service import DockerService
import logging
import base64

logger = logging.getLogger(__name__)

class FileService:
    def __init__(self, docker_service: DockerService):
        self.docker_service = docker_service

    def write_file(self, path: str, content: str, session_id: str = None):
        """
        Writes a file to the sandboxed filesystem.
        """
        # We use base64 to avoid shell escaping issues
        encoded_content = base64.b64encode(content.encode()).decode()
        command = f"echo {encoded_content} | base64 -d > {path}"
        return self.docker_service.execute_command(command, session_id=session_id)

    def read_file(self, path: str, session_id: str = None):
        """
        Reads a file from the sandboxed filesystem.
        """
        command = f"cat {path}"
        return self.docker_service.execute_command(command, session_id=session_id)

    def list_files(self, path: str = ".", session_id: str = None):
        """
        Lists files in the sandboxed filesystem.
        """
        command = f"ls -F {path}"
        return self.docker_service.execute_command(command, session_id=session_id)
