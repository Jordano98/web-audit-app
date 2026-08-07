```markdown
# 🌐 Web Audit & SEO Dashboard

A lightweight, automated web accessibility, SEO, and performance audit application built with **TypeScript**, **Next.js (App Router)**, **Cheerio**, and **Recharts**.

---

## 🚀 How to Install and Run

### Prerequisites
- **Node.js**: >= 18.x
- **Package Manager**: npm, yarn, or pnpm

### Setup & Local Execution
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS + Lucide React Icons
* **Web Parser:** Cheerio + Axios
* **Visualizations:** Recharts
* **Version Control Workflow:** GitHub Desktop

---

## 🕷️ Scraping Approach & Crawl Limits

* **Fetch Engine:** Server-side HTTP GET requests executed via Axios with a **5000ms strict timeout**.
* **DOM Parsing:** Cheerio parses static server-rendered HTML strings into a DOM tree without the heavy memory overhead of running a headless browser like Puppeteer.
* **Crawl Boundaries:** Audits are restricted to the homepage + up to 4 internal pages (maximum 5 total pages per audit run) to maintain fast API response times.
* **Parallel Crawling:** Internal pages are fetched concurrently using `Promise.allSettled()` to ensure isolated page failures or timeouts do not crash the audit process.

### 🎯 4-Page Selection Strategy

1. The scraper fetches the homepage HTML and extracts all `href` attributes from `<a>` tags.
2. It filters out non-HTTP links (`mailto:`, `javascript:`), anchor fragments (`#`), and external domains.
3. It deduplicates URLs and normalizes trailing slashes using the native JavaScript `URL` API.
4. It prioritizes links found early in the DOM structure or within primary navigation containers (`<nav>`, `<header>`), selecting the **first 4 unique internal URLs**.

> ⚠️ **Disclaimer on Load Time:** The load time metric reported in this audit measures **server-side HTTP request fetch duration (latency)** from the Node.js backend environment. It is **NOT** a frontend client browser metric (such as Core Web Vitals, LCP, or TTFB).

---

## 🚨 Severity Levels & Scoring Rules

### Severity Thresholds

* **Critical (-20 pts):** Severe functional, indexing, or structural failures (HTTP status 4xx/5xx, missing `<title>`, missing `<h1>`, word count < 100).
* **Warning (-10 pts):** Notable SEO, performance, or accessibility deficiencies (missing meta description, response duration > 2000ms, missing image `alt` text, weak CTAs, duplicate page titles across pages).
* **Info (-3 pts):** Minor quality observations (high external link count > 50).

### Scoring Methodology & Formula

* **Page Score:** Calculated starting from `100` points, subtracting severity penalties down to a minimum of `0`:

$$\text{Page Score} = \max\left(0, 100 - \sum \text{Deductions}\right)$$


* **Overall Score:** Arithmetic mean of all successfully audited page scores:

$$\text{Overall Score} = \frac{\sum \text{Page Scores}}{\text{Total Pages Audited}}$$



### Why Weights Are Assigned This Way

* **Critical (-20 pts):** Search engines (Google, Bing) rely heavily on `<title>` and `<h1>` tags for content indexing and primary ranking signals. Missing these tags or encountering HTTP errors renders a page un-indexable or broken. Thin content (<100 words) risks manual action or low-quality indexing penalties.
* **Warning (-10 pts):** Missing meta descriptions or slow HTTP response times (>2000ms) hurt search engine click-through rates (CTR) and user experience, but do not prevent search indexing entirely. Missing image `alt` text hinders screen-reader accessibility, while weak CTAs lower conversion performance.
* **Info (-3 pts):** High external link counts (>50) are informative context for webmasters, but rarely cause direct search engine penalties unless spammy. Therefore, they carry minimal weight penalty.

---

## 📣 Call to Action (CTA) Definitions

* **CTA Definition:** Any HTML `<button>`, `<input type="submit">`, or styled link (`.btn`, `.cta`) intended to drive user conversion with actionable text (*Sign Up, Get Started, Contact Us*).
* **Weak CTA Definition:** Any detected CTA using generic, passive, or low-intent text (e.g., *"click here"*, *"learn more"*, *"read more"*, *"submit"*, *"continue"*, *"link"*).

---

## 📁 Sample Raw Data Testing

If a target site blocks scraping or times out, test the full dashboard interface using local sample data:

1. Click **"Load Sample JSON"** in the top navigation bar.
2. The dashboard will populate immediately using static data from `/public/sample-audit.json`.

---

## 🧪 How to Test the Application

### 1. Offline Sample Data Test (Instant)

1. Run `npm run dev` and open `http://localhost:3000`.
2. Click the **"Load Sample JSON"** button in the header.
3. **Verify:**
* Scorecards render aggregate stats (Overall Score = 73/100).
* Recharts bar chart & donut chart display page breakdown and issue distributions.
* Actionable Issues List displays color-coded badges (Red = Critical, Yellow = Warning).
* Raw JSON Inspector renders formatted JSON with copy functionality.



### 2. Live Website Crawl Test

1. Enter `https://example.com` or `https://wikipedia.org` in the URL input field.
2. Click **"Start Audit"**.
3. **Verify:**
* Loading spinner indicates active crawl execution.
* Server audits homepage + up to 4 internal pages.
* Real-time scores, issue counts, and charts update dynamically.



### 3. Error Handling & Validation Test

1. Submit an invalid domain (e.g., `https://this-site-does-not-exist-12345.org`).
2. **Verify:**
* App displays a graceful error alert message without crashing the server.


## 🤖 AI Tools Usage

AI tools were used as a collaborative assistant during the development of this application in the following ways:

* **Scraper & Logic Architecture:** Assisted in optimizing the asynchronous crawling pipeline in Node.js.
* **Cheerio DOM Parsing:** Guided the extraction strategy for SEO tags.
* **Code Explanation & Quality:** Assisted in writing clear code documentation.

---

## 🚀 Future Improvements (With More Time)

If granted additional development time, the following enhancements would be added:

1. **Deeper SEO & Accessibility Diagnostics:** Expand audit metrics to evaluate:
   * Open Graph & Twitter meta tags
   * Canonical tag validity & sitemap checks
   * Color contrast ratios (WCAG compliance)
   * External link health checks (detecting 404 dead outbound links)