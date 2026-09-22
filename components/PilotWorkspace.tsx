"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChurchWorkAppShell, type ChurchWorkNavKey } from "@/components/ChurchWorkAppShell";

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

type PilotWorkspaceProps = { role: RoleKey };

const supportOptions: Array<{ value: SupportOption; title: string; detail: string; symbol: string }> = [
  { value: "Prayer", title: "Prayer", detail: "Prayer from an approved local care partner.", symbol: "🙏" },
  { value: "Friendly visit", title: "Friendly Visit", detail: "A spiritual-care visit from an approved church partner.", symbol: "♟" },
  { value: "Encouragement", title: "Encouragement", detail: "Words of support and spiritual encouragement.", symbol: "♡" },
  { value: "Pastoral call", title: "Pastoral Call", detail: "A phone call from a pastor or approved care partner.", symbol: "☎" }
];

const partnerOutcomes: Array<{ value: PartnerOutcome; label: string; detail: string }> = [
  { value: "prayer_logged", label: "Prayer logged", detail: "Prayer was provided for this request." },
  { value: "visit_planned", label: "Visit planned", detail: "A spiritual-care visit has been planned." },
  { value: "visit_completed", label: "Visit completed", detail: "The spiritual-care visit has been completed." },
  { value: "follow_up_requested", label: "Follow-up requested", detail: "Additional spiritual-care follow-up is needed." }
];

const roleEndpoints: Record<RoleKey, string> = {
  requester: "/api/pilot-requests",
  facility: "/api/pilot-facility-requests",
  partner: "/api/pilot-partner-requests"
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-2xl border border-[#ded9cf] bg-[#fffdf9] shadow-sm shadow-[#123044]/5", className)}>{children}</section>;
}

function formatDate(value: string, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved request";
  return date.toLocaleString([], withTime
    ? { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }
    : { month: "short", day: "numeric", year: "numeric" });
}

function shortId(id: string) {
  return `CW-${id.replaceAll("-", "").slice(0, 6).toUpperCase()}`;
}

function rawStatus(request: StoredPilotRequest) {
  return request.raw_status ?? request.status;
}

function statusLabel(status: string) {
  if (status === "facility_review") return "Needs Review";
  if (status === "approved_for_partner") return "With Care Partner";
  if (status === "partner_outcome_logged") return "Ready to Release";
  if (status === "requester_updated") return "Requester Updated";
  if (status === "closed") return "Closed";
  return "Submitted";
}

function outcomeLabel(value: string | null | undefined) {
  return partnerOutcomes.find((item) => item.value === value)?.label ?? "Pending";
}

function statusPill(status: string) {
  if (status === "facility_review") return "bg-[#fff0dc] text-[#85561a]";
  if (status === "approved_for_partner") return "bg-[#e2edf8] text-[#285e8b]";
  if (status === "partner_outcome_logged") return "bg-[#e5f1e8] text-[#2d6b50]";
  if (status === "requester_updated" || status === "closed") return "bg-[#dcecdf] text-[#245f43]";
  return "bg-[#eef0ee] text-[#59696d]";
}

function progressIndex(status: string) {
  if (status === "facility_review") return 1;
  if (status === "approved_for_partner") return 2;
  if (status === "partner_outcome_logged") return 3;
  if (status === "requester_updated") return 4;
  if (status === "closed") return 5;
  return 0;
}

function RequestProgress({ request, role }: { request: StoredPilotRequest; role: RoleKey }) {
  const labels = role === "requester"
    ? ["Submitted", "Under Review", "Care in Progress", "Update", "Completed"]
    : ["Submitted", "Under Review", "Partner Engaged", "Care Provided", "Update Released"];
  const index = progressIndex(rawStatus(request));

  return (
    <div className="mt-5 grid grid-cols-5">
      {labels.map((label, step) => {
        const reached = step <= Math.min(index, 4);
        const current = step === Math.min(index, 4);
        return (
          <div key={label} className="relative text-center">
            {step < labels.length - 1 ? (
              <span className={cx("absolute left-1/2 top-[9px] h-[2px] w-full", step < index ? "bg-[#2f7b65]" : "bg-[#d8d9d4]")} />
            ) : null}
            <span className={cx("relative mx-auto flex h-5 w-5 items-center justify-center rounded-full border-2 bg-[#fffdf9]", reached ? "border-[#2f7b65]" : "border-[#cfd1cc]")}>
              {reached && !current ? <span className="h-2 w-2 rounded-full bg-[#2f7b65]" /> : null}
              {current ? <span className="h-2.5 w-2.5 rounded-full bg-[#2f7b65] ring-4 ring-[#dcebe3]" /> : null}
            </span>
            <p className={cx("mt-2 px-1 text-[10px] font-bold sm:text-xs", reached ? "text-[#183f35]" : "text-[#8a9492]")}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6c8452]">{eyebrow}</p> : null}
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#123044] sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#64757b]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return (
    <Card className="p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e4efe8] text-xl text-[#2f7b65]">♡</span>
      <h2 className="mt-4 text-lg font-black text-[#183f35]">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-[#6b7a7e]">{detail}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

async function signOut() {
  await fetch("/api/role-sign-out", { method: "POST" }).catch(() => null);
  window.location.href = "/";
}

export function PilotWorkspace({ role }: PilotWorkspaceProps) {
  const defaultNav: ChurchWorkNavKey = "home";
  const [activeNav, setActiveNav] = useState<ChurchWorkNavKey>(defaultNav);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [support, setSupport] = useState<SupportOption[]>([]);
  const [noMedicalAck, setNoMedicalAck] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [requests, setRequests] = useState<StoredPilotRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading ChurchWork...");

  const selectedRequest = requests.find((item) => item.id === selectedRequestId) ?? null;
  const latestRequest = requests[0] ?? null;

  const counts = useMemo(() => ({
    review: requests.filter((r) => rawStatus(r) === "facility_review").length,
    partner: requests.filter((r) => rawStatus(r) === "approved_for_partner").length,
    release: requests.filter((r) => rawStatus(r) === "partner_outcome_logged").length,
    updated: requests.filter((r) => rawStatus(r) === "requester_updated" || rawStatus(r) === "closed").length
  }), [requests]);

  async function loadRequests() {
    setIsLoading(true);
    const response = await fetch(roleEndpoints[role], { cache: "no-store" }).catch(() => null);
    if (!response) {
      setMessage("ChurchWork request service is unreachable.");
      setIsLoading(false);
      return;
    }
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Request data is not available.");
      setIsLoading(false);
      return;
    }
    const nextRequests = Array.isArray(body.requests) ? body.requests as StoredPilotRequest[] : [];
    setRequests(nextRequests);
    setMessage(nextRequests.length ? "Current" : "No requests yet");
    setIsLoading(false);
  }

  useEffect(() => {
    void loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  function navigate(key: ChurchWorkNavKey) {
    setSelectedRequestId(null);
    setActiveNav(key);
    if (key === "new") setRequestStep(1);
  }

  function openRequest(id: string) {
    setSelectedRequestId(id);
  }

  function toggleSupport(option: SupportOption) {
    setSupport((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  }

  function replaceRequest(nextRequest: StoredPilotRequest) {
    setRequests((current) => current.map((item) => item.id === nextRequest.id ? nextRequest : item));
  }

  async function submitRequest() {
    if (!support.length || !noMedicalAck || isSaving) return;
    setIsSaving(true);
    setMessage("Submitting request...");
    const response = await fetch("/api/pilot-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ support, noMedicalAck })
    }).catch(() => null);
    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Request could not be submitted.");
      setIsSaving(false);
      return;
    }
    if (body.request) setRequests((current) => [body.request as StoredPilotRequest, ...current]);
    setSupport([]);
    setNoMedicalAck(false);
    setRequestStep(1);
    setMessage("Request submitted for Grandview review.");
    setIsSaving(false);
    setActiveNav("home");
  }

  async function facilityAction(requestId: string, action: "approve" | "release_update") {
    setActiveRequestId(requestId);
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
    const response = await fetch("/api/pilot-partner-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, outcome })
    }).catch(() => null);
    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Care update could not be saved.");
      setActiveRequestId(null);
      return;
    }
    if (body.request) replaceRequest(body.request as StoredPilotRequest);
    setMessage(typeof body.message === "string" ? body.message : "Update sent to Grandview.");
    setActiveRequestId(null);
  }

  const navItems = role === "requester"
    ? [
        { key: "home" as const, label: "Home", icon: "home" as const },
        { key: "requests" as const, label: "My Requests", icon: "request" as const },
        { key: "new" as const, label: "New Request", icon: "plus" as const }
      ]
    : role === "facility"
      ? [
          { key: "home" as const, label: "Home", icon: "home" as const },
          { key: "requests" as const, label: "Requests", icon: "request" as const }
        ]
      : [
          { key: "home" as const, label: "Home", icon: "home" as const },
          { key: "assignments" as const, label: "Assignments", icon: "request" as const },
          { key: "completed" as const, label: "Completed", icon: "check" as const }
        ];

  const organization = role === "facility" ? "Grandview Post Acute" : role === "partner" ? "Hope Church" : "Requester Portal";

  return (
    <ChurchWorkAppShell
      organization={organization}
      currentPortal={role}
      navItems={navItems}
      activeKey={activeNav}
      onNavigate={navigate}
      primaryAction={role === "requester" ? { label: "New Request", onClick: () => navigate("new") } : undefined}
    >
      <div className="mb-5 flex justify-end">
        <button type="button" onClick={signOut} className="text-xs font-extrabold text-[#69787c] underline-offset-4 hover:text-[#164f3e] hover:underline">Sign out</button>
      </div>

      {selectedRequest ? (
        <RequestDetail
          role={role}
          request={selectedRequest}
          isBusy={activeRequestId === selectedRequest.id}
          onBack={() => setSelectedRequestId(null)}
          onFacilityAction={facilityAction}
          onPartnerAction={partnerAction}
        />
      ) : role === "requester" ? (
        activeNav === "new"
          ? <RequesterNewRequest
              support={support}
              noMedicalAck={noMedicalAck}
              step={requestStep}
              isSaving={isSaving}
              onToggle={toggleSupport}
              onAck={setNoMedicalAck}
              onStep={setRequestStep}
              onSubmit={submitRequest}
            />
          : activeNav === "requests"
            ? <RequesterRequests requests={requests} isLoading={isLoading} onOpen={openRequest} onNew={() => navigate("new")} />
            : <RequesterHome requests={requests} isLoading={isLoading} onOpen={openRequest} onNew={() => navigate("new")} />
      ) : role === "facility" ? (
        activeNav === "requests"
          ? <FacilityRequests requests={requests} isLoading={isLoading} onOpen={openRequest} />
          : <FacilityHome requests={requests} counts={counts} isLoading={isLoading} onOpen={openRequest} />
      ) : (
        activeNav === "completed"
          ? <PartnerCompleted requests={requests} onOpen={openRequest} />
          : activeNav === "assignments"
            ? <PartnerAssignments requests={requests} isLoading={isLoading} onOpen={openRequest} />
            : <PartnerHome requests={requests} isLoading={isLoading} onOpen={openRequest} />
      )}

      {message !== "Current" && message !== "No requests yet" ? (
        <p className="mt-5 rounded-xl border border-[#ded9cf] bg-[#fffdf9] px-4 py-3 text-xs font-bold text-[#64757b]">{message}</p>
      ) : null}
    </ChurchWorkAppShell>
  );
}

function RequesterHome({ requests, isLoading, onOpen, onNew }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void; onNew: () => void }) {
  const current = requests.find((item) => rawStatus(item) !== "closed") ?? requests[0] ?? null;
  return (
    <>
      <PageTitle title="Welcome back" description="Here’s the latest on your spiritual-care requests." action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-extrabold text-white">+ New Request</button>} />
      {isLoading ? <Card className="p-7 text-sm font-bold text-[#68787c]">Loading your requests…</Card> : current ? (
        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className={cx("inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em]", statusPill(rawStatus(current)))}>{statusLabel(rawStatus(current))}</span>
              <h2 className="mt-3 text-xl font-black text-[#183f35]">Spiritual care request</h2>
              <p className="mt-1 text-sm font-semibold text-[#65767a]">Submitted {formatDate(current.created_at)} · {current.support.join(", ")}</p>
            </div>
            <button onClick={() => onOpen(current.id)} className="text-sm font-extrabold text-[#1f6f85]">View request →</button>
          </div>
          <RequestProgress request={current} role="requester" />
          <div className="mt-6 rounded-xl bg-[#eef5f1] p-4">
            <p className="text-sm font-black text-[#183f35]">
              {rawStatus(current) === "facility_review" ? "Your request is being reviewed by Grandview."
                : rawStatus(current) === "approved_for_partner" ? "A care partner is working on your request."
                : rawStatus(current) === "partner_outcome_logged" ? "Grandview is reviewing an update from the care partner."
                : current.requester_update ?? "Your request has been updated."}
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#697a77]">ChurchWork keeps the request moving while Grandview controls what is shared.</p>
          </div>
        </Card>
      ) : (
        <EmptyState title="No requests yet" detail="When you’re ready, start a spiritual-care request. It only takes a minute." action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-extrabold text-white">Request spiritual care</button>} />
      )}

      {requests.length > 1 ? (
        <Card className="mt-5 overflow-hidden">
          <div className="border-b border-[#ebe6dc] px-6 py-4"><h2 className="text-lg font-black text-[#183f35]">Recent requests</h2></div>
          {requests.slice(0, 4).map((request) => (
            <button key={request.id} onClick={() => onOpen(request.id)} className="flex w-full items-center justify-between gap-4 border-b border-[#eee9df] px-6 py-4 text-left last:border-0 hover:bg-[#faf8f2]">
              <div><p className="font-extrabold text-[#183f35]">{request.support.join(" + ") || "Spiritual care"}</p><p className="mt-1 text-xs font-semibold text-[#778488]">{formatDate(request.created_at)} · {shortId(request.id)}</p></div>
              <span className={cx("rounded-full px-3 py-1 text-xs font-black", statusPill(rawStatus(request)))}>{statusLabel(rawStatus(request))}</span>
            </button>
          ))}
        </Card>
      ) : null}
    </>
  );
}

function RequesterRequests({ requests, isLoading, onOpen, onNew }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void; onNew: () => void }) {
  return (
    <>
      <PageTitle title="My Requests" description="Track every spiritual-care request and its latest status." action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-extrabold text-white">+ New Request</button>} />
      {isLoading ? <Card className="p-7 text-sm font-bold text-[#68787c]">Loading your requests…</Card> : requests.length ? (
        <div className="space-y-3">
          {requests.map((request) => (
            <button key={request.id} onClick={() => onOpen(request.id)} className="w-full rounded-2xl border border-[#ded9cf] bg-[#fffdf9] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-base font-black text-[#183f35]">Spiritual care request</p><p className="mt-1 text-sm font-semibold text-[#6f7e82]">{request.support.join(", ")} · Submitted {formatDate(request.created_at)}</p></div>
                <div className="flex items-center gap-4"><span className={cx("rounded-full px-3 py-1 text-xs font-black", statusPill(rawStatus(request)))}>{statusLabel(rawStatus(request))}</span><span className="text-xl text-[#557079]">›</span></div>
              </div>
            </button>
          ))}
        </div>
      ) : <EmptyState title="No requests yet" detail="Your submitted spiritual-care requests will appear here." action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-extrabold text-white">Start a request</button>} />}
    </>
  );
}

function RequesterNewRequest({ support, noMedicalAck, step, isSaving, onToggle, onAck, onStep, onSubmit }: {
  support: SupportOption[]; noMedicalAck: boolean; step: number; isSaving: boolean;
  onToggle: (option: SupportOption) => void; onAck: (value: boolean) => void; onStep: (step: number) => void; onSubmit: () => void;
}) {
  const canContinue = step === 1 ? support.length > 0 : step === 2 ? noMedicalAck : true;
  return (
    <>
      <PageTitle eyebrow="New request" title="Request Spiritual Care" description="Tell us what would be most helpful. Grandview will review the request before anything is shared." />
      <div className="mb-6 flex max-w-3xl items-center gap-3">
        {["Request", "Confirm", "Submit"].map((label, index) => {
          const n = index + 1;
          return <div key={label} className="flex flex-1 items-center gap-2"><span className={cx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black", n <= step ? "border-[#2f7b65] bg-[#2f7b65] text-white" : "border-[#cfd2cc] bg-white text-[#7b8787]")}>{n}</span><span className={cx("text-xs font-bold", n <= step ? "text-[#183f35]" : "text-[#8b9491]")}>{label}</span>{n < 3 ? <span className="ml-2 h-px flex-1 bg-[#d9d8d2]" /> : null}</div>;
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_21rem]">
        <Card className="p-6">
          {step === 1 ? (
            <>
              <h2 className="text-xl font-black text-[#183f35]">What kind of support would be helpful?</h2>
              <p className="mt-1 text-sm font-medium text-[#6b7b7f]">Choose one or more options.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {supportOptions.map((option) => {
                  const active = support.includes(option.value);
                  return (
                    <button key={option.value} type="button" onClick={() => onToggle(option.value)} className={cx("relative rounded-xl border p-5 text-left transition", active ? "border-[#2f7b65] bg-[#f0f7f3] ring-1 ring-[#2f7b65]" : "border-[#ded9cf] bg-white hover:border-[#9bb5a9]")}>
                      <span className="text-2xl">{option.symbol}</span>
                      <span className="mt-3 block text-base font-black text-[#183f35]">{option.title}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-[#6c7b7e]">{option.detail}</span>
                      <span className={cx("absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-black", active ? "border-[#2f7b65] bg-[#2f7b65] text-white" : "border-[#c9cbc6] text-transparent")}>✓</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : step === 2 ? (
            <>
              <h2 className="text-xl font-black text-[#183f35]">Confirm this is a spiritual-care request</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#68787c]">ChurchWork is designed for spiritual care and encouragement. Medical, emergency, insurance, chart, diagnosis, medication, symptom, and treatment information should not be submitted here.</p>
              <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-xl border border-[#cfe0d5] bg-[#f0f7f3] p-5">
                <input type="checkbox" checked={noMedicalAck} onChange={(event) => onAck(event.target.checked)} className="mt-1 h-5 w-5 accent-[#2f7b65]" />
                <span><span className="block text-sm font-black text-[#183f35]">I confirm this request is for spiritual care only.</span><span className="mt-1 block text-xs font-semibold leading-5 text-[#667773]">Grandview will review the request before it is shared with a care partner.</span></span>
              </label>
            </>
          ) : (
            <>
              <h2 className="text-xl font-black text-[#183f35]">Review your request</h2>
              <div className="mt-5 rounded-xl bg-[#f6f4ee] p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#738078]">Support requested</p>
                <div className="mt-3 flex flex-wrap gap-2">{support.map((item) => <span key={item} className="rounded-full bg-[#e3eee7] px-3 py-2 text-xs font-black text-[#245f48]">{item}</span>)}</div>
              </div>
              <div className="mt-4 rounded-xl border border-[#cfe0d5] bg-[#f0f7f3] p-5 text-sm font-semibold leading-6 text-[#355b4d]">
                ✓ Spiritual-care-only confirmation complete. ChurchWork will generate the safe summary from the options above.
              </div>
            </>
          )}

          <div className="mt-6 flex items-center justify-between">
            {step > 1 ? <button type="button" onClick={() => onStep(step - 1)} className="rounded-xl border border-[#d5d2ca] px-5 py-3 text-sm font-extrabold text-[#4d626a]">Back</button> : <span />}
            {step < 3 ? <button type="button" disabled={!canContinue} onClick={() => onStep(step + 1)} className="rounded-xl bg-[#164f3e] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-40">Continue →</button> : <button type="button" disabled={isSaving} onClick={onSubmit} className="rounded-xl bg-[#164f3e] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-50">{isSaving ? "Submitting…" : "Submit request"}</button>}
          </div>
        </Card>

        <Card className="h-fit p-5">
          <h3 className="text-lg font-black text-[#183f35]">Request summary</h3>
          <div className="mt-5 border-t border-[#ebe6dc] pt-4"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#7d8784]">Facility</p><p className="mt-1 text-sm font-black text-[#183f35]">Grandview Post Acute</p></div>
          <div className="mt-4 border-t border-[#ebe6dc] pt-4"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#7d8784]">Support</p><p className="mt-1 text-sm font-bold text-[#4f646c]">{support.length ? support.join(", ") : "Not selected yet"}</p></div>
          <div className="mt-4 border-t border-[#ebe6dc] pt-4"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#7d8784]">Privacy</p><p className="mt-1 text-sm font-bold text-[#4f646c]">{noMedicalAck ? "Spiritual-care scope confirmed" : "Confirmation required"}</p></div>
        </Card>
      </div>
    </>
  );
}

function FacilityMetric({ value, label, tone }: { value: number; label: string; tone: "rose" | "blue" | "green" | "gray" }) {
  const toneClass = tone === "rose" ? "bg-[#fff0ee]" : tone === "blue" ? "bg-[#eef5fb]" : tone === "green" ? "bg-[#edf6ef]" : "bg-[#f1f2ef]";
  return <Card className={cx("p-5", toneClass)}><p className="text-3xl font-black text-[#123044]">{value}</p><p className="mt-1 text-sm font-extrabold text-[#425a64]">{label}</p></Card>;
}

function FacilityHome({ requests, counts, isLoading, onOpen }: { requests: StoredPilotRequest[]; counts: { review: number; partner: number; release: number; updated: number }; isLoading: boolean; onOpen: (id: string) => void }) {
  const needsReview = requests.filter((r) => rawStatus(r) === "facility_review");
  return (
    <>
      <PageTitle eyebrow="Facility portal" title="Good morning" description="Here’s what needs Grandview’s attention." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FacilityMetric value={counts.review} label="Needs Review" tone="rose" />
        <FacilityMetric value={counts.partner} label="With Care Partner" tone="blue" />
        <FacilityMetric value={counts.release} label="Ready to Release" tone="green" />
        <FacilityMetric value={counts.updated} label="Requester Updated" tone="gray" />
      </div>
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#ebe6dc] px-6 py-4"><h2 className="text-lg font-black text-[#183f35]">Needs Review</h2><span className="text-xs font-extrabold text-[#73817f]">{needsReview.length} request{needsReview.length === 1 ? "" : "s"}</span></div>
        {isLoading ? <p className="p-6 text-sm font-bold text-[#6d7b7e]">Loading queue…</p> : needsReview.length ? needsReview.map((request) => (
          <div key={request.id} className="flex flex-col gap-4 border-b border-[#eee9df] px-6 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-black text-[#183f35]">{request.support.join(" + ") || "Spiritual care request"}</p><p className="mt-1 text-xs font-semibold text-[#768286]">{shortId(request.id)} · {formatDate(request.created_at, true)}</p></div>
            <button onClick={() => onOpen(request.id)} className="rounded-lg bg-[#164f3e] px-5 py-2.5 text-sm font-extrabold text-white">Review</button>
          </div>
        )) : <p className="p-6 text-sm font-semibold text-[#6d7b7e]">No requests are waiting for review.</p>}
      </Card>
    </>
  );
}

function FacilityRequests({ requests, isLoading, onOpen }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void }) {
  return (
    <>
      <PageTitle title="Requests" description="Review the full Grandview spiritual-care queue." />
      {isLoading ? <Card className="p-6 text-sm font-bold text-[#6d7b7e]">Loading requests…</Card> : requests.length ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1.4fr_.8fr_.8fr_auto] gap-4 border-b border-[#ebe6dc] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#84908e] md:grid"><span>Request</span><span>Submitted</span><span>Status</span><span>Action</span></div>
          {requests.map((request) => (
            <div key={request.id} className="grid gap-3 border-b border-[#eee9df] px-6 py-4 last:border-0 md:grid-cols-[1.4fr_.8fr_.8fr_auto] md:items-center">
              <div><p className="font-black text-[#183f35]">{request.support.join(" + ") || "Spiritual care request"}</p><p className="mt-1 text-xs font-semibold text-[#7a8688]">{shortId(request.id)}</p></div>
              <p className="text-sm font-semibold text-[#64767b]">{formatDate(request.created_at)}</p>
              <span className={cx("w-fit rounded-full px-3 py-1 text-xs font-black", statusPill(rawStatus(request)))}>{statusLabel(rawStatus(request))}</span>
              <button onClick={() => onOpen(request.id)} className="rounded-lg border border-[#cad4ce] px-4 py-2 text-sm font-extrabold text-[#164f3e]">View</button>
            </div>
          ))}
        </Card>
      ) : <EmptyState title="Queue clear" detail="No Grandview pilot requests are in the queue right now." />}
    </>
  );
}

function PartnerHome({ requests, isLoading, onOpen }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void }) {
  const newAssignments = requests.filter((r) => rawStatus(r) === "approved_for_partner");
  return (
    <>
      <PageTitle eyebrow="Hope Church" title="Welcome" description="Here are your current spiritual-care assignments." />
      <div className="mb-4 flex gap-6 border-b border-[#ddd9d0] text-sm font-extrabold text-[#6c7b7e]"><span className="border-b-2 border-[#2f7b65] px-1 pb-3 text-[#164f3e]">New ({newAssignments.length})</span><span className="px-1 pb-3">Completed ({requests.length - newAssignments.length})</span></div>
      {isLoading ? <Card className="p-6 text-sm font-bold text-[#6d7b7e]">Loading assignments…</Card> : newAssignments.length ? (
        <div className="space-y-3">{newAssignments.map((request) => <AssignmentRow key={request.id} request={request} onOpen={onOpen} />)}</div>
      ) : <EmptyState title="No new assignments" detail="Grandview-approved requests will appear here when they are ready for Hope Church." />}
    </>
  );
}

function PartnerAssignments({ requests, isLoading, onOpen }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void }) {
  return (
    <>
      <PageTitle title="Assignments" description="Spiritual-care requests Grandview has approved for Hope Church." />
      {isLoading ? <Card className="p-6 text-sm font-bold text-[#6d7b7e]">Loading assignments…</Card> : requests.length ? <div className="space-y-3">{requests.map((request) => <AssignmentRow key={request.id} request={request} onOpen={onOpen} />)}</div> : <EmptyState title="No assignments yet" detail="Approved assignments will appear here." />}
    </>
  );
}

function PartnerCompleted({ requests, onOpen }: { requests: StoredPilotRequest[]; onOpen: (id: string) => void }) {
  const completed = requests.filter((r) => rawStatus(r) !== "approved_for_partner");
  return (
    <>
      <PageTitle title="Completed" description="Assignments where Hope Church has already logged an outcome." />
      {completed.length ? <div className="space-y-3">{completed.map((request) => <AssignmentRow key={request.id} request={request} onOpen={onOpen} />)}</div> : <EmptyState title="Nothing completed yet" detail="Completed care responses will appear here after an outcome is logged." />}
    </>
  );
}

function AssignmentRow({ request, onOpen }: { request: StoredPilotRequest; onOpen: (id: string) => void }) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-black text-[#183f35]">Spiritual care request</p><p className="mt-1 text-xs font-semibold text-[#738184]">{shortId(request.id)} · {request.support.join(", ")}</p></div>
        <div className="flex items-center gap-3"><span className={cx("rounded-full px-3 py-1 text-xs font-black", statusPill(rawStatus(request)))}>{request.partner_outcome ? outcomeLabel(request.partner_outcome) : "New"}</span><button onClick={() => onOpen(request.id)} className="rounded-lg bg-[#164f3e] px-5 py-2.5 text-sm font-extrabold text-white">View</button></div>
      </div>
    </Card>
  );
}

function RequestDetail({ role, request, isBusy, onBack, onFacilityAction, onPartnerAction }: {
  role: RoleKey; request: StoredPilotRequest; isBusy: boolean; onBack: () => void;
  onFacilityAction: (id: string, action: "approve" | "release_update") => Promise<void>;
  onPartnerAction: (id: string, outcome: PartnerOutcome) => Promise<void>;
}) {
  const status = rawStatus(request);
  const canApprove = role === "facility" && status === "facility_review";
  const canRelease = role === "facility" && status === "partner_outcome_logged" && request.requester_update_status !== "released";
  const canPartnerReport = role === "partner" && status === "approved_for_partner";

  return (
    <>
      <button onClick={onBack} className="mb-4 text-sm font-extrabold text-[#5e737b]">← Back</button>
      <PageTitle
        eyebrow={role === "partner" ? "Hope Church" : role === "facility" ? "Grandview Post Acute" : "My request"}
        title={`Request #${shortId(request.id).replace("CW-", "")}`}
        description={`Submitted ${formatDate(request.created_at)}`}
        action={<span className={cx("rounded-full px-4 py-2 text-xs font-black", statusPill(status))}>{statusLabel(status)}</span>}
      />

      <Card className="p-6">
        <RequestProgress request={request} role={role} />
      </Card>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-xl font-black text-[#183f35]">{role === "partner" ? "Request summary" : "Request details"}</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-black uppercase tracking-[0.1em] text-[#808b88]">Support requested</dt><dd className="mt-1 text-sm font-black text-[#183f35]">{request.support.join(", ") || "Spiritual care"}</dd></div>
              <div><dt className="text-xs font-black uppercase tracking-[0.1em] text-[#808b88]">Request ID</dt><dd className="mt-1 text-sm font-black text-[#183f35]">{shortId(request.id)}</dd></div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-[#183f35]">{role === "partner" ? "Safe context" : "Safe request summary"}</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-[#617278]">{request.safe_note || "Structured spiritual-care request."}</p>
            <div className="mt-4 rounded-xl bg-[#eef5f1] p-4 text-xs font-semibold leading-5 text-[#4d6b60]">This is a spiritual-care workflow. Medical or clinical information is not part of the requester submission.</div>
          </Card>

          {request.partner_outcome ? <Card className="p-6"><h2 className="text-xl font-black text-[#183f35]">Care partner update</h2><p className="mt-3 text-sm font-bold text-[#49635b]">{outcomeLabel(request.partner_outcome)}</p></Card> : null}
          {role === "requester" && request.requester_update ? <Card className="border-[#bcd7c6] bg-[#f0f7f3] p-6"><h2 className="text-xl font-black text-[#183f35]">Your update</h2><p className="mt-3 text-sm font-bold leading-7 text-[#355d4e]">{request.requester_update}</p></Card> : null}
        </div>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-lg font-black text-[#183f35]">Next step</h2>
            {role === "facility" ? (
              <>
                <p className="mt-2 text-sm font-medium leading-6 text-[#68787c]">{canApprove ? "Review this request and approve it for Hope Church." : canRelease ? "Hope Church has logged an outcome. Review and release the safe update to the requester." : "No Grandview action is required right now."}</p>
                {canApprove ? <button disabled={isBusy} onClick={() => void onFacilityAction(request.id, "approve")} className="mt-5 w-full rounded-xl bg-[#164f3e] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50">{isBusy ? "Working…" : "Approve for Hope Church"}</button> : null}
                {canRelease ? <button disabled={isBusy} onClick={() => void onFacilityAction(request.id, "release_update")} className="mt-5 w-full rounded-xl bg-[#164f3e] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50">{isBusy ? "Working…" : "Release update"}</button> : null}
              </>
            ) : role === "partner" ? (
              <>
                <p className="mt-2 text-sm font-medium leading-6 text-[#68787c]">{canPartnerReport ? "Log the spiritual-care outcome. Grandview will review it before anything is released to the requester." : "Your outcome has been sent to Grandview."}</p>
                {canPartnerReport ? <div className="mt-4 space-y-2">{partnerOutcomes.map((outcome) => <button key={outcome.value} disabled={isBusy} onClick={() => void onPartnerAction(request.id, outcome.value)} className="w-full rounded-xl border border-[#d7d5ce] bg-white p-3 text-left disabled:opacity-50"><span className="block text-sm font-black text-[#183f35]">{outcome.label}</span><span className="mt-1 block text-xs font-medium text-[#718083]">{outcome.detail}</span></button>)}</div> : null}
              </>
            ) : (
              <p className="mt-2 text-sm font-medium leading-6 text-[#68787c]">
                {status === "facility_review" ? "Grandview is reviewing your request."
                  : status === "approved_for_partner" ? "A care partner is working on your request."
                  : status === "partner_outcome_logged" ? "Grandview is reviewing the care partner update."
                  : status === "requester_updated" ? "A safe update has been released to you."
                  : "This request is complete."}
              </p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-black text-[#183f35]">Activity</h2>
            <div className="mt-4 space-y-4 text-sm">
              <ActivityItem done label="Request submitted" detail={formatDate(request.created_at, true)} />
              <ActivityItem done={progressIndex(status) >= 2} label="Facility review" detail={progressIndex(status) >= 2 ? "Approved" : "In review"} />
              <ActivityItem done={progressIndex(status) >= 3} label="Care partner" detail={request.partner_outcome ? outcomeLabel(request.partner_outcome) : progressIndex(status) >= 2 ? "Engaged" : "Pending"} />
              <ActivityItem done={progressIndex(status) >= 4} label="Requester update" detail={request.requester_update_status === "released" ? "Released" : "Pending"} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function ActivityItem({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return <div className="flex gap-3"><span className={cx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black", done ? "border-[#2f7b65] bg-[#2f7b65] text-white" : "border-[#cfd2cd] bg-white text-transparent")}>✓</span><div><p className="font-black text-[#294b42]">{label}</p><p className="mt-0.5 text-xs font-semibold text-[#7b8886]">{detail}</p></div></div>;
}
