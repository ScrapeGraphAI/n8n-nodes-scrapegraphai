# n8n-nodes-scrapegraphai

<p align="center">
  <img src="./nodes/scrapegraphAI.svg" width="250" alt="ScrapegraphAI Logo">
</p>

The official [ScrapeGraphAI](https://scrapegraphai.com) node for n8n. Hits the v2 API at `https://v2-api.scrapegraphai.com/api`.

> **1.0.0 is a breaking release.** v1 endpoints (`/v1/smartscraper`, `/v1/markdownify`, `/v1/agentic-scrapper`, `/v1/toonify`) are gone. See **Migrating from 0.x** below.

## Installation

1. In n8n, go to **Settings → Community Nodes → Install**
2. Enter `n8n-nodes-scrapegraphai`
3. Click **Install**

## Credentials

1. Sign up at [scrapegraphai.com](https://scrapegraphai.com) and grab a key from the [dashboard](https://scrapegraphai.com/dashboard).
2. In n8n, create a new **ScrapegraphAI API** credential and paste the key.
3. n8n will validate the key against `GET /api/credits` — a green check means it's good.

## Resources

| Resource | Operations | What it does |
|----------|------------|--------------|
| **Scrape** | Scrape | Fetch a URL in any combination of formats: markdown, HTML, links, images, summary, JSON extraction, branding, or screenshot. |
| **Extract** | Extract | LLM-powered structured extraction from a URL, raw HTML, or markdown. Optional JSON schema. |
| **Search** | Search | Web search with content fetched inline. Optional AI rollup across all results. |
| **Crawl** | Start, Get Status, Stop, Resume, Delete | Async multi-page crawl with include/exclude URL patterns. |
| **Monitor** | Create, Get, Get Many, Get Activity, Update, Pause, Resume, Delete | Cron-scheduled fetches with change detection and webhooks. |
| **History** | Get, Get Many | Look up past requests by ID — including the formatted content of crawled pages via each `scrapeRefId`. |
| **Credit** | Get | Remaining credits, plan, and crawl/monitor quotas. |

Every fetch-based resource shares the same **Fetch Config** options: `mode` (auto / fast / js), `stealth`, `scrolls`, `wait`, `timeout`, `country`, custom `headers`, custom `cookies`.

## Migrating from 0.x

Three resources were removed in v2 — the API endpoints behind them are gone:

| Removed in 1.0.0 | Replacement |
|------------------|-------------|
| Markdownify | **Scrape** with format `markdown` |
| Agentic Scraper | **Extract** with `Fetch Config → Mode = JS` and `Stealth = true` for hard pages, or **Crawl** for multi-page flows |
| Toonify | The open-source [`toonify`](https://github.com/ScrapeGraphAI/toonify) package — TOON is no longer an API endpoint |

Field renames (top-level → v2):

| 0.x field | 1.0.0 location |
|-----------|----------------|
| `website_url` | `url` |
| `user_prompt` | `prompt` (extract) / `query` (search) |
| `output_schema` | `schema` |
| `render_heavy_js` | `Fetch Config → Mode = JS` |
| `stealth` | `Fetch Config → Stealth` |
| `wait_ms` | `Fetch Config → Wait (Ms)` |
| `number_of_scrolls` | `Fetch Config → Scrolls` |
| `country_code` | `Fetch Config → Country` (most) / `Location (Country Code)` (search) |
| `time_range` | `Time Range` (search) |

Removed without replacement:

- `total_pages` — use the **Crawl** resource for multi-page work.
- `mock` — gone in v2; mock at the n8n / HTTP layer if you need it.
- `cache_website`, `same_domain_only`, `breadth` (crawl) — use `includePatterns` / `excludePatterns` / `maxLinksPerPage` / `maxDepth` instead.

## License

[MIT](LICENSE.md)
