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