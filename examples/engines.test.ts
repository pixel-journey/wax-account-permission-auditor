import { describe, expect, it } from "vitest";
import {
  auditAccountPermissions,
  demoActiveControlsOwner,
  demoStrongerOwner,
  demoWeakOwner,
} from "./engines";
import { exportAuditMarkdown, exportBatchAuditMarkdown } from "./exportReport";

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
});

describe("exportAuditMarkdown", () => {
  it("includes account and WharfKit note", () => {
    const md = exportAuditMarkdown(auditAccountPermissions(demoWeakOwner()));
    expect(md).toContain("demoweak");
    expect(md).toContain("WharfKit");
  });

  it("batch export lists multiple accounts", () => {
    const md = exportBatchAuditMarkdown([
      auditAccountPermissions(demoWeakOwner()),
      auditAccountPermissions(demoStrongerOwner()),
    ]);
    expect(md).toContain("Batch permission audit");
    expect(md).toContain("demoweak");
    expect(md).toContain("demosafe");
  });
});
