const reviewItems = [
  {
    label: "Requester note",
    value: "Family asked for prayer and a calm visit this week.",
    status: "Allowed for review"
  },
  {
    label: "Preferred support",
    value: "Prayer or friendly visit",
    status: "Spiritual-care only"
  },
  {
    label: "Facility action needed",
    value: "Confirm what can be released to Hope Church.",
    status: "Human review"
  }
];

const shareRules = [
  {
    label: "May share",
    body: "Approved spiritual-care need, preferred support, and safe contact/visit coordination details.",
    tone: "green"
  },
  {
    label: "Hold back",
    body: "Anything the facility has not approved, internal notes, requester-only wording, or unclear context.",
    tone: "gold"
  },
  {
    label: "Never request",
    body: "Diagnosis, treatment details, emergency information, medical record data, or counseling notes.",
    tone: "red"
  }
];

const activityLog = [
  "Request received from requester preview flow.",
  "Facility review required before partner release.",
  "Approved context can be routed to Hope Church only after human confirmation.",
  "Requester sees status update, not internal review notes."
];

function RuleCard({ label, body, tone }: { label: string; body: string; tone: string }) {
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

export function FacilityPreviewExperience() {
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
              <span className="block text-xs font-semibold text-[#d9e7df]">Facility Preview · No auth · No database</span>
            </span>
          </a>

          <div className="flex flex-wrap gap-2">
            <a href="/preview/requester" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Requester</a>
            <a href="/preview/facility" className="rounded-full bg-[#d6a943] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Facility</a>
            <a href="/preview/partner" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Partner</a>
            <a href="/preview/pilot" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Pilot</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-[118rem] px-5 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-5 text-sm font-semibold leading-7 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          Safe preview route. No login, no Supabase, no real writes, no medical data, no emergency workflow. This page shows how Grandview reviews and controls release before any partner sees a request.
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="grid gap-0 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="bg-[#173b2d] px-6 py-10 text-white md:px-10 md:py-14">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">Facility preview</p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                Grandview reviews before anything is shared.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/82">
                This view should make the facility feel in control: incoming spiritual-care requests are reviewed, safe context is approved, and only approved information can move to a partner.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#review-console" className="rounded-xl bg-white px-5 py-3 text-center text-sm font-black text-[#082838] shadow-lg">Review sample request</a>
                <a href="#sharing-state" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-center text-sm font-black text-white">Check sharing state</a>
              </div>
            </section>

            <aside className="bg-[#f8fbf8] p-5 md:p-7">
              <div className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Facility job</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Decide what is safe to release.</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">
                  Grandview should never feel like ChurchWork bypasses them. The review console exists so the facility approves the spiritual-care context before Hope Church or any partner receives it.
                </p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-[#4f6259]">
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">Human review required.</div>
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">Partner sees approved context only.</div>
                  <div className="rounded-2xl border border-[#d9dfd7] bg-[#edf4f0] p-4">No clinical documentation lane.</div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div id="review-console" className="mt-7 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Incoming request snapshot</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Review what came from requester intake.</h2>
              </div>
              <span className="rounded-full bg-[#fff8e7] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#7a5b20]">Needs review</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {reviewItems.map((item) => (
                <article key={item.label} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{item.label}</p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[#0d2b3b]">{item.value}</p>
                  <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">{item.status}</span>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#ddb66c]/60 bg-[#fff8e7] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a6b16]">Review boundary</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#5f4b1f]">
                This request is spiritual-care coordination only. Facility staff decide whether the wording is safe, whether partner routing is appropriate, and what the requester can see as a status update.
              </p>
            </div>
          </section>

          <aside id="sharing-state" className="space-y-6">
            <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Sharing state</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">What can leave Grandview?</h2>
              <div className="mt-5 space-y-3">
                {shareRules.map((rule) => (
                  <RuleCard key={rule.label} {...rule} />
                ))}
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Release decision</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Approved context for partner assignment.</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_14rem]">
              <div className="rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#173b2d]">Approved partner context</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#173b2d]">
                  Resident/family requested prayer and a friendly visit. Please coordinate timing through facility-approved contact path. No medical details are included.
                </p>
              </div>
              <div className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Action</p>
                <div className="mt-4 flex flex-col gap-3">
                  <span className="rounded-xl bg-[#173b2d] px-4 py-3 text-center text-sm font-black text-white">Release to partner</span>
                  <span className="rounded-xl border border-[#d9dfd7] bg-white px-4 py-3 text-center text-sm font-black text-[#0d2b3b]">Hold for edit</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Activity log</p>
            <ol className="mt-5 space-y-3 text-sm font-semibold leading-6 text-[#4f6259]">
              {activityLog.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d6a943] text-xs font-black text-[#082838]">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">What Grandview should understand</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">ChurchWork does not route around the facility.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#4f6259]">
              The facility owns the review step. The partner receives only approved spiritual-care context. The requester receives only approved status updates. This page should make that governance obvious at a glance.
            </p>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Next review</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">
              After facility approval makes sense, the partner preview should show what Hope Church receives and how they report back safely.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a href="/preview/partner" className="rounded-xl bg-[#082838] px-5 py-3 text-center text-sm font-black text-white shadow-lg hover:bg-[#0f3f35]">Open partner preview</a>
              <a href="/preview" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Back to previews</a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
