import Link from "next/link";
import { facilityRules } from "@/lib/spiritual-solace-data";

const enabled = facilityRules.filter((rule) => rule.status === "Enabled");
const draft = facilityRules.filter((rule) => rule.status === "Draft");

export default function RulesCommandPage() {
  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[720px] xl:grid-cols-[1.55fr_0.82fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#f0bf66] bg-[#fff7e6] shadow-[0_18px_46px_rgba(53,72,65,0.12)]">
            <div className="h-3 w-full bg-[#f59e0b]" />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#7a4a08]">Rules command</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">What is allowed before delivery?</h1>
                <p className="mt-8 max-w-2xl text-base leading-8 text-[#4d6158]">Rules should support the Review and Delivery decisions. This screen keeps policy visible but operational.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/70 bg-white/70 p-5 shadow-sm lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Rule state</p>
                <p className="mt-4 rounded-full border border-[#f0bf66] bg-[#fff7e6] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#7a4a08]">{enabled.length} enabled</p>
                <p className="mt-5 text-sm leading-6 text-[#5f7069]">If a message conflicts with an enabled rule, it should not be delivered.</p>
                <Link href="/app/message-review" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#92400e] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md hover:bg-[#78350f]">Return to review →</Link>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[1.6rem] border border-[#ded6ca] bg-white/70 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Enabled delivery rules</p>
            <div className="mt-5 divide-y divide-[#e1d8cb] border-y border-[#e1d8cb]">
              {enabled.map((rule) => (
                <div key={rule.id} className="py-4"><p className="font-semibold text-[#102b3a]">{rule.name}</p><p className="mt-1 text-sm leading-6 text-[#5f7069]">{rule.rule}</p></div>
              ))}
            </div>
          </section>
        </main>
        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Safety support</p>
          <div className="mt-5 space-y-3 text-sm text-[#dce8e6]"><p>Enabled rules: {enabled.length}</p><p>Draft rules: {draft.length}</p><p>Used by: Review and Delivery</p></div>
          <p className="mt-6 text-sm leading-6 text-[#dce8e6]">Rules stay out of the main workflow unless they help staff decide if delivery is allowed.</p>
        </aside>
      </div>
    </div>
  );
}
