import { PageHeader } from "@/components/PageHeader";
import { advisorIntelligenceSources } from "@/lib/advisor-intelligence-sources";

const sourceGroups = [
  "Past Awards / Payout Intelligence",
  "Evidence Intelligence",
  "Program Catalog Context",
  "Research Pattern Intelligence",
  "Internal Reference Sources",
] as const;

export default function AdvisorIntelligencePage() {
  return (
    <>
      <PageHeader eyebrow="Advisor Intelligence" title="Advisor Intelligence Sources" description="Structured source layer for recommendation quality. These sources help explain and grade opportunities but do not replace human review." />
      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">What these sources do</p>
        <p className="mt-2">These sources do not provide grants to apply for. They help the system understand funding history, need evidence, program rules, and source quality. Evidence sources help explain why a need exists and strengthen recommendation quality. USAspending.gov remains connected as a read-only public-award intelligence route for comparing similar past awards, award amounts, agencies, recipient types, and funding patterns.</p>
      </section>
      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-crcf-navy">Source groups</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{sourceGroups.map((group) => <div key={group} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{group}</div>)}</div>
      </section>
      <section className="mb-6 rounded-3xl border border-crcf-blue/20 bg-crcf-sky/60 p-5 text-sm font-semibold leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Evidence Intelligence group</p>
        <p className="mt-2">Evidence sources help explain why a need exists and strengthen recommendation quality. They are not grant application sources and do not perform submissions, outreach, emails, source-system writes, Firebase, Firestore, or database writes.</p>
        <a href="/evidence-intelligence" className="mt-3 inline-flex rounded-full bg-crcf-blue px-4 py-2 text-sm font-bold text-white">Open Evidence Intelligence</a>
      </section>
      <section className="grid gap-4">
        {advisorIntelligenceSources.map((source) => (
          <article key={source.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">{source.group}</p>
            <h2 className="mt-2 text-2xl font-bold text-crcf-navy">{source.sourceName}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Info label="Source role" value={source.sourceRole} /><Info label="Connector type" value={source.connectorType} /><Info label="Status" value={source.status} /><Info label="Confidence" value={source.confidence} /><Info label="What it teaches the system" value={source.whatItTeaches} /><Info label="How it improves recommendations" value={source.improvesRecommendationsBy} /><Info label="Human verification note" value={source.humanVerificationNote} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3"><a href={source.directSourceLink} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-crcf-blue/20 px-4 py-2 text-sm font-bold text-crcf-blue">Open direct source link</a>{source.id === "ai-usaspending" ? <a href="/past-awards" className="inline-flex rounded-full bg-crcf-blue px-4 py-2 text-sm font-bold text-white">Run public award lookup</a> : null}</div>
          </article>
        ))}
      </section>
    </>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">{value}</p></div>; }
