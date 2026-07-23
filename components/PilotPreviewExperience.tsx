const pilotPeople = [
  {
    role: "Requester",
    name: "Family or requester",
    body: "Starts a guided spiritual-care request with limited non-medical context.",
    status: "Open preview"
  },
  {
    role: "Facility",
    name: "Grandview review",
    body: "Reviews the request, confirms safe wording, and approves what may be shared.",
    status: "Human approval"
  },
  {
    role: "Partner",
    name: "Hope Church",
    body: "Receives approved context only and reports back using structured safe outcomes.",
    status: "Scoped access"
  },
  {
    role: "Operator",
    name: "Cole / Sam",
    body: "Uses the admin hub for pilot inspection, diagnostics, and controlled role review.",
    status: "Admin hub"
  }
];

const acknowledgments = [
  "ChurchWork is for spiritual-care coordination only.",
  "This is not an emergency service or replacement for facility staff.",
  "Do not enter diagnosis, treatment, medical record, or emergency details.",
  "Partners only see facility-approved context.",
  "Requester updates are approved and limited."
];

const pilotFlow = [
  {
    step: "01",
    title: "Requester submits safe request",
    body: "Guided choices and a limited note describe the spiritual-care need without turning the page into open chat."
  },
  {
    step: "02",
    title: "Facility reviews and controls release",
    body: "Grandview decides what is safe, what is held back, and whether the request should go to Hope Church."
  },
  {
    step: "03",
    title: "Partner receives approved assignment",
    body: "Hope Church sees only the approved spiritual-care context and basic coordination guidance."
  },
  {
    step: "04",
    title: "Safe report-back closes the loop",
    body: "Partner reports contacted, visited, unable to reach, follow-up requested, or a short approved note."
  }
];

const blockedBehindAuth = [
  "Real requester submissions",
  "Facility approval writes",
  "Partner assignment writes",
  "Policy acceptance records",
  "User/session-specific pilot access"
];

const inspectionTargets = [
  { label: "NSB rule", value: "Safe preview and AI-readable routes flow through NSB first." },
  { label: "BI map", value: "/ai-map exposes routes, roles, known issues, and safety flags." },
  { label: "Preview routes", value: "/preview/requester, /facility, /partner, /pilot give BI visual review surfaces." },
  { label: "Diagnostics", value: "/pilot-auth-check and /pwa-check stay separate from product workflow." }
];

function Pill({ children }: { children: string }) {
  return <span className="rounded-full bg-[#fff8e7] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#7a5b20]">{children}</span>;
}

export function PilotPreviewExperience() {
  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <nav className="border-b border-white/10 bg-[#082838] px-5 py-4 text-white shadow-xl shadow-[#0d2b3b]/15 md:px-8">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href="/preview" className="flex items-center gap-4">
            <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.03em]">Church<span className="text-[#8dbd9e]">Work</span></span>
              <span className="block text-xs font-semibold text-[#d9e7df]">Pilot Preview · No auth · No database</span>
            </span>
          </a>

          <div className="flex flex-wrap gap-2">
            <a href="/preview/requester" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Requester</a>
            <a href="/preview/facility" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Facility</a>
            <a href="/preview/partner" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Partner</a>
            <a href="/preview/pilot" className="rounded-full bg-[#d6a943] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Pilot</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-[118rem] px-5 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-5 text-sm font-semibold leading-7 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          Safe pilot preview. No login, no Supabase, no real writes, no medical data, no emergency workflow. This page explains the controlled pilot before touching real auth.
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
            <section className="bg-[#5f4b1f] px-6 py-10 text-white md:px-10 md:py-14">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">Pilot preview</p>
              <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                One controlled workflow before real pilot auth.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/82">
                This page shows the whole ChurchWork pilot chain without depending on Supabase: requester intake, facility approval, partner assignment, and safe report-back.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#pilot-flow" className="rounded-xl bg-white px-5 py-3 text-center text-sm font-black text-[#082838] shadow-lg">Review pilot flow</a>
                <a href="/pilot-auth-check" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-center text-sm font-black text-white">Open auth check</a>
              </div>
            </section>

            <aside className="bg-[#f8fbf8] p-5 md:p-7">
              <div className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Pilot boundary</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Preview first. Auth second.</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">
                  The product can now be reviewed end-to-end even while real Supabase pilot access is being tested separately. That keeps the demo stable and the auth work contained.
                </p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-[#4f6259]">
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">Safe preview routes are public and static.</div>
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">Real writes stay behind /pilot.</div>
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">BI reads /ai-map before visual review.</div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <section className="mt-7 rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Pilot actors</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Who participates in the controlled pilot?</h2>
            </div>
            <Pill>Static mock</Pill>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pilotPeople.map((person) => (
              <article key={person.role} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{person.role}</p>
                <h3 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{person.name}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#4f6259]">{person.body}</p>
                <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">{person.status}</span>
              </article>
            ))}
          </div>
        </section>

        <div id="pilot-flow" className="mt-7 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">End-to-end pilot flow</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">The whole chain should be understandable in one read.</h2>
            <div className="mt-6 space-y-4">
              {pilotFlow.map((item) => (
                <article key={item.step} className="grid gap-4 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5 md:grid-cols-[4rem_1fr]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d6a943] text-sm font-black text-[#082838]">{item.step}</span>
                  <span>
                    <span className="block font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{item.title}</span>
                    <span className="mt-2 block text-sm font-semibold leading-7 text-[#4f6259]">{item.body}</span>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.5rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-6 shadow-sm shadow-[#0d2b3b]/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a6b16]">Pilot Safe v1 acknowledgment</p>
              <ul className="mt-5 space-y-3 text-sm font-semibold leading-6 text-[#5f4b1f]">
                {acknowledgments.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-[#eed9a8] bg-white/55 p-4">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d6a943]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Still behind auth</p>
              <ul className="mt-5 space-y-3 text-sm font-semibold leading-6 text-[#4f6259]">
                {blockedBehindAuth.map((item) => (
                  <li key={item} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">{item}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <section className="mt-7 rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">BI / NSB inspection contract</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">What the synthetic user should inspect later.</h2>
            </div>
            <Pill>NSB governed</Pill>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {inspectionTargets.map((target) => (
              <article key={target.label} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{target.label}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">{target.value}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Pilot readout</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">What this proves before real data.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#4f6259]">
              ChurchWork now has a complete safe preview chain. The workflow can be reviewed, criticized, and improved without depending on auth, Supabase, or real pilot data. Once the visual workflow feels right, /pilot can become the real gated version of the same chain.
            </p>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Next actions</p>
            <div className="mt-5 flex flex-col gap-3">
              <a href="/preview" className="rounded-xl bg-[#082838] px-5 py-3 text-center text-sm font-black text-white shadow-lg hover:bg-[#0f3f35]">Back to previews</a>
              <a href="/ai-map" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Open AI map</a>
              <a href="/pilot-auth-check" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Open auth diagnostics</a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
