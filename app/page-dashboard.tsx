import Link from "next/link";

const overview = [
  { label: "New support requests", value: "12", note: "Awaiting intake review" },
  { label: "Pending human review", value: "5", note: "Messages in review queue" },
  { label: "Approved responders on shift", value: "8", note: "Currently available" },
  { label: "Temporary threads expiring", value: "3", note: "Within next 2 hours" }
];

const pendingReview = [
  "Confirm requester consent language before sending",
  "Validate responder assignment against role scope",
  "Approve or reject message draft before delivery"
];

const responderStatus = [
  "2 responders pending renewal within 7 days",
  "1 responder restricted to daytime coverage",
  "5 responders currently multi-language enabled"
];

const lifecycle = [
  "Request submitted",
  "Facility rules checked",
  "Responder assigned",
  "Message reviewed by staff",
  "Temporary message delivered",
  "Thread expires and is removed"
];

const facilityReminders = [
  "All support messages remain one-way and temporary.",
  "Escalation and sensitive scenarios require staff intervention.",
  "No automated outreach is enabled in this demo prototype."
];

const primaryPages = [
  ["Support Requests", "/app/support-requests"],
  ["Approved Responders", "/app/approved-responders"],
  ["Message Review", "/app/message-review"],
  ["Facility Rules", "/app/facility-rules"],
  ["Patient View", "/app/patient-view"],
  ["Audit Log", "/app/audit-log"],
  ["Guardrails", "/app/guardrails"]
];

export default function DashboardPage() {
  return (
    <div className="space-y-7 lg:space-y-8">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f9f4ea] to-[#f0f3ed] p-7 shadow-[0_12px_34px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f746d]">Today’s support overview</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Facility spiritual support operations overview</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          Calm internal dashboard for staffing awareness, request flow visibility, and policy-safe decisions. Demo-only display with no live systems connected.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((item) => (
            <article key={item.label} className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-[0_6px_16px_rgba(77,94,86,0.06)]">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#223746]">{item.value}</p>
              <p className="mt-1 text-xs text-[#5f7069]">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[#223746]">Pending review queue</h3>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#556a62]">Human review required</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-[#4f6058]">
            {pendingReview.map((item) => (
              <li key={item} className="rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] px-4 py-3 leading-relaxed">{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <h3 className="text-lg font-semibold text-[#223746]">Approved responder status</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#4f6058]">
            {responderStatus.map((item) => (
              <li key={item} className="rounded-2xl border border-[#e4ddd1] bg-[#f6f8f3] px-4 py-3 leading-relaxed">{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#223746]">Temporary message lifecycle</h3>
            <span className="text-xs font-medium uppercase tracking-[0.09em] text-[#6a7b74]">Operational flow</span>
          </div>
          <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lifecycle.map((step, index) => (
              <li key={step} className="rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7b74]">Step {index + 1}</p>
                <p className="mt-2 text-sm font-medium text-[#243847]">{step}</p>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-3xl border border-[#dfd8cb] bg-gradient-to-b from-[#f8f3e9] to-[#f3f6f0] p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <h3 className="text-lg font-semibold text-[#223746]">Facility policy reminders</h3>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#4f6058]">
            {facilityReminders.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <h3 className="text-lg font-semibold text-[#223746]">Open a primary module</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {primaryPages.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-[#dfd8cb] bg-[#f9f5ed] p-4 text-sm font-semibold text-[#253948] transition hover:bg-[#f2ece1]"
              >
                {label}
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Demo constraints strip</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
            <li>• Static/demo-only content</li>
            <li>• No backend writes or persistence</li>
            <li>• No uploads, live messaging, or notifications</li>
            <li>• No production claims or real-patient workflows</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
