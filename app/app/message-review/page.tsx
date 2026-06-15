import Link from "next/link";
import {
  getRequestById,
  getResponderById,
  solaceMessages
} from "@/lib/spiritual-solace-data";

const reviewStyles: Record<string, string> = {
  "Needs Review": "border-[#e8d9b7] bg-[#fff7df] text-[#7a5a1d]",
  Approved: "border-[#cfe2d0] bg-[#eef8ee] text-[#4f7457]",
  "Needs Edit": "border-[#ddd2ea] bg-[#f5f0fb] text-[#66547d]",
  Rejected: "border-[#e8c8c0] bg-[#fff1ee] text-[#8a4637]"
};

const reviewChecklist = [
  ["No medical advice", "The message does not offer care decisions, diagnosis, treatment direction, or clinical recommendations."],
  ["No promises", "The message does not promise healing, recovery, protection, or a specific outcome."],
  ["Matches preference", "The tone and tradition fit the request context and patient preference."],
  ["One-way comfort", "The message does not invite reply, debate, follow-up, or ongoing contact."],
  ["Facility appropriate", "The message is calm, brief, respectful, and appropriate for care-setting delivery."]
];

const currentMessage = solaceMessages.find((message) => message.status === "Needs Review") ?? solaceMessages[0];
const currentRequest = getRequestById(currentMessage.requestId);
const currentResponder = getResponderById(currentMessage.responderId);

const reviewQueue = solaceMessages.filter((message) => message.id !== currentMessage.id);

export default function MessageReviewPage() {
  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fdf9f1] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[760px] xl:grid-cols-[0.72fr_1.5fr_0.78fr]">
        <aside className="border-b border-[#ddd4c8] bg-[#f5efe5] p-6 xl:border-b-0 xl:border-r">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e7f67]">Message review</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#102b3a]">Approval desk</h1>
              <p className="mt-4 text-sm leading-7 text-[#5f7069]">
                Review submitted comfort messages against request context before one-way delivery.
              </p>
            </div>

            <div className="mt-8 border-y border-[#ddd4c8] py-5">
              <p className="text-sm font-semibold text-[#102b3a]">Currently reviewing</p>
              <p className="mt-2 text-2xl font-semibold text-[#0d2b3b]">{currentMessage.id}</p>
              <p className="mt-1 text-sm text-[#5f7069]">{currentRequest?.patientAlias ?? "Recipient"} · {currentRequest?.requestType ?? "Support"}</p>
              <span className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${reviewStyles[currentMessage.status]}`}>
                {currentMessage.status}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {reviewQueue.map((message) => {
                const request = getRequestById(message.requestId);
                return (
                  <Link key={message.id} href="/app/message-review" className="block border-b border-[#ddd4c8] py-4 transition hover:bg-[#fbf6ee]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#102b3a]">{message.id}</p>
                        <p className="mt-1 text-xs leading-5 text-[#5f7069]">{request?.patientAlias ?? "Recipient"} · {request?.requestType ?? "Support"}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${reviewStyles[message.status]}`}>{message.status}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-8">
              <Link href="/app/support-requests" className="inline-flex text-sm font-bold text-[#0d2b3b] underline underline-offset-4">← Open request file</Link>
            </div>
          </div>
        </aside>

        <main className="p-6 lg:p-8">
          <div className="border-b border-[#ddd4c8] pb-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e7f67]">Compare request and message</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102b3a]">
                  Does the message safely match the request?
                </h2>
              </div>
              <Link href="/app/audit-log" className="w-fit rounded-full border border-[#cfc6b8] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#102b3a] hover:bg-white">
                View audit
              </Link>
            </div>
          </div>

          <section className="grid gap-7 border-b border-[#ddd4c8] py-7 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Original request</p>
              <blockquote className="mt-4 font-serif text-3xl italic leading-tight text-[#263f4b]">“{currentRequest?.note ?? "Request context unavailable."}”</blockquote>
              <dl className="mt-7 space-y-4 text-sm">
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Recipient</dt>
                  <dd className="text-[#5f7069]">{currentRequest?.patientAlias ?? "Recipient"} · {currentRequest?.location ?? "Unknown location"}</dd>
                </div>
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Preference</dt>
                  <dd className="text-[#5f7069]">{currentRequest?.traditionPreference ?? "Unknown"}</dd>
                </div>
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Tone</dt>
                  <dd className="text-[#5f7069]">{currentRequest?.tonePreference ?? "Unknown"}</dd>
                </div>
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-[#e1d8cb] pb-3">
                  <dt className="font-bold text-[#102b3a]">Submitted</dt>
                  <dd className="text-[#5f7069]">{currentRequest?.submittedAt ?? "Unknown"}</dd>
                </div>
              </dl>
            </div>

            <div className="border-l-0 border-[#ddd4c8] lg:border-l lg:pl-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Responder message</p>
              <div className="mt-4 rounded-[1.6rem] bg-[#0d2b3b] p-7 text-white shadow-[0_14px_34px_rgba(13,43,59,0.18)]">
                <p className="font-serif text-3xl italic leading-10">“{currentMessage.body}”</p>
                <p className="mt-6 text-sm text-[#b8cac9]">Submitted by {currentResponder?.name ?? "Unknown responder"}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {currentMessage.safetyNotes.map((note) => (
                  <span key={note} className="rounded-full border border-[#d8d3c7] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#4f6058]">✓ {note}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-7 py-7 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Review checklist</p>
              <div className="mt-5 divide-y divide-[#ddd4c8] border-y border-[#ddd4c8]">
                {reviewChecklist.map(([title, detail]) => (
                  <div key={title} className="grid gap-2 py-4 md:grid-cols-[12rem_1fr]">
                    <p className="font-bold text-[#102b3a]">✓ {title}</p>
                    <p className="text-sm leading-6 text-[#5f7069]">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[#d8d1c6] bg-[#f5efe5] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Staff decision</p>
              <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#102b3a]">Ready to approve?</h3>
              <p className="mt-3 text-sm leading-7 text-[#5f7069]">
                Delivery remains held until staff approves. Demo buttons are visual only.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button disabled className="rounded-full bg-[#0d2b3b] px-5 py-3 text-sm font-bold text-white shadow-md">Approve delivery</button>
                <button disabled className="rounded-full border border-[#cfc6b8] bg-white/80 px-5 py-3 text-sm font-bold text-[#102b3a]">Return for revision</button>
                <button disabled className="rounded-full border border-[#e6c7c1] bg-[#fff4f1] px-5 py-3 text-sm font-bold text-[#8a4637]">Reject message</button>
              </div>
            </div>
          </section>
        </main>

        <aside className="border-t border-[#ddd4c8] bg-[#fbf6ee] p-6 xl:border-l xl:border-t-0">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Review principle</p>
              <p className="mt-4 font-serif text-2xl italic leading-9 text-[#263f4b]">
                The system prepares context. Staff makes the delivery decision.
              </p>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6e7f67]">Boundary checks</p>
              <div className="mt-4 space-y-3 text-sm text-[#5f7069]">
                <p>✓ No direct responder-to-patient conversation.</p>
                <p>✓ No patient account or public profile.</p>
                <p>✓ No autonomous delivery.</p>
                <p>✓ Decision should create an audit event.</p>
              </div>
            </section>

            <section className="rounded-[1.5rem] bg-[#0d2b3b] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9fb36b]">Workflow note</p>
              <p className="mt-3 text-sm leading-6 text-[#dce8e6]">
                Message Review now mirrors the Support Request file instead of acting like a separate table module.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
