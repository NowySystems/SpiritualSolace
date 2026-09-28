"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type OrgSlug = "grandview-post-acute" | "hope-church";

type InviteRow = {
  id: string;
  email: string;
  organization_name: string;
  org_slug: OrgSlug;
  portal: "facility" | "partner";
  role: string;
  pilot_admin: boolean;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
};

type CreatedInvite = InviteRow & {
  invite_url: string;
};

const roleOptions: Record<OrgSlug, Array<{ value: string; label: string }>> = {
  "grandview-post-acute": [
    { value: "facility_admin", label: "Facility Admin" },
    { value: "facility_staff", label: "Facility Staff" }
  ],
  "hope-church": [
    { value: "partner_admin", label: "Partner Admin" },
    { value: "partner_user", label: "Partner User" }
  ]
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function labelForRole(role: string) {
  return roleOptions["grandview-post-acute"].concat(roleOptions["hope-church"]).find((item) => item.value === role)?.label ?? role;
}

export function PilotInviteManager() {
  const [orgSlug, setOrgSlug] = useState<OrgSlug>("grandview-post-acute");
  const [role, setRole] = useState("facility_admin");
  const [email, setEmail] = useState("");
  const [pilotAdmin, setPilotAdmin] = useState(true);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [createdInvite, setCreatedInvite] = useState<CreatedInvite | null>(null);
  const [message, setMessage] = useState("Create a secure one-time setup link for an approved pilot user.");
  const [isBusy, setIsBusy] = useState(false);

  const availableRoles = useMemo(() => roleOptions[orgSlug], [orgSlug]);

  async function loadInvites() {
    const response = await fetch("/api/operator-invites", { cache: "no-store" }).catch(() => null);
    const body = await response?.json().catch(() => null);
    if (response?.ok && body?.ok && Array.isArray(body.invites)) {
      setInvites(body.invites as InviteRow[]);
    }
  }

  useEffect(() => { void loadInvites(); }, []);

  function changeOrg(next: OrgSlug) {
    setOrgSlug(next);
    setRole(roleOptions[next][0].value);
  }

  async function createInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setCreatedInvite(null);
    setMessage("Creating secure ChurchWork invitation...");

    const response = await fetch("/api/operator-invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, orgSlug, role, pilotAdmin })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok || !body.invite) {
      setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not create that invitation.");
      setIsBusy(false);
      return;
    }

    setCreatedInvite(body.invite as CreatedInvite);
    setMessage("Invitation ready. Copy the link below and send it to the pilot user.");
    setEmail("");
    setIsBusy(false);
    await loadInvites();
  }

  async function copyInvite() {
    if (!createdInvite?.invite_url) return;
    await navigator.clipboard.writeText(createdInvite.invite_url);
    setMessage("Invitation link copied.");
  }

  async function revokeInvite(inviteId: string) {
    setIsBusy(true);
    const response = await fetch("/api/operator-invites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId })
    }).catch(() => null);
    const body = await response?.json().catch(() => null);
    setMessage(response?.ok && body?.ok ? "Invitation revoked." : typeof body?.message === "string" ? body.message : "Invitation could not be revoked.");
    setIsBusy(false);
    await loadInvites();
  }

  const pending = invites.filter((invite) => !invite.accepted_at && !invite.revoked_at && new Date(invite.expires_at).getTime() > Date.now());

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-[#d8d2c8] bg-[#fffdf9] shadow-[0_16px_44px_rgba(18,48,68,.06)]">
      <div className="border-b border-[#ebe6dc] bg-gradient-to-r from-[#f3eff8] to-[#fffdf9] px-6 py-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5c8c]">Pilot onboarding</p>
        <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#183f35]">Invite a facility or care-partner user</h2>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#69787b]">ChurchWork fixes the organization and role inside the invite. The recipient only chooses their password.</p>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_.85fr]">
        <form onSubmit={createInvite} className="grid gap-4 rounded-2xl border border-[#e0dbd2] bg-[#f8f6f1] p-5 sm:grid-cols-2">
          <label className="block text-sm font-black text-[#173b2d] sm:col-span-2">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="person@organization.org" className="mt-2 w-full rounded-xl border border-[#d9d4ca] bg-white px-4 py-3 text-base outline-none focus:border-[#6f5c8c]" />
          </label>

          <label className="block text-sm font-black text-[#173b2d]">
            Organization
            <select value={orgSlug} onChange={(event) => changeOrg(event.target.value as OrgSlug)} className="mt-2 w-full rounded-xl border border-[#d9d4ca] bg-white px-4 py-3 text-base outline-none focus:border-[#6f5c8c]">
              <option value="grandview-post-acute">Grandview Post Acute</option>
              <option value="hope-church">Hope Church</option>
            </select>
          </label>

          <label className="block text-sm font-black text-[#173b2d]">
            Portal role
            <select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d9d4ca] bg-white px-4 py-3 text-base outline-none focus:border-[#6f5c8c]">
              {availableRoles.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 rounded-xl border border-[#d6cde1] bg-[#f4f0f8] p-4">
            <input type="checkbox" checked={pilotAdmin} onChange={(event) => setPilotAdmin(event.target.checked)} className="mt-1 h-4 w-4 accent-[#6f5c8c]" />
            <span>
              <span className="block text-sm font-black text-[#4d3f68]">Also grant Pilot Admin dashboard access</span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-[#70677a]">Can view pilot operations, requests, organizations, and impact. Cannot manage ChurchWork users, owners, roles, or internal activity.</span>
            </span>
          </label>

          <button type="submit" disabled={isBusy} className="sm:col-span-2 rounded-xl bg-[#4d3f68] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#4d3f68]/15 disabled:opacity-50">{isBusy ? "Working..." : "Create invitation"}</button>
          <p className="sm:col-span-2 text-xs font-semibold leading-5 text-[#6e7a79]">{message}</p>
        </form>

        <div>
          {createdInvite ? (
            <div className="rounded-2xl border border-[#bfd7c8] bg-[#eff8f2] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#4f8062]">Ready to send</p>
              <p className="mt-2 text-sm font-black text-[#183f35]">{createdInvite.organization_name} · {labelForRole(createdInvite.role)}</p>
              {createdInvite.pilot_admin ? <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#6f5c8c] shadow-sm">Pilot Admin included</span> : null}
              <div className="mt-4 break-all rounded-xl border border-[#d4e2d8] bg-white p-3 text-xs font-semibold leading-5 text-[#536a61]">{createdInvite.invite_url}</div>
              <button type="button" onClick={() => void copyInvite()} className="mt-3 w-full rounded-xl bg-[#2f7b65] px-4 py-3 text-sm font-black text-white">Copy invitation link</button>
              <p className="mt-3 text-[11px] font-semibold text-[#6c7a76]">Expires {formatDate(createdInvite.expires_at)} and can only be used once.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d8d2c8] bg-[#faf8f3] p-6 text-center">
              <p className="text-sm font-black text-[#4b5f66]">Your next invitation link will appear here.</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#7a8784]">Send the link by email or text. The recipient creates their own password.</p>
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-[#183f35]">Pending invitations</p>
              <span className="rounded-full bg-[#f1edf5] px-2.5 py-1 text-[10px] font-black text-[#6f5c8c]">{pending.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {pending.length ? pending.slice(0, 6).map((invite) => (
                <div key={invite.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#e4dfd6] bg-white p-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-[#2d4d45]">{invite.email}</p>
                    <p className="mt-1 text-[10px] font-semibold text-[#7b8582]">{invite.organization_name} · {labelForRole(invite.role)}{invite.pilot_admin ? " · Pilot Admin" : ""}</p>
                  </div>
                  <button type="button" disabled={isBusy} onClick={() => void revokeInvite(invite.id)} className="shrink-0 text-[10px] font-black text-[#9a5d53] hover:underline">Revoke</button>
                </div>
              )) : <p className="rounded-xl bg-[#f7f4ee] p-3 text-xs font-semibold text-[#7a8784]">No pending invitations.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
