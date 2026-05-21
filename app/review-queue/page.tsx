import { PageHeader } from "@/components/PageHeader";

const plannedInternalActions = [
  "Add to Review Queue",
  "Mark High Priority",
  "Mark Bad Fit",
  "Mark Partner Needed",
  "Mark Research / Partner Only",
  "Create Internal Brief",
  "Copy Summary",
  "Print Brief",
  "Add Internal Notes",
  "Assign Staff Reviewer",
  "Set Review Deadline",
  "Save Source Lead for Review",
];

const disabledExternalActions = [
  "No applications",
  "No submissions",
  "No emails",
  "No funder outreach",
  "No source-system writes",
];

export default function ReviewQueuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Review Queue"
        title="Review Queue + Internal Actions Shell"
        description="CRCF 2.1 adds a shell-only staff workflow destination for future human review actions. Nothing is persisted, submitted, emailed, or written to a source system."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">
          Human review required
        </p>
        <p className="mt-2">
          This page is planning-only. It does not create records, update source
          systems, send outreach, submit applications, or store review actions.
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
              Review Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold text-crcf-navy">
              Staff workflow destination
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            Server-backed queue ready
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold leading-6 text-slate-700">
          No real opportunities have been added to review yet. CRCF 2.4 enables
          controlled server-side review queue persistence for source-backed items.
        </div>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
            Future Internal Actions
          </p>
          <h2 className="mt-2 text-2xl font-bold text-crcf-navy">
            Safe staff workflow actions planned
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These labels describe future internal review steps only. They are
            not active buttons. External actions remain disabled.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {plannedInternalActions.map((action) => (
              <div
                key={action}
                className="rounded-2xl border border-crcf-blue/10 bg-crcf-sky/50 p-3"
              >
                <p className="text-sm font-bold text-crcf-navy">{action}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Planned · shell-only
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-800">
            External Actions Disabled
          </p>
          <h2 className="mt-2 text-2xl font-bold text-rose-950">
            No external action layer in this phase
          </h2>
          <p className="mt-2 text-sm leading-6 text-rose-950">
            CRCF 2.1 keeps external actions disabled. Staff must complete human
            review outside this shell before any future approved external step.
          </p>

          <ul className="mt-5 grid gap-2">
            {disabledExternalActions.map((action) => (
              <li
                key={action}
                className="rounded-2xl bg-white/80 p-3 text-sm font-bold text-rose-950 ring-1 ring-rose-200"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-crcf-blue/20 bg-crcf-sky/60 p-6 text-sm leading-6 text-crcf-navy">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
          Action Status
        </p>
        <p className="mt-2 text-lg font-bold">
          Actions are shown as workflow planning only in this phase. Persistent
          action tracking will require the future memory/storage layer.
        </p>
        <p className="mt-2 font-semibold">
          Current implementation keeps external actions disabled and supports
          controlled internal server-side queue writes only.
        </p>
      </section>
    </>
  );
}
