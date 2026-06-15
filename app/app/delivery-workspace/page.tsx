import Link from "next/link";
import {
  auditEvents,
  getRequestById,
  getResponderById,
  solaceMessages,
  solaceRequests
} from "@/lib/spiritual-solace-data";

const deliveredRequest = solaceRequests.find((request) => request.status === "Delivered") ?? solaceRequests[0];
const deliveredMessage = solaceMessages.find((message) => message.requestId === deliveredRequest.id) ?? solaceMessages[0];
const responder = getResponderById(deliveredMessage.responderId ?? deliveredRequest.assignedResponderId ?? "");

const deliveryFacts = [
  ["Recipient", `${deliveredRequest.patientAlias} · ${deliveredRequest.location}`],
  ["Request", `${deliveredRequest.requestType} · ${deliveredRequest.traditionPreference}`],
  ["Responder", responder?.name ?? "Approved responder"],
  ["Review", deliveredMessage.reviewedBy ?? "Staff Review"],
  ["Delivery", deliveredRequest.status === "Delivered" ? "Complete" : "Pending"],
  ["Channel", "Facility-controlled one-way delivery"]
];

const lifecycle = [
  ["Request received", deliveredRequest.submittedAt, "Consent and preference captured."],
  ["Responder matched", "Today · 8:48 AM", responder?.name ?? "Approved responder selected."],
  ["Message submitted", deliveredMessage.submittedAt, "Responder submitted one-way comfort language."],
  ["Staff approved", "Today · 9:01 AM", "Message reviewed for tone, safety, and request fit."],
  ["Delivered", "Today · 9:02 AM", "Comfort message made available through facility-controlled delivery."]
];

export default function DeliveryWorkspacePage() {
  const relatedAudit = auditEvents.filter((event) =>
    event.target === deliveredRequest.id || event.target === deliveredMessage.id
  );

  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fdf9f1] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[760px] xl:grid-cols-[0.78fr_1.44fr_0.78fr]">
        <aside className="border-b border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-b-0 xl:border-r xl:border-white/10">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fb36b]">Delivery workspace</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.03em]">Completed solace file</h1>
              <p className="mt-4 text-sm leading-7 text-[#dce8e6]">
                The end of the workflow should feel like a closed care file, not a generic history table.
              </p>
            </div>

            <div className="mt-8 border-y border-white/12 py-6">
              <p className="text-sm font-semibold text-[#d7e7b7]">Delivered message</p>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.06em]">9:02</p>
              <p className="mt-2 text-sm text-[#b8cac9]">Today · one-way delivery complete</p>
            </div>

            <div className="mt-6 space-y-4">
              {solaceRequests.map((request) => (
                <Link key={request.id} href="/app/delivery-workspace" className="block border-b border-white/10 pb-4 transition hover:bg-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{request.patientAlias}</p>
                      <p className="mt-1 text-xs leading-5 text-[#b8cac9]">{request.requestType} · {request.status}</p>
                    </div>
                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#d7e7b7]">{request.priority}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Link href="/app/message-review" className="inline-flex text-sm font-bold text-[#d7e7b7] underline underline-offset-4">← Return to message review</Link>
            </div>
          </div>
        </aside>

        <main className="p-6 lg:p-8">
          <div className="border-b border-[#ddd4c8] pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e7f67]">Delivery record</p>
            <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102b3a]">
              {deliveredRequest.requestType} delivered to {deliveredRequest.location}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5f7069]">
              This screen documents what was sent, why it was safe to send, who reviewed it, and what was recorded.
            </p>
          </div>

          <section className="grid gap-7 border-b border-[#ddd4c8] py-7 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Delivered comfort</p>
              <div className="mt-4 rounded-[1.6rem] bg-[#0d2b3b] p-7 text-white shadow-[0_14px_34px_rgba(13,43,59,0.18)]">
                <p className="font-serif text-3xl italic leading-10">“{deliveredMessage.body}”</p>
                <p className="mt-6 text-sm text-[#b8cac9]">Delivered after staff review · one-way temporary message</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Delivery facts</p>
              <div className="mt-4 divide-y divide-[#ddd4c8] border-y border-[#ddd4c8]">
                {deliveryFacts.map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-4 md:grid-cols-[10rem_1fr]">
                    <p className="font-bold text-[#102b3a]">{label}</p>
                    <p className="text-sm leading-6 text-[#5f7069]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-7 py-7 lg:grid-cols-[1fr_0.84fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Case lifecycle</p>
              <ol className="mt-5 space-y-0 border-l border-[#cfc6b8]">
                {lifecycle.map(([label, time, note]) => (
                  <li key={label} className="relative pb-6 pl-5 last:pb-0">
                    <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#71925a] ring-4 ring-[#fdf9f1]" />
                    <p className="font-bold text-[#102b3a]">{label}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#71925a]">{time}</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f7069]">{note}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[1.6rem] border border-[#d8d1c6] bg-[#f5efe5] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Closure note</p>
              <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#102b3a]">Ready to archive.</h3>
              <p className="mt-3 text-sm leading-7 text-[#5f7069]">
                Once delivered, the file becomes a record of consent, responder routing, message review, delivery, and audit visibility.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button disabled className="rounded-full bg-[#0d2b3b] px-5 py-3 text-sm font-bold text-white shadow-md">Archive file</button>
                <Link href="/app/audit-log" className="rounded-full border border-[#cfc6b8] bg-white/80 px-5 py-3 text-center text-sm font-bold text-[#102b3a]">Open audit trail</Link>
              </div>
            </div>
          </section>
        </main>

        <aside className="border-t border-[#ddd4c8] bg-[#fbf6ee] p-6 xl:border-l xl:border-t-0">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Audit evidence</p>
              <div className="mt-4 space-y-4">
                {(relatedAudit.length ? relatedAudit : auditEvents).map((event) => (
                  <div key={event.id} className="border-b border-[#ddd4c8] pb-4">
                    <p className="text-sm font-bold text-[#102b3a]">{event.action}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#71925a]">{event.timestamp}</p>
                    <p className="mt-1 text-xs leading-5 text-[#5f7069]">{event.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Delivery boundaries</p>
              <div className="mt-4 space-y-3 text-sm text-[#5f7069]">
                <p>✓ One-way message only.</p>
                <p>✓ No reply path opened.</p>
                <p>✓ No patient account required.</p>
                <p>✓ Staff review remains visible.</p>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
