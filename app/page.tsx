import Link from "next/link";

const trustItems = [
  "Demo only",
  "No real patient data",
  "No live messaging",
  "Facility-controlled",
  "One-way temporary support",
  "Human review where required"
];

const valueCards = [
  {
    title: "Patient Choice",
    body: "Patients and families request support on their terms with clear consent boundaries and temporary delivery windows."
  },
  {
    title: "Facility Control",
    body: "Each facility defines policy rules, response limits, and review requirements before a message can be delivered."
  },
  {
    title: "Approved Responders",
    body: "Only approved responders can participate, helping teams keep support pathways respectful, safe, and accountable."
  },
  {
    title: "Temporary by Design",
    body: "Messages are one-way and time-limited to reduce long-term exposure while still enabling meaningful support."
  }
];

const steps = [
  "Request submitted",
  "Facility rules applied",
  "Approved responder selected",
  "Message reviewed if required",
  "One-way support delivered",
  "Message expires"
];

const facilityPoints = [
  "approved responder access",
  "no public patient browsing",
  "no open chat",
  "review-first workflow",
  "audit-style visibility",
  "configurable facility rules"
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_12%_8%,#d8eefe_0%,transparent_34%),radial-gradient(circle_at_88%_16%,#e9defe_0%,transparent_28%),linear-gradient(180deg,#fffdf8_0%,#f7fbff_38%,#eff5ff_100%)] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-100/80 bg-white/90 p-2.5 shadow-[0_8px_30px_rgba(11,42,77,0.09)]">
              <svg viewBox="0 0 88 88" className="h-9 w-9" aria-hidden="true">
                <circle cx="44" cy="44" r="42" fill="#EAF4FF" />
                <path d="M20 50c9-2 15-7 22-16 7 10 14 15 24 17-7 5-17 8-28 8-8 0-14-2-18-9Z" fill="#123E70" />
                <path d="M48 54c10 0 17 4 23 11" stroke="#4C8F77" strokeWidth="4" strokeLinecap="round" />
                <path d="M66 65c4-1 7-3 9-6M58 62c3-1 6-3 8-5" stroke="#85A95F" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight text-slate-900">SpiritualSolace</p>
              <p className="text-xs tracking-[0.08em] text-slate-500">One-way support. Lasting comfort.</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            <a className="transition hover:text-slate-900" href="#how-it-works">How It Works</a>
            <a className="transition hover:text-slate-900" href="#facilities">For Facilities</a>
            <a className="transition hover:text-slate-900" href="#guardrails">Guardrails</a>
            <a className="transition hover:text-slate-900" href="/app">View Demo</a>
          </nav>

          <Link href="/app" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            View Demo
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-10 px-5 pb-16 pt-8 md:space-y-12 md:px-6 md:pt-10 lg:space-y-14">
        <section className="grid items-center gap-8 lg:grid-cols-[1.04fr_0.96fr] xl:gap-12">
          <div>
            <div className="inline-flex items-center rounded-full border border-teal-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-teal-800 shadow-sm">
              Inclusive spiritual support demo experience
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl xl:text-6xl">
              Care that respects dignity. Support that honors boundaries.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
              A consent-first platform for one-way spiritual support messages—designed for patients, families, and the facilities that serve them.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/app" className="inline-flex items-center justify-center rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(7,102,126,0.28)] transition hover:bg-teal-600">
                View Demo
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
                See How It Works
              </a>
            </div>
          </div>

          <div className="relative rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_20px_60px_rgba(22,53,93,0.14)] backdrop-blur-sm md:p-5">
            <div className="absolute -inset-x-2 -top-3 h-28 rounded-[2rem] bg-gradient-to-r from-sky-200/45 via-teal-100/45 to-indigo-100/40 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.35rem] border border-sky-100/75 bg-[linear-gradient(180deg,#e8f4ff_0%,#f2f8ff_35%,#f8fbff_68%,#fdfcf8_100%)] p-5">
              <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,#d3e7f8_0%,#dceefb_45%,transparent_75%)]" aria-hidden="true" />
              <div className="absolute -right-8 top-6 h-24 w-24 rounded-full bg-teal-100/40 blur-2xl" aria-hidden="true" />
              <div className="relative space-y-4">
                <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Support request lifecycle</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Requested', 'Policy review', 'Approved responder', 'Delivered'].map((status) => (
                      <span key={status} className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-800">
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">One-way message preview</p>
                  <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    “Wishing you peace today. We are holding your family in gentle prayer.”
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">Approved responder</span>
                    <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 font-medium text-teal-700">Review complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="guardrails" className="rounded-2xl border border-teal-100/90 bg-white/75 p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap gap-2.5">
            {trustItems.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {valueCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{card.body}</p>
            </article>
          ))}
        </section>

        <section id="how-it-works" className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How it works</h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="facilities" className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">For facilities</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Designed for operational clarity with policy-led controls, review workflows, and clear oversight for every support pathway.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            {facilityPoints.map((point) => (
              <li key={point} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium">
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-white to-indigo-50 p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Inclusive spiritual support</h2>
          <p className="mt-3 max-w-4xl text-slate-700">
            Built for broad spiritual support workflows, including chaplaincy teams, approved community responders, family support, and facility-defined care policies.
          </p>
        </section>

        <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Explore the demo workflow</h2>
            <p className="mt-2 text-slate-600">Preview the app shell and route flow while preserving facility-first guardrails.</p>
          </div>
          <Link href="/app" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Explore the demo workflow
          </Link>
        </section>
              <p className="pb-2 text-center text-xs tracking-wide text-slate-500">
          Private Preview · SpiritualSolace 0.2c · Demo Prototype
        </p>
      </main>
    </div>
  );
}
