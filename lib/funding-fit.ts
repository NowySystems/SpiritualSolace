import type { GrantsGovNormalizedOpportunity } from "@/lib/grants-gov";
import type { FundingSearchProfile } from "@/lib/funding-search-profiles";

export type FundingFitTier = "strong_fit" | "possible_fit" | "partner_needed" | "research_intelligence_only" | "bad_fit" | "excluded";
export type ReviewPriority = "urgent" | "high" | "medium" | "low" | "ignore";
export type RecommendedNextStep = "review_this_week" | "verify_eligibility" | "identify_partner" | "monitor_reapplication" | "use_as_evidence_only" | "save_to_review_queue" | "ignore_bad_fit" | "needs_more_source_detail";

export type FundingFitReview = {
  matchBucket: "best_matches" | "possible_matches" | "partner_needed" | "intelligence_only" | "hidden_bad_fits";
  fitTier: FundingFitTier;
  reviewPriority: ReviewPriority;
  fitScore: number; // Review-priority score only; not probability of award.
  whyItFits: string;
  whyItMayNotFit: string;
  likelyCRCFRol: string;
  recommendedNextStep: RecommendedNextStep;
  badFitReasons: string[];
  partnerNeededReason: string;
  confidenceLevel: string;
  sourceProofStatus: string;
  funderIntelligence: string;
};

export function scoreFundingFit(opportunity: GrantsGovNormalizedOpportunity, profile: FundingSearchProfile): FundingFitReview {
  const text = `${opportunity.title} ${opportunity.agency} ${opportunity.opportunityNumber} ${opportunity.researchFlag} ${opportunity.likelyFit}`.toLowerCase();
  let score = 50;
  const whyFits: string[] = [];
  const whyNot: string[] = [];
  const badFitReasons: string[] = [];

  if (/(health|clinic|patient|rural|community|hospice|home health|pediatric|family support|mental health|workforce|transportation|screening|cancer|equipment)/.test(text)) {
    score += 18;
    whyFits.push("Healthcare/community relevance detected.");
  } else {
    score -= 14;
    whyNot.push("Limited healthcare/community relevance.");
  }

  if (/(rural|tennessee|appalachia|upper cumberland)/.test(text)) {
    score += 10;
    whyFits.push("Rural/Tennessee context signal found.");
  }

  if (/(nonprofit|hospital|public|county|clinic)/.test(text)) score += 8;

  if (/(individual|scholarship|student-only|fellowship)/.test(text)) {
    score -= 45;
    badFitReasons.push("Individual-only/student-only pattern.");
  }

  if (/(for-profit only|commercial only)/.test(text)) {
    score -= 40;
    badFitReasons.push("For-profit-only eligibility signal.");
  }
  if (/(foreign|international only|global only|outside the united states)/.test(text)) {
    score -= 40;
    badFitReasons.push("Foreign-only/global-only signal.");
  }
  if (/(state agency only|only state governments|state government)/.test(text)) {
    score -= 24;
    whyNot.push("State-agency-only signal without clear partner route.");
  }
  if (/(university only|institutions of higher education only)/.test(text)) {
    score -= 28;
    badFitReasons.push("University-only eligibility pattern.");
  }
  if (/(non[- ]?u\.?s\.?|non us|outside tennessee|non-tennessee)/.test(text)) {
    score -= 18;
    whyNot.push("Geography may not fit CRCF primary service area.");
  }
  if (/(tbd|to be announced|details forthcoming|n\/a)/.test(text)) {
    score -= 14;
    whyNot.push("Record appears vague/non-actionable.");
  }

  if (/(research|trial|investigator|r01|r21)/.test(text) && !/(outreach|community|service|delivery)/.test(text)) {
    score -= 18;
    whyNot.push("Research-heavy with weak delivery path.");
  }

  if (opportunity.deadlineRisk.toLowerCase().startsWith("closed")) {
    score -= 60;
    badFitReasons.push("Deadline expired.");
  } else if (opportunity.deadlineRisk.toLowerCase().startsWith("urgent")) {
    score += 8;
    whyFits.push("Urgent open deadline can be prioritized for review.");
  }

  if (!opportunity.sourceUrl || opportunity.sourceUrl.includes("search-grants")) {
    score -= 12;
    whyNot.push("Limited source detail in list-level result.");
  }

  for (const filter of profile.badFitFilters) {
    if (text.includes(filter.toLowerCase().split(" ")[0])) score -= 4;
  }

  score = Math.max(0, Math.min(100, score));

  let fitTier: FundingFitTier = "possible_fit";
  let matchBucket: FundingFitReview["matchBucket"] = "possible_matches";
  let reviewPriority: ReviewPriority = "medium";
  let recommendedNextStep: RecommendedNextStep = "verify_eligibility";
  let likelyCRCFRol = "Direct applicant or partner after eligibility review";
  let partnerNeededReason = "";

  if (badFitReasons.length > 0 || score < 20) {
    fitTier = score < 10 ? "excluded" : "bad_fit";
    matchBucket = "hidden_bad_fits";
    reviewPriority = "ignore";
    recommendedNextStep = "ignore_bad_fit";
    likelyCRCFRol = "No active CRCF role recommended";
  } else if (/(research|trial|investigator|university)/.test(text)) {
    fitTier = "partner_needed";
    matchBucket = "partner_needed";
    reviewPriority = "low";
    recommendedNextStep = "identify_partner";
    likelyCRCFRol = "Partner support / coalition role";
    partnerNeededReason = "Research-heavy profile may require CRMC/university or specialized lead partner.";
  } else if (score >= 75) {
    fitTier = "strong_fit";
    matchBucket = "best_matches";
    reviewPriority = opportunity.deadlineRisk.toLowerCase().startsWith("urgent") ? "urgent" : "high";
    recommendedNextStep = "review_this_week";
  } else if (score < 35) {
    fitTier = "research_intelligence_only";
    matchBucket = "intelligence_only";
    reviewPriority = "low";
    recommendedNextStep = "use_as_evidence_only";
  }

  return {
    matchBucket,
    fitTier,
    reviewPriority,
    fitScore: score,
    whyItFits: whyFits.join(" ") || "Initial fit signals are limited; requires source-backed review.",
    whyItMayNotFit: whyNot.join(" ") || "Eligibility, geography, and applicant constraints still require human review.",
    likelyCRCFRol,
    recommendedNextStep,
    badFitReasons,
    partnerNeededReason,
    confidenceLevel: opportunity.normalized.confidenceLevel,
    sourceProofStatus: opportunity.sourceUrl.includes("search-results-detail/") ? "direct_source_link_present" : "needs_more_source_detail",
    funderIntelligence: opportunity.assistanceListings.length
      ? `USAspending past-award intelligence can be checked via Assistance Listing ${opportunity.assistanceListings[0]}.`
      : "USAspending/past-award intelligence unavailable for this record."
  };
}
