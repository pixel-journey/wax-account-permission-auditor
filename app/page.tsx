'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { RelatedBlueprints } from '../examples/RelatedBlueprints';
import {
  auditAccountPermissions,
  demoSelfActiveOnOwner,
  demoSocialOwner,
  demoStrongerOwner,
  demoWaitGated,
  demoWeakOwner,
} from '../examples/engines';
import {
  downloadTextFile,
  exportAuditJson,
  exportAuditMarkdown,
  exportBatchAuditCsv,
  exportBatchAuditJson,
  exportBatchAuditMarkdown,
  exportBatchFindingsCsv,
} from '../examples/exportReport';
import {
  fetchAccountPermissionsSafe,
  fetchManyAccountPermissionsSafe,
} from '../examples/live/chain';
import { AUDITOR_MYTHS } from '../examples/myths';
import { DEFAULT_RPC_URL, RPC_ENDPOINTS } from '../examples/rpcEndpoints';
import { riskScoreLabel } from '../examples/severityLabel';
import type { PermissionAuditResult } from '../examples/types';

type Mode =
  | 'live'
  | 'batch'
  | 'weak'
  | 'strong'
  | 'selfactive'
  | 'social'
  | 'wait';

type SeverityFilter = 'all' | 'critical' | 'warn' | 'info';
type SortDir = 'desc' | 'asc';

export default function PermissionAuditor() {
  const [mode, setMode] = useState<Mode>('live');
  const [account, setAccount] = useState('eosio');
  const [rpcUrl, setRpcUrl] = useState(DEFAULT_RPC_URL);
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
  const [sevFilter, setSevFilter] = useState<SeverityFilter>('all');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const demoResult = useMemo(() => {
    if (mode === 'weak') return auditAccountPermissions(demoWeakOwner());
    if (mode === 'strong') return auditAccountPermissions(demoStrongerOwner());
    if (mode === 'selfactive')
      return auditAccountPermissions(demoSelfActiveOnOwner());
    if (mode === 'social') return auditAccountPermissions(demoSocialOwner());
    if (mode === 'wait') return auditAccountPermissions(demoWaitGated());
    return null;
  }, [mode]);

  const result =
    mode === 'live' ? liveResult : mode === 'batch' ? null : demoResult;

  const filteredBatch = useMemo(() => {
    let list = [...batchResults];
    if (sevFilter !== 'all') {
      list = list.filter((r) =>
        r.findings.some((f) => f.severity === sevFilter)
      );
    }
    list.sort((a, b) =>
      sortDir === 'desc' ? b.riskScore - a.riskScore : a.riskScore - b.riskScore
    );
    return list;
  }, [batchResults, sevFilter, sortDir]);

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
    const r = await fetchAccountPermissionsSafe(account, { rpcBase: rpcUrl });
    setLoading(false);
    if (!r.ok) {
      setError(`Soft-fail (${new URL(rpcUrl).hostname}): ${r.reason}`);
      setLiveResult(null);
      return;
    }
    setLiveResult(auditAccountPermissions(r.permissions));
    setMeta(`get_account · ${r.source}`);
  }, [account, rpcUrl]);

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
    const { ok, failed } = await fetchManyAccountPermissionsSafe(names, {
      delayMs: 200,
      rpcBase: rpcUrl,
    });
    const out = ok.map((x) => auditAccountPermissions(x.permissions));
    setBatchResults(out);
    setLoading(false);
    setMeta(
      failed.length
        ? `Audited ${out.length} via ${new URL(rpcUrl).hostname}; soft-fails: ${
            failed.map((f) => `${f.account}: ${f.reason}`).join('; ')
          }`
        : `Audited ${out.length} account(s) via ${new URL(rpcUrl).hostname} (200ms spacing)`
    );
  }, [batchText, rpcUrl]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          PERMISSION AUDITOR
        </div>
        <div className="text-xs opacity-60 mb-2">
          Pixel Journey · Pass 7 · educational-reference
        </div>
        <p className="text-xs opacity-50 mb-6 max-w-2xl">
          Structure rules only. Batch CSV + severity filter for multi-account
          scans. Prefer WharfKit for authority changes.
        </p>

        <section
          className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/5 p-4 text-xs space-y-3 max-w-2xl mb-6"
          aria-label="Myths"
        >
          <h2 className="text-sm font-semibold text-fuchsia-100">Myths vs reality</h2>
          {AUDITOR_MYTHS.map((m) => (
            <div key={m.myth}>
              <p className="text-red-200/90">
                <span className="opacity-60">Myth: </span>
                {m.myth}
              </p>
              <p className="text-emerald-100/90 mt-0.5">
                <span className="opacity-60">Reality: </span>
                {m.reality}
              </p>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              ['live', 'Live'],
              ['batch', 'Batch'],
              ['weak', 'Weak owner'],
              ['strong', 'Multi-key'],
              ['selfactive', 'Self@active on owner'],
              ['social', 'Social 2-of-3'],
              ['wait', 'Wait-gated'],
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

        {(mode === 'live' || mode === 'batch') && (
          <label className="flex items-center gap-2 text-xs opacity-80 mb-3">
            RPC
            <select
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              className="bg-black/60 border border-white/10 px-3 py-2 rounded-xl font-mono text-sm"
            >
              {RPC_ENDPOINTS.map((e) => (
                <option key={e.id} value={e.url}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>
        )}

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
                <>
                  <button
                    type="button"
                    onClick={() =>
                      copy(
                        exportBatchAuditMarkdown(batchResults),
                        'Batch MD copied'
                      )
                    }
                    className="px-4 py-3 rounded-xl bg-emerald-800 text-sm"
                  >
                    Copy batch MD
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copy(
                        exportBatchAuditJson(batchResults),
                        'Batch JSON copied'
                      )
                    }
                    className="px-4 py-3 rounded-xl bg-emerald-900 text-sm"
                  >
                    Copy batch JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      downloadTextFile(
                        'batch-audit-summary.csv',
                        exportBatchAuditCsv(batchResults),
                        'text/csv;charset=utf-8'
                      );
                      setStatus('Summary CSV downloaded');
                    }}
                    className="px-4 py-3 rounded-xl bg-teal-900 text-sm"
                  >
                    Download summary CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      downloadTextFile(
                        'batch-audit-findings.csv',
                        exportBatchFindingsCsv(batchResults),
                        'text/csv;charset=utf-8'
                      );
                      setStatus('Findings CSV downloaded');
                    }}
                    className="px-4 py-3 rounded-xl bg-teal-950 text-sm"
                  >
                    Download findings CSV
                  </button>
                </>
              )}
            </div>
            {batchResults.length > 0 && (
              <div className="flex flex-wrap gap-3 text-xs items-center pt-2 border-t border-white/10">
                <label className="flex items-center gap-2">
                  Filter
                  <select
                    value={sevFilter}
                    onChange={(e) =>
                      setSevFilter(e.target.value as SeverityFilter)
                    }
                    className="bg-black/60 border border-white/10 px-2 py-1 rounded-lg font-mono"
                  >
                    <option value="all">All accounts</option>
                    <option value="critical">Has critical</option>
                    <option value="warn">Has warn</option>
                    <option value="info">Has info</option>
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  Sort risk
                  <select
                    value={sortDir}
                    onChange={(e) => setSortDir(e.target.value as SortDir)}
                    className="bg-black/60 border border-white/10 px-2 py-1 rounded-lg font-mono"
                  >
                    <option value="desc">High → low</option>
                    <option value="asc">Low → high</option>
                  </select>
                </label>
                <span className="opacity-50">
                  Showing {filteredBatch.length} / {batchResults.length}
                </span>
              </div>
            )}
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
                    copy(exportAuditMarkdown(result), 'Audit MD copied')
                  }
                  className="px-3 py-1 text-xs rounded-lg bg-emerald-900"
                >
                  Copy MD
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copy(exportAuditJson(result), 'Audit JSON copied')
                  }
                  className="px-3 py-1 text-xs rounded-lg bg-sky-900"
                >
                  Copy JSON
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
                  Risk: {result.riskScore} ({riskScoreLabel(result.riskScore)})
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

        {mode === 'batch' && filteredBatch.length > 0 && (
          <div className="space-y-4">
            {filteredBatch.map((r) => (
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
                    risk {r.riskScore} ({riskScoreLabel(r.riskScore)})
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

        {mode === 'batch' &&
          batchResults.length > 0 &&
          filteredBatch.length === 0 && (
            <p className="text-sm opacity-50">
              No accounts match the current severity filter.
            </p>
          )}

        {!result && mode === 'live' && !loading && !error && (
          <p className="text-sm opacity-50">
            Enter a WAX account and load live permissions from chain RPC.
          </p>
        )}

        <RelatedBlueprints />
      </div>
    </div>
  );
}
