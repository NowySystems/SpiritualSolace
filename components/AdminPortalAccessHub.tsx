"use client";

import { OwnerNetworkAdmin } from "@/components/OwnerNetworkAdmin";

const cards = [
  { label: "Demo", href: "/demo/synthetic", description: "Play or step through the complete ChurchWork story." },
  { label: "Requester", href: "/request", description: "Open the anonymous requester flow." },
  { label: "Facility", href: "/facility-login", description: "Open the facility workspace." },
  { label: "Care Partner", href: "/partner-login", description: "Open the care-partner workspace." }
];

type AdminPortalAccessHubProps = { session?: { user?: { email?: string | null } } | null };

export function AdminPortalAccessHub({ session: _session = null }: AdminPortalAccessHubProps = {}) {
  return <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
    <header className="border-b border-[#d9dfd7] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <a href="/" className="flex items-center gap-3">
          <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-11 w-16 object-contain" />
          <div><p className="font-serif text-2xl font-semibold">Church<span className="text-[#6e9a7c]">Work</span></p><p className="text-xs font-bold text-[#60736a]">Admin</p></div>
        </a>
        <a href="/" className="rounded-xl border border-[#d9dfd7] px-4 py-2 text-sm font-black">Public site</a>
      </div>
    </header>

    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Pilot control</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em]">ChurchWork Admin</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4f6259]">Run the demo, open each live role, and manage the ChurchWork network from one simple page.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(card => <a key={card.href} href={card.href} className="rounded-[1.4rem] border border-[#d9dfd7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
          <h2 className="font-serif text-2xl font-semibold">{card.label}</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-[#4f6259]">{card.description}</p>
          <span className="mt-5 inline-flex rounded-xl bg-[#082838] px-4 py-2 text-sm font-black text-white">Open</span>
        </a>)}
      </div>

      <OwnerNetworkAdmin />

      <section className="mt-7 rounded-[1.4rem] border border-[#d9dfd7] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Tools</p><h2 className="mt-1 font-serif text-2xl font-semibold">Pilot diagnostics</h2></div>
          <div className="flex flex-wrap gap-2">
            <a href="/synthetic-smoke" className="rounded-xl border px-4 py-2 text-sm font-black">Smoke test</a>
            <a href="/ai-map" className="rounded-xl border px-4 py-2 text-sm font-black">AI map</a>
            <a href="/pilot-auth-check" className="rounded-xl border px-4 py-2 text-sm font-black">Auth check</a>
          </div>
        </div>
      </section>
    </section>
  </main>;
}
