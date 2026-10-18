'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  auditAccountPermissions,
  demoStrongerOwner,
  demoWeakOwner,
} from '../examples/engines';
import { fetchAccountPermissions } from '../examples/live/chain';
import type { PermissionAuditResult } from '../examples/types';

type Mode = 'live' | 'weak' | 'strong';

export default function PermissionAuditor() {
  const [mode, setMode] = useState<Mode>('live');
  const [account, setAccount] = useState('eosio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveResult, setLiveResult] = useState<PermissionAuditResult | null>(
    null
  );
  const [meta, setMeta] = useState<string | null>(null);

  const demoResult = useMemo(() => {
    if (mode === 'weak') return auditAccountPermissions(demoWeakOwner());
    if (mode === 'strong') return auditAccountPermissions(demoStrongerOwner());
    return null;
  }, [mode]);

  const result = mode === 'live' ? liveResult : demoResult;

  const runLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMeta(null);
    try {
      const { permissions, source } = await fetchAccountPermissions(account);
      setLiveResult(auditAccountPermissions(permissions));
      setMeta(`get_account · ${source}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Live fetch failed');
      setLiveResult(null);
    } finally {
      setLoading(false);
    }
  }, [account]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          PERMISSION AUDITOR
        </div>
        <div className="text-xs opacity-60 mb-8">
          Pixel Journey · Live get_account or demo · Structure rules only
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'live' ? 'bg-sky-600' : 'bg-white/10'
            }`}
          >
            Live chain
          </button>
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

        {mode === 'live' && (
          <div className="border border-white/10 bg-black/40 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row gap-3">
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
              placeholder="WAX account"
            />
            <button
              type="button"
              onClick={runLive}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-sky-600 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Fetching…' : 'Audit live'}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-400 border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}
        {meta && (
          <div className="mb-4 text-xs opacity-50 break-all">{meta}</div>
        )}

        {result && (
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
                  <div className="text-xs opacity-60 mt-1">
                    → {f.recommendation}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!result && mode === 'live' && !loading && !error && (
          <p className="text-sm opacity-50">
            Enter a WAX account and load live permissions from chain RPC.
          </p>
        )}

        <div className="mt-8 text-xs opacity-60">
          Live: <code className="text-emerald-400/80">get_account</code> →{' '}
          <code className="text-emerald-400/80">auditAccountPermissions</code>. Pure
          rules unchanged.
        </div>
      </div>
    </div>
  );
}
