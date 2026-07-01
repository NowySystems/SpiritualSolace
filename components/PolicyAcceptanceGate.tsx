"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { requiredPilotPolicies } from "@/lib/pilotPolicies";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type PolicyAcceptanceGateProps = {
  session: Session;
  children: ReactNode;
};

type AcceptanceRow = {
  policy_key: string;
  version: string;
};

export function PolicyAcceptanceGate({ session, children }: PolicyAcceptanceGateProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [acceptedKeys, setAcceptedKeys] = useState<Set<string>>(new Set());
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState("Checking policy acknowledgments...");
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAcceptances() {
      setIsBusy(true);
      const { data, error } = await supabase
        .from("policy_acceptances")
        .select("policy_key, version")
        .eq("user_id", session.user.id)
        .eq("version", "pilot-safe-v1");

      if (!isMounted) return;

      if (error) {
        setStatus(error.message);
        setIsBusy(false);
        return;
      }

      const nextAccepted = new Set(
        (data as AcceptanceRow[] | null | undefined)?.map((row) => `${row.policy_key}:${row.version}`) ?? []
      );

      setAcceptedKeys(nextAccepted);
      setCheckedKeys(nextAccepted);
      setStatus("Review required pilot acknowledgments.");
      setIsBusy(false);
    }

    loadAcceptances();

    return () => {
      isMounted = false;
    };
  }, [session.user.id, supabase]);

  const missingPolicies = requiredPilotPolicies.filter(
    (policy) => !acceptedKeys.has(`${policy.key}:${policy.version}`)
  );

  const allRequiredChecked = requiredPilotPolicies.every((policy) =>
    checkedKeys.has(`${policy.key}:${policy.version}`)
  );

  function togglePolicy(policyKey: string, version: string) {
    const compositeKey = `${policyKey}:${version}`;
    const next = new Set(checkedKeys);

    if (next.has(compositeKey)) {
      next.delete(compositeKey);
    } else {
      next.add(compositeKey);
    }

    setCheckedKeys(next);
  }

  async function acceptMissingPolicies() {
    if (!allRequiredChecked || missingPolicies.length === 0) return;

    setIsBusy(true);
    setStatus("Saving acknowledgments...");

    const rows = missingPolicies.map((policy) => ({
      user_id: session.user.id,
      policy_key: policy.key,
      version: policy.version,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null
    }));

    const { error } = await supabase.from("policy_acceptances").insert(rows);

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      return;
    }

    const nextAccepted = new Set(acceptedKeys);
    rows.forEach((row) => nextAccepted.add(`${row.policy_key}:${row.version}`));
    setAcceptedKeys(nextAccepted);
    setStatus("Acknowledgments saved.");
    setIsBusy(false);
  }

  if (!isBusy && missingPolicies.length === 0) {
    return <>{children}</>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] border border-[#d8d0c0] bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Pilot acknowledgments</p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em]">Review before entering Pilot Safe v1.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4d5d55]">
          ChurchWork Pilot Safe v1 is for spiritual-care coordination only. These acknowledgments must be accepted before the live pilot workspace is shown.
        </p>

        <div className="mt-6 space-y-3">
          {requiredPilotPolicies.map((policy) => {
            const compositeKey = `${policy.key}:${policy.version}`;
            const alreadyAccepted = acceptedKeys.has(compositeKey);
            const checked = checkedKeys.has(compositeKey);

            return (
              <label key={compositeKey} className="flex gap-3 rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-4 text-sm leading-6">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={alreadyAccepted || isBusy}
                  onChange={() => togglePolicy(policy.key, policy.version)}
                  className="mt-1 h-5 w-5 rounded border-[#8aa363]"
                />
                <span>
                  <span className="block font-black text-[#173b2d]">
                    {policy.title} {alreadyAccepted ? "— accepted" : ""}
                  </span>
                  <span className="block text-[#4d5d55]">{policy.shortText}</span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
          ChurchWork is not for emergencies, medical records, diagnosis, symptoms, medication, treatment details, medical history, chart notes, clinical instructions, insurance information, or emergency information.
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={acceptMissingPolicies}
            disabled={isBusy || !allRequiredChecked || missingPolicies.length === 0}
            className="rounded-xl bg-[#173b2d] px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-[#102b3a] disabled:opacity-60"
          >
            {isBusy ? "Working..." : "Accept and continue"}
          </button>
          <p className="text-sm font-semibold text-[#4d5d55]">{status}</p>
        </div>
      </section>
    </main>
  );
}
