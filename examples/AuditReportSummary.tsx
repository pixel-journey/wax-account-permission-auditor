'use client';

import React from 'react';

interface AuditSummary {
  account: string;
  overallRiskScore: number;
  criticalIssues: number;
  recommendationsCount: number;
}

interface AuditReportSummaryProps {
  summary: AuditSummary;
  className?: string;
}

/**
 * Summary card for a completed permission audit.
 */
export function AuditReportSummary({ summary, className = '' }: AuditReportSummaryProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Audit Report Summary</h3>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-emerald-400">{summary.overallRiskScore}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-widest">Overall Risk Score</div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-mono text-red-400">{summary.criticalIssues}</div>
          <div className="text-xs text-muted-foreground">Critical Issues</div>
        </div>
        <div>
          <div className="text-2xl font-mono text-amber-400">{summary.recommendationsCount}</div>
          <div className="text-xs text-muted-foreground">Recommendations</div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-6">
        Account: {summary.account}
      </div>
    </div>
  );
}
