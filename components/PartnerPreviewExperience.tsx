const assignmentDetails = [
  {
    label: "Approved need",
    value: "Prayer and a friendly visit",
    status: "Released by facility"
  },
  {
    label: "Facility boundary",
    value: "Coordinate timing through Grandview-approved contact path.",
    status: "Required"
  },
  {
    label: "Private details",
    value: "No diagnosis, treatment details, chart notes, or requester-only wording included.",
    status: "Hidden"
  }
];

const partnerSteps = [
  "Review the approved spiritual-care context only.",
  "Confirm whether a visit, prayer call, or encouragement note is appropriate.",
  "Coordinate timing through the approved facility path.",
  "Report back with a structured non-medical outcome."
];

const safeOutcomes = [
  "Contacted",
  "Visit planned",
  "Visited",
  "Unable to reach",
  "Follow-up requested"
];

const reportGuidelines = [
  {
    label: "Good update",
    body: "Visited today. Prayer offered. Family requested a follow-up next week.",
    tone: "green"
  },
  {
    label: "Needs edit",
    body: "Long personal story, private family detail, or unclear consent wording.",
    tone: "gold"
  },
  {
    label: "Do not include",
    body: "Diagnosis, treatment, emergency concern, counseling notes, or medical-record style detail.",
    tone: "red"
  }
];

function ToneCard({ label, body, tone }: { label: string; body: string; tone: string }) {
  const classes =
    tone === "green"
      ? "border-[#cfe4d5] bg-[#f1f8f3] text-[#173b2d]"
      : tone === "gold"
        ? "border-[#eed9a8] bg-[#fffaf0] text-[#5f4b1f]"
        : "border-[#e1d5cb] bg-[#fbf7f2] text-[#5f3528]";

  return (
    <article className={`rounded-2xl border p-5 ${classes}`}>
      <p className="text-xs font-black uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-7">{body}</p>
    </article>
  );
}

function MiniPill({ children }: { children: string }) {
  return <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">{children}</span>;
}

export function PartnerPreviewExperience() {
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
              <span className="block text-xs font-semibold text-[#d9e7df]">Partner Preview · No auth · No database</span>
            </span>
          </a>

          <div className="flex flex-wrap gap-2">
            <a href="/preview/requester" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Requester</a>
            <a href="/preview/facility" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Facility</a>
            <a href="/preview/partner" className="rounded-full bg-[#d6a943] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Partner</a>
            <a href="/preview/pilot" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Pilot</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-[118rem] px-5 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-5 text-sm font-semibold leading-7 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          Safe preview route. No login, no Supabase, no real writes, no medical data, no emergency workflow. This page shows how an approved partner receives scoped context and reports back safely.
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="grid gap-0 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="bg-[#789052] px-6 py-10 text-white md:px-10 md:py-14">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">Partner preview</p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                Hope Church sees approved context only.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/90">
                This view should make the partner role feel useful but tightly scoped: accept an approved assignment, prepare for spiritual support, and report back without turning ChurchWork into chat, counseling, or a medical record.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#assignment" className="rounded-xl bg-white px-5 py-3 text-center text-sm font-black text-[#082838] shadow-lg">Open assignment</a>
                <a href="#report-back" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-center text-sm font-black text-white">Preview report back</a>
              </div>
            </section>

            <aside className="bg-[#f8fbf8] p-5 md:p-7">
              <div className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Partner job</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Respond with care, not extra data.</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">
                  Hope Church should know exactly what was approved, what to do next, and what not to write back. The partner should never see unrestricted requester notes or facility-only context.
                </p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-[#4f6259]">
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">Approved spiritual-care context only.</div>
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">Structured outcome, not open chat.</div>
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">Facility controls what requester sees.</div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div id="assignment" className="mt-7 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Approved assignment</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">What the partner receives.</h2>
              </div>
              <MiniPill>Facility released</MiniPill>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {assignmentDetails.map((item) => (
                <article key={item.label} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{item.label}</p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[#0d2b3b]">{item.value}</p>
                  <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">{item.status}</span>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#173b2d]">Approved partner note</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#173b2d]">
                Resident/family requested prayer and a friendly visit. Please coordinate timing through Grandview-approved contact path. No medical details are included.
              </p>
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Preparation path</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">What to do next.</h2>
            <ol className="mt-5 space-y-3 text-sm font-semibold leading-6 text-[#4f6259]">
              {partnerSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d6a943] text-xs font-black text-[#082838]">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <section id="report-back" className="mt-7 rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Report back</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Structured outcome, not a free-form story.</h2>
            </div>
            <MiniPill>No submit</MiniPill>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Outcome choices</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {safeOutcomes.map((outcome) => (
                  <span key={outcome} className="rounded-full border border-[#9ec8ad] bg-white px-4 py-2 text-sm font-black text-[#0f6b54]">{outcome}</span>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-[#d9dfd7] bg-white p-4 text-sm font-semibold leading-7 text-[#4f6259]">
                Sample safe note: “Visited today. Prayer offered. Follow-up welcome next week.”
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {reportGuidelines.map((rule) => (
                <ToneCard key={rule.label} {...rule} />
              ))}
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">What Hope Church should understand</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">The partner helps. The facility governs.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#4f6259]">
              This preview should make partner participation feel simple and safe. Hope Church gets enough approved context to help, but not enough to create privacy risk, clinical confusion, or an uncontrolled communication channel.
            </p>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Next review</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">
              After this partner pass, the pilot preview should show the whole controlled path as one story before we return to real auth.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a href="/preview/pilot" className="rounded-xl bg-[#082838] px-5 py-3 text-center text-sm font-black text-white shadow-lg hover:bg-[#0f3f35]">Open pilot preview</a>
              <a href="/preview" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Back to previews</a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
