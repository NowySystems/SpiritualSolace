import { PageHeader } from "@/components/PageHeader";
import { marketSignals } from "@/lib/static-data";

export default function DonorMarketIntelligencePage() {
  return (
    <>
      <PageHeader eyebrow="Donor Market Intelligence" title="Aggregate market signals" description="CRCF 0.4 keeps focusing on broad markets and advisor networks, not individual donor dossiers, private donor records, or automated outreach." />
      <section className="grid gap-4 md:grid-cols-2">
        {marketSignals.map((signal) => (
          <article key={signal.market} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">{signal.market}</p>
            <h3 className="mt-2 text-lg font-bold text-crcf-navy">{signal.focus}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{signal.use}</p>
          </article>
        ))}
      </section>
    </>
  );
}
