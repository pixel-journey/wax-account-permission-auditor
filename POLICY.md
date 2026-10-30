# Policy — permission auditor

**Trust label:** `educational-reference`  
**Scope frozen:** Pass 10 (2026-10-30)

## In scope

- Pure structure rules on `AccountPermissions`
- Soft-fail live / paced batch `get_account` (multi-RPC)
- Demos: weak, multi-key, self@active, social 2-of-3, wait-gated
- Exports: MD, JSON, summary CSV, findings CSV
- Compare two accounts · batch histogram · filter/sort
- Share `?a=` · batch list localStorage · myths · related blueprints

## Out of scope (by design)

- Live `updateauth` / `deleteauth` / `linkauth` broadcast
- Full linkauth inventory → see LINKAUTH.md
- Interactive tree / threshold sim → `wax-permission-visualizer-and-editor`
- Social recovery runbooks → `wax-social-recovery-and-key-backup-tools`

## Critical rule (locked with visualizer)

Only **this account@active** on **this account's owner** is critical.  
Foreign `bob@active` weights are social recovery (**info**), not critical.

## Stack

Prefer **WharfKit** for any future real authority changes. Avoid eosjs / UAL as primary greenfield stack.
