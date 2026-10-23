'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  auditAccountPermissions,
  auditMany,
  demoActiveControlsOwner,
  demoStrongerOwner,
  demoWeakOwner,
} from '../examples/engines';
import {
  exportAuditMarkdown,
  exportBatchAuditMarkdown,
} from '../examples/exportReport';
import { fetchAccountPermissionsSafe } from '../examples/live/chain';
import type { PermissionAuditResult } from '../examples/types';

type Mode = 'live' | 'batch' | 'weak' | 'strong' | 'activeowner';

export default function PermissionAuditor() {
  const [mode, setMode] = useState<Mode>('live');
  const [account, setAccount] = useState('eosio');
  const [batchText, setBatchText] = useState('eosio\natomicassets');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [liveResult, setLiveResult] = useState<PermissionAuditResult | null>(
    null
  );
  const [batchResults, setBatchResults] = useState<PermissionAuditResult[]>(
    []
  );
  const [meta, setMeta] = useState<string | null>(null);

  const demoResult = useMemo(() => {
    if (mode === 'weak') return auditAccountPermissions(demoWeakOwner());
    if (mode === 'strong') return auditAccountPermissions(demoStrongerOwner());
    if (mode === 'activeowner')
      return auditAccountPermissions(demoActiveControlsOwner());
    return null;
  }, [mode]);

  const result =
    mode === 'live'
      ? liveResult
      : mode === 'batch'
        ? null
        : demoResult;

  const copy = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(ok);
    } catch {
      setStatus('Clipboard unavailable');
    }
  };

  const runLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMeta(null);
    const r = await fetchAccountPermissionsSafe(account);
    setLoading(false);
    if (!r.ok) {
      setError(`Soft-fail: ${r.reason}`);
      setLiveResult(null);
      return;
    }
    setLiveResult(auditAccountPermissions(r.permissions));
    setMeta(`get_account · ${r.source}`);
  }, [account]);

  const runBatch = useCallback(async () => {
    const names = batchText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (names.length === 0) {
      setError('Enter at least one account');
      return;
    }
    setLoading(true);
    setError(null);
    setBatchResults([]);
    const out: PermissionAuditResult[] = [];
    const fails: string[] = [];
    for (const name of names) {
      const r = await fetchAccountPermissionsSafe(name);
      if (!r.ok) {
        fails.push(`${name}: ${r.reason}`);
        continue;
      }
      out.push(auditAccountPermissions(r.permissions));
    }
    setBatchResults(out);
    setLoading(false);
    setMeta(
      fails.length
        ? `Audited ${out.length}; soft-fails: ${fails.join('; ')}`
        : `Audited ${out.length} account(s)`
    );
  }, [batchText]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          PERMISSION AUDITOR
        </div>
        <div className="text-xs opacity-60 mb-2">
          Pixel Journey · Pass 2 · educational-reference
        </div>
        <p className="text-xs opacity-50 mb-8 max-w-2xl">
          Pure structure rules. Prefer WharfKit for authority changes. Companion:{' '}
          <a
            className="underline text-emerald-400"
            href="https://github.com/pixel-journey/wax-permission-visualizer-and-editor"
            target="_blank"
            rel="noopener noreferrer"
          >
            visualizer
          </a>
          .
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              ['live', 'Live'],
              ['batch', 'Batch'],
              ['weak', 'Weak owner'],
              ['strong', 'Multi-key'],
              ['activeowner', 'Active on owner'],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm ${
                mode === m ? 'bg-sky-600' : 'bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
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
              className="px-6 py-3 rounded-xl bg-sky-600 text-sm disabled:opacity-50"
            >
              {loading ? 'Fetching…' : 'Audit live'}
            </button>
          </div>
        )}

        {mode === 'batch' && (
          <div className="border border-white/10 bg-black/40 p-4 rounded-2xl mb-6 space-y-3">
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              rows={4}
              className="w-full bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
              placeholder="One account per line"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={runBatch}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-sky-600 text-sm disabled:opacity-50"
              >
                {loading ? 'Auditing…' : 'Audit batch'}
              </button>
              {batchResults.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    copy(
                      exportBatchAuditMarkdown(batchResults),
                      'Batch report copied'
                    )
                  }
                  className="px-4 py-3 rounded-xl bg-emerald-800 text-sm"
                >
                  Copy batch MD
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-400 border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}
        {status && (
          <p className="mb-4 text-xs text-emerald-200/80" role="status">
            {status}
          </p>
        )}
        {meta && (
          <div className="mb-4 text-xs opacity-50 break-all">{meta}</div>
        )}

        {result && (
          <div className="border border-white/10 bg-black/40 p-6 rounded-2xl">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <div className="font-mono text-lg">{result.account}</div>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() =>
                    copy(exportAuditMarkdown(result), 'Audit report copied')
                  }
                  className="px-3 py-1 text-xs rounded-lg bg-emerald-900"
                >
                  Copy MD
                </button>
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

        {mode === 'batch' && batchResults.length > 0 && (
          <div className="space-y-4">
            {[...batchResults]
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((r) => (
                <div
                  key={r.account}
                  className="border border-white/10 bg-black/40 p-4 rounded-xl text-sm"
                >
                  <div className="flex justify-between font-mono mb-2">
                    <span>{r.account}</span>
                    <span
                      className={
                        r.riskScore > 60 ? 'text-red-400' : 'text-emerald-400'
                      }
                    >
                      risk {r.riskScore}
                    </span>
                  </div>
                  <p className="text-xs opacity-70 mb-2">{r.summary}</p>
                  <ul className="text-xs space-y-1 opacity-80">
                    {r.findings.slice(0, 5).map((f) => (
                      <li key={f.id}>
                        [{f.severity}] {f.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}

        {!result && mode === 'live' && !loading && !error && (
          <p className="text-sm opacity-50">
            Enter a WAX account and load live permissions from chain RPC.
          </p>
        )}
      </div>
    </div>
  );
}
