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
                <circle cx="44" cy="44" r="42" fill="#E8F5FF" />
                <path d="M18 49c10-2 18-10 24-19 8 12 17 18 30 20-9 5-19 8-30 8-10 0-17-2-24-9Z" fill="#0F4C81" />
                <path d="M48 55c11 0 20 5 25 14" stroke="#4A9074" strokeWidth="4" strokeLinecap="round" />
                <path d="M68 68c3-1 6-2 8-5" stroke="#7EAA61" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight text-slate-900">SpiritualSolace</p>
              <p className="text-xs tracking-[0.16em] text-slate-500">CONSENT-FIRST SUPPORT</p>
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

          <div className="relative rounded-3xl border border-white/75 bg-white/55 p-4 shadow-[0_20px_60px_rgba(22,53,93,0.16)] backdrop-blur-sm md:p-5">
            <div className="absolute -inset-x-2 -top-3 h-28 rounded-[2rem] bg-gradient-to-r from-cyan-200/45 via-sky-200/50 to-indigo-200/45 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.35rem] border border-sky-100/75 bg-[linear-gradient(180deg,#dff1ff_0%,#edf6ff_37%,#f8f5ff_68%,#fdfcf8_100%)] p-5">
              <svg viewBox="0 0 520 340" className="h-full w-full" role="img" aria-label="Dove and olive branch motif over a calm horizon">
                <defs>
                  <linearGradient id="wing" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0A3E75" />
                    <stop offset="100%" stopColor="#1D659A" />
                  </linearGradient>
                </defs>
                <ellipse cx="262" cy="282" rx="220" ry="34" fill="#dbeafe" opacity="0.9" />
                <path d="M0 286Q102 220 196 255T390 250T520 266V340H0Z" fill="#bfd9ef" />
                <path d="M0 304Q120 252 258 286T520 294V340H0Z" fill="#9fc0dc" opacity="0.72" />
                <path d="M176 154c42-9 76-39 103-78 30 44 67 68 118 73-31 18-70 29-118 29-42 0-75-7-103-24Z" fill="url(#wing)" />
                <path d="M306 195c31 0 56 15 70 39" stroke="#4A9074" strokeWidth="8" strokeLinecap="round" />
                <path d="M378 236c7-4 13-9 18-17M351 224c6-3 11-7 16-13M327 214c5-3 9-6 13-11" stroke="#7EAA61" strokeWidth="5" strokeLinecap="round" />
              </svg>
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
      </main>
    </div>
  );
}
