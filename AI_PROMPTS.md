# AI handoff — permission auditor

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [WAX permissions](https://docs.wax.io/build/core-concepts/permissions) | Official model |
| [RISK-SCORING.md](RISK-SCORING.md) | Bands and weights |
| [visualizer](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) | Tree view |
| [key rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant) | Safe sequence after findings |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Session / auth patterns |

## Non-negotiables

1. `alice@owner` includes `alice@active` → **critical** (must not control its own owner).
2. Foreign helper on owner is **not** the same critical.
3. Threshold > total weight → critical; single-key owner thr 1 → critical SPF.
4. Score: baseline 10 + 25/critical + 12/warn + 3/info, cap 100.
5. Bands: low 0–34 · moderate 35–54 · high 55–74 · critical ≥75.
6. Fixtures are arguments. **No** `updateauth` / broadcast.
7. Risk rules port across Antelope; live `get_account` shape is chain-local.

## Prompt seeds

- "Given AccountPermissions JSON, run auditAccountPermissions and list findings by severity."
- "Sketch mapping eosio get_account permissions[] into PermissionLevel keys/accounts/threshold."
- "Score a single-key owner threshold 1."
- "Hand critical findings to key-rotation add-then-remove sequence."

## Do not

- Broadcast updateauth from the auditor.
- Treat foreign owner helper as the same critical as self-active-on-owner.
- Paste private keys into fixtures or prompts.
