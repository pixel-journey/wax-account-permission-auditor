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
      expect(c.higherRisk).toBe("demoweak");
      expect(c.scoreA).toBe(84);
      expect(c.scoreB).toBe(34);
      expect(c.delta).toBe(50);
      expect(c.labelA).toBe("critical");
      expect(c.labelB).toBe("low");
    });

  it("histogram counts",
    () => {
      const results = [
        auditAccountPermissions(demoWeakOwner()),
        auditAccountPermissions(demoStrongerOwner()),
      ];
      const h = riskHistogram(results);
      expect(h).toEqual({ low: 1, moderate: 0, high: 0, critical: 1 });
    });
});
