# Education — account permission auditor (batch)

> **Rung:** `npm test` passes. The fixtures are arguments. Nothing here calls `updateauth` or broadcasts.  
> **The test is the rule.** Official model: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). Scoring: [RISK-SCORING.md](RISK-SCORING.md).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Spot self-active-on-owner as critical |
| Intermediate | Contrast social multiparty owner vs the critical pattern |
| Masterclass | Use score bands without treating them as chain enforcement |

---

## Beginner — one scene

| Fixture | Locked result |
| --- | --- |
| `demoWeakOwner()` | risk score above `demoStrongerOwner()`, at least one `critical` |
| `{ account: "x", permissions: [] }` | finding id `empty` |
| `demoSelfActiveOnOwner()` | critical, message includes `must not control its own owner` |
| `demoSocialOwner()` | no that critical; finding id `owner-multiparty` |
| `demoWaitGated()` | finding id containing `wait-gated` |

`alice@owner` including `alice@active` is the critical case. A foreign helper on owner is not the same bug.

```bash
npm test
```

---

## Intermediate — critical rules

| Pattern | Verdict |
| --- | --- |
| `alice@owner` includes `alice@active` | **Critical** |
| `alice@owner` includes `bob@active` | **Info** (social recovery shape) |
| Threshold > total weight | **Critical** |
| Single-key owner thr 1 | **Critical** SPF |

### Scoring

Baseline 10 + 25/critical + 12/warn + 3/info, cap 100.  
Bands: low 0–34 · moderate 35–54 · high 55–74 · critical ≥75.

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Self-active on owner | critical |
| Foreign bob@active on owner | info (not same critical) |
| Empty permission list | finding `empty` |
| Score as freeze authority | educational only |

---

## Masterclass — role vs visualizer

| Tool | Strength |
| --- | --- |
| **This repo** | Rule engine + batch scan + compare + CSV |
| **permission-visualizer** | Interactive tree, threshold sim |

Cluster: social-recovery · session-keys · safe-key-rotation · msig simulator. Prefer **WharfKit** for live authority changes.

### Exercises

1. Why is self-active on owner critical? (Account can rewrite its own owner.)  
2. Is bob@active on alice@owner the same critical? (**No**.)  
3. Does this broadcast `updateauth`? (**No**.)

---

## What this course will not teach

- A live chain authority rewrite
- That a score ≥75 freezes an account
