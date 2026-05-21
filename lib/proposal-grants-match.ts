import type { GrantsGovNormalizedOpportunity } from "@/lib/grants-gov";
import type { ProposalScanResult } from "@/lib/proposal-scanner";
import { badFitReasons, fundingFitDisclaimer, fundingLaneForText } from "@/lib/funding-need-model";

export type GrantsGovMatchLabel =
  | "Strong Match"
  | "Possible Match"
  | "Needs Eligibility Review"
  | "Research / Partner Only"
  | "Low Fit";

export type ProposalGrantsGovMatch = GrantsGovNormalizedOpportunity & {
  matchScore: number;
  matchLabel: GrantsGovMatchLabel;
  matchedTerms: string[];
  whyMatched: string;
  researchHeavy: boolean;
  fundingLane: string;
  likelyCrcfRole: string;
  badFitWarning: string;
  fundingFitConfidence: string;
  sourceDepth: string;
};

const prioritySearchTerms = [
  "rural health",
  "healthcare access",
  "community health",
  "urgent care",
  "clinic",
  "medical equipment",
  "telehealth",
  "healthcare workforce",
  "Tennessee",
  "cancer screening",
  "behavioral health",
];

const healthFitTerms = [
  "health",
  "rural",
  "healthcare",
  "clinic",
  "equipment",
  "workforce",
  "community",
  "screening",
  "telehealth",
  "patient",
  "facility",
  "urgent care",
  "preventive services",
  "direct service",
  "service delivery",
];

const researchTerms = [
  "r01",
  "r21",
  "nih",
  "clinical trial",
  "clinical trial required",
  "clinical trial optional",
  "investigator",
  "principal investigator",
  "randomized",
  "trial",
  "study protocol",
  "research",
  "academic research",
  "empirically-supported",
  "peer reviewed",
  "publication",
  "irb",
  "human subjects",
  "translational research",
  "research institute",
  "university-led",
];

const strongResearchTitleTerms = [
  "r01",
  "r21",
  "nih",
  "clinical trial",
  "investigator",
  "randomized",
  "human subjects",
];

const deliveryTerms = [
  "community delivery",
  "community health",
  "rural access",
  "rural health",
  "healthcare access",
  "health and safety education",
  "preventive services",
  "direct service",
  "service delivery",
  "direct delivery",
  "equipment",
  "workforce",
  "screening",
  "screenings",
  "facility",
  "facilities",
  "clinic",
  "urgent care",
  "telehealth",
  "patient",
  "community benefit",
  "rural community",
];

const deliveryAgencyTerms = [
  "usda",
  "hrsa",
  "nifa",
  "rural development",
  "rural utilities service",
  "health resources and services",
];

const likelyFitDeliveryTerms = [
  "equipment",
  "facility",
  "workforce",
  "cancer",
  "community health",
  "healthcare access",
  "telehealth",
  "direct service",
  "service delivery",
  "delivery",
];

function normalizedIncludes(text: string, term: string) {
  return text.toLowerCase().includes(term.toLowerCase());
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function unique(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function termPriority(term: string) {
  const normalizedTerm = term.toLowerCase();
  const priorityIndex = prioritySearchTerms.findIndex((priorityTerm) =>
    normalizedTerm.includes(priorityTerm.toLowerCase()),
  );

  if (priorityIndex >= 0) return priorityIndex;
  if (healthFitTerms.some((fitTerm) => normalizedTerm.includes(fitTerm)))
    return prioritySearchTerms.length;
  return prioritySearchTerms.length + 1;
}

export function selectGrantsGovMatchSearchTerms(result: ProposalScanResult) {
  const suggestedTerms = result.suggestedFundingRadarSearchTerms;
  const priorityTermsFromScanner = prioritySearchTerms.filter((priorityTerm) =>
    suggestedTerms.some(
      (term) =>
        normalizedIncludes(term, priorityTerm) ||
        normalizedIncludes(priorityTerm, term),
    ),
  );

  const scannerTerms = suggestedTerms
    .filter((term) => term.length >= 3)
    .filter((term) => !/[/:]/.test(term) || term.length <= 32)
    .sort((a, b) => termPriority(a) - termPriority(b) || a.length - b.length);

  return unique([...priorityTermsFromScanner, ...scannerTerms]).slice(0, 5);
}

function hasCloseDate(opportunity: GrantsGovNormalizedOpportunity) {
  return Boolean(
    opportunity.closeDate && opportunity.closeDate !== "Not shown",
  );
}

function hasAssistanceListing(opportunity: GrantsGovNormalizedOpportunity) {
  return opportunity.assistanceListings.length > 0;
}

function matchReviewText(opportunity: GrantsGovNormalizedOpportunity) {
  return `${opportunity.title} ${opportunity.opportunityNumber} ${opportunity.agency} ${opportunity.likelyFit}`.toLowerCase();
}

export function isResearchHeavy(opportunity: GrantsGovNormalizedOpportunity) {
  const text = matchReviewText(opportunity);
  const positiveResearchFlag = !opportunity.researchFlag
    .toLowerCase()
    .startsWith("no research-heavy signal");

  return (
    includesAny(text, researchTerms) ||
    (positiveResearchFlag &&
      includesAny(opportunity.researchFlag.toLowerCase(), researchTerms))
  );
}

function hasDeliveryBenefit(opportunity: GrantsGovNormalizedOpportunity) {
  const text =
    `${matchReviewText(opportunity)} ${opportunity.researchFlag}`.toLowerCase();
  return includesAny(text, deliveryTerms);
}

function hasStrongResearchSignal(opportunity: GrantsGovNormalizedOpportunity) {
  const titleAgencyNumber =
    `${opportunity.title} ${opportunity.opportunityNumber} ${opportunity.agency}`.toLowerCase();
  return includesAny(titleAgencyNumber, strongResearchTitleTerms);
}

function labelFor(
  score: number,
  researchHeavy: boolean,
  includeResearchHeavy: boolean,
): GrantsGovMatchLabel {
  if (researchHeavy && !includeResearchHeavy) return "Research / Partner Only";
  if (score >= 10) return "Strong Match";
  if (score >= 6) return "Possible Match";
  if (score >= 3) return "Needs Eligibility Review";
  return "Low Fit";
}

export function scoreGrantsGovOpportunity(
  opportunity: GrantsGovNormalizedOpportunity,
  proposalKeywords: string[],
  includeResearchHeavy: boolean,
): ProposalGrantsGovMatch {
  const title = opportunity.title.toLowerCase();
  const agency = opportunity.agency.toLowerCase();
  const status = opportunity.status.toLowerCase();
  const likelyFit = opportunity.likelyFit.toLowerCase();
  const reviewText = matchReviewText(opportunity);
  const matchedTerms = proposalKeywords.filter((term) =>
    normalizedIncludes(opportunity.title, term),
  );
  const researchHeavy = isResearchHeavy(opportunity);
  const deliveryBenefit = hasDeliveryBenefit(opportunity);
  const strongResearchSignal = hasStrongResearchSignal(opportunity);
  const hasObviousCrcfDeliverySignal =
    deliveryBenefit ||
    includesAny(reviewText, healthFitTerms) ||
    includesAny(agency, deliveryAgencyTerms);

  let matchScore = 0;
  const why: string[] = [];

  if (matchedTerms.length > 0) {
    matchScore += 5;
    why.push(
      `Title contains direct proposal term(s): ${matchedTerms.join(", ")}.`,
    );
  }

  if (!researchHeavy && includesAny(title, deliveryTerms)) {
    matchScore += 4;
    why.push(
      "Non-research title contains direct community delivery fit language.",
    );
  }

  if (likelyFit.includes("rural healthcare access")) {
    matchScore += 3;
    why.push("Likely fit includes Rural Healthcare Access.");
  }

  if (includesAny(likelyFit, likelyFitDeliveryTerms)) {
    matchScore += 3;
    why.push(
      "Likely fit includes CRCF delivery, equipment, facility, workforce, cancer, community-health, access, or telehealth language.",
    );
  }

  if (hasCloseDate(opportunity)) {
    matchScore += 2;
    why.push("Close date is available for deadline review.");
  } else {
    matchScore -= 3;
    why.push("No close date shown.");
  }

  if (status.includes("posted")) {
    matchScore += 2;
    why.push("Status is posted.");
  } else if (status.includes("forecast")) {
    matchScore += 1;
    why.push("Status is forecasted.");
  }

  if (hasAssistanceListing(opportunity)) {
    matchScore += 1;
    why.push("Assistance listing is available.");
  }

  if (includesAny(agency, deliveryAgencyTerms)) {
    matchScore += 2;
    why.push("Agency signal supports rural/community health delivery review.");
  }

  if (researchHeavy && !includeResearchHeavy) {
    matchScore -= 10;
    why.push(
      "Research-heavy grant language is deprioritized by default unless staff intentionally includes research-heavy opportunities.",
    );
  }

  if (strongResearchSignal && !includeResearchHeavy) {
    matchScore -= 6;
    why.push(
      "NIH/R01/R21/clinical-trial/investigator/human-subjects signal requires partner-only research review by default.",
    );
  }

  if (researchHeavy && !deliveryBenefit) {
    matchScore -= 3;
    why.push(
      "Academic/research signal appears without a clear direct delivery or community-benefit signal.",
    );
  }

  if (!hasObviousCrcfDeliverySignal) {
    matchScore -= 2;
    why.push(
      "No obvious CRCF service-area, healthcare access, or community delivery signal was detected.",
    );
  }

  if (researchHeavy) {
    why.push(
      includeResearchHeavy
        ? "Research warning remains visible because staff enabled research-heavy grants for partner review."
        : "Default posture: Research / Partner Only; human review is required before any external action.",
    );
  }

  const lane = fundingLaneForText(`${opportunity.title} ${opportunity.likelyFit} ${opportunity.agency}`);
  const badFitWarning = researchHeavy ? badFitReasons[3] : badFitReasons[18];

  return {
    ...opportunity,
    matchScore,
    matchedTerms,
    researchHeavy,
    matchLabel: labelFor(matchScore, researchHeavy, includeResearchHeavy),
    whyMatched: why.length
      ? `${why.join(" ")} ${fundingFitDisclaimer}`
      : "Matched only through broad Grants.gov search language; staff should broaden or refine terms and review eligibility manually.",
    fundingLane: lane.name,
    likelyCrcfRole: lane.typicalCrcfRole,
    badFitWarning,
    fundingFitConfidence:
      researchHeavy && !includeResearchHeavy
        ? "Research Fit — Partner Only"
        : matchScore >= 10
          ? "High Fit — Review First"
          : matchScore >= 6
            ? "Medium Fit — Needs Eligibility Review"
            : matchScore >= 3
              ? "Partner Fit — Find Lead Applicant"
              : "Low Fit — Do Not Prioritize",
    sourceDepth: "Level 1 — Metadata only",
  };
}

export function rankGrantsGovMatches(
  opportunities: GrantsGovNormalizedOpportunity[],
  proposalKeywords: string[],
  includeResearchHeavy: boolean,
) {
  return opportunities
    .map((opportunity) =>
      scoreGrantsGovOpportunity(
        opportunity,
        proposalKeywords,
        includeResearchHeavy,
      ),
    )
    .sort((a, b) => {
      if (!includeResearchHeavy && a.researchHeavy !== b.researchHeavy) {
        return a.researchHeavy ? 1 : -1;
      }

      return b.matchScore - a.matchScore || a.title.localeCompare(b.title);
    });
}

export function dedupeGrantsGovOpportunities(
  opportunities: GrantsGovNormalizedOpportunity[],
) {
  const seen = new Set<string>();

  return opportunities.filter((opportunity) => {
    const key =
      opportunity.opportunityNumber &&
      opportunity.opportunityNumber !== "No opportunity number shown"
        ? opportunity.opportunityNumber
        : opportunity.id;

    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
