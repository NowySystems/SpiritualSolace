import Link from "next/link";
import {
  approvedResponders,
  auditEvents,
  facilityRules,
  getResponderName,
  solaceMessages,
  solaceRequests
} from "@/lib/spiritual-solace-data";

const currentRequest =
  solaceRequests.find((request) => request.priority === "Time Sensitive") ?? solaceRequests[0];

const currentMessage = solaceMessages.find((message) => message.requestId === currentRequest.id) ?? solaceMessages[0];

const requestLanes = [
  {
    label: "Waiting for intake",
    value: solaceRequests.filter((request) => request.status === "New" || request.status === "Intake Review").length,
    note: "Confirm consent, preference, tone, and route."
  },
  {
    label: "Message needs review",
    value: solaceMessages.filter((message) => message.status === "Needs Review").length,
    note: "Check safety boundaries before delivery."
  },
  {
    label: "Ready or delivered",
    value: solaceRequests.filter((request) => request.status === "Delivered" || request.status === "Routed").length,
    note: "Requests with a responder path in motion."
  }
];

const governanceLines = [
  ["Human review", "Required"],
  ["Direct messaging", "Disabled"],
  ["Patient login", "Disabled"],
  ["Audit trail", "Enabled"]
];

function statusTone(status: string) {
  if (status.includes("Review") || status === "New") return "bg-[#f7e8d5] text-[#8a5521] border-[#ebceb0]";
  if (status === "Delivered" || status === "Approved") return "bg-[#e4eddf] text-[#587244] border-[#cbdcbe]";
  return "bg-[#e8edf1] text-[#516476] border-[#d1dbe0]";
}

export default function DashboardPage() {
  const activeResponderCount = approvedResponders.filter((responder) => responder.status === "Active").length;
  const enabledRuleCount = facilityRules.filter((rule) => rule.status === "Enabled").length;

  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border border-[#d8d1c6] bg-[#fdf9f1] shadow-[0_24px_70px_rgba(53,72,65,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(140,164,119,0.16),transparent_26%),radial-gradient(circle_at_82%_0%,rgba(13,43,59,0.10),transparent_28%)]" />

      <div className="relative grid min-h-[760px] xl:grid-cols-[0.82fr_1.35fr_0.78fr]">
        <aside className="border-b border-[#e1d9cb] bg-[#0d2b3b] p-6 text-white xl:border-b-0 xl:border-r xl:border-white/10">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9fb36b]">Care desk</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">Good afternoon.</h2>
              <p className="mt-4 text-sm leading-7 text-[#dce8e6]">
                Today’s work is organized around people waiting for reviewed comfort, not metrics.
              </p>
            </div>

            <div className="mt-9 space-y-5">
              <div className="border-y border-white/12 py-6">
                <p className="text-6xl font-semibold tracking-[-0.06em] text-white">{requestLanes.reduce((sum, lane) => sum + lane.value, 0)}</p>
                <p className="mt-2 text-sm font-semibold text-[#d7e7b7]">items need staff awareness</p>
              </div>

              <div className="space-y-4">
                {requestLanes.map((lane) => (
                  <div key={lane.label} className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 pb-4 last:border-b-0">
                    <span className="font-serif text-3xl text-[#d7e7b7]">{lane.value}</span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{lane.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#b8cac9]">{lane.note}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link href="/app/support-requests" className="inline-flex w-full justify-center rounded-full bg-[#9fb36b] px-5 py-3 text-sm font-bold text-[#0d2b3b] shadow-lg hover:bg-[#b4c67f]">
                Begin next review →
              </Link>
              <p className="mt-4 text-xs leading-5 text-[#b8cac9]">No outreach, no public messaging, and no external action happens from this demo.</p>
            </div>
          </div>
        </aside>

        <main className="p-6 lg:p-8">
          <div className="flex flex-col gap-3 border-b border-[#ddd4c8] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e7f67]">Active request file</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.035em] text-[#102b3a]">
                {currentRequest.requestType} for {currentRequest.location}
              </h1>
            </div>
            <span className={`w-fit rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${statusTone(currentRequest.status)}`}>
              {currentRequest.status}
            </span>
          </div>

          <section className="grid gap-6 border-b border-[#ddd4c8] py-7 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e7f67]">Patient request</p>
              <blockquote className="mt-4 font-serif text-3xl italic leading-tight text-[#263f4b]">
                “{currentRequest.note}”
              </blockquote>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-[#102b3a]">Preference</dt>
                  <dd className="mt-1 text-[#5f7069]">{currentRequest.traditionPreference} · {currentRequest.tonePreference}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#102b3a]">Language</dt>
                  <dd className="mt-1 text-[#5f7069]">{currentRequest.language}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#102b3a]">Submitted</dt>
                  <dd className="mt-1 text-[#5f7069]">{currentRequest.submittedAt}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#102b3a]">Responder</dt>
                  <dd className="mt-1 text-[#5f7069]">{getResponderName(currentRequest.assignedResponderId)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[1.7rem] border border-[#ded6ca] bg-[#f5efe5] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e7f67]">Prepared message</p>
              <p className="mt-4 font-serif text-2xl italic leading-9 text-[#263f4b]">
                “{currentMessage?.body ?? "A comfort message will appear here once a responder submits it."}”
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(currentMessage?.safetyNotes ?? ["Awaiting responder message"]).map((note) => (
                  <span key={note} className="rounded-full border border-[#d7ccbd] bg-white/70 px-3 py-1 text-xs font-semibold text-[#5f7069]">✓ {note}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 py-7 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e7f67]">Review decision</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#102b3a]">What should staff do next?</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f7069]">
                This desk is designed around the next safe human decision, not around a dashboard of totals.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/app/message-review" className="rounded-full bg-[#0d2b3b] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#173f53]">
                  Review message
                </Link>
                <Link href="/app/approved-responders" className="rounded-full border border-[#cfc6b8] bg-white/70 px-5 py-3 text-sm font-bold text-[#102b3a] hover:bg-white">
                  Check responder
                </Link>
                <Link href="/app/facility-rules" className="rounded-full border border-[#cfc6b8] bg-white/70 px-5 py-3 text-sm font-bold text-[#102b3a] hover:bg-white">
                  View rules
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {solaceRequests.map((request) => (
                <Link key={request.id} href="/app/support-requests" className="grid gap-3 border-b border-[#ded6ca] py-4 transition hover:bg-[#fbf6ee] sm:grid-cols-[1fr_auto]">
                  <span>
                    <span className="block font-semibold text-[#102b3a]">{request.patientAlias} · {request.requestType}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#5f7069]">{request.location} · {request.note}</span>
                  </span>
                  <span className={`h-fit rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${statusTone(request.status)}`}>{request.priority}</span>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside className="border-t border-[#e1d9cb] bg-[#f5efe5] p-6 xl:border-l xl:border-t-0">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Governance status</p>
              <div className="mt-4 divide-y divide-[#ded6ca] border-y border-[#ded6ca]">
                {governanceLines.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="font-semibold text-[#102b3a]">{label}</span>
                    <span className="text-[#5f7069]">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Facility readiness</p>
              <div className="mt-4 space-y-4 text-sm text-[#5f7069]">
                <p><span className="font-semibold text-[#102b3a]">{activeResponderCount}</span> active responder groups available.</p>
                <p><span className="font-semibold text-[#102b3a]">{enabledRuleCount}</span> facility rules enabled.</p>
                <p><span className="font-semibold text-[#102b3a]">{auditEvents.length}</span> audit events recorded today.</p>
              </div>
            </section>

            <section className="rounded-[1.5rem] bg-[#0d2b3b] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9fb36b]">NowySystems note</p>
              <p className="mt-3 text-sm leading-6 text-[#dce8e6]">
                This screen explores a care-desk pattern: one active file, visible safeguards, and a clear next human decision.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
