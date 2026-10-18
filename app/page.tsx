'use client';

import React, { useMemo, useState } from 'react';
import {
  auditAccountPermissions,
  demoStrongerOwner,
  demoWeakOwner,
} from '../examples/engines';

type Mode = 'weak' | 'strong';

export default function PermissionAuditor() {
  const [mode, setMode] = useState<Mode>('weak');
  const result = useMemo(
    () =>
      auditAccountPermissions(
        mode === 'weak' ? demoWeakOwner() : demoStrongerOwner()
      ),
    [mode]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          PERMISSION AUDITOR
        </div>
        <div className="text-xs opacity-60 mb-8">
          Pixel Journey · Structure rules only · Not name-based mocks
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('weak')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'weak' ? 'bg-amber-600' : 'bg-white/10'
            }`}
          >
            Demo weak owner
          </button>
          <button
            type="button"
            onClick={() => setMode('strong')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'strong' ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            Demo multi-key owner
          </button>
        </div>

        <div className="border border-white/10 bg-black/40 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="font-mono text-lg">{result.account}</div>
            <div
              className={`px-4 py-1 rounded-full text-sm ${
                result.riskScore > 60
                  ? 'bg-red-500/20 text-red-400'
                  : result.riskScore > 40
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              Risk: {result.riskScore}
            </div>
          </div>
          <p className="text-sm opacity-70 mb-4">{result.summary}</p>
          <ul className="space-y-3 text-sm">
            {result.findings.map((f) => (
              <li key={f.id} className="border-b border-white/10 pb-2">
                <span
                  className={
                    f.severity === 'critical'
                      ? 'text-red-400'
                      : f.severity === 'warn'
                        ? 'text-amber-400'
                        : 'text-white/70'
                  }
                >
                  [{f.severity}] {f.message}
                </span>
                <div className="text-xs opacity-60 mt-1">→ {f.recommendation}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-xs opacity-60">
          Production: map <code className="text-emerald-400/80">get_account</code>{' '}
          authorities into <code className="text-emerald-400/80">AccountPermissions</code>{' '}
          and call <code className="text-emerald-400/80">auditAccountPermissions</code>.
        </div>
      </div>
    </div>
  );
}
