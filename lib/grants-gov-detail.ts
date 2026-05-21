import { getDeadlineRisk } from "@/lib/grants-gov";

export type GrantsGovDetailSourceLink = {
  label: string;
  url: string;
  kind: "Grants.gov" | "Agency" | "NOFO / Attachment" | "Related Source";
};

export type GrantsGovDetailFacts = {
  title: string;
  opportunityNumber: string;
  agency: string;
  agencyCode: string;
  postedDate: string;
  closeDate: string;
  archiveDate: string;
  fundingInstrumentType: string;
  categoryOfFundingActivity: string;
  estimatedTotalFunding: string;
  awardCeiling: string;
  awardFloor: string;
  expectedNumberOfAwards: string;
  costSharingOrMatchRequirement: string;
  assistanceListing: string;
  eligibleApplicants: string;
  eligibilityNotes: string;
  description: string;
  applicantType: string;
  agencyContact: string;
};

export type CrcfLikelyRole =
  | "Possible Direct Applicant"
  | "Partner / Coalition Participant"
  | "Fiscal/Fiduciary Support"
  | "Grant-Writing / Coordination Support"
  | "Research Partner Only"
  | "Needs Eligibility Review";

export type ResearchDeliveryClassification =
  | "No research-heavy signal detected"
  | "Research-informed delivery / outreach"
  | "Research terms present — verify role"
  | "Research / Academic Grant — Partner Only"
  | "Clinical trial / NIH-style research — Low priority by default";

export type GrantsGovDeepSynopsis = {
  sourceNotice: string;
  noAdditionalDetail: boolean;
  plainLanguageSummary: string;
  keyFacts: GrantsGovDetailFacts;
  eligibilityReview: string;
  likelyCrcfRole: CrcfLikelyRole;
  whyItMayFit: string[];
  whyItMayNotFit: string[];
  researchDeliveryClassification: ResearchDeliveryClassification;
  recommendedHumanNextStep: string;
  sourceLinks: GrantsGovDetailSourceLink[];
};

export type GrantsGovDetailFallback = {
  opportunityId?: string;
  opportunityNumber?: string;
  title?: string;
  agency?: string;
  sourceUrl?: string;
};

const grantsGovDetailBaseUrl = "https://www.grants.gov/search-results-detail";

const fieldAliases: Record<keyof GrantsGovDetailFacts, string[]> = {
  title: ["opportunityTitle", "title", "oppTitle"],
  opportunityNumber: ["opportunityNumber", "oppNumber", "number", "fundingOpportunityNumber"],
  agency: ["agencyName", "agency", "owningAgencyName"],
  agencyCode: ["agencyCode", "owningAgencyCode"],
  postedDate: ["postDate", "postedDate", "openDate"],
  closeDate: ["closeDate", "closeDateExplanation"],
  archiveDate: ["archiveDate"],
  fundingInstrumentType: ["fundingInstrumentType", "fundingInstrumentTypes"],
  categoryOfFundingActivity: ["categoryOfFundingActivity", "fundingActivityCategory", "category"],
  estimatedTotalFunding: ["estimatedTotalProgramFunding", "estimatedTotalFunding", "totalFunding"],
  awardCeiling: ["awardCeiling", "awardCeilingFormatted"],
  awardFloor: ["awardFloor", "awardFloorFormatted"],
  expectedNumberOfAwards: ["expectedNumberOfAwards", "numberOfAwards"],
  costSharingOrMatchRequirement: ["costSharingOrMatchingRequirement", "costSharing", "matchRequirement"],
  assistanceListing: ["cfdaNumbers", "aln", "assistanceListings", "assistanceListingNumber"],
  eligibleApplicants: ["eligibleApplicants", "applicantEligibility", "applicantTypes"],
  eligibilityNotes: ["applicantEligibilityDesc", "eligibilityDesc", "eligibilityNotes"],
  description: ["synopsisDesc", "description", "summary", "synopsis"],
  applicantType: ["applicantType", "applicantTypes"],
  agencyContact: ["agencyContactDesc", "agencyContact", "grantorContactText", "agencyContactEmail"],
};

const directApplicantTerms = [
  "nonprofit",
  "non-profit",
  "501(c)(3)",
  "public and state controlled institutions",
  "county",
  "city or township",
  "special district",
  "health center",
  "hospital",
];

const landGrantExtensionTerms = [
  "land-grant",
  "land grant",
  "cooperative extension",
  "extension",
  "nifa",
  "rural health and safety education",
];

const fiscalTerms = ["fiscal agent", "fiscal sponsor", "fiduciary", "subrecipient"];
const coordinationTerms = ["coalition", "collaborative", "coordination", "technical assistance", "partnership"];
const clinicalResearchTerms = ["clinical trial", "nih", "r01", "r21", "human subjects", "randomized"];
const academicResearchTerms = ["research", "investigator", "university", "academic", "study protocol", "peer reviewed", "publication", "irb"];
const deliveryTerms = [
  "community health",
  "rural health",
  "healthcare access",
  "outreach",
  "extension",
  "education",
  "screening",
  "telehealth",
  "workforce",
  "equipment",
  "facility",
  "clinic",
  "patient",
  "community benefit",
  "service delivery",
];

export function buildGrantsGovDetailBody(opportunityId: string) {
  return { opportunityId };
}

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return [record.description, record.name, record.value, record.code, record.url]
      .map(normalizeText)
      .filter(Boolean)
      .join(" — ");
  }
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function findByAlias(raw: unknown, aliases: string[]): string {
  const wanted = aliases.map((alias) => alias.toLowerCase());
  const visited = new Set<unknown>();

  function walk(value: unknown): string {
    if (!value || typeof value !== "object" || visited.has(value)) return "";
    visited.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = walk(item);
        if (found) return found;
      }
      return "";
    }

    const record = value as Record<string, unknown>;
    for (const [key, child] of Object.entries(record)) {
      if (wanted.includes(key.toLowerCase())) {
        const normalized = normalizeText(child);
        if (normalized) return normalized;
      }
    }

    for (const child of Object.values(record)) {
      const found = walk(child);
      if (found) return found;
    }

    return "";
  }

  return walk(raw);
}

function collectUrls(raw: unknown): GrantsGovDetailSourceLink[] {
  const links = new Map<string, GrantsGovDetailSourceLink>();
  const visited = new Set<unknown>();

  function classify(label: string, url: string): GrantsGovDetailSourceLink["kind"] {
    const text = `${label} ${url}`.toLowerCase();
    if (text.includes("grants.gov")) return "Grants.gov";
    if (text.includes("attachment") || text.includes("nofo") || text.includes("package") || text.endsWith(".pdf")) {
      return "NOFO / Attachment";
    }
    if (text.includes("agency") || text.includes("additional information")) return "Agency";
    return "Related Source";
  }

  function add(url: string, label = "Source link") {
    if (!url.startsWith("http://") && !url.startsWith("https://")) return;
    const kind = classify(label, url);
    const safeLabel = kind === "NOFO / Attachment" ? "NOFO / attachment link — staff should verify on source" : label;
    if (!links.has(url)) links.set(url, { label: safeLabel, url, kind });
  }

  function walk(value: unknown, parentKey = "Source link") {
    if (!value || visited.has(value)) return;
    if (typeof value === "string") {
      for (const match of value.matchAll(/https?:\/\/[^\s"'<>),]+/g)) add(match[0], parentKey);
      return;
    }
    if (typeof value !== "object") return;
    visited.add(value);

    if (Array.isArray(value)) {
      value.forEach((item) => walk(item, parentKey));
      return;
    }

    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const label = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim() || parentKey;
      if (typeof child === "string") {
        add(child, label);
      }
      walk(child, label);
    }
  }

  walk(raw);
  return Array.from(links.values());
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function classifyResearchDelivery(text: string): ResearchDeliveryClassification {
  const normalized = text.toLowerCase();
  const hasClinicalResearch = includesAny(normalized, clinicalResearchTerms);
  const hasAcademicResearch = includesAny(normalized, academicResearchTerms);
  const hasDelivery = includesAny(normalized, deliveryTerms);

  if (hasClinicalResearch) return "Clinical trial / NIH-style research — Low priority by default";
  if (hasAcademicResearch && !hasDelivery) return "Research / Academic Grant — Partner Only";
  if (hasAcademicResearch && hasDelivery) return "Research terms present — verify role";
  if (hasDelivery && includesAny(normalized, ["extension", "outreach", "education", "evidence-based", "research-informed"])) {
    return "Research-informed delivery / outreach";
  }
  return "No research-heavy signal detected";
}

function classifyLikelyRole(text: string, researchClassification: ResearchDeliveryClassification): CrcfLikelyRole {
  const normalized = text.toLowerCase();

  if (researchClassification === "Clinical trial / NIH-style research — Low priority by default") return "Research Partner Only";
  if (researchClassification === "Research / Academic Grant — Partner Only") return "Research Partner Only";
  if (includesAny(normalized, landGrantExtensionTerms)) return "Partner / Coalition Participant";
  if (includesAny(normalized, fiscalTerms)) return "Fiscal/Fiduciary Support";
  if (includesAny(normalized, coordinationTerms)) return "Grant-Writing / Coordination Support";
  if (includesAny(normalized, directApplicantTerms)) return "Possible Direct Applicant";
  return "Needs Eligibility Review";
}

function summarizeFit(facts: GrantsGovDetailFacts, text: string) {
  const normalized = text.toLowerCase();
  const mayFit: string[] = [];
  const mayNotFit: string[] = [];

  if (includesAny(normalized, ["rural", "health", "healthcare", "community", "clinic"])) {
    mayFit.push("Contains rural health, healthcare access, clinic, or community-benefit language.");
  }
  if (includesAny(normalized, ["equipment", "telehealth", "workforce", "screening", "education", "outreach"])) {
    mayFit.push("Mentions delivery themes CRCF often reviews: equipment, telehealth, workforce, screening, education, or outreach.");
  }
  if (facts.closeDate) mayFit.push(`Deadline is shown for staff review: ${getDeadlineRisk(facts.closeDate)}.`);

  if (includesAny(normalized, landGrantExtensionTerms)) {
    mayNotFit.push("Eligibility or delivery may center on land-grant institutions, NIFA, or Extension partners rather than CRCF as a simple direct applicant.");
  }
  if (includesAny(normalized, clinicalResearchTerms)) {
    mayNotFit.push("Clinical trial, NIH-style, or human-subjects research language may make this low priority unless a qualified partner leads.");
  }
  if (!facts.eligibleApplicants && !facts.eligibilityNotes) {
    mayNotFit.push("No clear applicant eligibility detail was returned by the source; staff must verify manually.");
  }

  return {
    mayFit: mayFit.length ? mayFit : ["Potential fit requires human review against CRCF program, geography, applicant, and deadline requirements."],
    mayNotFit: mayNotFit.length ? mayNotFit : ["No obvious disqualifier was detected in returned detail, but source-page eligibility still controls."],
  };
}

function hasDetail(facts: GrantsGovDetailFacts) {
  return Object.values(facts).some(Boolean);
}

export function normalizeGrantsGovDetail(raw: unknown, fallback: GrantsGovDetailFallback): GrantsGovDeepSynopsis {
  const facts = Object.fromEntries(
    (Object.keys(fieldAliases) as Array<keyof GrantsGovDetailFacts>).map((key) => [key, findByAlias(raw, fieldAliases[key])]),
  ) as GrantsGovDetailFacts;

  facts.title ||= fallback.title || "Title not returned";
  facts.opportunityNumber ||= fallback.opportunityNumber || "Opportunity number not returned";
  facts.agency ||= fallback.agency || "Agency not returned";

  const grantsGovUrl = fallback.sourceUrl || (fallback.opportunityId ? `${grantsGovDetailBaseUrl}/${fallback.opportunityId}` : "https://www.grants.gov/search-grants");
  const rawLinks = collectUrls(raw);
  const sourceLinks = [
    { label: "Grants.gov detail/source link", url: grantsGovUrl, kind: "Grants.gov" as const },
    ...rawLinks.filter((link) => link.url !== grantsGovUrl),
  ];

  const combinedText = `${Object.values(facts).join(" ")} ${sourceLinks.map((link) => `${link.label} ${link.url}`).join(" ")}`;
  const researchDeliveryClassification = classifyResearchDelivery(combinedText);
  const likelyCrcfRole = classifyLikelyRole(combinedText, researchDeliveryClassification);
  const fit = summarizeFit(facts, combinedText);
  const noAdditionalDetail = !hasDetail({ ...facts, title: "", opportunityNumber: "", agency: "" });

  return {
    sourceNotice:
      "Deep synopsis is generated from public Grants.gov/detail information. It is a staff-review aid only and does not determine eligibility or recommend applying.",
    noAdditionalDetail,
    plainLanguageSummary: facts.description
      ? facts.description.slice(0, 700)
      : "No additional detail returned by source.",
    keyFacts: facts,
    eligibilityReview: facts.eligibilityNotes || facts.eligibleApplicants || "Needs eligibility review on the source page.",
    likelyCrcfRole,
    whyItMayFit: fit.mayFit,
    whyItMayNotFit: fit.mayNotFit,
    researchDeliveryClassification,
    recommendedHumanNextStep:
      "Open the direct source links, verify eligibility/deadline/geography with staff, and only then decide whether to draft an internal brief. Do not submit, email, save to external systems, or contact funders from this screen.",
    sourceLinks,
  };
}
