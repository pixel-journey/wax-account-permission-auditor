import { describe, expect, it } from "vitest";
import {
  auditAccountPermissions,
  demoActiveControlsOwner,
  demoStrongerOwner,
  demoWaitGated,
  demoWeakOwner,
} from "./engines";
import {
  exportAuditJson,
  exportAuditMarkdown,
  exportBatchAuditJson,
  exportBatchAuditMarkdown,
} from "./exportReport";

describe("auditAccountPermissions", () => {
  it("flags weak single-key owner as higher risk than multi-key", () => {
    const weak = auditAccountPermissions(demoWeakOwner());
    const strong = auditAccountPermissions(demoStrongerOwner());
    expect(weak.riskScore).toBeGreaterThan(strong.riskScore);
    expect(weak.findings.some((f) => f.severity === "critical")).toBe(true);
  });

  it("detects empty permissions", () => {
    const r = auditAccountPermissions({ account: "x", permissions: [] });
    expect(r.findings.some((f) => f.id === "empty")).toBe(true);
  });

  it("flags active controlling owner", () => {
    const r = auditAccountPermissions(demoActiveControlsOwner());
    expect(
      r.findings.some((f) => f.message.includes("active must not control owner"))
    ).toBe(true);
  });

  it("notes wait-gated thresholds", () => {
    const r = auditAccountPermissions(demoWaitGated());
    expect(r.findings.some((f) => f.id.includes("wait-gated"))).toBe(true);
  });
});

describe("export", () => {
  it("markdown includes WharfKit", () => {
    const md = exportAuditMarkdown(auditAccountPermissions(demoWeakOwner()));
    expect(md).toContain("WharfKit");
  });

  it("json parses", () => {
    const parsed = JSON.parse(
      exportAuditJson(auditAccountPermissions(demoWeakOwner()))
    );
    expect(parsed.result.account).toBe("demoweak");
  });

  it("batch json has count", () => {
    const parsed = JSON.parse(
      exportBatchAuditJson([
        auditAccountPermissions(demoWeakOwner()),
        auditAccountPermissions(demoStrongerOwner()),
      ])
    );
    expect(parsed.count).toBe(2);
    expect(exportBatchAuditMarkdown(parsed.results as never[])).toContain(
      "Batch"
    );
  });
});
