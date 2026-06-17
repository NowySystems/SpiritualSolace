import Link from "next/link";
import { approvedResponders, solaceRequests } from "@/lib/spiritual-solace-data";

const request = solaceRequests.find((item) => item.status === "Routed") ?? solaceRequests[0];
const responders = approvedResponders.map((responder) => ({
  responder,
  score: [
    responder.messageTypes.includes(request.requestType),
    responder.languages.includes(request.language),
    responder.status === "Active"
  ].filter(Boolean).length
})).sort((a, b) => b.score - a.score);
const best = responders[0];

export default function MatchWorkspacePage() {
  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[720px] xl:grid-cols-[1.55fr_0.82fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#9ec1f3] bg-[#edf5ff] shadow-[0_18px_46px_rgba(53,72,65,0.12)]">
            <div className="h-3 w-full bg-[#2563eb]" />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#214f91]">Match decision</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">Which responder fits this request?</h1>
                <p className="mt-8 text-xl font-semibold text-[#263f4b]">{request.requestType} · {request.location}</p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#4d6158]">{request.note}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/70 bg-white/70 p-5 shadow-sm lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Best fit</p>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#102b3a]">{best.responder.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#5f7069]">{best.responder.organization}</p>
                <p className="mt-4 rounded-full border border-[#9ec1f3] bg-[#edf5ff] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#214f91]">Fit {best.score}/3</p>
                <Link href="/app/message-review" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#1d4ed8] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md hover:bg-[#1e40af]">Continue to review →</Link>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[1.6rem] border border-[#ded6ca] bg-white/70 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Responder options</p>
            <div className="mt-5 divide-y divide-[#e1d8cb] border-y border-[#e1d8cb]">
              {responders.map(({ responder, score }) => (
                <div key={responder.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div><p className="font-semibold text-[#102b3a]">{responder.name}</p><p className="mt-1 text-sm text-[#5f7069]">{responder.tradition} · {responder.status}</p></div>
                  <span className="w-fit rounded-full border border-[#9ec1f3] bg-[#edf5ff] px-4 py-2 text-xs font-black text-[#214f91]">{score}/3</span>
                </div>
              ))}
            </div>
          </section>
        </main>
        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Experiment</p>
          <p className="mt-4 text-sm leading-6 text-[#dce8e6]">Match is now a visible workflow stage between intake and message review.</p>
        </aside>
      </div>
    </div>
  );
}
