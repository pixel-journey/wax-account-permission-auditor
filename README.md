# wax-account-permission-auditor

Educational **rule audit** of Antelope / WAX permission structures.

Detects high-risk patterns such as `account@owner` including the same account's `@active` (self-control of owner), single-key owner thresholds, and empty permission trees. Scores are teaching signals only — never chain enforcement and never a broadcast path.

```bash
npm install && npm test && npm run dev
```

| Doc | Role |
| --- | --- |
| [EDUCATION.md](./EDUCATION.md) | Learning path + attack table |
| [RISK-SCORING.md](./RISK-SCORING.md) | Score bands and finding ids |
| [LINKAUTH.md](./LINKAUTH.md) | linkauth context |
| [POLICY.md](./POLICY.md) | Scope boundaries |
| [SECURITY.md](./SECURITY.md) | Threat model honesty |

Companions: [permission visualizer](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) · [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) · [key rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant) · [social recovery](https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools) · [msig simulator](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) · [hardware patterns](https://github.com/pixel-journey/wax-hardware-wallet-integration-patterns)

Official: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions).

**No** `updateauth` broadcast from this lab.

MIT — Pixel Journey
