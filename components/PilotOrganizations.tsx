"use client";

import { useEffect, useMemo, useState } from "react";

type PilotOrganization = {
  id: string;
  name: string;
  slug: string;
  organization_type: "facility" | "partner";
  status: string;
  team_members: number;
  requesters: number;
  admins: number;
  facility_id: string | null;
  partner_id: string | null;
  care_partner_name: string | null;
  route_ready: boolean | null;
  created_at: string;
};

export function PilotOrganizations() {
  const [organizations, setOrganizations] = useState<PilotOrganization[]>([]);
  const [message, setMessage] = useState("Loading pilot organizations...");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const response = await fetch("/api/operator-organizations", { cache: "no-store" }).catch(() => null);
      const body = await response?.json().catch(() => null);
      if (!mounted) return;

      if (!response || !response.ok || !body?.ok) {
        setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not load organizations.");
        return;
      }

      setOrganizations(Array.isArray(body.organizations) ? body.organizations as PilotOrganization[] : []);
      setMessage("");
    }
    void load();
    return () => { mounted = false; };
  }, []);

  const facilities = useMemo(() => organizations.filter((item) => item.organization_type === "facility"), [organizations]);
  const partners = useMemo(() => organizations.filter((item) => item.organization_type === "partner"), [organizations]);

  return (
    <div className="space-y-7">
      {message ? <div className="rounded-2xl border border-[#ded9cf] bg-white/70 p-5 text-sm font-semibold text-[#68787c]">{message}</div> : null}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#416f96]">Facilities</p>
            <h2 className="mt-1 text-xl font-black text-[#183f35]">Approved facility organizations</h2>
          </div>
          <span className="text-xs font-black text-[#71807d]">{facilities.length}</span>
        </div>

        {facilities.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {facilities.map((org) => (
              <article key={org.id} className="relative overflow-hidden rounded-[1.5rem] border border-[#d5e0e8] bg-gradient-to-br from-[#eaf2f8] to-[#fffdf9] p-6 shadow-[0_16px_44px_rgba(18,48,68,.06)]">
                <span className="absolute inset-y-0 left-0 w-2 bg-[#416f96]" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#416f96]">Facility</p>
                    <h3 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#183f35]">{org.name}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase text-[#4b697b] shadow-sm">{org.status}</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/85 p-3"><p className="text-xl font-black text-[#123044]">{org.admins}</p><p className="text-[10px] font-bold text-[#6f7c7f]">Admins</p></div>
                  <div className="rounded-xl bg-white/85 p-3"><p className="text-xl font-black text-[#123044]">{org.team_members}</p><p className="text-[10px] font-bold text-[#6f7c7f]">Team</p></div>
                  <div className="rounded-xl bg-white/85 p-3"><p className="text-xl font-black text-[#123044]">{org.requesters}</p><p className="text-[10px] font-bold text-[#6f7c7f]">Requesters</p></div>
                </div>
                <div className={`mt-4 rounded-xl p-4 ${org.route_ready ? "bg-[#edf6f1]" : "bg-[#fff4e7]"}`}>
                  <p className={`text-xs font-black ${org.route_ready ? "text-[#34654d]" : "text-[#8a642d]"}`}>{org.route_ready ? "Care-partner route active" : "Care-partner route not configured"}</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#687773]">{org.route_ready ? org.care_partner_name || "Approved care partner" : "Requester accounts cannot submit until a route is connected."}</p>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="rounded-2xl border border-dashed border-[#d8d2c8] p-6 text-sm font-semibold text-[#7a8784]">No approved facilities yet.</p>}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#87713a]">Care Partners</p>
            <h2 className="mt-1 text-xl font-black text-[#183f35]">Approved church & care-partner organizations</h2>
          </div>
          <span className="text-xs font-black text-[#71807d]">{partners.length}</span>
        </div>

        {partners.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {partners.map((org) => (
              <article key={org.id} className="relative overflow-hidden rounded-[1.5rem] border border-[#e2dac0] bg-gradient-to-br from-[#f4edda] to-[#fffdf9] p-6 shadow-[0_16px_44px_rgba(18,48,68,.06)]">
                <span className="absolute inset-y-0 left-0 w-2 bg-[#87713a]" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#87713a]">Care Partner</p>
                    <h3 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#183f35]">{org.name}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase text-[#66592f] shadow-sm">{org.status}</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/85 p-3"><p className="text-xl font-black text-[#123044]">{org.admins}</p><p className="text-[10px] font-bold text-[#6f7c7f]">Admins</p></div>
                  <div className="rounded-xl bg-white/85 p-3"><p className="text-xl font-black text-[#123044]">{org.team_members}</p><p className="text-[10px] font-bold text-[#6f7c7f]">Care team</p></div>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="rounded-2xl border border-dashed border-[#d8d2c8] p-6 text-sm font-semibold text-[#7a8784]">No approved care partners yet.</p>}
      </section>
    </div>
  );
}
