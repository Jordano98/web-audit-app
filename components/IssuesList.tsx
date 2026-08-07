import React from 'react';
import { AuditIssue } from '@/types/audit';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function IssuesList({ issues }: { issues: AuditIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 mb-8">
        No critical or warning issues detected across audited pages.
      </div>
    );
  }

  const getBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Critical</span>;
      case 'warning':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Warning</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Info</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Detected Audit Issues ({issues.length})</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {issues.map((issue) => (
          <div key={issue.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {getBadge(issue.severity)}
                <span className="text-xs font-mono text-gray-500 truncate max-w-xs">{issue.url}</span>
              </div>
              <p className="font-medium text-gray-900 mt-2">{issue.message}</p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold text-gray-700">Fix: </span>
                {issue.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}