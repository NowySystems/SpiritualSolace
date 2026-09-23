"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChurchWorkAppShell, type ChurchWorkNavKey, type ChurchWorkNotification } from "@/components/ChurchWorkAppShell";

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
  facility_approved_at?: string | null;
  partner_assigned_at?: string | null;
  partner_outcome_at?: string | null;
  requester_update_released_at?: string | null;
  facility_owner_user_id?: string | null;
  facility_owner_name?: string | null;
  facility_owner_email?: string | null;
  facility_claimed_at?: string | null;
  partner_owner_user_id?: string | null;
  partner_owner_name?: string | null;
  partner_owner_email?: string | null;
  partner_claimed_at?: string | null;
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

function minutesBetween(start?: string | null, end?: string | null) {
  if (!start || !end) return null;
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) return null;
  return (endMs - startMs) / 60000;
}

function minutesSince(value?: string | null) {
  if (!value) return null;
  return minutesBetween(value, new Date().toISOString());
}

function ageLabel(value?: string | null) {
  const minutes = minutesSince(value);
  if (minutes === null) return "Waiting";
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

function stageStartedAt(request: StoredPilotRequest) {
  const status = rawStatus(request);
  if (status === "facility_review") return request.created_at;
  if (status === "approved_for_partner") return request.partner_assigned_at ?? request.facility_approved_at ?? request.updated_at;
  if (status === "partner_outcome_logged") return request.partner_outcome_at ?? request.updated_at;
  return request.requester_update_released_at ?? request.updated_at;
}

function formatDuration(minutes: number | null) {
  if (minutes === null || !Number.isFinite(minutes)) return "—";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(minutes >= 600 ? 0 : 1)}h`;
  return `${(minutes / 1440).toFixed(1)}d`;
}

function average(values: Array<number | null>) {
  const valid = values.filter((value): value is number => value !== null && Number.isFinite(value));
  if (!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function ownerDisplay(request: StoredPilotRequest, role: RoleKey, currentUserId?: string | null) {
  const userId = role === "facility" ? request.facility_owner_user_id : request.partner_owner_user_id;
  const name = role === "facility" ? request.facility_owner_name : request.partner_owner_name;
  const email = role === "facility" ? request.facility_owner_email : request.partner_owner_email;
  if (!userId) return "Unassigned";
  if (currentUserId && userId === currentUserId) return "Assigned to you";
  return name?.trim() || email?.trim() || "Assigned";
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
  const accent = role === "facility" ? "#416f96" : role === "partner" ? "#87713a" : "#2f7b65";
  const ring = role === "facility" ? "#e3edf5" : role === "partner" ? "#f1ead7" : "#dcebe3";

  return (
    <div className={cx("grid", gridClass)}>
      {labels.map((label, step) => {
        const reached = step <= index;
        const current = step === index;
        return (
          <div key={label} className="relative text-center">
            {step < labels.length - 1 ? (
              <span className="absolute left-1/2 top-[11px] h-[2px] w-full" style={{ background: step < index ? accent : "#d8d9d4" }} />
            ) : null}
            <span
              className="relative mx-auto flex h-6 w-6 items-center justify-center rounded-full border-2 bg-[#fffdf9]"
              style={{
                borderColor: reached ? accent : "#cfd1cc",
                boxShadow: current ? `0 0 0 5px ${ring}` : "none"
              }}
            >
              {reached && !current ? <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} /> : null}
              {current ? <span className="h-3 w-3 rounded-full" style={{ background: accent }} /> : null}
            </span>
            <p className={cx("mt-2.5 px-1 text-[10px] font-black sm:text-[11px]", reached ? "text-[#314d49]" : "text-[#929b99]")}>{label}</p>
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading ChurchWork...");

  const selectedRequest = requests.find((item) => item.id === selectedRequestId) ?? null;
  const latestRequest = requests[0] ?? null;

  const counts = useMemo(() => ({
    review: requests.filter((r) => rawStatus(r) === "facility_review").length,
    partner: requests.filter((r) => rawStatus(r) === "approved_for_partner").length,
    release: requests.filter((r) => rawStatus(r) === "partner_outcome_logged").length,
    updated: requests.filter((r) => rawStatus(r) === "requester_updated" || rawStatus(r) === "closed").length
  }), [requests]);

  const notifications = useMemo<ChurchWorkNotification[]>(() => {
    if (role === "requester") return [];

    const items: ChurchWorkNotification[] = [];

    for (const request of requests) {
      const status = rawStatus(request);
      const age = minutesSince(stageStartedAt(request)) ?? 0;

      if (role === "facility" && status === "facility_review") {
        if (!request.facility_owner_user_id) {
          items.push({
            id: `unassigned-review-${request.id}`,
            title: "Grandview review is unassigned",
            detail: `${shortId(request.id)} · waiting ${ageLabel(stageStartedAt(request))}`,
            tone: age >= 1440 ? "urgent" : "attention"
          });
        } else if (age >= 240) {
          items.push({
            id: `aging-review-${request.id}`,
            title: "Grandview review is aging",
            detail: `${shortId(request.id)} · ${ownerDisplay(request, "facility", currentUserId)} · waiting ${ageLabel(stageStartedAt(request))}`,
            tone: age >= 1440 ? "urgent" : "attention"
          });
        }
      }

      if (role === "facility" && status === "partner_outcome_logged") {
        if (!request.facility_owner_user_id || age >= 120) {
          items.push({
            id: `release-${request.id}`,
            title: "Requester update needs release",
            detail: `${shortId(request.id)} · Hope Church responded ${ageLabel(stageStartedAt(request))} ago`,
            tone: age >= 480 ? "urgent" : "attention"
          });
        }
      }

      if (role === "partner" && status === "approved_for_partner") {
        if (!request.partner_owner_user_id) {
          items.push({
            id: `unassigned-partner-${request.id}`,
            title: "Hope Church assignment is unassigned",
            detail: `${shortId(request.id)} · waiting ${ageLabel(stageStartedAt(request))}`,
            tone: age >= 1440 ? "urgent" : "attention"
          });
        } else if (age >= 1440) {
          items.push({
            id: `aging-partner-${request.id}`,
            title: "Care assignment is aging",
            detail: `${shortId(request.id)} · ${ownerDisplay(request, "partner", currentUserId)} · waiting ${ageLabel(stageStartedAt(request))}`,
            tone: age >= 4320 ? "urgent" : "attention"
          });
        }
      }
    }

    return items.slice(0, 12);
  }, [currentUserId, requests, role]);

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
    setCurrentUserId(typeof body.current_user_id === "string" ? body.current_user_id : null);
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


  async function ownershipAction(requestId: string, scope: "facility" | "partner", claim: boolean) {
    setActiveRequestId(requestId);
    const endpoint = scope === "facility" ? "/api/pilot-facility-requests" : "/api/pilot-partner-requests";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action: claim ? "claim" : "release_claim" })
    }).catch(() => null);
    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "Ownership could not be updated.");
      setActiveRequestId(null);
      return;
    }
    if (body.request) replaceRequest(body.request as StoredPilotRequest);
    if (typeof body.current_user_id === "string") setCurrentUserId(body.current_user_id);
    setMessage(typeof body.message === "string" ? body.message : claim ? "Claimed." : "Claim released.");
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
      notifications={notifications}
    >

      {selectedRequest ? (
        <RequestDetail
          role={role}
          request={selectedRequest}
          isBusy={activeRequestId === selectedRequest.id}
          onBack={() => setSelectedRequestId(null)}
          currentUserId={currentUserId}
          onFacilityAction={facilityAction}
          onPartnerAction={partnerAction}
          onOwnershipAction={ownershipAction}
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
          ? <FacilityRequests requests={requests} isLoading={isLoading} onOpen={openRequest} currentUserId={currentUserId} />
          : <FacilityHome requests={requests} counts={counts} isLoading={isLoading} onOpen={openRequest} currentUserId={currentUserId} />
      ) : (
        activeNav === "completed"
          ? <PartnerCompleted requests={requests} onOpen={openRequest} />
          : activeNav === "assignments"
            ? <PartnerAssignments requests={requests} isLoading={isLoading} onOpen={openRequest} currentUserId={currentUserId} />
            : <PartnerHome requests={requests} isLoading={isLoading} onOpen={openRequest} currentUserId={currentUserId} />
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
      <PageTitle
        eyebrow="Requester"
        title="My requests"
        description="Every spiritual-care request, its current stage, and the final update in one place."
        action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#164f3e]/15">+ New Request</button>}
      />
      {isLoading ? <Card className="p-7 text-sm font-bold text-[#68787c]">Loading your requests…</Card> : requests.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {requests.map((request) => (
            <button key={request.id} onClick={() => onOpen(request.id)} className="group rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] p-5 text-left shadow-[0_12px_38px_rgba(18,48,68,.05)] transition hover:-translate-y-0.5 hover:border-[#bed0c5] hover:shadow-[0_16px_42px_rgba(18,48,68,.09)]">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f1eb] text-[#2f7b65]"><SupportIcon name={request.support.includes("Friendly visit") ? "visit" : request.support.includes("Pastoral call") ? "phone" : request.support.includes("Encouragement") ? "heart" : "prayer"} /></span>
                <span className={cx("rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em]", statusPill(rawStatus(request)))}>{statusLabel(rawStatus(request), "requester")}</span>
              </div>
              <h2 className="mt-5 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#183f35]">{request.support.join(" + ") || "Spiritual care request"}</h2>
              <p className="mt-2 text-xs font-semibold text-[#748185]">{shortId(request.id)} · Submitted {formatDate(request.created_at)}</p>
              <div className="mt-5 rounded-xl bg-[#f7f4ed] px-4 py-4">
                <RequestProgress request={request} role="requester" />
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[#eee9df] pt-4">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7a8784]">{request.requester_update ? "Update available" : "ChurchWork is coordinating care"}</span>
                <span className="text-xs font-black text-[#2b6d58]">View request →</span>
              </div>
            </button>
          ))}
        </div>
      ) : <EmptyState title="No requests yet" detail="Your submitted spiritual-care requests will appear here." action={<button onClick={onNew} className="rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-black text-white">Start a request</button>} />}
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

function FacilityHome({ requests, counts, isLoading, onOpen, currentUserId }: { requests: StoredPilotRequest[]; counts: { review: number; partner: number; release: number; updated: number }; isLoading: boolean; onOpen: (id: string) => void; currentUserId: string | null }) {
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
                <div className="flex flex-wrap items-center gap-2"><p className="font-black text-[#183f35]">{request.support.join(" + ") || "Spiritual care request"}</p><span className="rounded-full bg-[#fff0dc] px-2.5 py-1 text-[9px] font-black text-[#85561a]">{ageLabel(stageStartedAt(request))}</span></div>
                <p className="mt-1.5 text-xs font-semibold text-[#768286]">{shortId(request.id)} · {ownerDisplay(request, "facility", currentUserId)}</p>
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
              <div className="flex items-center justify-between gap-3"><p className="font-black text-[#183f35]">{outcomeLabel(request.partner_outcome)}</p><span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-[#4f765d] shadow-sm">{ageLabel(stageStartedAt(request))}</span></div>
              <p className="mt-1.5 text-xs font-semibold text-[#71807d]">{shortId(request.id)} · {ownerDisplay(request, "facility", currentUserId)}</p>
              <p className="mt-4 text-xs font-black text-[#3f7653]">Review & release →</p>
            </button>
          )) : <div className="p-7"><p className="text-sm font-black text-[#34564c]">No updates waiting.</p><p className="mt-1 text-xs font-semibold leading-5 text-[#788582]">Hope Church outcomes return here before the requester sees anything.</p></div>}
        </Card>
      </div>

      <FacilityImpact requests={requests} />
    </>
  );
}

function FacilityRequests({ requests, isLoading, onOpen, currentUserId }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void; currentUserId: string | null }) {
  return (
    <>
      <PageTitle eyebrow="Grandview Post Acute" title="Request queue" description="One view of every spiritual-care request moving through Grandview's review and release process." />
      {isLoading ? <Card className="p-7 text-sm font-bold text-[#6d7b7e]">Loading requests…</Card> : requests.length ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1.3fr_.7fr_.8fr_.9fr_auto] gap-4 border-b border-[#e7e2d9] bg-[#f7f5ef] px-6 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#84908e] md:grid"><span>Request</span><span>Waiting</span><span>Status</span><span>Owner</span><span></span></div>
          {requests.map((request) => {
            const status = rawStatus(request);
            const needsAction = status === "facility_review" || status === "partner_outcome_logged";
            return (
              <button key={request.id} onClick={() => onOpen(request.id)} className={cx("grid w-full gap-3 border-b border-[#eee9df] px-6 py-5 text-left last:border-0 md:grid-cols-[1.3fr_.7fr_.8fr_.9fr_auto] md:items-center", needsAction ? "bg-[#fffdf9] hover:bg-[#fbfaf6]" : "bg-white/50 hover:bg-white")}>
                <div><p className="font-black text-[#183f35]">{request.support.join(" + ") || "Spiritual care request"}</p><p className="mt-1 text-xs font-semibold text-[#7a8688]">{shortId(request.id)} · {formatDate(request.created_at)}</p></div>
                <p className="text-sm font-black text-[#63757a]">{needsAction ? ageLabel(stageStartedAt(request)) : "—"}</p>
                <span className={cx("w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.06em]", statusPill(status))}>{statusLabel(status)}</span>
                <p className="text-xs font-bold text-[#62757a]">{needsAction ? ownerDisplay(request, "facility", currentUserId) : "Stage complete"}</p>
                <span className={cx("w-fit rounded-lg px-4 py-2 text-xs font-black", needsAction ? "bg-[#315f83] text-white" : "border border-[#cfd7d8] bg-white text-[#48616b]")}>{status === "facility_review" ? "Review →" : status === "partner_outcome_logged" ? "Release →" : "View →"}</span>
              </button>
            );
          })}
        </Card>
      ) : <EmptyState title="Queue clear" detail="No Grandview spiritual-care requests are in the queue right now." />}
    </>
  );
}

function PartnerHome({ requests, isLoading, onOpen, currentUserId }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void; currentUserId: string | null }) {
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
        <div className="grid gap-4 xl:grid-cols-2">{newAssignments.map((request) => <AssignmentRow key={request.id} request={request} onOpen={onOpen} currentUserId={currentUserId} />)}</div>
      ) : <EmptyState title="No new assignments" detail="Grandview-approved requests will appear here when they are ready for Hope Church." />}

      <PartnerImpact requests={requests} />
    </>
  );
}

function PartnerAssignments({ requests, isLoading, onOpen, currentUserId }: { requests: StoredPilotRequest[]; isLoading: boolean; onOpen: (id: string) => void; currentUserId: string | null }) {
  const open = requests.filter((request) => rawStatus(request) === "approved_for_partner");
  return (
    <>
      <PageTitle eyebrow="Hope Church" title="Assignments" description="Grandview-approved spiritual-care requests available to Hope Church." />
      {isLoading ? <Card className="p-7 text-sm font-bold text-[#6d7b7e]">Loading assignments…</Card> : open.length ? <div className="grid gap-4 xl:grid-cols-2">{open.map((request) => <AssignmentRow key={request.id} request={request} onOpen={onOpen} currentUserId={currentUserId} />)}</div> : <EmptyState title="No open assignments" detail="Grandview-approved requests will appear here when they are ready for Hope Church." />}
    </>
  );
}

function PartnerCompleted({ requests, onOpen }: { requests: StoredPilotRequest[]; onOpen: (id: string) => void }) {
  const completed = requests.filter((r) => rawStatus(r) !== "approved_for_partner");
  return (
    <>
      <PageTitle eyebrow="Hope Church" title="Completed care" description="Assignments where Hope Church has already logged an outcome and returned it to Grandview." />
      {completed.length ? <div className="grid gap-4 xl:grid-cols-2">{completed.map((request) => <AssignmentRow key={request.id} request={request} onOpen={onOpen} />)}</div> : <EmptyState title="Nothing completed yet" detail="Completed care responses will appear here after Hope Church logs an outcome." />}
    </>
  );
}

function AssignmentRow({ request, onOpen, currentUserId }: { request: StoredPilotRequest; onOpen: (id: string) => void; currentUserId?: string | null }) {
  const isNew = rawStatus(request) === "approved_for_partner";
  return (
    <button onClick={() => onOpen(request.id)} className="group w-full rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] p-5 text-left shadow-[0_12px_38px_rgba(18,48,68,.05)] transition hover:-translate-y-0.5 hover:border-[#c9bd99] hover:shadow-[0_16px_42px_rgba(18,48,68,.09)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4edda] text-[#806c39]"><SupportIcon name={request.support.includes("Friendly visit") ? "visit" : request.support.includes("Pastoral call") ? "phone" : request.support.includes("Encouragement") ? "heart" : "prayer"} /></span>
        <span className={cx("rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em]", isNew ? "bg-[#f4edda] text-[#745f2b]" : "bg-[#e7f0e9] text-[#346247]")}>{request.partner_outcome ? outcomeLabel(request.partner_outcome) : "New assignment"}</span>
      </div>
      <p className="mt-5 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#183f35]">{request.support.join(" + ") || "Spiritual care"}</p>
      <p className="mt-2 text-xs font-semibold text-[#738184]">{shortId(request.id)} · {isNew ? `waiting ${ageLabel(stageStartedAt(request))}` : "Outcome returned to Grandview"}</p>
      <div className="mt-4 flex items-center gap-2"><span className={cx("rounded-full px-3 py-1.5 text-[10px] font-black", request.partner_owner_user_id ? "bg-[#f1ead7] text-[#6b5a2e]" : "bg-[#fff0dc] text-[#85561a]")}>{isNew ? ownerDisplay(request, "partner", currentUserId) : "Stage complete"}</span></div>
      <div className="mt-5 flex items-center justify-between border-t border-[#eee9df] pt-4">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a8a78]">Safe spiritual-care context</span>
        <span className="text-xs font-black text-[#806c39]">Open assignment →</span>
      </div>
    </button>
  );
}


function FacilityImpact({ requests }: { requests: StoredPilotRequest[] }) {
  const reviewAvg = average(requests.map((request) => minutesBetween(request.created_at, request.facility_approved_at)));
  const releaseAvg = average(requests.map((request) => minutesBetween(request.partner_outcome_at, request.requester_update_released_at)));
  const completed = requests.filter((request) => request.requester_update_released_at || rawStatus(request) === "closed").length;

  return (
    <section className="mt-8">
      <div className="mb-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#416f96]">Pilot impact</p><h2 className="mt-1 text-xl font-black text-[#183f35]">How the care loop is performing</h2></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5"><p className="text-2xl font-black text-[#123044]">{formatDuration(reviewAvg)}</p><p className="mt-1 text-sm font-black text-[#425a64]">Avg. Grandview review</p></Card>
        <Card className="p-5"><p className="text-2xl font-black text-[#123044]">{formatDuration(releaseAvg)}</p><p className="mt-1 text-sm font-black text-[#425a64]">Avg. update release</p></Card>
        <Card className="p-5"><p className="text-2xl font-black text-[#123044]">{completed}</p><p className="mt-1 text-sm font-black text-[#425a64]">Closed-loop requests</p></Card>
      </div>
    </section>
  );
}

function PartnerImpact({ requests }: { requests: StoredPilotRequest[] }) {
  const outcomeCount = requests.filter((request) => request.partner_outcome).length;
  const visits = requests.filter((request) => request.partner_outcome === "visit_completed").length;
  const prayers = requests.filter((request) => request.partner_outcome === "prayer_logged").length;
  const responseAvg = average(requests.map((request) => minutesBetween(request.partner_assigned_at, request.partner_outcome_at)));

  return (
    <section className="mt-8">
      <div className="mb-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#87713a]">Care impact</p><h2 className="mt-1 text-xl font-black text-[#183f35]">Hope Church activity</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><p className="text-2xl font-black text-[#123044]">{outcomeCount}</p><p className="mt-1 text-sm font-black text-[#425a64]">Outcomes logged</p></Card>
        <Card className="p-5"><p className="text-2xl font-black text-[#123044]">{visits}</p><p className="mt-1 text-sm font-black text-[#425a64]">Visits completed</p></Card>
        <Card className="p-5"><p className="text-2xl font-black text-[#123044]">{prayers}</p><p className="mt-1 text-sm font-black text-[#425a64]">Prayers logged</p></Card>
        <Card className="p-5"><p className="text-2xl font-black text-[#123044]">{formatDuration(responseAvg)}</p><p className="mt-1 text-sm font-black text-[#425a64]">Avg. response</p></Card>
      </div>
    </section>
  );
}

function RequestDetail({ role, request, isBusy, currentUserId, onBack, onFacilityAction, onPartnerAction, onOwnershipAction }: {
  role: RoleKey; request: StoredPilotRequest; isBusy: boolean; currentUserId: string | null; onBack: () => void;
  onFacilityAction: (id: string, action: "approve" | "release_update") => Promise<void>;
  onPartnerAction: (id: string, outcome: PartnerOutcome) => Promise<void>;
  onOwnershipAction: (id: string, scope: "facility" | "partner", claim: boolean) => Promise<void>;
}) {
  const status = rawStatus(request);
  const canApprove = role === "facility" && status === "facility_review";
  const canRelease = role === "facility" && status === "partner_outcome_logged" && request.requester_update_status !== "released";
  const canPartnerReport = role === "partner" && status === "approved_for_partner";
  const activeOwnershipStage = canApprove || canRelease || canPartnerReport;
  const ownerUserId = role === "facility" ? request.facility_owner_user_id : role === "partner" ? request.partner_owner_user_id : null;
  const claimedByMe = Boolean(ownerUserId && currentUserId && ownerUserId === currentUserId);
  const claimedByOther = Boolean(ownerUserId && !claimedByMe);
  const ownerLabel = role === "requester" ? "" : ownerDisplay(request, role, currentUserId);
  const accent = role === "facility" ? "#416f96" : role === "partner" ? "#87713a" : "#2f7b65";
  const soft = role === "facility" ? "#eaf2f8" : role === "partner" ? "#f4edda" : "#e7f1eb";

  return (
    <>
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-xs font-black text-[#5e737b] hover:text-[#234750]">← Back to {role === "facility" ? "requests" : role === "partner" ? "assignments" : "my requests"}</button>

      <Card className="relative overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: accent }} />
        <div className="grid gap-0 xl:grid-cols-[1.25fr_.75fr]">
          <div className="p-6 pl-7 sm:p-8 sm:pl-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: accent }}>{role === "partner" ? "Hope Church assignment" : role === "facility" ? "Grandview request" : "My spiritual-care request"}</p>
                <h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em] text-[#123044] sm:text-4xl">{request.support.join(" + ") || "Spiritual care"}</h1>
                <p className="mt-2 text-sm font-semibold text-[#738185]">{shortId(request.id)} · Submitted {formatDate(request.created_at)}</p>
              </div>
              <span className={cx("rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.08em]", statusPill(status))}>{statusLabel(status, role)}</span>
            </div>

            <div className="mt-7 rounded-2xl border border-[#e1ddd3] bg-[#faf8f3] px-4 py-5 sm:px-6">
              <RequestProgress request={request} role={role} />
            </div>
          </div>

          <aside className="border-t border-[#e5e0d7] p-6 sm:p-8 xl:border-l xl:border-t-0" style={{ background: soft }}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: accent }}>Current step</p>
            <p className="mt-2 font-serif text-2xl font-semibold tracking-[-0.035em] text-[#183f35]">
              {role === "facility" && canApprove ? "Grandview review"
                : role === "facility" && canRelease ? "Release requester update"
                : role === "partner" && canPartnerReport ? "Provide care & report outcome"
                : role === "requester" && status === "facility_review" ? "Grandview review"
                : role === "requester" && status === "approved_for_partner" ? "Care in progress"
                : role === "requester" && status === "partner_outcome_logged" ? "Update in review"
                : "No action needed"}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#667773]">
              {role === "facility" && canApprove ? "Review the safe spiritual-care summary, then approve it for Hope Church."
                : role === "facility" && canRelease ? "Hope Church has returned an outcome. Grandview controls the final requester update."
                : role === "partner" && canPartnerReport ? "Choose the outcome that best reflects the spiritual care provided."
                : role === "requester" ? "ChurchWork coordinates the handoffs for you. You do not need to close the request."
                : "This part of the workflow is complete."}
            </p>
            {activeOwnershipStage ? <p className="mt-4 inline-flex rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-black" style={{ color: accent }}>Waiting {ageLabel(stageStartedAt(request))}</p> : null}
          </aside>
        </div>
      </Card>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_23rem]">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="border-b border-[#ebe6dc] bg-[#fffdf9] px-6 py-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8884]">Request</p>
              <h2 className="mt-1 text-lg font-black text-[#183f35]">{role === "partner" ? "Approved spiritual-care context" : "Safe request summary"}</h2>
            </div>
            <div className="p-6">
              <p className="text-base font-semibold leading-7 text-[#4f646c]">{request.safe_note || "Structured spiritual-care request."}</p>
              <div className="mt-5 flex flex-wrap gap-2">{request.support.map((item) => <span key={item} className="rounded-full px-3 py-2 text-xs font-black" style={{ background: soft, color: accent }}>{item}</span>)}</div>
              <div className="mt-5 flex gap-3 rounded-2xl bg-[#f5f2eb] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#527064] shadow-sm"><SupportIcon name="heart" /></span>
                <div><p className="text-xs font-black text-[#34564c]">Spiritual-care scope</p><p className="mt-1 text-xs font-semibold leading-5 text-[#6d7978]">Medical or clinical information is not part of the requester submission or partner assignment.</p></div>
              </div>
            </div>
          </Card>

          {request.partner_outcome && role !== "requester" ? (
            <Card className="overflow-hidden">
              <div className="border-b border-[#dce8df] bg-[#eff6f0] px-6 py-5"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#4f8160]">Hope Church outcome</p><h2 className="mt-1 text-lg font-black text-[#183f35]">{outcomeLabel(request.partner_outcome)}</h2></div>
              <div className="p-6 text-sm font-semibold leading-6 text-[#60726b]">This outcome returns to Grandview before any requester-facing update is released.</div>
            </Card>
          ) : null}

          {role === "requester" && request.requester_update ? (
            <Card className="overflow-hidden border-[#bcd7c6]">
              <div className="bg-[#173f34] px-6 py-5 text-white"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Released update</p><h2 className="mt-1 font-serif text-2xl font-semibold">Your care update</h2></div>
              <div className="bg-[#f0f7f3] p-6"><p className="text-sm font-bold leading-7 text-[#355d4e]">{request.requester_update}</p><p className="mt-4 text-xs font-semibold text-[#637870]">This request is complete. No further action is needed.</p></div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <Card className="overflow-hidden">
            <div className="px-6 py-5 text-white" style={{ background: accent }}>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">{role === "requester" ? "What happens next" : "Your next action"}</p>
              <h2 className="mt-1 font-serif text-xl font-semibold">Next step</h2>
            </div>
            <div className="p-6">
              {role !== "requester" && activeOwnershipStage ? (
                <div className="mb-5 rounded-2xl border border-[#e0dbd1] bg-[#f8f5ef] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7d8784]">Stage owner</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div>
                      <p className={cx("text-sm font-black", claimedByOther ? "text-[#7a5a29]" : "text-[#294e42]")}>{ownerLabel}</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#788582]">{ownerUserId ? "This owner has responsibility for the current stage." : "Claim it so the team knows who is handling it."}</p>
                    </div>
                    {!ownerUserId ? (
                      <button disabled={isBusy} onClick={() => void onOwnershipAction(request.id, role, true)} className="shrink-0 rounded-xl border border-[#cfd8d2] bg-white px-3 py-2 text-xs font-black text-[#315f49] shadow-sm disabled:opacity-50">Claim</button>
                    ) : claimedByMe ? (
                      <button disabled={isBusy} onClick={() => void onOwnershipAction(request.id, role, false)} className="shrink-0 rounded-xl border border-[#ddd5c9] bg-white px-3 py-2 text-xs font-black text-[#6d7472] shadow-sm disabled:opacity-50">Release</button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {role === "facility" ? (
                <>
                  <p className="text-sm font-semibold leading-6 text-[#65757a]">{canApprove ? "Review the safe request, then approve it for Hope Church." : canRelease ? "Review Hope Church's outcome and release the standardized update to the requester." : "No Grandview action is required right now."}</p>
                  {canApprove ? <button disabled={isBusy} onClick={() => void onFacilityAction(request.id, "approve")} className="mt-5 w-full rounded-xl bg-[#315f83] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#315f83]/15 disabled:opacity-50">{isBusy ? "Working…" : "Approve for Hope Church"}</button> : null}
                  {canRelease ? <button disabled={isBusy} onClick={() => void onFacilityAction(request.id, "release_update")} className="mt-5 w-full rounded-xl bg-[#3f7653] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#3f7653]/15 disabled:opacity-50">{isBusy ? "Working…" : "Release safe update"}</button> : null}
                </>
              ) : role === "partner" ? (
                <>
                  <p className="text-sm font-semibold leading-6 text-[#65757a]">{canPartnerReport ? "Log the spiritual-care outcome. Grandview will review it before the requester sees an update." : "Your outcome has been returned to Grandview. No additional action is required."}</p>
                  {canPartnerReport ? <div className="mt-4 space-y-2">{partnerOutcomes.map((outcome) => <button key={outcome.value} disabled={isBusy} onClick={() => void onPartnerAction(request.id, outcome.value)} className="group w-full rounded-xl border border-[#ddd8ca] bg-white p-3.5 text-left transition hover:border-[#b9aa7d] hover:bg-[#faf7ed] disabled:opacity-50"><span className="block text-sm font-black text-[#183f35]">{outcome.label}</span><span className="mt-1 block text-xs font-medium leading-5 text-[#718083]">{outcome.detail}</span></button>)}</div> : null}
                </>
              ) : (
                <p className="text-sm font-semibold leading-6 text-[#65757a]">
                  {status === "facility_review" ? "Grandview is reviewing your request."
                    : status === "approved_for_partner" ? "Hope Church is caring for your request."
                    : status === "partner_outcome_logged" ? "Grandview is reviewing the care update before anything is released."
                    : status === "requester_updated" || status === "closed" ? "Your update has been released. This request is complete."
                    : "ChurchWork is keeping your request moving."}
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8884]">Activity</p>
            <div className="mt-5 space-y-5 text-sm">
              <ActivityItem done label="Request submitted" detail={formatDate(request.created_at, true)} />
              <ActivityItem done={progressIndex(status) >= 2} label="Grandview review" detail={progressIndex(status) >= 2 ? "Approved" : "In review"} />
              <ActivityItem done={progressIndex(status) >= 3} label="Hope Church care" detail={request.partner_outcome ? outcomeLabel(request.partner_outcome) : progressIndex(status) >= 2 ? "Engaged" : "Pending"} />
              <ActivityItem done={progressIndex(status) >= 4} label={role === "requester" ? "Update released" : "Requester update"} detail={request.requester_update_status === "released" ? "Released · complete" : "Pending"} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function ActivityItem({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return <div className="flex gap-3"><span className={cx("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-black", done ? "border-[#2f7b65] bg-[#2f7b65] text-white shadow-sm" : "border-[#cfd2cd] bg-white text-transparent")}>✓</span><div><p className="font-black text-[#294b42]">{label}</p><p className="mt-0.5 text-xs font-semibold leading-5 text-[#7b8886]">{detail}</p></div></div>;
}

