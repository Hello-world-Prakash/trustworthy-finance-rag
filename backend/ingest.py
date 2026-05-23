from news_fetcher import fetch_news
from scraper import scrape_article

def ingest_news():
    raw_articles = fetch_news()
    processed_articles = []

    for article in raw_articles:
        print(f"Scraping: {article['title']}")

        text = scrape_article(article["url"])

        if not text:
            print("Skipped: no text found")
            continue

        processed_articles.append({
	    "ticker": article["ticker"],
            "title": article["title"],
            "url": article["url"],
            "published": article["published"],
            "summary": article["summary"],
            "text": text
        })

    return processed_articles


if __name__ == "__main__":
    articles = ingest_news()

    print(f"\nTotal scraped articles: {len(articles)}")

    for article in articles[:3]:
        print("\nTitle:", article["title"])
        print("URL:", article["url"])
        print("Text preview:", article["text"][:300])
        print("-" * 80)