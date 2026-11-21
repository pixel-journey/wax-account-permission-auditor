# Security — permission structure score

This file scores a **snapshot you pass in**. It does not call `updateauth` and it does not read the chain.

Official model: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). Weights: [RISK-SCORING.md](RISK-SCORING.md).

## Closed in the course

| Pattern | Verdict |
| --- | --- |
| `alice@owner` includes `alice@active` | **critical** — active must not control owner |
| `alice@owner` includes `bob@active` | **info** (a foreign helper is not the same bug) |
| Threshold greater than total weight | **critical** |
| Single-key owner at threshold 1 | **critical** |
| Empty permission list | finding id `empty` |
| Wait that fills the threshold after a delay | **info**, not critical |

Score starts at **10**, then +25 critical, +12 warn, +3 info, cap **100**.

| Score | Label |
| --- | --- |
| 0–34 | low |
| 35–54 | moderate |
| 55–74 | high |
| ≥ 75 | critical |

One critical finding alone is **35 → moderate**. The finding is still critical. The badge only climbs as findings stack. Do not hide a lone critical because the label says moderate.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live account | Load `get_account` yourself; this score is not that read |
| linkauth | Action links are not in a permission tree alone — [LINKAUTH.md](LINKAUTH.md) |
| Key custody | Hardware vs hot key is invisible here |
| Broadcast | Any real change goes through WharfKit. This repo never sends `updateauth` |
| Private keys | Never paste a key into a fixture |

## Attack angles

1. Treating label `low` as "safe to leave the owner key on a server."  
2. Calling `bob@active` on owner the same bug as `alice@active` on owner.  
3. Ignoring a score of 35 because the badge is not `critical`.  
4. Using the string `eosio.msig` as proof a proposal executed.  
5. Shipping the score as a certification.

## Honesty limits

Fixtures are arguments. No wasm. No broadcast.

| Sibling | Distinction |
| --- | --- |
| [permission visualizer](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) | Editable tree |
| [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) | linkauth scope |
| [key rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant) | Add-first plan |
| [social recovery](https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools) | Helper design |

[docs.wax.io permissions](https://docs.wax.io/build/core-concepts/permissions) · [WharfKit](https://wharfkit.com/).
