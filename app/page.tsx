import Image from "next/image";
import Link from "next/link";

const journey = [
  ["Request", "A patient or family asks for prayer, affirmation, guidance, encouragement, or calming words."],
  ["Review", "Preferences and facility rules shape the request before any responder sees it."],
  ["Match", "An approved local responder is selected for tradition, tone, language, and coverage."],
  ["Approve", "The comfort message is checked before it appears to the recipient."],
  ["Deliver", "One reviewed message arrives quietly, with no pressure to reply."]
];

const moments = [
  ["Before a procedure", "A short message can steady someone before a difficult moment.", "lg:col-span-7 lg:min-h-[340px]"],
  ["Families waiting", "Gentle words when time feels slow and uncertain.", "lg:col-span-5 lg:min-h-[270px]"],
  ["During recovery", "Encouragement without an open conversation to manage.", "lg:col-span-5 lg:min-h-[270px]"],
  ["Difficult stays", "A calm way to honor preference, dignity, and boundaries.", "lg:col-span-7 lg:min-h-[340px]"]
];

const controls = ["Reviewed", "One-way", "Approved responders", "Facility controlled", "No public feed", "No open chat"];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5efe2] text-[#102b3a]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#102b3a]/80 text-white backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#f1c871]/40 bg-white/10 text-[#f1c871]">✦</span>
            <span>
              <span className="block text-lg font-semibold leading-none">SpiritualSolace</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-[#b8cac9]">Comfort with boundaries</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-[#d8e7e6] lg:flex">
            <a href="#journey" className="hover:text-white">Journey</a>
            <a href="#message" className="hover:text-white">Message</a>
            <a href="#moments" className="hover:text-white">Moments</a>
            <a href="#trust" className="hover:text-white">Trust</a>
          </nav>
          <Link href="/app" className="rounded-full bg-[#f1c871] px-5 py-2.5 text-sm font-bold text-[#102b3a] shadow-[0_14px_34px_rgba(241,200,113,0.25)] hover:bg-[#ffdc90]">
            View demo
          </Link>
        </div>
      </header>

      <main>
        <section className="relative min-h-screen overflow-hidden bg-[#102b3a] pt-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(126,169,160,0.38),transparent_28%),radial-gradient(circle_at_76%_16%,rgba(241,200,113,0.22),transparent_26%),linear-gradient(140deg,#102b3a,#153747_52%,#244f58)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-[#f5efe2]" />

          <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-5 pb-28 pt-10 md:px-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="z-10 max-w-3xl">
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d8e7e6] backdrop-blur">
                Reviewed support for care settings
              </p>
              <h1 className="mt-7 text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl xl:text-8xl">
                A few caring words can matter.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d4e3e1] md:text-xl">
                SpiritualSolace helps care facilities deliver reviewed prayers, encouragement, affirmations, and calming words from trusted community responders.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/app" className="rounded-full bg-[#f1c871] px-7 py-3.5 text-sm font-bold text-[#102b3a] shadow-[0_20px_48px_rgba(241,200,113,0.25)] hover:bg-[#ffdc90]">
                  Explore the demo
                </Link>
                <a href="#journey" className="rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15">
                  Follow the request
                </a>
              </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[620px] lg:translate-y-10">
              <div className="absolute -left-12 top-16 h-56 w-56 rounded-full bg-[#f1c871]/20 blur-3xl" />
              <div className="absolute -right-10 bottom-8 h-72 w-72 rounded-full bg-[#8fb5aa]/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-[3rem] border border-white/15 bg-white/10 p-3 shadow-[0_34px_90px_rgba(0,12,22,0.36)] backdrop-blur-md">
                <div className="relative min-h-[620px] overflow-hidden rounded-[2.45rem] bg-[#eadfce]">
                  <Image src="/brand/spiritualsolace-hero-dove.png" alt="Soft SpiritualSolace comfort image" fill priority className="object-cover object-[70%_center] opacity-85 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,43,58,0.02),rgba(16,43,58,0.46)),radial-gradient(circle_at_24%_16%,rgba(255,255,255,0.56),transparent_35%)]" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] border border-white/60 bg-[#fffaf0]/92 p-6 text-[#102b3a] shadow-[0_24px_60px_rgba(16,43,58,0.22)] backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6a817a]">A message for you</p>
                    <p className="mt-4 text-2xl font-semibold leading-9 tracking-[-0.02em]">“May you feel courage, calm, and the presence of care around you today.”</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="relative -mt-20 px-5 md:px-8">
          <div className="mx-auto max-w-6xl rounded-[3rem] border border-[#ded5c5] bg-[#fffaf0] p-7 shadow-[0_30px_90px_rgba(31,52,66,0.14)] md:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a817a]">The request journey</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#102b3a] md:text-5xl">A sensitive request should move carefully.</h2>
                <p className="mt-5 text-base leading-7 text-[#586c66]">This is not a public wall or open chat. It is a guided path from request to reviewed comfort.</p>
              </div>

              <ol className="relative space-y-0 pl-7 before:absolute before:left-[13px] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[#c9b98e]">
                {journey.map(([title, body], index) => (
                  <li key={title} className="relative pb-9 last:pb-0">
                    <span className="absolute -left-7 top-1 grid h-7 w-7 place-items-center rounded-full bg-[#102b3a] text-xs font-bold text-[#f1c871] ring-8 ring-[#fffaf0]">{index + 1}</span>
                    <div className="pl-3">
                      <h3 className="text-xl font-semibold text-[#163747]">{title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c6f69]">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="message" className="relative overflow-hidden px-5 py-24 md:px-8 lg:py-32">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[#f5efe2]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#eaf3ef]" />
          <div className="relative mx-auto max-w-5xl rounded-[3.2rem] bg-[#102b3a] px-7 py-16 text-center text-white shadow-[0_34px_90px_rgba(16,43,58,0.25)] md:px-14 md:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f1c871]">The emotional center</p>
            <p className="mx-auto mt-8 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">
              “We are holding you in prayer today. May you feel courage, calm, and the presence of care around you.”
            </p>
            <p className="mt-8 text-sm leading-6 text-[#c8ddda]">Reviewed by staff · sent from an approved responder · one-way temporary delivery</p>
          </div>
        </section>

        <section id="moments" className="bg-[#eaf3ef] px-5 pb-24 md:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a817a]">Human moments</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#102b3a] md:text-5xl">Designed around people, not modules.</h2>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-12">
              {moments.map(([title, body, span]) => (
                <article key={title} className={`${span} flex flex-col justify-end overflow-hidden rounded-[2.4rem] border border-white/65 bg-[#fffaf0] p-7 shadow-[0_18px_50px_rgba(31,52,66,0.09)]`}>
                  <div className="mb-10 h-14 w-14 rounded-2xl bg-[#102b3a] text-center text-3xl leading-[3.5rem] text-[#f1c871]">✦</div>
                  <h3 className="text-3xl font-semibold tracking-[-0.035em] text-[#153747]">{title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c6f69]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="bg-[#102b3a] px-5 py-24 text-white md:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c871]">Facility trust</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">Comfort still needs controls.</h2>
              <p className="mt-5 text-base leading-7 text-[#c8ddda]">Facilities define the responder list, review rules, delivery boundaries, and audit trail.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {controls.map((control) => (
                <div key={control} className="rounded-full border border-white/12 bg-white/8 px-5 py-4 text-sm font-semibold text-[#dbe9e8] backdrop-blur">✓ {control}</div>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 rounded-[2.2rem] border border-white/10 bg-white/8 p-6 backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">See the full workflow.</h3>
              <p className="mt-2 text-sm text-[#c8ddda]">Operations board, request queue, responder routing, message review, patient view, audit log, and rules.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/app" className="rounded-full bg-[#f1c871] px-6 py-3 text-sm font-bold text-[#102b3a] hover:bg-[#ffdc90]">View demo</Link>
              <Link href="/landing-v1" className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/15">V1 archive</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
