# wax-account-permission-auditor

> **Status:** 🔄 Deep Refinement (PX Perfection Standard v1.1)  
> **Category:** Security / permission auditing  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**Goal:** Pure **rule-based audit** of Antelope-style permission structures — thresholds, single points of failure, unsatisfiable weights, owner/active hygiene — with actionable findings.

---

## Honesty note

Prior UI hard-coded findings by **account name** (`pxjourney` vs others). Rules now run only on `AccountPermissions` structure in `examples/engines.ts`.

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
    // active…
  ],
});
```

Production: map `get_account` → `PermissionLevel[]`.

---

## Rules (examples)

- Threshold > total weight → critical (unsatisfiable)
- Owner single key threshold 1 → critical SPF
- Active single authority → warn
- Zero-weight entries → info

---

## Companions

- `wax-permission-visualizer-and-editor`
- `wax-safe-key-rotation-assistant`
- `wax-multi-sig-proposal-builder-and-simulator`

---

## License

MIT — **Pixel Journey**

*Last major refinement: October 2026*
