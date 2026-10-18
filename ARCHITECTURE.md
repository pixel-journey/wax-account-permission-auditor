# ARCHITECTURE.md — Account Permission Auditor

## Invariants

1. Findings depend only on permission structure, not account name
2. Risk score derived from finding severities
3. Every finding includes a recommendation
4. get_account mapping stays at the app edge

## Flow

```
get_account → AccountPermissions → auditAccountPermissions → UI
```

---

*Pixel Journey*
