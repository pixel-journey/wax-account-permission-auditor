"use client";

import { useId } from "react";
import type { FindingSeverity, PermissionAuditResult } from "./types";

const sevClass: Record<FindingSeverity, string> = {
  info: "border-white/10 bg-white/5 text-white/80",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  critical: "border-red-500/30 bg-red-500/10 text-red-100",
};

export function AuditResultCard({
  result,
  className = "",
}: {
  result: PermissionAuditResult;
  className?: string;
}) {
  const headingId = useId();
  return (
    <article
      className={`rounded-2xl border border-white/10 bg-black/30 p-6 ${className}`}
      aria-labelledby={headingId}
    >
      <div className="flex justify-between items-start gap-3 mb-4">
        <h3 id={headingId} className="font-mono text-lg">
          {result.account}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-mono ${
            result.riskScore > 60
              ? "bg-red-500/20 text-red-400"
              : result.riskScore > 40
                ? "bg-amber-500/20 text-amber-400"
                : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          Risk {result.riskScore}
        </span>
      </div>
      <p className="text-sm text-white/60 mb-4">{result.summary}</p>
      <ul className="space-y-3">
        {result.findings.map((f) => (
          <li key={f.id} className={`rounded-xl border p-3 text-sm ${sevClass[f.severity]}`}>
            <p className="font-medium">{f.message}</p>
            <p className="text-xs opacity-70 mt-1">→ {f.recommendation}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
