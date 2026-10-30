import { describe, expect, it } from "vitest";
import {
  auditAccountPermissions,
  demoStrongerOwner,
  demoWeakOwner,
} from "./engines";
import { compareAuditResults, riskHistogram } from "./compare";

describe("compare", () => {
  it("marks weak as higher risk than strong",
    () => {
      const a = auditAccountPermissions(demoWeakOwner());
      const b = auditAccountPermissions(demoStrongerOwner());
      const c = compareAuditResults(a, b);
      expect(c.higherRisk).toBe(a.account);
      expect(c.delta).toBeGreaterThan(0);
    });

  it("histogram counts",
    () => {
      const results = [
        auditAccountPermissions(demoWeakOwner()),
        auditAccountPermissions(demoStrongerOwner()),
      ];
      const h = riskHistogram(results);
      expect(h.low + h.moderate + h.high + h.critical).toBe(2);
    });
});
