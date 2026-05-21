"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  currentAssistanceAreaOptions,
  keywordCategoryGroups,
  keywordCategorySnapshot,
  keywordCategoryTypes,
  keywordGovernanceNote,
  keywordPriorities,
  sourceCategoryOptions,
  strategicGrowthCategoryOptions
} from "@/lib/keyword-registry";

const allOption = "All";

function optionList(items: readonly string[]) {
  return [allOption, ...items];
}

export default function KeywordCategoryManagerPage() {
  const [searchText, setSearchText] = useState("");
  const [categoryType, setCategoryType] = useState(allOption);
  const [priority, setPriority] = useState(allOption);
  const [currentAssistanceArea, setCurrentAssistanceArea] = useState(allOption);
  const [strategicGrowthCategory, setStrategicGrowthCategory] = useState(allOption);
  const [sourceCategory, setSourceCategory] = useState(allOption);

  const filteredGroups = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return keywordCategoryGroups.filter((group) => {
      const searchableText = [
        group.groupId,
        group.groupName,
        group.categoryType,
        group.priority,
        ...group.searchTerms,
        ...group.exclusionTerms,
        ...group.relatedCurrentAssistanceAreas,
        ...group.relatedStrategicGrowthCategories,
        ...group.relatedSourceCategories,
        ...group.recommendedSourceTypes,
        group.fundingRadarSearchPhrase,
        group.futureGrantsGovSearchPhrase,
        group.recommendedStaffAction
      ].join(" ").toLowerCase();

      return (
        (categoryType === allOption || group.categoryType === categoryType) &&
        (priority === allOption || group.priority === priority) &&
        (currentAssistanceArea === allOption || group.relatedCurrentAssistanceAreas.includes(currentAssistanceArea)) &&
        (strategicGrowthCategory === allOption || group.relatedStrategicGrowthCategories.includes(strategicGrowthCategory)) &&
        (sourceCategory === allOption || group.relatedSourceCategories.includes(sourceCategory)) &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [categoryType, currentAssistanceArea, priority, searchText, sourceCategory, strategicGrowthCategory]);

  return (
    <>
      <PageHeader
        eyebrow="Module D"
        title="Keyword & Category Manager"
        description="CRCF 0.7 established local/static keyword intelligence for Funding Radar searches, current assistance mapping, strategic growth classification, and future Grants.gov-ready phrases."
      />

      <section className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <p className="font-bold uppercase tracking-[0.18em]">Governance confirmation</p>
        <p className="mt-2">{keywordGovernanceNote}</p>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Keyword groups</p>
          <p className="mt-2 text-3xl font-bold text-crcf-navy">{keywordCategorySnapshot.totalGroups}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">High priority</p>
          <p className="mt-2 text-3xl font-bold text-crcf-navy">{keywordCategorySnapshot.highPriorityGroups}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Strategic growth</p>
          <p className="mt-2 text-3xl font-bold text-crcf-navy">{keywordCategorySnapshot.strategicGrowthGroups}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Future Grants.gov-ready</p>
          <p className="mt-2 text-3xl font-bold text-crcf-navy">{keywordCategorySnapshot.futureGrantsGovReadyGroups}</p>
        </div>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-semibold text-crcf-navy xl:col-span-3">
            Search keywords/categories
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Term, fund, growth area, source category, or phrase"
            />
          </label>
          <label className="text-sm font-semibold text-crcf-navy">
            Category type
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4" value={categoryType} onChange={(event) => setCategoryType(event.target.value)}>
              {optionList(keywordCategoryTypes).map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-crcf-navy">
            Priority
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4" value={priority} onChange={(event) => setPriority(event.target.value)}>
              {optionList(keywordPriorities).map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-crcf-navy">
            Current assistance area
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4" value={currentAssistanceArea} onChange={(event) => setCurrentAssistanceArea(event.target.value)}>
              {optionList(currentAssistanceAreaOptions).map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-crcf-navy">
            Strategic growth category
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4" value={strategicGrowthCategory} onChange={(event) => setStrategicGrowthCategory(event.target.value)}>
              {optionList(strategicGrowthCategoryOptions).map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-crcf-navy md:col-span-2">
            Source category
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4" value={sourceCategory} onChange={(event) => setSourceCategory(event.target.value)}>
              {optionList(sourceCategoryOptions).map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Showing {filteredGroups.length} of {keywordCategoryGroups.length} local/static keyword groups.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {filteredGroups.map((group) => (
          <article key={group.groupId} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-crcf-blue">{group.groupId}</p>
                <h3 className="mt-2 text-lg font-bold text-crcf-navy">{group.groupName}</h3>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-crcf-mint px-3 py-1 text-crcf-navy">{group.categoryType}</span>
                <span className="rounded-full bg-crcf-gold/30 px-3 py-1 text-crcf-navy">{group.priority}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Search terms</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.searchTerms.map((term) => <span key={term} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{term}</span>)}
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="font-bold text-crcf-navy">Related current assistance</p>
                <p className="mt-1 text-slate-600">{group.relatedCurrentAssistanceAreas.join(", ")}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="font-bold text-crcf-navy">Strategic growth</p>
                <p className="mt-1 text-slate-600">{group.relatedStrategicGrowthCategories.join(", ")}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl border border-dashed border-crcf-blue/30 bg-white p-3">
                <p className="font-bold text-crcf-navy">Funding Radar phrase</p>
                <p className="mt-1 font-mono text-xs text-slate-700">{group.fundingRadarSearchPhrase}</p>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
                <p className="font-bold text-crcf-navy">Future Grants.gov phrase</p>
                <p className="mt-1 font-mono text-xs text-slate-700">{group.futureGrantsGovSearchPhrase}</p>
              </div>
              <div className="rounded-2xl bg-crcf-sky/70 p-3">
                <p className="font-bold text-crcf-navy">Recommended staff action</p>
                <p className="mt-1 text-slate-700">{group.recommendedStaffAction}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
