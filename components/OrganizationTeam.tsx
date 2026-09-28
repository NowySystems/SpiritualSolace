"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Portal = "facility" | "partner";

type TeamMember = {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
};

type TeamSnapshot = {
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  portal: Portal;
  members: TeamMember[];
};

type CreatedInvite = {
  invite_url?: string;
  email?: string;
  role?: string;
  expires_at?: string;
};

const roles = {
  facility: [
    { value: "facility_admin", label: "Facility Admin", help: "Manage the facility team, review/release care, and claim requests." },
    { value: "facility_staff", label: "Facility Staff", help: "Review/release care and claim facility requests." },
    { value: "requester", label: "Requester", help: "Submit and follow their own spiritual-care requests for this facility." }
  ],
  partner: [
    { value: "partner_admin", label: "Partner Admin", help: "Manage the care-partner team and claim assignments." },
    { value: "partner_user", label: "Partner User", help: "Claim assignments and log spiritual-care outcomes." }
  ]
} satisfies Record<Portal, Array<{ value: string; label: string; help: string }>>;

function roleLabel(role: string) {
  return [...roles.facility, ...roles.partner].find((option) => option.value === role)?.label ?? role;
}

export function OrganizationTeam({ portal }: { portal: Portal }) {
  const [team, setTeam] = useState<TeamSnapshot | null>(null);
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(roles[portal][0].value);
  const [createdInvite, setCreatedInvite] = useState<CreatedInvite | null>(null);
  const [message, setMessage] = useState("Loading your ChurchWork team...");
  const [isBusy, setIsBusy] = useState(false);

  const options = useMemo(() => roles[portal], [portal]);

  async function loadTeam() {
    const response = await fetch(`/api/org-team?portal=${portal}`, { cache: "no-store" }).catch(() => null);
    const body = await response?.json().catch(() => null);

    if (!response || !response.ok || !body?.ok || !body.team) {
      setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not load this team.");
      return;
    }

    setTeam(body.team as TeamSnapshot);
    setMessage("Team access is scoped to this organization.");
  }

  useEffect(() => { void loadTeam(); }, [portal]);

  async function createInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!team) return;

    setIsBusy(true);
    setCreatedInvite(null);
    setMessage("Creating secure team invitation...");

    const response = await fetch("/api/org-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portal,
        organizationId: team.organization_id,
        email,
        role: inviteRole
      })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not create the invitation.");
      setIsBusy(false);
      return;
    }

    setCreatedInvite(body.invite as CreatedInvite);
    setEmail("");
    setMessage(typeof body.message === "string" ? body.message : "Invitation ready.");
    setIsBusy(false);
  }

  async function copyInvite() {
    if (!createdInvite?.invite_url) return;
    await navigator.clipboard.writeText(createdInvite.invite_url);
    setMessage("Invitation link copied.");
  }

  async function updateMember(member: TeamMember, nextRole: string, status = "active") {
    if (!team) return;
    setIsBusy(true);
    setMessage(`Updating ${member.email}...`);

    const response = await fetch("/api/org-team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portal,
        organizationId: team.organization_id,
        userId: member.user_id,
        role: nextRole,
        status
      })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);
    setMessage(response?.ok && body?.ok ? body.message ?? "Team updated." : body?.message ?? "ChurchWork could not update that team member.");
    setIsBusy(false);
    if (response?.ok && body?.ok) await loadTeam();
  }

  if (!team) {
    return (
      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6f7f7b]">Organization team</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.05em] text-[#102f40]">Team</h1>
        <div className="mt-6 rounded-2xl border border-[#ded9cf] bg-[#fffdf9] p-6 text-sm font-semibold text-[#68787c]">{message}</div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-7">
        <span className="inline-flex rounded-full border border-[#d8d3c8] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#627858]">Organization Admin</span>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.055em] text-[#102f40] sm:text-[2.8rem]">{team.organization_name} team</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#66777b]">Invite people and assign only the roles that belong to your organization. ChurchWork platform roles stay under the platform owner.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.82fr_1.18fr]">
        <div className="space-y-5">
          <form onSubmit={createInvite} className="rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] p-6 shadow-[0_12px_38px_rgba(18,48,68,.05)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#74817d]">Add someone</p>
            <h2 className="mt-1 text-xl font-black text-[#183f35]">Invite a team member</h2>

            <label className="mt-5 block text-sm font-black text-[#173b2d]">
              Email
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="person@example.org" className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
            </label>

            <label className="mt-4 block text-sm font-black text-[#173b2d]">
              Role
              <select value={inviteRole} onChange={(event) => setInviteRole(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 outline-none focus:border-[#789052]">
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <p className="mt-2 text-xs font-semibold leading-5 text-[#71807c]">{options.find((option) => option.value === inviteRole)?.help}</p>

            <button type="submit" disabled={isBusy} className="mt-5 w-full rounded-xl bg-[#173f34] px-4 py-3 text-sm font-black text-white shadow-lg disabled:opacity-50">{isBusy ? "Working…" : "Create invitation"}</button>
          </form>

          {createdInvite?.invite_url ? (
            <div className="rounded-[1.35rem] border border-[#bfd8ca] bg-[#eff8f2] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#4f8062]">Invitation ready</p>
              <p className="mt-2 text-sm font-black text-[#183f35]">{createdInvite.email} · {roleLabel(createdInvite.role ?? "")}</p>
              <div className="mt-3 break-all rounded-xl bg-white p-3 text-[11px] font-semibold leading-5 text-[#60726c]">{createdInvite.invite_url}</div>
              <button type="button" onClick={() => void copyInvite()} className="mt-3 w-full rounded-xl border border-[#bad1c4] bg-white px-4 py-2.5 text-xs font-black text-[#2f6b54]">Copy link</button>
            </div>
          ) : null}

          <p className="rounded-xl border border-[#ded9cf] bg-white/65 px-4 py-3 text-xs font-semibold leading-5 text-[#6d7b79]">{message}</p>
        </div>

        <div className="overflow-hidden rounded-[1.35rem] border border-[#ded9cf] bg-[#fffdf9] shadow-[0_12px_38px_rgba(18,48,68,.05)]">
          <div className="border-b border-[#ebe6dc] px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#74817d]">Current access</p>
            <div className="mt-1 flex items-center justify-between gap-4"><h2 className="text-xl font-black text-[#183f35]">Team members</h2><span className="rounded-full bg-[#edf3ef] px-3 py-1 text-[10px] font-black text-[#3f6b57]">{team.members.length}</span></div>
          </div>

          {team.members.length ? (
            <div className="divide-y divide-[#eee9df]">
              {team.members.map((member) => (
                <div key={member.user_id} className="grid gap-3 px-6 py-5 md:grid-cols-[1.4fr_.85fr_auto] md:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#294b42]">{member.full_name?.trim() || member.email}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-[#7a8784]">{member.email}</p>
                  </div>
                  <select
                    value={member.role}
                    disabled={isBusy || member.status !== "active"}
                    onChange={(event) => void updateMember(member, event.target.value, "active")}
                    className="rounded-xl border border-[#d8d3c9] bg-white px-3 py-2 text-xs font-black text-[#425d58] disabled:opacity-50"
                  >
                    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => void updateMember(member, member.role, member.status === "active" ? "disabled" : "active")}
                    className={`rounded-xl px-3 py-2 text-xs font-black ${member.status === "active" ? "border border-[#e0c7c0] bg-white text-[#9a5d53]" : "bg-[#e7f1eb] text-[#35684e]"}`}
                  >
                    {member.status === "active" ? "Disable" : "Restore"}
                  </button>
                </div>
              ))}
            </div>
          ) : <p className="p-6 text-sm font-semibold text-[#788481]">No organization members yet.</p>}
        </div>
      </div>

      {portal === "facility" ? (
        <div className="mt-5 rounded-2xl border border-[#d7e3dd] bg-[#eff6f2] p-5">
          <p className="text-sm font-black text-[#2d5a48]">Requester role</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#62776d]">Use Requester when this facility wants a resident, family member, or other approved person to submit their own requests. Their requests route only through this facility's configured ChurchWork care-partner relationship.</p>
        </div>
      ) : null}
    </section>
  );
}
