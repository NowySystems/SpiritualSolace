"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { sourceManagerSnapshot, sourceRegistry } from "@/lib/static-data";
import { keywordCategoryGroups } from "@/lib/keyword-registry";

const allOption = "All";

const filterConfig = [
  { key: "tier", label: "Tier" },
  { key: "category", label: "Category" },
  { key: "connectionStatus", label: "Connection" },
  { key: "currentStatus", label: "Status" }
] as const;

type SourceRegistryItem = (typeof sourceRegistry)[number];
type FilterKey = (typeof filterConfig)[number]["key"];
type Filters = Record<FilterKey, string>;

const initialFilters = filterConfig.reduce(
  (filters, filter) => ({ ...filters, [filter.key]: allOption }),
  {} as Filters
);

function getUniqueOptions(key: FilterKey) {
  return [allOption, ...Array.from(new Set(sourceRegistry.map((source) => String(source[key]))))];
}

function matchesFilter(source: SourceRegistryItem, key: FilterKey, selectedValue: string) {
  if (selectedValue === allOption) return true;
  return String(source[key]) === selectedValue;
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

function sourceKeywordSignals(source: SourceRegistryItem) {
  return keywordCategoryGroups
    .filter((group) => group.relatedSourceCategories.includes(source.category) || group.relatedCurrentAssistanceAreas.some((area) => source.relatedFundCategories.includes(area)))
    .flatMap((group) => group.searchTerms.slice(0, 2))
    .slice(0, 6);
}

export default function SourceWatchPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchText, setSearchText] = useState("");

  const filteredSources = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return sourceRegistry.filter((source) => {
      const matchesFilters = filterConfig.every((filter) => matchesFilter(source, filter.key, filters[filter.key]));

      const searchableText = [
        source.name,
        source.tier,
        source.type,
        source.category,
        source.accessType,
        source.connectionStatus,
        source.currentStatus,
        source.usefulFor,
        source.recommendedStaffAction,
        source.notes,
        ...source.relatedFundCategories,
        ...source.relatedProgramCategories,
        ...source.bestKeywordSignals
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilters && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [filters, searchText]);

  return (
    <>
      <PageHeader
        eyebrow="Source Manager"
        title="Static source registry"
        description="CRCF 0.8 keeps source IDs/categories aligned with Opportunity Database records. Sources are local/static references only: no crawling, scraping, APIs, source-system writes, or credentials."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Static source registry only</p>
        <p className="mt-2">
          Source Manager does not crawl, scrape, call external APIs, capture logins, update source systems, or connect
          to donor/finance platforms. Staff must manually check sources and verify any lead before action.
        </p>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Tracked sources</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.trackedSources}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Tier 1</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.tierOneSources}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Manual check</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.manualCheckSources}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Future API</p>
          <p className="mt-2 text-2xl font-bold text-crcf-navy">{sourceManagerSnapshot.futureApiCandidates}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Next review</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
            {sourceManagerSnapshot.nextRecommendedSourceReview}
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <label className="text-sm font-semibold text-crcf-navy">
            Search
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4" type="search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Source, ID, category, or keyword" />
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
          Showing {filteredSources.length} of {sourceRegistry.length} static source records.
        </p>
      </section>

      <section className="grid gap-4">
        {filteredSources.map((source) => (
          <article key={source.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-crcf-blue">
                  {source.tier} · {source.type} · {source.category}
                </p>
                <h3 className="mt-2 text-xl font-bold text-crcf-navy">{source.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Source ID: {source.id} · Reference: {source.urlReference}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                <span className="rounded-full bg-crcf-mint px-3 py-1 text-crcf-navy">{source.connectionStatus}</span>
                <span className="rounded-full bg-crcf-gold/30 px-3 py-1 text-crcf-navy">{source.currentStatus}</span>
                <span className="rounded-full bg-crcf-sky px-3 py-1 text-crcf-navy">{source.checkFrequency}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  What this source is useful for
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{source.usefulFor}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Recommended staff action
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{source.recommendedStaffAction}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Access / confidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {source.accessType} · Reliability: {source.reliability} · Last checked: {source.lastCheckedDate}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Related fund categories
                </p>
                <PillList items={source.relatedFundCategories} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Related program categories
                </p>
                <PillList items={source.relatedProgramCategories} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Best keyword signals
                </p>
                <PillList items={source.bestKeywordSignals} />
              </div>
            </div>

            <p className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
              <span className="font-bold text-crcf-navy">Notes:</span> {source.notes}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
