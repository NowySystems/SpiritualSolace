"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  opportunityDatabase,
  opportunityDatabaseByOriginType,
  opportunityDatabaseByStatus,
  opportunityDatabaseSnapshot,
  opportunityOriginTypes,
  opportunityStatuses
} from "@/lib/opportunity-database";

const allOption = "All";

const filterConfig = [
  { key: "status", label: "Status" },
  { key: "originType", label: "Origin" },
  { key: "fundingType", label: "Funding type" },
  { key: "sourceTier", label: "Source tier" },
  { key: "sourceCategory", label: "Source category" },
  { key: "strategicGrowthCategory", label: "Strategic growth" },
  { key: "currentAssistanceFit", label: "Current assistance" },
  { key: "deadlineRisk", label: "Deadline risk" },
  { key: "confidence", label: "Confidence" }
] as const;

type OpportunityRecord = (typeof opportunityDatabase)[number];
type FilterKey = (typeof filterConfig)[number]["key"];
type Filters = Record<FilterKey, string>;

const initialFilters = filterConfig.reduce(
  (filters, filter) => ({ ...filters, [filter.key]: allOption }),
  {} as Filters
);

function getOpportunityValue(opportunity: OpportunityRecord, key: FilterKey) {
  return opportunity[key];
}

function getUniqueOptions(key: FilterKey) {
  const values = opportunityDatabase.map((opportunity) => getOpportunityValue(opportunity, key));
  return [allOption, ...Array.from(new Set(values)).sort()];
}

function matchesFilter(opportunity: OpportunityRecord, key: FilterKey, selectedValue: string) {
  if (selectedValue === allOption) return true;
  return getOpportunityValue(opportunity, key) === selectedValue;
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function OpportunityDatabasePage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchText, setSearchText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredOpportunities = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return opportunityDatabase.filter((opportunity) => {
      const matchesFilters = filterConfig.every((filter) => matchesFilter(opportunity, filter.key, filters[filter.key]));

      const searchableText = [
        opportunity.id,
        opportunity.title,
        opportunity.shortSummary,
        opportunity.sourceId,
        opportunity.sourceName,
        opportunity.sourceTier,
        opportunity.sourceCategory,
        opportunity.sourceReference,
        opportunity.originType,
        opportunity.fundingType,
        opportunity.fundingCategory,
        opportunity.strategicGrowthCategory,
        opportunity.currentAssistanceFit,
        opportunity.expansionGrowthFit,
        opportunity.fundMatch,
        opportunity.programMatch,
        opportunity.geographyFit,
        opportunity.deadline,
        opportunity.deadlineRisk,
        opportunity.status,
        opportunity.confidence,
        opportunity.estimatedEffort,
        opportunity.estimatedFundingScale,
        opportunity.matchRequirement,
        opportunity.eligibilitySummary,
        opportunity.recommendedCrcfRole,
        opportunity.recommendedAction,
        opportunity.reviewNotes,
        opportunity.whyMatched,
        ...opportunity.keywordGroupMatches,
        ...opportunity.keywordSignals
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilters && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [filters, searchText]);

  return (
    <>
      <PageHeader
        eyebrow="Opportunity Database"
        title="Normalized local opportunity review queue"
        description="Module E holds internal opportunity review records from manual, scanner-generated, future API, public page monitor, subscription/export, and staff-entered origins. It is not a live database service yet."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Local/static database only</p>
        <p className="mt-2">
          Read-only source review. Human action required. No applications or outreach. Internal review only.
        </p>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total records</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{opportunityDatabaseSnapshot.totalOpportunities}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Active review</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">
            {opportunityDatabaseSnapshot.activeReviewOpportunities}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Strategic growth</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{opportunityDatabaseSnapshot.strategicGrowthLeads}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Deadline soon</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{opportunityDatabaseSnapshot.deadlineSoonItems}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Future live/API</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">
            {opportunityDatabaseSnapshot.futureLiveApiPlaceholders}
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <label className="text-sm font-semibold text-crcf-navy">
            Search
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4"
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Title, source, deadline, keyword, role, or action"
            />
          </label>

          {filterConfig.slice(0, 3).map((filter) => (
            <label key={filter.key} className="text-sm font-semibold text-crcf-navy">
              {filter.label}
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4"
                value={filters[filter.key]}
                onChange={(event) => setFilters((current) => ({ ...current, [filter.key]: event.target.value }))}
              >
                {getUniqueOptions(filter.key).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-6">
          {filterConfig.slice(3).map((filter) => (
            <label key={filter.key} className="text-sm font-semibold text-crcf-navy">
              {filter.label}
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4"
                value={filters[filter.key]}
                onChange={(event) => setFilters((current) => ({ ...current, [filter.key]: event.target.value }))}
              >
                {getUniqueOptions(filter.key).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-500">
          Showing {filteredOpportunities.length} of {opportunityDatabase.length} local/static opportunity records.
        </p>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">By status</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {opportunityDatabaseByStatus
              .filter((item) => item.count > 0)
              .map((item) => (
                <span key={item.status} className="rounded-full bg-crcf-sky px-3 py-1 text-xs font-bold text-crcf-navy">
                  {item.status}: {item.count}
                </span>
              ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Supported statuses: {opportunityStatuses.length}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">By origin</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {opportunityDatabaseByOriginType
              .filter((item) => item.count > 0)
              .map((item) => (
                <span key={item.originType} className="rounded-full bg-crcf-mint px-3 py-1 text-xs font-bold text-crcf-navy">
                  {item.originType}: {item.count}
                </span>
              ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Supported origins: {opportunityOriginTypes.length}
          </p>
        </div>
      </section>

      <section className="grid gap-4">
        {filteredOpportunities.length === 0 ? (
          <article className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-crcf-navy">No live opportunities loaded yet.</p>
            <p className="mt-2">Use Proposal Scanner, Funding Search, or connected sources to find real opportunities.</p>
            <p className="mt-2">Coming soon: this area will show real source-backed opportunities after connected sources return results.</p>
            <p className="mt-2">Paste a real opportunity notice or proposal text to begin.</p>
          </article>
        ) : filteredOpportunities.map((opportunity) => {
          const isExpanded = expandedId === opportunity.id;

          return (
            <article key={opportunity.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-crcf-blue">
                    {opportunity.sourceTier} · {opportunity.originType} · {opportunity.fundingType}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-crcf-navy">{opportunity.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{opportunity.shortSummary}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Source: {opportunity.sourceName} · Deadline: {opportunity.deadline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                  <span className="rounded-full bg-crcf-gold/30 px-3 py-1 text-crcf-navy">{opportunity.deadlineRisk}</span>
                  <span className="rounded-full bg-crcf-mint px-3 py-1 text-crcf-navy">{opportunity.status}</span>
                  <span className="rounded-full bg-crcf-sky px-3 py-1 text-crcf-navy">{opportunity.confidence}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Current assistance fit</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
                    {opportunity.currentAssistanceFit}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Strategic growth fit</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
                    {opportunity.strategicGrowthCategory}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Recommended action</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
                    {opportunity.recommendedAction}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Keyword signals</p>
                  <PillList items={opportunity.keywordSignals} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Keyword groups</p>
                  <PillList items={opportunity.keywordGroupMatches} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Human review</p>
                  <p className="mt-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-crcf-navy">
                    {opportunity.governanceFlag}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={opportunity.sourceReference}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-crcf-blue/20 px-4 py-2 text-sm font-bold text-crcf-blue transition hover:border-crcf-blue hover:bg-crcf-sky"
                >
                  Open source/reference
                </a>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : opportunity.id)}
                  className="rounded-full border border-crcf-blue/20 px-4 py-2 text-sm font-bold text-crcf-blue transition hover:border-crcf-blue hover:bg-crcf-sky"
                >
                  {isExpanded ? "Hide details" : "Why this matched"}
                </button>
              </div>

              {isExpanded ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                    <p>
                      <span className="font-bold text-crcf-navy">Why matched:</span> {opportunity.whyMatched}
                    </p>
                    <p className="mt-3">
                      <span className="font-bold text-crcf-navy">Eligibility:</span>{" "}
                      {opportunity.eligibilitySummary}
                    </p>
                    <p className="mt-3">
                      <span className="font-bold text-crcf-navy">Recommended CRCF role:</span>{" "}
                      {opportunity.recommendedCrcfRole}
                    </p>
                    <p className="mt-3">
                      <span className="font-bold text-crcf-navy">Review notes:</span> {opportunity.reviewNotes}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                    <p>
                      <span className="font-bold text-crcf-navy">Funding scale:</span>{" "}
                      {opportunity.estimatedFundingScale}
                    </p>
                    <p className="mt-3">
                      <span className="font-bold text-crcf-navy">Award ceiling:</span> {opportunity.awardCeiling}
                    </p>
                    <p className="mt-3">
                      <span className="font-bold text-crcf-navy">Award floor:</span> {opportunity.awardFloor}
                    </p>
                    <p className="mt-3">
                      <span className="font-bold text-crcf-navy">Match requirement:</span>{" "}
                      {opportunity.matchRequirement}
                    </p>
                    <p className="mt-3">
                      <span className="font-bold text-crcf-navy">Next review date:</span> {opportunity.nextReviewDate}
                    </p>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
