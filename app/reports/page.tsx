import { PageHeader } from "@/components/PageHeader";
import { fundingRadarSnapshot, sampleReports, sourceManagerSnapshot } from "@/lib/static-data";
import { keywordCategoryGroups, keywordCategorySnapshot } from "@/lib/keyword-registry";
import { opportunityDatabaseSnapshot } from "@/lib/opportunity-database";
import { sourceDatabaseSnapshot } from "@/lib/source-database";

const reports = [
  "Proposal-Match Report",
  "Source Manager Snapshot",
  "Source Database Snapshot",
  "Keyword & Category Snapshot",
  "Opportunity Database Snapshot",
  "Governance Validation Report",
  "Daily Funding Brief Snapshot"
];

const highPriorityGroups = keywordCategoryGroups.filter((group) => group.priority === "High").slice(0, 6);

const strategicGrowthGroups = keywordCategoryGroups
  .filter((group) => group.relatedStrategicGrowthCategories.length > 0)
  .slice(0, 6);

const futureApiReadyGroups = keywordCategoryGroups
  .filter((group) => !group.futureGrantsGovSearchPhrase.startsWith("not applicable"))
  .slice(0, 6);

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Lean staff-reviewed reports"
        description="Staff report shells summarize Funding Radar, Source Manager, Source Database, Keyword Manager, Opportunity Database, Proposal Scanner, Grants.gov Live, USAspending, and Daily Funding Brief language. External distribution and automated outreach remain disabled."
      />

      <section className="mb-6 rounded-3xl border border-crcf-blue/20 bg-crcf-sky/60 p-5 text-sm font-semibold leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Evidence Intelligence Snapshot</p>
        <p className="mt-2">Need-proof and healthcare-burden sources help explain why opportunities may matter to CRCF/CRMC and the Upper Cumberland region. These sources improve narrative context and recommendation quality but are not application sources.</p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Funding Radar Snapshot</p>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Active leads</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{fundingRadarSnapshot.activeLeadCount}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Deadline soon</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{fundingRadarSnapshot.deadlineSoonCount}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Best match and next review</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
              {fundingRadarSnapshot.bestCurrentMatch}: {fundingRadarSnapshot.nextReviewAction}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Source Manager Snapshot</p>

        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Tracked sources</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.trackedSources}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Tier 1</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.tierOneSources}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Future API</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.futureApiCandidates}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Manual-check</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.manualCheckSources}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Next review</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
              {sourceManagerSnapshot.nextRecommendedSourceReview}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Source Database Snapshot</p>

        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total sources</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceDatabaseSnapshot.totalSources}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Connected</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceDatabaseSnapshot.connectedSources}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Planned true APIs</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceDatabaseSnapshot.plannedTrueApis}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Parser candidates</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceDatabaseSnapshot.parserCandidates}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Manual/subscription</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceDatabaseSnapshot.manualSubscriptionSources}</p>
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-crcf-navy">
          Source Database is a read-only planning registry with direct links, confidence labels, and human next steps.
          Parser and manual leads must be verified on source pages before action.
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Keyword & Category Snapshot</p>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">High-priority groups</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{keywordCategorySnapshot.highPriorityGroups}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Strategic growth groups</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{keywordCategorySnapshot.strategicGrowthGroups}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Future API-ready groups</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{keywordCategorySnapshot.futureGrantsGovReadyGroups}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Next category review</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
              Review rural access, capital/facility, workforce, private-giving, research-filter, and post-election giving groups.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-crcf-navy">High priority</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {highPriorityGroups.map((group) => group.groupName).join(", ")}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-crcf-navy">Strategic growth</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {strategicGrowthGroups.map((group) => group.groupName).join(", ")}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-crcf-navy">Future API-ready</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {futureApiReadyGroups.map((group) => group.groupName).join(", ")}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Opportunity Database Snapshot</p>

        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{opportunityDatabaseSnapshot.totalOpportunities}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Active review</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">
              {opportunityDatabaseSnapshot.activeReviewOpportunities}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Strategic growth</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{opportunityDatabaseSnapshot.strategicGrowthLeads}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Deadline soon</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{opportunityDatabaseSnapshot.deadlineSoonItems}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Future live/API</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">
              {opportunityDatabaseSnapshot.futureLiveApiPlaceholders}
            </p>
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-crcf-navy">
          Next action queue: {opportunityDatabaseSnapshot.nextRecommendedReview}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {sampleReports.map((report) => (
          <article key={report.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Report shell</p>
            <h3 className="mt-2 text-xl font-bold text-crcf-navy">{report.title}</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">{report.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-5">
        {reports.map((report) => (
          <div key={report} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-bold text-crcf-navy">{report}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Status: static shell. Human review required before use outside the dashboard.
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
