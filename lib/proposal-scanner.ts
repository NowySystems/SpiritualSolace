export type ProposalScanMode = "internal-need" | "external-opportunity";

export type OpportunityNoticeSummary = {
  title?: string;
  opportunityNumber?: string;
  agency?: string;
  fundingType?: string;
  category?: string;
  postedDate?: string;
  lastUpdatedDate?: string;
  deadline?: string;
  archiveDate?: string;
  totalFunding?: string;
  awardCeiling?: string;
  awardFloor?: string;
  expectedAwards?: string;
  matchRequirement?: string;
  assistanceListing?: string;
  eligibilitySummary?: string;
  description?: string;
  sourceUrl?: string;
};

export type OpportunityDatabaseDraft = {
  title: string;
  source: string;
  deadline: string;
  fundingScale: string;
  awardRange: string;
  matchRequirement: string;
  eligibilityNote: string;
  fitClassification: string;
  recommendedCrcfRole: string;
  recommendedAction: string;
  sourceReference: string;
};


export type ProposalScanResult = {
  mode: ProposalScanMode;
  detectedNeedCategory: string;
  likelyFundMatch: string;
  likelyProgramMatch: string;
  geographySignals: string[];
  populationSignals: string[];
  keywordSignals: string[];
  relatedKeywordGroups: string[];
  deadlineUrgencySignals: string[];
  sourceCategorySuggestions: string[];
  fundingTypeSuggestions: string[];
  suggestedFundingRadarSearchTerms: string[];
  recommendedNextAction: string;
  shortMatchExplanation: string;
  opportunityNoticeSummary?: OpportunityNoticeSummary;
  opportunityDatabaseDraft?: OpportunityDatabaseDraft;
  parserWarnings?: string[];
};

const fallbackTerms = ["grant", "funding", "health", "rural", "Tennessee", "community"];

function normalize(text: string) {
  return text.toLowerCase();
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term.toLowerCase()));
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function cleanValue(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/^[:\-–—]+/, "")
    .trim();
}

function linesFrom(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => cleanValue(line))
    .filter(Boolean);
}

function extractField(text: string, labels: string[]) {
  const lines = linesFrom(text);

  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const sameLinePatterns = [
      new RegExp(`^${escaped}\\s*:?\\s*(.+)$`, "i"),
      new RegExp(`^${escaped}\\s+(.+)$`, "i")
    ];

    for (const line of lines) {
      for (const pattern of sameLinePatterns) {
        const match = line.match(pattern);
        if (match?.[1]) return cleanValue(match[1]);
      }
    }

    const labelOnlyPattern = new RegExp(`^${escaped}\\s*:?\\s*$`, "i");
    const index = lines.findIndex((line) => labelOnlyPattern.test(line));
    if (index >= 0 && lines[index + 1]) return cleanValue(lines[index + 1]);
  }

  return "";
}

function extractSectionAfterHeading(text: string, headings: string[], stopHeadings: string[] = []) {
  const lines = linesFrom(text);

  for (const heading of headings) {
    const headingPattern = new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\??$`, "i");
    const index = lines.findIndex((line) => headingPattern.test(line));

    if (index >= 0) {
      const collected: string[] = [];

      for (let i = index + 1; i < lines.length; i += 1) {
        const current = lines[i];
        const hitStop = stopHeadings.some((stopHeading) =>
          new RegExp(`^${stopHeading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\??$`, "i").test(current)
        );

        if (hitStop) break;
        collected.push(current);
      }

      return cleanValue(collected.join(" "));
    }
  }

  return "";
}

function extractUrl(text: string) {
  const match = text.match(/https?:\/\/[^\s)]+/i);
  return match?.[0] ?? "";
}

function extractMoneyNear(text: string, labels: string[]) {
  const field = extractField(text, labels);
  if (field) return field;

  const lines = linesFrom(text);
  for (const label of labels) {
    const labelPattern = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const line = lines.find((candidate) => labelPattern.test(candidate) && /\$[\d,]+/.test(candidate));
    if (line) {
      const money = line.match(/\$[\d,]+(?:\.\d{2})?/);
      if (money?.[0]) return money[0];
    }
  }

  return "";
}

function detectExternalOpportunity(text: string) {
  const structuredLabels = [
    "Funding Opportunity Number",
    "Funding Opportunity Title",
    "Opportunity Category",
    "Funding Instrument Type",
    "Category of Funding Activity",
    "Assistance Listings",
    "Cost Sharing or Matching Requirement",
    "Matching Funds Requirement",
    "Posted Date",
    "Closing Date",
    "Current Closing Date for Applications",
    "Application Deadline",
    "Amount of Funding Available",
    "Estimated Total Program Funding",
    "Maximum Grant Amount",
    "Minimum Grant Amount",
    "Award Ceiling",
    "Award Floor",
    "Expected Number of Awards",
    "Eligible Applicants",
    "Who may apply",
    "Additional Information on Eligibility",
    "Agency Name",
    "What does this program do",
    "Description"
  ];

  return structuredLabels.some((label) => new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text));
}

function buildDeadlineRisk(deadline: string) {
  if (!deadline) return "No deadline extracted";

  const parsed = Date.parse(deadline);
  if (Number.isNaN(parsed)) return `Deadline found: ${deadline}`;

  const days = Math.ceil((parsed - Date.now()) / (1000 * 60 * 60 * 24));

  if (days < 0) return `Deadline passed: ${deadline}`;
  if (days <= 14) return `Urgent deadline: ${deadline}`;
  if (days <= 45) return `Deadline soon: ${deadline}`;
  return `Deadline found: ${deadline}`;
}

function makeAwardRange(floor: string, ceiling: string) {
  if (floor && ceiling) return `${floor} to ${ceiling}`;
  if (ceiling) return `Up to ${ceiling}`;
  if (floor) return `From ${floor}`;
  return "Needs review";
}

function analyzeExternalOpportunity(text: string): ProposalScanResult {
  const normalized = normalize(text);

  const title = extractField(text, [
    "Funding Opportunity Title",
    "Opportunity Title",
    "Program",
    "Program Title",
    "Title"
  ]);

  const opportunityNumber = extractField(text, [
    "Funding Opportunity Number",
    "Opportunity Number",
    "FOA Number",
    "Notice Number"
  ]);

  const agency = extractField(text, [
    "Agency Name",
    "Agency",
    "Department",
    "Federal Agency"
  ]);

  const fundingType =
    extractField(text, ["Funding Instrument Type", "Funding Type", "Instrument Type"]) ||
    (includesAny(normalized, ["grant"]) ? "Grant" : "Needs review");

  const category = extractField(text, [
    "Category of Funding Activity",
    "Opportunity Category",
    "Category",
    "Funding Category"
  ]);

  const postedDate = extractField(text, ["Posted Date", "Date Posted", "Publication Date"]);
  const lastUpdatedDate = extractField(text, ["Last Updated Date", "Updated Date", "Last Updated"]);

  const deadline = extractField(text, [
    "Current Closing Date for Applications",
    "Original Closing Date for Applications",
    "Closing Date for Applications",
    "Application Deadline",
    "Closing Date",
    "Deadline",
    "Due Date"
  ]);

  const archiveDate = extractField(text, ["Archive Date"]);

  const totalFunding = extractMoneyNear(text, [
    "Estimated Total Program Funding",
    "Amount of Funding Available",
    "Total Program Funding",
    "Total Funding",
    "Funding Available"
  ]);

  const awardCeiling = extractMoneyNear(text, [
    "Award Ceiling",
    "Maximum Grant Amount",
    "Maximum Award",
    "Max Award",
    "Maximum Funding Amount"
  ]);

  const awardFloor = extractMoneyNear(text, [
    "Award Floor",
    "Minimum Grant Amount",
    "Minimum Award",
    "Min Award",
    "Minimum Funding Amount"
  ]);

  const expectedAwards = extractField(text, [
    "Expected Number of Awards",
    "Number of Awards",
    "Expected Awards"
  ]);

  const matchRequirement =
    extractField(text, [
      "Cost Sharing or Matching Requirement",
      "Matching Funds Requirement",
      "Match Requirement",
      "Cost Share",
      "Cost Sharing",
      "Matching Requirement"
    ]) || (includesAny(normalized, ["matching funds requirement: none", "match requirement: none"]) ? "None" : "");

  const assistanceListing = extractField(text, [
    "Assistance Listings",
    "Assistance Listing",
    "Assistance Listing Number",
    "CFDA",
    "ALN"
  ]);

  const eligibilitySummary =
    extractField(text, ["Eligible Applicants", "Eligibility", "Who may apply", "Applicant Eligibility"]) ||
    extractSectionAfterHeading(text, ["Who may apply", "Eligibility"], [
      "What does this program do",
      "How may funds be used",
      "Contact",
      "Additional Information"
    ]);

  const description =
    extractField(text, ["Description", "Program Description"]) ||
    extractSectionAfterHeading(text, ["What does this program do", "Description"], [
      "Who may apply",
      "How may funds be used",
      "Contact",
      "Additional Information",
      "Eligibility"
    ]);

  const sourceUrl = extractUrl(text);

  const keywordSignals = unique([
    includesAny(normalized, ["rural", "delta", "underserved", "frontier"]) ? "rural health" : "",
    includesAny(normalized, ["health", "healthcare", "clinic", "urgent care"]) ? "healthcare access" : "",
    includesAny(normalized, ["equipment", "dme", "medical equipment"]) ? "equipment" : "",
    includesAny(normalized, ["workforce", "staffing", "training"]) ? "workforce" : "",
    includesAny(normalized, ["consortium", "coalition", "partnership", "group of three", "cooperation"]) ? "coalition" : "",
    includesAny(normalized, ["facility", "construction", "renovation", "building", "land"]) ? "capital/facility" : "",
    includesAny(normalized, ["cancer", "screening", "mammogram"]) ? "cancer screening" : "",
    includesAny(normalized, ["mental", "behavioral"]) ? "behavioral health" : "",
    fundingType && fundingType !== "Needs review" ? fundingType.toLowerCase() : "",
    category ? category.toLowerCase() : ""
  ]);

  const relatedKeywordGroups = unique([
    "Funding signals",
    includesAny(normalized, ["rural", "delta", "underserved"]) ? "Rural healthcare access" : "",
    includesAny(normalized, ["consortium", "coalition", "partnership", "group of three", "cooperation"])
      ? "Coalition / fiduciary / backbone organization"
      : "",
    includesAny(normalized, ["facility", "construction", "renovation", "building", "land"])
      ? "Capital / facilities / construction / renovation"
      : "",
    includesAny(normalized, ["equipment", "dme", "medical equipment"]) ? "Clinical equipment / DME / mobility" : "",
    includesAny(normalized, ["cancer", "screening", "mammogram"]) ? "Cancer screening/support" : "",
    includesAny(normalized, ["workforce", "staffing", "training"]) ? "Workforce / staffing / capacity building" : ""
  ]);

  const recommendedCrcfRole = includesAny(normalized, ["consortium", "coalition", "group of three", "partnership", "cooperation"])
    ? "Possible coalition/fiduciary/partner role. CRCF may support grant writing, coordination, fiscal stewardship, or partnership structure after eligibility review."
    : "Needs eligibility review before determining whether CRCF is a direct applicant, partner, or support organization.";

  const fitClassification = includesAny(normalized, ["rural", "health", "healthcare", "clinic", "underserved", "unmet health"])
    ? "Strategic Growth Lead / Rural Healthcare Access / Needs Eligibility Review"
    : "Needs Eligibility Review";

  const deadlineSignals = [buildDeadlineRisk(deadline)];

  const sourceCategories = unique([
    agency || /grants\.gov/i.test(text) ? "Federal / Grants.gov" : "",
    includesAny(normalized, ["rural", "delta", "underserved"]) ? "Rural healthcare access" : "",
    includesAny(normalized, ["facility", "construction", "renovation", "building", "land"]) ? "Capital / Facilities" : "",
    includesAny(normalized, ["coalition", "consortium", "partnership"]) ? "Coalition / Fiscal Agent" : "",
    includesAny(normalized, ["equipment", "dme"]) ? "Equipment Funding" : ""
  ]);

  const searchTerms = unique([
    title,
    opportunityNumber,
    agency,
    "rural health",
    "healthcare access",
    "Tennessee",
    ...keywordSignals
  ]).slice(0, 12);

  const parserWarnings = unique([
    !deadline ? "Deadline was not found. Paste the Grants.gov closing date section if available." : "",
    !totalFunding && !awardCeiling && !awardFloor ? "Funding amount fields were not found." : "",
    !eligibilitySummary ? "Eligibility text was not found. Paste the eligible applicant section if available." : "",
    !title ? "Opportunity title was not found." : ""
  ]);

  const awardRange = makeAwardRange(awardFloor, awardCeiling);
  const fundingScale = unique([
    totalFunding ? `Total funding: ${totalFunding}` : "",
    awardRange !== "Needs review" ? `Award range: ${awardRange}` : "",
    expectedAwards ? `Expected awards: ${expectedAwards}` : ""
  ]).join(" · ") || "Needs review";

  const recommendedNextAction =
    "Confirm deadline, geography, applicant eligibility, coalition structure, funding restrictions, and CRCF/CRMC role. If plausible, prepare a one-page internal match brief before any external action.";

  return {
    mode: "external-opportunity",
    detectedNeedCategory: "External Funding Opportunity Text",
    likelyFundMatch: "Community Health / Strategic Growth",
    likelyProgramMatch: "Rural healthcare access / coalition or partner opportunity",
    geographySignals: unique([
      includesAny(normalized, ["tennessee", "tn"]) ? "Tennessee" : "",
      includesAny(normalized, ["rural", "delta", "appalachian", "underserved"]) ? "Rural / underserved geography" : "",
      includesAny(normalized, ["upper cumberland"]) ? "Upper Cumberland" : "",
      includesAny(normalized, ["delta region"]) ? "Delta Region" : ""
    ]),
    populationSignals: unique([
      includesAny(normalized, ["underserved", "unmet", "poverty", "low-income"]) ? "Underserved communities" : "",
      includesAny(normalized, ["patients", "healthcare", "clinic", "health professionals"]) ? "Healthcare access population" : "",
      includesAny(normalized, ["rural"]) ? "Rural residents" : ""
    ]),
    keywordSignals: keywordSignals.length ? keywordSignals : fallbackTerms,
    relatedKeywordGroups: relatedKeywordGroups.length ? relatedKeywordGroups : ["Funding signals"],
    deadlineUrgencySignals: deadlineSignals,
    sourceCategorySuggestions: sourceCategories.length ? sourceCategories : ["Federal / Grants.gov", "Needs source review"],
    fundingTypeSuggestions: unique([fundingType || "Grant", "Strategic Growth Lead"]),
    suggestedFundingRadarSearchTerms: searchTerms.length ? searchTerms : fallbackTerms,
    recommendedNextAction,
    shortMatchExplanation:
      "Structured opportunity fields were detected. This appears to be an external funding notice and should be reviewed for fit, eligibility, geography, deadline, funding scale, and possible CRCF partner/fiduciary role.",
    opportunityNoticeSummary: {
      title,
      opportunityNumber,
      agency,
      fundingType,
      category,
      postedDate,
      lastUpdatedDate,
      deadline,
      archiveDate,
      totalFunding,
      awardCeiling,
      awardFloor,
      expectedAwards,
      matchRequirement,
      assistanceListing,
      eligibilitySummary,
      description,
      sourceUrl
    },
    opportunityDatabaseDraft: {
      title: title || "Untitled external opportunity",
      source: agency || "External funding source",
      deadline: deadline || "Needs review",
      fundingScale,
      awardRange,
      matchRequirement: matchRequirement || "Needs review",
      eligibilityNote: eligibilitySummary || "Needs eligibility review",
      fitClassification,
      recommendedCrcfRole,
      recommendedAction: "Add to Opportunity Database as Needs Eligibility Review after staff confirms source, eligibility, geography, and deadline.",
      sourceReference: sourceUrl || "No source URL detected"
    },
    parserWarnings
  };
}

function analyzeInternalNeed(text: string): ProposalScanResult {
  const normalized = normalize(text);

  const isCancer = includesAny(normalized, ["cancer", "mammogram", "screening", "pink ribbon"]);
  const isEquipment = includesAny(normalized, ["equipment", "dme", "wheelchair", "walker", "mobility"]);
  const isCpr = includesAny(normalized, ["cpr", "aed", "heart", "cardiac"]);
  const isHospice = includesAny(normalized, ["hospice", "palliative", "caregiver", "end-of-life"]);
  const isMental = includesAny(normalized, ["mental", "behavioral", "substance"]);
  const isUrgentCare = includesAny(normalized, ["urgent care", "clinic", "facility", "exam room", "telehealth"]);
  const isWorkforce = includesAny(normalized, ["workforce", "staffing", "training", "capacity"]);
  const isHardship = includesAny(normalized, ["transportation", "utilities", "food", "rent", "hardship"]);

  const detectedNeedCategory =
    (isCancer && "Cancer screening/support") ||
    (isEquipment && "Medical equipment / DME / mobility") ||
    (isCpr && "Heart health / CPR / AED") ||
    (isHospice && "Hospice/palliative/caregiver support") ||
    (isMental && "Mental health / behavioral health") ||
    (isUrgentCare && "Urgent care / clinic expansion") ||
    (isWorkforce && "Workforce / staffing / capacity building") ||
    (isHardship && "Transportation / utilities / food hardship") ||
    "General community health / funding concept";

  const likelyFundMatch =
    (isCancer && "Cancer Patient Assistance") ||
    (isHospice && "Hospice Patient Assistance") ||
    (isMental && "Mental Health Patient Assistance") ||
    (isCpr && "Heart Patient Assistance") ||
    (isWorkforce && "Empower UC") ||
    "Community Health";

  const likelyProgramMatch =
    (isCancer && "Pink Ribbon screening navigation") ||
    (isEquipment && "Equipment Closet / home recovery support") ||
    (isCpr && "CPR/AED training and emergency readiness") ||
    (isHospice && "Hospice comfort and caregiver support") ||
    (isUrgentCare && "Rural healthcare access expansion") ||
    (isWorkforce && "Regional healthcare workforce capacity") ||
    "Community health outreach and prevention";

  const geographySignals = unique([
    includesAny(normalized, ["tennessee", "tn"]) ? "Tennessee" : "",
    includesAny(normalized, ["upper cumberland", "cookeville", "putnam"]) ? "Upper Cumberland" : "",
    includesAny(normalized, ["rural", "underserved"]) ? "Rural / underserved community" : ""
  ]);

  const populationSignals = unique([
    includesAny(normalized, ["uninsured", "underinsured"]) ? "Uninsured / underinsured" : "",
    includesAny(normalized, ["family", "children", "pediatric"]) ? "Families / pediatric" : "",
    includesAny(normalized, ["senior", "aging, disabled"]) ? "Seniors / disability" : "",
    includesAny(normalized, ["patients", "community", "residents"]) ? "Community residents" : ""
  ]);

  const keywordSignals = unique([
    isCancer ? "cancer screening" : "",
    isEquipment ? "medical equipment" : "",
    isCpr ? "CPR/AED" : "",
    isHospice ? "hospice/caregiver support" : "",
    isMental ? "behavioral health" : "",
    isUrgentCare ? "urgent care / clinic expansion" : "",
    isWorkforce ? "workforce / staffing" : "",
    isHardship ? "hardship support" : "",
    includesAny(normalized, ["rural", "underserved"]) ? "rural healthcare access" : "",
    includesAny(normalized, ["deadline", "due", "closing"]) ? "deadline signal" : ""
  ]);

  const relatedKeywordGroups = unique([
    detectedNeedCategory,
    includesAny(normalized, ["rural", "underserved"]) ? "Rural healthcare access" : "",
    includesAny(normalized, ["tennessee", "upper cumberland"]) ? "Tennessee / Upper Cumberland" : "",
    "Funding signals"
  ]);

  const sourceCategorySuggestions = unique([
    "Grants.gov",
    "Tennessee Department of Health",
    isUrgentCare || isEquipment ? "USDA Rural Development / Community Facilities" : "",
    isWorkforce ? "HRSA / workforce sources" : "",
    isCancer ? "Cancer foundations / public health sources" : "",
    isEquipment ? "Corporate giving / equipment funders" : "",
    "FoundationSearch / private foundation research"
  ]);

  const fundingTypeSuggestions = unique([
    "Grant",
    isUrgentCare ? "Capital / Facilities" : "",
    isEquipment ? "Equipment Funding" : "",
    isWorkforce ? "Workforce / Staffing" : "",
    isHardship ? "Hardship / SDOH Support" : "",
    "Corporate Giving",
    "Private Foundation Funding"
  ]);

  const suggestedFundingRadarSearchTerms = unique([
    detectedNeedCategory,
    likelyFundMatch,
    likelyProgramMatch,
    ...keywordSignals,
    ...geographySignals,
    ...sourceCategorySuggestions
  ]).slice(0, 12);

  return {
    mode: "internal-need",
    detectedNeedCategory,
    likelyFundMatch,
    likelyProgramMatch,
    geographySignals: geographySignals.length ? geographySignals : ["No clear geography detected"],
    populationSignals: populationSignals.length ? populationSignals : ["No clear population signal detected"],
    keywordSignals: keywordSignals.length ? keywordSignals : fallbackTerms,
    relatedKeywordGroups,
    deadlineUrgencySignals: includesAny(normalized, ["deadline", "due", "closing", "urgent"])
      ? ["Urgency/deadline language detected"]
      : ["No deadline signal detected"],
    sourceCategorySuggestions,
    fundingTypeSuggestions,
    suggestedFundingRadarSearchTerms,
    recommendedNextAction:
      "Use the suggested search terms in Funding Radar or approved sources. Human review is required before any external action.",
    shortMatchExplanation:
      "The scanner used local/static keyword matching to classify the pasted non-sensitive need into likely funds, programs, source categories, and search terms."
  };
}

export function analyzeProposalText(text: string): ProposalScanResult {
  const cleanedText = text.trim();

  if (!cleanedText) {
    return {
      mode: "internal-need",
      detectedNeedCategory: "No text entered",
      likelyFundMatch: "Needs review",
      likelyProgramMatch: "Needs review",
      geographySignals: [],
      populationSignals: [],
      keywordSignals: [],
      relatedKeywordGroups: [],
      deadlineUrgencySignals: [],
      sourceCategorySuggestions: [],
      fundingTypeSuggestions: [],
      suggestedFundingRadarSearchTerms: [],
      recommendedNextAction: "Paste non-sensitive text and analyze locally.",
      shortMatchExplanation: "No text was available to scan."
    };
  }

  if (detectExternalOpportunity(cleanedText)) {
    return analyzeExternalOpportunity(cleanedText);
  }

  return analyzeInternalNeed(cleanedText);
}
