const KEY = "pxj-permission-auditor-batch-v1";

export function saveBatchText(text: string): { ok: true } | { ok: false; reason: string } {
  try {
    if (typeof localStorage === "undefined")
      return { ok: false, reason: "no localStorage" };
    localStorage.setItem(KEY, text);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "save failed",
    };
  }
}

export function loadBatchText(): { ok: true; value: string } | { ok: false } {
  try {
    if (typeof localStorage === "undefined") return { ok: false };
    const v = localStorage.getItem(KEY);
    if (v == null || !v.trim()) return { ok: false };
    return { ok: true, value: v };
  } catch {
    return { ok: false };
  }
}

export function clearBatchText(): void {
  try {
    localStorage?.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
