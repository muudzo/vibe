import re
from typing import List

# List of dangerous patterns that should be blocked even within a sandbox
DANGEROUS_PATTERNS = [
    r"rm\s+-rf\s+/",         # Block root deletion
    r"kill\s+-9\s+-1",       # Block killing all processes
    r"fork\(\)",             # Block fork bombs
    r":\(\){:|:&};:",        # Bash fork bomb
    r"chmod\s+-R\s+777",     # Prevent mass permission changes
    r"dd\s+if=/dev/zero",    # Basic disk wiper
]

def sanitize_shell_command(command: str) -> str:
    """
    Sanitizes a shell command by checking for dangerous patterns.
    This is a secondary layer of defense to the Docker sandbox.
    """
    cmd_clean = command.strip()
    
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, cmd_clean, re.IGNORECASE):
            raise ValueError(f"Command contains forbidden pattern: {pattern}")
            
    return cmd_clean

def validate_environment_variables(env: dict) -> dict:
    """
    Ensures no sensitive system environment variables are leaked into the sandbox.
    """
    forbidden_keys = {"ANTHROPIC_API_KEY", "SECRET_KEY", "DATABASE_URL"}
    return {k: v for k, v in env.items() if k not in forbidden_keys}
