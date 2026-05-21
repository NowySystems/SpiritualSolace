"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { fundingOpportunities, fundingStatuses, fundingTypes } from "@/lib/static-data";

const allOption = "All";

const filterConfig = [
  { key: "fundMatch", label: "Fund match" },
  { key: "sourceTier", label: "Source tier" },
  { key: "deadlineRisk", label: "Deadline risk" },
  { key: "status", label: "Status" },
  { key: "fundingType", label: "Funding type" }
] as const;

type FundingOpportunity = (typeof fundingOpportunities)[number];
type FilterKey = (typeof filterConfig)[number]["key"];
type Filters = Record<FilterKey, string>;

const initialFilters = filterConfig.reduce(
  (filters, filter) => ({ ...filters, [filter.key]: allOption }),
  {} as Filters
);

function getOpportunityValue(opportunity: FundingOpportunity, key: FilterKey) {
  return opportunity[key];
}

function getUniqueOptions(key: FilterKey) {
  const values = fundingOpportunities.map((opportunity) => getOpportunityValue(opportunity, key));
  return [allOption, ...Array.from(new Set(values)).sort()];
}

function matchesFilter(opportunity: FundingOpportunity, key: FilterKey, selectedValue: string) {
  if (selectedValue === allOption) return true;
  return getOpportunityValue(opportunity, key) === selectedValue;
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          {item}
        </span>
      ))}
    </div>
  );
}

export default function FundingRadarPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchText, setSearchText] = useState("");
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);

  const filteredOpportunities = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return fundingOpportunities.filter((opportunity) => {
      const matchesFilters = filterConfig.every((filter) => matchesFilter(opportunity, filter.key, filters[filter.key]));

      const searchableText = [
        opportunity.title,
        opportunity.fundingType,
        opportunity.sourceName,
        opportunity.sourceTier,
        opportunity.sourceCategory,
        opportunity.deadline,
        opportunity.deadlineRisk,
        opportunity.status,
        opportunity.fundMatch,
        opportunity.programMatch,
        opportunity.geographyFit,
        opportunity.confidence,
        opportunity.estimatedEffort,
        opportunity.matchRequirement,
        opportunity.recommendedAction,
        opportunity.shortMatchExplanation,
        ...opportunity.keywordSignals,
        ...(opportunity.keywordGroupMatches ?? [])
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilters && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [filters, searchText]);

  return (
    <>
      <PageHeader
        eyebrow="Funding Radar"
        title="Internal funding review queue"
        description="Internal review queue for real source-backed opportunities and staff-pasted leads. Grants.gov is the first connected federal source inside Find Funding; future Funding Search will unify additional connected sources. No outreach, submissions, or source-system writes."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Local review queue only</p>
        <p className="mt-2">
          Read-only source review. Human action required. No applications or outreach. Internal review only.
        </p>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Visible records</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{filteredOpportunities.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Funding types</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{fundingTypes.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Statuses</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{fundingStatuses.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Mode</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">Static / human-reviewed</p>
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 lg:grid-cols-[1.35fr_repeat(5,minmax(0,1fr))]">
          <label className="text-sm font-semibold text-crcf-navy">
            Search
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4"
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Title, source, keyword, fund, action"
            />
          </label>

          {filterConfig.map((filter) => (
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
          Showing {filteredOpportunities.length} of {fundingOpportunities.length} local/static funding records.
        </p>
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
          const isExpanded = expandedTitle === opportunity.title;

          return (
            <article key={opportunity.title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-crcf-blue">
                    {opportunity.sourceTier} · {opportunity.fundingType} · {opportunity.sourceCategory}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-crcf-navy">{opportunity.title}</h3>
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
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Fund match</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">{opportunity.fundMatch}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Program / growth fit</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">{opportunity.programMatch}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Recommended action</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">{opportunity.recommendedAction}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Keyword signals</p>
                  <PillList items={opportunity.keywordSignals} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Keyword groups</p>
                  <PillList items={opportunity.keywordGroupMatches ?? []} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Geography fit</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">{opportunity.geographyFit}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpandedTitle(isExpanded ? null : opportunity.title)}
                className="mt-4 rounded-full border border-crcf-blue/20 px-4 py-2 text-sm font-bold text-crcf-blue transition hover:border-crcf-blue hover:bg-crcf-sky"
              >
                {isExpanded ? "Hide match details" : "Why this matched"}
              </button>

              {isExpanded ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  <p>
                    <span className="font-bold text-crcf-navy">Why this matched:</span>{" "}
                    {opportunity.shortMatchExplanation}
                  </p>
                  <p className="mt-3">
                    <span className="font-bold text-crcf-navy">Match requirement:</span>{" "}
                    {opportunity.matchRequirement}
                  </p>
                  <p className="mt-3">
                    <span className="font-bold text-crcf-navy">Estimated effort:</span>{" "}
                    {opportunity.estimatedEffort}
                  </p>
                  <p className="mt-3">
                    <span className="font-bold text-crcf-navy">Last checked:</span>{" "}
                    {opportunity.lastCheckedDate}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
