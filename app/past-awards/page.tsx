import { PageHeader } from "@/components/PageHeader";
import { UsaSpendingAwardLookup } from "@/components/UsaSpendingAwardLookup";
import { futurePastAwardFields, pastAwardLookupProfile } from "@/lib/past-award-intelligence";

const lookupFields = ["legal name", "alternate name", "EIN", "address", "related entity", "geography", "project terms"] as const;

export default function PastAwardsPage() {
  return (<>
    <PageHeader eyebrow="Review Queue" title="Past Awards / Reapplication" description="Read-only public past-award intelligence and internal reapplication references. CRCF 2.2 keeps staff-triggered USAspending.gov public award lookup with no saves, submissions, outreach, or source-system writes." />
    <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy"><p className="font-bold uppercase tracking-[0.18em]">Public-record intelligence only</p><p className="mt-2">USAspending.gov is a Past Award / Payout Source and Advisor Intelligence Source. It is not an application source. Lack of a USAspending match does not mean no grant existed, and matches may appear under related entities or partners.</p><p className="mt-2">Future recommendation quality may improve by comparing funding patterns with healthcare burden and community-need indicators.</p></section>
    <PageHeader eyebrow="Review Queue" title="Past Awards / Reapplication" description="Read-only public past-award intelligence and internal reapplication references. CRCF 2.2 preserves staff-triggered USAspending.gov public award lookup with no saves, submissions, outreach, or source-system writes." />
    <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy"><p className="font-bold uppercase tracking-[0.18em]">Public-record intelligence only</p><p className="mt-2">USAspending.gov is a Past Award / Payout Source and Advisor Intelligence Source. It is not an application source. Lack of a USAspending match does not mean no grant existed, and matches may appear under related entities or partners.</p></section>
    <UsaSpendingAwardLookup />
    <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-xl font-bold text-crcf-navy">Entity identity block</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{Object.entries(pastAwardLookupProfile).map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold text-crcf-navy">{value}</p></div>)}</div></section>
    <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-xl font-bold text-crcf-navy">Search fields supported by advisor lookup</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{lookupFields.map((field) => <div key={field} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{field}</div>)}</div></section>
    <section className="grid gap-4 md:grid-cols-2">{futurePastAwardFields.map((field) => <article key={field} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">Normalized intelligence field</p><h3 className="mt-2 text-lg font-bold text-crcf-navy">{field}</h3><p className="mt-2 text-sm font-semibold text-slate-600">Human verification required before use.</p></article>)}</section>
  </>);
}
