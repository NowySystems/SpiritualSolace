import Link from "next/link";
import { getResponderName, solaceRequests } from "@/lib/spiritual-solace-data";

const request =
  solaceRequests.find((item) => item.status === "New" || item.status === "Intake Review") ??
  solaceRequests.find((item) => item.priority === "Time Sensitive") ??
  solaceRequests[0];

const checks = [
  ["Permission", request.consentConfirmed ? "Confirmed" : "Needs confirmation"],
  ["Preference", request.traditionPreference],
  ["Tone", request.tonePreference],
  ["Language", request.language],
  ["Suggested path", getResponderName(request.assignedResponderId)]
];

export default function IntakeDecisionPage() {
  return (
    <div className="overflow-hidden rounded-[2.1rem] border border-[#d8d1c6] bg-[#fbf7ee] shadow-[0_22px_60px_rgba(53,72,65,0.10)]">
      <div className="grid min-h-[720px] xl:grid-cols-[1.55fr_0.82fr]">
        <main className="p-6 lg:p-8 xl:p-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#9ec1f3] bg-[#edf5ff] shadow-[0_18px_46px_rgba(53,72,65,0.12)]">
            <div className="h-3 w-full bg-[#2563eb]" />
            <div className="grid gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-9">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#214f91]">Intake decision</p>
                <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#102b3a] lg:text-6xl">Is this request ready to move forward?</h1>
                <p className="mt-8 text-xl font-semibold text-[#263f4b]">{request.requestType} · {request.location}</p>
                <blockquote className="mt-6 max-w-3xl border-l-4 border-[#2563eb]/35 pl-5 font-serif text-2xl italic leading-9 text-[#263f4b]">“{request.note}”</blockquote>
              </div>
              <div className="rounded-[1.4rem] border border-white/70 bg-white/70 p-5 shadow-sm lg:w-72">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6e7f67]">Decision control</p>
                <p className="mt-4 rounded-full border border-[#9ec1f3] bg-[#edf5ff] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#214f91]">Ready for match</p>
                <p className="mt-5 text-sm leading-6 text-[#5f7069]">Move forward only when permission, preference, tone, and language are clear enough for responder matching.</p>
                <Link href="/app/match" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#1d4ed8] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md hover:bg-[#1e40af]">Continue to match →</Link>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[1.6rem] border border-[#ded6ca] bg-white/70 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e7f67]">Readiness checks</p>
            <div className="mt-5 divide-y divide-[#e1d8cb] border-y border-[#e1d8cb]">
              {checks.map(([label, value]) => (
                <div key={label} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr]"><p className="font-black text-[#102b3a]">✓ {label}</p><p className="text-sm leading-6 text-[#5f7069]">{value}</p></div>
              ))}
            </div>
          </section>
        </main>
        <aside className="border-t border-[#ddd4c8] bg-[#0d2b3b] p-6 text-white xl:border-l xl:border-t-0 xl:border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb36b]">Stage</p>
          <p className="mt-4 text-sm leading-6 text-[#dce8e6]">Intake is now its own clean decision route. The old Support Requests screen can be retired after validation.</p>
        </aside>
      </div>
    </div>
  );
}
