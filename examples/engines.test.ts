import { describe, expect, it } from "vitest";
import {
  auditAccountPermissions,
  demoStrongerOwner,
  demoWeakOwner,
} from "./engines";

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
});
