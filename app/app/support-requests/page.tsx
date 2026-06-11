import Link from "next/link";
import {
  getResponderName,
  messageTypes,
  solaceMessages,
  solaceRequests,
  traditionPreferences
} from "@/lib/spiritual-solace-data";

const statusStyles: Record<string, string> = {
  "New": "border-[#d9d6c9] bg-[#f8f5ed] text-[#596961]",
  "Intake Review": "border-[#e8d9b7] bg-[#fff7df] text-[#7a5a1d]",
  "Routed": "border-[#cfdceb] bg-[#edf5ff] text-[#405c7d]",
  "Message Review": "border-[#ddd2ea] bg-[#f5f0fb] text-[#66547d]",
  "Delivered": "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  "Expired": "border-[#ddd7d0] bg-[#f2f0ed] text-[#6a665f]"
};

const priorityStyles: Record<string, string> = {
  "Routine": "border-[#d8d3c7] bg-white/70 text-[#61706a]",
  "Soon": "border-[#e2d6b9] bg-[#fff9e8] text-[#735d2a]",
  "Time Sensitive": "border-[#e8c8c0] bg-[#fff1ee] text-[#8a4637]"
};

const currentRequest = solaceRequests.find((request) => request.status === "Message Review") ?? solaceRequests[0];
const currentMessage = solaceMessages.find((message) => message.requestId === currentRequest.id) ?? solaceMessages[0];

const workflow = [
  ["Request", "Received", "Patient or family asked for solace."],
  ["Intake", "Confirmed", "Consent, preference, tone, and language checked."],
  ["Responder", "Assigned", getResponderName(currentRequest.assignedResponderId)],
  ["Message", currentMessage?.status ?? "Waiting", "Responder message is ready for staff review."],
  ["Delivery", currentRequest.status === "Delivered" ? "Complete" : "Pending", "Delivery waits for staff approval."]
];

export default function SupportRequestsPage() {
  const queue = solaceRequests.filter((request) => request.id !== currentRequest.id);

  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fdf9f1] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[780px] xl:grid-cols-[0.74fr_1.42fr_0.84fr]">
        <aside className="border-b border-[#ddd4c8] bg-[#f5efe5] p-6 xl:border-b-0 xl:border-r">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e7f67]">Needs attention</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#102b3a]">Request queue</h1>
              <p className="mt-4 text-sm leading-7 text-[#5f7069]">Open the next request, verify the human context, and move it through review without jumping between modules.</p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="border-y border-[#ddd4c8] py-4">
                <p className="text-sm font-semibold text-[#102b3a]">Currently reviewing</p>
                <p className="mt-2 text-2xl font-semibold text-[#0d2b3b]">{currentRequest.patientAlias}</p>
                <p className="mt-1 text-sm text-[#5f7069]">{currentRequest.location}</p>
              </div>

              {queue.map((request) => (
                <Link key={request.id} href="/app/support-requests" className="block border-b border-[#ddd4c8] py-4 transition hover:bg-[#fbf6ee]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#102b3a]">{request.patientAlias} · {request.requestType}</p>
                      <p className="mt-1 text-xs leading-5 text-[#5f7069]">{request.location}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${priorityStyles[request.priority]}`}>{request.priority}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5f7069]">{request.note}</p>
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Link href="/app" className="inline-flex text-sm font-bold text-[#0d2b3b] underline underline-offset-4">← Return to care desk</Link>
            </div>
          </div>
        </aside>

        <main className="p-6 lg:p-8">
          <div className="border-b border-[#ddd4c8] pb-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e7f67]">Active solace file</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102b3a]">
                  {currentRequest.requestType} · {currentRequest.location}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${statusStyles[currentRequest.status]}`}>{currentRequest.status}</span>
                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${priorityStyles[currentRequest.priority]}`}>{currentRequest.priority}</span>
              </div>
            </div>
          </div>

          <section className="grid gap-7 border-b border-[#ddd4c8] py-7 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Request context</p>
              <blockquote className="mt-4 font-serif text-3xl italic leading-tight text-[#263f4b]">“{currentRequest.note}”</blockquote>
              <dl className="mt-7 space-y-4 text-sm">
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Preference</dt>
                  <dd className="text-[#5f7069]">{currentRequest.traditionPreference}</dd>
                </div>
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Tone</dt>
                  <dd className="text-[#5f7069]">{currentRequest.tonePreference}</dd>
                </div>
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Language</dt>
                  <dd className="text-[#5f7069]">{currentRequest.language}</dd>
                </div>
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Consent</dt>
                  <dd className="text-[#5f7069]">{currentRequest.consentConfirmed ? "Confirmed" : "Needs confirmation"}</dd>
                </div>
              </dl>
            </div>

            <div className="border-l-0 border-[#ddd4c8] lg:border-l lg:pl-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Responder message</p>
              <div className="mt-4 rounded-[1.5rem] bg-[#0d2b3b] p-6 text-white shadow-[0_14px_34px_rgba(13,43,59,0.18)]">
                <p className="font-serif text-2xl italic leading-9">“{currentMessage?.body ?? "A responder message has not been submitted yet."}”</p>
                <p className="mt-5 text-sm text-[#b8cac9]">Submitted by {getResponderName(currentMessage?.responderId ?? currentRequest.assignedResponderId)}</p>
              </div>
              <div className="mt-5 space-y-2">
                {(currentMessage?.safetyNotes ?? ["Awaiting message"] ).map((note) => (
                  <div key={note} className="flex gap-3 border-b border-[#e1d8cb] pb-2 text-sm text-[#5f7069]"><span className="font-bold text-[#71925a]">✓</span>{note}</div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Staff decision</p>
            <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <h3 className="font-serif text-3xl font-semibold text-[#102b3a]">Does this message safely match the request?</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f7069]">Approve only when the message matches the requested tone, contains no medical advice, makes no outcome promises, and remains one-way comfort.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button className="rounded-full bg-[#0d2b3b] px-5 py-3 text-sm font-bold text-white shadow-md">Approve delivery</button>
                <button className="rounded-full border border-[#cfc6b8] bg-white/80 px-5 py-3 text-sm font-bold text-[#102b3a]">Return for revision</button>
                <button className="rounded-full border border-[#e6c7c1] bg-[#fff4f1] px-5 py-3 text-sm font-bold text-[#8a4637]">Reject message</button>
              </div>
            </div>
          </section>
        </main>

        <aside className="border-t border-[#ddd4c8] bg-[#fbf6ee] p-6 xl:border-l xl:border-t-0">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Case timeline</p>
              <ol className="mt-5 space-y-0 border-l border-[#cfc6b8]">
                {workflow.map(([label, status, note]) => (
                  <li key={label} className="relative pb-6 pl-5 last:pb-0">
                    <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#71925a] ring-4 ring-[#fbf6ee]" />
                    <p className="text-sm font-bold text-[#102b3a]">{label}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#71925a]">{status}</p>
                    <p className="mt-1 text-xs leading-5 text-[#5f7069]">{note}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Allowed support</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {messageTypes.map((type) => (
                  <span key={type} className="rounded-full border border-[#d8d3c7] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#4f6058]">{type}</span>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Tradition options</p>
              <p className="mt-3 text-sm leading-6 text-[#5f7069]">{traditionPreferences.slice(0, 5).join(" · ")}</p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
