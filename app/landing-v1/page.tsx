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

export default function LandingV1Page() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f9f6f1_0%,#f4f3ef_45%,#edf1f3_100%)] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-[#fbf8f2]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b8c2c9] bg-white/80 text-sm font-semibold text-slate-600">✦</span>
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

      <main>
        <section className="relative isolate min-h-[74vh] overflow-hidden">
          <Image
            src="/brand/spiritualsolace-hero-dove.png"
            alt="SpiritualSolace hero dove"
            fill
            priority
            className="-z-30 object-cover object-[74%_center] md:object-[78%_center]"
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(103deg,rgba(250,246,238,0.98)_0%,rgba(248,244,236,0.92)_38%,rgba(76,86,107,0.42)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.52),transparent_44%),radial-gradient(circle_at_80%_12%,rgba(174,188,174,0.2),transparent_30%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#f6f4ee]" aria-hidden="true" />

          <div className="mx-auto flex min-h-[74vh] w-full max-w-7xl items-center px-5 py-14 md:px-6 md:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-[#d8d2c6] bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                Consent-first spiritual support preview
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl xl:text-6xl">
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
          </div>
        </section>

        <div className="relative z-10 mx-auto -mt-14 w-full max-w-7xl px-5 md:px-6">
          <section className="grid gap-4 rounded-3xl border border-white/85 bg-white/78 p-5 shadow-[0_18px_44px_rgba(45,53,72,0.11)] backdrop-blur-sm md:grid-cols-2 xl:grid-cols-3">
            {valueCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/85 bg-white/88 p-5 shadow-[0_10px_24px_rgba(45,53,72,0.06)]">
                <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{card.body}</p>
              </article>
            ))}
          </section>
        </div>

        <div className="mx-auto w-full max-w-7xl space-y-10 px-5 pb-16 pt-10 md:space-y-12 md:px-6 md:pt-12 lg:space-y-14">
          <section className="rounded-3xl border border-[#e6e1d8] bg-white/82 p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Support that brings peace, not pressure.</h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-600">
              SpiritualSolace helps facilities offer compassionate spiritual support with clear boundaries, thoughtful review, and one-way temporary delivery designed to preserve dignity.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white/82 p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Demo workflow preview</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
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
          </section>

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
            <ul className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              {facilityPoints.map((point) => (
                <li key={point} className="rounded-xl border border-slate-200 bg-[#f7f5f1] px-4 py-3 font-medium">
                  {point}
                </li>
              ))}
            </ul>
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

          <p className="pb-2 text-center text-xs tracking-wide text-slate-500">SpiritualSolace · Private Preview · Built by Nowy Systems</p>
        </div>
      </main>
    </div>
  );
}
