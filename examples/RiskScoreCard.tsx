'use client';

import React from 'react';

interface RiskScoreCardProps {
  score: number; // 0-100, higher = more risky
  title: string;
  description: string;
  className?: string;
}

/**
 * Educational risk score card for permission audits.
 */
export function RiskScoreCard({ score, title, description, className = '' }: RiskScoreCardProps) {
  const riskColor =
    score < 30 ? 'text-emerald-400' :
    score < 60 ? 'text-amber-400' :
    score < 80 ? 'text-orange-400' : 'text-red-500';

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        </div>
        <div className={`text-4xl font-bold ${riskColor}`}>{score}</div>
      </div>

      <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${riskColor.replace('text-', 'bg-')} transition-all`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
