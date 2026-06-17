import Link from "next/link";
import { approvedResponders, solaceRequests } from "@/lib/spiritual-solace-data";

const active = approvedResponders.filter((r) => r.status === "Active");
const limited = approvedResponders.filter((r) => r.status === "Limited");
const nextRequest = solaceRequests.find((r) => r.status === "Routed") ?? solaceRequests[0];

function fitScore(responderId: string) {
  const responder = approvedResponders.find((item) => item.id === responderId);
  if (!responder) return 0;
  return [
    responder.status === "Active",
    responder.messageTypes.includes(nextRequest.requestType),
    responder.languages.includes(nextRequest.language),
    responder.reviewRequired
  ].filter(Boolean).length;
}

export default function MatchSupportPage() {
  const ranked = approvedResponders
    .map((responder) => ({ responder, score: fitScore(responder.id) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[720px] xl:grid-cols-[1.55fr_0.82fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#9ec1f3] bg-[#edf5ff] shadow-[0_18px_46px_rgba(53,72,65,0.12)]">
            <div className="h-3 w-full bg-[#2563eb]" />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#214f91]">Match support</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">Can we safely route the next request?</h1>
                <p className="mt-8 text-xl font-semibold text-[#263f4b]">{nextRequest.requestType} · {nextRequest.location}</p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#4d6158]">This screen supports the Match Workspace. It answers whether responder coverage is ready before staff assign a request.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/70 bg-white/70 p-5 shadow-sm lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Coverage state</p>
                <p className="mt-4 rounded-full border border-[#9ec1f3] bg-[#edf5ff] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#214f91]">{active.length} active</p>
                <p className="mt-5 text-sm leading-6 text-[#5f7069]">Use this when Match needs responder evidence, not during normal request work.</p>
                <Link href="/app/match" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#1d4ed8] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md hover:bg-[#1e40af]">Return to match →</Link>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[1.6rem] border border-[#ded6ca] bg-white/70 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Responder readiness</p>
            <div className="mt-5 divide-y divide-[#e1d8cb] border-y border-[#e1d8cb]">
              {ranked.map(({ responder, score }) => (
                <div key={responder.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div><p className="font-semibold text-[#102b3a]">{responder.name}</p><p className="mt-1 text-sm text-[#5f7069]">{responder.tradition} · {responder.status} · {responder.languages.join(", ")}</p></div>
                  <span className="w-fit rounded-full border border-[#9ec1f3] bg-[#edf5ff] px-4 py-2 text-xs font-black text-[#214f91]">{score}/4 ready</span>
                </div>
              ))}
            </div>
          </section>
        </main>
        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Admin support</p>
          <div className="mt-5 space-y-3 text-sm text-[#dce8e6]"><p>Active responders: {active.length}</p><p>Limited responders: {limited.length}</p><p>Total approved groups: {approvedResponders.length}</p></div>
          <p className="mt-6 text-sm leading-6 text-[#dce8e6]">This route keeps heavy responder administration out of the main workflow while still supporting Match.</p>
        </aside>
      </div>
    </div>
  );
}
