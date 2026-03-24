from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    job_role: str
    job_level: str
    # the pdf file will be sent as form data, so we don't need it in this JSON model directly
    # but we can use this model and Extract it from Form if needed, or handle it directly in the route.
