import { NextRequest, NextResponse } from 'next/server';
import { crawlSite } from '@/lib/scraper';
import { analyzeAudit } from '@/lib/analyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid Website URL is required.' }, { status: 400 });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    const crawledPages = await crawlSite(url);
    const auditReport = analyzeAudit(url, crawledPages);

    return NextResponse.json(auditReport);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to complete audit' }, { status: 500 });
  }
}