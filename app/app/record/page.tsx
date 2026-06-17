import Link from "next/link";
import { auditEvents, solaceMessages, solaceRequests } from "@/lib/spiritual-solace-data";

const request = solaceRequests.find((item) => item.status === "Delivered") ?? solaceRequests[0];
const message = solaceMessages.find((item) => item.requestId === request.id) ?? solaceMessages[0];
const events = auditEvents.filter((event) => event.target === request.id || event.target === message.id);

const checks = [
  ["Request captured", request.submittedAt],
  ["Message reviewed", message.reviewedBy ?? "Staff Review"],
  ["Delivery status", request.status],
  ["Audit entries", `${events.length || auditEvents.length} visible`]
];

export default function RecordClosurePage() {
  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[720px] xl:grid-cols-[1.55fr_0.82fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#c7b6e5] bg-[#f5f0fb] shadow-[0_18px_46px_rgba(53,72,65,0.12)]">
            <div className="h-3 w-full bg-[#7c3aed]" />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5b3a89]">Record closure</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">Is this file complete?</h1>
                <p className="mt-8 text-xl font-semibold text-[#263f4b]">{request.requestType} · {request.location}</p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#4d6158]">A file is complete when the request, message, review state, delivery state, and audit events are visible in one place.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/70 bg-white/70 p-5 shadow-sm lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Closure state</p>
                <p className="mt-4 rounded-full border border-[#c7b6e5] bg-[#f5f0fb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#5b3a89]">Ready to close</p>
                <div className="mt-8 flex flex-col gap-3">
                  <Link href="/app/audit-log" className="inline-flex w-full justify-center rounded-full bg-[#6d28d9] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md hover:bg-[#5b21b6]">Open audit →</Link>
                  <Link href="/app" className="inline-flex w-full justify-center rounded-full border border-[#c7b6e5] bg-white px-6 py-3 text-sm font-black text-[#5b3a89]">Return to desk</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[1.6rem] border border-[#ded6ca] bg-white/70 p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Closure checks</p>
              <div className="mt-5 divide-y divide-[#e1d8cb] border-y border-[#e1d8cb]">
                {checks.map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr]"><p className="font-black text-[#102b3a]">✓ {label}</p><p className="text-sm leading-6 text-[#5f7069]">{value}</p></div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-[#ded6ca] bg-white/68 p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Visible record</p>
              <blockquote className="mt-5 font-serif text-2xl italic leading-9 text-[#263f4b]">“{message.body}”</blockquote>
            </div>
          </section>
        </main>
        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Stage</p>
          <p className="mt-4 text-sm leading-6 text-[#dce8e6]">Record closure gives the workflow a visible endpoint instead of ending at a delivery screen.</p>
          <div className="mt-6 space-y-3 text-sm text-[#dce8e6]"><p>1. Verify visible record</p><p>2. Open audit if needed</p><p>3. Return to Care Desk</p></div>
        </aside>
      </div>
    </div>
  );
}
