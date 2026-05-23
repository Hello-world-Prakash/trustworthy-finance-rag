import chromadb
from sentence_transformers import SentenceTransformer
from ingest import ingest_news
from chunker import chunk_articles

CHROMA_PATH = "./chroma_db"
COLLECTION_NAME = "finance_news"

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(name=COLLECTION_NAME)

def store_chunks(chunks):
    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk["text"]).tolist()

        collection.add(
            ids=[f"chunk_{i}"],
            embeddings=[embedding],
            documents=[chunk["text"]],
            metadatas=[{
		"ticker": chunk["ticker"],
                "title": chunk["title"],
                "url": chunk["url"],
                "published": chunk["published"],
            }]
        )

    print(f"Stored {len(chunks)} chunks in ChromaDB")


def search_chunks(query, top_k=5):
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results


if __name__ == "__main__":
    articles = ingest_news()
    chunks = chunk_articles(articles)

    store_chunks(chunks)

    results = search_chunks("Nvidia AI stock news")

    print("\nSearch Results:")
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        print("\nTitle:", meta["title"])
        print("URL:", meta["url"])
        print("Text:", doc[:300])