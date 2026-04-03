from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()

def get_base_dir() -> Path:
    """Intelligently find the project root, whether running locally or from backend dir"""
    if base_root := os.getenv("BASE_ROOT"):
        return Path(base_root)
    
    # Start from this config file location
    current = Path(__file__).resolve().parent  # backend/app/core
    
    # Traverse up to find project root (contains pyproject.toml or .git)
    for _ in range(5):  # Go up max 5 levels
        if (current / "pyproject.toml").exists() or (current / ".git").exists():
            return current
        current = current.parent
    
    # Fallback: assume we're in backend dir, go up one level
    return Path.cwd().parent if "backend" in str(Path.cwd()) else Path.cwd()


class Settings:
    """Simple config class - no pydantic bloat for basic settings"""

    # === Core paths - loaded from .env ===
    BASE_DIR: Path = get_base_dir()
    DATA_DIR: Path = BASE_DIR / "data"
    CHECKPOINTS_DIR: Path = BASE_DIR / "checkpoints"
    TEMP_UPLOAD_DIR: Path = BASE_DIR / "temp_uploads"

    # === API Keys ===
    GOOGLE_API_KEY: Optional[str] = os.getenv("GOOGLE_API_KEY")
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    RAPID_API_KEY: Optional[str] = os.getenv("RAPID_API_KEY")

    # === App settings ===
    PROJECT_NAME: str = "Resume Optimizer API"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

    # === Checkpointer ===
    CHECKPOINTER_TYPE: str = os.getenv("CHECKPOINTER_TYPE", "sqlite")
    SQLITE_DB_NAME: str = os.getenv("SQLITE_DB_NAME", "resume_checkpoints.db")

    def __init__(self):
        """Basic validation on init"""
        # Create base dir if it doesn't exist (especially for Render)
        self.BASE_DIR.mkdir(parents=True, exist_ok=True)

        # Create important dirs if missing
        self.DATA_DIR.mkdir(parents=True, exist_ok=True)
        self.CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)
        self.TEMP_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        # Warn if critical keys are missing
        if not self.GOOGLE_API_KEY and not self.GROQ_API_KEY:
            print("WARNING: No LLM API key found (GOOGLE_API_KEY or GROQ_API_KEY)")

    def get_checkpointer_path(self) -> Path:
        return self.CHECKPOINTS_DIR / self.SQLITE_DB_NAME


# Global instance - import and use this everywhere
settings = Settings()

# Debug prints (only in DEBUG mode)
if settings.DEBUG:
    print(f"[CONFIG] Loaded from: {settings.BASE_DIR}")
    print(f"[CONFIG] Checkpointer DB: {settings.get_checkpointer_path()}")