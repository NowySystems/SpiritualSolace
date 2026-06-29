import Image from "next/image";
import Link from "next/link";

const flow = [
  { label: "Request", detail: "Preview how a family member, resident, staff member, or church member prepares a spiritual care need." },
  { label: "Queue", detail: "Show how that future request becomes a care team queue item for human review." },
  { label: "Care Binder", detail: "Keep the person, their care context, and church connection together." },
  { label: "Timeline", detail: "Confirm each local care step before deciding what should happen next." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d2b3b]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl leading-none text-white">🕊</span>
            <span>
              <span className="block text-3xl font-semibold leading-none tracking-[-0.04em]">Church<span className="text-[#9fb36b]">Work</span></span>
              <span className="mt-1 block text-xs tracking-wide text-[#d4dedc]">Spiritual care operations for churches</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-white lg:flex">
            <a href="#care-binder" className="hover:text-[#d7e7b7]">Care Binder</a>
            <Link href="/request-care" className="hover:text-[#d7e7b7]">Requester Demo</Link>
            <a href="#flow" className="hover:text-[#d7e7b7]">Care Flow</a>
            <a href="#guardrails" className="hover:text-[#d7e7b7]">Guardrails</a>
            <a href="#pilot-contact" className="hover:text-[#d7e7b7]">Pilot Demo</a>
          </nav>

          <Link href="/care-binder" className="rounded-md bg-[#86a45f] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#789752]">
            Enter Care Binder
          </Link>
        </div>
      </header>

      <main>
        <section id="care-binder" className="relative isolate min-h-[720px] overflow-hidden bg-[#0d2b3b] text-white">
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

          <div className="mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-24 pt-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d7e7b7] shadow-sm backdrop-blur">
                ChurchWork pilot preview
              </div>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                Helping churches organize the work of caring for people.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e8efef]">
                Coordinate spiritual care requests, visits, follow-ups, volunteer care, and church connections in one simple care workflow.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/request-care" className="rounded-lg bg-white px-8 py-4 text-base font-bold text-[#173b2d] shadow-xl hover:bg-[#f0f5e8]">
                  Preview Request Portal
                </Link>
                <Link href="/care-binder?demo=true" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                  See Care Team Demo
                </Link>
                <a href="#pilot-contact" className="rounded-lg bg-[#86a45f] px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-[#789752]">
                  Request Pilot Demo
                </a>
              </div>
              <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-[#cbd8d7]">
                Request Portal preview is gated and demo-only. It does not accept, store, route, or send real care requests.
              </p>
            </div>
          </div>
        </section>

        <section id="flow" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em]">One care coordination story from request to follow-up.</h2>
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

        <section id="guardrails" className="px-6 pb-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#d8d0c0] bg-[#173b2d] p-8 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">MVP guardrails</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Gated demo state first. Human review before anything external.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#edf5e6]">
              The Request Portal preview is demo-only and does not submit, store, email, or route requests. Working local Care Binder actions include Send Prayer Request, Contact Church, Schedule Visit, Add Follow-Up, and Add Note. Assign Volunteer and Message Care Team remain scaffolded until human-reviewed external workflows are approved.
            </p>
          </div>
        </section>

        <section id="pilot-contact" className="px-6 pb-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[2rem] border border-[#d8d0c0] bg-white/75 p-8 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Pilot demo</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] text-[#102b3a]">Ready to review ChurchWork with your care team?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4d5d55]">
                Requesting a pilot demo is a separate contact step and does not launch the requester preview or guided Care Binder walkthrough.
              </p>
            </div>
            <a href="mailto:pilot@example.com?subject=ChurchWork%20Pilot%20Demo%20Request" className="inline-flex justify-center rounded-lg bg-[#0d2b3b] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#173b2d]">
              Email Pilot Request
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
