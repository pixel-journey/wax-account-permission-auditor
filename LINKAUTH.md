# linkauth and this auditor

**Trust label:** educational-reference

`get_account` returns **permission hierarchy and authorities** (keys, accounts, waits). It does **not** fully enumerate every `linkauth` target (contract/action pairs bound to a permission).

## What this means

- A custom permission may look “safe” in this auditor while still being authorized for high-impact actions via `linkauth`.
- For limited dApp / session-key patterns, use:
  - [wax-wharfkit-session-keys-and-linked-permissions](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions)
  - [wax-permission-visualizer-and-editor](https://github.com/pixel-journey/wax-permission-visualizer-and-editor)

## Stack

Prefer **WharfKit** for any future `updateauth` / `linkauth` / `unlinkauth` flows. Do not start greenfield work on eosjs or standalone Anchor Link as the primary stack.
