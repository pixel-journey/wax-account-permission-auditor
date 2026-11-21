# Education — account permission auditor

> **Rung:** `npm test` passes. Fixtures are **arguments**. Nothing here calls `updateauth` or broadcasts.  
> **The test is the rule.** Official: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). Scoring: [RISK-SCORING.md](RISK-SCORING.md).

Antelope authorization is a **permission tree** (owner / active / custom), not an ERC-20 allowance list. Persistent risk is `updateauth` / `linkauth` and over-broad session keys — not "infinite token approvals."

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Spot self-active-on-owner as critical |
| Intermediate | Contrast social multiparty owner vs the critical pattern |
| Masterclass | Use score bands without treating them as chain enforcement |

---

## Beginner — one scene

A weak single-key owner scores **84** and is critical. A multi-key owner scores **34** and is low. The difference is 50. Neither number is a certification.

An empty permission tree produces the finding id `empty`.

If `alice@owner` includes `alice@active`, that is critical: the same account must not control its own owner. If `alice@owner` includes `bob@active`, that is an info-level social-recovery shape. A foreign helper is not the same bug as self-control.

| Input pattern | Locked finding |
| --- | --- |
| Weak single-key owner | score `84`, critical |
| Multi-key owner | score `34`, low |
| Empty permissions | finding id `empty` |
| `alice@owner` includes `alice@active` | critical: must not control its own owner |
| `alice@owner` includes `bob@active` | info / social recovery shape |
| Wait-gated threshold | finding id containing `wait-gated` |

```bash
npm test
```

---

## Intermediate — critical rules

| Pattern | Verdict |
| --- | --- |
| Same account `@active` on its own `@owner` | **Critical** |
| Foreign account on owner | **Info** (social recovery shape) |
| Threshold > total weight | **Critical** |
| Single-key owner threshold 1 | **Critical** single point of failure |

### Scoring (teaching only)

Baseline 10 + 25/critical + 12/warn + 3/info, cap 100.  
Bands: low 0–34 · moderate 35–54 · high 55–74 · critical ≥75.

Scores are **not** chain enforcement and do not freeze accounts.

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Self-active on owner | critical |
| Foreign helper on owner | info (not same critical) |
| Empty permission list | finding `empty` |
| Treat score as freeze authority | educational only |

---

## Masterclass — Antelope vs EVM authorization

| Model | Persistent risk |
| --- | --- |
| **EVM ERC-20** | `approve(spender, max)` pull allowances |
| **Antelope** | `updateauth` / `linkauth` / `eosio.code` / session keys |

This lab scores permission **structure**. Live authority changes belong in WharfKit SessionKit flows — not in this offline rule engine.

| Tool | Strength |
| --- | --- |
| **This repo** | Rule engine + batch scan + compare |
| **permission-visualizer** | Interactive tree, threshold sim |

Cluster: social-recovery · session-keys · safe-key-rotation · msig simulator.

### Exercises

1. Why is self-active on owner critical? (Account can rewrite its own owner.)  
2. Is bob@active on alice@owner the same critical? (**No**.)  
3. Does this broadcast `updateauth`? (**No**.)  
4. Is "revoke infinite approvals" the right Antelope advice? (**No** — that is EVM.)

---

## What this course will not teach

- A live chain authority rewrite
- That a score ≥75 freezes an account
- ERC-20 allowance hygiene on Antelope
