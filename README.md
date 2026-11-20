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

Companion: [wax-permission-visualizer-and-editor](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) · [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) · [key rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant)

Official: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). No `updateauth` broadcast.

MIT — Pixel Journey
