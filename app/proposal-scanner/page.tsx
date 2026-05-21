"use client";

import { type ReactNode, useState } from "react";
import { GrantsGovDeepSynopsis } from "@/components/GrantsGovDeepSynopsis";
import { PageHeader } from "@/components/PageHeader";
import { proposalScannerExamples } from "@/lib/static-data";
import { analyzeProposalText } from "@/lib/proposal-scanner";
import {
  dedupeGrantsGovOpportunities,
  rankGrantsGovMatches,
  selectGrantsGovMatchSearchTerms,
  type ProposalGrantsGovMatch,
} from "@/lib/proposal-grants-match";
import type { GrantsGovSearchResponse } from "@/lib/grants-gov";
import type {
  OpportunityDatabaseDraft,
  OpportunityNoticeSummary,
  ProposalScanResult,
} from "@/lib/proposal-scanner";

function PillList({
  items,
  tone = "sky",
}: {
  items: string[];
  tone?: "sky" | "mint" | "slate" | "gold";
}) {
  const toneClasses = {
    sky: "bg-crcf-sky text-crcf-navy",
    mint: "bg-crcf-mint text-crcf-navy",
    slate: "bg-slate-100 text-slate-700",
    gold: "bg-crcf-gold/30 text-crcf-navy",
  };

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-full px-3 py-1 text-sm font-semibold ${toneClasses[tone]}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-crcf-blue">
        {title}
      </h3>
      <div className="mt-2 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
        {value || "Needs review"}
      </p>
    </div>
  );
}

function OpportunityNoticeSummaryView({
  summary,
}: {
  summary: OpportunityNoticeSummary;
}) {
  const awardRange =
    summary.awardFloor && summary.awardCeiling
      ? `${summary.awardFloor} to ${summary.awardCeiling}`
      : summary.awardCeiling
        ? `Up to ${summary.awardCeiling}`
        : summary.awardFloor
          ? `From ${summary.awardFloor}`
          : "Needs review";

  return (
    <ResultSection title="Opportunity Notice Summary">
      <div className="grid gap-3 md:grid-cols-2">
        <FieldRow label="Title" value={summary.title} />
        <FieldRow
          label="Opportunity Number"
          value={summary.opportunityNumber}
        />
        <FieldRow label="Agency / Source" value={summary.agency} />
        <FieldRow label="Funding Type" value={summary.fundingType} />
        <FieldRow label="Category" value={summary.category} />
        <FieldRow label="Deadline" value={summary.deadline} />
        <FieldRow label="Funding Available" value={summary.totalFunding} />
        <FieldRow label="Award Range" value={awardRange} />
        <FieldRow label="Match Requirement" value={summary.matchRequirement} />
        <FieldRow label="Expected Awards" value={summary.expectedAwards} />
        <FieldRow label="Posted Date" value={summary.postedDate} />
        <FieldRow label="Archive Date" value={summary.archiveDate} />
      </div>

      <div className="mt-4 grid gap-3">
        <FieldRow
          label="Assistance Listing"
          value={summary.assistanceListing}
        />

        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Eligibility Summary
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
            {summary.eligibilitySummary || "Needs review"}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Program Description
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
            {summary.description || "Needs review"}
          </p>
        </div>

        {summary.sourceUrl ? (
          <a
            href={summary.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-crcf-blue/20 bg-white p-3 text-sm font-bold text-crcf-blue transition hover:border-crcf-blue hover:bg-crcf-sky"
          >
            Open detected source URL
          </a>
        ) : null}
      </div>
    </ResultSection>
  );
}

function OpportunityDatabaseDraftView({
  draft,
}: {
  draft: OpportunityDatabaseDraft;
}) {
  return (
    <ResultSection title="Opportunity Database Draft">
      <div className="grid gap-3 md:grid-cols-2">
        <FieldRow label="Draft Title" value={draft.title} />
        <FieldRow label="Source" value={draft.source} />
        <FieldRow label="Deadline" value={draft.deadline} />
        <FieldRow label="Funding Scale" value={draft.fundingScale} />
        <FieldRow label="Award Range" value={draft.awardRange} />
        <FieldRow label="Match Requirement" value={draft.matchRequirement} />
        <FieldRow label="Fit Classification" value={draft.fitClassification} />
        <FieldRow label="Source Reference" value={draft.sourceReference} />
      </div>

      <div className="mt-3 grid gap-3">
        <FieldRow label="Eligibility Note" value={draft.eligibilityNote} />
        <FieldRow
          label="Recommended CRCF Role"
          value={draft.recommendedCrcfRole}
        />
        <FieldRow label="Recommended Action" value={draft.recommendedAction} />
      </div>

      <p className="mt-3 rounded-2xl border border-crcf-gold/40 bg-crcf-gold/15 p-3 text-sm font-semibold leading-6 text-crcf-navy">
        Draft only. CRCF 1.0 does not save this record, submit forms, email
        anyone, or write to any system.
      </p>
    </ResultSection>
  );
}

function ExternalOpportunityResults({
  result,
}: {
  result: ProposalScanResult;
}) {
  return (
    <div className="grid gap-4">
      {result.parserWarnings && result.parserWarnings.length > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold uppercase tracking-[0.18em]">
            Parser Review Notes
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {result.parserWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.opportunityNoticeSummary ? (
        <OpportunityNoticeSummaryView
          summary={result.opportunityNoticeSummary}
        />
      ) : null}

      <ResultSection title="CRCF Fit Review">
        <div className="grid gap-3 md:grid-cols-2">
          <FieldRow label="Detected Need" value={result.detectedNeedCategory} />
          <FieldRow label="Likely Fund Match" value={result.likelyFundMatch} />
          <FieldRow
            label="Program / Growth Match"
            value={result.likelyProgramMatch}
          />
          <FieldRow
            label="Deadline Signal"
            value={result.deadlineUrgencySignals.join(", ")}
          />
        </div>

        <div className="mt-3">
          <p className="font-bold text-crcf-navy">Geography signals</p>
          <PillList items={result.geographySignals} tone="slate" />
        </div>

        <div className="mt-3">
          <p className="font-bold text-crcf-navy">
            Population/community signals
          </p>
          <PillList items={result.populationSignals} tone="slate" />
        </div>
      </ResultSection>

      {result.opportunityDatabaseDraft ? (
        <OpportunityDatabaseDraftView draft={result.opportunityDatabaseDraft} />
      ) : null}

      <ResultSection title="Recommended Next Action">
        <p>{result.recommendedNextAction}</p>
        <p className="mt-2 font-semibold text-crcf-navy">
          Future internal action: Add to Review Queue.
        </p>
      </ResultSection>

      <ResultSection title="Keyword / Category Matches">
        <p className="font-semibold text-crcf-navy">Keyword signals</p>
        <PillList items={result.keywordSignals} />

        <p className="mt-3 font-semibold text-crcf-navy">
          Keyword/category groups
        </p>
        <PillList items={result.relatedKeywordGroups} tone="mint" />

        <p className="mt-3 font-semibold text-crcf-navy">
          Suggested source categories
        </p>
        <PillList items={result.sourceCategorySuggestions} tone="mint" />

        <p className="mt-3 font-semibold text-crcf-navy">
          Recommended funding types
        </p>
        <PillList items={result.fundingTypeSuggestions} tone="gold" />
      </ResultSection>

      <ResultSection title="Suggested Funding Radar Search">
        <div className="rounded-xl border border-dashed border-crcf-blue/30 bg-white p-3 font-mono text-xs leading-6 text-crcf-navy">
          {result.suggestedFundingRadarSearchTerms.join(", ")}
        </div>
      </ResultSection>

      <ResultSection title="Why this matched">
        <p>{result.shortMatchExplanation}</p>
      </ResultSection>
    </div>
  );
}

function InternalNeedResults({ result }: { result: ProposalScanResult }) {
  const searchTerms = result.suggestedFundingRadarSearchTerms.join(", ");

  return (
    <div className="grid gap-4">
      <ResultSection title="Summary">
        <p>
          <span className="font-bold text-crcf-navy">Detected need:</span>{" "}
          {result.detectedNeedCategory}
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="font-bold text-crcf-navy">Geography signals</p>
            <PillList items={result.geographySignals} tone="slate" />
          </div>

          <div>
            <p className="font-bold text-crcf-navy">
              Population/community signals
            </p>
            <PillList items={result.populationSignals} tone="slate" />
          </div>
        </div>
      </ResultSection>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultSection title="Likely Fund Match">
          <p className="font-bold text-crcf-navy">{result.likelyFundMatch}</p>
        </ResultSection>

        <ResultSection title="Program Match">
          <p className="font-bold text-crcf-navy">
            {result.likelyProgramMatch}
          </p>
        </ResultSection>
      </div>

      <ResultSection title="Keyword Signals">
        <PillList items={result.keywordSignals} />

        <p className="mt-3 font-semibold text-crcf-navy">
          CRCF keyword/category groups
        </p>
        <PillList items={result.relatedKeywordGroups} tone="mint" />

        <p className="mt-3 font-semibold text-crcf-navy">
          Deadline/urgency signals
        </p>
        <PillList items={result.deadlineUrgencySignals} tone="gold" />
      </ResultSection>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultSection title="Suggested Source Categories">
          <PillList items={result.sourceCategorySuggestions} tone="mint" />
        </ResultSection>

        <ResultSection title="Recommended Funding Types">
          <PillList items={result.fundingTypeSuggestions} tone="gold" />
        </ResultSection>
      </div>

      <ResultSection title="Suggested Funding Radar Search">
        <div className="rounded-xl border border-dashed border-crcf-blue/30 bg-white p-3 font-mono text-xs leading-6 text-crcf-navy">
          {searchTerms}
        </div>

        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Copy-ready terms · no clipboard permission required
        </p>
      </ResultSection>

      <ResultSection title="Recommended Next Action">
        <p>{result.recommendedNextAction}</p>
        <p className="mt-2 font-semibold text-crcf-navy">
          Future internal action: Add to Review Queue.
        </p>
      </ResultSection>

      <ResultSection title="Why this matched">
        <p>{result.shortMatchExplanation}</p>
      </ResultSection>
    </div>
  );
}

function ScanResults({ result }: { result: ProposalScanResult }) {
  if (result.mode === "external-opportunity") {
    return <ExternalOpportunityResults result={result} />;
  }

  return <InternalNeedResults result={result} />;
}

type LiveMatchState = {
  searchTermsUsed: string[];
  totalLiveResultsScanned: number;
  dedupedMatchCount: number;
  researchHeavyDeprioritizedCount: number;
  includeResearchHeavy: boolean;
  matches: ProposalGrantsGovMatch[];
};

const scoreBands = [
  "10+ = Strong Match",
  "6–9 = Possible Match",
  "3–5 = Needs Eligibility Review",
  "Below 3 = Low Fit",
  "Research-heavy default = Research / Partner Only unless Include Research is enabled",
];

const positiveScoringSignals = [
  "proposal terms in title",
  "rural health / healthcare access / community health",
  "equipment / workforce / telehealth / clinic / urgent care",
  "close date exists",
  "posted/open status",
  "assistance listing exists",
  "strong CRCF fit language",
];

const negativeScoringSignals = [
  "research-heavy terms",
  "NIH/R01/clinical trial language",
  "no close date",
  "academic/research language without direct community delivery",
];

function formatPriorityPoints(score: number) {
  return `${score} local priority points`;
}

function LiveMatchControls({
  result,
  includeResearchHeavy,
  isLoading,
  onIncludeResearchHeavyChange,
  onFindMatches,
}: {
  result: ProposalScanResult | null;
  includeResearchHeavy: boolean;
  isLoading: boolean;
  onIncludeResearchHeavyChange: (include: boolean) => void;
  onFindMatches: () => void;
}) {
  const selectedTerms = result ? selectGrantsGovMatchSearchTerms(result) : [];
  const hasUsefulTerms = selectedTerms.length > 0;

  return (
    <section className="mt-5 rounded-2xl border border-crcf-blue/20 bg-crcf-sky/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-crcf-blue">
            Proposal-to-Grants Match Engine
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
            Uses local scanner terms to search the approved read-only Grants.gov
            route. Nothing is saved or submitted. Match score is a local
            review-priority score, not eligibility, win probability, grant
            advice, a percentage, or a score out of 100.
          </p>
        </div>

        <button
          type="button"
          onClick={onFindMatches}
          disabled={!result || !hasUsefulTerms || isLoading}
          className="rounded-full bg-crcf-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-crcf-navy disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "Finding matches…" : "Find Grants.gov Matches"}
        </button>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm font-bold text-crcf-navy">
        <input
          type="checkbox"
          checked={includeResearchHeavy}
          onChange={(event) =>
            onIncludeResearchHeavyChange(event.target.checked)
          }
          className="h-4 w-4 rounded border-slate-300 text-crcf-blue"
        />
        Include research-heavy grants
      </label>

      <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
        Research-heavy grants are deprioritized by default. Enable Include
        research-heavy grants only when CRCF/CRMC/university partners may have a
        direct research role.
      </p>

      {!result ? (
        <p className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-600">
          Analyze non-sensitive proposal text locally before running a live
          match search.
        </p>
      ) : hasUsefulTerms ? (
        <div className="mt-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Selected search terms
          </p>
          <PillList items={selectedTerms} tone="mint" />
        </div>
      ) : (
        <p className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-600">
          No useful scanner terms were found. Use Grants.gov Live manually with
          broader terms such as rural health, healthcare access, clinic,
          equipment, or Tennessee.
        </p>
      )}
    </section>
  );
}

function LiveMatchesSection({
  state,
  error,
}: {
  state: LiveMatchState | null;
  error: string;
}) {
  if (error) {
    return (
      <section className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
        <p className="font-bold uppercase tracking-[0.18em]">
          Live Grants.gov match error
        </p>
        <p className="mt-2">{error}</p>
      </section>
    );
  }

  if (!state) return null;

  const bestMatch = state.matches[0];
  const showResearchNotice =
    !state.includeResearchHeavy && state.researchHeavyDeprioritizedCount > 0;

  return (
    <section className="mt-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
            Live Grants.gov Matches
          </p>
          <h2 className="mt-2 text-2xl font-bold text-crcf-navy">
            Ranked read-only match review
          </h2>
        </div>
        <span className="rounded-full bg-crcf-mint px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-crcf-navy">
          Human review required
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <FieldRow
          label="Search terms used"
          value={state.searchTermsUsed.join(", ")}
        />
        <FieldRow
          label="Total live results scanned"
          value={String(state.totalLiveResultsScanned)}
        />
        <FieldRow
          label="Deduped match count"
          value={String(state.dedupedMatchCount)}
        />
        <FieldRow
          label="Research-heavy results deprioritized"
          value={String(state.researchHeavyDeprioritizedCount)}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-crcf-blue/20 bg-crcf-sky/50 p-4 text-sm leading-6 text-crcf-navy">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">
            Score meaning
          </p>
          <p className="mt-2 font-semibold">
            Match score is a local review-priority score, not an eligibility
            score. Higher scores mean the opportunity matched more CRCF need
            signals such as rural health, healthcare access, equipment,
            workforce, telehealth, community benefit, posted/open status, close
            date, and source fit. Research-heavy grants are penalized by default
            unless Include research-heavy grants is turned on.
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-crcf-blue">
            Not a percentage · not out of 100 · not win probability · not grant
            advice · human review required
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">
            Score bands
          </p>
          <ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-crcf-navy">
            {scoreBands.map((band) => (
              <li key={band}>{band}</li>
            ))}
          </ul>
        </div>
      </div>

      <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.16em] text-crcf-blue">
          How scoring works
        </summary>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-crcf-navy">Positive signals</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {positiveScoringSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-crcf-navy">Negative signals</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {negativeScoringSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      {showResearchNotice ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
          Research-heavy results were pushed below delivery-focused
          opportunities because Include research-heavy grants is off. These
          items remain visible for Research / Partner Only review and require
          human review before any external action.
        </p>
      ) : null}

      {bestMatch ? (
        <article className="mt-5 rounded-2xl border border-crcf-gold/50 bg-crcf-gold/15 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-crcf-blue">
            Best Match
          </p>
          <h3 className="mt-2 text-xl font-bold text-crcf-navy">
            {bestMatch.title}
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <FieldRow label="Funding Lane" value={bestMatch.fundingLane} />
            <FieldRow label="Likely CRCF role" value={bestMatch.likelyCrcfRole} />
            <FieldRow label="Funding fit confidence" value={bestMatch.fundingFitConfidence} />
            <FieldRow label="Source depth" value={bestMatch.sourceDepth} />
            <FieldRow label="Agency" value={bestMatch.agency} />
            <FieldRow label="Close date" value={bestMatch.closeDate} />
            <FieldRow label="Match label" value={bestMatch.matchLabel} />
            <FieldRow
              label="Priority points"
              value={formatPriorityPoints(bestMatch.matchScore)}
            />
          </div>
          <div className="mt-3 rounded-2xl bg-white/80 p-3 ring-1 ring-crcf-gold/30">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">
              Why this ranked above others
            </p>
            <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
              {bestMatch.whyMatched}
            </p>
          </div>
          <div className="mt-3 rounded-2xl border border-dashed border-crcf-blue/30 bg-white/80 p-3 text-sm font-semibold text-crcf-navy">
            Future internal action: Add to Review Queue. Planned only — no
            persistent action tracking is active in this phase.
          </div>
          <a
            href={bestMatch.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded-full bg-crcf-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-crcf-navy"
          >
            Open Grants.gov source
          </a>

          <GrantsGovDeepSynopsis opportunity={bestMatch} compact />
        </article>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          No matches were returned. Try broader Grants.gov Live terms such as
          rural health, healthcare access, community health, clinic, medical
          equipment, or Tennessee.
        </div>
      )}

      <div className="mt-5 grid gap-4">
        {state.matches.map((match) => (
          <article
            key={`${match.opportunityNumber}-${match.id}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {match.matchLabel}
                </p>
                <h3 className="mt-1 text-lg font-bold text-crcf-navy">
                  {match.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {match.agency}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-crcf-blue ring-1 ring-slate-200">
                {formatPriorityPoints(match.matchScore)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <FieldRow
                label="Opportunity number"
                value={match.opportunityNumber}
              />
              <FieldRow label="Open date" value={match.openDate} />
              <FieldRow label="Close date" value={match.closeDate} />
              <FieldRow label="Deadline risk" value={match.deadlineRisk} />
              <FieldRow label="Research flag" value={match.researchFlag} />
              <FieldRow label="Likely fit" value={match.likelyFit} />
              <FieldRow label="Funding Lane" value={match.fundingLane} />
              <FieldRow label="Likely CRCF role" value={match.likelyCrcfRole} />
              <FieldRow label="Funding fit confidence" value={match.fundingFitConfidence} />
              <FieldRow label="Source depth" value={match.sourceDepth} />
            </div>

            <div className="mt-3 grid gap-3">
              <FieldRow
                label="Recommended action"
                value={match.recommendedAction}
              />
              <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Why this may fit
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
                  {match.whyMatched}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950">
              <span className="font-bold">Bad-fit warning:</span> {match.badFitWarning}
            </div>

            <div className="mt-3 rounded-2xl border border-dashed border-crcf-blue/30 bg-white p-3 text-sm font-semibold text-crcf-navy">
              Future internal action: Add to Review Queue. Planned only — no
              persistent action tracking is active in this phase.
            </div>

            <a
              href={match.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-full border border-crcf-blue/30 bg-white px-4 py-2 text-sm font-bold text-crcf-blue transition hover:border-crcf-blue hover:bg-crcf-sky"
            >
              Open Grants.gov source link
            </a>

            <GrantsGovDeepSynopsis opportunity={match} compact />
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ProposalScannerPage() {
  const [proposalText, setProposalText] = useState("");
  const [result, setResult] = useState<ProposalScanResult | null>(null);
  const [includeResearchHeavy, setIncludeResearchHeavy] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [liveMatchState, setLiveMatchState] = useState<LiveMatchState | null>(
    null,
  );
  const [liveMatchError, setLiveMatchError] = useState("");

  function handleAnalyze() {
    setResult(analyzeProposalText(proposalText));
    setLiveMatchState(null);
    setLiveMatchError("");
  }

  function handleClear() {
    setProposalText("");
    setResult(null);
    setLiveMatchState(null);
    setLiveMatchError("");
  }

  async function handleFindMatches() {
    if (!result) return;

    const searchTermsUsed = selectGrantsGovMatchSearchTerms(result);

    if (searchTermsUsed.length === 0) {
      setLiveMatchState(null);
      setLiveMatchError(
        "No useful scanner terms were found. Use Grants.gov Live manually with broader terms.",
      );
      return;
    }

    setIsMatching(true);
    setLiveMatchError("");
    setLiveMatchState(null);

    try {
      const responses = await Promise.all(
        searchTermsUsed.map(async (keyword) => {
          const response = await fetch("/api/grants-gov/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keyword }),
          });

          if (!response.ok) {
            throw new Error(`Grants.gov search failed for "${keyword}".`);
          }

          return (await response.json()) as GrantsGovSearchResponse;
        }),
      );

      const liveOpportunities = responses.flatMap(
        (response) => response.opportunities,
      );
      const dedupedOpportunities =
        dedupeGrantsGovOpportunities(liveOpportunities);
      const rankedMatches = rankGrantsGovMatches(
        dedupedOpportunities,
        searchTermsUsed,
        includeResearchHeavy,
      );

      setLiveMatchState({
        searchTermsUsed,
        totalLiveResultsScanned: liveOpportunities.length,
        dedupedMatchCount: rankedMatches.length,
        researchHeavyDeprioritizedCount: includeResearchHeavy
          ? 0
          : rankedMatches.filter((match) => match.researchHeavy).length,
        includeResearchHeavy,
        matches: rankedMatches,
      });
    } catch (error) {
      setLiveMatchError(
        error instanceof Error
          ? `${error.message} Please try again later or use Grants.gov Live manually.`
          : "Unable to search Grants.gov right now. Please try again later or use Grants.gov Live manually.",
      );
    } finally {
      setIsMatching(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Proposal Scanner"
        title="Structured local proposal and opportunity scan"
        description="CRCF 1.4a scans non-sensitive proposal text locally, generates search terms, and can run staff-reviewed read-only Grants.gov match searches as the first connected federal source in Find Funding. Future Funding Search will unify additional sources. Nothing is stored, submitted, emailed, or written to a source system."
      />

      <section className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <p className="font-bold uppercase tracking-[0.18em]">
          Non-sensitive text only
        </p>
        <p className="mt-2">
          Do not paste patient names, PHI, SSNs, private donor records,
          QuickBooks exports, DonorPerfect exports, or private medical details.
          The local scan does not store text or call live AI. The match button
          uses only the approved read-only Grants.gov API route, with no
          database writes, emails, submissions, crawling, or scraping.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <label
            className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue"
            htmlFor="proposal-text"
          >
            Non-sensitive grant idea / program need / public opportunity text
          </label>

          <textarea
            id="proposal-text"
            className="mt-4 h-80 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-crcf-blue focus:bg-white focus:ring-4 focus:ring-crcf-blue/10"
            placeholder="Paste sanitized internal need text or public opportunity notice text. Example: Grants.gov notice, program description, deadline/funding fields, or non-sensitive funding concept."
            value={proposalText}
            onChange={(event) => setProposalText(event.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {proposalScannerExamples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => {
                  setProposalText(example.text);
                  setResult(null);
                  setLiveMatchState(null);
                  setLiveMatchError("");
                }}
                className="rounded-full border border-crcf-blue/20 bg-crcf-sky px-3 py-2 text-xs font-bold text-crcf-navy transition hover:border-crcf-blue"
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={proposalText.trim().length === 0}
              className="rounded-full bg-crcf-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-crcf-navy disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Analyze locally
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-crcf-blue hover:text-crcf-blue"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-crcf-blue">
                Local result
              </p>
              <h2 className="mt-2 text-2xl font-bold text-crcf-navy">
                {result?.mode === "external-opportunity"
                  ? "Opportunity Notice Review"
                  : "Proposal Scan Summary"}
              </h2>
            </div>

            <span className="rounded-full bg-crcf-mint px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-crcf-navy">
              Local first
            </span>
          </div>

          <div className="mt-5">
            {result ? (
              <>
                <ScanResults result={result} />
                <LiveMatchControls
                  result={result}
                  includeResearchHeavy={includeResearchHeavy}
                  isLoading={isMatching}
                  onIncludeResearchHeavyChange={setIncludeResearchHeavy}
                  onFindMatches={handleFindMatches}
                />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
                Paste sanitized text or choose a sample, then select{" "}
                <span className="font-bold text-crcf-navy">
                  Analyze locally
                </span>
                . Results will appear here as a staff-review aid for internal
                planning only.
              </div>
            )}
          </div>
        </div>
      </section>

      <LiveMatchesSection state={liveMatchState} error={liveMatchError} />
    </>
  );
}
