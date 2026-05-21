import { PageHeader } from "@/components/PageHeader";

const plannedInternalActions = [
  "Add to Message Review",
  "Mark Review Priority",
  "Approve for Delivery",
  "Flag for Revision",
  "Mark Policy Escalation",
  "Create Internal Summary",
  "Copy Summary",
  "Print Summary",
  "Add Internal Notes",
  "Assign Reviewer",
  "Set Review Deadline",
  "Queue for Patient View",
];

const disabledExternalActions = [
  "No automatic sends",
  "No open chat",
  "No reply threads",
  "No external contact sharing",
  "No source-system writes",
];

export default function ReviewQueuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Message Review"
        title="Message Review + Internal Actions Shell"
        description="SpiritualSolace 0.1a keeps this as a shell-only internal workflow for one-way support message review. Nothing is automatically sent or permanently stored."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Human review required</p>
        <p className="mt-2">
          This page is planning-only. It does not create permanent records, open two-way communication,
          send outreach, or trigger automatic external actions.
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Message Review</p>
            <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Facility-controlled workflow destination</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            Prototype queue view
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold leading-6 text-slate-700">
          No real messages are loaded in this demo queue. This prototype demonstrates review posture only for
          temporary one-way message delivery.
        </div>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Future Internal Actions</p>
          <h2 className="mt-2 text-2xl font-bold text-crcf-navy">Safe internal review actions planned</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These labels describe future internal review steps only. They are not active buttons.
            External actions remain disabled.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {plannedInternalActions.map((action) => (
              <div key={action} className="rounded-2xl border border-crcf-blue/10 bg-crcf-sky/50 p-3">
                <p className="text-sm font-bold text-crcf-navy">{action}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Planned · shell-only</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-800">External Actions Disabled</p>
          <h2 className="mt-2 text-2xl font-bold text-rose-950">No external action layer in this phase</h2>
          <p className="mt-2 text-sm leading-6 text-rose-950">
            SpiritualSolace 0.1a keeps external actions disabled. Staff must complete human review outside this
            shell before any future approved delivery step.
          </p>

          <ul className="mt-5 grid gap-2">
            {disabledExternalActions.map((action) => (
              <li key={action} className="rounded-2xl bg-white/80 p-3 text-sm font-bold text-rose-950 ring-1 ring-rose-200">
                {action}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-crcf-blue/20 bg-crcf-sky/60 p-6 text-sm leading-6 text-crcf-navy">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Action Status</p>
        <p className="mt-2 text-lg font-bold">
          Actions are shown as workflow planning only in this phase. Persistent tracking remains out of scope for
          this demo prototype.
        </p>
        <p className="mt-2 font-semibold">
          Current implementation keeps external actions disabled and presents a review-only shell for safe human
          moderation flow.
        </p>
      </section>
    </>
  );
}
