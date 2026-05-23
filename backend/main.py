from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import ask_rag

app = FastAPI(title="Trustworthy Finance RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str

@app.get("/health")
def health_check():
    return {"status": "backend running"}

@app.post("/ask")
def ask_question(request: AskRequest):
    result = ask_rag(request.question)
    return result