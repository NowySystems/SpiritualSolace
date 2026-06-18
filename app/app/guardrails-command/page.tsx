import Link from "next/link";
import { facilityRules, solaceMessages } from "@/lib/spiritual-solace-data";

const message = solaceMessages.find((item) => item.status === "Needs Review") ?? solaceMessages[0];

const stopReasons = [
  ["Outside scope", "The content asks a responder to do more than one-way support."],
  ["Advice risk", "The content sounds like instruction instead of comfort."],
  ["Promise risk", "The content suggests a guaranteed result."],
  ["Rule conflict", "The content conflicts with an enabled facility rule."],
];

export default function GuardrailsCommandPage() {
  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[720px] xl:grid-cols-[1.55fr_0.82fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#efb4aa] bg-[#fff1ee] shadow-[0_18px_46px_rgba(53,72,65,0.12)]">
            <div className="h-3 w-full bg-[#dc2626]" />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a2f22]">Guardrails command</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">Why should this be stopped?</h1>
                <blockquote className="mt-8 max-w-3xl border-l-4 border-[#dc2626]/35 pl-5 font-serif text-2xl italic leading-9 text-[#263f4b]">“{message.body}”</blockquote>
              </div>
              <div className="rounded-[1.4rem] border border-white/70 bg-white/70 p-5 shadow-sm lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Decision support</p>
                <p className="mt-5 text-sm leading-6 text-[#5f7069]">Use this only when Review needs a reason to stop, revise, or escalate a message.</p>
                <Link href="/app/message-review" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#b91c1c] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md hover:bg-[#991b1b]">Return to review →</Link>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[1.6rem] border border-[#ded6ca] bg-white/70 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Stop reasons</p>
            <div className="mt-5 divide-y divide-[#e1d8cb] border-y border-[#e1d8cb]">
              {stopReasons.map(([label, note]) => (
                <div key={label} className="grid gap-3 py-4 sm:grid-cols-[12rem_1fr]"><p className="font-black text-[#102b3a]">{label}</p><p className="text-sm leading-6 text-[#5f7069]">{note}</p></div>
              ))}
            </div>
          </section>
        </main>
        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Rules loaded</p>
          <p className="mt-4 text-sm leading-6 text-[#dce8e6]">{facilityRules.filter((rule) => rule.status === "Enabled").length} enabled rules can support this decision.</p>
        </aside>
      </div>
    </div>
  );
}
