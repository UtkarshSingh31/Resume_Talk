from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv() 


class Settings:
    """Simple config class - no pydantic bloat for basic settings"""

    # === Core paths - loaded from .env ===
    BASE_DIR: Path = Path(os.getenv("BASE_ROOT", str(Path.cwd())))
    DATA_DIR: Path = BASE_DIR / "data"
    CHECKPOINTS_DIR: Path = BASE_DIR / "backend" / "checkpoints"
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
        if not self.BASE_DIR.exists():
            raise ValueError(f"BASE_DIR does not exist: {self.BASE_DIR}")

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

print(f'path:- {settings.DATA_DIR} ,{type(settings.DATA_DIR)}')
# Optional: quick debug print when module is imported (remove later)
if settings.DEBUG:
    print(f"[CONFIG] Loaded from: {settings.BASE_DIR}")
    print(f"[CONFIG] Checkpointer DB: {settings.get_checkpointer_path()}")