# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-23 (docs: RISK-SCORING.md)

| Claim | Status |
|-------|--------|
| Pure audit rules + demos | **verified** (unit) |
| Wait / active-on-owner | **verified** (unit) |
| MD + JSON export | **verified** (unit) |
| riskScoreLabel bands | **verified** (unit) + documented in RISK-SCORING.md |
| linkauth completeness | **not claimed** — LINKAUTH.md |
| On-chain authority writes | **not claimed** |

Score formula (documented): baseline 10 + critical 25 + warn 12 + info 3, cap 100. Labels: low <35, moderate <55, high <75, else critical.

```bash
npm install && npm test
```
