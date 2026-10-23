/**
 * Presentation bands over additive riskScore (0–100).
 * See RISK-SCORING.md for weights, borders, and non-goals.
 *
 * low 0–34 · moderate 35–54 · high 55–74 · critical ≥75
 */
export function riskScoreLabel(
  score: number
): "low" | "moderate" | "high" | "critical" {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "moderate";
  return "low";
}
