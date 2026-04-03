FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY pyproject.toml README.md ./
COPY backend/ ./backend/

# Install UV and dependencies
RUN pip install uv
RUN cd backend && uv pip install --system -r requirements.txt

# Note: Model will be cached on first use (lazy loading)
# Skipping pre-cache to avoid HF auth issues in Docker builds

# Expose port (HF Spaces uses 7860 by default)
EXPOSE 7860

# Run the app on HF Spaces port
CMD ["sh", "-c", "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
