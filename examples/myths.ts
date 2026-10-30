export const AUDITOR_MYTHS = [
  {
    myth: "Any @active on owner means active controls owner",
    reality:
      "Only this account's own active on its owner is critical. Foreign bob@active weights are normal social recovery.",
  },
  {
    myth: "A low riskScore means the account is safe",
    reality:
      "Score is heuristic on structure only. Offline backups, helper trust, and linkauth scope are out of band.",
  },
  {
    myth: "get_account shows every linkauth",
    reality:
      "See LINKAUTH.md — full linked-action inventory needs other queries or chain plugins.",
  },
] as const;
