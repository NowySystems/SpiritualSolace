"use client";

import { type ReactNode, useState } from "react";
import type { GrantsGovDeepSynopsis as GrantsGovDeepSynopsisData } from "@/lib/grants-gov-detail";

type OpportunityForDetail = {
  id: string;
  title: string;
  opportunityNumber: string;
  agency: string;
  sourceUrl: string;
};

type DetailState = {
  isLoading: boolean;
  error: string;
  synopsis: GrantsGovDeepSynopsisData | null;
};

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
        {value || "Not returned by source"}
      </p>
    </div>
  );
}

function TextBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-crcf-blue">
        {title}
      </p>
      <div className="mt-2 text-sm font-semibold leading-6 text-crcf-navy">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function GrantsGovDeepSynopsis({
  opportunity,
  compact = false,
}: {
  opportunity: OpportunityForDetail;
  compact?: boolean;
}) {
  const [state, setState] = useState<DetailState>({
    isLoading: false,
    error: "",
    synopsis: null,
  });

  async function fetchDetail() {
    setState((current) => ({ ...current, isLoading: true, error: "" }));

    try {
      const response = await fetch("/api/grants-gov/detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          opportunityNumber: opportunity.opportunityNumber,
          title: opportunity.title,
          agency: opportunity.agency,
          sourceUrl: opportunity.sourceUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Detail fetch unavailable. Open the source link and verify manually.");
      }

      setState({ isLoading: false, error: "", synopsis: data });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Detail fetch unavailable. Open the source link and verify manually.",
        synopsis: null,
      });
    }
  }

  const synopsis = state.synopsis;

  return (
    <div className="mt-4 rounded-2xl border border-crcf-blue/20 bg-crcf-sky/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-crcf-blue">
            Grants.gov Detail Enrichment
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-crcf-navy">
            Staff-triggered, read-only deep synopsis. Nothing is saved,
            submitted, emailed, or written to any source system.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchDetail}
          disabled={state.isLoading || !opportunity.id}
          className="rounded-full bg-crcf-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-crcf-navy disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {state.isLoading ? "Getting details…" : synopsis ? "Refresh Deep Synopsis" : "Build Deep Synopsis"}
        </button>
      </div>

      {state.error ? (
        <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
          {state.error || "Detail fetch unavailable. Open the source link and verify manually."}
        </p>
      ) : null}

      {synopsis ? (
        <div className="mt-4 grid gap-3">
          <p className="rounded-2xl border border-crcf-gold/40 bg-crcf-gold/20 p-3 text-sm font-semibold leading-6 text-crcf-navy">
            {synopsis.sourceNotice}
          </p>

          {synopsis.noAdditionalDetail ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold leading-6 text-slate-700">
              No additional detail returned by source.
            </p>
          ) : null}

          <details open={!compact} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.16em] text-crcf-blue">
              Deep Synopsis Summary
            </summary>

            <div className="mt-4 grid gap-3">
              <TextBlock title="Plain-language summary">
                <p>{synopsis.plainLanguageSummary}</p>
              </TextBlock>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Fact label="Opportunity title" value={synopsis.keyFacts.title} />
                <Fact label="Opportunity number" value={synopsis.keyFacts.opportunityNumber} />
                <Fact label="Agency" value={synopsis.keyFacts.agency} />
                <Fact label="Agency code" value={synopsis.keyFacts.agencyCode} />
                <Fact label="Posted date" value={synopsis.keyFacts.postedDate} />
                <Fact label="Close date / deadline" value={synopsis.keyFacts.closeDate} />
                <Fact label="Archive date" value={synopsis.keyFacts.archiveDate} />
                <Fact label="Funding instrument" value={synopsis.keyFacts.fundingInstrumentType} />
                <Fact label="Funding category" value={synopsis.keyFacts.categoryOfFundingActivity} />
                <Fact label="Estimated total funding" value={synopsis.keyFacts.estimatedTotalFunding} />
                <Fact label="Award ceiling" value={synopsis.keyFacts.awardCeiling} />
                <Fact label="Award floor" value={synopsis.keyFacts.awardFloor} />
                <Fact label="Expected awards" value={synopsis.keyFacts.expectedNumberOfAwards} />
                <Fact label="Cost sharing / match" value={synopsis.keyFacts.costSharingOrMatchRequirement} />
                <Fact label="Assistance listing / ALN" value={synopsis.keyFacts.assistanceListing} />
              </div>

              <TextBlock title="Eligibility / Applicant Type">
                <p>{synopsis.eligibilityReview}</p>
                <p className="mt-2 text-slate-600">
                  Applicant type: {synopsis.keyFacts.applicantType || synopsis.keyFacts.eligibleApplicants || "Needs review"}
                </p>
              </TextBlock>

              <div className="grid gap-3 md:grid-cols-2">
                <TextBlock title="Likely CRCF Role">
                  <p>{synopsis.likelyCrcfRole}</p>
                </TextBlock>
                <TextBlock title="Research vs Delivery">
                  <p>{synopsis.researchDeliveryClassification}</p>
                </TextBlock>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <TextBlock title="Why it may fit">
                  <BulletList items={synopsis.whyItMayFit} />
                </TextBlock>
                <TextBlock title="Why it may not fit">
                  <BulletList items={synopsis.whyItMayNotFit} />
                </TextBlock>
              </div>

              <TextBlock title="Recommended human next step">
                <p>{synopsis.recommendedHumanNextStep}</p>
              </TextBlock>

              <TextBlock title="Source Links">
                <div className="grid gap-2">
                  {synopsis.sourceLinks.map((link) => (
                    <a
                      key={`${link.kind}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-crcf-blue/20 bg-crcf-sky/60 p-3 text-sm font-bold text-crcf-blue transition hover:border-crcf-blue hover:bg-white"
                    >
                      {link.label} ({link.kind})
                    </a>
                  ))}
                </div>
              </TextBlock>
            </div>
          </details>
        </div>
      ) : null}
    </div>
  );
}
