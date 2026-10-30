export type RiskLabel = "low" | "moderate" | "high" | "critical";

/**
 * Bands (RISK-SCORING.md):
 * 0–34 low · 35–54 moderate · 55–74 high · ≥75 critical
 */
export function riskScoreLabel(score: number): RiskLabel {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "moderate";
  return "low";
}
