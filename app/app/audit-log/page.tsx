import { auditEvents, facilityRules, solaceMessages, solaceRequests } from "@/lib/spiritual-solace-data";

const auditPrinciples = [
  "Every request has a visible status trail.",
  "Every message decision should leave a record.",
  "Responder assignment should be explainable.",
  "Facility rules should be tied to review decisions.",
  "Demo data only; no real recipient information."
];

const derivedTimeline = [
  ...auditEvents,
  ...solaceRequests.map((request) => ({
    id: `FLOW-${request.id}`,
    timestamp: request.submittedAt,
    actor: "Workflow",
    action: `Status: ${request.status}`,
    target: request.id,
    note: `${request.requestType} request routed with ${request.traditionPreference} preference and ${request.priority} priority.`
  })),
  ...solaceMessages.map((message) => ({
    id: `FLOW-${message.id}`,
    timestamp: message.submittedAt,
    actor: "Review Queue",
    action: `Message ${message.status}`,
    target: message.id,
    note: `Message linked to ${message.requestId}; delivery readiness depends on review status.`
  }))
];

export default function AuditLogPage() {
  const reviewedMessages = solaceMessages.filter((message) => message.status === "Approved").length;
  const openReviewItems = solaceMessages.filter((message) => message.status === "Needs Review").length;

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[2rem] border border-[#dfd8cb] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#eef4f0] p-7 shadow-[0_12px_32px_rgba(77,94,86,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Module 5 · Audit Log</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">Traceability for every demo workflow decision</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
          The audit log explains how requests, responder assignments, message review decisions, and facility rules connect.
          This makes the demo feel operational instead of just visual.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Audit events</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{derivedTimeline.length}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Combined demo trail</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Requests tracked</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{solaceRequests.length}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Canonical request records</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Reviewed messages</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{reviewedMessages}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Approved in demo data</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Open reviews</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{openReviewItems}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Held for staff decision</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Event trail</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Canonical workflow events</h3>
            </div>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-3 py-1.5 text-xs font-semibold text-[#556a62]">
              Read-only demo trail
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {derivedTimeline.map((event) => (
              <article key={event.id} className="rounded-2xl border border-[#e4ddd1] bg-[#faf7f0] p-4 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#223746]">{event.action}</p>
                      <span className="rounded-full border border-[#d8d3c7] bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#61706a]">
                        {event.target}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[#4f6058]">{event.note}</p>
                  </div>
                  <div className="shrink-0 rounded-xl border border-[#dfd8cb] bg-white/80 px-3 py-2 text-xs font-medium text-[#60716a]">
                    <p>{event.timestamp}</p>
                    <p className="mt-1 text-[#7b8781]">{event.actor}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Audit principles</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">What the trail must prove</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#4f6058]">
              {auditPrinciples.map((item) => (
                <li key={item} className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] px-3 py-2 font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Facility rules linked</p>
            <h3 className="mt-1 text-lg font-semibold text-[#223746]">Controls referenced by review</h3>
            <div className="mt-4 space-y-3">
              {facilityRules.map((rule) => (
                <article key={rule.id} className="rounded-xl border border-[#e4ddd1] bg-[#faf6ee] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#314550]">{rule.name}</p>
                    <span className="rounded-full border border-[#cfe2d0] bg-[#eef8ee] px-2 py-0.5 text-[10px] font-semibold text-[#4f7457]">
                      {rule.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#5f7069]">{rule.rule}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
            <h3 className="text-lg font-semibold text-[#223746]">Pass 1 status</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
              <li>• Old reports route replaced.</li>
              <li>• Canonical audit events connected.</li>
              <li>• Request and message trail derived.</li>
              <li>• Facility rules tied into the traceability story.</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
