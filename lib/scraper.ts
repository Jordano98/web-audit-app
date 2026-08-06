import axios from 'axios';
import * as cheerio from 'cheerio';
import { PageData } from '@/types/audit';

const TIMEOUT_MS = 5000;
const WEAK_CTA_KEYWORDS = ['click here', 'learn more', 'read more', 'submit', 'continue', 'link'];

export async function fetchAndParsePage(url: string, baseOrigin: string): Promise<{ pageData: PageData; foundInternalLinks: string[] }> {
  const startTime = Date.now();
  const internalLinks: string[] = [];

  try {
    const response = await axios.get(url, {
      timeout: TIMEOUT_MS,
      headers: { 'User-Agent': 'WebAuditBot/1.0 (+https://localhost)' },
      validateStatus: () => true, // capture status codes instead of throwing
    });

    const loadTimeMs = Date.now() - startTime;
    const statusCode = response.status;

    if (statusCode < 200 || statusCode >= 400) {
      return {
        pageData: createErrorPageData(url, statusCode, loadTimeMs, `HTTP Error ${statusCode}`),
        foundInternalLinks: [],
      };
    }

    const html = response.data;
    const $ = cheerio.load(typeof html === 'string' ? html : '');

    // 1. Text & Headings
    const title = $('title').first().text().trim();
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
    const h1Text = $('h1').first().text().trim();
    const h2Count = $('h2').length;

    // 2. Body Text & Word Count
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText ? bodyText.split(' ').filter(Boolean).length : 0;

    // 3. Images & Alt Text
    const $images = $('img');
    const imageCount = $images.length;
    let imagesMissingAlt = 0;
    $images.each((_, img) => {
      const alt = $(img).attr('alt');
      if (!alt || alt.trim() === '') imagesMissingAlt++;
    });

    // 4. Link Discovery & Counting
    let internalLinksCount = 0;
    let externalLinksCount = 0;

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;

      try {
        const absoluteUrl = new URL(href, url);
        if (absoluteUrl.origin === baseOrigin) {
          internalLinksCount++;
          const cleanLink = absoluteUrl.href.split('#')[0];
          if (!internalLinks.includes(cleanLink) && cleanLink !== url) {
            internalLinks.push(cleanLink);
          }
        } else {
          externalLinksCount++;
        }
      } catch {
        // invalid URL format, ignore
      }
    });

    // 5. CTA Extraction & Classification
    const ctaTexts: string[] = [];
    const weakCtaTexts: string[] = [];

    $('button, input[type="submit"], a.btn, a.button, a[class*="cta"], a[class*="button"]').each((_, el) => {
      const text = $(el).text().trim().toLowerCase();
      if (text.length > 0 && text.length < 50) {
        ctaTexts.push(text);
        if (WEAK_CTA_KEYWORDS.some((kw) => text === kw || text.startsWith(kw))) {
          weakCtaTexts.push(text);
        }
      }
    });

    return {
      pageData: {
        url,
        statusCode,
        success: true,
        loadTimeMs,
        title,
        metaDescription,
        h1Text,
        h2Count,
        ctaTexts,
        weakCtaTexts,
        imageCount,
        imagesMissingAlt,
        internalLinksCount,
        externalLinksCount,
        wordCount,
        score: 100, // Calculated later in lib/analyzer.ts
      },
      foundInternalLinks: internalLinks,
    };
  } catch (err: any) {
    const loadTimeMs = Date.now() - startTime;
    return {
      pageData: createErrorPageData(url, 0, loadTimeMs, err.message || 'Network Timeout / Request Failed'),
      foundInternalLinks: [],
    };
  }
}