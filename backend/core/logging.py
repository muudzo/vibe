import logging
import re
from backend.core.config import settings

# Patterns to mask in logs
SENSITIVE_PATTERNS = [
    (r"sk-[a-zA-Z0-9]{44,}", "sk-REDACTED"), # Anthropic keys
    (r"postgresql://[^:]+:[^@]+@", "postgresql://REDACTED:REDACTED@"), # DB URL
    (r"SECRET_KEY=[^\s]+", "SECRET_KEY=REDACTED"),
]

class RedactingFormatter(logging.Formatter):
    def format(self, record):
        message = super().format(record)
        for pattern, replacement in SENSITIVE_PATTERNS:
            message = re.sub(pattern, replacement, message)
        return message

def setup_logging():
    handler = logging.StreamHandler()
    formatter = RedactingFormatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)
    
    # Silence verbose libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("docker").setLevel(logging.WARNING)

setup_logging()
