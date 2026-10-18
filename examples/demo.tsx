"use client";

import { useMemo, useState } from "react";
import {
  auditAccountPermissions,
  demoStrongerOwner,
  demoWeakOwner,
} from "./engines";
import { AuditResultCard } from "./AuditPanels";

type Mode = "weak" | "strong";

export default function PermissionAuditorDemo() {
  const [mode, setMode] = useState<Mode>("weak");
  const result = useMemo(
    () =>
      auditAccountPermissions(
        mode === "weak" ? demoWeakOwner() : demoStrongerOwner()
      ),
    [mode]
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-400/80">
          Pixel Journey · Security
        </p>
        <h1 className="text-2xl font-bold text-white">Permission Auditor</h1>
        <p className="text-sm text-white/60 max-w-2xl">
          Pure rules over permission structure. Map get_account authorities into{" "}
          <code>AccountPermissions</code> — never hard-code findings by account name.
        </p>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-lg px-4 py-2 text-sm ${
            mode === "weak" ? "bg-amber-600" : "bg-white/10"
          }`}
          onClick={() => setMode("weak")}
        >
          Demo weak owner
        </button>
        <button
          type="button"
          className={`rounded-lg px-4 py-2 text-sm ${
            mode === "strong" ? "bg-emerald-600" : "bg-white/10"
          }`}
          onClick={() => setMode("strong")}
        >
          Demo multi-key owner
        </button>
      </div>

      <AuditResultCard result={result} />
    </div>
  );
}
