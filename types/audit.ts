export type IssueSeverity = 'critical' | 'warning' | 'info';

export interface AuditIssue {
  id: string;
  url: string;
  severity: IssueSeverity;
  message: string;
  recommendation: string;
}

export interface PageData {
  url: string;
  statusCode: number;
  success: boolean;
  loadTimeMs: number;
  title: string;
  metaDescription: string;
  h1Text: string;
  h2Count: number;
  ctaTexts: string[];
  weakCtaTexts: string[];
  imageCount: number;
  imagesMissingAlt: number;
  internalLinksCount: number;
  externalLinksCount: number;
  wordCount: number;
  error?: string;
  score: number;
}

export interface AuditReport {
  targetUrl: string;
  timestamp: string;
  overallScore: number;
  summary: {
    totalPages: number;
    successfulPages: number;
    failedPages: number;
    criticalIssuesCount: number;
    warningIssuesCount: number;
    infoIssuesCount: number;
    avgLoadTimeMs: number;
    pagesMissingTitle: number;
    pagesMissingMetaDesc: number;
    pagesMissingH1: number;
    totalImagesMissingAlt: number;
    totalCtasDetected: number;
  };
  pages: PageData[];
  issues: AuditIssue[];
}