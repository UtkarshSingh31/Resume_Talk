from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        separators=["\\n\\n", "\\n", " ", ""],
    )
    return splitter.split_documents(documents)

def create_vector_store(docs):
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return FAISS.from_documents(docs, embeddings)

def get_retriever(vs):
    return vs.as_retriever(search_kwargs={"k": 5})
