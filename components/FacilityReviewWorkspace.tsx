"use client";

import { useCallback, useEffect, useState } from "react";\nimport { NetworkOnboarding } from "@/components/NetworkOnboarding";

type PilotRequest = {
  id: string; requester_email: string | null; support_options: string[]; safe_context_note: string;
  status: string; facility_approved_at: string | null; partner_assigned_at: string | null;
  partner_outcome: string | null; requester_update: string | null; created_at: string; updated_at: string;
};

function prettyStatus(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, l => l.toUpperCase()); }
function when(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
function apiMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") return body.message;
  return fallback;
}

export function FacilityReviewWorkspace() {
  const [requests, setRequests] = useState<PilotRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading your facility review queue...");
  const [busy, setBusy] = useState(false);\n  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const loadQueue = useCallback(async () => {
    const response = await fetch("/api/facility-requests", { cache: "no-store" });
    if (response.status === 401) { window.location.assign("/facility-login"); return; }
    const body = await response.json().catch(() => null);\n    if (response.status === 403 && body?.code === "onboarding-required") { setNeedsOnboarding(true); setMessage(""); return; }
    if (!response.ok || !Array.isArray(body)) { setMessage(apiMessage(body, "Unable to load the facility queue.")); return; }
    const rows = body as PilotRequest[];
    setRequests(rows);
    setSelectedId(current => current && rows.some(row => row.id === current) ? current : rows[0]?.id ?? null);
    setMessage(rows.length ? "" : "No requests are currently visible to this facility account.");
  }, []);

  useEffect(() => { void loadQueue(); }, [loadQueue]);

  const selected = requests.find(request => request.id === selectedId) ?? null;
  const reviewCount = requests.filter(request => request.status === "facility_review").length;

  async function advance(action: "approve" | "release_update") {
    if (!selected) return;
    setBusy(true); setMessage("Saving facility action...");
    const response = await fetch("/api/facility-requests", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: selected.id, action })
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) { setMessage(apiMessage(body, "Facility action did not complete.")); setBusy(false); return; }
    setMessage("Facility action saved."); await loadQueue(); setBusy(false);
  }

  async function signOut() {
    await fetch("/api/facility-requests", { method: "DELETE" });
    window.location.assign("/facility-login");
  }

  if (needsOnboarding) return <main className="min-h-screen bg-[#edf4f0] p-6"><div className="mx-auto max-w-3xl"><NetworkOnboarding role="facility" /></div></main>;\n\n  return <main className="min-h-screen bg-[#edf4f0] px-5 py-6 text-[#0d2b3b] md:px-8">
    <div className="mx-auto max-w-[92rem]">
      <header className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-[#d9dfd7] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#19726c]">ChurchWork · Facility portal</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.05em]">Facility review queue</h1>
          <p className="mt-2 text-sm font-semibold text-[#4f6259]">{reviewCount} request{reviewCount === 1 ? "" : "s"} awaiting facility review.</p></div>
        <button type="button" onClick={signOut} className="rounded-xl border border-[#d9dfd7] px-4 py-3 text-sm font-black">Sign out</button>
      </header>
      {message ? <p className="mb-5 rounded-xl border border-[#d9dfd7] bg-white p-4 text-sm font-semibold">{message}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-4 shadow-sm">
          <p className="px-2 pb-3 text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Requests</p>
          <div className="space-y-2">{requests.map(request =>
            <button key={request.id} type="button" onClick={() => setSelectedId(request.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${selectedId === request.id ? "border-[#19726c] bg-[#e4f3f1]" : "border-[#d9dfd7] bg-[#f8fbf8] hover:bg-white"}`}>
              <div className="flex items-center justify-between gap-3"><span className="text-sm font-black">{request.support_options.join(", ") || "Spiritual-care request"}</span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase">{prettyStatus(request.status)}</span></div>
              <p className="mt-2 text-xs font-semibold text-[#63736b]">{when(request.created_at)}</p>
            </button>)}</div>
        </aside>
        <section className="rounded-[1.75rem] border border-[#d9dfd7] bg-white p-6 shadow-sm md:p-8">
          {selected ? <>
            <div className="flex flex-col gap-4 border-b border-[#d9dfd7] pb-6 md:flex-row md:items-start md:justify-between">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Request snapshot</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold">{selected.support_options.join(", ") || "Spiritual-care request"}</h2>
                <p className="mt-2 text-sm font-semibold text-[#63736b]">Submitted {when(selected.created_at)}</p></div>
              <span className="self-start rounded-full bg-[#fff4d7] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#7a5b20]">{prettyStatus(selected.status)}</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-[#f8fbf8] p-4"><p className="text-xs font-black uppercase text-[#506a49]">Requester</p><p className="mt-2 text-sm font-bold">{selected.requester_email ?? "Authenticated requester"}</p></div>
              <div className="rounded-xl bg-[#f8fbf8] p-4"><p className="text-xs font-black uppercase text-[#506a49]">Facility approval</p><p className="mt-2 text-sm font-bold">{when(selected.facility_approved_at)}</p></div>
              <div className="rounded-xl bg-[#f8fbf8] p-4"><p className="text-xs font-black uppercase text-[#506a49]">Partner outcome</p><p className="mt-2 text-sm font-bold">{selected.partner_outcome ? prettyStatus(selected.partner_outcome) : "Not yet"}</p></div>
            </div>
            <div className="mt-6 rounded-[1.35rem] border border-[#d9dfd7] bg-[#f8fbf8] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Safe context</p><p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">{selected.safe_context_note || "No additional context was provided."}</p></div>
            {selected.status === "facility_review" ? <div className="mt-6"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Facility action</p>
              <button disabled={busy} type="button" onClick={() => advance("approve")} className="mt-3 rounded-xl bg-[#0f3f35] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Approve for partner</button>
              <p className="mt-3 text-xs font-semibold leading-5 text-[#63736b]">Only approved, non-medical spiritual-care context is released beyond facility review.</p></div> : null}
            {selected.status === "partner_outcome_logged" ? <div className="mt-6"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Requester update</p>
              <button disabled={busy} type="button" onClick={() => advance("release_update")} className="mt-3 rounded-xl bg-[#0f3f35] px-5 py-3 text-sm font-black text-white disabled:opacity-50">Release safe update to requester</button></div> : null}
            {!["facility_review","partner_outcome_logged"].includes(selected.status) ? <p className="mt-6 rounded-xl bg-[#e7f1eb] p-4 text-sm font-bold text-[#0f6b54]">No facility action is required at this stage.</p> : null}
          </> : <p className="text-sm font-semibold text-[#63736b]">Select a request to review.</p>}
        </section>
      </div>
    </div>
  </main>;
}
