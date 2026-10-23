# wax-account-permission-auditor

> **Trust label:** `educational-reference`  
> **Status:** Passes 1–4 frozen (PX Perfection)  
> **Category:** Security / permission auditing  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**Goal:** Pure **rule-based audit** of Antelope-style permission structures — thresholds, single points of failure, unsatisfiable weights, wait weights, owner/active hygiene — with actionable findings. Batch-friendly via `auditMany` / paced live batch.

Docs:

- [VERIFICATION-LOG.md](VERIFICATION-LOG.md)
- [RISK-SCORING.md](RISK-SCORING.md) — how `riskScore` and `riskScoreLabel` work
- [LINKAUTH.md](LINKAUTH.md) — what `get_account` cannot show
- [REFINEMENT_COMPLETION_REPORT.md](REFINEMENT_COMPLETION_REPORT.md)

---

## Honesty note

Rules run only on `AccountPermissions` structure in `examples/engines.ts` (no account-name hard-codes).

This tool does **not** broadcast `updateauth` / `linkauth`. Prefer **WharfKit** if you later implement proposals. Visual tree editing lives in [`wax-permission-visualizer-and-editor`](https://github.com/pixel-journey/wax-permission-visualizer-and-editor).

Score bands are **heuristic** (baseline 10 + 25/12/3 per finding severity). See RISK-SCORING.md.

---

## Quick Start

```ts
import { auditAccountPermissions } from "./examples/engines";
import { riskScoreLabel } from "./examples/severityLabel";

const result = auditAccountPermissions({
  account: "myaccount",
  permissions: [
    {
      name: "owner",
      parent: "",
      threshold: 1,
      keys: [{ publicKey: "PUB_K1_…", weight: 1 }],
      accounts: [],
    },
  ],
});

console.log(result.riskScore, riskScoreLabel(result.riskScore));
// e.g. 35 "moderate" for a single critical with no other findings
```

Live: `fetchAccountPermissionsSafe` → map → audit.  
Batch: `fetchManyAccountPermissionsSafe` (default 200ms spacing).

```bash
npm install && npm test && npm run dev
```

---

## Rules (examples)

- Threshold > total weight (keys + accounts + waits) → critical
- Owner single key threshold 1 → critical SPF
- `*@active` authority on owner → critical
- Active single authority → warn
- Wait-gated threshold → info
- Zero-weight entries → info

## Label bands (summary)

| Score | Label |
|------:|--------|
| 0–34 | low |
| 35–54 | moderate |
| 55–74 | high |
| ≥ 75 | critical |

---

## Companions

- `wax-permission-visualizer-and-editor` (Passes 1–10 frozen)
- `wax-wharfkit-session-keys-and-linked-permissions`
- `wax-safe-key-rotation-assistant`

---

## License

MIT — **Pixel Journey**
