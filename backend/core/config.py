from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    PROJECT_NAME: str = "Unified AI Agent"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = "supersecretkeychangeinproduction" # Change this!
    ALLOWED_HOSTS: list[str] = ["*"] # Be more specific in prod
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/vibe"
    
    # AI Models
    ANTHROPIC_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    # Sandboxing
    DOCKER_IMAGE: str = "python:3.11-slim"
    SANDBOX_TIMEOUT: int = 30 # seconds
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
