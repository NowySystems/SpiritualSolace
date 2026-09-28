"use client";

import { useEffect, useMemo, useState } from "react";

type AccessApplication = {
  id: string;
  applicant_user_id: string;
  applicant_email: string;
  portal: "facility" | "partner";
  applicant_name: string;
  job_title: string | null;
  phone: string | null;
  existing_organization_id: string | null;
  existing_organization_name: string | null;
  organization_name: string;
  address_line_1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  website: string | null;
  relationship_note: string | null;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  approved_organization_id: string | null;
  approved_organization_name: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
};

type PartnerOption = {
  organization_id: string;
  organization_name: string;
  partner_id: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function locationLine(application: AccessApplication) {
  return [application.address_line_1, application.city, application.state, application.postal_code].filter(Boolean).join(", ");
}

export function PilotAccessApplications() {
  const [applications, setApplications] = useState<AccessApplication[]>([]);
  const [partners, setPartners] = useState<PartnerOption[]>([]);
  const [partnerChoice, setPartnerChoice] = useState<Record<string, string>>({});
  const [pilotAdminChoice, setPilotAdminChoice] = useState<Record<string, boolean>>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [message, setMessage] = useState("Loading pilot access requests...");
  const [emailAlertsConfigured, setEmailAlertsConfigured] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/operator-access-applications", { cache: "no-store" }).catch(() => null);
    const body = await response?.json().catch(() => null);

    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not load pilot access requests.");
      return;
    }

    setApplications(Array.isArray(body.applications) ? body.applications as AccessApplication[] : []);
    setPartners(Array.isArray(body.partners) ? body.partners as PartnerOption[] : []);
    setEmailAlertsConfigured(body.emailAlertsConfigured === true);
    setMessage("Access requests are reviewed by the ChurchWork platform owner.");
  }

  useEffect(() => { void load(); }, []);

  const pending = useMemo(() => applications.filter((item) => item.status === "pending"), [applications]);
  const history = useMemo(() => applications.filter((item) => item.status !== "pending").slice(0, 12), [applications]);

  async function approve(application: AccessApplication) {
    setIsBusy(true);
    setMessage(`Approving ${application.applicant_email}...`);

    const response = await fetch("/api/operator-access-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: application.id,
        action: "approve",
        applicantEmail: application.applicant_email,
        pilotAdmin: pilotAdminChoice[application.id] === true,
        partnerOrganizationId: application.portal === "facility"
          ? partnerChoice[application.id] || null
          : null
      })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not approve this access request.");
      setIsBusy(false);
      return;
    }

    setMessage(
      body.approvalEmailSent
        ? "Pilot access approved and the applicant was emailed."
        : "Pilot access approved. Transactional email is not configured or the approval email could not be delivered."
    );
    setIsBusy(false);
    await load();
  }

  async function reject(application: AccessApplication) {
    setIsBusy(true);
    const response = await fetch("/api/operator-access-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: application.id,
        action: "reject",
        reviewNote: rejectNote
      })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);
    setMessage(response?.ok && body?.ok ? "Pilot access request rejected." : body?.message ?? "ChurchWork could not reject this request.");
    setIsBusy(false);
    setRejectingId(null);
    setRejectNote("");
    if (response?.ok && body?.ok) await load();
  }

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-[#d8d2c8] bg-[#fffdf9] shadow-[0_16px_44px_rgba(18,48,68,.06)]">
      <div className="flex flex-col gap-4 border-b border-[#ebe6dc] bg-gradient-to-r from-[#edf4fa] via-[#fffdf9] to-[#f4edda] px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#526f83]">Access Requests</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#183f35]">Approve new pilot organizations</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#69787b]">The first approved person becomes that organization's admin. After approval, they manage their own team inside ChurchWork.</p>
        </div>
        <span className="inline-flex rounded-full bg-white px-3 py-2 text-xs font-black text-[#456274] shadow-sm">{pending.length} pending</span>
      </div>

      {!emailAlertsConfigured ? (
        <div className="border-b border-[#ead7a9] bg-[#fff8e7] px-6 py-4">
          <p className="text-xs font-black text-[#715622]">Admin email alerts are not configured on this deployment.</p>
          <p className="mt-1 text-[11px] font-semibold leading-5 text-[#7e6a40]">The approval queue still works, but rollout should wait until transactional email is configured so every new organization request generates the required email alert.</p>
        </div>
      ) : (
        <div className="border-b border-[#cfe0d6] bg-[#eff8f2] px-6 py-3 text-xs font-black text-[#3b6a50]">✓ New access requests will also email the ChurchWork platform admin.</div>
      )}

      <div className="p-6">
        {pending.length ? (
          <div className="space-y-4">
            {pending.map((application) => {
              const existing = Boolean(application.existing_organization_id);
              const routeSelected = Boolean(partnerChoice[application.id]);
              return (
                <article key={application.id} className="overflow-hidden rounded-2xl border border-[#ded9cf] bg-white shadow-sm">
                  <div className="grid gap-5 p-5 lg:grid-cols-[1.15fr_.85fr]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${application.portal === "facility" ? "bg-[#eaf2f8] text-[#416f96]" : "bg-[#f4edda] text-[#77632e]"}`}>
                          {application.portal === "facility" ? "Facility" : "Care Partner"}
                        </span>
                        <span className="rounded-full bg-[#fff0dc] px-3 py-1 text-[10px] font-black text-[#85561a]">Pending approval</span>
                        {existing ? <span className="rounded-full bg-[#edf5ef] px-3 py-1 text-[10px] font-black text-[#3e6c50]">Existing organization</span> : <span className="rounded-full bg-[#f2eff5] px-3 py-1 text-[10px] font-black text-[#665378]">New organization</span>}
                      </div>

                      <h3 className="mt-4 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#183f35]">{application.existing_organization_name || application.organization_name}</h3>
                      <p className="mt-2 text-sm font-black text-[#38575d]">{application.applicant_name}{application.job_title ? ` · ${application.job_title}` : ""}</p>
                      <p className="mt-1 text-xs font-semibold text-[#74817e]">{application.applicant_email}{application.phone ? ` · ${application.phone}` : ""}</p>

                      {!existing && locationLine(application) ? <p className="mt-4 text-xs font-semibold leading-5 text-[#657673]">{locationLine(application)}</p> : null}
                      {application.website ? <p className="mt-2 break-all text-xs font-bold text-[#4e7080]">{application.website}</p> : null}
                      {application.relationship_note ? (
                        <div className="mt-4 rounded-xl bg-[#f7f4ee] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#87918e]">Program / relationship note</p>
                          <p className="mt-2 text-xs font-semibold leading-5 text-[#647470]">{application.relationship_note}</p>
                        </div>
                      ) : null}
                      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#929a97]">Submitted {formatDate(application.created_at)}</p>
                    </div>

                    <div className="rounded-2xl border border-[#e3ded5] bg-[#faf8f3] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#788480]">Approval setup</p>

                      {application.portal === "facility" ? (
                        <label className="mt-4 block text-xs font-black text-[#35534c]">
                          Care-partner route
                          <select
                            value={partnerChoice[application.id] ?? ""}
                            onChange={(event) => setPartnerChoice((current) => ({ ...current, [application.id]: event.target.value }))}
                            className="mt-2 w-full rounded-xl border border-[#d8d3c9] bg-white px-3 py-3 text-sm font-bold"
                          >
                            <option value="">No route yet</option>
                            {partners.map((partner) => <option key={partner.organization_id} value={partner.organization_id}>{partner.organization_name}</option>)}
                          </select>
                          <span className="mt-2 block text-[11px] font-semibold leading-5 text-[#78837f]">{routeSelected ? "Requester submissions will be able to route through this care partner." : "The facility can be approved without a route, but its requester accounts cannot submit requests until a care partner is connected."}</span>
                        </label>
                      ) : null}

                      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[#d8cfe1] bg-[#f4f0f8] p-3">
                        <input
                          type="checkbox"
                          checked={pilotAdminChoice[application.id] === true}
                          onChange={(event) => setPilotAdminChoice((current) => ({ ...current, [application.id]: event.target.checked }))}
                          className="mt-1 h-4 w-4 accent-[#6f5c8c]"
                        />
                        <span>
                          <span className="block text-xs font-black text-[#4d3f68]">Pilot Admin dashboard</span>
                          <span className="mt-1 block text-[10px] font-semibold leading-4 text-[#72697b]">Adds cross-pilot operations/impact visibility without user-role or owner controls.</span>
                        </span>
                      </label>

                      <button type="button" disabled={isBusy} onClick={() => void approve(application)} className="mt-4 w-full rounded-xl bg-[#315f49] px-4 py-3 text-sm font-black text-white shadow-md disabled:opacity-50">Approve organization & admin</button>

                      {rejectingId === application.id ? (
                        <div className="mt-3 rounded-xl border border-[#e4c3bb] bg-[#fff4f1] p-3">
                          <textarea value={rejectNote} onChange={(event) => setRejectNote(event.target.value)} rows={2} placeholder="Optional reason / what they should correct" className="w-full resize-none rounded-lg border border-[#dfc8c1] bg-white p-3 text-xs outline-none" />
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => { setRejectingId(null); setRejectNote(""); }} className="rounded-lg border border-[#d8d1c8] bg-white px-3 py-2 text-xs font-black text-[#65716f]">Cancel</button>
                            <button type="button" disabled={isBusy} onClick={() => void reject(application)} className="rounded-lg bg-[#9b5f54] px-3 py-2 text-xs font-black text-white disabled:opacity-50">Reject</button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" disabled={isBusy} onClick={() => setRejectingId(application.id)} className="mt-2 w-full rounded-xl border border-[#dfc8c2] bg-white px-4 py-2.5 text-xs font-black text-[#955b51] disabled:opacity-50">Reject / request correction</button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8d2c8] bg-[#faf8f3] p-8 text-center">
            <p className="font-serif text-2xl font-semibold tracking-[-0.035em] text-[#183f35]">No pilot access requests waiting.</p>
            <p className="mt-2 text-sm font-semibold text-[#77837f]">New facility and care-partner applications will appear here automatically.</p>
          </div>
        )}

        {history.length ? (
          <div className="mt-7 border-t border-[#ebe6dc] pt-6">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7b8683]">Recent decisions</p>
            <div className="mt-3 grid gap-2 lg:grid-cols-2">
              {history.map((application) => (
                <div key={application.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f4ee] p-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-[#36534c]">{application.organization_name}</p>
                    <p className="mt-1 truncate text-[10px] font-semibold text-[#7c8784]">{application.applicant_email}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${application.status === "approved" ? "bg-[#e7f1eb] text-[#35684e]" : "bg-[#fff0ee] text-[#96584e]"}`}>{application.status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="mt-5 text-xs font-semibold leading-5 text-[#6e7b78]">{message}</p>
      </div>
    </section>
  );
}
