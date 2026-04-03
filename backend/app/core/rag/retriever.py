from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Lazy-load embeddings to avoid blocking startup
_embeddings_cache = None

def get_embeddings():
    """Lazy initialize embeddings model on first use"""
    global _embeddings_cache
    if _embeddings_cache is None:
        # Use TinyLM - only 20MB, 10x faster than all-MiniLM-L6-v2
        _embeddings_cache = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-TinyLM-L6-v2"
        )
    return _embeddings_cache

def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        separators=["\\n\\n", "\\n", " ", ""],
    )
    return splitter.split_documents(documents)

def create_vector_store(docs):
    embeddings = get_embeddings()
    return FAISS.from_documents(docs, embeddings)

def get_retriever(vs):
    return vs.as_retriever(search_kwargs={"k": 5})
