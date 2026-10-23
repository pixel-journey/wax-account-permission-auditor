import { riskScoreLabel } from "./severityLabel";
import type { PermissionAuditResult } from "./types";

export function exportAuditMarkdown(result: PermissionAuditResult): string {
  const label = riskScoreLabel(result.riskScore);
  const lines: string[] = [
    `# Permission audit — ${result.account}`,
    "",
    `> Trust label: educational-reference · risk ${result.riskScore}/100 (${label})`,
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
    "## Scoring note",
    "",
    "- Additive: baseline 10 + critical 25 + warn 12 + info 3 (cap 100).",
    "- Labels: low 0–34 · moderate 35–54 · high 55–74 · critical ≥75.",
    "- Full detail: RISK-SCORING.md in this repo.",
    "",
    "## Notes",
    "",
    "- Prefer **WharfKit** for any future authority changes.",
    "- Companion tree UI: wax-permission-visualizer-and-editor.",
    "- linkauth surface is not fully visible via get_account — see LINKAUTH.md.",
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
      riskScoreLabel: riskScoreLabel(result.riskScore),
      scoringNote:
        "baseline 10 + critical25/warn12/info3; bands in RISK-SCORING.md",
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
      scoringNote:
        "baseline 10 + critical25/warn12/info3; bands in RISK-SCORING.md",
      results: sorted.map((r) => ({
        ...r,
        riskScoreLabel: riskScoreLabel(r.riskScore),
      })),
    },
    null,
    2
  );
}
