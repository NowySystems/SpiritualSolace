import Link from "next/link";
import {
  approvedResponders,
  auditEvents,
  facilityRules,
  getResponderName,
  solaceMessages,
  solaceRequests
} from "@/lib/spiritual-solace-data";

function statusTone(status: string) {
  if (status.includes("Review") || status === "New") return "bg-[#f7e8d5] text-[#8a5521] border-[#ebceb0]";
  if (status === "Delivered" || status === "Approved") return "bg-[#e4eddf] text-[#587244] border-[#cbdcbe]";
  return "bg-[#e8edf1] text-[#516476] border-[#d1dbe0]";
}

function priorityTone(priority: string) {
  if (priority === "Time Sensitive") return "bg-[#fff1ee] text-[#8a4637] border-[#e8c8c0]";
  if (priority === "Soon") return "bg-[#fff9e8] text-[#735d2a] border-[#e2d6b9]";
  return "bg-white/70 text-[#61706a] border-[#d8d3c7]";
}

const reviewNeeded = solaceMessages.filter((message) => message.status === "Needs Review");
const intakeNeeded = solaceRequests.filter((request) => request.status === "New" || request.status === "Intake Review");
const delivered = solaceRequests.filter((request) => request.status === "Delivered");

const attentionItems = [
  ...solaceRequests
    .filter((request) => request.priority === "Time Sensitive" || request.status === "New" || request.status === "Intake Review")
    .map((request) => ({
      id: request.id,
      title: `${request.patientAlias} · ${request.requestType}`,
      location: request.location,
      reason: request.priority === "Time Sensitive" ? "Time-sensitive request needs staff awareness" : "Intake needs confirmation before routing",
      status: request.status,
      priority: request.priority,
      href: "/app/support-requests"
    })),
  ...reviewNeeded.map((message) => {
    const request = solaceRequests.find((item) => item.id === message.requestId);
    return {
      id: message.id,
      title: `${request?.patientAlias ?? "Recipient"} · Message review`,
      location: request?.location ?? "Facility delivery",
      reason: "Responder message is held until staff approval",
      status: message.status,
      priority: request?.priority ?? "Soon",
      href: "/app/message-review"
    };
  })
];

const recentActivity = [
  ...delivered.slice(0, 2).map((request) => ({
    id: request.id,
    label: `${request.requestType} delivered`,
    detail: `${request.patientAlias} · ${request.location}`,
    href: "/app/delivery-workspace"
  })),
  ...auditEvents.slice(0, 3).map((event) => ({
    id: event.id,
    label: event.action,
    detail: event.note,
    href: "/app/audit-log"
  }))
];

export default function DashboardPage() {
  const activeResponderCount = approvedResponders.filter((responder) => responder.status === "Active").length;
  const enabledRuleCount = facilityRules.filter((rule) => rule.status === "Enabled").length;
  const nextItem = attentionItems[0];

  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fdf9f1] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[760px] xl:grid-cols-[0.78fr_1.44fr_0.78fr]">
        <aside className="border-b border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-b-0 xl:border-r xl:border-white/10">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9fb36b]">Daily brief</p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-[-0.03em]">Care Desk</h1>
              <p className="mt-4 text-sm leading-7 text-[#dce8e6]">
                A quiet worklist for requests, responder messages, and delivery records that need human attention.
              </p>
            </div>

            <div className="mt-8 border-y border-white/12 py-6">
              <p className="text-6xl font-semibold tracking-[-0.06em] text-white">{attentionItems.length}</p>
              <p className="mt-2 text-sm font-semibold text-[#d7e7b7]">items need attention</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 pb-4">
                <span className="font-serif text-3xl text-[#d7e7b7]">{intakeNeeded.length}</span>
                <span>
                  <span className="block text-sm font-semibold text-white">Intake checks</span>
                  <span className="mt-1 block text-xs leading-5 text-[#b8cac9]">Confirm consent, preference, language, and routing.</span>
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 pb-4">
                <span className="font-serif text-3xl text-[#d7e7b7]">{reviewNeeded.length}</span>
                <span>
                  <span className="block text-sm font-semibold text-white">Message reviews</span>
                  <span className="mt-1 block text-xs leading-5 text-[#b8cac9]">Responder messages held before delivery.</span>
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 pb-4">
                <span className="font-serif text-3xl text-[#d7e7b7]">{delivered.length}</span>
                <span>
                  <span className="block text-sm font-semibold text-white">Delivered today</span>
                  <span className="mt-1 block text-xs leading-5 text-[#b8cac9]">Completed files ready for record review.</span>
                </span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link href={nextItem?.href ?? "/app/support-requests"} className="inline-flex w-full justify-center rounded-full bg-[#9fb36b] px-5 py-3 text-sm font-bold text-[#0d2b3b] shadow-lg hover:bg-[#b4c67f]">
                Open next item →
              </Link>
              <p className="mt-4 text-xs leading-5 text-[#b8cac9]">No public feed, no direct messaging, and no autonomous delivery.</p>
            </div>
          </div>
        </aside>

        <main className="p-6 lg:p-8">
          <div className="border-b border-[#ddd4c8] pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e7f67]">Exception queue</p>
            <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102b3a]">
              What needs staff attention right now?
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5f7069]">
              Human review is the exception queue. The desk only surfaces requests and messages that need confirmation, approval, or delivery closure.
            </p>
          </div>

          <section className="border-b border-[#ddd4c8] py-7">
            <div className="space-y-4">
              {attentionItems.map((item, index) => (
                <Link key={`${item.id}-${index}`} href={item.href} className="grid gap-4 border-b border-[#ddd4c8] py-5 transition hover:bg-[#fbf6ee] md:grid-cols-[auto_1fr_auto] md:items-start last:border-b-0">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#0d2b3b] font-serif text-xl text-[#d7e7b7]">{index + 1}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-[#102b3a]">{item.title}</h3>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${statusTone(item.status)}`}>{item.status}</span>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${priorityTone(item.priority)}`}>{item.priority}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#5f7069]">{item.location}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f7069]">{item.reason}</p>
                  </div>
                  <span className="rounded-full border border-[#cfc6b8] bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#102b3a]">Open</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-7 py-7 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Recently delivered / recorded</p>
              <div className="mt-4 divide-y divide-[#ddd4c8] border-y border-[#ddd4c8]">
                {recentActivity.map((item) => (
                  <Link key={item.id} href={item.href} className="block py-4 transition hover:bg-[#fbf6ee]">
                    <p className="font-bold text-[#102b3a]">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f7069]">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[#d8d1c6] bg-[#f5efe5] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Daily rule</p>
              <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#102b3a]">Work the queue, then close the file.</h3>
              <p className="mt-3 text-sm leading-7 text-[#5f7069]">
                SS should guide staff through request, responder message, review, and delivery without making them hunt through unrelated modules.
              </p>
            </div>
          </section>
        </main>

        <aside className="border-t border-[#ddd4c8] bg-[#fbf6ee] p-6 xl:border-l xl:border-t-0">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Action rail</p>
              <div className="mt-4 space-y-3">
                <Link href="/app/support-requests" className="block rounded-full bg-[#0d2b3b] px-5 py-3 text-center text-sm font-bold text-white shadow-md">Open requests</Link>
                <Link href="/app/message-review" className="block rounded-full border border-[#cfc6b8] bg-white/80 px-5 py-3 text-center text-sm font-bold text-[#102b3a]">Review messages</Link>
                <Link href="/app/delivery-workspace" className="block rounded-full border border-[#cfc6b8] bg-white/80 px-5 py-3 text-center text-sm font-bold text-[#102b3a]">Check deliveries</Link>
                <Link href="/app/audit-log" className="block rounded-full border border-[#cfc6b8] bg-white/80 px-5 py-3 text-center text-sm font-bold text-[#102b3a]">Open audit trail</Link>
              </div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Facility readiness</p>
              <div className="mt-4 divide-y divide-[#ddd4c8] border-y border-[#ddd4c8] text-sm">
                <div className="flex items-center justify-between gap-4 py-3"><span className="font-semibold text-[#102b3a]">Active responders</span><span className="text-[#5f7069]">{activeResponderCount}</span></div>
                <div className="flex items-center justify-between gap-4 py-3"><span className="font-semibold text-[#102b3a]">Rules enabled</span><span className="text-[#5f7069]">{enabledRuleCount}</span></div>
                <div className="flex items-center justify-between gap-4 py-3"><span className="font-semibold text-[#102b3a]">Audit events</span><span className="text-[#5f7069]">{auditEvents.length}</span></div>
                <div className="flex items-center justify-between gap-4 py-3"><span className="font-semibold text-[#102b3a]">Responder path</span><span className="text-[#5f7069]">{getResponderName(solaceRequests[0]?.assignedResponderId)}</span></div>
              </div>
            </section>

            <section className="rounded-[1.5rem] bg-[#0d2b3b] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9fb36b]">NS guidance applied</p>
              <p className="mt-3 text-sm leading-6 text-[#dce8e6]">
                Care Desk V2 follows the NS exception queue + daily brief + action rail pattern. It avoids KPI-first dashboard behavior.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
