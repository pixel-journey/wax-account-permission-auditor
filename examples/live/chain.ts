/**
 * Live chain RPC adapter — network only.
 * Pure audit stays in examples/engines.ts.
 */

import type { AccountPermissions, PermissionLevel } from "../types";

export const DEFAULT_RPC = "https://wax.greymass.com";

interface ChainKeyWeight {
  key: string;
  weight: number;
}

interface ChainAccountWeight {
  permission: { actor: string; permission: string };
  weight: number;
}

interface ChainPermission {
  perm_name: string;
  parent: string;
  required_auth: {
    threshold: number;
    keys: ChainKeyWeight[];
    accounts: ChainAccountWeight[];
    waits?: { wait_sec: number; weight: number }[];
  };
}

interface GetAccountResponse {
  account_name: string;
  permissions: ChainPermission[];
}

export function mapChainPermissions(
  data: GetAccountResponse
): AccountPermissions {
  const permissions: PermissionLevel[] = (data.permissions || []).map((p) => ({
    name: p.perm_name,
    parent: p.parent || null,
    threshold: p.required_auth?.threshold ?? 1,
    keys: (p.required_auth?.keys || []).map((k) => ({
      publicKey: k.key,
      weight: k.weight,
    })),
    accounts: (p.required_auth?.accounts || []).map((a) => ({
      actorPermission: `${a.permission.actor}@${a.permission.permission}`,
      weight: a.weight,
    })),
  }));

  return {
    account: data.account_name,
    permissions,
  };
}

export async function fetchAccountPermissions(
  account: string,
  options: {
    rpcBase?: string;
    signal?: AbortSignal;
  } = {}
): Promise<{ permissions: AccountPermissions; source: string }> {
  const base = (options.rpcBase || DEFAULT_RPC).replace(/\/$/, "");
  const name = account.trim().toLowerCase();
  if (!name) throw new Error("Account required");

  const url = `${base}/v1/chain/get_account`;
  const res = await fetch(url, {
    method: "POST",
    signal: options.signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account_name: name }),
  });
  if (!res.ok) {
    throw new Error(`RPC ${res.status}: ${res.statusText}`);
  }
  const data = (await res.json()) as GetAccountResponse;
  if (!data.account_name) {
    throw new Error("Unexpected get_account response");
  }
  return {
    permissions: mapChainPermissions(data),
    source: url,
  };
}

/** Soft-fail wrapper — never throws. */
export async function fetchAccountPermissionsSafe(
  account: string,
  options: { rpcBase?: string; signal?: AbortSignal } = {}
): Promise<
  | { ok: true; permissions: AccountPermissions; source: string }
  | { ok: false; reason: string }
> {
  try {
    const r = await fetchAccountPermissions(account, options);
    return { ok: true, ...r };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "fetch failed",
    };
  }
}
