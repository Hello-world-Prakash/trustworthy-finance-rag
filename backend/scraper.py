import trafilatura

def scrape_article(url: str) -> str:
    downloaded = trafilatura.fetch_url(url)

    if downloaded is None:
        return ""

    text = trafilatura.extract(downloaded)

    if text is None:
        return ""

    return text.strip()


if __name__ == "__main__":
    test_url = input("Paste article URL: ")
    article_text = scrape_article(test_url)

    print("\n--- ARTICLE TEXT ---\n")
    print(article_text[:2000])