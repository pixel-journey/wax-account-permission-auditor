# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-23 (Pass 2)

| Claim | Status | Evidence |
|-------|--------|----------|
| Pure audit rules | **verified** (unit) | engines.test.ts |
| active must not control owner | **verified** (unit) | demoActiveControlsOwner |
| Markdown export | **verified** (unit) | exportReport tests |
| Soft-fail / batch live | code present | CORS/offline may fail |
| Authority mutation | **not claimed** | |

```bash
npm install && npm test
```
