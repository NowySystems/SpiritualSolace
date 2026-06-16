import Link from "next/link";
import {
  approvedResponders,
  auditEvents,
  facilityRules,
  solaceMessages,
  solaceRequests
} from "@/lib/spiritual-solace-data";

function workflowAccent(kind: string) {
  if (kind === "review") return {
    label: "Review Required",
    eyebrow: "Next human decision",
    band: "bg-[#f59e0b]",
    surface: "bg-[#fff7e6]",
    border: "border-[#f0bf66]",
    text: "text-[#7a4a08]",
    button: "bg-[#92400e] text-white hover:bg-[#78350f]",
    routeLabel: "Open review"
  };

  if (kind === "routing") return {
    label: "Routing Required",
    eyebrow: "Next staff step",
    band: "bg-[#2563eb]",
    surface: "bg-[#edf5ff]",
    border: "border-[#9ec1f3]",
    text: "text-[#214f91]",
    button: "bg-[#1d4ed8] text-white hover:bg-[#1e40af]",
    routeLabel: "Open request"
  };

  if (kind === "delivery") return {
    label: "Delivery Check",
    eyebrow: "Close the loop",
    band: "bg-[#16a34a]",
    surface: "bg-[#eef9f0]",
    border: "border-[#a8ddb5]",
    text: "text-[#27633a]",
    button: "bg-[#15803d] text-white hover:bg-[#166534]",
    routeLabel: "Check delivery"
  };

  return {
    label: "Staff Attention",
    eyebrow: "Needs review",
    band: "bg-[#0d2b3b]",
    surface: "bg-[#eef4f0]",
    border: "border-[#b8c8bd]",
    text: "text-[#102b3a]",
    button: "bg-[#0d2b3b] text-white hover:bg-[#173f53]",
    routeLabel: "Open item"
  };
}

const reviewMessage = solaceMessages.find((message) => message.status === "Needs Review");
const reviewRequest = reviewMessage ? solaceRequests.find((request) => request.id === reviewMessage.requestId) : undefined;
const routingRequest = solaceRequests.find((request) => request.priority === "Time Sensitive" || request.status === "New" || request.status === "Intake Review");
const deliveredRequest = solaceRequests.find((request) => request.status === "Delivered");

const nextDecision = reviewMessage
  ? {
      kind: "review",
      title: reviewRequest?.requestType ?? "Comfort Message",
      subject: reviewRequest?.patientAlias ?? "Recipient",
      location: reviewRequest?.location ?? "Facility delivery",
      why: "A responder message is ready, but delivery is held until staff confirms it safely matches the request.",
      detail: reviewMessage.body,
      href: "/app/message-review"
    }
  : routingRequest
    ? {
        kind: "routing",
        title: routingRequest.requestType,
        subject: routingRequest.patientAlias,
        location: routingRequest.location,
        why: "This request needs intake confirmation before a responder path can move forward.",
        detail: routingRequest.note,
        href: "/app/support-requests"
      }
    : {
        kind: "delivery",
        title: deliveredRequest?.requestType ?? "Delivered Message",
        subject: deliveredRequest?.patientAlias ?? "Recipient",
        location: deliveredRequest?.location ?? "Facility delivery",
        why: "No review is blocking delivery. Check the latest completed file or audit trail.",
        detail: deliveredRequest?.note ?? "Recent delivery is ready for record review.",
        href: "/app/delivery-workspace"
      };

const accent = workflowAccent(nextDecision.kind);

const waitingItems = [
  ...solaceRequests
    .filter((request) => request.id !== reviewRequest?.id && (request.priority === "Time Sensitive" || request.status === "New" || request.status === "Intake Review"))
    .map((request) => ({
      id: request.id,
      kind: request.priority === "Time Sensitive" ? "review" : "routing",
      title: request.requestType,
      subject: request.patientAlias,
      reason: request.priority === "Time Sensitive" ? "time sensitive" : request.status,
      href: "/app/support-requests"
    })),
  ...solaceMessages
    .filter((message) => message.id !== reviewMessage?.id && message.status === "Needs Review")
    .map((message) => {
      const request = solaceRequests.find((item) => item.id === message.requestId);
      return {
        id: message.id,
        kind: "review",
        title: request?.requestType ?? "Comfort Message",
        subject: request?.patientAlias ?? "Recipient",
        reason: "message held",
        href: "/app/message-review"
      };
    })
];

const completedItems = [
  ...solaceRequests.filter((request) => request.status === "Delivered").slice(0, 2).map((request) => ({
    id: request.id,
    label: `${request.requestType} delivered`,
    detail: `${request.patientAlias} · ${request.location}`,
    href: "/app/delivery-workspace"
  })),
  ...auditEvents.slice(0, 2).map((event) => ({
    id: event.id,
    label: event.action,
    detail: event.note,
    href: "/app/audit-log"
  }))
];

export default function DashboardPage() {
  const activeResponderCount = approvedResponders.filter((responder) => responder.status === "Active").length;
  const enabledRuleCount = facilityRules.filter((rule) => rule.status === "Enabled").length;
  const reviewCount = solaceMessages.filter((message) => message.status === "Needs Review").length;
  const routingCount = solaceRequests.filter((request) => request.status === "New" || request.status === "Intake Review" || request.priority === "Time Sensitive").length;
  const deliveredCount = solaceRequests.filter((request) => request.status === "Delivered").length;

  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[760px] xl:grid-cols-[1.65fr_0.72fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className={`relative overflow-hidden rounded-[2rem] border ${accent.border} ${accent.surface} shadow-[0_18px_46px_rgba(53,72,65,0.12)]`}>
            <div className={`h-3 w-full ${accent.band}`} />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className={`text-xs font-black uppercase tracking-[0.24em] ${accent.text}`}>{accent.eyebrow}</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">
                  {accent.label}
                </h1>
                <div className="mt-8 max-w-3xl">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5f7069]">Start here</p>
                  <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight text-[#102b3a]">
                    {nextDecision.title}
                  </h2>
                  <p className="mt-2 text-xl font-semibold text-[#263f4b]">{nextDecision.subject} · {nextDecision.location}</p>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-[#4d6158]">{nextDecision.why}</p>
                  <blockquote className="mt-6 max-w-3xl border-l-4 border-[#0d2b3b]/25 pl-5 font-serif text-2xl italic leading-9 text-[#263f4b]">
                    “{nextDecision.detail}”
                  </blockquote>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[1.4rem] border border-white/70 bg-white/65 p-5 shadow-sm lg:w-64">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Decision path</p>
                  <div className="mt-5 space-y-4 text-sm">
                    <div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${accent.band}`} /><span className="font-semibold text-[#102b3a]">Review context</span></div>
                    <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-[#c9c1b4]" /><span className="font-semibold text-[#102b3a]">Confirm safety</span></div>
                    <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-[#c9c1b4]" /><span className="font-semibold text-[#102b3a]">Move file forward</span></div>
                  </div>
                </div>
                <Link href={nextDecision.href} className={`mt-8 inline-flex justify-center rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-md ${accent.button}`}>
                  {accent.routeLabel} →
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-[1.6rem] border border-[#ded6ca] bg-white/68 p-6">
              <div className="flex items-end justify-between gap-4 border-b border-[#e1d8cb] pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Other waiting items</p>
                  <h3 className="mt-2 font-serif text-3xl font-semibold text-[#102b3a]">{waitingItems.length} behind the next decision</h3>
                </div>
                <Link href="/app/support-requests" className="shrink-0 rounded-full border border-[#cfc6b8] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#102b3a]">View all</Link>
              </div>

              <div className="divide-y divide-[#e1d8cb]">
                {waitingItems.length ? waitingItems.slice(0, 4).map((item) => {
                  const itemAccent = workflowAccent(item.kind);
                  return (
                    <Link key={item.id} href={item.href} className="grid gap-4 py-4 transition hover:bg-[#fbf6ee] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                      <span className={`h-10 w-2 rounded-full ${itemAccent.band}`} />
                      <span>
                        <span className="block font-semibold text-[#102b3a]">{item.title}</span>
                        <span className="mt-1 block text-sm text-[#5f7069]">{item.subject} · {item.reason}</span>
                      </span>
                      <span className={`w-fit rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${itemAccent.border} ${itemAccent.text}`}>{itemAccent.label}</span>
                    </Link>
                  );
                }) : (
                  <p className="py-5 text-sm leading-6 text-[#5f7069]">No additional items are waiting behind the next decision.</p>
                )}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[#ded6ca] bg-[#f5efe5] p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Recently completed</p>
              <div className="mt-4 divide-y divide-[#ddd4c8] border-y border-[#ddd4c8]">
                {completedItems.map((item) => (
                  <Link key={item.id} href={item.href} className="block py-4 transition hover:bg-white/45">
                    <p className="font-bold text-[#102b3a]">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f7069]">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Today</p>
              <div className="mt-5 grid grid-cols-3 gap-3 xl:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
                  <p className="text-4xl font-semibold tracking-[-0.05em]">{reviewCount}</p>
                  <p className="mt-1 text-xs font-semibold text-[#d7e7b7]">reviews</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
                  <p className="text-4xl font-semibold tracking-[-0.05em]">{routingCount}</p>
                  <p className="mt-1 text-xs font-semibold text-[#d7e7b7]">routing</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
                  <p className="text-4xl font-semibold tracking-[-0.05em]">{deliveredCount}</p>
                  <p className="mt-1 text-xs font-semibold text-[#d7e7b7]">delivered</p>
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Action shortcuts</p>
              <div className="mt-4 space-y-3">
                <Link href="/app/support-requests" className="block rounded-full bg-white px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Requests</Link>
                <Link href="/app/message-review" className="block rounded-full border border-white/25 px-5 py-3 text-center text-sm font-black text-white">Review</Link>
                <Link href="/app/delivery-workspace" className="block rounded-full border border-white/25 px-5 py-3 text-center text-sm font-black text-white">Delivery</Link>
              </div>
            </section>

            <section>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">System ready</p>
              <div className="mt-4 divide-y divide-white/10 border-y border-white/10 text-sm">
                <div className="flex items-center justify-between gap-4 py-3"><span>Responders</span><span className="font-bold text-[#d7e7b7]">{activeResponderCount} active</span></div>
                <div className="flex items-center justify-between gap-4 py-3"><span>Rules</span><span className="font-bold text-[#d7e7b7]">{enabledRuleCount} on</span></div>
                <div className="flex items-center justify-between gap-4 py-3"><span>Audit</span><span className="font-bold text-[#d7e7b7]">{auditEvents.length} events</span></div>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9fb36b]">Experiment</p>
              <p className="mt-3 text-sm leading-6 text-[#dce8e6]">
                Care Desk V4 tests the NS “Next Human Decision” pattern: one dominant action, color by status, everything else demoted.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
