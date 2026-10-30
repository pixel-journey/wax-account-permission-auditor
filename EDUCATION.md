# Account permission auditor (batch)

## Role vs visualizer

| Tool | Strength |
|------|----------|
| **This repo** | Rule engine + batch scan many accounts |
| **permission-visualizer** | Interactive tree, baseline/diff, threshold sim |

Same critical rule (Pass 5):

- `alice@owner` includes **`alice@active`** → **critical**
- `alice@owner` includes **`bob@active`** → **info** (social recovery)

## Scoring

Baseline 10 + 25/critical + 12/warn + 3/info, capped at 100. Bands in RISK-SCORING.md.

## Non-goals

No live `updateauth`. Prefer WharfKit elsewhere. `get_account` does not fully expose all linkauth rows — see LINKAUTH.md.
