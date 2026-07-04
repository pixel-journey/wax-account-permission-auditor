'use client';

import React from 'react';

interface RiskItem {
  permission: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  recommendation: string;
}

interface PermissionRiskListProps {
  risks: RiskItem[];
  className?: string;
}

/**
 * Educational list of permission risks found in an audit.
 */
export function PermissionRiskList({ risks, className = '' }: PermissionRiskListProps) {
  const getRiskColor = (level: string) => {
    if (level === 'critical') return 'text-red-500';
    if (level === 'high') return 'text-orange-400';
    if (level === 'medium') return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Risks Detected</h3>

      {risks.length > 0 ? (
        <div className="space-y-4">
          {risks.map((risk, index) => (
            <div key={index} className="border border-white/10 rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{risk.permission}</div>
                  <div className={`text-sm ${getRiskColor(risk.riskLevel)}`}>{risk.riskLevel.toUpperCase()} RISK</div>
                </div>
                <div className="text-xs text-muted-foreground">Issue #{index + 1}</div>
              </div>
              <div className="text-sm mt-2">{risk.issue}</div>
              <div className="text-xs text-emerald-400 mt-3">Recommendation: {risk.recommendation}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-emerald-400 text-sm">No significant risks detected — good security posture!</p>
      )}
    </div>
  );
}
