"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type RoleKey = "requester" | "facility" | "partner";
type SupportOption = "Prayer" | "Friendly visit" | "Encouragement" | "Pastoral call";
type PartnerOutcome = "prayer_logged" | "visit_planned" | "visit_completed" | "follow_up_requested";

type StoredPilotRequest = {
  id: string;
  support: SupportOption[];
  safe_note: string;
  status: string;
  raw_status?: string;
  facility_review_status: string;
  partner_assignment_status: string;
  requester_update_status: string;
  partner_outcome?: string | null;
  requester_update?: string | null;
  created_at: string;
  updated_at: string;
};

type PilotWorkspaceProps = {
  role: RoleKey;
};

const supportOptions: SupportOption[] = ["Prayer", "Friendly visit", "Encouragement", "Pastoral call"];
const blockedTerms = ["diagnosis", "medication", "medicine", "treatment", "symptom", "insurance", "emergency", "doctor", "nurse", "pain", "clinical", "chart", "record"];
const partnerOutcomes: Array<{ value: PartnerOutcome; label: string; detail: string }> = [
  { value: "prayer_logged", label: "Prayer logged", detail: "Prayer was provided or recorded for this request." },
  { value: "visit_planned", label: "Visit planned", detail: "A spiritual-care visit has been planned." },
  { value: "visit_completed", label: "Visit completed", detail: "A spiritual-care visit has been completed." },
  { value: "follow_up_requested", label: "Follow-up requested", detail: "Additional spiritual-care follow-up is requested." }
];

const roleLabels: Record<RoleKey, string> = {
  requester: "Requester",
  facility: "Facility reviewer",
  partner: "Care partner"
};

const roleEndpoints: Record<RoleKey, string> = {
  requester: "/api/pilot-requests",
  facility: "/api/pilot-facility-requests",
  partner: "/api/pilot-partner-requests"
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5", className)}>{children}</section>;
}

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return <p className={cx("text-xs font-black uppercase tracking-[0.18em]", light ? "text-[#c7e2d0]" : "text-[#506a49]")}>{children}</p>;
}

function stageLabel(value: string) {
  if (value === "facility_review") return "Facility review";
  if (value === "approved_for_partner" || value === "partner_assignment") return "Partner assignment";
  if (value === "partner_outcome_logged") return "Partner outcome logged";
  if (value === "requester_updated" || value === "care_complete") return "Requester updated";
  if (value === "closed") return "Closed";
  return "Draft";
}

function outcomeLabel(value: string | null | undefined) {
  return partnerOutcomes.find((outcome) => outcome.value === value)?.label ?? "Pending";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved request";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function statusSummary(request: StoredPilotRequest | null, role: RoleKey) {
  if (!request) return role === "requester" ? "No request submitted" : "Queue clear";
  if (request.requester_update_status === "released") return "Update released";
  if (request.partner_assignment_status === "reported") return "Care partner reported";
  if (request.partner_assignment_status === "assigned") return "Assigned to care partner";
  if (request.facility_review_status === "approved") return "Approved for partner";
  return stageLabel(request.raw_status ?? request.status);
}

async function signOut() {
  await fetch("/api/role-sign-out", { method: "POST" }).catch(() => null);
  window.location.href = "/";
}

export function PilotWorkspace({ role }: PilotWorkspaceProps) {
  const [support, setSupport] = useState<SupportOption[]>([]);
  const [note, setNote] = useState("");
  const [requests, setRequests] = useState<StoredPilotRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading pilot workspace...");

  const blockedMatches = useMemo(() => {
    const lower = note.toLowerCase();
    return blockedTerms.filter((term) => lower.includes(term));
  }, [note]);

  const latestRequest = requests[0] ?? null;
  const canSubmit = support.length > 0 && note.trim().length > 0 && blockedMatches.length === 0 && !isSaving;

  async function loadRequests() {
    setIsLoading(true);
    const response = await fetch(roleEndpoints[role], { cache: "no-store" }).catch(() => null);

    if (!response) {
      setMessage("Pilot request service is unreachable.");
      setIsLoading(false);
      return;
    }

    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Pilot request data is not available yet.");
      setIsLoading(false);
      return;
    }

    const nextRequests = Array.isArray(body.requests) ? body.requests as StoredPilotRequest[] : [];
    setRequests(nextRequests);
    setMessage(nextRequests.length ? "Live pilot records loaded." : role === "requester" ? "No saved requests yet." : "No requests need action right now.");
    setIsLoading(false);
  }

  useEffect(() => {
    void loadRequests();
    // Role changes replace the entire workspace and should reload its scoped queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  function toggleSupport(option: SupportOption) {
    setSupport((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  }

  function replaceRequest(nextRequest: StoredPilotRequest) {
    setRequests((current) => current.map((item) => item.id === nextRequest.id ? nextRequest : item));
  }

  async function submitRequest() {
    if (!canSubmit) return;
    setIsSaving(true);
    setMessage("Saving request for Grandview review...");

    const response = await fetch("/api/pilot-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ support, safeNote: note })
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
    setMessage("Request saved and sent to Grandview for review.");
    setIsSaving(false);
  }

  async function facilityAction(requestId: string, action: "approve" | "release_update") {
    setActiveRequestId(requestId);
    setMessage(action === "approve" ? "Approving request for Hope Church..." : "Releasing safe update to requester...");

    const response = await fetch("/api/pilot-facility-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);

    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Facility action could not be completed.");
      setActiveRequestId(null);
      return;
    }

    if (body.request) replaceRequest(body.request as StoredPilotRequest);
    setMessage(typeof body.message === "string" ? body.message : "Facility action completed.");
    setActiveRequestId(null);
  }

  async function partnerAction(requestId: string, outcome: PartnerOutcome) {
    setActiveRequestId(requestId);
    setMessage("Saving structured Hope Church outcome...");

    const response = await fetch("/api/pilot-partner-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, outcome })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);

    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Partner outcome could not be saved.");
      setActiveRequestId(null);
      return;
    }

    if (body.request) replaceRequest(body.request as StoredPilotRequest);
    setMessage(typeof body.message === "string" ? body.message : "Partner outcome saved for Grandview review.");
    setActiveRequestId(null);
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
            <button type="button" onClick={() => void loadRequests()} disabled={isLoading} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white disabled:opacity-50">Refresh</button>
            <span className="rounded-full bg-[#e7f1eb] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54]">{roleLabels[role]}</span>
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
                  <Eyebrow light>Pilot request path</Eyebrow>
                  <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                    {role === "requester" ? "Submit and track a spiritual-care request." : role === "facility" ? "Grandview spiritual-care review." : "Hope Church approved assignments."}
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#d9e7df] md:text-base">
                    {role === "requester"
                      ? "Create a guided request and send it to Grandview review. Medical, emergency, insurance, chart, and treatment details stay out of this workflow."
                      : role === "facility"
                        ? "Grandview reviewers approve what may be shared with Hope Church and release completed safe updates back to requesters."
                        : "Hope Church receives only Grandview-approved spiritual-care context and records a structured, non-medical outcome."}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c7e2d0]">Current status</p>
                  <p className="mt-2 text-2xl font-black text-[#d6a943]">{statusSummary(latestRequest, role)}</p>
                </div>
              </div>
            </Card>

            {role === "requester" ? (
              <Card>
                <Eyebrow>Requester intake</Eyebrow>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">What kind of spiritual support would help?</h2>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Use a guided request path. Keep the request spiritual-care only.</p>

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
                        <span className="mt-1 block text-sm font-semibold text-[#4f6259]">Grandview-reviewed support category</span>
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
                    Ready for Grandview review.
                  </div>
                )}

                <button type="button" onClick={submitRequest} disabled={!canSubmit} className={cx("mt-6 rounded-xl px-5 py-4 text-sm font-black shadow-lg transition", canSubmit ? "bg-[#082838] text-white hover:bg-[#0f3f35]" : "bg-[#d9dfd7] text-[#6a746e]")}>{isSaving ? "Saving..." : "Submit for Grandview review"}</button>
              </Card>
            ) : null}

            {role === "facility" ? (
              <Card>
                <Eyebrow>Grandview facility review</Eyebrow>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Live review queue</h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#4f6259]">Approve requester-safe spiritual-care context for Hope Church. After Hope Church records an outcome, Grandview controls whether the standardized update is released to the requester.</p>

                <div className="mt-6 space-y-4">
                  {requests.length ? requests.map((request) => {
                    const rawStatus = request.raw_status ?? request.status;
                    const isBusy = activeRequestId === request.id;
                    const canApprove = rawStatus === "facility_review";
                    const canRelease = rawStatus === "partner_outcome_logged" && request.requester_update_status !== "released";

                    return (
                      <article key={request.id} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#506a49]">{formatDate(request.created_at)} · {stageLabel(rawStatus)}</p>
                            <h3 className="mt-2 text-xl font-black text-[#173b2d]">{request.support.join(" + ") || "Spiritual-care request"}</h3>
                            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#4f6259]">{request.safe_note || "No additional safe context."}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54] shadow-sm">{stageLabel(rawStatus)}</span>
                        </div>

                        {request.partner_outcome ? (
                          <div className="mt-4 rounded-xl border border-[#cfe4d5] bg-white p-4 text-sm font-bold text-[#173b2d]">
                            Hope Church outcome: {outcomeLabel(request.partner_outcome)}
                          </div>
                        ) : null}

                        {request.requester_update ? (
                          <div className="mt-3 rounded-xl border border-[#d9dfd7] bg-white p-4 text-sm font-semibold leading-6 text-[#4f6259]">
                            Requester-safe update: {request.requester_update}
                          </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-3">
                          {canApprove ? (
                            <button type="button" disabled={isBusy} onClick={() => void facilityAction(request.id, "approve")} className="rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-black text-white shadow-sm disabled:opacity-50">
                              {isBusy ? "Working..." : "Approve for Hope Church"}
                            </button>
                          ) : null}
                          {canRelease ? (
                            <button type="button" disabled={isBusy} onClick={() => void facilityAction(request.id, "release_update")} className="rounded-xl bg-[#d6a943] px-5 py-3 text-sm font-black text-[#082838] shadow-sm disabled:opacity-50">
                              {isBusy ? "Working..." : "Release update to requester"}
                            </button>
                          ) : null}
                          {!canApprove && !canRelease ? (
                            <span className="rounded-xl border border-[#d9dfd7] bg-white px-4 py-3 text-sm font-bold text-[#4f6259]">No facility action needed at this stage.</span>
                          ) : null}
                        </div>
                      </article>
                    );
                  }) : (
                    <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold text-[#4f6259]">No Grandview pilot requests need review right now.</div>
                  )}
                </div>
              </Card>
            ) : null}

            {role === "partner" ? (
              <Card>
                <Eyebrow>Hope Church care partner</Eyebrow>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Approved assignments</h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#4f6259]">Choose one structured spiritual-care outcome. ChurchWork sends the result back to Grandview for review before any requester update is released.</p>

                <div className="mt-6 space-y-4">
                  {requests.length ? requests.map((request) => {
                    const rawStatus = request.raw_status ?? request.status;
                    const isBusy = activeRequestId === request.id;
                    const canReport = rawStatus === "approved_for_partner";

                    return (
                      <article key={request.id} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#506a49]">{formatDate(request.created_at)} · Grandview approved</p>
                            <h3 className="mt-2 text-xl font-black text-[#173b2d]">{request.support.join(" + ") || "Spiritual-care assignment"}</h3>
                            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#4f6259]">{request.safe_note || "No additional safe context."}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54] shadow-sm">{outcomeLabel(request.partner_outcome)}</span>
                        </div>

                        {canReport ? (
                          <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {partnerOutcomes.map((outcome) => (
                              <button key={outcome.value} type="button" disabled={isBusy} onClick={() => void partnerAction(request.id, outcome.value)} className="rounded-2xl border border-[#d9dfd7] bg-white p-4 text-left transition hover:border-[#0f6b54] hover:bg-[#f1f8f3] disabled:opacity-50">
                                <span className="block text-sm font-black text-[#173b2d]">{outcome.label}</span>
                                <span className="mt-1 block text-xs font-semibold leading-5 text-[#4f6259]">{outcome.detail}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-5 rounded-xl border border-[#cfe4d5] bg-white p-4 text-sm font-bold text-[#173b2d]">
                            Outcome recorded: {outcomeLabel(request.partner_outcome)}. Grandview now controls requester release.
                          </div>
                        )}
                      </article>
                    );
                  }) : (
                    <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold text-[#4f6259]">No Grandview-approved assignments are waiting for Hope Church right now.</div>
                  )}
                </div>
              </Card>
            ) : null}
          </section>

          <aside className="space-y-5">
            <Card>
              <Eyebrow>Request record</Eyebrow>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Current request</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div><dt className="font-black text-[#4f6259]">Status</dt><dd className="mt-1 font-black">{latestRequest ? stageLabel(latestRequest.raw_status ?? latestRequest.status) : "No active record"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Support</dt><dd className="mt-1 font-black">{latestRequest?.support?.length ? latestRequest.support.join(" + ") : support.length ? support.join(" + ") : "Not selected"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Facility review</dt><dd className="mt-1 font-black">{latestRequest?.facility_review_status ?? "Pending"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Care partner outcome</dt><dd className="mt-1 font-black">{latestRequest?.partner_outcome ? outcomeLabel(latestRequest.partner_outcome) : latestRequest?.partner_assignment_status ?? "Pending"}</dd></div>
                <div><dt className="font-black text-[#4f6259]">Requester update</dt><dd className="mt-1 font-black">{latestRequest?.requester_update_status ?? "Pending"}</dd></div>
              </dl>

              {role === "requester" && latestRequest?.requester_update_status === "released" && latestRequest.requester_update ? (
                <div className="mt-6 rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-4 text-sm font-bold leading-6 text-[#173b2d]">
                  {latestRequest.requester_update}
                </div>
              ) : null}
            </Card>

            <Card>
              <Eyebrow>Activity</Eyebrow>
              <div className="mt-5 space-y-3">
                <p className="rounded-2xl bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#4f6259]">{isLoading ? "Loading live pilot records..." : message}</p>
                {requests.slice(0, 5).map((request) => (
                  <p key={request.id} className="rounded-2xl bg-[#f8fbf8] p-4 text-xs font-bold leading-5 text-[#4f6259]">
                    {formatDate(request.created_at)} · {stageLabel(request.raw_status ?? request.status)} · {request.support.join(" + ")}
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
