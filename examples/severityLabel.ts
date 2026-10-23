export function riskScoreLabel(
  score: number
): "low" | "moderate" | "high" | "critical" {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "moderate";
  return "low";
}
