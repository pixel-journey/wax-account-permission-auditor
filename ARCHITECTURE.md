# Architecture

**Trust label:** educational-reference

## Layers

| Layer | Path | Role |
|-------|------|------|
| Types | `examples/types.ts` | Permission / finding shapes (incl. optional waits) |
| Pure rules | `examples/engines.ts` | Findings + additive riskScore |
| Labels | `examples/severityLabel.ts` | Score → low/moderate/high/critical |
| Export | `examples/exportReport.ts` | MD / JSON (includes label) |
| Live RPC | `examples/live/chain.ts` | Soft-fail get_account, paced batch |
| UI | `app/page.tsx` | Demos, live, batch, clipboard |

## Data flow

```
get_account (optional)
    → mapChainPermissions
    → auditAccountPermissions  → findings + riskScore
    → riskScoreLabel(score)    → badge / export
```

No authority writes. Prefer WharfKit outside this repo for any future `updateauth` / `linkauth`.

## Docs

- RISK-SCORING.md — score math and bands
- LINKAUTH.md — get_account limits
- VERIFICATION-LOG.md — claim table
