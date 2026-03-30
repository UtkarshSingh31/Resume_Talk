# backend/app/core/persistence/checkpointer.py
import logging
import sqlite3
from pathlib import Path
import sys
from langgraph.checkpoint.sqlite import SqliteSaver
from app.core.config import settings

logger = logging.getLogger(__name__)


def get_checkpointer() -> SqliteSaver:
    """
    Returns SqliteSaver using the path from config.
    Always disk-based, no memory fallback.
    """
    db_path: Path = settings.get_checkpointer_path()
    
    logger.info("Initializing SQLiteSaver at: %s", db_path)
    
    conn = sqlite3.connect(str(db_path), check_same_thread=False)
    saver = SqliteSaver(conn)
    
    return saver


def get_thread_config(thread_id: str) -> dict:
    """
    Builds the config dict LangGraph needs.
    Expects a real thread_id (your UUID), no defaults.
    """
    if not thread_id:
        raise ValueError("thread_id is required (use str(uuid.uuid4()))")
    
    return {
        "configurable": {
            "thread_id": thread_id
        }
    }


if __name__ == "__main__":
    
    # Basic console logging setup 
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        stream=sys.stdout
    )
    try:
        cp = get_checkpointer()
        print(f"Checkpointer ready. DB path: {settings.get_checkpointer_path()}")
        
        # Fake thread_id test
        fake_id = "test-thread-12345678"
        config = get_thread_config(fake_id)
        print(f"Config for thread {fake_id}: {config}")
        
    except Exception as e:
        logger.exception("Test failed")
        raise