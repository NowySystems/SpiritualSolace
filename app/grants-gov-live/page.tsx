"use client";

import { useState } from "react";
import { GrantsGovDeepSynopsis } from "@/components/GrantsGovDeepSynopsis";
import { PageHeader } from "@/components/PageHeader";
import type { GrantsGovNormalizedOpportunity, GrantsGovSearchResponse } from "@/lib/grants-gov";

const sampleSearches = [
  "rural health Tennessee",
  "healthcare access",
  "community health",
  "urgent care clinic",
  "medical equipment",
  "healthcare workforce",
  "cancer screening"
];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">{value || "Not shown"}</p>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: GrantsGovNormalizedOpportunity }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-crcf-blue">
            {opportunity.sourceCategory} · {opportunity.status} · {opportunity.documentType}
          </p>
          <h3 className="mt-2 text-xl font-bold text-crcf-navy">{opportunity.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {opportunity.agency} · {opportunity.opportunityNumber}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
          <span className="rounded-full bg-crcf-gold/30 px-3 py-1 text-crcf-navy">{opportunity.deadlineRisk}</span>
          <span className="rounded-full bg-crcf-mint px-3 py-1 text-crcf-navy">{opportunity.likelyFit}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Field label="Open date" value={opportunity.openDate} />
        <Field label="Close date" value={opportunity.closeDate} />
        <Field label="Assistance listings" value={opportunity.assistanceListings.join(", ") || "Not shown"} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Research filter</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">{opportunity.researchFlag}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Recommended action</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">{opportunity.recommendedAction}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Why this matched</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{opportunity.whyMatched}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={opportunity.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-crcf-blue/20 px-4 py-2 text-sm font-bold text-crcf-blue transition hover:border-crcf-blue hover:bg-crcf-sky"
        >
          Open Grants.gov source
        </a>
      </div>

      <GrantsGovDeepSynopsis opportunity={opportunity} />
    </article>
  );
}

export default function GrantsGovLivePage() {
  const [keyword, setKeyword] = useState("rural health Tennessee");
  const [result, setResult] = useState<GrantsGovSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  async function searchGrantsGov(searchKeyword = keyword) {
    const cleanKeyword = searchKeyword.trim();

    if (!cleanKeyword) {
      setError("Enter a search phrase first.");
      return;
    }

    setKeyword(cleanKeyword);
    setIsSearching(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/grants-gov/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ keyword: cleanKeyword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Search failed.");
      }

      setResult(data);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Search failed.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Grants.gov Live"
        title="Grants.gov connector page (legacy/diagnostic)"
        description="Funding Search is now the primary staff-facing search workflow. This page remains available as a source-specific Grants.gov connector view for diagnostics and direct live testing."
      />

      <section className="mb-6 rounded-3xl border border-crcf-gold/40 bg-crcf-gold/15 p-5 text-sm leading-6 text-crcf-navy">
        <p className="font-bold uppercase tracking-[0.18em]">Read-only live source</p>
        <p className="mt-2">
          This page uses public Grants.gov search and detail endpoints through internal Next.js routes. No results are saved.  It does not use an API
          key, does not save results, does not apply for grants, and does not contact any source system beyond staff-triggered
          read-only requests.
        </p>
      </section>

      <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue" htmlFor="grants-gov-keyword">
          Search phrase
        </label>

        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <input
            id="grants-gov-keyword"
            className="min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none ring-crcf-blue/20 focus:ring-4"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="rural health Tennessee"
          />

          <button
            type="button"
            onClick={() => searchGrantsGov()}
            disabled={isSearching}
            className="rounded-full bg-crcf-blue px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-crcf-navy disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSearching ? "Searching..." : "Search Grants.gov"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {sampleSearches.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => searchGrantsGov(sample)}
              disabled={isSearching}
              className="rounded-full border border-crcf-blue/20 bg-crcf-sky px-3 py-2 text-xs font-bold text-crcf-navy transition hover:border-crcf-blue disabled:opacity-60"
            >
              {sample}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}
      </section>

      {result ? (
        <section className="grid gap-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">Live search summary</p>
            <p className="mt-2 text-2xl font-bold text-crcf-navy">{result.hitCount} Grants.gov hit(s)</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Search phrase: <span className="font-bold text-crcf-navy">{result.keyword}</span>
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">{result.sourceNotice}</p>
          </div>

          {result.opportunities.length > 0 ? (
            result.opportunities.map((opportunity) => (
              <OpportunityCard key={`${opportunity.id}-${opportunity.opportunityNumber}`} opportunity={opportunity} />
            ))
          ) : (
            <div className="rounded-3xl bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm ring-1 ring-slate-200">
              No opportunities returned for this search. Try a broader phrase like health, rural health, or community health.
            </div>
          )}
        </section>
      ) : null}
    </>
  );
}
