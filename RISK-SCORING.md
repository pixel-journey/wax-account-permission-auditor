# Risk scoring and labels

**Trust label:** educational-reference

This auditor compresses pure **structure findings** into a 0–100 `riskScore` and a short `riskScoreLabel`. Neither is a security certification, wallet health grade, or loss probability.

## Pipeline

1. `auditAccountPermissions` / `auditPermissionLevel` emit `AuditFinding[]`.
2. Score starts at **10**, then adds per finding:
   - `critical` → **+25**
   - `warn` → **+12**
   - `info` → **+3**
3. Clamp to **100**.
4. `riskScoreLabel(score)` maps bands for UI badges and reports.

The **finding list** remains the source of truth. Score + label are for sorting, badges, and export summaries.

## Label bands

| Score | Label | Typical reading |
|------:|--------|------------------|
| 0–34 | `low` | Few findings or infos only |
| 35–54 | `moderate` | One critical alone, or several warns |
| 55–74 | `high` | Multiple severe issues stacking |
| ≥ 75 | `critical` | Dense critical load (or saturated score) |

```ts
// examples/severityLabel.ts
if (score >= 75) return "critical";
if (score >= 55) return "high";
if (score >= 35) return "moderate";
return "low";
```

### Border note

A **single** critical finding with no other findings yields score **35** → label **`moderate`**, not `critical`. That is intentional for this educational tool: the finding still appears in the list; the badge only escalates as findings compound. Product policy can change this without touching the rule engine (e.g. “any critical ⇒ at least high”).

## Approximate score composition

| Rough composition | Approx score | Label |
|-------------------|-------------:|--------|
| No findings | 10 | low |
| 1–2 infos | 13–16 | low |
| Several warns | ~34–46 | low → moderate |
| 1 critical | 35 | moderate |
| 1 critical + 1 warn | 47 | moderate |
| 2 criticals | 60 | high |
| 2 criticals + warn | 72 | high |
| 3 criticals | 85 | critical |
| Saturated stack | 100 | critical |

## What drives critical / warn / info

| Family | Severity | Notes |
|--------|----------|--------|
| Threshold > total weight (keys + accounts + waits) | critical | Unsatisfiable authority |
| Owner single-key threshold 1 | critical | Classic SPF |
| `*@active` on owner | critical | Active must not control owner |
| Missing owner in input | critical | Incomplete snapshot |
| Empty permissions | critical | |
| Active single-authority threshold 1 | warn | Hot-key routine risk |
| Owner includes account-based auths | warn | Review linked accounts |
| Missing active | warn | Incomplete snapshot |
| Wait-gated (immediate short, waits fill threshold) | info | Time-delay may be intentional |
| Zero-weight keys/accounts; odd waits | info | Cleanup |
| Active parent ≠ owner | info | Confirm hierarchy |

Wait-gated is **info** on purpose: the permission may still be satisfiable after delay.

## What the score ignores

- Full **linkauth** action surface (not returned by `get_account` alone) — see [LINKAUTH.md](./LINKAUTH.md)
- Key custody (hardware vs software)
- Whether keys are already compromised
- Token / NFT / RAM exposure
- Social recovery quality beyond structure rules

A multi-sig-looking owner can still score **low** while a custom permission is linked to dangerous contract actions.

## How to use in practice

1. Sort batch results by `riskScore` descending.
2. Open every **high** / **critical** and read findings + recommendations.
3. Still inspect **moderate** for a lone critical (score ≈ 35).
4. Export MD/JSON for a paper trail; do not rely on the badge alone.
5. Tree / proposal work → [wax-permission-visualizer-and-editor](https://github.com/pixel-journey/wax-permission-visualizer-and-editor).
6. Limited session keys / linkauth patterns → [wax-wharfkit-session-keys-and-linked-permissions](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions).
7. Any real chain authority change → **WharfKit** (`session.transact`). This repo never broadcasts.

## Tuning knobs (future)

Without rewriting rules you can:

- Force “any critical finding ⇒ label at least `high`” in the labeler only
- Adjust additive weights (+25 / +12 / +3)
- Expose `maxSeverity` beside `riskScore` for UI

Document any band or weight change in this file and in VERIFICATION-LOG.md.
