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