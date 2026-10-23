import type { PermissionAuditResult } from "./types";

export function exportAuditMarkdown(result: PermissionAuditResult): string {
  const lines: string[] = [
    `# Permission audit — ${result.account}`,
    "",
    `> Trust label: educational-reference · risk ${result.riskScore}/100`,
    "",
    result.summary,
    "",
    "## Findings",
    "",
  ];

  if (result.findings.length === 0) {
    lines.push("- None.");
  } else {
    for (const f of result.findings) {
      lines.push(
        `- **${f.severity}**${f.permission ? ` (${f.permission})` : ""}: ${f.message}`
      );
      lines.push(`  - Recommendation: ${f.recommendation}`);
    }
  }

  lines.push(
    "",
    "## Notes",
    "",
    "- Prefer **WharfKit** for any future authority changes.",
    "- Companion tree UI: wax-permission-visualizer-and-editor.",
    ""
  );
  return lines.join("\n");
}

export function exportBatchAuditMarkdown(
  results: PermissionAuditResult[]
): string {
  const header = [
    `# Batch permission audit (${results.length} account(s))`,
    "",
    "> Educational only. Sorted by risk descending.",
    "",
  ];
  const sorted = [...results].sort((a, b) => b.riskScore - a.riskScore);
  const body = sorted.map((r) => exportAuditMarkdown(r)).join("\n---\n\n");
  return header.join("\n") + body;
}

export function exportAuditJson(result: PermissionAuditResult): string {
  return JSON.stringify(
    {
      trustLabel: "educational-reference",
      result,
    },
    null,
    2
  );
}

export function exportBatchAuditJson(
  results: PermissionAuditResult[]
): string {
  const sorted = [...results].sort((a, b) => b.riskScore - a.riskScore);
  return JSON.stringify(
    {
      trustLabel: "educational-reference",
      count: sorted.length,
      results: sorted,
    },
    null,
    2
  );
}
