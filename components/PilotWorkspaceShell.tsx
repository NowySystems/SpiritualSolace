"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { FacilitySignupCard } from "@/components/FacilitySignupCard";
import { FacilityUserManagementCard } from "@/components/FacilityUserManagementCard";
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

type WorkspaceKey = "overview" | "owner" | "facility" | "requester";

const workspaceTabs: { key: WorkspaceKey; label: string; eyebrow: string; description: string }[] = [
  { key: "overview", label: "Overview", eyebrow: "Pilot status", description: "Seed check, guardrails, and current pilot paths." },
  { key: "owner", label: "Owner/Admin", eyebrow: "Platform view", description: "Users, role buckets, requests, and timeline oversight." },
  { key: "facility", label: "Facility", eyebrow: "Facility ops", description: "Create a facility workspace and manage facility users." },
  { key: "requester", label: "Requester", eyebrow: "Spiritual-care request", description: "Submit a structured spiritual-care request." }
];

function formatSystemLabel(value: string | null | undefined) {
  if (!value) return "";
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function PilotWorkspaceShell({ session }: PilotWorkspaceShellProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [organizations, setOrganizations] = useState<OrganizationPreview[]>([]);
  const [status, setStatus] = useState("Checking Pilot Safe v1 seed data...");
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceKey>("overview");

  const userEmail = useMemo(() => session.user.email ?? "Signed-in pilot user", [session.user.email]);

  useEffect(() => {
    let isMounted = true;

    supabase
      .from("organizations")
      .select("id, name, slug, organization_type, status")
      .in("slug", ["churchwork", "grandview-post-acute", "hope-church"])
      .order("slug")
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error) {
          setStatus(error.message);
          return;
        }

        setOrganizations((data as OrganizationPreview[] | null) ?? []);
        setStatus("Pilot seed check completed.");
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="overflow-hidden rounded-[2rem] border border-[#d8d0c0] bg-white shadow-sm">
        <div className="bg-[#102b3a] p-8 text-white md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">ChurchWork Pilot</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <h2 className="font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Pilot workspace.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d4dedc]">
                {userEmail} is inside the controlled pilot. Choose a workspace below. ChurchWork coordinates spiritual care with structured requests, approved roles, and clear visibility boundaries.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Safety rule</p>
              <p className="mt-3 text-sm leading-6 text-[#edf5e6]">
                Keep all sandbox tests fake. ChurchWork is for spiritual-care coordination only and is not an emergency or clinical system.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-b border-[#d8d0c0] bg-[#f7f3ea] p-4 md:grid-cols-4">
          {workspaceTabs.map((tab) => {
            const isActive = activeWorkspace === tab.key;
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
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Active for Cole and Sam: view users, buckets, requests, and timeline activity.</p>
            </article>
            <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Requester path</p>
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Active: structured spiritual-care request only.</p>
            </article>
            <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Facility path</p>
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Active: create a facility workspace and manage facility users inside that organization.</p>
            </article>
            <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Partner path</p>
              <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Next: partner signup, partner admins, and partner-safe workspaces.</p>
            </article>
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
            Keep sandbox tests fake until role membership, RLS tests, facility review, partner assignment, and timeline visibility are complete.
          </div>
        </section>
      ) : null}

      {activeWorkspace === "owner" ? <OwnerAdminAccessCenter session={session} /> : null}

      {activeWorkspace === "facility" ? (
        <>
          <FacilitySignupCard session={session} />
          <FacilityUserManagementCard session={session} />
        </>
      ) : null}

      {activeWorkspace === "requester" ? <StructuredRequesterIntake session={session} /> : null}
    </main>
  );
}
