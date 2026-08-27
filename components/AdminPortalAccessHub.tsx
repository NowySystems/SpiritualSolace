"use client";

import { FormEvent, useEffect, useState } from "react";

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
};

type OperatorRole = {
  role: string;
  status: string;
  organization_name: string;
  organization_slug: string;
};

type OperatorUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  status: string;
  created_at: string;
  roles: OperatorRole[];
};

type OperatorRequest = {
  id: string;
  requester_email: string | null;
  support_options: string[] | null;
  status: string;
  partner_outcome: string | null;
  requester_update: string | null;
  created_at: string;
  updated_at: string;
};

type OperatorSnapshot = {
  is_admin: boolean;
  current_user_id: string;
  summary: PilotSummary;
  staffing: PilotStaffing;
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
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function statusLabel(status: string) {
  if (status === "facility_review") return "Grandview review";
  if (status === "approved_for_partner") return "With Hope Church";
  if (status === "partner_outcome_logged") return "Outcome awaiting release";
  if (status === "requester_updated") return "Requester updated";
  if (status === "closed") return "Closed";
  return status.replaceAll("_", " ");
}

function outcomeLabel(outcome: string | null) {
  if (!outcome) return "No partner outcome yet";
  if (outcome === "prayer_logged") return "Prayer logged";
  if (outcome === "visit_planned") return "Visit planned";
  if (outcome === "visit_completed") return "Visit completed";
  if (outcome === "follow_up_requested") return "Follow-up requested";
  return outcome.replaceAll("_", " ");
}

function messageFromBody(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") return body.message;
  return fallback;
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-2xl border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#0d2b3b]">{value}</p>
      <p className="mt-2 text-xs font-semibold leading-5 text-[#66766e]">{detail}</p>
    </article>
  );
}

export function AdminPortalAccessHub() {
  const [snapshot, setSnapshot] = useState<OperatorSnapshot | null>(null);
  const [operatorEmail, setOperatorEmail] = useState<string | null>(null);
  const [diagnosticsConfigured, setDiagnosticsConfigured] = useState(false);
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
      setMessage(response.status === 401 ? "Sign in with a ChurchWork owner/admin account." : messageFromBody(body, "Operator data is unavailable."));
      setIsBusy(false);
      return;
    }

    setSnapshot(body.snapshot);
    setOperatorEmail(body.email ?? null);
    setDiagnosticsConfigured(body.diagnosticsAccessConfigured === true);
    setMessage("Operator command center is current.");
    setIsBusy(false);
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Verifying ChurchWork owner/admin access...");

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
    setMessage("Signed out of the ChurchWork operator console.");
    setIsBusy(false);
  }

  if (!snapshot) {
    return (
      <main className="min-h-screen bg-[#edf4f0] px-5 py-8 text-[#0d2b3b]">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_28rem]">
          <div>
            <a href="/" className="inline-flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#d9dfd7]">
              <span className="flex h-12 w-16 items-center justify-center rounded-xl bg-white p-1">
                <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
              </span>
              <span className="font-serif text-2xl font-semibold tracking-[-0.04em]">Church<span className="text-[#3f806e]">Work</span></span>
            </a>
            <p className="mt-10 text-xs font-black uppercase tracking-[0.22em] text-[#506a49]">Operator console</p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.05em] md:text-6xl">Run the pilot without running the database.</h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#4f6259]">
              Owner/admin access is separate from requester, facility, and partner accounts. This console gives ChurchWork operators a live view of pilot flow, access, staffing readiness, and recent activity.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="rounded-[2rem] border border-[#d9dfd7] bg-white p-7 shadow-2xl shadow-[#0d2b3b]/10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#506a49]">Owner / platform admin</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">Operator sign in</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#4f6259]">Use your existing ChurchWork owner/admin account. Public requester accounts cannot enter this console.</p>

            <label className="mt-6 block text-sm font-black text-[#173b2d]">
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="mt-2 w-full rounded-xl border border-[#d9dfd7] px-4 py-3 text-base outline-none focus:border-[#0f6b54]" />
            </label>
            <label className="mt-4 block text-sm font-black text-[#173b2d]">
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-[#d9dfd7] px-4 py-3 text-base outline-none focus:border-[#0f6b54]" />
            </label>

            <button type="submit" disabled={isBusy} className="mt-6 w-full rounded-xl bg-[#082838] px-5 py-3 text-base font-black text-white shadow-lg hover:bg-[#0f3f35] disabled:opacity-60">
              {isBusy ? "Checking..." : "Open operator console"}
            </button>
            <p className="mt-4 rounded-xl border border-[#cfe4d5] bg-[#f1f8f3] p-4 text-sm font-semibold leading-6 text-[#173b2d]">{message}</p>
          </form>
        </section>
      </main>
    );
  }

  const summary = snapshot.summary;
  const staffing = snapshot.staffing;
  const users = snapshot.users ?? [];
  const requests = snapshot.recent_requests ?? [];

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <header className="border-b border-white/10 bg-[#082838] text-white shadow-xl shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <a href="/" className="flex items-center gap-4">
            <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-white p-2"><img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" /></span>
            <span><span className="block font-serif text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Church<span className="text-[#8dbd9e]">Work</span></span><span className="block text-xs font-semibold text-[#d9e7df]">Operator Command Center</span></span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e7f1eb] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54]">Owner/Admin</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-[#d9e7df]">{operatorEmail ?? "Operator"}</span>
            <button type="button" onClick={() => void loadOverview()} disabled={isBusy} className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-white disabled:opacity-60">Refresh</button>
            <button type="button" onClick={() => void handleSignOut()} disabled={isBusy} className="rounded-full bg-[#d6a943] px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#082838]">Sign out</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[118rem] px-5 py-7 md:px-8 md:py-9">
        <section className="rounded-[2rem] bg-[#0f3f35] p-6 text-white shadow-xl shadow-[#0d2b3b]/10 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c7e2d0]">Pilot operations</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-[-0.05em] md:text-5xl">One view of what needs attention.</h1>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#d9e7df]">Live pilot requests, user access, and launch-only staffing setup are visible here. Facility and partner care controls remain in their own role workspaces.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-bold text-[#edf5e6]">{message}</div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="All requests" value={summary.requests_total} detail="Saved Pilot #001 requests" />
          <MetricCard label="Grandview review" value={summary.facility_review} detail="Needs facility decision" />
          <MetricCard label="With Hope" value={summary.approved_for_partner} detail="Approved for partner action" />
          <MetricCard label="Release needed" value={summary.partner_outcome_logged} detail="Partner outcome logged" />
          <MetricCard label="Updated" value={summary.requester_updated} detail="Requester update released" />
          <MetricCard label="Closed" value={summary.closed} detail="Completed and closed" />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Live workflow</p><h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Recent pilot requests</h2></div>
              <span className="text-xs font-bold text-[#66766e]">Newest first · up to 25</span>
            </div>
            <div className="mt-5 space-y-3">
              {requests.length ? requests.map((request) => (
                <article key={request.id} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-black">{request.support_options?.length ? request.support_options.join(" + ") : "Spiritual-care request"}</p>
                      <p className="mt-1 text-xs font-semibold text-[#66766e]">{request.requester_email ?? "Requester"} · {formatDate(request.created_at)}</p>
                    </div>
                    <span className="w-fit rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#0f6b54]">{statusLabel(request.status)}</span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <div className="rounded-xl bg-white p-3"><span className="block text-xs font-black uppercase tracking-[0.1em] text-[#66766e]">Partner outcome</span><span className="mt-1 block font-bold">{outcomeLabel(request.partner_outcome)}</span></div>
                    <div className="rounded-xl bg-white p-3"><span className="block text-xs font-black uppercase tracking-[0.1em] text-[#66766e]">Requester update</span><span className="mt-1 block font-bold">{request.requester_update ?? "Not released yet"}</span></div>
                  </div>
                </article>
              )) : (
                <div className="rounded-2xl border border-dashed border-[#cfd9d1] bg-[#f8fbf8] p-8 text-center text-sm font-semibold text-[#66766e]">No live pilot requests yet. The console is ready for the first requester submission.</div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Launch setup</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Pilot staffing</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#66766e]">These are intentionally back-burnered until rollout. They are visibility checks, not current blockers.</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-[#f8fbf8] p-4"><span className="font-bold">Grandview reviewers</span><span className="text-xl font-black">{staffing.grandview_reviewers}</span></div>
                <div className="flex items-center justify-between rounded-xl bg-[#f8fbf8] p-4"><span className="font-bold">Hope Church users</span><span className="text-xl font-black">{staffing.hope_partner_users}</span></div>
                <div className="flex items-center justify-between rounded-xl bg-[#f8fbf8] p-4"><span className="font-bold">Pending facility invites</span><span className="text-xl font-black">{staffing.pending_facility_invites}</span></div>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Shortcuts</p>
              <div className="mt-4 grid gap-3">
                <a href="/requester-login" className="rounded-xl bg-[#082838] px-4 py-3 text-center text-sm font-black text-white">Requester portal</a>
                <a href="/facility-login" className="rounded-xl border border-[#0f3f35] px-4 py-3 text-center text-sm font-black text-[#0f3f35]">Facility portal</a>
                <a href="/partner-login" className="rounded-xl border border-[#0f3f35] px-4 py-3 text-center text-sm font-black text-[#0f3f35]">Partner portal</a>
                <a href="/" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-3 text-center text-sm font-black text-[#0f3f35]">Public site</a>
              </div>
              <p className="mt-4 text-xs font-semibold leading-5 text-[#66766e]">Internal diagnostics key: {diagnosticsConfigured ? "configured" : "not configured — diagnostic/demo routes remain fail-closed"}.</p>
            </section>
          </aside>
        </div>

        <section className="mt-6 rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Access inventory</p><h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">ChurchWork users</h2></div>
            <span className="text-sm font-black text-[#0f6b54]">{users.length} profile{users.length === 1 ? "" : "s"}</span>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {users.map((user) => (
              <article key={user.id} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="font-black">{user.email ?? "No email"}</p><span className="text-xs font-black uppercase tracking-[0.1em] text-[#66766e]">{user.status}</span></div>
                <p className="mt-1 text-xs font-semibold text-[#66766e]">Profile created {formatDate(user.created_at)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.roles?.length ? user.roles.map((role) => (
                    <span key={`${role.organization_slug}-${role.role}`} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#173b2d] ring-1 ring-[#d9dfd7]">{role.organization_name}: {role.role} · {role.status}</span>
                  )) : <span className="rounded-full bg-[#fff8e7] px-3 py-1 text-xs font-bold text-[#7a5b20]">No active pilot bucket assigned</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
