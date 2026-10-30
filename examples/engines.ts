/**
 * Pure permission risk rules — no account-name hard-codes (except comparing
 * this account's active on its own owner).
 */

import type {
  AccountPermissions,
  AuditFinding,
  PermissionAuditResult,
  PermissionLevel,
} from "./types";

function keyAccountWeight(p: PermissionLevel): number {
  const k = p.keys.reduce((s, x) => s + x.weight, 0);
  const a = p.accounts.reduce((s, x) => s + x.weight, 0);
  return k + a;
}

function waitWeight(p: PermissionLevel): number {
  return (p.waits ?? []).reduce((s, w) => s + w.weight, 0);
}

function totalWeight(p: PermissionLevel): number {
  return keyAccountWeight(p) + waitWeight(p);
}

function uniqueKeyCount(p: PermissionLevel): number {
  return new Set(p.keys.map((k) => k.publicKey)).size;
}

/** Parse "actor@permission" tags. */
function parseActorPerm(tag: string): { actor: string; permission: string } {
  const i = tag.lastIndexOf("@");
  if (i <= 0) return { actor: tag, permission: "" };
  return { actor: tag.slice(0, i), permission: tag.slice(i + 1) };
}

export function auditPermissionLevel(
  p: PermissionLevel,
  accountName?: string
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const immediate = keyAccountWeight(p);
  const waits = waitWeight(p);
  const weight = totalWeight(p);
  const keys = uniqueKeyCount(p);
  const accounts = p.accounts.length;

  if (weight < p.threshold) {
    findings.push({
      id: `${p.name}-unreachable`,
      severity: "critical",
      permission: p.name,
      message: `Threshold ${p.threshold} exceeds total weight ${weight} (keys/accounts + waits) — may be unsatisfiable.`,
      recommendation: "Lower threshold or add keys/accounts/waits with enough weight.",
    });
  } else if (immediate < p.threshold && waits > 0) {
    findings.push({
      id: `${p.name}-wait-gated`,
      severity: "info",
      permission: p.name,
      message: `Threshold ${p.threshold} needs wait weight (immediate ${immediate}, waits ${waits}).`,
      recommendation:
        "Confirm time-delay authorities are intentional for recovery or multi-sig.",
    });
  }

  if ((p.waits ?? []).some((w) => w.waitSec <= 0 || w.weight <= 0)) {
    findings.push({
      id: `${p.name}-odd-wait`,
      severity: "info",
      permission: p.name,
      message: "Wait entry with zero seconds or zero weight.",
      recommendation: "Clean up wait table entries.",
    });
  }

  if (p.threshold <= 1 && keys + accounts <= 1 && waits === 0) {
    findings.push({
      id: `${p.name}-spf`,
      severity: p.name === "owner" ? "critical" : "warn",
      permission: p.name,
      message: `Single point of failure on ${p.name} (threshold ${p.threshold}, one authority).`,
      recommendation:
        p.name === "owner"
          ? "Prefer multi-key or multi-account owner with threshold ≥ 2."
          : "Consider multi-sig or higher threshold for production accounts.",
    });
  }

  if (p.name === "owner" && p.threshold === 1 && keys === 1 && accounts === 0) {
    findings.push({
      id: "owner-single-key",
      severity: "critical",
      permission: "owner",
      message: "Owner is a single key with threshold 1.",
      recommendation:
        "Split owner across hardware / multi-sig before high value is held.",
    });
  }

  if (p.name === "owner") {
    for (const a of p.accounts) {
      const { actor, permission } = parseActorPerm(a.actorPermission);
      const isActive = /^active$/i.test(permission);
      if (!isActive) continue;

      // Only *this* account's active on its owner is the classic anti-pattern.
      if (accountName && actor === accountName) {
        findings.push({
          id: `owner-self-active-auth`,
          severity: "critical",
          permission: "owner",
          message: `Owner includes ${accountName}@active — this account's active must not control its own owner.`,
          recommendation:
            "Remove self@active from owner; use owner keys or external multi-party weights.",
        });
      } else if (!accountName) {
        // Without account context, flag any @active as warn (legacy callers).
        findings.push({
          id: `owner-active-auth-${a.actorPermission}`,
          severity: "warn",
          permission: "owner",
          message: `Owner includes ${a.actorPermission}. If this is *this* account@active, it is critical; foreign helpers are normal social recovery.`,
          recommendation:
            "Verify actor is not the audited account. Foreign @active weights are intentional multi-party design.",
        });
      } else {
        findings.push({
          id: `owner-foreign-active-${a.actorPermission}`,
          severity: "info",
          permission: "owner",
          message: `Owner includes foreign ${a.actorPermission} (social / multi-party weight).`,
          recommendation:
            "Document helpers offline (social-recovery blueprint). Ensure helper accounts are secure.",
        });
      }
    }
  }

  if (p.name === "active" && p.threshold === 1 && keys + accounts === 1) {
    findings.push({
      id: "active-single",
      severity: "warn",
      permission: "active",
      message: "Active is single-authority threshold 1 — routine compromise risk.",
      recommendation: "Use a hot key with limited funds or raise threshold.",
    });
  }

  if (p.name === "owner" && accounts >= 2 && p.threshold >= 2) {
    findings.push({
      id: "owner-multiparty",
      severity: "info",
      permission: "owner",
      message:
        "Owner uses multi-party account authorities — good structure if helpers are trusted.",
      recommendation:
        "Pair with offline runbooks (wax-social-recovery-and-key-backup-tools).",
    });
  } else if (p.name === "owner" && accounts > 0 && accounts < 2) {
    findings.push({
      id: "owner-account-auth",
      severity: "warn",
      permission: "owner",
      message:
        "Owner includes account-based authorities — review linked accounts carefully.",
      recommendation: "Ensure linked accounts are as secure as owner keys.",
    });
  }

  if (
    p.keys.some((k) => k.weight <= 0) ||
    p.accounts.some((a) => a.weight <= 0)
  ) {
    findings.push({
      id: `${p.name}-zero-weight`,
      severity: "info",
      permission: p.name,
      message: "Zero-weight authority entries present.",
      recommendation: "Remove dead weight entries to simplify the graph.",
    });
  }

  return findings;
}

export function auditAccountPermissions(
  input: AccountPermissions
): PermissionAuditResult {
  const findings: AuditFinding[] = [];

  if (input.permissions.length === 0) {
    findings.push({
      id: "empty",
      severity: "critical",
      message: "No permissions provided.",
      recommendation: "Load authority table from get_account before auditing.",
    });
  }

  const names = new Set(input.permissions.map((p) => p.name));
  if (!names.has("owner")) {
    findings.push({
      id: "missing-owner",
      severity: "critical",
      message: "Owner permission missing from input.",
      recommendation: "Include owner in the snapshot.",
    });
  }
  if (!names.has("active")) {
    findings.push({
      id: "missing-active",
      severity: "warn",
      message: "Active permission missing from input.",
      recommendation: "Include active for a complete audit.",
    });
  }

  for (const p of input.permissions) {
    findings.push(...auditPermissionLevel(p, input.account));
  }

  const active = input.permissions.find((p) => p.name === "active");
  if (active && active.parent && active.parent !== "owner") {
    findings.push({
      id: "active-parent",
      severity: "info",
      permission: "active",
      message: `Active parent is "${active.parent}" (often "owner" on stock accounts).`,
      recommendation: "Confirm intentional hierarchy.",
    });
  }

  let risk = 10;
  for (const f of findings) {
    if (f.severity === "critical") risk += 25;
    else if (f.severity === "warn") risk += 12;
    else risk += 3;
  }
  risk = Math.min(100, risk);

  const criticals = findings.filter((f) => f.severity === "critical").length;
  const summary =
    criticals > 0
      ? `${criticals} critical finding(s); address owner/threshold issues first.`
      : findings.length === 0
        ? "No rule findings on provided structure."
        : "Warnings/info only — review recommendations.";

  return {
    account: input.account,
    riskScore: risk,
    findings,
    summary,
  };
}

export function auditMany(
  accounts: AccountPermissions[]
): PermissionAuditResult[] {
  return accounts.map(auditAccountPermissions);
}

export function demoWeakOwner(): AccountPermissions {
  return {
    account: "demoweak",
    permissions: [
      {
        name: "owner",
        parent: "",
        threshold: 1,
        keys: [{ publicKey: "PUB_K1_weakowner", weight: 1 }],
        accounts: [],
      },
      {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ publicKey: "PUB_K1_weakactive", weight: 1 }],
        accounts: [],
      },
    ],
  };
}

export function demoStrongerOwner(): AccountPermissions {
  return {
    account: "demosafe",
    permissions: [
      {
        name: "owner",
        parent: "",
        threshold: 2,
        keys: [
          { publicKey: "PUB_K1_a", weight: 1 },
          { publicKey: "PUB_K1_b", weight: 1 },
          { publicKey: "PUB_K1_c", weight: 1 },
        ],
        accounts: [],
      },
      {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ publicKey: "PUB_K1_hot", weight: 1 }],
        accounts: [],
      },
    ],
  };
}

/** Same account's active on owner — critical anti-pattern. */
export function demoSelfActiveOnOwner(): AccountPermissions {
  return {
    account: "alice.wam",
    permissions: [
      {
        name: "owner",
        parent: "",
        threshold: 1,
        keys: [],
        accounts: [{ actorPermission: "alice.wam@active", weight: 1 }],
      },
      {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ publicKey: "PUB_K1_hot", weight: 1 }],
        accounts: [],
      },
    ],
  };
}

/** Foreign helpers on owner — social recovery style (not critical). */
export function demoSocialOwner(): AccountPermissions {
  return {
    account: "alice.wam",
    permissions: [
      {
        name: "owner",
        parent: "",
        threshold: 2,
        keys: [{ publicKey: "PUB_K1_self", weight: 1 }],
        accounts: [
          { actorPermission: "bob.wam@active", weight: 1 },
          { actorPermission: "carol.wam@active", weight: 1 },
        ],
      },
      {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ publicKey: "PUB_K1_hot", weight: 1 }],
        accounts: [],
      },
    ],
  };
}

/** @deprecated alias — foreign active is no longer auto-critical */
export function demoActiveControlsOwner(): AccountPermissions {
  return demoSelfActiveOnOwner();
}

/** Threshold only met with time-delay wait weight */
export function demoWaitGated(): AccountPermissions {
  return {
    account: "demowait",
    permissions: [
      {
        name: "owner",
        parent: "",
        threshold: 2,
        keys: [{ publicKey: "PUB_K1_a", weight: 1 }],
        accounts: [],
        waits: [{ waitSec: 86400, weight: 1 }],
      },
      {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ publicKey: "PUB_K1_hot", weight: 1 }],
        accounts: [],
      },
    ],
  };
}
