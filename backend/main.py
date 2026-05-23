from fastapi import FastAPI

app = FastAPI(title="Trustworthy Finance RAG API")

@app.get("/health")
def health_check():
    return {"status": "backend running"}