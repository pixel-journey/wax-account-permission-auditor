import { describe, expect, it } from "vitest";
import {
  auditAccountPermissions,
  demoSocialOwner,
  demoWeakOwner,
} from "./engines";
import {
  exportBatchAuditCsv,
  exportBatchFindingsCsv,
} from "./exportReport";

describe("CSV export", () => {
  it("batch summary has header and accounts",
    () => {
      const results = [
        auditAccountPermissions(demoWeakOwner()),
        auditAccountPermissions(demoSocialOwner()),
      ];
      const csv = exportBatchAuditCsv(results);
      expect(csv).toContain("account,riskScore");
      expect(csv).toContain("demoweak");
      expect(csv).toContain("alice.wam");
    });

  it("findings csv has severity column",
    () => {
      const results = [auditAccountPermissions(demoWeakOwner())];
      const csv = exportBatchFindingsCsv(results);
      expect(csv).toContain("severity");
      expect(csv).toContain("critical");
    });
});
