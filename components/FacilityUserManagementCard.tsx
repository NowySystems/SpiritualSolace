"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type FacilityUserManagementCardProps = {
  session: Session;
};

type FacilityMember = {
  membership_id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
};

type FacilityInvite = {
  invite_id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

type ManagedFacility = {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  status: string;
  address_line_1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  members: FacilityMember[];
  invites: FacilityInvite[];
};

type FacilityAdminSnapshot = {
  can_manage_facilities: boolean;
  is_platform_admin: boolean;
  facilities: ManagedFacility[];
};

const facilityRoleOptions = [
  { value: "facility_staff", label: "Facility Staff" },
  { value: "facility_admin", label: "Facility Admin" }
];

const membershipStatusOptions = [
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

function formatSystemLabel(value: string | null | undefined) {
  if (!value) return "";
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function FacilityUserManagementCard({ session }: FacilityUserManagementCardProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [snapshot, setSnapshot] = useState<FacilityAdminSnapshot | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("facility_staff");
  const [roleStatus, setRoleStatus] = useState("active");
  const [status, setStatus] = useState("Checking facility admin access...");
  const [isBusy, setIsBusy] = useState(false);

  async function loadSnapshot() {
    setIsBusy(true);
    setStatus("Loading facility workspace access...");

    await supabase.rpc("sync_current_pilot_profile");
    await supabase.rpc("claim_facility_invites");

    const { data, error } = await supabase.rpc("get_facility_admin_snapshot");

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      return;
    }

    const nextSnapshot = data as FacilityAdminSnapshot;
    setSnapshot(nextSnapshot);

    if (!selectedFacilityId && nextSnapshot.facilities.length) {
      setSelectedFacilityId(nextSnapshot.facilities[0].id);
    }

    setStatus(nextSnapshot.can_manage_facilities ? "Facility user management loaded." : "No facility admin workspace yet.");
    setIsBusy(false);
  }

  useEffect(() => {
    void loadSnapshot();
  }, []);

  async function handleRoleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFacilityId) {
      setStatus("Choose a facility first.");
      return;
    }

    setIsBusy(true);
    setStatus("Updating facility user role...");

    const { data, error } = await supabase.rpc("set_facility_user_role", {
      p_facility_id: selectedFacilityId,
      p_user_email: email,
      p_role: role,
      p_status: roleStatus
    });

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      return;
    }

    const result = data as { mode?: string; status?: string; email?: string; role?: string } | null;
    if (result?.mode === "invite") {
      setStatus(`Invite saved for ${result.email}. They need to sign up with that email to claim ${formatSystemLabel(result.role)}.`);
    } else {
      setStatus(`Facility role updated for ${result?.email ?? email}.`);
    }

    setEmail("");
    await loadSnapshot();
  }

  if (!snapshot?.can_manage_facilities) {
    return null;
  }

  const facilities = snapshot.facilities ?? [];
  const selectedFacility = facilities.find((facility) => facility.id === selectedFacilityId) ?? facilities[0];

  return (
    <section className="mt-8 rounded-[2rem] border border-[#d8d0c0] bg-white p-8 text-[#102b3a] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Facility Admin</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em]">Manage facility users.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4d5d55]">
            Facility Admins can add, activate, or disable users inside their own facility workspace. ChurchWork owners can still see the audit trail, but daily user setup stays with the facility.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSnapshot}
          disabled={isBusy}
          className="rounded-xl border border-[#d8d0c0] bg-white px-5 py-3 text-sm font-bold text-[#173b2d] hover:bg-[#f0f5e8] disabled:opacity-60"
        >
          {isBusy ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
        Add users by email. If they already have a ChurchWork login, the role is assigned immediately. If not, an invite is saved and they can claim it by signing up with the same email.
      </div>

      <div className="mt-6 rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-4 text-sm font-semibold text-[#4d5d55]">
        {status}
      </div>

      {facilities.length > 1 ? (
        <label className="mt-6 block text-sm font-bold text-[#173b2d]">
          Facility workspace
          <select
            value={selectedFacility?.id ?? ""}
            onChange={(event) => setSelectedFacilityId(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          >
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>{facility.name}</option>
            ))}
          </select>
        </label>
      ) : null}

      {selectedFacility ? (
        <div className="mt-6 rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Selected facility</p>
          <p className="mt-2 text-xl font-black text-[#173b2d]">{selectedFacility.name}</p>
          <p className="mt-1 text-sm text-[#4d5d55]">{selectedFacility.slug} · {formatSystemLabel(selectedFacility.status)}</p>
        </div>
      ) : null}

      <form onSubmit={handleRoleSubmit} className="mt-6 grid gap-4 md:grid-cols-4">
        <label className="block text-sm font-bold text-[#173b2d] md:col-span-2">
          User email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="staff@example.com"
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Role
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          >
            {facilityRoleOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Status
          <select
            value={roleStatus}
            onChange={(event) => setRoleStatus(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          >
            {membershipStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <div className="md:col-span-4">
          <button
            type="submit"
            disabled={isBusy || !selectedFacility}
            className="rounded-xl bg-[#173b2d] px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-[#102b3a] disabled:opacity-60"
          >
            {isBusy ? "Working..." : "Add / update facility user"}
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
          <h4 className="font-serif text-2xl font-semibold">Active facility users</h4>
          <div className="mt-4 space-y-3">
            {selectedFacility?.members.length ? selectedFacility.members.map((member) => (
              <article key={member.membership_id} className="rounded-xl border border-[#d8d0c0] bg-white p-4 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black text-[#173b2d]">{member.email ?? "No email"}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#789052]">{formatSystemLabel(member.status)}</p>
                </div>
                <p className="mt-1 text-[#4d5d55]">{formatSystemLabel(member.role)} · added {formatDate(member.created_at)}</p>
              </article>
            )) : (
              <p className="text-sm text-[#4d5d55]">No facility users yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
          <h4 className="font-serif text-2xl font-semibold">Pending / saved invites</h4>
          <div className="mt-4 space-y-3">
            {selectedFacility?.invites.length ? selectedFacility.invites.map((invite) => (
              <article key={invite.invite_id} className="rounded-xl border border-[#d8d0c0] bg-white p-4 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black text-[#173b2d]">{invite.email}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#789052]">{formatSystemLabel(invite.status)}</p>
                </div>
                <p className="mt-1 text-[#4d5d55]">{formatSystemLabel(invite.role)} · saved {formatDate(invite.created_at)}</p>
              </article>
            )) : (
              <p className="text-sm text-[#4d5d55]">No saved invites yet.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
