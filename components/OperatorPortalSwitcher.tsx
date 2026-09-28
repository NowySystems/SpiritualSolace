"use client";

import { useEffect, useState } from "react";

type PortalTarget = "requester" | "facility" | "partner" | "admin";

type OperatorContext = {
  ok?: boolean;
  isOperator?: boolean;
  email?: string | null;
  allowedTargets?: PortalTarget[];
};

const labels: Record<PortalTarget, string> = {
  requester: "Requester",
  facility: "Grandview",
  partner: "Hope Church",
  admin: "Admin"
};

export function OperatorPortalSwitcher({ currentPortal }: { currentPortal: PortalTarget }) {
  const [isOperator, setIsOperator] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [allowedTargets, setAllowedTargets] = useState<PortalTarget[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const response = await fetch("/api/operator-portal", { cache: "no-store" }).catch(() => null);
      if (!mounted || !response) return;
      const body = await response.json().catch(() => null) as OperatorContext | null;
      const allowed = Array.isArray(body?.allowedTargets) ? body.allowedTargets.filter((value): value is PortalTarget => value === "requester" || value === "facility" || value === "partner" || value === "admin") : [];
      setIsOperator(Boolean(response.ok && body?.ok && body?.isOperator));
      setAllowedTargets(allowed);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isOperator) return null;

  async function switchPortal(target: PortalTarget) {
    if (target === currentPortal || isSwitching) return;

    setIsSwitching(true);
    const response = await fetch("/api/operator-portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok || typeof body.destination !== "string") {
      setIsSwitching(false);
      return;
    }

    window.location.assign(body.destination);
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#d9ded8] bg-[#f7faf7] px-2 py-1.5">
      <span className="hidden text-[10px] font-black uppercase tracking-[0.12em] text-[#73817e] xl:inline">View as</span>
      <select
        value={currentPortal}
        disabled={isSwitching}
        onChange={(event) => void switchPortal(event.target.value as PortalTarget)}
        aria-label="Switch ChurchWork portal"
        className="min-w-[7.5rem] bg-transparent py-1 text-xs font-extrabold text-[#164f3e] outline-none disabled:opacity-60"
      >
        {(Object.keys(labels) as PortalTarget[]).filter((target) => allowedTargets.includes(target)).map((target) => (
          <option key={target} value={target}>{labels[target]}</option>
        ))}
      </select>
    </div>
  );
}
