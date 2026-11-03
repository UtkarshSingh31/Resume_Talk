"""
Script to pre-download embedding models for HF Spaces deployment.
Run during Docker build to cache the model locally.
"""
import sys

try:
    print("🔄 Pre-caching embedding model...")
    from sentence_transformers import SentenceTransformer
    
    model = SentenceTransformer('all-TinyLM-L6-v2')
    print("✅ Model cached successfully at ~/.cache/sentence-transformers/")
    
except Exception as e:
    print(f"⚠️  Warning: Could not pre-cache model: {e}")
    print("The model will be downloaded on first use (slower first request)")
    sys.exit(0)  # Don't fail deployment, just warn
