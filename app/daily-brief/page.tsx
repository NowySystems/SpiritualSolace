import { PageHeader } from "@/components/PageHeader";

const reviewItems = [
  "High-fit opportunities",
  "Deadline-soon opportunities",
  "Reopened prior grants",
  "Evidence needed",
  "Partner-needed opportunities",
];

const sourceChecks = [
  {
    source: "Grants.gov",
    status: "Connected",
    note: "Available through existing staff-triggered read-only opportunity search and detail enrichment.",
  },
  {
    source: "USAspending",
    status: "Connected for public award intelligence",
    note: "Available through existing staff-triggered public award lookup for past-award and payout pattern review.",
  },
  {
    source: "Evidence sources",
    status: "Planned / shell",
    note: "Future evidence checks will require approved read-only connectors and source-backed citations.",
  },
  {
    source: "State / corporate / foundation sources",
    status: "Coming soon",
    note: "No connected daily source check is available yet, so no results are displayed.",
  },
];

const dailyBriefRules = [
  "Real source-backed results only.",
  "No fake opportunities.",
  "No outreach, submissions, or emails.",
  "Human review required.",
];

export default function DailyBriefPage() {
  return (
    <>
      <PageHeader
        eyebrow="Daily Brief"
        title="Daily Funding Brief shell"
        description="CRCF 2.0 adds a staff-facing, manual-only daily review shell. It does not schedule jobs, store results, write to databases, email anyone, submit grants, or contact source systems."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-6 text-crcf-navy">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
          Today&apos;s Funding Brief
        </p>
        <h2 className="mt-2 text-2xl font-bold">No daily brief generated</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6">
          No daily brief has been generated yet. Future versions will scan connected sources and show real source-backed opportunities only.
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Review Today</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Coming soon review lanes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {reviewItems.map((item) => (
            <article key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-base font-bold text-crcf-navy">{item}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Coming soon. This lane will remain empty until real connected-source data is available for staff review.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Source Checks</p>
        <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Daily source readiness</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {sourceChecks.map((check) => (
            <article key={check.source} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-lg font-bold text-crcf-navy">{check.source}</h3>
                <span className="rounded-full bg-crcf-mint px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-crcf-navy">
                  {check.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{check.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Daily Brief Rules</p>
          <ul className="mt-5 grid gap-3">
            {dailyBriefRules.map((rule) => (
              <li key={rule} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-crcf-blue/20 bg-crcf-sky/70 p-6 text-crcf-navy">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Future Learning Note</p>
          <p className="mt-4 text-sm font-semibold leading-6">
            Daily briefs will become smarter after review decisions, outcomes, source history, and staff feedback are stored in a future memory layer.
          </p>
        </div>
      </section>
    </>
  );
}
