/**
 * Educational Antelope-style permission model for risk rules.
 * Production maps get_account authority rows into these shapes.
 */

export interface AuthKey {
  publicKey: string;
  weight: number;
}

export interface AuthAccount {
  /** e.g. "otheracc@active" */
  actorPermission: string;
  weight: number;
}

export interface PermissionLevel {
  name: string;
  parent: string | null;
  threshold: number;
  keys: AuthKey[];
  accounts: AuthAccount[];
}

export interface AccountPermissions {
  account: string;
  permissions: PermissionLevel[];
}

export type FindingSeverity = "info" | "warn" | "critical";

export interface AuditFinding {
  id: string;
  severity: FindingSeverity;
  permission?: string;
  message: string;
  recommendation: string;
}

export interface PermissionAuditResult {
  account: string;
  riskScore: number;
  findings: AuditFinding[];
  summary: string;
}
