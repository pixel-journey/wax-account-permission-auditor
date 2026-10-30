import type { PermissionAuditResult } from "./types";
import { riskScoreLabel } from "./severityLabel";

export type CompareRow = {
  accountA: string;
  accountB: string;
  scoreA: number;
  scoreB: number;
  labelA: string;
  labelB: string;
  delta: number;
  higherRisk: string | "tie";
};

export function compareAuditResults(
  a: PermissionAuditResult,
  b: PermissionAuditResult
): CompareRow {
  const delta = a.riskScore - b.riskScore;
  return {
    accountA: a.account,
    accountB: b.account,
    scoreA: a.riskScore,
    scoreB: b.riskScore,
    labelA: riskScoreLabel(a.riskScore),
    labelB: riskScoreLabel(b.riskScore),
    delta,
    higherRisk:
      delta > 0 ? a.account : delta < 0 ? b.account : "tie",
  };
}

export function exportCompareMarkdown(
  a: PermissionAuditResult,
  b: PermissionAuditResult
): string {
  const c = compareAuditResults(a, b);
  const lines = [
    `# Compare audits — ${a.account} vs ${b.account}`,
    "",
    `| | ${a.account} | ${b.account} |`,
    `|---|---:|---:|`,
    `| Risk | ${c.scoreA} (${c.labelA}) | ${c.scoreB} (${c.labelB}) |`,
    `| Delta (A−B) | ${c.delta} | |`,
    `| Higher risk | ${c.higherRisk} | |`,
    "",
    `## ${a.account} findings (${a.findings.length})`,
    "",
  ];
  for (const f of a.findings)
    lines.push(`- **${f.severity}**: ${f.message}`);
  lines.push("", `## ${b.account} findings (${b.findings.length})`, "");
  for (const f of b.findings)
    lines.push(`- **${f.severity}**: ${f.message}`);
  lines.push("", "> Educational only — structure heuristics.", "");
  return lines.join("\n");
}

/** Simple bucket counts for a batch risk histogram. */
export function riskHistogram(results: PermissionAuditResult[]): {
  low: number;
  moderate: number;
  high: number;
  critical: number;
} {
  const h = { low: 0, moderate: 0, high: 0, critical: 0 };
  for (const r of results) {
    const label = riskScoreLabel(r.riskScore);
    h[label]++;
  }
  return h;
}
