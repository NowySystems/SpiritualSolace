import Link from "next/link";
import {
  getRequestById,
  getResponderById,
  solaceMessages
} from "@/lib/spiritual-solace-data";

const reviewChecklist = [
  ["No medical advice", "No care decisions, diagnosis, treatment direction, or clinical recommendations."],
  ["No promises", "No promise of healing, recovery, protection, or a specific outcome."],
  ["Matches request", "Tone and tradition match the patient or family preference."],
  ["One-way comfort", "No invitation for reply, debate, follow-up, or ongoing contact."],
  ["Facility appropriate", "Calm, brief, respectful, and suitable for care-setting delivery."]
];

const currentMessage = solaceMessages.find((message) => message.status === "Needs Review") ?? solaceMessages[0];
const currentRequest = getRequestById(currentMessage.requestId);
const currentResponder = getResponderById(currentMessage.responderId);
const reviewQueue = solaceMessages.filter((message) => message.id !== currentMessage.id);

export default function MessageReviewPage() {
  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[760px] xl:grid-cols-[1.55fr_0.82fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#f0bf66] bg-[#fff7e6] shadow-[0_18px_46px_rgba(53,72,65,0.12)]">
            <div className="h-3 w-full bg-[#f59e0b]" />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#7a4a08]">Approval decision</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">
                  Should this prepared template be delivered?
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#4d6158]">
                  Staff only needs to decide whether this canned, facility-dependent response template safely matches the original request. The pilot does not support two-way conversation.
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-white/70 bg-white/65 p-5 shadow-sm lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Decision controls</p>
                <div className="mt-5 flex flex-col gap-3">
                  <button disabled className="rounded-full bg-[#92400e] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md">Approve delivery</button>
                  <button disabled className="rounded-full border border-[#cfc6b8] bg-white px-5 py-3 text-sm font-black text-[#102b3a]">Return to template</button>
                  <button disabled className="rounded-full border border-[#e6c7c1] bg-[#fff4f1] px-5 py-3 text-sm font-black text-[#8a4637]">Reject template</button>
                </div>
                <p className="mt-5 text-xs leading-5 text-[#6d6357]">Demo actions are disabled, but the approval path is now the visual center of the screen.</p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[1.6rem] border border-[#ded6ca] bg-white/70 p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Original request</p>
              <blockquote className="mt-5 font-serif text-3xl italic leading-tight text-[#263f4b]">“{currentRequest?.note ?? "Request context unavailable."}”</blockquote>
              <div className="mt-6 divide-y divide-[#e1d8cb] border-y border-[#e1d8cb] text-sm">
                <div className="grid gap-2 py-3 sm:grid-cols-[8rem_1fr]"><span className="font-bold text-[#102b3a]">Recipient</span><span className="text-[#5f7069]">{currentRequest?.patientAlias ?? "Recipient"} · {currentRequest?.location ?? "Unknown location"}</span></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[8rem_1fr]"><span className="font-bold text-[#102b3a]">Preference</span><span className="text-[#5f7069]">{currentRequest?.traditionPreference ?? "Unknown"}</span></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[8rem_1fr]"><span className="font-bold text-[#102b3a]">Tone</span><span className="text-[#5f7069]">{currentRequest?.tonePreference ?? "Unknown"}</span></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[8rem_1fr]"><span className="font-bold text-[#102b3a]">Submitted</span><span className="text-[#5f7069]">{currentRequest?.submittedAt ?? "Unknown"}</span></div>
              </div>
            </div>

            <div className="rounded-[1.6rem] bg-[#0d2b3b] p-7 text-white shadow-[0_14px_34px_rgba(13,43,59,0.18)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9fb36b]">Responder template</p>
              <p className="mt-5 font-serif text-3xl italic leading-10">“{currentMessage.body}”</p>
              <p className="mt-6 text-sm text-[#b8cac9]">Submitted by {currentResponder?.name ?? "Unknown responder"}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {currentMessage.safetyNotes.map((note) => (
                  <span key={note} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#dce8e6]">✓ {note}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[1.6rem] border border-[#ded6ca] bg-white/68 p-6">
            <div className="flex flex-col gap-2 border-b border-[#e1d8cb] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Safety checklist</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#102b3a]">Approve only if all checks pass.</h2>
              </div>
              <Link href="/app/audit-log" className="w-fit rounded-full border border-[#cfc6b8] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#102b3a]">Audit</Link>
            </div>
            <div className="divide-y divide-[#e1d8cb]">
              {reviewChecklist.map(([title, detail]) => (
                <div key={title} className="grid gap-2 py-4 md:grid-cols-[13rem_1fr]">
                  <p className="font-black text-[#102b3a]">✓ {title}</p>
                  <p className="text-sm leading-6 text-[#5f7069]">{detail}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Review queue</p>
              <div className="mt-5 border-y border-white/10 py-5">
                <p className="text-5xl font-semibold tracking-[-0.06em]">{solaceMessages.filter((message) => message.status === "Needs Review").length}</p>
                <p className="mt-1 text-sm font-semibold text-[#d7e7b7]">templates need review</p>
              </div>
              <div className="mt-4 space-y-3">
                {reviewQueue.slice(0, 4).map((message) => {
                  const request = getRequestById(message.requestId);
                  return (
                    <Link key={message.id} href="/app/message-review" className="block border-b border-white/10 pb-3 transition hover:bg-white/5">
                      <p className="font-semibold text-white">{message.id}</p>
                      <p className="mt-1 text-xs leading-5 text-[#b8cac9]">{request?.patientAlias ?? "Recipient"} · {request?.requestType ?? "Support"}</p>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Boundary principle</p>
              <p className="mt-4 font-serif text-2xl italic leading-9 text-[#dce8e6]">
                The system prepares a one-way template. Staff makes the facility-dependent delivery decision.
              </p>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9fb36b]">Experiment</p>
              <p className="mt-3 text-sm leading-6 text-[#dce8e6]">
                Template Review follows the same NS pattern as Care Desk V4: one dominant human decision with supporting context below, without chat or messaging infrastructure.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
