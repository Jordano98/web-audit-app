'use client';
import { useState } from 'react';
import { AuditReport } from '@/types/audit';
import SummaryCards from '@/components/SummaryCards';
import AuditCharts from '@/components/AuditCharts';
import IssuesList from '@/components/IssuesList';
import JsonViewer from '@/components/JsonViewer';
import { Search, Loader2, FileJson } from 'lucide-react';

export default function AuditDashboard() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async (targetUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed');
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to complete website audit');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) runAudit(url.trim());
  };

  const loadSampleData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/sample-audit.json');
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError('Could not load sample data JSON file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* Header & Form */}
      <header className="bg-white border-b border-gray-200 py-8 px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Web Audit & SEO Dashboard</h1>
          <p className="text-gray-500 mt-1">Crawl homepage and up to 4 internal pages to analyze SEO, performance, and accessibility.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleFormSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Auditing...' : 'Start Audit'}
              </button>
            </form>

            <button
              onClick={loadSampleData}
              disabled={loading}
              className="px-5 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <FileJson className="w-4 h-4 text-gray-500" />
              Load Sample JSON
            </button>
          </div>

          {error && <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6">
        {report ? (
          <>
            <SummaryCards report={report} />
            <AuditCharts report={report} />
            <IssuesList issues={report.issues} />
            <JsonViewer report={report} />
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">Enter a website URL above or click <strong>"Load Sample JSON"</strong> to test the dashboard immediately.</p>
          </div>
        )}
      </div>
    </main>
  );
}