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

    def execute_command(self, command: str, workdir: str = "/workspace"):
        """
        Executes a shell command in a hardened Docker container.
        """
        if not self.client:
            raise RuntimeError("Docker client is not initialized")

        # Layer 1: Sanitization
        sanitized_cmd = sanitize_shell_command(command)
        
        try:
            # Layer 2: Sandbox with Least Privilege & Resource Limits
            container = self.client.containers.run(
                image=settings.DOCKER_IMAGE,
                command=f"bash -c {sanitized_cmd}",
                user="1000:1000",             # Non-root user
                network_disabled=True,        # No network access by default
                mem_limit="512m",             # Memory limit
                cpu_quota=50000,              # 50% of one CPU
                remove=True,                  # Auto-cleanup
                working_dir=workdir,
                stdout=True,
                stderr=True,
                detach=False,
                timeout=settings.SANDBOX_TIMEOUT
            )
            return container.decode("utf-8")
        except docker.errors.ContainerError as e:
            logger.warning(f"Container execution failed: {e}")
            return e.stderr.decode("utf-8")
        except Exception as e:
            logger.error(f"Unexpected error in docker execution: {e}")
            raise
