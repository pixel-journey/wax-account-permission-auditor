# Policy — permission auditor

**Trust label:** `educational-reference`  
**Pass:** 8 (2026-10-30)

## In scope

- Pure structure rules on `AccountPermissions`
- Soft-fail live / paced batch `get_account`
- Exports (MD, JSON, CSV)
- Educational demos and myths

## Out of scope

- Live `updateauth` / `deleteauth` / `linkauth`
- Full linkauth inventory (see LINKAUTH.md)
- Interactive tree editing → visualizer companion

## Critical rule (aligned with visualizer)

Only **this account@active** on **this account's owner** is critical. Foreign helpers are social recovery (info).
