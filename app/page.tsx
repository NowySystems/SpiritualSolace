import Image from "next/image";
import Link from "next/link";

const guardrailItems = [
  "Demo only",
  "No real patient data",
  "No live messaging",
  "Facility-controlled",
  "One-way temporary support",
  "Human review where required"
];

const valueCards = [
  {
    title: "Consent First",
    body: "Support begins only when a request is intentionally submitted with clear consent boundaries and temporary delivery windows."
  },
  {
    title: "Human Review",
    body: "Facilities can require review before delivery so every message follows policy and respectful care expectations."
  },
  {
    title: "Approved Responders",
    body: "Only approved responders can participate, reducing risk while keeping support pathways compassionate and accountable."
  },
  {
    title: "Temporary by Design",
    body: "Messages are one-way and time-limited, offering comfort without creating ongoing conversation pressure."
  },
  {
    title: "Facility Controlled",
    body: "Each site defines who can respond, when review is required, and which workflow rules govern message delivery."
  },
  {
    title: "Safe & Respectful",
    body: "The experience is built to protect dignity, reduce confusion, and keep spiritual support aligned with facility safeguards."
  }
];

const lifecycle = [
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
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_10%_5%,#f0ece2_0%,transparent_34%),radial-gradient(circle_at_88%_14%,#dddff2_0%,transparent_30%),linear-gradient(180deg,#fbf8f2_0%,#f7f6f3_44%,#eef2f4_100%)] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-[#fbf8f2]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b8c2c9] bg-white/80 text-[10px] font-semibold tracking-[0.18em] text-slate-600">SS</span>
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
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/90 bg-white/55 p-6 shadow-[0_24px_70px_rgba(49,58,79,0.14)] backdrop-blur-sm md:p-8 lg:p-10">
          <Image
            src="/brand/spiritualsolace-hero-dove.png"
            alt="SpiritualSolace hero dove"
            fill
            priority
            className="-z-20 object-cover object-[74%_center] md:object-[76%_center]"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(102deg,rgba(251,248,242,0.98)_0%,rgba(248,245,240,0.9)_42%,rgba(66,75,99,0.42)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.58),transparent_44%),radial-gradient(circle_at_74%_8%,rgba(163,184,169,0.24),transparent_28%)]" aria-hidden="true" />

          <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] xl:gap-12">
            <div>
              <div className="inline-flex items-center rounded-full border border-[#d8d2c6] bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                Consent-first spiritual support preview
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl xl:text-6xl">
                Care that respects dignity. Support that honors boundaries.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-slate-700 md:text-lg">
                A consent-first platform for one-way spiritual support messages—designed for patients, families, and the facilities that serve them.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/app" className="inline-flex items-center justify-center rounded-xl bg-[#516476] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(63,76,93,0.3)] transition hover:bg-[#465769]">
                  View Demo
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
                  See How It Works
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/72 p-4 shadow-[0_12px_40px_rgba(33,42,63,0.24)] backdrop-blur-sm md:p-5">
              <div className="relative space-y-4">
                <div className="rounded-2xl border border-[#e4e0d8] bg-white/94 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Support Request Lifecycle</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Requested", "Policy Review", "Approved Responder", "Delivered"].map((status) => (
                      <span key={status} className="rounded-full border border-[#d7dde4] bg-[#f4f7fa] px-2.5 py-1 text-[11px] font-medium text-slate-700">
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e4e0d8] bg-white/94 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">One-Way Message Preview</p>
                  <p className="mt-2 rounded-xl bg-[#f7f5f1] px-3 py-2 text-sm text-slate-700">
                    “Wishing you peace today. We are holding your family in gentle prayer.”
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span className="rounded-full border border-[#d6e0d4] bg-[#eef4ec] px-2.5 py-1 font-medium text-[#5d7362]">Approved Responder</span>
                    <span className="rounded-full border border-[#ddd6ea] bg-[#f4f0fb] px-2.5 py-1 font-medium text-[#675f7d]">Review Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {valueCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-white/85 bg-white/78 p-5 shadow-[0_14px_34px_rgba(45,53,72,0.09)] backdrop-blur-sm">
              <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section id="how-it-works" className="rounded-3xl border border-slate-200/80 bg-white/82 p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How it works</h2>
            <ol className="mt-6 grid gap-3 md:grid-cols-2">
              {lifecycle.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f7f5f1] p-4 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="facilities" className="rounded-3xl border border-slate-200/80 bg-white/82 p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">For facilities</h2>
            <p className="mt-3 text-slate-600">Operational seriousness without open community exposure.</p>
            <ul className="mt-6 grid gap-3 text-sm text-slate-700">
              {facilityPoints.map((point) => (
                <li key={point} className="rounded-xl border border-slate-200 bg-[#f7f5f1] px-4 py-3 font-medium">
                  {point}
                </li>
              ))}
            </ul>
          </section>
        </section>

        <section id="guardrails" className="rounded-2xl border border-[#d6ddd6] bg-white/75 p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap gap-2.5">
            {guardrailItems.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
                {item}
              </span>
            ))}
          </div>
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
        <p className="pb-2 text-center text-xs tracking-wide text-slate-500">SpiritualSolace · Private Preview · Built by Nowy Systems</p>
      </main>
    </div>
  );
}
