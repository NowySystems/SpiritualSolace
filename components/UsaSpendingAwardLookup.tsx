"use client";

import { useState } from "react";

import type { UsaSpendingAward, UsaSpendingSearchResponse } from "@/lib/usaspending";

const suggestedSearches = [
  "Cookeville Regional Medical Center Foundation",
  "Cookeville Regional Charitable Foundation",
  "Cookeville Regional Medical Center",
  "rural health workforce Tennessee",
  "cardiac rehabilitation equipment",
  "emergency department rural hospital",
  "nursing apprenticeship Tennessee",
];

export function UsaSpendingAwardLookup() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<UsaSpendingSearchResponse | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  async function runSearch(searchTerm = keyword) {
    const cleanKeyword = searchTerm.trim();
    if (!cleanKeyword) return;

    setKeyword(cleanKeyword);
    setIsSearching(true);
    setError("");

    try {
      const response = await fetch("/api/usaspending/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: cleanKeyword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "USAspending lookup failed.");
      }

      setResult(data);
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "USAspending lookup failed.");
    } finally {
      setIsSearching(false);
    }
  }

  function clearSearch() {
    setKeyword("");
    setResult(null);
    setError("");
  }

  return (
    <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-crcf-blue">Public Award Intelligence</p>
          <h2 className="mt-2 text-2xl font-bold text-crcf-navy">USAspending.gov lookup</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Search public federal award records to see whether CRCF, CRMC, related entities, or similar projects appear in past federal funding data. These results are public-record intelligence only and must be verified by staff.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950 lg:max-w-md">
          USAspending results are public federal award records. They do not include every private, state, local, pass-through, or foundation grant. Staff must verify before relying on a match.
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <label className="text-sm font-bold uppercase tracking-[0.18em] text-crcf-blue" htmlFor="usaspending-search">
          Search organization, EIN, geography, or project terms
        </label>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <input
            id="usaspending-search"
            className="min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none ring-crcf-blue/20 focus:ring-4"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Example: rural health workforce Tennessee"
          />
          <button
            type="button"
            onClick={() => runSearch()}
            disabled={isSearching || !keyword.trim()}
            className="rounded-full bg-crcf-blue px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
          <button type="button" onClick={clearSearch} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700">
            Clear
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestedSearches.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => runSearch(suggestion)}
              className="rounded-full border border-crcf-blue/20 bg-white px-3 py-2 text-xs font-bold text-crcf-blue hover:border-crcf-blue/50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {!result && !error ? (
        <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold text-slate-700">
          No public award records loaded yet. Search by organization name, related entity, or project terms.
        </div>
      ) : null}

      {error ? <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-950">{error}</div> : null}

      {result ? (
        <div className="mt-5">
          <div className="mb-4 rounded-3xl border border-crcf-blue/20 bg-crcf-blue/5 p-4 text-sm leading-6 text-crcf-navy">
            <p className="font-bold">Lookup mode: {result.lookupMode}</p>
            <p>{result.sourceNotice}</p>
          </div>

          {result.awards.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-semibold leading-6 text-slate-700">
              No public federal award matches found for this search. This does not mean no grant existed. Funding may have flowed through a partner, state agency, hospital entity, university, county, or another lead applicant.
            </div>
          ) : (
            <div className="grid gap-4">
              {result.awards.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

function AwardCard({ award }: { award: UsaSpendingAward }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">
        Source: USAspending.gov · Source role: Past Award / Payout Source · Connector type: True API · Not an application source
      </p>
      <h3 className="mt-2 text-xl font-bold text-crcf-navy">{award.recipientName}</h3>
      <p className="mt-2 text-lg font-bold text-crcf-blue">{award.awardAmount}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Award ID" value={award.awardId} />
        <Field label="Recipient location" value={award.recipientLocation} />
        <Field label="Awarding agency" value={award.awardingAgency} />
        <Field label="Funding agency" value={award.fundingAgency} />
        <Field label="Award date / period" value={award.awardDatePeriod} />
        <Field label="Award type" value={award.awardType} />
        <Field label="Assistance listing / CFDA / ALN" value={award.assistanceListing} />
        <Field label="Place of performance" value={award.placeOfPerformance} />
        <Field label="Match reason" value={award.matchReason} />
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Description</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">{award.description}</p>
      </div>
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
        Human verification required. {award.confidenceNote}
      </div>
      <a href={award.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full border border-crcf-blue/20 px-4 py-2 text-sm font-bold text-crcf-blue">
        Open USAspending source
      </a>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">{value || "Not shown"}</p>
    </div>
  );
}
