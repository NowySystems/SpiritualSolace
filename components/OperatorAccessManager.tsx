"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type UserRole = {
  role: string;
  status: string;
  organization_name: string;
  organization_slug: string;
};

type OperatorUser = {
  id: string;
  email: string | null;
  roles: UserRole[];
};

type OverviewShape = {
  ok?: boolean;
  snapshot?: {
    current_user_id?: string;
    users?: OperatorUser[];
  };
};

type OrgSlug = "churchwork" | "grandview-post-acute" | "hope-church";

type RoleOption = {
  value: string;
  label: string;
};

const orgOptions: Array<{ value: OrgSlug; label: string }> = [
  { value: "churchwork", label: "ChurchWork" },
  { value: "grandview-post-acute", label: "Grandview Post Acute" },
  { value: "hope-church", label: "Hope Church" }
];

const baseRoleOptions: Record<OrgSlug, RoleOption[]> = {
  churchwork: [
    { value: "requester", label: "Requester" },
    { value: "platform_admin", label: "Platform admin" }
  ],
  "grandview-post-acute": [
    { value: "facility_staff", label: "Facility staff" },
    { value: "facility_admin", label: "Facility admin" }
  ],
  "hope-church": [
    { value: "partner_user", label: "Partner user" },
    { value: "partner_admin", label: "Partner admin" }
  ]
};

const ownerRoleOption: RoleOption = { value: "owner", label: "Owner" };

function rolesForOrg(orgSlug: OrgSlug, canManageOwners: boolean) {
  if (orgSlug === "churchwork" && canManageOwners) {
    return [...baseRoleOptions.churchwork, ownerRoleOption];
  }
  return baseRoleOptions[orgSlug];
}

function messageFromBody(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") return body.message;
  return fallback;
}

export function OperatorAccessManager() {
  const [users, setUsers] = useState<OperatorUser[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [orgSlug, setOrgSlug] = useState<OrgSlug>("grandview-post-acute");
  const [role, setRole] = useState("facility_staff");
  const [status, setStatus] = useState<"active" | "disabled">("active");
  const [message, setMessage] = useState("Choose an existing ChurchWork account to update.");
  const [isBusy, setIsBusy] = useState(false);

  const isOwner = useMemo(() => {
    if (!users || !currentUserId) return false;
    const currentUser = users.find((user) => user.id === currentUserId);
    return Boolean(currentUser?.roles.some((entry) =>
      entry.role === "owner"
      && entry.status === "active"
      && entry.organization_slug === "churchwork"
    ));
  }, [currentUserId, users]);

  const availableRoles = useMemo(() => rolesForOrg(orgSlug, isOwner), [isOwner, orgSlug]);
  const accountEmails = useMemo(() => (users ?? []).map((user) => user.email).filter((value): value is string => Boolean(value)), [users]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const response = await fetch("/api/operator-overview", { cache: "no-store" }).catch(() => null);
      if (!mounted || !response) return;

      const body = await response.json().catch(() => null) as OverviewShape | null;
      if (!response.ok || !body?.ok || !body.snapshot) {
        setUsers(null);
        return;
      }

      setCurrentUserId(typeof body.snapshot.current_user_id === "string" ? body.snapshot.current_user_id : null);
      setUsers(Array.isArray(body.snapshot.users) ? body.snapshot.users : []);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  function handleOrgChange(nextOrg: OrgSlug) {
    const nextRoles = rolesForOrg(nextOrg, isOwner);
    setOrgSlug(nextOrg);
    setRole(nextRoles[0]?.value ?? "requester");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Updating ChurchWork access...");

    const response = await fetch("/api/operator-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, orgSlug, role, status })
    }).catch(() => null);

    if (!response) {
      setMessage("ChurchWork access management is unreachable.");
      setIsBusy(false);
      return;
    }

    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      setMessage(messageFromBody(body, "Access update failed."));
      setIsBusy(false);
      return;
    }

    setMessage(messageFromBody(body, "Access updated."));
    setIsBusy(false);
    window.setTimeout(() => window.location.reload(), 500);
  }

  if (users === null) return null;

  return (
    <section className="rounded-2xl border border-[#ded9cf] bg-[#fffdf9] p-6 text-[#123044] shadow-sm shadow-[#123044]/5">
      <div>
        <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Access management</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Manage existing accounts.</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#66766e]">
              This does not create accounts or send invitations. It only assigns, changes, or disables a role after the person already has a ChurchWork account.
            </p>
            <div className="mt-5 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-4 text-sm font-semibold leading-6 text-[#5f4b1f]">
              Facility and Hope Church account creation stays deferred until rollout. This tool is ready for that handoff when those accounts exist.
            </div>
            <div className="mt-3 rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-4 text-sm font-semibold leading-6 text-[#173b2d]">
              {isOwner
                ? "Owner protection is active: ChurchWork must always retain at least one active owner."
                : "Owner access can only be granted or disabled by an active ChurchWork owner."}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="block text-sm font-black text-[#173b2d] xl:col-span-2">
              Existing account email
              <input
                type="email"
                list="churchwork-existing-user-emails"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="person@example.com"
                className="mt-2 w-full rounded-xl border border-[#d9dfd7] bg-white px-4 py-3 text-base outline-none focus:border-[#0f6b54]"
              />
              <datalist id="churchwork-existing-user-emails">
                {accountEmails.map((value) => <option key={value} value={value} />)}
              </datalist>
            </label>

            <label className="block text-sm font-black text-[#173b2d]">
              Organization
              <select value={orgSlug} onChange={(event) => handleOrgChange(event.target.value as OrgSlug)} className="mt-2 w-full rounded-xl border border-[#d9dfd7] bg-white px-4 py-3 text-base outline-none focus:border-[#0f6b54]">
                {orgOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="block text-sm font-black text-[#173b2d]">
              Role
              <select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d9dfd7] bg-white px-4 py-3 text-base outline-none focus:border-[#0f6b54]">
                {availableRoles.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="block text-sm font-black text-[#173b2d]">
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value as "active" | "disabled")} className="mt-2 w-full rounded-xl border border-[#d9dfd7] bg-white px-4 py-3 text-base outline-none focus:border-[#0f6b54]">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>

            <div className="flex items-end xl:col-span-3">
              <button type="submit" disabled={isBusy} className="w-full rounded-xl bg-[#082838] px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-[#0f3f35] disabled:opacity-60">
                {isBusy ? "Updating..." : "Apply access change"}
              </button>
            </div>

            <p className="md:col-span-2 xl:col-span-4 rounded-xl border border-[#cfe4d5] bg-white p-4 text-sm font-semibold leading-6 text-[#173b2d]">{message}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
