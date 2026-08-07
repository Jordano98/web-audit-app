'use client';
import React from 'react';
import { AuditReport } from '@/types/audit';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AuditCharts({ report }: { report: AuditReport }) {
  // Data for Score & Load Time per page
  const pageChartData = report.pages.map((p, idx) => {
    let label = `Page ${idx + 1}`;
    try {
      label = new URL(p.url).pathname || '/';
      if (label.length > 15) label = label.substring(0, 15) + '...';
    } catch {}
    return {
      name: label,
      score: p.score,
      loadTime: p.loadTimeMs,
    };
  });

  // Data for Issue Severity distribution
  const issueDistributionData = [
    { name: 'Critical', value: report.summary.criticalIssuesCount, color: '#e11d48' },
    { name: 'Warning', value: report.summary.warningIssuesCount, color: '#f59e0b' },
    { name: 'Info', value: report.summary.infoIssuesCount, color: '#3b82f6' },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Page Scores Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Page Score Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pageChartData}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Page Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issues Severity Donut */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Issues by Severity</h3>
        <div className="h-64">
          {issueDistributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={issueDistributionData} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {issueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">No issues detected! 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}