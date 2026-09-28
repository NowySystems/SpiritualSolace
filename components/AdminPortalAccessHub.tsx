"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChurchWorkAppShell, type ChurchWorkNavKey } from "@/components/ChurchWorkAppShell";
import { OperatorAccessManager } from "@/components/OperatorAccessManager";
import { OperatorAuditFeed } from "@/components/OperatorAuditFeed";
import { PilotInviteManager } from "@/components/PilotInviteManager";
import { PilotAccessApplications } from "@/components/PilotAccessApplications";

type PilotSummary = {
  requests_total: number;
  facility_review: number;
  approved_for_partner: number;
  partner_outcome_logged: number;
  requester_updated: number;
  closed: number;
};

type PilotStaffing = {
  grandview_reviewers: number;
  hope_partner_users: number;
  pending_facility_invites: number;
  pending_partner_invites?: number;
};

type PilotImpact = {
  requests_total: number;
  requests_last_30_days: number;
  completed_requests: number;
  care_outcomes_logged: number;
  prayers_logged: number;
  visits_planned: number;
  visits_completed: number;
  follow_up_requested: number;
  avg_review_minutes: number | null;
  avg_partner_response_minutes: number | null;
  avg_release_minutes: number | null;
  avg_end_to_end_minutes: number | null;
};

type OperatorRole = { role: string; status: string; organization_name: string; organization_slug: string };
type OperatorUser = { id: string; email: string | null; full_name: string | null; status: string; created_at: string; roles: OperatorRole[] };
type OperatorRequest = {
  id: string;
  requester_email: string | null;
  support_options: string[] | null;
  status: string;
  partner_outcome: string | null;
  requester_update: string | null;
  created_at: string;
  updated_at: string;
  facility_approved_at?: string | null;
  partner_assigned_at?: string | null;
  requester_update_released_at?: string | null;
  facility_owner_user_id?: string | null;
  facility_owner_name?: string | null;
  facility_owner_email?: string | null;
  facility_claimed_at?: string | null;
  partner_owner_user_id?: string | null;
  partner_owner_name?: string | null;
  partner_owner_email?: string | null;
  partner_claimed_at?: string | null;
};

type OperatorSnapshot = {
  is_admin: boolean;
  access_level?: "platform_admin" | "pilot_admin";
  can_manage_access?: boolean;
  can_view_activity?: boolean;
  current_user_id: string;
  summary: PilotSummary;
  staffing: PilotStaffing;
  impact: PilotImpact;
  users: OperatorUser[];
  recent_requests: OperatorRequest[];
};

type OverviewResponse = {
  ok: boolean;
  email?: string | null;
  diagnosticsAccessConfigured?: boolean;
  snapshot?: OperatorSnapshot;
  message?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function statusLabel(status: string) {
  if (status === "facility_review") return "Needs Review";
  if (status === "approved_for_partner") return "With Care Partner";
  if (status === "partner_outcome_logged") return "Ready to Release";
  if (status === "requester_updated") return "Requester Updated";
  if (status === "closed") return "Closed";
  return status.replaceAll("_", " ");
}

function statusClass(status: string) {
  if (status === "facility_review") return "bg-[#fff0dc] text-[#85561a]";
  if (status === "approved_for_partner") return "bg-[#e2edf8] text-[#285e8b]";
  if (status === "partner_outcome_logged") return "bg-[#e5f1e8] text-[#2d6b50]";
  return "bg-[#e7efe8] text-[#315f49]";
}

function minutesSince(value?: string | null) {
  if (!value) return null;
  const start = new Date(value).getTime();
  if (!Number.isFinite(start)) return null;
  return Math.max(0, (Date.now() - start) / 60000);
}

function ageLabel(value?: string | null) {
  const minutes = minutesSince(value);
  if (minutes === null) return "waiting";
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

function durationLabel(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return "—";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(minutes >= 600 ? 0 : 1)}h`;
  return `${(minutes / 1440).toFixed(1)}d`;
}

function stageStartedAt(request: OperatorRequest) {
  if (request.status === "facility_review") return request.created_at;
  if (request.status === "approved_for_partner") return request.partner_assigned_at ?? request.updated_at;
  if (request.status === "partner_outcome_logged") return request.updated_at;
  return request.requester_update_released_at ?? request.updated_at;
}

function messageFromBody(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") return body.message;
  return fallback;
}

function Metric({ value, label, tone, accent }: { value: number; label: string; tone: string; accent: string }) {
  return (
    <article className={`relative overflow-hidden rounded-[1.35rem] border border-[#ded9cf] p-5 shadow-[0_12px_38px_rgba(18,48,68,.05)] ${tone}`}>
      <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: accent }} />
      <p className="text-3xl font-black tracking-[-0.045em] text-[#123044]">{value}</p>
      <p className="mt-1 text-sm font-black text-[#435b65]">{label}</p>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: accent }}>{value ? "Active" : "Clear"}</p>
    </article>
  );
}

export function AdminPortalAccessHub() {
  const [snapshot, setSnapshot] = useState<OperatorSnapshot | null>(null);
  const [operatorEmail, setOperatorEmail] = useState<string | null>(null);
  const [diagnosticsConfigured, setDiagnosticsConfigured] = useState(false);
  const [activeNav, setActiveNav] = useState<ChurchWorkNavKey>("overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBusy, setIsBusy] = useState(true);
  const [message, setMessage] = useState("Checking operator session...");

  async function loadOverview() {
    setIsBusy(true);
    const response = await fetch("/api/operator-overview", { cache: "no-store" }).catch(() => null);
    if (!response) {
      setSnapshot(null);
      setMessage("ChurchWork operator service is unreachable.");
      setIsBusy(false);
      return;
    }
    const body = await response.json().catch(() => null) as OverviewResponse | null;
    if (!response.ok || !body?.ok || !body.snapshot) {
      setSnapshot(null);
      setOperatorEmail(null);
      setMessage(response.status === 401 ? "Sign in with a ChurchWork admin or Pilot Admin account." : messageFromBody(body, "Operator data is unavailable."));
      setIsBusy(false);
      return;
    }
    setSnapshot(body.snapshot);
    setOperatorEmail(body.email ?? null);
    setDiagnosticsConfigured(body.diagnosticsAccessConfigured === true);
    setMessage("Current");
    setIsBusy(false);
  }

  useEffect(() => { void loadOverview(); }, []);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Verifying ChurchWork admin access...");
    const response = await fetch("/api/operator-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).catch(() => null);
    if (!response) {
      setMessage("ChurchWork operator authentication is unreachable.");
      setIsBusy(false);
      return;
    }
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      setMessage(messageFromBody(body, "Operator sign-in failed."));
      setIsBusy(false);
      return;
    }
    setPassword("");
    await loadOverview();
  }

  async function handleSignOut() {
    setIsBusy(true);
    await fetch("/api/operator-sign-out", { method: "POST" }).catch(() => null);
    setSnapshot(null);
    setOperatorEmail(null);
    setPassword("");
    setMessage("Signed out.");
    setIsBusy(false);
  }

  if (!snapshot) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f3efe7] px-5 py-8 text-[#123044]">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(111,92,140,.18),transparent_30rem),radial-gradient(circle_at_85%_90%,rgba(216,193,134,.20),transparent_30rem)]" />
        <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1fr_27rem]">
          <div>
            <a href="/" className="inline-flex items-center gap-3 rounded-2xl border border-[#ded9cf] bg-[#fffdf9]/85 px-4 py-3 shadow-lg shadow-[#123044]/5 backdrop-blur">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-9 w-12 object-contain" />
              <span className="font-serif text-2xl font-semibold tracking-[-0.045em]">Church<span className="text-[#6f5c8c]">Work</span></span>
            </a>
            <span className="mt-10 inline-flex rounded-full border border-[#d8cfe1] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5c8c]">Platform admin</span>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">Operate the care network without touching the database.</h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-[#62747a]">Monitor requests, manage access, see Grandview and Hope Church readiness, and follow the pilot audit trail from one protected workspace.</p>
          </div>
          <form onSubmit={handleSignIn} className="rounded-[1.6rem] border border-[#ded9cf] bg-[#fffdf9] p-7 shadow-[0_28px_80px_rgba(35,42,53,.13)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5c8c]">Admin / Pilot Admin</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Open operations</h2>
            <label className="mt-6 block text-sm font-black text-[#28463d]">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-xl border border-[#d8d3c9] bg-white px-4 py-3 outline-none focus:border-[#2f7b65]" /></label>
            <label className="mt-4 block text-sm font-black text-[#28463d]">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="mt-2 w-full rounded-xl border border-[#d8d3c9] bg-white px-4 py-3 outline-none focus:border-[#2f7b65]" /></label>
            <button type="submit" disabled={isBusy} className="mt-6 w-full rounded-xl bg-[#164f3e] px-5 py-3 text-sm font-extrabold text-white disabled:opacity-50">{isBusy ? "Checking..." : "Open admin"}</button>
            <p className="mt-4 text-xs font-semibold leading-5 text-[#6a797d]">{message}</p>
          </form>
        </section>
      </main>
    );
  }

  const { summary, staffing, impact, users, recent_requests: requests } = snapshot;
  const canManageAccess = snapshot.can_manage_access === true;
  const canViewActivity = snapshot.can_view_activity === true;
  const isPilotAdmin = snapshot.access_level === "pilot_admin";

  const notifications = requests.flatMap((request) => {
    const age = minutesSince(stageStartedAt(request)) ?? 0;
    if (request.status === "facility_review" && (!request.facility_owner_user_id || age >= 240)) {
      return [{
        id: `admin-review-${request.id}`,
        title: request.facility_owner_user_id ? "Grandview review is aging" : "Grandview review is unassigned",
        detail: `${request.id.slice(0, 6).toUpperCase()} · waiting ${ageLabel(stageStartedAt(request))}`,
        tone: age >= 1440 ? "urgent" as const : "attention" as const
      }];
    }
    if (request.status === "approved_for_partner" && (!request.partner_owner_user_id || age >= 1440)) {
      return [{
        id: `admin-partner-${request.id}`,
        title: request.partner_owner_user_id ? "Hope Church assignment is aging" : "Hope Church assignment is unassigned",
        detail: `${request.id.slice(0, 6).toUpperCase()} · waiting ${ageLabel(stageStartedAt(request))}`,
        tone: age >= 4320 ? "urgent" as const : "attention" as const
      }];
    }
    if (request.status === "partner_outcome_logged" && (!request.facility_owner_user_id || age >= 120)) {
      return [{
        id: `admin-release-${request.id}`,
        title: "Requester update is waiting on Grandview",
        detail: `${request.id.slice(0, 6).toUpperCase()} · waiting ${ageLabel(stageStartedAt(request))}`,
        tone: age >= 480 ? "urgent" as const : "attention" as const
      }];
    }
    return [];
  }).slice(0, 12);
  const navItems = [
    { key: "overview" as const, label: "Overview", icon: "home" as const },
    { key: "requests" as const, label: "Requests", icon: "request" as const },
    { key: "organizations" as const, label: "Organizations", icon: "building" as const },
    ...(canManageAccess ? [{ key: "users" as const, label: "Users & Roles", icon: "people" as const }] : []),
    { key: "impact" as const, label: "Impact", icon: "activity" as const },
    ...(canViewActivity ? [{ key: "activity" as const, label: "Activity", icon: "activity" as const }] : [])
  ];

  return (
    <ChurchWorkAppShell organization="ChurchWork Operations" currentPortal="admin" accountLabel={operatorEmail ?? "Operator"} navItems={navItems} activeKey={activeNav} onNavigate={setActiveNav} onSignOut={() => void handleSignOut()} notifications={notifications}>

      {activeNav === "overview" ? (
        <>
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-[#d8cfe1] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5c8c]">{isPilotAdmin ? "Pilot Admin" : "Owner console"}</span>
              <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.055em] text-[#102f40] sm:text-[2.8rem]">Pilot operations</h1>
              <p className="mt-2 text-sm font-medium text-[#66777c]">A live view of requests, partner readiness, and ChurchWork access.</p>
            </div>
            <button onClick={() => void loadOverview()} disabled={isBusy} className="rounded-xl border border-[#d6d0c7] bg-white/75 px-4 py-2.5 text-xs font-black text-[#5d6870] shadow-sm hover:bg-white">↻ Refresh</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric value={summary.requests_total} label="Total Requests" tone="bg-gradient-to-br from-[#f5f2f8] to-[#fffdf9]" accent="#6f5c8c" />
            <Metric value={summary.facility_review} label="Needs Review" tone="bg-gradient-to-br from-[#fff1ee] to-[#fffdf9]" accent="#a65d51" />
            <Metric value={summary.approved_for_partner} label="With Hope Church" tone="bg-gradient-to-br from-[#edf4fa] to-[#fffdf9]" accent="#416f96" />
            <Metric value={summary.partner_outcome_logged} label="Ready to Release" tone="bg-gradient-to-br from-[#eaf5ed] to-[#fffdf9]" accent="#3f7f5a" />
            <Metric value={summary.requester_updated + summary.closed} label="Completed / Updated" tone="bg-gradient-to-br from-[#f2f2ef] to-[#fffdf9]" accent="#687574" />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
            <section className="overflow-hidden rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] shadow-[0_12px_38px_rgba(18,48,68,.05)]">
              <div className="flex items-center justify-between border-b border-[#ebe6dc] px-6 py-5"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7d8784]">Live workflow</p><h2 className="mt-1 text-lg font-black text-[#183f35]">Recent requests</h2></div><button onClick={() => setActiveNav("requests")} className="text-xs font-black text-[#6f5c8c]">View all →</button></div>
              {requests.length ? requests.slice(0, 6).map((request) => (
                <div key={request.id} className="grid gap-2 border-b border-[#eee9df] px-6 py-4 last:border-0 md:grid-cols-[1.3fr_.8fr_auto] md:items-center">
                  <div><p className="font-black text-[#183f35]">{request.support_options?.join(" + ") || "Spiritual care request"}</p><p className="mt-1 text-xs font-semibold text-[#7a8688]">{request.requester_email ?? "Requester"} · {formatDate(request.created_at)}</p></div>
                  <p className="text-sm font-semibold text-[#64767b]">{request.requester_update ? "Update released" : request.partner_outcome ? "Partner responded" : "In progress"}</p>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${statusClass(request.status)}`}>{statusLabel(request.status)}</span>
                </div>
              )) : <p className="p-6 text-sm font-semibold text-[#6d7b7e]">No pilot requests yet.</p>}
            </section>

            <div className="space-y-5">
              <section className="overflow-hidden rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] shadow-[0_12px_38px_rgba(18,48,68,.05)]">
                <div className="border-b border-[#ebe6dc] px-6 py-5"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7d8784]">Pilot network</p><h2 className="mt-1 text-lg font-black text-[#183f35]">Organization readiness</h2></div>
                <div className="space-y-3 p-5">
                  <div className="relative overflow-hidden rounded-2xl border border-[#d9e3ea] bg-[#eef4f8] p-4"><span className="absolute inset-y-0 left-0 w-1.5 bg-[#416f96]" /><div className="flex items-center justify-between"><div><p className="font-black">Grandview Post Acute</p><p className="text-xs font-semibold text-[#6f7e84]">Facility reviewers</p></div><span className="text-2xl font-black text-[#294c69]">{staffing.grandview_reviewers}</span></div></div>
                  <div className="relative overflow-hidden rounded-2xl border border-[#e4dcc3] bg-[#f6f0df] p-4"><span className="absolute inset-y-0 left-0 w-1.5 bg-[#87713a]" /><div className="flex items-center justify-between"><div><p className="font-black">Hope Church</p><p className="text-xs font-semibold text-[#746b50]">Care partner users</p></div><span className="text-2xl font-black text-[#5f512d]">{staffing.hope_partner_users}</span></div></div>
                </div>
              </section>
              <section className="rounded-2xl border border-[#ded9cf] bg-[#fffdf9] p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#183f35]">Quick actions</h2>
                <div className="mt-4 grid gap-2">
                  {canManageAccess ? <button onClick={() => setActiveNav("users")} className="rounded-xl border border-[#ded9cf] px-4 py-3 text-left text-sm font-extrabold">Invite / manage users</button> : null}
                  <button onClick={() => setActiveNav("requests")} className="rounded-xl border border-[#ded9cf] px-4 py-3 text-left text-sm font-extrabold">View requests</button>
                  <button onClick={() => setActiveNav("impact")} className="rounded-xl border border-[#ded9cf] px-4 py-3 text-left text-sm font-extrabold">View impact</button>
                  {canViewActivity ? <button onClick={() => setActiveNav("activity")} className="rounded-xl border border-[#ded9cf] px-4 py-3 text-left text-sm font-extrabold">View activity</button> : null}
                </div>
              </section>
            </div>
          </div>
        </>
      ) : null}

      {activeNav === "requests" ? (
        <>
          <div className="mb-6"><h1 className="font-serif text-4xl font-semibold tracking-[-0.04em]">Requests</h1><p className="mt-2 text-sm font-medium text-[#66777c]">Recent live pilot request records.</p></div>
          <section className="rounded-2xl border border-[#ded9cf] bg-[#fffdf9] shadow-sm">
            {requests.length ? requests.map((request) => (
              <div key={request.id} className="grid gap-3 border-b border-[#eee9df] px-6 py-4 last:border-0 md:grid-cols-[1.4fr_.8fr_.8fr] md:items-center">
                <div><p className="font-black text-[#183f35]">{request.support_options?.join(" + ") || "Spiritual care request"}</p><p className="mt-1 text-xs font-semibold text-[#7a8688]">{request.requester_email ?? "Requester"} · {formatDate(request.created_at)}</p></div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${statusClass(request.status)}`}>{statusLabel(request.status)}</span>
                <p className="text-sm font-semibold text-[#64767b]">{request.partner_outcome ? request.partner_outcome.replaceAll("_", " ") : "No partner outcome yet"}</p>
              </div>
            )) : <p className="p-6 text-sm font-semibold text-[#6d7b7e]">No pilot requests yet.</p>}
          </section>
        </>
      ) : null}

      {activeNav === "organizations" ? (
        <>
          <div className="mb-7"><span className="inline-flex rounded-full border border-[#d8cfe1] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5c8c]">Pilot network</span><h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.055em] text-[#102f40]">Organizations</h1><p className="mt-2 text-sm font-medium text-[#66777c]">The real organizations operating the ChurchWork pilot.</p></div>
          <div className="grid gap-5 md:grid-cols-2">
            <section className="relative overflow-hidden rounded-[1.5rem] border border-[#d5e0e8] bg-gradient-to-br from-[#eaf2f8] to-[#fffdf9] p-7 shadow-[0_16px_44px_rgba(18,48,68,.06)]"><span className="absolute inset-y-0 left-0 w-2 bg-[#416f96]" /><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#416f96]">Facility partner</p><h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#183f35]">Grandview Post Acute</h2><p className="mt-3 text-sm font-semibold leading-6 text-[#68787c]">Reviews requester submissions, controls partner release, and approves requester-facing updates.</p><div className="mt-6 flex gap-3"><span className="rounded-xl bg-white px-4 py-3 text-sm font-black shadow-sm">{staffing.grandview_reviewers} active reviewer{staffing.grandview_reviewers === 1 ? "" : "s"}</span><span className="rounded-xl bg-white px-4 py-3 text-sm font-black shadow-sm">{staffing.pending_facility_invites} pending invite{staffing.pending_facility_invites === 1 ? "" : "s"}</span></div></section>
            <section className="relative overflow-hidden rounded-[1.5rem] border border-[#e2dac0] bg-gradient-to-br from-[#f4edda] to-[#fffdf9] p-7 shadow-[0_16px_44px_rgba(18,48,68,.06)]"><span className="absolute inset-y-0 left-0 w-2 bg-[#87713a]" /><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#87713a]">Care partner</p><h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#183f35]">Hope Church</h2><p className="mt-3 text-sm font-semibold leading-6 text-[#68787c]">Receives Grandview-approved spiritual-care context and returns structured outcomes to Grandview.</p><div className="mt-6"><span className="rounded-xl bg-white px-4 py-3 text-sm font-black shadow-sm">{staffing.hope_partner_users} active partner user{staffing.hope_partner_users === 1 ? "" : "s"}</span><span className="rounded-xl bg-white px-4 py-3 text-sm font-black shadow-sm">{staffing.pending_partner_invites ?? 0} pending invite{(staffing.pending_partner_invites ?? 0) === 1 ? "" : "s"}</span></div></section>
          </div>
        </>
      ) : null}

      {canManageAccess && activeNav === "users" ? (
        <>
          <div className="mb-6"><h1 className="font-serif text-4xl font-semibold tracking-[-0.04em]">Users & Roles</h1><p className="mt-2 text-sm font-medium text-[#66777c]">Invite new pilot users and manage access for existing ChurchWork accounts.</p></div>
          <PilotAccessApplications />
          <div className="mt-5"><PilotInviteManager /></div>
          <div className="mt-5"><OperatorAccessManager /></div>
          <section className="mt-5 rounded-2xl border border-[#ded9cf] bg-[#fffdf9] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#183f35]">Current users</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {users.map((user) => (
                <article key={user.id} className="rounded-xl border border-[#e4e0d7] bg-[#faf8f3] p-4">
                  <p className="font-black">{user.email ?? "No email"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">{user.roles?.length ? user.roles.map((role) => <span key={`${role.organization_slug}-${role.role}`} className="rounded-full bg-white px-3 py-1 text-xs font-bold ring-1 ring-[#ded9cf]">{role.organization_name}: {role.role}</span>) : <span className="text-xs font-semibold text-[#7c8785]">No active role</span>}</div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeNav === "impact" ? (
        <>
          <div className="mb-7">
            <span className="inline-flex rounded-full border border-[#d8cfe1] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5c8c]">Pilot outcomes</span>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.055em] text-[#102f40]">Impact</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#66777c]">A closed-loop view of how quickly requests move and what spiritual care is being delivered.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric value={impact.completed_requests} label="Closed-loop Requests" tone="bg-gradient-to-br from-[#eaf5ed] to-[#fffdf9]" accent="#3f7f5a" />
            <Metric value={impact.care_outcomes_logged} label="Care Outcomes" tone="bg-gradient-to-br from-[#f4edda] to-[#fffdf9]" accent="#87713a" />
            <Metric value={impact.visits_completed} label="Visits Completed" tone="bg-gradient-to-br from-[#edf4fa] to-[#fffdf9]" accent="#416f96" />
            <Metric value={impact.prayers_logged} label="Prayers Logged" tone="bg-gradient-to-br from-[#f5f2f8] to-[#fffdf9]" accent="#6f5c8c" />
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
            <section className="overflow-hidden rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] shadow-[0_12px_38px_rgba(18,48,68,.05)]">
              <div className="border-b border-[#ebe6dc] px-6 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7d8784]">Speed to care</p>
                <h2 className="mt-1 text-lg font-black text-[#183f35]">Average workflow time</h2>
              </div>
              <div className="grid gap-px bg-[#ebe6dc] sm:grid-cols-2">
                {[
                  ["Grandview review", durationLabel(impact.avg_review_minutes)],
                  ["Hope response", durationLabel(impact.avg_partner_response_minutes)],
                  ["Grandview release", durationLabel(impact.avg_release_minutes)],
                  ["End to end", durationLabel(impact.avg_end_to_end_minutes)]
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#fffdf9] p-6"><p className="text-3xl font-black tracking-[-0.04em] text-[#123044]">{value}</p><p className="mt-1 text-sm font-black text-[#566a71]">{label}</p></div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] shadow-[0_12px_38px_rgba(18,48,68,.05)]">
              <div className="border-b border-[#ebe6dc] px-6 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7d8784]">Outcome mix</p>
                <h2 className="mt-1 text-lg font-black text-[#183f35]">Care provided</h2>
              </div>
              <div className="space-y-3 p-6">
                {[
                  ["Prayer logged", impact.prayers_logged, "#6f5c8c"],
                  ["Visit planned", impact.visits_planned, "#416f96"],
                  ["Visit completed", impact.visits_completed, "#3f7f5a"],
                  ["Follow-up requested", impact.follow_up_requested, "#a66f47"]
                ].map(([label, value, accent]) => (
                  <div key={String(label)} className="flex items-center justify-between rounded-2xl bg-[#f7f4ee] p-4">
                    <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ background: String(accent) }} /><p className="text-sm font-black text-[#334f56]">{label}</p></div>
                    <span className="text-xl font-black text-[#123044]">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <p className="mt-5 text-xs font-semibold text-[#7b8785]">{impact.requests_last_30_days} request{impact.requests_last_30_days === 1 ? "" : "s"} entered ChurchWork in the last 30 days.</p>
        </>
      ) : null}

      {canViewActivity && activeNav === "activity" ? (
        <>
          <div className="mb-6"><h1 className="font-serif text-4xl font-semibold tracking-[-0.04em]">Activity</h1><p className="mt-2 text-sm font-medium text-[#66777c]">Recent operator and pilot actions.</p></div>
          <OperatorAuditFeed />
        </>
      ) : null}

      {canManageAccess && !diagnosticsConfigured && activeNav === "overview" ? <p className="mt-5 text-[11px] font-semibold text-[#929995]">Internal diagnostics routes remain intentionally fail-closed.</p> : null}
    </ChurchWorkAppShell>
  );
}
