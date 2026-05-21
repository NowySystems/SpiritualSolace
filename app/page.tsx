import Link from "next/link";

const workflow = [
  "Request submitted",
  "Facility rules applied",
  "Approved responder selected",
  "Message reviewed",
  "Temporary message delivered",
  "Message expired and removed"
];

const chips = ["Demo only", "No real patient data", "One-way only", "Temporary messages", "Human review"];

const primaryPages = [
  ["Support Requests", "/funding-search"],
  ["Approved Responders", "/source-database"],
  ["Message Review", "/review-queue"],
  ["Facility Rules", "/governance"],
  ["Patient View", "/proposal-scanner"],
  ["Audit Log", "/reports"],
  ["Guardrails", "/guardrails"]
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Dashboard</p>
        <h2 className="mt-3 text-3xl font-bold text-crcf-navy">SpiritualSolace Demo Workflow</h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          A calm, facility-controlled prototype for one-way spiritual support requests. This shell is visual-only and
          designed for internal stakeholder review.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-crcf-navy">Six-step request lifecycle</h3>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Demo flow</span>
        </div>
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {workflow.map((step, index) => (
            <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Step {index + 1}</p>
              <p className="mt-2 text-sm font-semibold text-crcf-navy">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-crcf-navy">What this prototype demonstrates</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Facility-controlled intake and review checkpoints</li>
            <li>• One-way temporary message delivery with expiration</li>
            <li>• Responder approvals, scope limits, and renewal visibility</li>
            <li>• Plain-language guardrails for safe stakeholder walkthroughs</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-crcf-navy">Open a primary page</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {primaryPages.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-crcf-navy hover:bg-slate-50">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
