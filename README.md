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

## 🚨 Severity Levels & Scoring Rules

### Severity Thresholds
- **Critical (-20 pts):** HTTP errors, missing `<title>`, missing `<h1>`, word count < 100.
- **Warning (-10 pts):** Missing meta description, response duration > 2000ms, missing image `alt` text, weak CTAs, duplicate titles.
- **Info (-3 pts):** High external outbound link count (>50).

### Scoring Methodology & Weight Justification
- **Page Score:** Starts at 100 points, deducting penalties down to 0.
- **Overall Score:** Arithmetic average of all successfully audited page scores.

**Why weights are assigned this way:**
- **Critical (-20 pts):** Search engines require `<title>` and `<h1>` for primary indexing. Missing these tags or 4xx/5xx errors directly damages indexability.
- **Warning (-10 pts):** Missing meta descriptions or slow load times hurt CTR and user experience but do not prevent search indexing entirely.
- **Info (-3 pts):** High outbound link counts are informative for site owners but rarely result in direct penalties.

## 📣 Call to Action (CTA) Definitions

- **CTA Definition:** Any `<button>`, `<input type="submit">`, or styled link (`.btn`, `.cta`) intended to drive conversion with actionable text (*Sign Up, Get Started, Contact Us*).
- **Weak CTA Definition:** Identified CTAs using generic or low-intent text (e.g., *"click here"*, *"learn more"*, *"read more"*, *"submit"*, *"continue"*).