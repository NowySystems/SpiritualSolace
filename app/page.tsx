import Link from "next/link";

const valueCards = [
  { title: "Patient Choice", body: "Patients and families request support on their terms, with clear consent boundaries." },
  { title: "Human Review", body: "Facilities can require review checkpoints before any message is delivered." },
  { title: "Approved Responders", body: "Only approved responders can participate within facility-defined scope." },
  { title: "Temporary by Design", body: "Support messages are time-limited and expire to reduce long-term exposure." }
];

const steps = [
  "Patient or family submits a request",
  "Facility rules are applied",
  "Approved responder is selected",
  "Message is reviewed if required",
  "One-way support is delivered",
  "Message expires"
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50 text-slate-800">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 80 80" className="h-10 w-10" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="#E2F3F6"/><path d="M20 45c8-2 15-9 20-17 7 10 14 15 24 16-7 4-15 6-24 6-8 0-14-1-20-5Z" fill="#0F766E"/><path d="M45 48c7 0 13 4 16 9" stroke="#65A30D" strokeWidth="3" strokeLinecap="round"/></svg>
          <div>
            <p className="text-xl font-bold text-slate-900">SpiritualSolace</p>
            <p className="text-xs tracking-wide text-slate-500">One-way support. Lasting comfort.</p>
          </div>
        </div>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works">How It Works</a><a href="#facilities">For Facilities</a><a href="#guardrails">Guardrails</a><a href="#about">About</a>
        </nav>
        <Link href="/app" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">View Demo</Link>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-16 px-6 pb-16 pt-8">
        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">Care that respects dignity. Support that honors boundaries.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">A consent-first platform for one-way spiritual support messages—designed for patients, families, and the facilities that serve them.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/app/support-requests" className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white">Request Spiritual Support (Demo)</Link>
              <a href="#how-it-works" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">See How It Works</a>
            </div>
          </div>
          <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-100 via-white to-indigo-100 p-8">
            <div className="h-72 rounded-2xl bg-gradient-to-b from-sky-200 via-cyan-100 to-white p-4">
              <svg viewBox="0 0 400 240" className="h-full w-full"><path d="M0 220Q80 150 160 185T320 175T400 190V240H0Z" fill="#cbd5e1"/><path d="M0 230Q100 180 200 210T400 205V240H0Z" fill="#94a3b8"/><path d="M165 105c26-6 49-26 65-51 19 30 41 45 72 47-20 13-43 19-72 19-26 0-46-4-65-15Z" fill="#0f766e"/><path d="M240 132c16 0 30 9 36 22" stroke="#65a30d" strokeWidth="6" strokeLinecap="round"/></svg>
            </div>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{valueCards.map((c)=><article key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-900">{c.title}</h3><p className="mt-2 text-sm text-slate-600">{c.body}</p></article>)}</section>
        <section id="how-it-works" className="rounded-3xl border border-slate-200 bg-white p-8"><h2 className="text-2xl font-bold text-slate-900">How it works</h2><ol className="mt-6 grid gap-3 md:grid-cols-2">{steps.map((s,i)=><li key={s} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"><span className="mr-2 font-semibold text-slate-900">{i+1}.</span>{s}</li>)}</ol></section>
        <section id="facilities" className="rounded-3xl border border-slate-200 bg-white p-8"><h2 className="text-2xl font-bold text-slate-900">For facilities</h2><p className="mt-4 text-slate-600">SpiritualSolace keeps operational control with facilities: rules are facility-controlled, responder access is approved, there is no public patient browsing, no open chat channel, messages are temporary, and teams maintain audit-style visibility.</p></section>
        <section id="guardrails" className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm font-semibold text-amber-900">Demo only. No real patient data. No live messaging. No integrations.</p></section>
        <section id="about" className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-8"><div><h2 className="text-2xl font-bold text-slate-900">Ready to explore the prototype?</h2><p className="mt-2 text-slate-600">Consent-first spiritual support for patients, families, and facilities.</p></div><Link href="/app" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Go to Dashboard</Link></section>
      </main>
    </div>
  );
}
