# Account permission auditor (batch)

## Role vs visualizer

| Tool | Strength |
|------|----------|
| **This repo** | Rule engine + batch scan many accounts + compare + CSV |
| **permission-visualizer** | Interactive tree, threshold sim (keys + account-auth), baseline/diff |

## Critical rule (Passes 5–10)

| Pattern | Verdict |
|---------|---------|
| `alice@owner` includes `alice@active` | **Critical** |
| `alice@owner` includes `bob@active` | **Info** (social recovery) |
| Threshold > total weight | **Critical** |
| Single-key owner thr 1 | **Critical** SPF |

## Scoring

Baseline 10 + 25/critical + 12/warn + 3/info, cap 100.  
Bands: low 0–34 · moderate 35–54 · high 55–74 · critical ≥75.  
See RISK-SCORING.md.

## Cluster

| Need | Repo |
|------|------|
| Batch audit | **This** |
| Visualize / sim | permission-visualizer |
| Social recovery design | social-recovery |
| Limited keys + linkauth | session-keys |
| Key rotation | safe-key-rotation |

Prefer **WharfKit** for live authority changes.
