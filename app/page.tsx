import Link from "next/link";

const readinessCards = [
  { label: "Request intake", value: "Demo Ready", detail: "Consent-first" },
  { label: "Identity display", value: "Anonymous or First Name", detail: "Facility Controlled" },
  { label: "Message flow", value: "One-way only", detail: "No reply threads" },
  { label: "Retention", value: "Temporary / Expires", detail: "Prototype" },
];

const workflowActions = [
  {
    title: "Review Support Requests",
    href: "/funding-search",
    reason: "Triage incoming requests and confirm what can be shown under facility rules.",
  },
  {
    title: "Check Approved Responders",
    href: "/source-database",
    reason: "Verify only approved responders can access eligible requests.",
  },
  {
    title: "Open Message Review",
    href: "/review-queue",
    reason: "Review one-way support messages where facility policy requires moderation.",
  },
  {
    title: "Preview Patient View",
    href: "/proposal-scanner",
    reason: "Validate temporary message status and expiration messaging in the patient experience.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crcf-blue">Dashboard</p>
        <h2 className="mt-2 text-3xl font-bold text-crcf-navy">SpiritualSolace Command Center</h2>
        <p className="mt-2 text-sm text-slate-600">Calm, consent-first, facility-controlled spiritual support prototype</p>
        <div className="mt-4">
          <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            Demo only · no real patient data · one-way temporary messaging
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
        <h3 className="text-xl font-bold text-crcf-navy">What should the user do next?</h3>
        <p className="mt-2 text-sm text-slate-600">Follow the simple prototype flow from request intake through temporary message delivery.</p>
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
