"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { scoreFundingFit } from "@/lib/funding-fit";
import {
  fundingSearchProfiles,
  getFundingSearchProfile,
  SEARCH_ALL_PROFILE_ID,
  type FundingSearchProfileId,
} from "@/lib/funding-search-profiles";
import type { GrantsGovNormalizedOpportunity, GrantsGovSearchResponse } from "@/lib/grants-gov";

type CategoryId =
  | "all"
  | "federal"
  | "state-tennessee"
  | "corporate-giving"
  | "community-foundations"
  | "private-foundations"
  | "political-appropriations"
  | "healthcare-rural-health"
  | "workforce-apprenticeship"
  | "capital-equipment"
  | "patient-assistance"
  | "manual-subscription";

type FundingCategory = {
  id: CategoryId;
  label: string;
  status: "Live API" | "Ready for Setup";
  note: string;
  routesToGrantsGov: boolean;
};

const fundingCategories: FundingCategory[] = [
  { id: "all", label: "All", status: "Live API", note: "Searches connected public sources for this phase.", routesToGrantsGov: true },
  { id: "federal", label: "Federal", status: "Live API", note: "Public opportunities routed through Grants.gov.", routesToGrantsGov: true },
  { id: "state-tennessee", label: "State / Tennessee", status: "Ready for Setup", note: "No public source connector is active yet.", routesToGrantsGov: false },
  { id: "corporate-giving", label: "Corporate Giving", status: "Ready for Setup", note: "No public source connector is active yet.", routesToGrantsGov: false },
  { id: "community-foundations", label: "Community Foundations", status: "Ready for Setup", note: "No public source connector is active yet.", routesToGrantsGov: false },
  { id: "private-foundations", label: "Private Foundations", status: "Ready for Setup", note: "No public source connector is active yet.", routesToGrantsGov: false },
  { id: "political-appropriations", label: "Political / Appropriations", status: "Ready for Setup", note: "No public source connector is active yet.", routesToGrantsGov: false },
  {
    id: "healthcare-rural-health",
    label: "Healthcare / Rural Health",
    status: "Ready for Setup",
    note: "Dedicated connector is deferred; federal opportunities may appear via Grants.gov.",
    routesToGrantsGov: true,
  },
  {
    id: "workforce-apprenticeship",
    label: "Workforce / Apprenticeship",
    status: "Ready for Setup",
    note: "Dedicated connector is deferred; federal opportunities may appear via Grants.gov.",
    routesToGrantsGov: true,
  },
  {
    id: "capital-equipment",
    label: "Capital / Equipment",
    status: "Ready for Setup",
    note: "Dedicated connector is deferred; federal opportunities may appear via Grants.gov.",
    routesToGrantsGov: true,
  },
  { id: "patient-assistance", label: "Patient Assistance", status: "Ready for Setup", note: "No public source connector is active yet.", routesToGrantsGov: false },
  { id: "manual-subscription", label: "Manual / Subscription", status: "Ready for Setup", note: "No public source connector is active yet.", routesToGrantsGov: false },
];

type FitFilter = "all" | "strong" | "possible" | "needs-review" | "forecast" | "research-heavy";

function toFitFilter(opportunity: GrantsGovNormalizedOpportunity): Exclude<FitFilter, "all"> {
  const bucket = opportunity.fitReview?.matchBucket;
  if (opportunity.researchFlag.toLowerCase().includes("partner") || bucket === "partner_needed") return "research-heavy";
  if (opportunity.isForecast || opportunity.isNonActionable || bucket === "intelligence_only") return "forecast";
  if (bucket === "best_matches") return "strong";
  if (bucket === "possible_matches") return "possible";
  return "needs-review";
}

function getStatusLabel(opportunity: GrantsGovNormalizedOpportunity): string {
  if (opportunity.researchFlag.toLowerCase().includes("partner")) return "Research-Heavy / Partner Only";
  if (opportunity.isForecast || opportunity.isNonActionable) return "Forecast / Not Actionable";
  if (opportunity.opportunityStatus.toLowerCase().includes("closed")) return "Closed";
  if (opportunity.opportunityStatus.toLowerCase().includes("archive")) return "Archived";
  if (opportunity.opportunityStatus.trim().length === 0 || opportunity.opportunityStatus.toLowerCase().includes("unknown")) return "Needs Verification";
  return "Open / Apply-able";
}

export default function FundingSearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [selectedProfile, setSelectedProfile] = useState<FundingSearchProfileId>(SEARCH_ALL_PROFILE_ID);
  const [keyword, setKeyword] = useState("");
  const [fitFilter, setFitFilter] = useState<FitFilter>("all");
  const [result, setResult] = useState<GrantsGovSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const activeCategory = useMemo(
    () => fundingCategories.find((category) => category.id === selectedCategory) ?? fundingCategories[0],
    [selectedCategory],
  );

  const filteredRows = useMemo(() => {
    const rows = result?.opportunities ?? [];
    return rows.filter((row) => {
      if (fitFilter === "all") return true;
      return toFitFilter(row) === fitFilter;
    });
  }, [result, fitFilter]);

  const statusSummary = useMemo(() => {
    return filteredRows.reduce<Record<string, number>>((acc, row) => {
      const label = getStatusLabel(row);
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {});
  }, [filteredRows]);

  async function runSearch() {
    const cleanKeyword = keyword.trim();
    const profile = getFundingSearchProfile(selectedProfile);
    const effectiveKeyword = cleanKeyword || profile.defaultKeywords.join(" ");

    if (!activeCategory.routesToGrantsGov) {
      setResult(null);
      setError("Source unavailable for this category. This source type is Ready for Setup.");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const response = await fetch("/api/grants-gov/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: effectiveKeyword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "Source returned no public matches.");

      setResult({
        ...data,
        opportunities: (data.opportunities ?? []).map((opportunity: GrantsGovNormalizedOpportunity) => ({
          ...opportunity,
          fitReview: scoreFundingFit(opportunity, profile),
        })),
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Source unavailable; try again later.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Funding"
        title="Funding Opportunities"
        description="Search, filter, rank, and review public funding opportunities."
      />

      <section className="mb-5 flex flex-wrap gap-2">
        {[
          "Public sources only",
          "Human-reviewed",
          "External actions disabled",
        ].map((item) => (
          <span key={item} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{item}</span>
        ))}
      </section>

      <section className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <label htmlFor="funding-search-keyword" className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Search</label>
          <input
            id="funding-search-keyword"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Keyword or phrase"
          />
        </div>
        <div className="lg:col-span-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Fit Filter</label>
          <select className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={fitFilter} onChange={(event) => setFitFilter(event.target.value as FitFilter)}>
            <option value="all">All</option>
            <option value="strong">Strong Fit</option>
            <option value="possible">Possible Fit</option>
            <option value="needs-review">Needs Review</option>
            <option value="forecast">Forecast / Not Actionable</option>
            <option value="research-heavy">Research-Heavy / Partner Only</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Source Type</label>
          <div className="mt-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500">Ready for Setup</div>
        </div>
        <div className="lg:col-span-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Deadline Window</label>
          <div className="mt-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500">Ready for Setup</div>
        </div>
        <div className="lg:col-span-1">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Sort</label>
          <div className="mt-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500">Ready</div>
        </div>
        <div className="lg:col-span-12 flex flex-wrap gap-2">
          <button type="button" onClick={runSearch} disabled={isSearching} className="rounded-full bg-crcf-blue px-4 py-2 text-sm font-semibold text-white">{isSearching ? "Searching..." : "Run Search"}</button>
          <button type="button" onClick={() => { setKeyword(""); setResult(null); setError(""); }} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Clear</button>
          <select className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm" value={selectedProfile} onChange={(event) => setSelectedProfile(event.target.value as FundingSearchProfileId)}>
            {fundingSearchProfiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.label}</option>)}
          </select>
        </div>
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {fundingCategories.map((category) => (
          <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`rounded-xl border px-3 py-2 text-left text-sm ${selectedCategory === category.id ? "border-crcf-blue bg-crcf-blue/5" : "border-slate-200 bg-white"}`}>
            <div className="font-semibold text-crcf-navy">{category.label}</div>
            <div className="text-xs text-slate-500">{category.status} · {category.note}</div>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-9 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {error ? <div className="border-b border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">{error}</div> : null}
          {!result && !error ? <div className="p-5 text-sm text-slate-600">No opportunities found yet. Run a search to review public matches. No applications, submissions, or outreach happen from this page.</div> : null}
          {result && filteredRows.length === 0 ? <div className="p-5 text-sm text-slate-600">No opportunities found. Try a broader search or clear filters.</div> : null}
          {filteredRows.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.14em] text-slate-600">
                <tr>
                  <th className="px-3 py-2">Opportunity</th><th className="px-3 py-2">Agency / Source</th><th className="px-3 py-2">Fit</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Deadline</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Why it fits</th><th className="px-3 py-2">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((opportunity) => {
                  const statusLabel = getStatusLabel(opportunity);
                  return (
                    <tr key={opportunity.id} className={statusLabel === "Open / Apply-able" ? "bg-white" : "bg-slate-50/70"}>
                      <td className="px-3 py-3 font-medium text-crcf-navy"><div>{opportunity.title}</div><a href={opportunity.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-crcf-blue">Source Link</a></td>
                      <td className="px-3 py-3">{opportunity.agency}<div className="text-xs text-slate-500">Live API · Grants.gov</div></td>
                      <td className="px-3 py-3">{opportunity.fitReview?.fitTier ?? "Needs Verification"}<div className="text-xs text-slate-500">Score: {opportunity.fitReview?.fitScore ?? "N/A"}</div></td>
                      <td className="px-3 py-3">{statusLabel}</td>
                      <td className="px-3 py-3">{opportunity.closeDate || "Needs Verification"}</td>
                      <td className="px-3 py-3">Needs Verification</td>
                      <td className="px-3 py-3 max-w-xs">{opportunity.fitReview?.whyItFits ?? opportunity.whyMatched}</td>
                      <td className="px-3 py-3">Manual Review</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>

        <aside className="xl:col-span-3 space-y-3">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-crcf-navy">Filter Snapshot</h3>
            <p className="mt-2 text-xs text-slate-600">Category: {activeCategory.label}</p>
            <p className="text-xs text-slate-600">Fit filter: {fitFilter}</p>
            <p className="text-xs text-slate-600">Profile: {getFundingSearchProfile(selectedProfile).label}</p>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-crcf-navy">Upcoming Deadlines</h3>
            <p className="mt-2 text-xs text-slate-600">Shown from currently displayed rows.</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {filteredRows.slice(0, 3).map((row) => <li key={`d-${row.id}`}>{row.closeDate || "Needs Verification"} · {row.title}</li>)}
            </ul>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-crcf-navy">Review Guidance</h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {Object.entries(statusSummary).map(([label, count]) => <li key={label}>{label}: {count}</li>)}
              {Object.keys(statusSummary).length === 0 ? <li>No rows in current view.</li> : null}
            </ul>
          </section>
        </aside>
      </section>


      <section className="mt-3 rounded-xl border border-dashed border-crcf-blue/30 bg-crcf-sky/40 p-3 text-sm text-crcf-navy">
        Future internal action: Add to Review Queue. Planned only — nothing is saved, submitted, emailed, or written to any source system.
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p>Source links must be reviewed by staff. Eligibility must be confirmed on the source page.</p>
        <p className="mt-1">The system does not submit applications or contact funders. Human review is required before external action.</p>
      </section>
    </>
  );
}
