import { PageHeader } from "@/components/PageHeader";
import {
  evidenceIntelligenceGovernanceNotes,
  evidenceIntelligenceSources,
  evidenceSourceGroups,
  futureAdvisorEvidenceExamples,
} from "@/lib/evidence-intelligence";
import { evidenceConnectorHealth } from "@/lib/evidence-connectors";
import { communityNeedProfileShell } from "@/lib/community-need-profile";

export default function EvidenceIntelligencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence Intelligence"
        title="Evidence / Need-Proof Connectors"
        description="CRCF 1.9 organizes read-only evidence and need-proof intelligence sources that can strengthen future recommendation quality and grant narrative support."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">What evidence intelligence means</p>
        <p className="mt-2">
          These sources help explain why a project, population, or healthcare need may deserve funding. They do not provide grants to apply for.
        </p>
        <p className="mt-2">
          CRCF 1.9 is shell-only for evidence values: it adds safe source structure, direct links, and future advisor reasoning fields. No fake statistics, database writes, scraping, submissions, outreach, emails, Firebase, or Firestore are enabled.
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-crcf-navy">Source groups</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {evidenceSourceGroups.map((group) => (
            <div key={group} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {group}
            </div>
          ))}
        </div>
      </section>
      <section className="mb-6 rounded-3xl border border-crcf-blue/20 bg-crcf-sky/40 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-crcf-blue">CRCF 2.8 evidence connector readiness</p>
        <p className="mt-2 text-sm text-crcf-navy">Read-only readiness statuses only. Not live evidence pulls. Do not use without staff verification.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {evidenceConnectorHealth.map((connector) => (
            <div key={connector.sourceId} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm font-bold text-crcf-navy">{connector.sourceName}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-crcf-blue">{connector.status === "ready" ? "Ready" : connector.status === "manual" ? "Manual" : "Future parser"}</p>
              <p className="mt-2 text-xs text-slate-600">{connector.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-4">
        {evidenceIntelligenceSources.map((source) => (
          <article key={source.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">{source.sourceGroup}</p>
            <h2 className="mt-2 text-2xl font-bold text-crcf-navy">{source.sourceName}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Info label="Source role" value={source.sourceRole} />
              <Info label="Connector type" value={source.connectorType} />
              <Info label="Status" value={source.status} />
              <Info label="Confidence" value={source.confidence} />
              <Info label="What it helps prove" value={source.whatItHelpsProve} />
              <Info label="How it improves recommendations" value={source.howItImprovesRecommendations} />
              <Info label="Human verification note" value={source.humanVerificationNote} />
            </div>
            <div className="mt-4">
              <a href={source.directSourceLink} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-crcf-blue px-4 py-2 text-sm font-bold text-white">
                Open direct source link
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-crcf-blue">Community Need Profile shell</p>
        <h2 className="mt-2 text-xl font-bold text-crcf-navy">{communityNeedProfileShell.profileName}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">{communityNeedProfileShell.status}</p>
        <p className="mt-3 text-sm leading-6 text-slate-700">{communityNeedProfileShell.evidenceUse}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {communityNeedProfileShell.geographies.map((geography) => (
            <span key={geography} className="rounded-full bg-crcf-sky px-3 py-1 text-xs font-bold text-crcf-navy">
              {geography}
            </span>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {communityNeedProfileShell.indicators.map((indicator) => (
            <article key={indicator.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{indicator.category}</p>
              <h3 className="mt-2 text-base font-bold text-crcf-navy">{indicator.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">Source shell: {indicator.intendedEvidenceSource}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Advisor use: {indicator.useInAdvisorReasoning}</p>
              <p className="mt-2 text-sm font-bold text-crcf-navy">Data value: not connected yet</p>
            </article>
          ))}
        </div>
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          {communityNeedProfileShell.governanceNote}
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-crcf-navy">Future advisor examples</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Examples only as explanatory text, not fake live results:</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {futureAdvisorEvidenceExamples.map((example) => (
            <div key={example} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-crcf-navy">
              {example}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-crcf-blue/20 bg-crcf-sky/60 p-5 text-sm font-semibold leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Governance notes</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {evidenceIntelligenceGovernanceNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">{value}</p>
    </div>
  );
}
