'use client';

import React, { useState } from 'react';

interface AuditResult {
  account: string;
  riskScore: number;
  issues: string[];
  recommendations: string[];
}

export default function PermissionAuditor() {
  const [accounts, setAccounts] = useState('pxjourney,atomicassets');
  const [results, setResults] = useState<AuditResult[]>([]);

  const runAudit = () => {
    const accountList = accounts.split(',').map(a => a.trim());
    const mockResults: AuditResult[] = accountList.map(account => {
      // Simple mock risk scoring
      const issues: string[] = [];
      const recommendations: string[] = [];
      let risk = 20;

      if (account === 'pxjourney') {
        issues.push('Owner has only 1 key');
        recommendations.push('Add multi-sig to owner permission');
        risk = 65;
      } else {
        issues.push('Active threshold is low (1)');
        recommendations.push('Increase active threshold to 2 or more');
        risk = 45;
      }

      return { account, riskScore: risk, issues, recommendations };
    });
    setResults(mockResults);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="font-press-start text-2xl tracking-widest text-emerald-400 mb-2">PERMISSION AUDITOR</div>
        <div className="text-xs opacity-60 mb-8">Pixel Journey • Tier 1 Security • Batch Risk Analysis</div>

        <div className="glassmorphic-crt pixel-border p-6 rounded-2xl mb-6">
          <h3 className="font-press-start text-sm mb-3">BATCH AUDIT</h3>
          <input
            value={accounts}
            onChange={e => setAccounts(e.target.value)}
            className="w-full bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm mb-4"
            placeholder="account1,account2,account3"
          />
          <button onClick={runAudit} className="w-full py-3 bg-emerald-600 rounded-2xl">RUN AUDIT</button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((r, i) => (
              <div key={i} className="glassmorphic-crt pixel-border p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-mono text-lg">{r.account}</div>
                  <div className={`px-4 py-1 rounded-full text-sm ${r.riskScore > 60 ? 'bg-red-500/20 text-red-400' : r.riskScore > 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    Risk: {r.riskScore}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs opacity-70 mb-2">ISSUES FOUND</div>
                    {r.issues.map((issue, idx) => <div key={idx} className="text-red-400 mb-1">• {issue}</div>)}
                  </div>
                  <div>
                    <div className="text-xs opacity-70 mb-2">RECOMMENDATIONS</div>
                    {r.recommendations.map((rec, idx) => <div key={idx} className="text-emerald-400 mb-1">• {rec}</div>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-[10px] opacity-50">Client-side • Educational • Actionable security reports</div>
      </div>
    </div>
  );
}
