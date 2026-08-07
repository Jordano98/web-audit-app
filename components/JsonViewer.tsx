'use client';
import React, { useState } from 'react';
import { AuditReport } from '@/types/audit';

export default function JsonViewer({ report }: { report: AuditReport }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-gray-100 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Normalized Raw Audit JSON</h3>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700 transition"
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
      <pre className="text-xs font-mono bg-gray-950 p-4 rounded-lg overflow-x-auto max-h-96 text-emerald-400">
        <code>{JSON.stringify(report, null, 2)}</code>
      </pre>
    </div>
  );
}