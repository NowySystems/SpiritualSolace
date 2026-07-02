import Link from "next/link";
import { ChurchWorkDoveHero } from "@/components/ChurchWorkDoveHero";
import { ChurchWorkLogo } from "@/components/ChurchWorkLogo";

const flow = [
  { label: "Owner View", detail: "See access, users, organizations, requests, and activity from one control layer." },
  { label: "Facility View", detail: "Create a facility workspace, manage staff, and prepare requests for review." },
  { label: "Partner View", detail: "Coordinate approved partner-side actions from a focused workspace." },
  { label: "Shared Timeline", detail: "Keep approved actions and status updates organized in one place." }
];

export function LandingPageV1() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d2b3b]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="ChurchWork home">
            <ChurchWorkLogo tone="light" tagline="Controlled Team Workspace" markClassName="h-14 w-24" wordClassName="text-3xl" taglineClassName="text-xs" />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white lg:flex">
            <Link href="/pilot" className="hover:text-[#d7e7b7]">Pilot Access</Link>
            <a href="#workspace" className="hover:text-[#d7e7b7]">Workspace</a>
            <a href="#flow" className="hover:text-[#d7e7b7]">Role Views</a>
            <a href="#guardrails" className="hover:text-[#d7e7b7]">Guardrails</a>
          </nav>
          <Link href="/pilot" className="rounded-md bg-[#86a45f] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#789752]">
            Open Pilot
          </Link>
        </div>
      </header>

      <main>
        <section id="workspace" className="relative isolate min-h-[720px] overflow-hidden bg-[#0d2b3b] text-white">
          <div className="absolute inset-y-0 right-[-6rem] top-1/2 z-0 hidden w-[52rem] -translate-y-1/2 opacity-95 lg:block" aria-hidden="true">
            <ChurchWorkDoveHero className="h-full w-full" title="ChurchWork dove hero" />
          </div>
          <div className="absolute right-8 top-28 z-0 hidden rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-md xl:block" aria-hidden="true">
            <ChurchWorkLogo tone="light" variant="mark" markClassName="h-14 w-24" />
          </div>
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(103deg,rgba(8,31,45,0.98)_0%,rgba(8,31,45,0.9)_42%,rgba(8,31,45,0.42)_72%,rgba(8,31,45,0.82)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_24%,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_80%_12%,rgba(159,179,107,0.22),transparent_32%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#f7f3ea]" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-24 pt-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d7e7b7] shadow-sm backdrop-blur">
                ChurchWork pilot access
              </div>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                One controlled workspace for facilities and partners.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e8efef]">
                ChurchWork keeps spiritual support coordination in one app: access is gated, teams are organized by role, and each workspace shows only the right information for that user.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/pilot" className="rounded-lg bg-white px-8 py-4 text-base font-bold text-[#173b2d] shadow-xl hover:bg-[#f0f5e8]">
                  Open Pilot Access
                </Link>
                <Link href="/request-care?demo=true" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  Preview Intake
                </Link>
                <Link href="/care-binder?demo=true" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  See Workspace Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em]">One workspace with role-based views.</h2>
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
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Pilot guardrails</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Controlled access first. Human review before anything external.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#edf5e6]">
              ChurchWork remains one coordinated workspace with Owner View, Facility View, Partner View, and Requester View. Pilot access is gated, structured, and policy-aware. Public demo actions remain preview-only.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
