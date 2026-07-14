import Image from "next/image";
import Link from "next/link";

const flow = [
  {
    label: "Requester Portal",
    href: "/requester-portal",
    detail: "Submit a structured spiritual-care request, track approved updates, and avoid open-ended or medical details."
  },
  {
    label: "Facility Portal",
    href: "/facility-portal",
    detail: "Review requests, record consent, control partner sharing, and keep an audit-backed care timeline."
  },
  {
    label: "Partner Portal",
    href: "/partner-portal",
    detail: "Receive approved assignments, see only partner-safe context, and report outcomes through structured actions."
  },
  {
    label: "Owner/Admin",
    href: "/pilot",
    detail: "Manage organizations, access, roles, requests, and operational oversight from one control layer."
  }
];

export function LandingPageV1() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d2b3b]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="ChurchWork home" className="flex items-center gap-3">
            <span className="inline-flex h-[4.6rem] w-[7.8rem] items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork CW logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-3xl font-semibold leading-none tracking-[-0.04em] text-white">
                Church<span className="text-[#3f806e]">Work</span>
              </span>
              <span className="mt-1 block text-xs font-medium tracking-wide text-[#d4dedc]">Spiritual-care operations</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white lg:flex">
            <a href="#portals" className="hover:text-[#d7e7b7]">Portals</a>
            <a href="#workspace" className="hover:text-[#d7e7b7]">Workspace</a>
            <a href="#flow" className="hover:text-[#d7e7b7]">Role Views</a>
            <a href="#guardrails" className="hover:text-[#d7e7b7]">Guardrails</a>
          </nav>
          <Link href="/facility-portal" className="rounded-md bg-[#86a45f] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#789752]">
            Facility Portal
          </Link>
        </div>
      </header>

      <main>
        <section id="workspace" className="relative isolate min-h-[720px] overflow-hidden bg-[#0d2b3b] text-white">
          <Image
            src="/brand/churchwork-hero-dove.png"
            alt="ChurchWork hero dove"
            fill
            priority
            className="-z-30 object-cover object-[74%_center] opacity-90 md:object-[78%_center]"
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(103deg,rgba(8,31,45,0.98)_0%,rgba(8,31,45,0.9)_42%,rgba(8,31,45,0.35)_72%,rgba(8,31,45,0.82)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_24%,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_80%_12%,rgba(159,179,107,0.22),transparent_32%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#f7f3ea]" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-24 pt-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d7e7b7] shadow-sm backdrop-blur">
                Spiritual-care operations
              </div>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                One controlled workspace for facilities and partners.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e8efef]">
                ChurchWork keeps spiritual support coordination in one app: each portal is simple, access is gated, and the shared timeline shows only the right information for that user.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/requester-portal" className="rounded-lg bg-white px-8 py-4 text-base font-bold text-[#173b2d] shadow-xl hover:bg-[#f0f5e8]">
                  Requester Portal
                </Link>
                <Link href="/facility-portal" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  Facility Portal
                </Link>
                <Link href="/partner-portal" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  Partner Portal
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="portals" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">Role-based portals</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em]">Three simple portals. One shared care timeline.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {flow.slice(0, 3).map((step) => (
                <Link key={step.label} href={step.href} className="rounded-3xl border border-[#ded6c8] bg-white/75 p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">{step.label}</p>
                  <p className="mt-3 text-sm leading-6 text-[#4d5d55]">{step.detail}</p>
                  <span className="mt-5 inline-flex text-sm font-black text-[#173b2d]">Open portal →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="flow" className="px-6 pb-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em]">Same product, different workspaces.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {flow.map((step) => (
                <article key={step.label} className="rounded-3xl border border-[#ded6c8] bg-white/70 p-6 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">{step.label}</p>
                  <p className="mt-3 text-sm leading-6 text-[#4d5d55]">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="guardrails" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#d8d0c0] bg-[#173b2d] p-8 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Operational guardrails</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Controlled access first. Human review before anything external.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#edf5e6]">
              ChurchWork remains one coordinated workspace with requester, facility, partner, and owner/admin access. Access is gated, actions are structured, and external sharing stays under review.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
