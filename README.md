# wax-account-permission-auditor

> **Trust label:** `educational-reference`  
> **Status:** **Passes 1–10 · scope frozen** (2026-10-30)

Batch-friendly **rule audit** of Antelope / WAX permission structures.

- Soft-fail live + paced batch · multi-RPC  
- Same-account `@active` on owner = critical; foreign helpers = social recovery  
- Compare · histogram · CSV · share `?a=` · localStorage  
- **No** auto authority broadcast  

```bash
npm install && npm test && npm run dev
```

[EDUCATION.md](./EDUCATION.md) · [POLICY.md](./POLICY.md) · [RISK-SCORING.md](./RISK-SCORING.md) · [LINKAUTH.md](./LINKAUTH.md)

Companion: [visualizer](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) · [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) · [rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant) · [social recovery](https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools) · [eosio.msig](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) · [hardware](https://github.com/pixel-journey/wax-hardware-wallet-integration-patterns)

Official: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). No `updateauth` broadcast.

MIT — Pixel Journey
