import logging
import json
from datetime import datetime
from typing import Any, Dict

# Setup a dedicated audit logger
audit_logger = logging.getLogger("vibe.audit")
audit_logger.setLevel(logging.INFO)

# Create file handler for audit logs
handler = logging.FileHandler("audit.log")
handler.setFormatter(logging.Formatter('%(message)s'))
audit_logger.addHandler(handler)

def log_audit_event(event_type: str, user_id: str, details: Dict[str, Any]):
    """
    Logs a security audit event in JSON format.
    """
    event = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "user_id": user_id,
        "details": details
    }
    audit_logger.info(json.dumps(event))
