import Link from "next/link";

const readinessCards = [
  { label: "Source-backed workflows", value: "Configured", detail: "Readiness" },
  { label: "Review-needed items", value: "Manual Review", detail: "Readiness" },
  { label: "Apply-able opportunities", value: "Needs Verification", detail: "Readiness" },
  { label: "Monitor-only opportunities", value: "Forecast / Not Actionable", detail: "Routing" },
];

const workflowActions = [
  {
    title: "Find Funding Matches",
    href: "/funding-search",
    reason: "Open source-backed opportunities and triage what may be actionable versus monitor-only.",
  },
  {
    title: "Review Source Database",
    href: "/source-database",
    reason: "Confirm which sources are Live API, Pilot Source, Manual Review, or Ready for Setup.",
  },
  {
    title: "Open Review Queue",
    href: "/review-queue",
    reason: "Process items requiring human validation before any external action or decision.",
  },
  {
    title: "Scan Proposal",
    href: "/proposal-scanner",
    reason: "Match proposal language to funding directions and identify where verification is still needed.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Dashboard</p>
        <h2 className="mt-2 text-3xl font-bold text-crcf-navy">Funding Command Center</h2>
        <p className="mt-2 text-sm text-slate-600">Read-only internal funding intelligence dashboard</p>
        <div className="mt-4">
          <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            Public sources only · human-reviewed · external actions disabled
          </span>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {readinessCards.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-lg font-bold text-crcf-navy">{item.value}</p>
            <p className="text-xs text-slate-500">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="text-xl font-bold text-crcf-navy">What to review next</h3>
        <p className="mt-2 text-sm text-slate-600">Choose the next staff action based on review readiness and source posture.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {workflowActions.map((action) => (
            <Link key={action.href} href={action.href} className="block rounded-2xl border border-slate-200 p-4 transition hover:border-crcf-blue/40 hover:bg-slate-50">
              <p className="font-semibold text-crcf-navy">{action.title}</p>
              <p className="mt-1 text-sm text-slate-600">{action.reason}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
