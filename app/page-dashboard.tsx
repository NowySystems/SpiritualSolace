import Link from "next/link";
import {
  approvedResponders,
  facilityRules,
  getResponderName,
  solaceMessages,
  solaceRequests
} from "@/lib/spiritual-solace-data";

const workflowSteps = [
  "Request received",
  "Intake reviewed",
  "Responder routed",
  "Message reviewed",
  "One-way delivery",
  "Temporary expiration"
];

const quickActions = [
  ["Review requests", "/app/support-requests", "Intake queue"],
  ["Check messages", "/app/message-review", "Safety gate"],
  ["Responder coverage", "/app/approved-responders", "Routing layer"],
  ["Audit trail", "/app/audit-log", "Traceability"]
];

function getDashboardMetrics() {
  const needsIntake = solaceRequests.filter((request) => request.status === "Intake Review" || request.status === "New").length;
  const needsMessageReview = solaceMessages.filter((message) => message.status === "Needs Review").length;
  const activeResponders = approvedResponders.filter((responder) => responder.status === "Active").length;
  const limitedResponders = approvedResponders.filter((responder) => responder.status === "Limited" || responder.status === "Renewal Needed").length;
  const approvedMessages = solaceMessages.filter((message) => message.status === "Approved").length;
  const enabledRules = facilityRules.filter((rule) => rule.status === "Enabled").length;

  return {
    needsIntake,
    needsMessageReview,
    activeResponders,
    limitedResponders,
    approvedMessages,
    enabledRules,
    totalNeedsAttention: needsIntake + needsMessageReview + limitedResponders
  };
}

const coverageHealth = [
  { label: "Christian coverage", status: "Covered", detail: "Prayer and encouragement responder active" },
  { label: "Interfaith coverage", status: "Covered", detail: "Calming words and affirmation responder active" },
  { label: "No-specific-tradition", status: "Covered", detail: "Volunteer encouragement desk available" },
  { label: "Spanish language", status: "Limited", detail: "Available through interfaith support only" }
];

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const attentionItems = [
    {
      title: "Requests waiting for intake review",
      count: metrics.needsIntake,
      href: "/app/support-requests",
      note: "Confirm consent, tone, and routing preference before assignment."
    },
    {
      title: "Messages waiting for review",
      count: metrics.needsMessageReview,
      href: "/app/message-review",
      note: "Check content boundaries before recipient delivery."
    },
    {
      title: "Responder coverage limitations",
      count: metrics.limitedResponders,
      href: "/app/approved-responders",
      note: "Limited or renewal-needed responders should be reviewed."
    }
  ];

  const liveFlow = solaceRequests.map((request) => ({
    id: request.id,
    title: `${request.patientAlias} · ${request.requestType}`,
    status: request.status,
    responder: getResponderName(request.assignedResponderId),
    note: request.note
  }));

  return (
    <div className="space-y-7 lg:space-y-8">
      <section className="rounded-[2rem] border border-[#d7d2c8] bg-gradient-to-br from-[#fffdf9] via-[#f8f3e9] to-[#edf4f0] p-7 shadow-[0_12px_34px_rgba(77,94,86,0.08)] lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f746d]">1:30 PM Pass 2 · Operations Board</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f3442]">What needs attention right now?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f6058]">
              Spiritual Solace is a workflow tool first. This board prioritizes review queues, responder coverage, delivery readiness,
              and the rules that keep one-way support safe and accountable.
            </p>
          </div>
          <article className="rounded-3xl border border-[#dfd8cb] bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a7b74]">Needs attention</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-[#223746]">{metrics.totalNeedsAttention}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#5f7069]">
              Items currently requiring intake review, message review, or responder coverage follow-up.
            </p>
          </article>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-[0_6px_16px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Requests today</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{solaceRequests.length}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Demo request records</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-[0_6px_16px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Messages approved</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{metrics.approvedMessages}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Ready for recipient view</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-[0_6px_16px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Active responders</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{metrics.activeResponders}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Available routing groups</p>
          </article>
          <article className="rounded-2xl border border-[#dfd8cb] bg-white/85 p-4 shadow-[0_6px_16px_rgba(77,94,86,0.06)]">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6a7b74]">Enabled rules</p>
            <p className="mt-2 text-2xl font-semibold text-[#223746]">{metrics.enabledRules}</p>
            <p className="mt-1 text-xs text-[#5f7069]">Facility controls active</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Priority queue</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Needs attention</h3>
            </div>
            <span className="rounded-full border border-[#d7d9cf] bg-[#f3f6f0] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#556a62]">
              Staff decision points
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {attentionItems.map((item) => (
              <Link key={item.title} href={item.href} className="block rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] p-4 transition hover:bg-[#f4efe6]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#223746]">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#5f7069]">{item.note}</p>
                  </div>
                  <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#516476] px-3 text-lg font-semibold text-white">
                    {item.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Today’s flow</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Requests moving through the system</h3>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.09em] text-[#6a7b74]">Live demo data</span>
          </div>

          <div className="space-y-3">
            {liveFlow.map((flow) => (
              <article key={flow.id} className="rounded-2xl border border-[#e4ddd1] bg-[#faf7f0] p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-[#223746]">{flow.id} · {flow.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#5f7069]">{flow.note}</p>
                  </div>
                  <span className="rounded-full border border-[#d8d3c7] bg-white/80 px-3 py-1 text-xs font-semibold text-[#61706a]">
                    {flow.status}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-[#60716a]">Responder: {flow.responder}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Coverage health</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">Can requests be routed?</h3>
            </div>
            <Link href="/app/approved-responders" className="text-xs font-semibold text-[#516476] underline underline-offset-4">
              Open responders
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {coverageHealth.map((item) => (
              <article key={item.label} className="rounded-2xl border border-[#e4ddd1] bg-[#faf6ee] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#223746]">{item.label}</p>
                  <span className="rounded-full border border-[#d8d3c7] bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#61706a]">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#5f7069]">{item.detail}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#dfd8cb] bg-gradient-to-b from-[#f8f3e9] to-[#f3f6f0] p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f746d]">Workflow map</p>
              <h3 className="mt-1 text-xl font-semibold text-[#223746]">How a request becomes comfort</h3>
            </div>
            <Link href="/app/facility-rules" className="text-xs font-semibold text-[#516476] underline underline-offset-4">
              Open rules
            </Link>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-[#e4ddd1] bg-white/75 p-4">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#516476] text-xs font-bold text-white">{index + 1}</span>
                <p className="text-sm font-medium text-[#243847]">{step}</p>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-[#dfd8cb] bg-white/85 p-6 shadow-[0_8px_24px_rgba(77,94,86,0.06)]">
          <h3 className="text-lg font-semibold text-[#223746]">Open a workflow module</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map(([label, href, note]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-[#dfd8cb] bg-[#f9f5ed] p-4 text-sm font-semibold text-[#253948] transition hover:bg-[#f2ece1]"
              >
                <span>{label}</span>
                <span className="mt-1 block text-xs font-medium text-[#6a7b74]">{note}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#d8d3c7] bg-[#f6f1e7] p-6 shadow-[0_8px_20px_rgba(77,94,86,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f746d]">Demo readiness</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#4f6058]">
            <li>• Core workflow modules are connected to canonical demo data.</li>
            <li>• No live messages, uploads, notifications, or external actions.</li>
            <li>• Review gates, audit trail, and facility rules are visible.</li>
            <li>• Next sweep should focus on visual style and module-specific polish.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
