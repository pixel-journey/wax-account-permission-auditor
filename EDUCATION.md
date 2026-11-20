# Account permission auditor (batch)

> **Rung:** `npm test` passes. The fixtures are arguments. Nothing here calls `updateauth` or broadcasts.  
> **The test is the rule.** Official model: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions).

## Predict, then run

| Fixture | Locked result |
| --- | --- |
| `demoWeakOwner()` | risk score above `demoStrongerOwner()`, and at least one `critical` |
| `{ account: "x", permissions: [] }` | finding id `empty` |
| `demoSelfActiveOnOwner()` | critical, message includes `must not control its own owner` |
| `demoSocialOwner()` | no that critical; finding id `owner-multiparty` |
| `demoWaitGated()` | a finding id containing `wait-gated` |

`alice@owner` including `alice@active` is the critical case. A foreign helper on owner is not the same bug.

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
