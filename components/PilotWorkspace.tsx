"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type SupportOption = "Prayer" | "Friendly visit" | "Encouragement" | "Pastoral call";

type StoredPilotRequest = {
  id: string;
  support: SupportOption[];
  safe_note: string;
  status: string;
  facility_review_status: string;
  partner_assignment_status: string;
  requester_update_status: string;
  created_at: string;
  updated_at: string;
};

type RequestChoice = { facility_id: string; facility_name: string; city?: string | null; state?: string | null; partners: Array<{ partner_id: string; partner_name: string }> };

const supportOptions: SupportOption[] = ["Prayer", "Friendly visit", "Encouragement", "Pastoral call"];
const blockedTerms = ["diagnosis", "medication", "medicine", "treatment", "symptom", "insurance", "emergency", "doctor", "nurse", "pain", "clinical", "chart", "record"];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5", className)}>{children}</section>;
}

function Eyebrow({ children }: { children: string }) {
  return <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">{children}</p>;
}

function stageLabel(value: string) {
  if (value === "facility_review") return "Facility review";
  if (value === "partner_assignment") return "Partner assignment";
  if (value === "care_complete") return "Care complete";
  if (value === "closed") return "Closed";
  return "Draft";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved request";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function statusSummary(request: StoredPilotRequest | null) {
  if (!request) return "No request submitted";
  if (request.requester_update_status === "released") return "Update released";
  if (request.partner_assignment_status === "reported") return "Care partner reported";
  if (request.partner_assignment_status === "assigned") return "Assigned to care partner";
  if (request.facility_review_status === "approved") return "Approved for partner";
  return stageLabel(request.status);
}

async function signOut() {
  await fetch("/api/role-sign-out", { method: "POST" }).catch(() => null);
  window.location.href = "/";
}

export function PilotWorkspace() {
  const [support, setSupport] = useState<SupportOption[]>([]);
  const [note, setNote] = useState("");
  const [requests, setRequests] = useState<StoredPilotRequest[]>([]);
  const [choices, setChoices] = useState<RequestChoice[]>([]);
  const [facilityId, setFacilityId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("Pilot workspace ready.");

  const blockedMatches = useMemo(() => {
    const lower = note.toLowerCase();
    return blockedTerms.filter((term) => lower.includes(term));
  }, [note]);

  const latestRequest = requests[0] ?? null;
  const selectedFacility = choices.find((item) => item.facility_id === facilityId);
  const canSubmit = Boolean(facilityId && partnerId) && support.length > 0 && note.trim().length > 0 && blockedMatches.length === 0 && !isSaving;

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      setIsLoading(true);
      const response = await fetch("/api/pilot-requests", { cache: "no-store" }).catch(() => null);

      if (!isMounted) return;

      if (!response) {
        setMessage("Pilot request service is unreachable.");
        setIsLoading(false);
        return;
      }

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.ok) {
        setMessage(typeof body?.message === "string" ? body.message : "Pilot request storage is not ready yet.");
        setIsLoading(false);
        return;
      }

      setRequests(Array.isArray(body.requests) ? body.requests : []);
      setChoices(Array.isArray(body.choices) ? body.choices : []);
      setMessage(body.requests?.length ? "Saved requests loaded." : "No saved requests yet.");
      setIsLoading(false);
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  function toggleSupport(option: SupportOption) {
    setSupport((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  }

  async function submitRequest() {
    if (!canSubmit) return;
    setIsSaving(true);
    setMessage("Saving request for facility review...");

    const response = await fetch("/api/pilot-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ support, safeNote: note, facilityId, partnerId })
    }).catch(() => null);

    if (!response) {
      setMessage("Pilot request service is unreachable.");
      setIsSaving(false);
      return;
    }

    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Request could not be saved yet.");
      setIsSaving(false);
      return;
    }

    if (body.request) {
      setRequests((current) => [body.request as StoredPilotRequest, ...current]);
    }

    setSupport([]);
    setNote("");
    setMessage("Request saved and sent to facility review.");
    setIsSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <header className="border-b border-white/10 bg-[#082838] text-white shadow-xl shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-5 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <a href="/" className="flex items-center gap-4" aria-label="ChurchWork public site">
            <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Church<span className="text-[#8dbd9e]">Work</span></span>
              <span className="block text-xs font-semibold text-[#d9e7df]">Pilot workspace</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e7f1eb] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54]">Requester</span>
            <button type="button" onClick={signOut} className="rounded-full bg-[#d6a943] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Sign out</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[118rem] px-4 py-5 md:px-8 md:py-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <section className="min-w-0 space-y-5">
            <Card className="bg-[#0f3f35] text-white">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Eyebrow>Pilot request path</Eyebrow>
                  <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                    "Submit and track a spiritual-care request."
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#d9e7df] md:text-base">
                    "Create a guided request and send it to facility review. Medical, emergency, insurance, chart, and treatment details stay out of this workflow."
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c7e2d0]">Current status</p>
                  <p className="mt-2 text-2xl font-black text-[#d6a943]">{statusSummary(latestRequest)}</p>
                </div>
              </div>
            </Card>

            <Card>
                <Eyebrow>Requester intake</Eyebrow>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">What kind of spiritual support would help?</h2>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Use a guided request path. Keep the request spiritual-care only.</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-black text-[#173b2d]">
                    Your facility
                    <select value={facilityId} onChange={(event) => { setFacilityId(event.target.value); setPartnerId(""); }} className="mt-2 w-full rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-3">
                      <option value="">Choose facility</option>
                      {choices.map((choice) => <option key={choice.facility_id} value={choice.facility_id}>{choice.facility_name}{choice.city ? ` · ${choice.city}${choice.state ? `, ${choice.state}` : ""}` : ""}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-black text-[#173b2d]">
                    Care partner
                    <select value={partnerId} disabled={!selectedFacility} onChange={(event) => setPartnerId(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-3 disabled:opacity-60">
                      <option value="">{selectedFacility ? "Choose available partner" : "Choose facility first"}</option>
                      {(selectedFacility?.partners ?? []).map((partner) => <option key={partner.partner_id} value={partner.partner_id}>{partner.partner_name}</option>)}
                    </select>
                  </label>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {supportOptions.map((option) => {
                    const active = support.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleSupport(option)}
                        className={cx("rounded-2xl border p-5 text-left transition", active ? "border-[#0f6b54] bg-[#e7f1eb] shadow-sm" : "border-[#d9dfd7] bg-[#f8fbf8] hover:bg-white")}
                      >
                        <span className={cx("flex h-9 w-9 items-center justify-center rounded-full text-sm font-black", active ? "bg-[#0f6b54] text-white" : "bg-white text-[#506a49]")}>{active ? "✓" : ""}</span>
                        <span className="mt-4 block text-lg font-black">{option}</span>
                        <span className="mt-1 block text-sm font-semibold text-[#4f6259]">Facility-reviewed support category</span>
                      </button>
                    );
                  })}
                </div>

                <label className="mt-6 block">
                  <Eyebrow>Safe context note</Eyebrow>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 text-base font-semibold leading-7 outline-[#0f6b54]"
                    placeholder="Example: They would appreciate prayer and a calm visit this week."
                  />
                </label>

                {blockedMatches.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-900">
                    Review needed: remove medical, emergency, insurance, chart, or treatment details before submitting.
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-4 text-sm font-bold leading-6 text-[#173b2d]">
                    Ready for facility review.
                  </div>
                )}

                <button type="button" onClick={submitRequest} disabled={!canSubmit} className={cx("mt-6 rounded-xl px-5 py-4 text-sm font-black shadow-lg transition", canSubmit ? "bg-[#082838] text-white hover:bg-[#0f3f35]" : "bg-[#d9dfd7] text-[#6a746e]")}>{isSaving ? "Saving..." : "Submit for facility review"}</button>
              </Card>
          </section>

          <aside className="space-y-5">
            <Card>
              <Eyebrow>Request record</Eyebrow>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Current request</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div><dt className="font-black text-[#4f6259]">Status</dt><dd className="mt-1 font-black">{latestRequest ? stageLabel(latestRequest.status) : "Not submitted"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Support</dt><dd className="mt-1 font-black">{latestRequest?.support?.length ? latestRequest.support.join(" + ") : support.length ? support.join(" + ") : "Not selected"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Facility review</dt><dd className="mt-1 font-black">{latestRequest?.facility_review_status ?? "Pending"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Care partner outcome</dt><dd className="mt-1 font-black">{latestRequest?.partner_assignment_status ?? "Pending"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Requester update</dt><dd className="mt-1 font-black">{latestRequest?.requester_update_status ?? "Pending"}</dd></div>
              </dl>
            </Card>

            <Card>
              <Eyebrow>Activity</Eyebrow>
              <div className="mt-5 space-y-3">
                <p className="rounded-2xl bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#4f6259]">{isLoading ? "Loading saved requests..." : message}</p>
                {requests.slice(0, 3).map((request) => (
                  <p key={request.id} className="rounded-2xl bg-[#f8fbf8] p-4 text-xs font-bold leading-5 text-[#4f6259]">
                    {formatDate(request.created_at)} · {stageLabel(request.status)} · {request.support.join(" + ")}
                  </p>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
