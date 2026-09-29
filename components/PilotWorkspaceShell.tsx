"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
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

const portalCards = [
  {
    title: "Requester Portal",
    eyebrow: "Family / resident view",
    href: "/requester-portal",
    accent: "requester",
    description: "Submit a structured spiritual-care request and view approved updates only.",
    primaryAction: "Open requester view"
  },
  {
    title: "Facility Portal",
    eyebrow: "Review / consent lane",
    href: "/facility-portal",
    accent: "facility",
    description: "Review requests, confirm consent, approve sharing, and track the care ledger.",
    primaryAction: "Open facility view"
  },
  {
    title: "Partner Portal",
    eyebrow: "Church partner lane",
    href: "/partner-portal",
    accent: "partner",
    description: "See approved assignments, accept care work, and report structured outcomes.",
    primaryAction: "Open partner view"
  }
];

const operatingChecks = [
  "Use fake pilot data only until the live workflow is approved.",
  "Do not enter symptoms, medications, diagnoses, chart notes, or insurance details.",
  "Use the three portals to test the role experience before building deeper admin analytics."
];

function formatSystemLabel(value: string | null | undefined) {
  if (!value) return "";
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function accentClasses(accent: string) {
  if (accent === "facility") {
    return {
      card: "border-[#7eb5b1] bg-[#eef8f7]",
      bar: "bg-[#1f6f6b]",
      pill: "bg-[#d9efed] text-[#1f5d5a]",
      button: "bg-[#1f6f6b] hover:bg-[#185956]"
    };
  }

  if (accent === "partner") {
    return {
      card: "border-[#9dbb82] bg-[#f0f7ed]",
      bar: "bg-[#315f44]",
      pill: "bg-[#e1efd8] text-[#315f44]",
      button: "bg-[#315f44] hover:bg-[#244936]"
    };
  }

  return {
    card: "border-[#e0bd65] bg-[#fff8e5]",
    bar: "bg-[#a8791f]",
    pill: "bg-[#f7e8b9] text-[#76551c]",
    button: "bg-[#173b2d] hover:bg-[#102b3a]"
  };
}

export function PilotWorkspaceShell({ session }: PilotWorkspaceShellProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [organizations, setOrganizations] = useState<OrganizationPreview[]>([]);
  const [status, setStatus] = useState("Checking pilot workspace...");

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
        setStatus("Pilot workspace ready.");
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="overflow-hidden rounded-[2.2rem] border border-[#173b2d]/15 bg-white shadow-[0_2rem_7rem_rgba(13,43,59,0.12)]">
        <div className="bg-[linear-gradient(135deg,#082838_0%,#0d2b3b_58%,#123c3d_100%)] p-8 text-white md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Internal operator workspace</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h2 className="font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Choose the portal you need.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d4dedc]">
                {userEmail} is signed in for pilot operations. Use this launchpad to test and support the requester, facility, and partner experiences without building a full owner/admin command center yet.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c8d9b3]">Current focus</p>
              <p className="mt-3 text-sm leading-6 text-[#edf5e6]">
                Keep the pilot case-first: submit the need, review it, approve sharing, and complete partner follow-up. Admin KPIs and reporting can come later.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 bg-[#eef4f1] p-5 md:grid-cols-3">
          {portalCards.map((portal) => {
            const classes = accentClasses(portal.accent);
            return (
              <Link
                key={portal.title}
                href={portal.href}
                className={`group relative overflow-hidden rounded-[1.7rem] border ${classes.card} p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl`}
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${classes.bar}`} />
                <span className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] ${classes.pill}`}>{portal.eyebrow}</span>
                <h3 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{portal.title}</h3>
                <p className="mt-3 min-h-16 text-sm font-semibold leading-7 text-[#4d5d55]">{portal.description}</p>
                <span className={`mt-6 inline-flex rounded-xl px-4 py-3 text-sm font-black text-white shadow-sm transition ${classes.button}`}>
                  {portal.primaryAction} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[#173b2d]/10 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#506a49]">Operator notes</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em] text-[#0d2b3b]">Pilot operations before admin analytics.</h3>
          <div className="mt-5 grid gap-3">
            {operatingChecks.map((check, index) => (
              <div key={check} className="flex gap-3 rounded-2xl border border-[#dfe6dd] bg-[#f8faf7] p-4 text-sm font-semibold leading-6 text-[#4d5d55]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#173b2d] text-xs font-black text-white">{index + 1}</span>
                <span>{check}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#173b2d]/10 bg-[#0d2b3b] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c8d9b3]">Connected pilot orgs</p>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#d4dedc]">{status}</p>
          {organizations.length ? (
            <ul className="mt-5 grid gap-3">
              {organizations.map((organization) => (
                <li key={organization.id} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm">
                  <span className="block font-black">{organization.name}</span>
                  <span className="mt-1 block text-[#d4dedc]">{formatSystemLabel(organization.organization_type)} · {formatSystemLabel(organization.status)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </main>
  );
}
