# Sources

| Source | Use |
| --- | --- |
| [WAX permissions](https://docs.wax.io/build/core-concepts/permissions) | Official model |
| [RISK-SCORING.md](RISK-SCORING.md) | Bands and weights |
| [SECURITY.md](SECURITY.md) | Host limits |
| [eosio.msig reference](https://github.com/AntelopeIO/reference-contracts/tree/main/contracts/eosio.msig) | Named proposals (related, not this batch engine) |

## Product facts locked by tests / docs

- `alice@owner` includes `alice@active` → **critical** (must not control its own owner).
- Foreign helper on owner is **not** the same critical.
- Threshold > total weight → critical; single-key owner thr 1 → critical SPF.
- Score: baseline 10 + 25/critical + 12/warn + 3/info, cap 100.
- Bands: low 0–34 · moderate 35–54 · high 55–74 · critical ≥75.
- Fixtures are arguments. **No** `updateauth` / broadcast.
