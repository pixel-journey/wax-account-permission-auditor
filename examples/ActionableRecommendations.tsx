'use client';

import React from 'react';

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

interface ActionableRecommendationsProps {
  recommendations: Recommendation[];
  className?: string;
}

/**
 * Educational panel showing actionable permission improvement recommendations.
 */
export function ActionableRecommendations({ recommendations, className = '' }: ActionableRecommendationsProps) {
  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'text-red-400';
    if (priority === 'medium') return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Actionable Recommendations</h3>

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white/5 p-4 rounded">
              <div className={`text-xs uppercase tracking-widest mb-1 ${getPriorityColor(rec.priority)}`}>{rec.priority} PRIORITY</div>
              <div className="font-medium">{rec.title}</div>
              <div className="text-sm text-muted-foreground mt-2">{rec.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-emerald-400">Great job — no immediate actions recommended!</p>
      )}
    </div>
  );
}
