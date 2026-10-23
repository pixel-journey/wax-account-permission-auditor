# Refinement completion — wax-account-permission-auditor

**Trust label:** `educational-reference`  
**Passes:** 1–4 (frozen 2026-10-23)

## Pass map

| Pass | Delivered |
|------|-----------|
| 1 | Soft-fail live, vitest, trust label |
| 2 | Batch UI, MD export, active-on-owner rule |
| 3 | Wait weights, JSON export, paced batch |
| 4 | linkauth honesty, risk labels, freeze |

## Non-goals

- No `updateauth` / `linkauth` broadcast
- Full linkauth inventory (not available from get_account alone)
- Tree editor → visualizer companion

## Verify

```bash
npm install && npm test
```
