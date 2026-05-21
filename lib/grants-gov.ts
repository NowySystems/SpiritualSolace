export type GrantsGovSearchHit = {
  id: string;
  number: string;
  title: string;
  agencyCode: string;
  agencyName: string;
  openDate: string;
  closeDate: string;
  oppStatus: string;
  docType: string;
  alnList: string[];
};

export type GrantsGovNormalizedOpportunity = {
  id: string;
  title: string;
  opportunityNumber: string;
  sourceName: string;
  sourceCategory: string;
  agency: string;
  openDate: string;
  closeDate: string;
  deadlineRisk: string;
  status: string;
  opportunityStatus: string;
  isForecast: boolean;
  isNonActionable: boolean;
  nonActionableReasons: string[];
  documentType: string;
  assistanceListings: string[];
  likelyFit: string;
  researchFlag: string;
  recommendedAction: string;
  sourceUrl: string;
  whyMatched: string;
  fitReview?: {
    matchBucket: "best_matches" | "possible_matches" | "partner_needed" | "intelligence_only" | "hidden_bad_fits";
    fitTier: string;
    reviewPriority: string;
    fitScore: number;
    whyItFits: string;
    whyItMayNotFit: string;
    likelyCRCFRol: string;
    recommendedNextStep: string;
    badFitReasons: string[];
    partnerNeededReason: string;
    confidenceLevel: string;
    sourceProofStatus: string;
    funderIntelligence: string;
  };
  normalized: {
    title: string;
    sourceName: string;
    opportunityNumber: string;
    agencyOrFunder: string;
    directUrl: string;
    deadline: string;
    fundingCategory: string;
    eligibilitySummary: string;
    amountSummary: string;
    descriptionSummary: string;
    sourceRole: string;
    connectorType: string;
    confidenceLevel: string;
    researchFlag: string;
    badFitReasons: string[];
  };
};

export type GrantsGovSearchResponse = {
  keyword: string;
  hitCount: number;
  opportunities: GrantsGovNormalizedOpportunity[];
  sourceNotice: string;
};

export function buildGrantsGovSearchBody(keyword: string) {
  return {
    rows: 25,
    keyword,
    oppStatuses: "forecasted|posted"
  };
}

function getOpportunityStatus(rawStatus: string) {
  const status = rawStatus.trim();
  const normalized = status.toLowerCase();

  const isForecast = normalized.includes("forecast");
  const isClosed = normalized.includes("closed") || normalized.includes("archive") || normalized.includes("archived");
  const isPosted = normalized.includes("posted") || normalized.includes("open");
  const isUnknown = !status;

  const nonActionableReasons: string[] = [];
  if (isForecast) nonActionableReasons.push("forecast_non_open");
  if (isClosed) nonActionableReasons.push("closed_or_archived");

  return {
    opportunityStatus: status || "Status not shown",
    isForecast,
    isNonActionable: isForecast || isClosed,
    nonActionableReasons,
    recommendedActionOverride: isForecast
      ? "intelligence_only / monitor"
      : isClosed
      ? "monitor"
      : undefined,
    displayStatus: isUnknown ? "Status not shown" : status,
    isPosted
  };
}

function normalizeAlnList(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string" && raw.trim()) return [raw.trim()];
  return [];
}

export function getDeadlineRisk(closeDate: string) {
  if (!closeDate) return "No close date shown";

  const parsed = Date.parse(closeDate);
  if (Number.isNaN(parsed)) return `Close date shown: ${closeDate}`;

  const days = Math.ceil((parsed - Date.now()) / (1000 * 60 * 60 * 24));

  if (days < 0) return `Closed: ${closeDate}`;
  if (days <= 14) return `Urgent: ${closeDate}`;
  if (days <= 45) return `Deadline soon: ${closeDate}`;
  return `Open / review: ${closeDate}`;
}

export function getResearchFlag(text: string) {
  const normalized = text.toLowerCase();

  const researchTerms = [
    "research",
    "academic research",
    "investigator",
    "principal investigator",
    "clinical trial",
    "randomized trial",
    "study protocol",
    "peer reviewed",
    "nih",
    "r01",
    "r21",
    "translational research",
    "research institute",
    "university-led",
    "publication",
    "irb",
    "human subjects research"
  ];

  const clinicalTrialTerms = ["clinical trial", "nih", "r01", "r21", "human subjects research", "randomized trial"];

  const deliveryTerms = [
    "community health",
    "rural access",
    "rural health",
    "healthcare access",
    "health and safety education",
    "extension",
    "outreach",
    "education",
    "equipment",
    "workforce",
    "screening",
    "facility",
    "clinic",
    "urgent care",
    "telehealth",
    "patient",
    "community benefit"
  ];

  const hasClinicalTrialSignal = clinicalTrialTerms.some((term) => normalized.includes(term));
  const hasResearch = researchTerms.some((term) => normalized.includes(term));
  const hasDelivery = deliveryTerms.some((term) => normalized.includes(term));
  const hasExtensionDelivery = ["extension", "outreach", "health and safety education", "evidence-based"].some((term) =>
    normalized.includes(term)
  );

  if (hasClinicalTrialSignal) return "Clinical trial / NIH-style research — Low priority by default";
  if (hasResearch && !hasDelivery) return "Research / Academic Grant — Partner Only";
  if (hasResearch && hasDelivery) return "Research terms present — verify role";
  if (hasExtensionDelivery) return "Research-informed delivery / outreach";
  return "No research-heavy signal detected";
}

export function getLikelyFit(hit: GrantsGovSearchHit) {
  const text = `${hit.title} ${hit.agencyName} ${hit.number}`.toLowerCase();

  if (text.includes("rural") || text.includes("health") || text.includes("clinic")) {
    return "Strategic Growth Lead / Rural Healthcare Access";
  }

  if (text.includes("equipment") || text.includes("facility") || text.includes("construction")) {
    return "Capital / Facilities / Equipment Candidate";
  }

  if (text.includes("workforce") || text.includes("training")) {
    return "Workforce / Staffing / Capacity Candidate";
  }

  if (text.includes("cancer") || text.includes("screening")) {
    return "Cancer / Screening / Prevention Candidate";
  }

  return "Needs Eligibility Review";
}

export function normalizeGrantsGovHit(raw: Record<string, unknown>): GrantsGovNormalizedOpportunity {
  const hit: GrantsGovSearchHit = {
    id: String(raw.id ?? ""),
    number: String(raw.number ?? ""),
    title: String(raw.title ?? ""),
    agencyCode: String(raw.agencyCode ?? ""),
    agencyName: String(raw.agencyName ?? ""),
    openDate: String(raw.openDate ?? ""),
    closeDate: String(raw.closeDate ?? ""),
    oppStatus: String(raw.oppStatus ?? ""),
    docType: String(raw.docType ?? ""),
    alnList: normalizeAlnList(raw.alnist ?? raw.alnList)
  };

  const searchText = `${hit.title} ${hit.number} ${hit.agencyName} ${hit.agencyCode}`;
  const status = getOpportunityStatus(hit.oppStatus);

  return {
    id: hit.id,
    title: hit.title || "Untitled opportunity",
    opportunityNumber: hit.number || "No opportunity number shown",
    sourceName: "Grants.gov",
    sourceCategory: "Live API Source",
    agency: hit.agencyName || hit.agencyCode || "Agency not shown",
    openDate: hit.openDate || "Not shown",
    closeDate: hit.closeDate || "Not shown",
    deadlineRisk: getDeadlineRisk(hit.closeDate),
    status: status.displayStatus,
    opportunityStatus: status.opportunityStatus,
    isForecast: status.isForecast,
    isNonActionable: status.isNonActionable,
    nonActionableReasons: status.nonActionableReasons,
    documentType: hit.docType || "Document type not shown",
    assistanceListings: hit.alnList,
    likelyFit: getLikelyFit(hit),
    researchFlag: getResearchFlag(searchText),
    recommendedAction:
      status.recommendedActionOverride ||
      "Open the Grants.gov source, review eligibility/geography/deadline, then decide whether to create an internal match brief.",
    sourceUrl: hit.id ? `https://www.grants.gov/search-results-detail/${hit.id}` : "https://www.grants.gov/search-grants",
    whyMatched:
      "Live Grants.gov result normalized into CRCF review format. Human review required before any application, outreach, or external action.",
    normalized: {
      title: hit.title || "Untitled opportunity",
      sourceName: "Grants.gov",
      opportunityNumber: hit.number || "No opportunity number shown",
      agencyOrFunder: hit.agencyName || hit.agencyCode || "Agency not shown",
      directUrl: hit.id ? `https://www.grants.gov/search-results-detail/${hit.id}` : "https://www.grants.gov/search-grants",
      deadline: hit.closeDate || "Not shown",
      fundingCategory: "Federal grants",
      eligibilitySummary: "Eligibility must be verified on official source page.",
      amountSummary: "Amount details require direct source review.",
      descriptionSummary: hit.title || "Description not shown in list response.",
      sourceRole: "Opportunity Source",
      connectorType: "API",
      confidenceLevel: "verified",
      researchFlag: getResearchFlag(searchText),
      badFitReasons: ["May require eligibility, geography, or applicant-type checks."],
    }
  };
}

export function parseGrantsGovResponse(keyword: string, data: any): GrantsGovSearchResponse {
  const hits = Array.isArray(data?.data?.oppHits) ? data.data.oppHits : [];

  return {
    keyword,
    hitCount: Number(data?.data?.hitCount ?? hits.length ?? 0),
    opportunities: hits.map((hit: Record<string, unknown>) => normalizeGrantsGovHit(hit)),
    sourceNotice:
      "Live read-only Grants.gov search. Results are not saved, submitted, emailed, or written to any external system."
  };
}
