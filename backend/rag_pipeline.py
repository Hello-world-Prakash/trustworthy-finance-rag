import ollama
from vector_store import search_chunks

def ask_rag(question: str):
    results = search_chunks(question, top_k=3)

    context = ""
    sources = []

    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        context += f"\nTitle: {meta['title']}\nContent: {doc[800]}\n"
        sources.append({
            "title": meta["title"],
            "url": meta["url"]
        })

    prompt = f"""
You are a trustworthy financial news analyst.

Answer ONLY using the context below.
If the context is not enough, say: "I don't have enough information."

Include:
1. Summary
2. Key Drivers
3. Sentiment: Positive, Negative, Neutral, or Mixed
4. Confidence: High, Medium, or Low

Context:
{context}

Question:
{question}
"""

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "answer": response["message"]["content"],
        "sources": sources
    }


if __name__ == "__main__":
    question = input("Ask finance question: ")
    result = ask_rag(question)

    print("\nANSWER:\n")
    print(result["answer"])

    print("\nSOURCES:")
    for source in result["sources"]:
        print(source["title"])
        print(source["url"])