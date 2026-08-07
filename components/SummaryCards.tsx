import React from 'react';
import { AuditReport } from '@/types/audit';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Layers, ShieldAlert } from 'lucide-react';

export default function SummaryCards({ report }: { report: AuditReport }) {
  const { summary, overallScore } = report;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Overall Score */}
      <div className={`p-5 rounded-xl border ${getScoreColor(overallScore)} flex flex-col justify-between`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wider">Overall Score</span>
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="mt-4">
          <span className="text-5xl font-black">{overallScore}</span>
          <span className="text-lg font-bold"> / 100</span>
        </div>
      </div>

      {/* Pages Audited */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-500">
          <span className="text-sm font-semibold uppercase tracking-wider">Pages Checked</span>
          <Layers className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-gray-900">{summary.totalPages}</span>
          <span className="text-xs text-gray-500">
            {summary.successfulPages} success / {summary.failedPages} failed
          </span>
        </div>
      </div>

      {/* Critical & Warnings */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-500">
          <span className="text-sm font-semibold uppercase tracking-wider">Issues Detected</span>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <div>
            <span className="text-2xl font-bold text-rose-600">{summary.criticalIssuesCount}</span>
            <span className="text-xs font-medium text-gray-500 block">Critical</span>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <span className="text-2xl font-bold text-amber-600">{summary.warningIssuesCount}</span>
            <span className="text-xs font-medium text-gray-500 block">Warnings</span>
          </div>
        </div>
      </div>

      {/* Avg Load Time */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-500">
          <span className="text-sm font-semibold uppercase tracking-wider">Avg HTTP Duration</span>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900">{summary.avgLoadTimeMs}</span>
          <span className="text-sm text-gray-500 font-medium"> ms</span>
        </div>
      </div>
    </div>
  );
}