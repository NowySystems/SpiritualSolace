import Image from "next/image";
import Link from "next/link";

const flow = [
  { label: "Queue", detail: "Start with the resident list and the highest-ready care need." },
  { label: "Person", detail: "Open Jane Doe's demo record with current needs and church connection." },
  { label: "Action", detail: "Send a consent-confirmed prayer request from the right panel." },
  { label: "Timeline", detail: "Confirm the PRAYER event and recent activity update." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#102b3a]">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d2b3b]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl leading-none text-white">🕊</span>
            <span>
              <span className="block text-3xl font-semibold leading-none tracking-[-0.04em]">Spiritual<span className="text-[#9fb36b]">Solace</span></span>
              <span className="mt-1 block text-xs tracking-wide text-[#d4dedc]">Care Binder · comfort with human review</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-white lg:flex">
            <a href="#care-binder" className="hover:text-[#d7e7b7]">Care Binder</a>
            <a href="#flow" className="hover:text-[#d7e7b7]">Flow</a>
            <a href="#guardrails" className="hover:text-[#d7e7b7]">Guardrails</a>
          </nav>

          <Link href="/care-binder" className="rounded-md bg-[#86a45f] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#789752]">
            Open Care Binder
          </Link>
        </div>
      </header>

      <main>
        <section id="care-binder" className="relative overflow-hidden bg-[#0d2b3b] text-white">
          <div className="absolute inset-0">
            <Image src="/brand/spiritualsolace-hero-dove.png" alt="Soft comfort imagery" fill priority className="object-cover object-[72%_center] opacity-50 mix-blend-screen" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,45,0.98)_0%,rgba(8,31,45,0.9)_42%,rgba(8,31,45,0.4)_72%,rgba(8,31,45,0.86)_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[690px] max-w-7xl items-center px-6 pb-24 pt-32">
            <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#c9d9ae]">Landing Page → Care Binder</p>
                <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                  A focused care binder for spiritual support.
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-8 text-[#e8efef]">
                  SpiritualSolace now opens into a resident-centered binder: queue on the left, person record in the center, actions and recent activity on the right.
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link href="/care-binder" className="rounded-lg bg-[#86a45f] px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-[#789752]">
                    Open Care Binder →
                  </Link>
                  <Link href="/app" className="rounded-lg border border-white/55 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/12">
                    Open in Demo Shell
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
                <div className="grid min-h-[420px] overflow-hidden rounded-[1.4rem] border border-[#d9d2c4]/40 bg-[#eee8db] text-[#1f342b] lg:grid-cols-[0.8fr_1.15fr_0.75fr]">
                  <div className="bg-[#f5efe3] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#53655b]">Care Queue</p>
                    {['Jane Doe', 'Elena Morris', 'Mary Johnson'].map((name, index) => (
                      <div key={name} className={`mt-3 rounded-2xl border p-3 ${index === 0 ? 'border-[#8da167] bg-white shadow-md' : 'border-transparent bg-white/60'}`}>
                        <p className="font-bold">{name}</p>
                        <p className="mt-1 text-xs text-[#69766c]">Room {index === 0 ? '104B' : 'Demo'}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#53655b]">Selected Resident</p>
                    <h2 className="mt-3 font-serif text-4xl font-semibold">Jane Doe</h2>
                    <div className="mt-4 rounded-2xl bg-[#fffaf0] p-4 text-sm leading-6">Current needs, church connection, and spiritual care plan stay visible by default.</div>
                    <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6">Care timeline confirms the prayer request after consent.</div>
                  </div>
                  <div className="bg-[#f5efe3] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#53655b]">Actions</p>
                    <div className="mt-3 rounded-2xl bg-[#173b2d] p-3 text-sm font-black text-white">Send Prayer Request</div>
                    <div className="mt-3 rounded-2xl bg-white/70 p-3 text-sm font-bold">Recent Activity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em]">Queue → Person → Action → Timeline</h2>
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
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">MVP guardrails</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Local demo state first. Human review before anything external.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#edf5e6]">
              Working local actions now include Send Prayer Request, Schedule Visit, Add Follow-Up, and Add Note. Contact Church, Assign Volunteer, and Message Care Team remain scaffolded until human-reviewed external workflows are approved.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
