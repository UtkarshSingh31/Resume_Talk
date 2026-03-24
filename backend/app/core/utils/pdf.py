from pypdf import PdfReader
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader

def extract_text_from_pdf(pdf_path: str) -> str:
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found at {path}")
    reader = PdfReader(str(path))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\\n".join(pages).strip()

def load_documents(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found at {path}")
    loader = PyPDFLoader(str(path))
    return loader.load()
