import asyncio
import json
import re
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright, Page, BrowserContext
import logging
from typing import Dict, List, Optional, Set

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper_playwright.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)  # Corrected from _name_ to __name__

def clean_text(text: str) -> str:
    """Clean and normalize extracted text."""
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    text = re.sub(r'©|™|®|&nbsp;', '', text)
    return text

def is_valid_url(url: str, base_domain: str) -> bool:
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return False

    normalized_netloc = parsed.netloc.replace('www.', '')
    normalized_base_domain = base_domain.replace('www.', '')

    if normalized_netloc != normalized_base_domain:
        return False

    if parsed.path.startswith('/wp-json') or parsed.path.startswith('/wp-admin') or \
       parsed.path.startswith('/api/') or parsed.path.endswith(('.xml', '.css', '.js', '.json', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf')):
        return False

    return True

def normalize_url(url: str, base_url: str) -> str:
    if not urlparse(url).scheme:
        url = urljoin(base_url, url)
    url = url.split('#')[0]
    if url.endswith('/') and url != base_url:
        url = url.rstrip('/')
    return url

async def extract_page_content(page: Page, max_characters: int) -> Optional[str]:
    try:
        text_content = await page.evaluate("document.body.innerText")
        cleaned_text = clean_text(text_content)
        if len(cleaned_text) > max_characters:
            logger.info(f"Truncating content to {max_characters} characters.")
            return cleaned_text[:max_characters]
        return cleaned_text
    except Exception as e:
        logger.error(f"Error extracting text from page: {e}")
        return None

async def discover_links(page: Page, base_url: str, base_domain: str) -> Set[str]:
    links = set()
    try:
        hrefs = await page.evaluate("""
            Array.from(document.querySelectorAll('a')).map(a => a.href);
        """)
        for href in hrefs:
            normalized_link = normalize_url(href, base_url)
            if is_valid_url(normalized_link, base_domain):
                links.add(normalized_link)
    except Exception as e:
        logger.error(f"Error discovering links on page: {e}")
    return links

async def scrape_page_with_playwright(
    page: Page,
    url: str,
    base_url: str,
    base_domain: str,
    max_characters_per_page: int
) -> Optional[Dict[str, Set[str]]]:
    try:
        await page.goto(url, timeout=60000)
        logger.info(f"Navigated to {url}. Extracting content and links.")
        page_text = await extract_page_content(page, max_characters_per_page)
        page_links = await discover_links(page, base_url, base_domain)
        return {"text": page_text, "links": page_links}
    except Exception as e:
        logger.error(f"Failed to scrape {url} with Playwright: {e}")
        return None

async def scrape_website_playwright(
    base_url: str,
    max_pages: int = 20,
    max_characters_per_page: int = 50000
) -> Dict[str, str]:
    parsed_base = urlparse(base_url)
    base_domain = parsed_base.netloc
    scraped_data = {}
    visited_urls: Set[str] = set()
    queue: List[str] = []

    priority_keywords = ['faq', 'help', 'support', 'guide', 'contact', 'knowledge', 'docs', 'about']

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        initial_normalized_base_url = normalize_url(base_url, base_url)
        queue.append(initial_normalized_base_url)
        logger.info(f"Starting Playwright scraping for {base_url}")
        logger.info(f"Max pages to scrape: {max_pages}, Max characters per page: {max_characters_per_page}")

        while queue and len(scraped_data) < max_pages:
            current_url = queue.pop(0)

            if current_url in visited_urls:
                logger.info(f"Skipping already visited URL: {current_url}")
                continue

            visited_urls.add(current_url)
            logger.info(f"Scraping with Playwright: {current_url} (Pages scraped: {len(scraped_data)}, Queue size: {len(queue)})")

            page_data = await scrape_page_with_playwright(
                page, current_url, base_url, base_domain, max_characters_per_page
            )

            if page_data and page_data["text"]:
                scraped_data[current_url] = page_data["text"]
                logger.info(f"Content for {current_url} extracted. Length: {len(page_data['text'])} characters.")

                new_internal_links = {link for link in page_data["links"] if link not in visited_urls}
                new_priority_links = [link for link in new_internal_links if any(keyword in link.lower() for keyword in priority_keywords)]
                new_regular_links = [link for link in new_internal_links if link not in new_priority_links]

                queue = sorted(new_priority_links) + queue
                queue.extend(sorted(new_regular_links))

                logger.info(f"Discovered {len(new_internal_links)} new unique links. Queue size: {len(queue)}.")
            elif page_data and not page_data["text"]:
                logger.warning(f"No meaningful text extracted from {current_url}. Skipping.")
            else:
                logger.error(f"Failed to get page data for {current_url}. Skipping.")

            await asyncio.sleep(0.5)

        await browser.close()
    return scraped_data

async def run_scraper(base_url: str, save_path: str) -> Dict[str, str]:
    logger.info(f"Starting Playwright scraper for {base_url}")
    scraped_data = await scrape_website_playwright(base_url, max_pages=20, max_characters_per_page=50000)

    if scraped_data:
        with open(save_path, "w", encoding="utf-8") as json_file:
            json.dump(scraped_data, json_file, ensure_ascii=False, indent=4)
        logger.info(f"Scraped {len(scraped_data)} pages. Data saved to {save_path}")
    else:
        logger.warning("No data scraped.")
    return scraped_data
