"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { FacilitySignupCard } from "@/components/FacilitySignupCard";
import { FacilityUserManagementCard } from "@/components/FacilityUserManagementCard";
import { GrandviewFacilityReviewQueue } from "@/components/GrandviewFacilityReviewQueue";
import { HopePartnerAssignmentQueue } from "@/components/HopePartnerAssignmentQueue";
import { OwnerAdminAccessCenter } from "@/components/OwnerAdminAccessCenter";
import { StructuredRequesterIntake } from "@/components/StructuredRequesterIntake";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type PilotWorkspaceShellProps = {
  session: Session;
};

type OrganizationPreview = {
  id: string;
  name: string;
  slug: string;
  organization_type: string;
  status: string;
};

type WorkspaceKey = "overview" | "owner" | "facility" | "partner" | "requester";

type PilotWorkspaceRole = {
  id: string;
  role: string;
  status: string;
  organization_name: string;
  organization_slug: string;
  organization_type: string;
};

type PilotWorkspaceAccess = {
  current_user_email: string | null;
  recommended_workspace: WorkspaceKey;
  has_owner_admin: boolean;
  has_facility: boolean;
  has_partner: boolean;
  has_requester: boolean;
  roles: PilotWorkspaceRole[];
};

const workspaceTabs: { key: WorkspaceKey; label: string; eyebrow: string; description: string }[] = [
  { key: "overview", label: "Overview", eyebrow: "Pilot status", description: "Current pilot targets, guardrails, seed check, and next build path." },
  { key: "owner", label: "Owner/Admin", eyebrow: "Platform view", description: "Users, role buckets, requests, and timeline oversight." },
  { key: "facility", label: "Facility", eyebrow: "Facility ops", description: "Review Grandview requests, create facility workspaces, and manage facility users." },
  { key: "partner", label: "Partner", eyebrow: "Church partner", description: "View Hope Church assigned requests and partner-safe next actions." },
  { key: "requester", label: "Requester", eyebrow: "Spiritual-care request", description: "Submit a structured spiritual-care request with no medical notes." }
];

const pilotTargets = [
  {
    name: "Grandview Post Acute",
    role: "First facility pilot target",
    detail: "Facility review queue, resident/request context, consent boundaries, and status visibility."
  },
  {
    name: "Hope Church",
    role: "First church partner target",
    detail: "Partner-safe workspace, assigned requests, shared care timeline, and report-back actions."
  },
  {
    name: "ChurchWork Owner/Admin",
    role: "Control layer",
    detail: "Cole and Sam keep access, routing, visibility, and pilot safety under human review."
  }
];

const nextBuildPath = [
  "Role-based pilot routing so each signed-in user lands in the right workspace.",
  "Grandview facility request review queue with safe actions only.",
  "Hope Church partner workspace with assigned care needs and report-back actions.",
  "Requester status view tied to the shared timeline with only requester-safe updates.",
  "Timeline visibility and RLS test matrix before real pilot data."
];

const workspaceLabels: Record<WorkspaceKey, string> = {
  overview: "Overview",
  owner: "Owner/Admin",
  facility: "Facility",
  partner: "Partner",
  requester: "Requester"
};

function formatSystemLabel(value: string | null | undefined) {
  if (!value) return "";
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeWorkspaceKey(value: string | null | undefined): WorkspaceKey {
  if (value === "owner" || value === "facility" || value === "partner" || value === "requester") {
    return value;
  }

  return "overview";
}

function summarizeAccess(access: PilotWorkspaceAccess | null) {
  if (!access) return "Checking your pilot role...";
  if (!access.roles.length) return "No active pilot role is assigned yet.";

  return `${access.roles.length} active pilot role${access.roles.length === 1 ? "" : "s"} found.`;
}

function PartnerWorkspacePlaceholder({ access }: { access: PilotWorkspaceAccess | null }) {
  return (
    <section className="mt-8 rounded-[2rem] border border-[#d8d0c0] bg-white p-8 text-[#102b3a] shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Partner next actions</p>
      <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em]">Hope Church partner path.</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4d5d55]">
        Hope Church can now see assigned, partner-safe request context after owner/admin assignment. The next build step is partner report-back: accepted, contacted, scheduled, completed, and safe timeline updates.
      </p>

      <div className="mt-6 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
        This still is not open messaging. Partner users should only see requests that were manually assigned after human review.
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Next</p>
          <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Add partner accepted/contacted/scheduled/completed status actions.</p>
        </article>
        <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Visibility</p>
          <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Keep showing only assigned, partner-safe request context and timeline events.</p>
        </article>
        <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Report back</p>
          <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Let partners report progress with controlled buttons before adding any note system.</p>
        </article>
      </div>

      {access?.roles.length ? (
        <div className="mt-6 rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Detected role</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {access.roles
              .filter((role) => role.role === "partner_admin" || role.role === "partner_user")
              .map((role) => (
                <span key={role.id} className="rounded-full border border-[#d8d0c0] bg-white px-3 py-1 text-xs font-bold text-[#173b2d]">
                  {role.organization_name}: {formatSystemLabel(role.role)}
                </span>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function PilotWorkspaceShell({ session }: PilotWorkspaceShellProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [organizations, setOrganizations] = useState<OrganizationPreview[]>([]);
  const [status, setStatus] = useState("Checking Pilot Safe v1 seed data...");
  const [accessStatus, setAccessStatus] = useState("Checking your pilot workspace access...");
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceKey>("overview");
  const [pilotAccess, setPilotAccess] = useState<PilotWorkspaceAccess | null>(null);
  const [hasAppliedRecommendedWorkspace, setHasAppliedRecommendedWorkspace] = useState(false);

  const userEmail = useMemo(() => session.user.email ?? "Signed-in pilot user", [session.user.email]);

  useEffect(() => {
    let isMounted = true;

    async function loadPilotContext() {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, name, slug, organization_type, status")
        .in("slug", ["churchwork", "grandview-post-acute", "hope-church"])
        .order("slug");

      if (!isMounted) return;

      if (error) {
        setStatus(error.message);
      } else {
        setOrganizations((data as OrganizationPreview[] | null) ?? []);
        setStatus("Pilot seed check completed for ChurchWork, Grandview Post Acute, and Hope Church.");
      }

      await supabase.rpc("sync_current_pilot_profile");

      const { error: bootstrapError } = await supabase.rpc("claim_churchwork_bootstrap_admin");
      if (bootstrapError && !bootstrapError.message.toLowerCase().includes("not authorized")) {
        setAccessStatus(bootstrapError.message);
      }

      const { data: accessData, error: accessError } = await supabase.rpc("get_pilot_workspace_access");
      if (!isMounted) return;

      if (accessError) {
        setAccessStatus(accessError.message);
        return;
      }

      const nextAccess = accessData as PilotWorkspaceAccess;
      const recommendedWorkspace = normalizeWorkspaceKey(nextAccess.recommended_workspace);
      const normalizedAccess = {
        ...nextAccess,
        recommended_workspace: recommendedWorkspace,
        roles: nextAccess.roles ?? []
      };

      setPilotAccess(normalizedAccess);
      setAccessStatus(`Recommended workspace: ${workspaceLabels[recommendedWorkspace]}.`);

      if (!hasAppliedRecommendedWorkspace) {
        setActiveWorkspace(recommendedWorkspace);
        setHasAppliedRecommendedWorkspace(true);
      }
    }

    void loadPilotContext();

    return () => {
      isMounted = false;
    };
  }, [hasAppliedRecommendedWorkspace, supabase]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="overflow-hidden rounded-[2rem] border border-[#d8d0c0] bg-white shadow-sm">
        <div className="bg-[#102b3a] p-8 text-white md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">ChurchWork Pilot</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <h2 className="font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Pilot workspace.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d4dedc]">
                {userEmail} is inside the controlled pilot. ChurchWork is now in pilot hardening for the Grandview Post Acute and Hope Church path: structured spiritual-care intake, role-based workspaces, shared timeline visibility, and owner/admin review.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Safety rule</p>
              <p className="mt-3 text-sm leading-6 text-[#edf5e6]">
                Keep all sandbox tests fake. ChurchWork is for spiritual-care coordination only and is not an emergency, clinical, or medical-record system.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-[#d8d0c0] bg-white p-4">
          <div className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Your pilot access</p>
                <p className="mt-2 text-sm font-semibold text-[#173b2d]">{accessStatus}</p>
                <p className="mt-1 text-sm leading-6 text-[#4d5d55]">{summarizeAccess(pilotAccess)}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveWorkspace(pilotAccess?.recommended_workspace ?? "overview")}
                className="rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#102b3a]"
              >
                Go to my workspace
              </button>
            </div>

            {pilotAccess?.roles.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {pilotAccess.roles.map((role) => (
                  <span key={role.id} className="rounded-full border border-[#d8d0c0] bg-white px-3 py-1 text-xs font-bold text-[#173b2d]">
                    {role.organization_name}: {formatSystemLabel(role.role)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 border-b border-[#d8d0c0] bg-[#f7f3ea] p-4 md:grid-cols-5">
          {workspaceTabs.map((tab) => {
            const isActive = activeWorkspace === tab.key;
            const isRecommended = pilotAccess?.recommended_workspace === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveWorkspace(tab.key)}
                className={`rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-[#173b2d] bg-white shadow-sm"
                    : "border-[#d8d0c0] bg-[#f7f3ea] hover:bg-white"
                }`}
              >
                <span className="block text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#789052]">{tab.eyebrow}</span>
                <span className="mt-2 block font-serif text-xl font-semibold text-[#102b3a]">{tab.label}</span>
                <span className="mt-2 block text-sm leading-6 text-[#4d5d55]">{tab.description}</span>
                {isRecommended ? (
                  <span className="mt-3 inline-flex rounded-full bg-[#173b2d] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-white">
                    Recommended
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {activeWorkspace === "overview" ? (
        <section className="mt-8 rounded-[2rem] border border-[#d8d0c0] bg-white p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Owner/Admin</p>
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Active for Cole and Sam: view users, buckets, requests, timeline activity, and access status.</p>
            </article>
            <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Requester path</p>
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Active: structured spiritual-care request only, with no medical notes or open chat.</p>
            </article>
            <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Facility path</p>
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Active: review the Grandview queue, create facility workspaces, and manage users.</p>
            </article>
            <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Partner path</p>
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Active: Hope Church can view assigned partner-safe requests after owner/admin assignment.</p>
            </article>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-[#d8d0c0] bg-[#fffaf0] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Pilot targets</p>
              <div className="mt-4 space-y-3">
                {pilotTargets.map((target) => (
                  <article key={target.name} className="rounded-xl border border-[#e4d8bd] bg-white/75 p-4">
                    <p className="font-serif text-lg font-semibold text-[#102b3a]">{target.name}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#789052]">{target.role}</p>
                    <p className="mt-2 text-sm leading-6 text-[#4d5d55]">{target.detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Next build path</p>
              <ol className="mt-4 space-y-3">
                {nextBuildPath.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-xl border border-[#ded6c8] bg-white/75 p-4 text-sm leading-6 text-[#4d5d55]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#173b2d] text-xs font-black text-white">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="mt-8 rounded-2xl border border-[#d8d0c0] bg-[#173b2d] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Supabase seed check</p>
            <p className="mt-2 text-sm font-semibold text-[#edf5e6]">{status}</p>
            {organizations.length ? (
              <ul className="mt-4 grid gap-3 md:grid-cols-3">
                {organizations.map((organization) => (
                  <li key={organization.id} className="rounded-xl border border-white/20 bg-white/10 p-4 text-sm">
                    <span className="block font-black">{organization.name}</span>
                    <span className="block text-[#d4dedc]">{formatSystemLabel(organization.organization_type)} · {formatSystemLabel(organization.status)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mt-8 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
            Keep sandbox tests fake until role membership, RLS tests, partner report-back actions, and timeline visibility are complete. Worship From Home is queued as a landing-page content layer after the pilot path stays stable.
          </div>
        </section>
      ) : null}

      {activeWorkspace === "owner" ? <OwnerAdminAccessCenter session={session} /> : null}

      {activeWorkspace === "facility" ? (
        <>
          <GrandviewFacilityReviewQueue />
          <FacilitySignupCard session={session} />
          <FacilityUserManagementCard session={session} />
        </>
      ) : null}

      {activeWorkspace === "partner" ? (
        <>
          <HopePartnerAssignmentQueue />
          <PartnerWorkspacePlaceholder access={pilotAccess} />
        </>
      ) : null}

      {activeWorkspace === "requester" ? <StructuredRequesterIntake session={session} /> : null}
    </main>
  );
}
