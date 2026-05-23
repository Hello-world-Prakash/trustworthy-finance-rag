def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]

        if chunk.strip():
            chunks.append(chunk.strip())

        start += chunk_size - overlap

    return chunks


def chunk_articles(articles):
    all_chunks = []

    for article in articles:
        chunks = chunk_text(article["text"])

        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "chunk_id": f"{article['title'][:30]}_{i}",
                "text": chunk,
                "title": article["title"],
                "url": article["url"],
                "published": article["published"],
            })

    return all_chunks


if __name__ == "__main__":
    from ingest import ingest_news

    articles = ingest_news()
    chunks = chunk_articles(articles)

    print(f"Total articles: {len(articles)}")
    print(f"Total chunks: {len(chunks)}")
    print(chunks[0]["text"][:500])