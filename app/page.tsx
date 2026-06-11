import Image from "next/image";
import Link from "next/link";

const comfortTimeline = [
  {
    time: "8:42 AM",
    title: "A request for comfort is submitted",
    body: "A patient or family member asks for prayer, encouragement, affirmation, guidance, or calming words."
  },
  {
    time: "8:45 AM",
    title: "Facility rules are applied",
    body: "Consent, preference, language, request type, and delivery boundaries are checked before routing."
  },
  {
    time: "8:48 AM",
    title: "A trusted responder is selected",
    body: "The request is matched to an approved responder group based on tradition, tone, and coverage."
  },
  {
    time: "8:58 AM",
    title: "The message is reviewed",
    body: "Staff can confirm the message is appropriate, one-way, and aligned with facility rules."
  },
  {
    time: "9:02 AM",
    title: "Comfort is delivered quietly",
    body: "The recipient sees one reviewed message without being pulled into chat or follow-up obligations."
  }
];

const helpMoments = [
  {
    title: "Before a procedure",
    body: "A short prayer or calming message can help someone feel less alone."
  },
  {
    title: "During recovery",
    body: "Encouraging words can be delivered without creating pressure to respond."
  },
  {
    title: "For families waiting",
    body: "Loved ones can request soothing words during uncertain moments."
  },
  {
    title: "During difficult stays",
    body: "Facilities can offer support while respecting preferences and review policies."
  }
];

const facilityControls = [
  "Approved responder directory",
  "Human review before delivery",
  "One-way temporary messages",
  "No public request browsing",
  "No open direct messaging",
  "Audit-style event visibility",
  "Facility-defined rules",
  "Clear demo and safety boundaries"
];

const trustStats = [
  ["1-way", "Delivery model"],
  ["0", "Public request feeds"],
  ["100%", "Review-visible workflow"]
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f4efe4] text-[#1f3442]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#102b3a]/95 text-white shadow-[0_10px_30px_rgba(10,31,44,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-5 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c28d]/45 bg-[#f6efe2]/10 text-lg text-[#f4d99e]">✦</span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">SpiritualSolace</span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-[#b9c8c9]">Comfort with boundaries</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#d7e4e4] lg:flex">
            <a className="transition hover:text-white" href="#how-it-works">How it works</a>
            <a className="transition hover:text-white" href="#moments">Where it helps</a>
            <a className="transition hover:text-white" href="#facilities">For facilities</a>
            <a className="transition hover:text-white" href="/landing-v1">V1</a>
          </nav>

          <Link href="/app" className="rounded-full bg-[#f1c871] px-5 py-2.5 text-sm font-semibold text-[#102b3a] shadow-[0_12px_24px_rgba(241,200,113,0.25)] transition hover:bg-[#ffd98a]">
            View demo
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-[#102b3a] text-white">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_10%,rgba(112,154,153,0.38),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(241,200,113,0.2),transparent_28%),linear-gradient(135deg,#102b3a_0%,#16394a_48%,#244f5a_100%)]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#f4efe4]" />

          <div className="mx-auto grid min-h-[760px] w-full max-w-7xl items-center gap-12 px-5 py-16 md:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8e8e6] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#f1c871]" />
                Reviewed support for care settings
              </div>

              <h1 className="mt-7 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-6xl xl:text-7xl">
                When someone needs comfort, a few caring words can matter.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d5e4e4] md:text-xl">
                SpiritualSolace helps care facilities deliver reviewed prayers, encouragement, affirmations, and calming messages from trusted community responders.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/app" className="inline-flex items-center justify-center rounded-full bg-[#f1c871] px-7 py-3.5 text-sm font-bold text-[#102b3a] shadow-[0_18px_36px_rgba(241,200,113,0.28)] transition hover:bg-[#ffd98a]">
                  Explore the demo
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
                  See the flow
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {trustStats.map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                    <p className="text-2xl font-semibold text-[#f4d99e]">{value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#b9c8c9]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute -left-8 top-12 h-48 w-48 rounded-full bg-[#f1c871]/20 blur-3xl" />
              <div className="absolute -right-8 bottom-8 h-56 w-56 rounded-full bg-[#86aaa2]/24 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/14 bg-white/10 p-3 shadow-[0_28px_80px_rgba(2,12,20,0.34)] backdrop-blur-md">
                <div className="relative min-h-[520px] overflow-hidden rounded-[1.7rem] bg-[#e8ded0]">
                  <Image
                    src="/brand/spiritualsolace-hero-dove.png"
                    alt="Soft SpiritualSolace comfort imagery"
                    fill
                    priority
                    className="object-cover object-[68%_center] opacity-80 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,43,58,0.05)_0%,rgba(16,43,58,0.34)_100%),radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_36%)]" />

                  <div className="absolute bottom-5 left-5 right-5 rounded-[1.45rem] border border-white/55 bg-[#fbf7ee]/92 p-5 text-[#1f3442] shadow-[0_18px_44px_rgba(31,52,66,0.18)] backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#60766f]">Reviewed message</p>
                    <p className="mt-3 text-lg font-medium leading-7">
                      “May you feel courage, calm, and the presence of care around you today.”
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#52665f]">
                      <span className="rounded-full border border-[#cddccf] bg-[#eef8ee] px-3 py-1">Approved responder</span>
                      <span className="rounded-full border border-[#ddd2ea] bg-[#f5f0fb] px-3 py-1">Staff reviewed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#f4efe4] px-5 py-20 md:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a817a]">Comfort delivery timeline</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#102b3a] md:text-5xl">
                  A sensitive request moves carefully, not loudly.
                </h2>
                <p className="mt-5 text-base leading-7 text-[#536963]">
                  The experience is intentionally simple: request, rules, responder, review, delivery. No public feed. No open chat. No pressure to reply.
                </p>
              </div>

              <div className="space-y-4">
                {comfortTimeline.map((item, index) => (
                  <article key={item.title} className="group grid gap-4 rounded-[1.6rem] border border-[#ded5c5] bg-[#fbf7ee] p-5 shadow-[0_12px_34px_rgba(31,52,66,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(31,52,66,0.1)] md:grid-cols-[110px_1fr]">
                    <div>
                      <p className="text-sm font-bold text-[#bd8f2f]">{item.time}</p>
                      <p className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#102b3a] text-sm font-bold text-white">{index + 1}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#153343]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#5c6f69]">{item.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf0] px-5 py-20 md:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="rounded-[2rem] border border-[#dfd6c7] bg-[#102b3a] p-7 text-white shadow-[0_24px_70px_rgba(16,43,58,0.2)] md:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c871]">A message for you</p>
              <p className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
                “We are holding you in prayer today. May you feel courage, calm, and the presence of care around you.”
              </p>
              <div className="mt-7 border-t border-white/15 pt-5 text-sm leading-6 text-[#c9dbda]">
                First Community Prayer Team · reviewed by facility staff · one-way temporary delivery
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a817a]">Why the product exists</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#102b3a] md:text-5xl">
                Comfort without confusion, exposure, or obligation.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#536963]">
                SpiritualSolace is not a public message wall, chatroom, or social feed. It is a calm delivery path for reviewed words of support when patients or families ask for solace.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {["No open conversation", "No public browsing", "No care instructions", "No pressure to respond"].map((item) => (
                  <div key={item} className="rounded-2xl border border-[#dfd6c7] bg-[#f7efe2] px-4 py-3 text-sm font-semibold text-[#263f4b]">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="moments" className="bg-[#edf4ef] px-5 py-20 md:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a817a]">Where SpiritualSolace helps</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#102b3a] md:text-5xl">
                Built around human moments, not software modules.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {helpMoments.map((moment) => (
                <article key={moment.title} className="rounded-[1.7rem] border border-[#d3dfd7] bg-white/78 p-6 shadow-[0_14px_34px_rgba(31,52,66,0.07)]">
                  <div className="mb-7 h-12 w-12 rounded-2xl bg-[#102b3a] text-center text-2xl leading-[3rem] text-[#f1c871]">✦</div>
                  <h3 className="text-xl font-semibold text-[#153343]">{moment.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5c6f69]">{moment.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="facilities" className="bg-[#102b3a] px-5 py-20 text-white md:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c871]">Built for care facilities</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
                Compassionate support needs operational control.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#c9dbda]">
                Facilities define who can respond, which messages need review, what content is blocked, and how the support trail is audited.
              </p>
              <Link href="/app" className="mt-8 inline-flex rounded-full bg-[#f1c871] px-6 py-3 text-sm font-bold text-[#102b3a] transition hover:bg-[#ffd98a]">
                Open operations demo
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {facilityControls.map((control) => (
                <div key={control} className="rounded-2xl border border-white/12 bg-white/8 p-4 text-sm font-semibold text-[#dbe9e8] shadow-[0_10px_24px_rgba(2,12,20,0.12)] backdrop-blur">
                  ✓ {control}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4efe4] px-5 py-16 md:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#dfd6c7] bg-[#fffaf0] p-7 shadow-[0_18px_44px_rgba(31,52,66,0.08)] md:p-9">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a817a]">Private preview</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#102b3a]">See the full SpiritualSolace workflow.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5c6f69]">
                  Explore the operations board, request queue, responder routing, message review, patient view, audit log, and facility rules.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/app" className="inline-flex justify-center rounded-full bg-[#102b3a] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#183d50]">
                  View demo
                </Link>
                <Link href="/landing-v1" className="inline-flex justify-center rounded-full border border-[#d6c9b5] bg-white px-6 py-3 text-sm font-bold text-[#263f4b] transition hover:bg-[#f8f2e8]">
                  View V1 archive
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dfd6c7] bg-[#f4efe4] px-5 py-8 text-center text-xs font-medium tracking-[0.12em] text-[#667871] md:px-6">
        SpiritualSolace · Demo prototype · No real patient data · Built by NowySystems
      </footer>
    </div>
  );
}
