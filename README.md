# wax-account-permission-auditor

> **Trust label:** `educational-reference`  
> **Status:** Pass 1 deep refinement (PX Perfection)  
> **Category:** Security / permission auditing  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**Goal:** Pure **rule-based audit** of Antelope-style permission structures — thresholds, single points of failure, unsatisfiable weights, owner/active hygiene — with actionable findings. Batch-friendly via `auditMany`.

See [VERIFICATION-LOG.md](VERIFICATION-LOG.md).

---

## Honesty note

Rules run only on `AccountPermissions` structure in `examples/engines.ts` (no account-name hard-codes).

This tool does **not** broadcast `updateauth`. Prefer **WharfKit** if you later implement proposals. Visual tree editing lives in [`wax-permission-visualizer-and-editor`](https://github.com/pixel-journey/wax-permission-visualizer-and-editor).

---

## Quick Start

```ts
import { auditAccountPermissions } from "./examples/engines";

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
```

Live: `fetchAccountPermissionsSafe` → map → audit.

```bash
npm install && npm test && npm run dev
```

---

## Rules (examples)

- Threshold > total weight → critical (unsatisfiable)
- Owner single key threshold 1 → critical SPF
- Active single authority → warn
- Zero-weight entries → info

---

## Companions

- `wax-permission-visualizer-and-editor` (Passes 1–10 frozen)
- `wax-wharfkit-session-keys-and-linked-permissions`
- `wax-safe-key-rotation-assistant`

---

## License

MIT — **Pixel Journey**
