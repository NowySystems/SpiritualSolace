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

const supportOptions: Array<{ value: SupportOption; title: string; detail: string; icon: "prayer" | "visit" | "heart" | "phone" }> = [
  { value: "Prayer", title: "Prayer", detail: "Prayer from an approved local care partner.", icon: "prayer" },
  { value: "Friendly visit", title: "Friendly Visit", detail: "A spiritual-care visit from an approved church partner.", icon: "visit" },
  { value: "Encouragement", title: "Encouragement", detail: "Words of support and spiritual encouragement.", icon: "heart" },
  { value: "Pastoral call", title: "Pastoral Call", detail: "A phone call from a pastor or approved care partner.", icon: "phone" }
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
  return <section className={cx("rounded-[1.35rem] border border-[#ded9cf]/90 bg-[#fffdf9] shadow-[0_12px_38px_rgba(18,48,68,.06)]", className)}>{children}</section>;
}

function SupportIcon({ name }: { name: "prayer" | "visit" | "heart" | "phone" }) {
  const cls = "h-6 w-6";
  if (name === "prayer") return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 4c1.2 2.6 1.5 5 .8 7.2L7 20"/><path d="M15 4c-1.2 2.6-1.5 5-.8 7.2L17 20"/><path d="M9.8 11.2c1.4.8 3 .8 4.4 0"/><path d="M7.5 16h9"/></svg>;
  if (name === "visit") return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 21V9l8-5 8 5v12"/><path d="M8 21v-7h8v7"/><path d="M9 10h6"/></svg>;
  if (name === "phone") return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7.5 3.5 10 8 7.8 9.8c1.1 2.7 3.7 5.3 6.4 6.4L16 14l4.5 2.5-.7 3.5c-.2.8-.9 1.4-1.8 1.4C9.5 21.4 2.6 14.5 2.6 6c0-.9.6-1.6 1.4-1.8z"/></svg>;
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>;
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

function statusLabel(status: string, role?: RoleKey) {
  if (role === "requester") {
    if (status === "facility_review") return "Under Review";
    if (status === "approved_for_partner") return "Care in Progress";
    if (status === "partner_outcome_logged") return "Update in Review";
    if (status === "requester_updated" || status === "closed") return "Complete";
    return "Submitted";
  }

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
  const status = rawStatus(request);
  const labels = role === "requester"
    ? ["Submitted", "Under Review", "Care in Progress", "Update Released"]
    : ["Submitted", "Under Review", "Partner Engaged", "Care Provided", "Update Released"];
  const index = role === "requester"
    ? status === "facility_review"
      ? 1
      : status === "approved_for_partner" || status === "partner_outcome_logged"
        ? 2
        : status === "requester_updated" || status === "closed"
          ? 3
          : 0
    : Math.min(progressIndex(status), 4);
  const gridClass = role === "requester" ? "grid-cols-4" : "grid-cols-5";

  return (
    <div className={cx("mt-5 grid", gridClass)}>
      {labels.map((label, step) => {
        const reached = step <= index;
        const current = step === index;
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
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-4xl">
        {eyebrow ? <span className="inline-flex rounded-full border border-[#d8d3c8] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#627858]">{eyebrow}</span> : null}
        <h1 className={cx("font-serif text-4xl font-semibold tracking-[-0.055em] text-[#102f40] sm:text-[2.8rem] sm:leading-[1.02]", eyebrow ? "mt-3" : "")}>{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#66777b] sm:text-[15px]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return (
    <Card className="relative overflow-hidden p-10 text-center">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#edf5f1] to-transparent" />
      <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e4efe8] text-[#2f7b65] shadow-sm"><SupportIcon name="heart" /></span>
      <h2 className="relative mt-5 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#183f35]">{title}</h2>
      <p className="relative mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-[#6b7a7e]">{detail}</p>
      {action ? <div className="relative mt-6">{action}</div> : null}
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
      onSignOut={() => void signOut()}
    >

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
  const current = requests.find((item) => !["requester_updated", "closed"].includes(rawStatus(item))) ?? requests[0] ?? null;
  const completedCount = requests.filter((item) => ["requester_updated", "closed"].includes(rawStatus(item))).length;

  return (
    <>
      <PageTitle
        eyebrow="Requester"
        title="Your spiritual care"
        description="A simple place to ask for support and follow what happens next."
        action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#164f3e]/15 transition hover:-translate-y-0.5">+ New Request</button>}
      />

      {isLoading ? (
        <Card className="overflow-hidden p-7">
          <div className="h-3 w-28 animate-pulse rounded-full bg-[#e6e1d8]" />
          <div className="mt-5 h-9 w-64 animate-pulse rounded-xl bg-[#ece8df]" />
          <div className="mt-5 h-24 animate-pulse rounded-2xl bg-[#f1eee7]" />
        </Card>
      ) : current ? (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2f7b65] via-[#6da18d] to-[#d7c47f]" />
          <div className="grid gap-0 xl:grid-cols-[1.25fr_.75fr]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#74847f]">Current request</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.045em] text-[#14384a]">{current.support.join(" + ") || "Spiritual care"}</h2>
                  <p className="mt-2 text-sm font-semibold text-[#738185]">{shortId(current.id)} · Submitted {formatDate(current.created_at)}</p>
                </div>
                <span className={cx("rounded-full px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.08em]", statusPill(rawStatus(current)))}>{statusLabel(rawStatus(current), "requester")}</span>
              </div>

              <div className="mt-7 rounded-2xl border border-[#e1ddd3] bg-[#faf8f3] px-4 py-5 sm:px-6">
                <RequestProgress request={current} role="requester" />
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#eaf4ef] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2f7b65] shadow-sm"><SupportIcon name="heart" /></span>
                  <div>
                    <p className="text-sm font-black text-[#183f35]">
                      {rawStatus(current) === "facility_review" ? "Grandview is reviewing your request."
                        : rawStatus(current) === "approved_for_partner" ? "Hope Church is caring for this request."
                        : rawStatus(current) === "partner_outcome_logged" ? "Grandview is reviewing the care update."
                        : current.requester_update ?? "Your request has been updated."}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#64786f]">You do not need to coordinate the handoffs. ChurchWork keeps the care loop moving for you.</p>
                  </div>
                </div>
                <button onClick={() => onOpen(current.id)} className="shrink-0 rounded-xl border border-[#bfd3c9] bg-white px-4 py-2.5 text-xs font-black text-[#215b48] shadow-sm">View request →</button>
              </div>
            </div>

            <aside className="border-t border-[#e6e1d7] bg-[#f8f5ee] p-6 sm:p-8 xl:border-l xl:border-t-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7a8783]">At a glance</p>
              <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-1">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-2xl font-black tracking-[-0.04em] text-[#14384a]">{requests.length}</p>
                  <p className="mt-1 text-xs font-bold text-[#6d7c80]">Total requests</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-2xl font-black tracking-[-0.04em] text-[#14384a]">{completedCount}</p>
                  <p className="mt-1 text-xs font-bold text-[#6d7c80]">Completed</p>
                </div>
              </div>
              <p className="mt-5 text-xs font-semibold leading-5 text-[#7a8785]">Grandview Post Acute reviews requests before they are shared with Hope Church.</p>
            </aside>
          </div>
        </Card>
      ) : (
        <EmptyState title="Ask for spiritual care" detail="Prayer, a friendly visit, encouragement, or a pastoral call can be requested in about a minute." action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#164f3e]/15">Request spiritual care</button>} />
      )}

      {requests.length > 1 ? (
        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7b8884]">History</p><h2 className="mt-1 text-lg font-black text-[#183f35]">Recent requests</h2></div>
            <span className="text-xs font-bold text-[#7b8786]">{requests.length} total</span>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {requests.slice(0, 4).map((request) => (
              <button key={request.id} onClick={() => onOpen(request.id)} className="group rounded-2xl border border-[#ded9cf] bg-[#fffdf9] p-5 text-left shadow-[0_10px_30px_rgba(18,48,68,.04)] transition hover:-translate-y-0.5 hover:border-[#bfd0c6] hover:shadow-[0_14px_34px_rgba(18,48,68,.08)]">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="font-black text-[#183f35]">{request.support.join(" + ") || "Spiritual care"}</p><p className="mt-1 text-xs font-semibold text-[#778488]">{formatDate(request.created_at)} · {shortId(request.id)}</p></div>
                  <span className={cx("rounded-full px-3 py-1 text-[10px] font-black", statusPill(rawStatus(request)))}>{statusLabel(rawStatus(request), "requester")}</span>
                </div>
                <p className="mt-4 text-xs font-black text-[#2a6b57] group-hover:underline">Open request →</p>
              </button>
            ))}
          </div>
        </section>
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
                <div className="flex items-center gap-4"><span className={cx("rounded-full px-3 py-1 text-xs font-black", statusPill(rawStatus(request)))}>{statusLabel(rawStatus(request), "requester")}</span><span className="text-xl text-[#557079]">›</span></div>
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
  const stepCopy = [
    ["Choose support", "What would feel helpful right now?"],
    ["Keep it safe", "Confirm this stays within spiritual care."],
    ["Review & send", "Make sure the request looks right."]
  ][step - 1];

  return (
    <>
      <PageTitle eyebrow="New request" title="Request spiritual care" description="A few simple choices are all Grandview needs to begin the care process." />

      <div className="mb-7 rounded-2xl border border-[#ddd8ce] bg-white/70 p-3 shadow-sm backdrop-blur">
        <div className="grid grid-cols-3 gap-2">
          {["Support", "Confirm", "Submit"].map((label, index) => {
            const n = index + 1;
            const active = n === step;
            const complete = n < step;
            return (
              <div key={label} className={cx("rounded-xl px-3 py-3 transition", active ? "bg-[#e6f1eb]" : "")}>
                <div className="flex items-center gap-2">
                  <span className={cx("flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-black", complete || active ? "border-[#2f7b65] bg-[#2f7b65] text-white" : "border-[#d1d2cc] bg-white text-[#8a9491]")}>{complete ? "✓" : n}</span>
                  <span className={cx("text-xs font-black", active || complete ? "text-[#183f35]" : "text-[#8b9491]")}>{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <Card className="overflow-hidden">
          <div className="border-b border-[#ebe6dc] bg-[#fffdf9] px-6 py-5 sm:px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#72837d]">Step {step} of 3</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#14384a]">{stepCopy[0]}</h2>
            <p className="mt-1 text-sm font-medium text-[#6b7b7f]">{stepCopy[1]}</p>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {supportOptions.map((option) => {
                  const active = support.includes(option.value);
                  return (
                    <button key={option.value} type="button" onClick={() => onToggle(option.value)} className={cx("group relative min-h-[9.5rem] rounded-2xl border p-5 text-left transition", active ? "border-[#2f7b65] bg-[#edf6f1] shadow-[0_10px_28px_rgba(47,123,101,.10)] ring-1 ring-[#2f7b65]" : "border-[#ded9cf] bg-white hover:-translate-y-0.5 hover:border-[#9bb5a9] hover:shadow-md")}>
                      <span className={cx("flex h-11 w-11 items-center justify-center rounded-xl transition", active ? "bg-[#2f7b65] text-white" : "bg-[#f1eee7] text-[#526a62] group-hover:bg-[#e8f0eb]")}><SupportIcon name={option.icon} /></span>
                      <span className="mt-4 block text-base font-black text-[#183f35]">{option.title}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-[#6c7b7e]">{option.detail}</span>
                      <span className={cx("absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black", active ? "border-[#2f7b65] bg-[#2f7b65] text-white" : "border-[#c9cbc6] bg-white text-transparent")}>✓</span>
                    </button>
                  );
                })}
              </div>
            ) : step === 2 ? (
              <>
                <div className="rounded-2xl bg-[#f5f2eb] p-5">
                  <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2f7b65] shadow-sm"><SupportIcon name="heart" /></span><div><p className="text-sm font-black text-[#183f35]">ChurchWork is for spiritual care—not clinical information.</p><p className="mt-1 text-sm font-medium leading-6 text-[#68787c]">Please do not submit emergency, insurance, chart, diagnosis, medication, symptom, or treatment information.</p></div></div>
                </div>
                <label className="mt-5 flex cursor-pointer items-start gap-4 rounded-2xl border border-[#bcd5c7] bg-[#edf6f1] p-5 shadow-sm">
                  <input type="checkbox" checked={noMedicalAck} onChange={(event) => onAck(event.target.checked)} className="mt-1 h-5 w-5 accent-[#2f7b65]" />
                  <span><span className="block text-sm font-black text-[#183f35]">I confirm this request is for spiritual care only.</span><span className="mt-1 block text-xs font-semibold leading-5 text-[#667773]">Grandview Post Acute reviews every request before anything is shared with Hope Church.</span></span>
                </label>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-[#ded9cf] bg-[#faf8f3] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#738078]">Support requested</p>
                  <div className="mt-4 flex flex-wrap gap-2">{support.map((item) => <span key={item} className="rounded-full bg-[#e3eee7] px-3.5 py-2 text-xs font-black text-[#245f48]">{item}</span>)}</div>
                </div>
                <div className="mt-4 flex gap-3 rounded-2xl border border-[#cfe0d5] bg-[#f0f7f3] p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f7b65] text-xs font-black text-white">✓</span>
                  <div><p className="text-sm font-black text-[#294e42]">Safe to submit</p><p className="mt-1 text-xs font-semibold leading-5 text-[#587168]">ChurchWork will create the safe summary from your selections and send it to Grandview for review.</p></div>
                </div>
              </>
            )}

            <div className="mt-7 flex items-center justify-between border-t border-[#ebe6dc] pt-5">
              {step > 1 ? <button type="button" onClick={() => onStep(step - 1)} className="rounded-xl border border-[#d5d2ca] bg-white px-5 py-3 text-sm font-black text-[#4d626a] shadow-sm">Back</button> : <span />}
              {step < 3
                ? <button type="button" disabled={!canContinue} onClick={() => onStep(step + 1)} className="rounded-xl bg-[#164f3e] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#164f3e]/15 transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0">Continue →</button>
                : <button type="button" disabled={isSaving} onClick={onSubmit} className="rounded-xl bg-[#164f3e] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#164f3e]/15 disabled:opacity-50">{isSaving ? "Submitting…" : "Submit request"}</button>}
            </div>
          </div>
        </Card>

        <Card className="h-fit overflow-hidden">
          <div className="bg-[#173f34] p-5 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">Request summary</p>
            <h3 className="mt-1 font-serif text-xl font-semibold">What Grandview will receive</h3>
          </div>
          <div className="p-5">
            <div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7d8784]">Facility</p><p className="mt-1 text-sm font-black text-[#183f35]">Grandview Post Acute</p></div>
            <div className="mt-5 border-t border-[#ebe6dc] pt-4"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7d8784]">Support</p><p className="mt-1 text-sm font-bold leading-6 text-[#4f646c]">{support.length ? support.join(", ") : "Choose support to continue"}</p></div>
            <div className="mt-5 border-t border-[#ebe6dc] pt-4"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7d8784]">Privacy</p><p className="mt-1 text-sm font-bold text-[#4f646c]">{noMedicalAck ? "✓ Spiritual-care scope confirmed" : "Confirmation required"}</p></div>
            <div className="mt-5 rounded-xl bg-[#f4f1ea] p-4 text-xs font-semibold leading-5 text-[#6d7978]">You will be able to follow the request from review through care and final update.</div>
          </div>
        </Card>
      </div>
    </>
  );
}

function FacilityMetric({ value, label, tone }: { value: number; label: string; tone: "rose" | "blue" | "green" | "gray" }) {
  const toneClass = tone === "rose" ? "from-[#fff1ee] to-[#fffaf8]" : tone === "blue" ? "from-[#edf4fa] to-[#fbfdff]" : tone === "green" ? "from-[#eaf5ed] to-[#fbfdfb]" : "from-[#f2f2ef] to-[#fbfbf8]";
  const accent = tone === "rose" ? "#a65d51" : tone === "blue" ? "#416f96" : tone === "green" ? "#3f7f5a" : "#687574";
  return <Card className={cx("relative overflow-hidden bg-gradient-to-br p-5", toneClass)}><span className="absolute left-0 top-0 h-full w-1.5" style={{ background: accent }} /><p className="text-3xl font-black tracking-[-0.045em] text-[#123044]">{value}</p><p className="mt-1 text-sm font-black text-[#425a64]">{label}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: accent }}>{value ? "Active" : "Clear"}</p></Card>;
}

function FacilityHome({ requests, counts, isLoading, onOpen }: { requests: StoredPilotRequest[]; counts: { review: number; partner: number; release: number; updated: number }; isLoading: boolean; onOpen: (id: string) => void }) {
  const needsReview = requests.filter((r) => rawStatus(r) === "facility_review");
  const readyToRelease = requests.filter((r) => rawStatus(r) === "partner_outcome_logged");
  const needsAction = needsReview.length + readyToRelease.length;

  return (
    <>
      <PageTitle eyebrow="Grandview Post Acute" title="Care coordination" description={needsAction ? `${needsAction} request${needsAction === 1 ? "" : "s"} need Grandview's attention.` : "Everything is moving. There are no facility actions waiting right now."} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FacilityMetric value={counts.review} label="Needs Review" tone="rose" />
        <FacilityMetric value={counts.partner} label="With Hope Church" tone="blue" />
        <FacilityMetric value={counts.release} label="Ready to Release" tone="green" />
        <FacilityMetric value={counts.updated} label="Requester Updated" tone="gray" />
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e7e2d9] bg-[#fffdf9] px-6 py-5">
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#a05c52]">Action queue</p><h2 className="mt-1 text-lg font-black text-[#183f35]">Needs review</h2></div>
            <span className="rounded-full bg-[#fff0ee] px-3 py-1.5 text-[10px] font-black text-[#9b564c]">{needsReview.length}</span>
          </div>
          {isLoading ? <p className="p-6 text-sm font-bold text-[#6d7b7e]">Loading queue…</p> : needsReview.length ? needsReview.map((request) => (
            <button key={request.id} onClick={() => onOpen(request.id)} className="group flex w-full flex-col gap-4 border-b border-[#eee9df] px-6 py-5 text-left last:border-0 hover:bg-[#fbfaf6] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2"><p className="font-black text-[#183f35]">{request.support.join(" + ") || "Spiritual care request"}</p><span className="rounded-full bg-[#fff0dc] px-2.5 py-1 text-[9px] font-black text-[#85561a]">NEW</span></div>
                <p className="mt-1.5 text-xs font-semibold text-[#768286]">{shortId(request.id)} · {formatDate(request.created_at, true)}</p>
              </div>
              <span className="rounded-xl bg-[#315f83] px-4 py-2.5 text-xs font-black text-white shadow-sm transition group-hover:-translate-y-0.5">Review request →</span>
            </button>
          )) : <div className="p-7"><p className="text-sm font-black text-[#34564c]">Review queue is clear.</p><p className="mt-1 text-xs font-semibold text-[#788582]">New requester submissions will appear here first.</p></div>}
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e7e2d9] bg-[#eff6f0] px-6 py-5">
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#4d805d]">Second gate</p><h2 className="mt-1 text-lg font-black text-[#183f35]">Ready to release</h2></div>
            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#417255] shadow-sm">{readyToRelease.length}</span>
          </div>
          {readyToRelease.length ? readyToRelease.map((request) => (
            <button key={request.id} onClick={() => onOpen(request.id)} className="group w-full border-b border-[#e6ece7] px-6 py-5 text-left last:border-0 hover:bg-[#f8fbf8]">
              <p className="font-black text-[#183f35]">{outcomeLabel(request.partner_outcome)}</p>
              <p className="mt-1.5 text-xs font-semibold text-[#71807d]">{shortId(request.id)} · Hope Church update received</p>
              <p className="mt-4 text-xs font-black text-[#3f7653]">Review & release →</p>
            </button>
          )) : <div className="p-7"><p className="text-sm font-black text-[#34564c]">No updates waiting.</p><p className="mt-1 text-xs font-semibold leading-5 text-[#788582]">Hope Church outcomes return here before the requester sees anything.</p></div>}
        </Card>
      </div>
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
  const completed = requests.filter((r) => rawStatus(r) !== "approved_for_partner");

  return (
    <>
      <PageTitle eyebrow="Hope Church" title="Care assignments" description={newAssignments.length ? `${newAssignments.length} Grandview-approved request${newAssignments.length === 1 ? " is" : "s are"} ready for care.` : "No new assignments are waiting right now."} />

      <div className="mb-7 grid gap-3 sm:grid-cols-2">
        <Card className="relative overflow-hidden bg-gradient-to-br from-[#f5edd8] to-[#fffdf9] p-5"><span className="absolute left-0 top-0 h-full w-1.5 bg-[#87713a]" /><p className="text-3xl font-black tracking-[-0.045em] text-[#123044]">{newAssignments.length}</p><p className="mt-1 text-sm font-black text-[#514a34]">Ready for care</p><p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#87713a]">Grandview approved</p></Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-[#edf5ef] to-[#fffdf9] p-5"><span className="absolute left-0 top-0 h-full w-1.5 bg-[#4f8160]" /><p className="text-3xl font-black tracking-[-0.045em] text-[#123044]">{completed.length}</p><p className="mt-1 text-sm font-black text-[#425a64]">Outcome logged</p><p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#4f8160]">Returned to Grandview</p></Card>
      </div>

      <div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#87713a]">Assignments</p><h2 className="mt-1 text-xl font-black text-[#183f35]">Ready for your care team</h2></div><span className="text-xs font-bold text-[#7c8885]">{newAssignments.length} open</span></div>

      {isLoading ? <Card className="p-7 text-sm font-bold text-[#6d7b7e]">Loading assignments…</Card> : newAssignments.length ? (
        <div className="grid gap-4 xl:grid-cols-2">{newAssignments.map((request) => <AssignmentRow key={request.id} request={request} onOpen={onOpen} />)}</div>
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
  const isNew = rawStatus(request) === "approved_for_partner";
  return (
    <button onClick={() => onOpen(request.id)} className="group w-full rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] p-5 text-left shadow-[0_12px_38px_rgba(18,48,68,.05)] transition hover:-translate-y-0.5 hover:border-[#c9bd99] hover:shadow-[0_16px_42px_rgba(18,48,68,.09)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4edda] text-[#806c39]"><SupportIcon name={request.support.includes("Friendly visit") ? "visit" : request.support.includes("Pastoral call") ? "phone" : request.support.includes("Encouragement") ? "heart" : "prayer"} /></span>
        <span className={cx("rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em]", isNew ? "bg-[#f4edda] text-[#745f2b]" : "bg-[#e7f0e9] text-[#346247]")}>{request.partner_outcome ? outcomeLabel(request.partner_outcome) : "New assignment"}</span>
      </div>
      <p className="mt-5 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#183f35]">{request.support.join(" + ") || "Spiritual care"}</p>
      <p className="mt-2 text-xs font-semibold text-[#738184]">{shortId(request.id)} · Approved by Grandview</p>
      <div className="mt-5 flex items-center justify-between border-t border-[#eee9df] pt-4">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a8a78]">Safe spiritual-care context</span>
        <span className="text-xs font-black text-[#806c39]">Open assignment →</span>
      </div>
    </button>
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
        action={<span className={cx("rounded-full px-4 py-2 text-xs font-black", statusPill(status))}>{statusLabel(status, role)}</span>}
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

          {request.partner_outcome && role !== "requester" ? <Card className="p-6"><h2 className="text-xl font-black text-[#183f35]">Care partner update</h2><p className="mt-3 text-sm font-bold text-[#49635b]">{outcomeLabel(request.partner_outcome)}</p></Card> : null}
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
                  : status === "requester_updated" || status === "closed" ? "Your update has been released. This request is complete—no further action is needed."
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
              <ActivityItem done={progressIndex(status) >= 4} label={role === "requester" ? "Update released" : "Requester update"} detail={request.requester_update_status === "released" ? "Released · complete" : "Pending"} />
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
