from app.core.config import settings

# This can store the RAG prompt string templates if we want, currently it's handled in service.py
# Keeping it for potential future structural additions.
RAG_PROMPT_TEMPLATE = \"\"\"
You are given resume content.

Context:
{context}

Question:
{question}

Answer concisely using ONLY the context.
\"\"\"
