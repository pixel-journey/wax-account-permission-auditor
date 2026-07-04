'use client';

import React from 'react';

interface RiskHeatmapProps {
  accounts: Array<{ name: string; riskScore: number }>;
  className?: string;
}

/**
 * Visual risk heatmap for multiple accounts.
 */
export function RiskHeatmap({ accounts, className = '' }: RiskHeatmapProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Risk Heatmap</h3>

      <div className="grid grid-cols-2 gap-3">
        {accounts.map((account, index) => {
          const intensity = Math.min(100, account.riskScore);
          return (
            <div key={index} className="bg-white/5 p-3 rounded">
              <div className="flex justify-between text-sm">
                <span>{account.name}</span>
                <span className="font-mono">{account.riskScore}</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all" style={{ width: `${intensity}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
