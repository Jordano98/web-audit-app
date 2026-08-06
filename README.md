# 🌐 Web Audit Dashboard
A lightweight web audit application built with Next.js, TypeScript, Cheerio, and Recharts.

## 🚀 How to Install and Run
```bash
npm install
npm run dev

## 🕷️ Scraping Approach & Crawl Limits

- **Fetch Engine:** Server-side HTTP fetch using Axios with a **5000ms strict timeout**.
- **DOM Parsing:** Cheerio parses static server-rendered HTML.
- **Page Limits:** Homepage + up to 4 internal pages (max 5 pages total).

### 🎯 4-Page Selection Strategy
1. Extracts all `href` attributes from homepage `<a>` tags.
2. Filters out external domains, fragments (`#`), and non-HTTP links (`mailto:`).
3. Deduplicates URLs and selects the first 4 unique internal URLs prioritizing primary navigation links.

> ⚠️ **Note on Load Time:** The reported load time measures server-side HTTP request fetch duration from the Node.js backend runtime. It is **NOT** a frontend browser performance metric (e.g. Core Web Vitals).