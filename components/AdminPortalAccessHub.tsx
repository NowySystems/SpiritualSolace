"use client";

import { OwnerNetworkAdmin } from "@/components/OwnerNetworkAdmin";

type AdminPortalAccessHubProps = {
  session?: { user?: { email?: string | null } } | null;
};

const primaryCards = [
  {
    label: "Pilot MVP Workflow",
    href: "/mvp",
    eyebrow: "Working pilot surface",
    description: "Run the active ChurchWork pilot workflow: requester intake, facility review, partner assignment, outcome, and requester status.",
    status: "Primary"
  },
  {
    label: "Requester Login",
    href: "/requester-login",
    eyebrow: "Role login",
    description: "Open the requester-facing login entrance exactly as a family or requester would see it.",
    status: "Portal"
  },
  {
    label: "Facility Login",
    href: "/facility-login",
    eyebrow: "Role login",
    description: "Open the facility reviewer login entrance for Grandview-style review and release control.",
    status: "Portal"
  },
  {
    label: "Partner Login",
    href: "/partner-login",
    eyebrow: "Role login",
    description: "Open the approved partner login entrance for assignment and safe report-back review.",
    status: "Portal"
  }
];

const backendCards = [
  { label: "Public Site", href: "/", eyebrow: "Front door", status: "Public" },
  { label: "Synthetic Smoke", href: "/synthetic-smoke", eyebrow: "BI contract", status: "Test" },
  { label: "AI Map", href: "/ai-map", eyebrow: "BI-readable map", status: "Contract" },
  { label: "Pilot Auth Check", href: "/pilot-auth-check", eyebrow: "Browser diagnostic", status: "Diagnostic" },
  { label: "Server Auth Check", href: "/pilot-auth-server-check", eyebrow: "Server diagnostic", status: "Diagnostic" },
  { label: "Safe Preview Hub", href: "/preview", eyebrow: "Static review", status: "Internal" },
  { label: "Synthetic Demo", href: "/demo/synthetic", eyebrow: "Demo theater", status: "Internal" },
  { label: "PWA Check", href: "/pwa-check", eyebrow: "Install diagnostic", status: "Diagnostic" }
];

const pilotPath = [
  "Requester enters the correct role login.",
  "Facility reviews the request before anything leaves the facility side.",
  "Partner sees only approved context.",
  "Partner logs a structured spiritual-care outcome.",
  "Requester sees approved status only.",
  "BI/synthetic checks confirm route boundaries and guardrails."
];

function StatusPill({ children }: { children: string }) {
  return <span className="rounded-full border border-[#d6a943]/40 bg-[#fff8e7] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#7a5b20]">{children}</span>;
}

export function AdminPortalAccessHub({ session = null }: AdminPortalAccessHubProps) {
  const userEmail = session?.user?.email ?? "Internal operator";

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <header className="border-b border-white/10 bg-[#082838] text-white shadow-xl shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-4">
            <a href="/" className="flex h-14 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm" aria-label="Open ChurchWork public site">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </a>
            <div>
              <p className="font-serif text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Church<span className="text-[#8dbd9e]">Work</span></p>
              <p className="text-xs font-semibold text-[#d9e7df]">Internal Backend · Pilot Command Center</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/" className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-black text-[#d9e7df] hover:bg-white/14">Public site</a>
            <StatusPill>{session ? "Signed in" : "Internal"}</StatusPill>
            <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold text-[#d9e7df]">{userEmail}</div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[118rem] px-5 py-7 md:px-8 md:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="bg-[#0f3f35] px-6 py-8 text-white md:px-10 md:py-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c7e2d0]">Pilot backend</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
              <div>
                <h1 className="max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">One place to run the pilot.</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#d9e7df]">
                  This backend is for internal operators only. Use it to reach the pilot MVP, role logins, public site, and BI/test surfaces without getting lost.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c7e2d0]">Boundary</p>
                <p className="mt-3 text-sm leading-6 text-[#edf5e6]">The public site points to role logins only. Backend, diagnostics, previews, and sandbox surfaces stay internal.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-[#f8fbf8] p-5 md:p-7 lg:grid-cols-4">
            {primaryCards.map((card) => (
              <a key={card.href} href={card.href} className="group flex min-h-[15rem] flex-col justify-between rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 transition hover:-translate-y-1 hover:border-[#8dbd9e] hover:shadow-xl hover:shadow-[#0d2b3b]/10">
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
        </section>

        <OwnerNetworkAdmin />

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Pilot path</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">What the MVP must prove next.</h2>
            <ol className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-[#4f6259] md:grid-cols-2">
              {pilotPath.map((step, index) => (
                <li key={step} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0f6b54] text-xs font-black text-white">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/mvp" className="rounded-xl bg-[#082838] px-5 py-3 text-sm font-black text-white hover:bg-[#0f3f35]">Open pilot MVP</a>
              <a href="/" className="rounded-xl border border-[#0f3f35] bg-white px-5 py-3 text-sm font-black text-[#0f3f35] hover:bg-[#e7f1eb]">Open public site</a>
              <a href="/synthetic-smoke" className="rounded-xl border border-[#0f3f35] bg-white px-5 py-3 text-sm font-black text-[#0f3f35] hover:bg-[#e7f1eb]">Run smoke contract</a>
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Backend links</p>
            <div className="mt-5 grid gap-3">
              {backendCards.map((card) => (
                <a key={card.href} href={card.href} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4 transition hover:bg-white">
                  <span className="block text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{card.eyebrow}</span>
                  <span className="mt-1 block font-black text-[#0d2b3b]">{card.label}</span>
                  <span className="mt-2 inline-block rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">{card.status}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
