"use client";

import { useMemo, useState } from "react";

type AdminPortalAccessHubProps = {
  session?: { user?: { email?: string | null } } | null;
};

type ToolKey = "overview" | "owner" | "facility" | "requester";

const portalCards = [
  {
    label: "Requester Portal",
    href: "/requester-portal",
    eyebrow: "Family/requester view",
    description: "Open the requester profile, structured intake, status path, and approved updates view.",
    status: "Final surface live"
  },
  {
    label: "Facility Portal",
    href: "/facility-portal",
    eyebrow: "Grandview workspace",
    description: "Open the facility review console with request snapshot, consent, sharing, actions, and activity record.",
    status: "Final surface live"
  },
  {
    label: "Partner Portal",
    href: "/partner-portal",
    eyebrow: "Hope Church workspace",
    description: "Open the partner assignment workspace with approved context and report-back actions.",
    status: "Final surface live"
  },
  {
    label: "Landing Page",
    href: "/",
    eyebrow: "Public front door",
    description: "Return to the public ChurchWork presentation/portal entry page.",
    status: "Public route"
  }
];

const adminTools: { key: ToolKey; label: string; description: string }[] = [
  {
    key: "overview",
    label: "Admin overview",
    description: "Operator launchpad, guardrails, pilot targets, and next wiring path."
  },
  {
    key: "owner",
    label: "Owner/Admin tools",
    description: "Gated operational tools move through /pilot while Supabase auth is being checked."
  },
  {
    key: "facility",
    label: "Facility setup",
    description: "Facility signup and user-management tools stay behind the gated pilot path."
  },
  {
    key: "requester",
    label: "Requester intake tool",
    description: "Structured test intake stays behind the gated pilot path."
  }
];

const pilotTargets = [
  "Grandview Post Acute facility review path",
  "Hope Church partner assignment path",
  "Requester profile, intake, and approved status path",
  "Admin/operator access for Cole and Sam"
];

const wiringPath = [
  "Requester intake writes a structured request to Supabase.",
  "Facility sees the request in review and records consent/sharing state.",
  "Facility releases approved context to partner assignment.",
  "Partner logs a safe update/outcome.",
  "Requester sees approved updates only."
];

function StatusPill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#d6a943]/40 bg-[#fff8e7] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#7a5b20]">
      {children}
    </span>
  );
}

function GatedToolNotice({ label }: { label: string }) {
  return (
    <section className="rounded-[1.5rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-6 shadow-sm shadow-[#0d2b3b]/5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a6b16]">Temporarily gated</p>
      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{label} stay on /pilot for now.</h2>
      <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#5f4b1f]">
        This open /admin route is the PWA/operator launchpad only. Supabase-backed write tools are intentionally not mounted here so an auth/network issue cannot break the app home base.
      </p>
      <a
        href="/pilot"
        className="mt-5 inline-flex rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-[#102b3a]"
      >
        Open gated pilot path
      </a>
    </section>
  );
}

export function AdminPortalAccessHub({ session = null }: AdminPortalAccessHubProps) {
  const [activeTool, setActiveTool] = useState<ToolKey>("overview");
  const userEmail = useMemo(() => session?.user?.email ?? "Operator launchpad", [session?.user?.email]);
  const accessLabel = session ? "Signed in" : "Open hub";

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <header className="border-b border-white/10 bg-[#082838] text-white shadow-xl shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Church<span className="text-[#8dbd9e]">Work</span></p>
              <p className="text-xs font-semibold text-[#d9e7df]">Admin Portal · Operator Access Hub</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusPill>{accessLabel}</StatusPill>
            <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold text-[#d9e7df]">
              {userEmail}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[118rem] px-5 py-7 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="bg-[#0f3f35] px-6 py-8 text-white md:px-10 md:py-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c7e2d0]">ChurchWork admin access</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
              <div>
                <h1 className="max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                  One place to open every pilot role.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#d9e7df]">
                  Use this as the installed app landing screen for Cole and Sam. It is not the future analytics dashboard; it is the operator launchpad for testing, demos, and controlled pilot access.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c7e2d0]">Pilot safety</p>
                <p className="mt-3 text-sm leading-6 text-[#edf5e6]">
                  Sandbox data only. Spiritual-care coordination only. No emergency workflow, medical record, open chat, or uncontrolled partner routing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-[#f8fbf8] p-5 md:p-7 lg:grid-cols-4">
            {portalCards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="group flex min-h-[15rem] flex-col justify-between rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 transition hover:-translate-y-1 hover:border-[#8dbd9e] hover:shadow-xl hover:shadow-[#0d2b3b]/10"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{card.eyebrow}</p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{card.label}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#4f6259]">{card.description}</p>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">{card.status}</span>
                  <span className="rounded-full bg-[#082838] px-3 py-2 text-sm font-black text-white group-hover:bg-[#0f3f35]">Open</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[20rem_1fr]">
          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-4 shadow-sm shadow-[#0d2b3b]/5">
            <p className="px-2 text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Admin tools</p>
            <div className="mt-4 space-y-2">
              {adminTools.map((tool) => {
                const isActive = activeTool === tool.key;
                return (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => setActiveTool(tool.key)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? "border-[#0f3f35] bg-[#e7f1eb] shadow-sm"
                        : "border-[#d9dfd7] bg-white hover:bg-[#f8fbf8]"
                    }`}
                  >
                    <span className="block font-black text-[#0d2b3b]">{tool.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#4f6259]">{tool.description}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0">
            {activeTool === "overview" ? (
              <div className="space-y-6">
                <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Operator overview</p>
                      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Admin Portal is the PWA home base.</h2>
                    </div>
                    <StatusPill>PWA start target</StatusPill>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Pilot targets</p>
                      <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-[#4f6259]">
                        {pilotTargets.map((target) => (
                          <li key={target} className="flex gap-3">
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0f6b54]" />
                            <span>{target}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-[#eed9a8] bg-[#fffaf0] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9a6b16]">Next wiring path</p>
                      <ol className="mt-4 space-y-3 text-sm font-semibold leading-6 text-[#5f4b1f]">
                        {wiringPath.map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d6a943] text-xs font-black text-[#0d2b3b]">{index + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-6 text-sm font-semibold leading-7 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5">
                  This /admin page intentionally avoids Supabase calls so the PWA home base stays accessible even when auth is failing. Use /pilot for gated testing after auth is stable.
                </section>
              </div>
            ) : activeTool === "owner" ? (
              <GatedToolNotice label="Owner/Admin tools" />
            ) : activeTool === "facility" ? (
              <GatedToolNotice label="Facility setup tools" />
            ) : (
              <GatedToolNotice label="Requester intake tools" />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
