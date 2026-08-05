import Image from "next/image";
import Link from "next/link";

const portalLinks = [
  {
    label: "Requester Login",
    href: "/requester-portal",
    role: "Families and requesters",
    detail: "Start or check a spiritual-care request through the requester portal."
  },
  {
    label: "Facility Login",
    href: "/facility-portal",
    role: "Facility reviewers",
    detail: "Review requests, approve what may be shared, and manage facility-controlled release."
  },
  {
    label: "Partner Login",
    href: "/partner-portal",
    role: "Churches and care partners",
    detail: "View approved assignments and report safe, non-medical outcomes."
  }
];

const publicFlow = [
  {
    label: "Requester submits",
    detail: "A requester asks for spiritual support through a structured path."
  },
  {
    label: "Facility reviews",
    detail: "The facility controls what can leave the care setting."
  },
  {
    label: "Partner responds",
    detail: "Approved partners receive only released context and provide safe updates."
  }
];

const guardrails = [
  "No emergency workflow",
  "No medical records",
  "No diagnosis or treatment details",
  "No open chat",
  "Facility review before partner sharing",
  "Approved updates only"
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
              <span className="mt-1 block text-xs font-medium tracking-wide text-[#d4dedc]">Spiritual-care coordination</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white lg:flex">
            <a href="#portals" className="hover:text-[#d7e7b7]">Login portals</a>
            <a href="#how-it-works" className="hover:text-[#d7e7b7]">How it works</a>
            <a href="#guardrails" className="hover:text-[#d7e7b7]">Guardrails</a>
          </nav>
          <a href="#portals" className="rounded-md bg-[#86a45f] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#789752]">
            Login
          </a>
        </div>
      </header>

      <main>
        <section className="relative isolate min-h-[720px] overflow-hidden bg-[#0d2b3b] text-white">
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
                ChurchWork pilot MVP
              </div>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                The right spiritual-care request, in the right hands.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e8efef]">
                ChurchWork gives requesters, facilities, and approved care partners separate portals for a controlled, human-reviewed spiritual-care workflow.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/requester-portal" className="rounded-lg bg-white px-8 py-4 text-base font-bold text-[#173b2d] shadow-xl hover:bg-[#f0f5e8]">
                  Requester Login
                </Link>
                <Link href="/facility-portal" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  Facility Login
                </Link>
                <Link href="/partner-portal" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  Partner Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="portals" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">Login portals</p>
            <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.03em]">Choose your ChurchWork portal.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {portalLinks.map((portal) => (
                <Link key={portal.href} href={portal.href} className="rounded-3xl border border-[#ded6c8] bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">{portal.role}</p>
                  <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#102b3a]">{portal.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#4d5d55]">{portal.detail}</p>
                  <span className="mt-5 inline-flex text-sm font-black text-[#173b2d]">Open portal →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-6 pb-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">How it works</p>
            <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.03em]">One request path. Clear roles. Facility-controlled release.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {publicFlow.map((step, index) => (
                <article key={step.label} className="rounded-3xl border border-[#ded6c8] bg-white/75 p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173b2d] text-sm font-black text-white">{index + 1}</span>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#789052]">{step.label}</p>
                  <p className="mt-3 text-sm leading-6 text-[#4d5d55]">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="guardrails" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#d8d0c0] bg-white/75 p-8 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Guardrails</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">ChurchWork is spiritual-care coordination, not a clinical or emergency system.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {guardrails.map((item) => (
                <div key={item} className="rounded-2xl border border-[#ded6c8] bg-[#f8fbf8] px-4 py-4 text-sm font-black text-[#173b2d]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
