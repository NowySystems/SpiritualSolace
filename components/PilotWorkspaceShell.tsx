"use client";

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

export function PilotWorkspaceShell({ session }: PilotWorkspaceShellProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [organizations, setOrganizations] = useState<OrganizationPreview[]>([]);
  const [status, setStatus] = useState("Checking Pilot Safe v1 seed data...");

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
      <section className="rounded-[2rem] border border-[#d8d0c0] bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Pilot Safe v1</p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em]">Pilot foundation is gated.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4d5d55]">
          {userEmail} has passed the first access layer. This shell confirms auth and required acknowledgments before care workflows are built.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Requester path</p>
            <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Next: structured spiritual-care request only. No requester notes and no medical information.</p>
          </article>
          <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Facility path</p>
            <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Grandview users will review, prioritize, and coordinate non-medical spiritual-care requests.</p>
          </article>
          <article className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Partner path</p>
            <p className="mt-3 text-sm leading-6 text-[#4d5d55]">Hope Church users will see assigned partner-safe request context and log non-medical care actions.</p>
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
                  <span className="block text-[#d4dedc]">{organization.organization_type} · {organization.status}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-8 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
          This shell is not the care workflow. Do not distribute access broadly until structured intake, role membership, RLS tests, and timeline visibility are complete.
        </div>
      </section>
    </main>
  );
}
