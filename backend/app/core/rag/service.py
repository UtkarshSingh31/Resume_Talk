from pathlib import Path
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from app.core.utils.pdf import load_documents
from app.core.utils.prompts import extract_profile, sectionize_documents, route_query
from app.core.rag.retriever import split_documents, create_vector_store, get_retriever

class RAGSERVICE:
    def __init__(self, data_path: Path, llm_google: ChatGoogleGenerativeAI):
        self.data_path = data_path
        self.llm_google = llm_google
        self.retriever = None
        self.profile = None

    def build(self):
        docs = load_documents(self.data_path)
        if not docs:
            raise RuntimeError("No documents loaded")

        full_text = "\\n".join(d.page_content for d in docs)
        self.profile = extract_profile(full_text)

        section_docs = sectionize_documents(docs)
        chunks = split_documents(section_docs)
        vs = create_vector_store(chunks)
        self.retriever = get_retriever(vs)

    def query(self, question: str) -> str:
        intent = route_query(question)

        if intent == "NAME":
            return self.profile.get("name", "Name not found")

        if intent == "EMAIL":
            return self.profile.get("email", "Email not found")

        if intent == "PHONE":
            return self.profile.get("phone", "Phone not found")

        docs = self.retriever.invoke(question)
        context = "\n".join(d.page_content for d in docs)

        prompt = """
You are given resume content.

Context:
{context}

Question:
{question}

Answer concisely using ONLY the context.
""".format(context=context, question=question)

        res = self.llm_google.invoke(prompt)
        return res.content

    def rebuild(self):
        self.build()
