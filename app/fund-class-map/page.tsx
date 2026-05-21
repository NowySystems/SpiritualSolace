import { PageHeader } from "@/components/PageHeader";
import { badFitReasons, fundingNeedLanes, fundingThresholdGuidance } from "@/lib/funding-need-model";

export default function FundClassMapPage() {
  return (
    <>
      <PageHeader eyebrow="Fund Class Map" title="Funding lanes, needs, and bad-fit filters" description="CRCF 1.4a completes Funding Need Model lanes with plain-language definitions, role guidance, threshold logic, and bad-fit warnings for faster staff triage." />
      <section className="mb-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-crcf-blue">Funding thresholds</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {fundingThresholdGuidance.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {fundingNeedLanes.map((lane) => (
          <details key={lane.name} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <summary className="cursor-pointer list-none">
              <p className="text-xl font-bold text-crcf-navy">{lane.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{lane.description}</p>
            </summary>
          </details>
        ))}
      </section>
      <section className="mt-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-crcf-blue">Bad-fit warning library</p>
        <div className="mt-3 flex flex-wrap gap-2">{badFitReasons.map((r)=><span key={r} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{r}</span>)}</div>
      </section>
    </>
  );
}
