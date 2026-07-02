"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type OwnerAdminAccessCenterProps = {
  session: Session;
};

type AdminRole = {
  id: string;
  role: string;
  status: string;
  organization_name: string;
  organization_slug: string;
  organization_type: string;
};

type AdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  status: string;
  created_at: string;
  policy_acceptance_count: number;
  roles: AdminRole[];
};

type RecentRequest = {
  id: string;
  resident_display_name: string;
  requester_display_name: string;
  requester_role: string;
  request_type: string;
  priority: string;
  status: string;
  facility_name: string;
  created_at: string;
};

type RecentTimelineEvent = {
  id: string;
  care_request_id: string;
  event_type: string;
  visibility: string;
  sharing_level: string;
  priority_label: string | null;
  created_at: string;
};

type AdminSnapshot = {
  is_admin: boolean;
  current_user_email: string | null;
  message?: string;
  summary?: {
    users_total: number;
    unassigned_users: number;
    requests_total: number;
    new_requests: number;
    timeline_events_total: number;
  };
  role_buckets?: Record<string, number>;
  users?: AdminUser[];
  recent_requests?: RecentRequest[];
  recent_timeline_events?: RecentTimelineEvent[];
};

const organizationOptions = [
  { value: "churchwork", label: "ChurchWork" },
  { value: "grandview-post-acute", label: "Grandview Post Acute" },
  { value: "hope-church", label: "Hope Church" }
];

const roleOptions = [
  { value: "requester", label: "Requester" },
  { value: "facility_staff", label: "Facility Staff" },
  { value: "facility_admin", label: "Facility Admin" },
  { value: "partner_user", label: "Partner User" },
  { value: "partner_admin", label: "Partner Admin" },
  { value: "platform_admin", label: "Platform Admin" },
  { value: "owner", label: "Owner" }
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "disabled", label: "Disabled" }
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function bucketCount(snapshot: AdminSnapshot | null, bucket: string) {
  return snapshot?.role_buckets?.[bucket] ?? 0;
}

export function OwnerAdminAccessCenter({ session }: OwnerAdminAccessCenterProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [status, setStatus] = useState("Checking owner/admin access...");
  const [isLoading, setIsLoading] = useState(false);
  const [assignEmail, setAssignEmail] = useState("");
  const [assignOrgSlug, setAssignOrgSlug] = useState("grandview-post-acute");
  const [assignRole, setAssignRole] = useState("facility_staff");
  const [assignStatus, setAssignStatus] = useState("active");

  async function loadSnapshot() {
    setIsLoading(true);
    setStatus("Syncing pilot profile...");

    await supabase.rpc("sync_current_pilot_profile");

    const { error: bootstrapError } = await supabase.rpc("claim_churchwork_bootstrap_admin");
    if (bootstrapError && !bootstrapError.message.toLowerCase().includes("not authorized")) {
      setStatus(bootstrapError.message);
    }

    const { data, error } = await supabase.rpc("get_owner_admin_snapshot");
    if (error) {
      setStatus(error.message);
      setIsLoading(false);
      return;
    }

    const nextSnapshot = data as AdminSnapshot;
    setSnapshot(nextSnapshot);
    setStatus(nextSnapshot.is_admin ? "Owner/admin access center loaded." : nextSnapshot.message ?? "Signed in without owner/admin access.");
    setIsLoading(false);
  }

  useEffect(() => {
    void loadSnapshot();
  }, []);

  async function handleAssignRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Updating pilot role...");

    const { error } = await supabase.rpc("set_pilot_user_role", {
      p_user_email: assignEmail,
      p_org_slug: assignOrgSlug,
      p_role: assignRole,
      p_status: assignStatus
    });

    if (error) {
      setStatus(error.message);
      setIsLoading(false);
      return;
    }

    setAssignEmail("");
    setStatus("Pilot role updated.");
    await loadSnapshot();
  }

  if (!snapshot?.is_admin) {
    return null;
  }

  const users = snapshot.users ?? [];
  const recentRequests = snapshot.recent_requests ?? [];
  const recentTimelineEvents = snapshot.recent_timeline_events ?? [];

  return (
    <section className="mt-8 rounded-[2rem] border border-[#173b2d]/20 bg-[#102b3a] p-8 text-white shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Owner/Admin</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em]">Pilot access center.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d4dedc]">
            {session.user.email} can view pilot users, request activity, role buckets, and timeline activity across ChurchWork, Grandview, and Hope Church.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSnapshot}
          disabled={isLoading}
          className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15 disabled:opacity-60"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-semibold text-[#edf5e6]">
        {status}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Users</p>
          <p className="mt-2 text-3xl font-black">{snapshot.summary?.users_total ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Unassigned</p>
          <p className="mt-2 text-3xl font-black">{snapshot.summary?.unassigned_users ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Requests</p>
          <p className="mt-2 text-3xl font-black">{snapshot.summary?.requests_total ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">New</p>
          <p className="mt-2 text-3xl font-black">{snapshot.summary?.new_requests ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Timeline</p>
          <p className="mt-2 text-3xl font-black">{snapshot.summary?.timeline_events_total ?? 0}</p>
        </article>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Owner/Admin</p>
          <p className="mt-2 text-2xl font-black">{bucketCount(snapshot, "owner_admin")}</p>
        </article>
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Facility</p>
          <p className="mt-2 text-2xl font-black">{bucketCount(snapshot, "facility")}</p>
        </article>
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Partner</p>
          <p className="mt-2 text-2xl font-black">{bucketCount(snapshot, "partner")}</p>
        </article>
        <article className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c8d9b3]">Requester</p>
          <p className="mt-2 text-2xl font-black">{bucketCount(snapshot, "requester")}</p>
        </article>
      </div>

      <form onSubmit={handleAssignRole} className="mt-8 grid gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 md:grid-cols-5">
        <label className="block text-sm font-bold text-white md:col-span-2">
          User email
          <input
            type="email"
            value={assignEmail}
            onChange={(event) => setAssignEmail(event.target.value)}
            required
            placeholder="person@example.com"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-base text-[#102b3a] outline-none focus:border-[#c8d9b3]"
          />
        </label>
        <label className="block text-sm font-bold text-white">
          Organization
          <select
            value={assignOrgSlug}
            onChange={(event) => setAssignOrgSlug(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-base text-[#102b3a] outline-none focus:border-[#c8d9b3]"
          >
            {organizationOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-white">
          Role
          <select
            value={assignRole}
            onChange={(event) => setAssignRole(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-base text-[#102b3a] outline-none focus:border-[#c8d9b3]"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-white">
          Status
          <select
            value={assignStatus}
            onChange={(event) => setAssignStatus(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-base text-[#102b3a] outline-none focus:border-[#c8d9b3]"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <div className="md:col-span-5">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-[#86a45f] px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-[#789752] disabled:opacity-60"
          >
            Assign / update role
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <h4 className="font-serif text-2xl font-semibold">Pilot users</h4>
          <div className="mt-4 max-h-[28rem] space-y-3 overflow-auto pr-1">
            {users.map((user) => (
              <article key={user.id} className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black">{user.email ?? "No email"}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c8d9b3]">{user.status}</p>
                </div>
                <p className="mt-1 text-xs text-[#d4dedc]">Joined {formatDate(user.created_at)} · Policies accepted: {user.policy_acceptance_count}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.roles.length ? user.roles.map((role) => (
                    <span key={role.id} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-[#edf5e6]">
                      {role.organization_name}: {role.role} · {role.status}
                    </span>
                  )) : (
                    <span className="rounded-full border border-[#ddb66c]/45 bg-[#fff8e7] px-3 py-1 text-xs font-bold text-[#5f4b1f]">Needs bucket assignment</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <h4 className="font-serif text-2xl font-semibold">Recent requests</h4>
          <div className="mt-4 max-h-[28rem] space-y-3 overflow-auto pr-1">
            {recentRequests.length ? recentRequests.map((request) => (
              <article key={request.id} className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black">{request.resident_display_name}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c8d9b3]">{request.status}</p>
                </div>
                <p className="mt-1 text-[#d4dedc]">{request.request_type} · {request.priority} · {request.facility_name}</p>
                <p className="mt-1 text-xs text-[#d4dedc]">Requester: {request.requester_display_name} ({request.requester_role}) · {formatDate(request.created_at)}</p>
              </article>
            )) : (
              <p className="text-sm text-[#d4dedc]">No requests submitted yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5">
        <h4 className="font-serif text-2xl font-semibold">Recent timeline activity</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {recentTimelineEvents.length ? recentTimelineEvents.map((event) => (
            <article key={event.id} className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm">
              <p className="font-black">{event.event_type}</p>
              <p className="mt-1 text-[#d4dedc]">{event.visibility} · {event.sharing_level} · {event.priority_label ?? "no priority"}</p>
              <p className="mt-1 text-xs text-[#d4dedc]">{formatDate(event.created_at)}</p>
            </article>
          )) : (
            <p className="text-sm text-[#d4dedc]">No timeline events yet.</p>
          )}
        </div>
      </section>
    </section>
  );
}
