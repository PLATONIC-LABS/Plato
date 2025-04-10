from pydantic import BaseModel

class DictErrorRequest(BaseModel):
    clause: str
    error: str
    rule: str

class DictErrorResponse(BaseModel):
    reply: list

class InstitutionExtractionRequest(BaseModel):
    text: str  # Assuming the payload has a text attribute

class InstitutionExtractionResponse(BaseModel):
    Institutions: list

class ChatbotRequest(BaseModel):
    question: str

class ChatbotResponse(BaseModel):
    response: str
