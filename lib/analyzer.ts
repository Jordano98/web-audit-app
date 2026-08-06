import { PageData, AuditIssue, AuditReport } from '@/types/audit';

export function analyzeAudit(targetUrl: string, rawPages: PageData[]): AuditReport {
  const issues: AuditIssue[] = [];
  const processedPages: PageData[] = [];

  // Track page titles for duplicate checking
  const titleMap = new Map<string, string[]>();

  rawPages.forEach((page) => {
    if (page.title) {
      const existing = titleMap.get(page.title) || [];
      titleMap.set(page.title, [...existing, page.url]);
    }
  });

  // Analyze each page individually
  rawPages.forEach((page, index) => {
    let deductions = 0;
    const pageIssues: AuditIssue[] = [];

    if (!page.success) {
      deductions += 100;
      pageIssues.push({
        id: `http-err-${index}`,
        url: page.url,
        severity: 'critical',
        message: `Page failed to load (${page.error || 'HTTP Error'})`,
        recommendation: 'Check server connection, domain configuration, or firewall rules.',
      });
    } else {
      // 1. Critical Rule Checks (-20 pts each)
      if (!page.title) {
        deductions += 20;
        pageIssues.push({
          id: `title-${index}`,
          url: page.url,
          severity: 'critical',
          message: 'Missing HTML <title> tag.',
          recommendation: 'Add a descriptive <title> tag (50-60 characters) for primary SEO indexing.',
        });
      }

      if (!page.h1Text) {
        deductions += 20;
        pageIssues.push({
          id: `h1-${index}`,
          url: page.url,
          severity: 'critical',
          message: 'Missing main <h1> heading.',
          recommendation: 'Add exactly one clear <h1> tag summarizing the page contents.',
        });
      }

      if (page.wordCount < 100) {
        deductions += 20;
        pageIssues.push({
          id: `thin-${index}`,
          url: page.url,
          severity: 'critical',
          message: `Very low text content (${page.wordCount} words).`,
          recommendation: 'Expand content to at least 100-300 meaningful words to avoid thin-content penalties.',
        });
      }

      // 2. Warning Rule Checks (-10 pts each)
      if (!page.metaDescription) {
        deductions += 10;
        pageIssues.push({
          id: `meta-${index}`,
          url: page.url,
          severity: 'warning',
          message: 'Missing meta description.',
          recommendation: 'Provide a concise meta description (120-160 characters) to improve click-through rates.',
        });
      }

      if (page.loadTimeMs > 2000) {
        deductions += 10;
        pageIssues.push({
          id: `slow-${index}`,
          url: page.url,
          severity: 'warning',
          message: `Slow HTTP response time (${page.loadTimeMs}ms).`,
          recommendation: 'Optimize server response time, enable caching, or use a CDN.',
        });
      }

      if (page.imagesMissingAlt > 0) {
        deductions += 10;
        pageIssues.push({
          id: `alt-${index}`,
          url: page.url,
          severity: 'warning',
          message: `${page.imagesMissingAlt} image(s) missing alt text.`,
          recommendation: 'Add descriptive alt attribute to images for accessibility (screen readers) and image search.',
        });
      }

      if (page.weakCtaTexts.length > 0) {
        deductions += 10;
        pageIssues.push({
          id: `cta-${index}`,
          url: page.url,
          severity: 'warning',
          message: `Weak CTA text detected: "${page.weakCtaTexts.slice(0, 2).join(', ')}"`,
          recommendation: 'Replace generic phrases like "Click Here" with high-intent action verbs like "Get Started".',
        });
      }

      if (page.title && (titleMap.get(page.title)?.length || 0) > 1) {
        deductions += 10;
        pageIssues.push({
          id: `dup-title-${index}`,
          url: page.url,
          severity: 'warning',
          message: `Duplicate page title: "${page.title}"`,
          recommendation: 'Ensure every page has a unique title tag to prevent cannibalization.',
        });
      }

      // 3. Info Rule Checks (-3 pts each)
      if (page.externalLinksCount > 50) {
        deductions += 3;
        pageIssues.push({
          id: `ext-links-${index}`,
          url: page.url,
          severity: 'info',
          message: `High number of external links (${page.externalLinksCount}).`,
          recommendation: 'Review outbound links to ensure they remain relevant and high quality.',
        });
      }
    }

    const calculatedScore = Math.max(0, 100 - deductions);
    processedPages.push({ ...page, score: calculatedScore });
    issues.push(...pageIssues);
  });

  // Overall Score & Summary Metrics
  const totalScore = processedPages.reduce((acc, p) => acc + p.score, 0);
  const overallScore = processedPages.length > 0 ? Math.round(totalScore / processedPages.length) : 0;

  const totalLoadTime = processedPages.reduce((acc, p) => acc + p.loadTimeMs, 0);

  return {
    targetUrl,
    timestamp: new Date().toISOString(),
    overallScore,
    summary: {
      totalPages: processedPages.length,
      successfulPages: processedPages.filter((p) => p.success).length,
      failedPages: processedPages.filter((p) => !p.success).length,
      criticalIssuesCount: issues.filter((i) => i.severity === 'critical').length,
      warningIssuesCount: issues.filter((i) => i.severity === 'warning').length,
      infoIssuesCount: issues.filter((i) => i.severity === 'info').length,
      avgLoadTimeMs: processedPages.length > 0 ? Math.round(totalLoadTime / processedPages.length) : 0,
      pagesMissingTitle: processedPages.filter((p) => !p.title).length,
      pagesMissingMetaDesc: processedPages.filter((p) => !p.metaDescription).length,
      pagesMissingH1: processedPages.filter((p) => !p.h1Text).length,
      totalImagesMissingAlt: processedPages.reduce((acc, p) => acc + p.imagesMissingAlt, 0),
      totalCtasDetected: processedPages.reduce((acc, p) => acc + p.ctaTexts.length, 0),
    },
    pages: processedPages,
    issues,
  };
}