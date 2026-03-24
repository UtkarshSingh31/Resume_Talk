import re
from typing import Dict, Any

def extract_profile(text: str) -> Dict[str, Any]:
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    name = lines[0] if lines else None
    email = None
    phone = None

    for line in lines:
        if not email:
            m = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", line)
            if m:
                email = m.group()

        if not phone:
            m = re.search(r"\\+?\\d[\\d\\s\\-]{8,}\\d", line)
            if m:
                phone = m.group()

    return {
        "name": name,
        "email": email,
        "phone": phone,
    }

SECTIONS = {
    "PROJECTS",
    "SKILLS",
    "EDUCATION",
    "EXPERIENCE",
    "CERTIFICATIONS",
    "INTERNSHIPS",
}

def sectionize_documents(docs):
    from langchain_core.documents import Document
    section_docs = []
    
    for doc in docs:
        current_section = "GENERAL"
        buffer = []
        
        for line in doc.page_content.splitlines():
            clean = line.strip()
            if not clean:
                continue
                
            if clean.upper() in SECTIONS:
                if buffer:
                    section_docs.append(
                        Document(
                            page_content="\\n".join(buffer),
                            metadata={**doc.metadata, "section": current_section}
                        )
                    )
                current_section = clean.upper()
                buffer = []
            else:
                buffer.append(clean)
                
        if buffer:
            section_docs.append(
                Document(
                    page_content="\\n".join(buffer),
                    metadata={**doc.metadata, "section": current_section}
                )
            )
            
    return section_docs

def route_query(q: str):
    q = q.lower()
    if "name" in q:
        return "NAME"
    if "email" in q:
        return "EMAIL"
    if "phone" in q:
        return "PHONE"
    if "project" in q:
        return "PROJECTS"
    if "skill" in q:
        return "SKILLS"
    if "education" in q:
        return "EDUCATION"
    return "RAG"
