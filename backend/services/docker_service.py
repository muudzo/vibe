import docker
from backend.core.config import settings
from backend.core.security import sanitize_shell_command
import logging

logger = logging.getLogger(__name__)

class DockerService:
    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception as e:
            logger.error(f"Failed to connect to Docker daemon: {e}")
            self.client = None

    def _get_container(self, session_id: str):
        """
        Retrieves or creates a persistent container for a session.
        """
        container_name = f"vibe-sandbox-{session_id}"
        try:
            return self.client.containers.get(container_name)
        except docker.errors.NotFound:
            return self.client.containers.run(
                image=settings.DOCKER_IMAGE,
                name=container_name,
                user="1000:1000",
                network_disabled=True,
                mem_limit="512m",
                cpu_quota=50000,
                detach=True,
                tty=True,
                command="/bin/bash",
                working_dir="/workspace"
            )

    def execute_command(self, command: str, session_id: str = None, workdir: str = "/workspace"):
        """
        Executes a shell command in a Docker container.
        """
        if not self.client:
            raise RuntimeError("Docker client is not initialized")

        sanitized_cmd = sanitize_shell_command(command)
        
        try:
            if session_id:
                container = self._get_container(session_id)
                exit_code, output = container.exec_run(
                    cmd=f"bash -c {sanitized_cmd}",
                    workdir=workdir,
                    user="1000:1000"
                )
                return output.decode("utf-8")
            else:
                # Ephemeral execution
                return self.client.containers.run(
                    image=settings.DOCKER_IMAGE,
                    command=f"bash -c {sanitized_cmd}",
                    user="1000:1000",
                    network_disabled=True,
                    mem_limit="512m",
                    cpu_quota=50000,
                    remove=True,
                    working_dir=workdir,
                    stdout=True,
                    stderr=True,
                    timeout=settings.SANDBOX_TIMEOUT
                ).decode("utf-8")
        except Exception as e:
            logger.error(f"Docker execution error: {e}")
            raise

