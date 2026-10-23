import { describe, expect, it } from "vitest";
import { riskScoreLabel } from "./severityLabel";

describe("riskScoreLabel", () => {
  it("maps bands", () => {
    expect(riskScoreLabel(10)).toBe("low");
    expect(riskScoreLabel(40)).toBe("moderate");
    expect(riskScoreLabel(60)).toBe("high");
    expect(riskScoreLabel(90)).toBe("critical");
  });
});
