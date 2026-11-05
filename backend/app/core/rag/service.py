from pathlib import Path
from typing import Any, Dict, Optional
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from app.core.utils.pdf import load_documents
from app.core.utils.prompts import extract_profile, sectionize_documents, route_query
from app.core.rag.retriever import split_documents, create_vector_store, get_retriever
from app.core.utils.llm import response_text

class RAGSERVICE:
    def __init__(
        self,
        data_path: Path,
        llm_google: ChatGoogleGenerativeAI,
        workflow_state: Optional[Dict[str, Any]] = None,
    ):
        self.data_path = data_path
        self.llm_google = llm_google
        self.workflow_state = workflow_state or {}
        self.retriever = None
        self.profile = None

    def build(self):
        docs = load_documents(self.data_path)
        if not docs:
            raise RuntimeError("No documents loaded")

        full_text = "\n".join(d.page_content for d in docs)
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
        workflow_context = self._workflow_context()

        prompt = """
You are a resume analysis copilot. Answer using only the supplied resume
content and completed workflow state. If the information is not present,
say that it is unavailable instead of guessing.

Resume context:
{context}

Completed workflow state:
{workflow_context}

Question:
{question}

Answer concisely and explain the relevant workflow evidence when asked.
""".format(
            context=context,
            workflow_context=workflow_context,
            question=question,
        )

        res = self.llm_google.invoke(prompt)
        return response_text(res)

    def _workflow_context(self) -> str:
        fields = (
            "candidate_name",
            "candidate_email",
            "candidate_phone",
            "job_role",
            "job_level",
            "sections",
            "entities",
            "signals",
            "evaluation",
            "ats_score",
            "ats_breakdown",
            "recommendations",
            "job_openings",
            "email_draft",
            "iteration",
            "warnings",
        )
        return "\n".join(
            f"{field}: {self.workflow_state[field]}"
            for field in fields
            if field in self.workflow_state and self.workflow_state[field]
        ) or "The workflow has not completed yet."

    def rebuild(self):
        self.build()
