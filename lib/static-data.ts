import { keywordCategorySnapshot } from "@/lib/keyword-registry";
import { opportunityDatabaseSnapshot } from "@/lib/opportunity-database";
import { sourceDatabaseSnapshot } from "@/lib/source-database";

export const saveState = "SpiritualSolace 0.2c — Corrected landing hero and dove brand direction";
export const compatibilityBaseline = "SpiritualSolace 0.1 — One-way temporary support messaging baseline";

export const legacyNavigationAudit = ["/grants-gov-live", "/learning-loop", "/daily-brief"];

export const learningLoopValidationNote = "Future memory layer will improve recommendations using staff feedback, source quality, outcomes, and daily source changes.";

export const navigationItems = [
  { label: "Dashboard", href: "/app" },
  { label: "Support Requests", href: "/app/support-requests" },
  { label: "Approved Responders", href: "/app/approved-responders" },
  { label: "Message Review", href: "/app/message-review" },
  { label: "Facility Rules", href: "/app/facility-rules" },
  { label: "Patient View", href: "/app/patient-view" },
  { label: "Audit Log", href: "/app/audit-log" },
  { label: "Guardrails", href: "/app/guardrails" },
];


export const fundingTypes = [
  "Grant",
  "RFP",
  "RFA",
  "NOFO",
  "Appropriation",
  "Corporate Giving",
  "Foundation Funding",
  "Sponsorship",
  "Community Investment",
  "Private/Local Funding Lead",
  "Capital / Facilities",
  "Equipment Funding",
  "Workforce / Staffing",
  "Coalition / Fiscal Agent",
  "Public-Private Partnership",
];

export const fundingStatuses = [
  "New Lead",
  "Likely Fit",
  "Possible Fit",
  "Needs Eligibility Review",
  "Deadline Soon",
  "Ready to Prepare",
  "Strategic Growth Lead",
  "Scope Expansion Candidate",
  "Partner Opportunity",
  "Capital Stack Candidate",
  "Coalition Funding Candidate",
  "Facility / Urgent Care Candidate",
  "Administrative Capacity Candidate",
  "Needs Leadership Review",
  "Watch Next Cycle",
  "Archived",
];

export type FundingOpportunity = {
  title: string;
  fundingType: string;
  sourceName: string;
  sourceTier: string;
  sourceCategory: string;
  deadline: string;
  deadlineRisk: string;
  status: string;
  fundMatch: string;
  programMatch: string;
  geographyFit: string;
  confidence: string;
  estimatedEffort: string;
  matchRequirement: string;
  recommendedAction: string;
  shortMatchExplanation: string;
  keywordSignals: string[];
  keywordGroupMatches?: string[];
  lastCheckedDate: string;
};

export const fundingOpportunities: FundingOpportunity[] = [];

export const grantLeads = fundingOpportunities;

export const sourceTierDefinitions = [
  {
    tier: "Tier 1",
    label: "Primary official funding sources",
    examples: "Official public portals and federal funding sources.",
    categories: [
      "Federal grant portal",
      "Federal health agency",
      "Federal assistance listings",
    ],
    posture: "Future API / public reference",
  },
  {
    tier: "Tier 2",
    label: "Federal/state adjacent sources",
    examples: "Tennessee departments and federal rural/health program sources.",
    categories: [
      "Tennessee health agency",
      "Tennessee human services",
      "Federal rural development",
    ],
    posture: "Public page / staff review",
  },
  {
    tier: "Tier 3",
    label: "Subscription/foundation research sources",
    examples:
      "Paid or subscription research products that may help staff spot funding leads.",
    categories: ["Subscription grant leads", "Foundation prospect research"],
    posture: "Authorized user review / export-assisted",
  },
  {
    tier: "Tier 4",
    label: "Private/corporate/local funders",
    examples:
      "Corporate foundations, private funders, community foundations, and local giving pages.",
    categories: [
      "Corporate foundation pages",
      "Private/local funders",
      "Community foundations",
    ],
    posture: "Public page / approved research",
  },
  {
    tier: "Tier 5",
    label: "Donor/advisor/professional network sources",
    examples: "Internal context and future prospect-research references only.",
    categories: [
      "Internal CRM reference",
      "Prospect research reference",
      "Historical event context",
    ],
    posture: "Reference only",
  },
  {
    tier: "Tier 6",
    label: "Capital/financing/appropriations sources",
    examples:
      "Capital, facility, CDFI, appropriations, and public-private financing sources.",
    categories: [
      "Capital / Facilities",
      "CDFI",
      "Appropriations",
      "Public-private partnership",
    ],
    posture: "Leadership review / partner required",
  },
];

export const sourceTiers = sourceTierDefinitions;

export const sourceRegistry = [
  {
    id: "src-grants-gov",
    name: "Grants.gov",
    tier: "Tier 1",
    type: "Federal portal",
    category: "Federal grant portal",
    urlReference: "https://www.grants.gov/",
    accessType: "Public website",
    relatedFundCategories: [
      "Community Health",
      "Cancer Patient Assistance",
      "Caring Hands",
      "Empower UC",
    ],
    relatedProgramCategories: [
      "Federal NOFOs",
      "Rural health",
      "Healthcare access",
      "Capacity building",
    ],
    bestKeywordSignals: [
      "NOFO",
      "grant",
      "healthcare access",
      "rural health",
      "patient assistance",
    ],
    checkFrequency: "Weekly",
    lastCheckedDate: "2026-05-13",
    reliability: "High",
    connectionStatus: "Approved Read-Only API",
    currentStatus: "Active Watch",
    usefulFor:
      "Official federal grant notices, manual live searches, and Proposal-to-Grants match review.",
    recommendedStaffAction:
      "Use the approved read-only live connector for staff-reviewed health-access, rural-health, and community-benefit opportunities.",
    notes:
      "CRCF 1.3 keeps approved read-only Grants.gov search and staff-triggered detail enrichment routes; no saves, submissions, emails, crawling, or scraping.",
  },
  {
    id: "src-tn-health",
    name: "Tennessee Department of Health",
    tier: "Tier 2",
    type: "State agency",
    category: "Tennessee health agency",
    urlReference: "https://www.tn.gov/health.html",
    accessType: "Public website",
    relatedFundCategories: [
      "Community Health",
      "Cancer Patient Assistance",
      "Diabetes Patient Assistance",
      "Heart Patient Assistance",
    ],
    relatedProgramCategories: [
      "Prevention",
      "Screening",
      "Public health",
      "Community health outreach",
    ],
    bestKeywordSignals: [
      "prevention",
      "screening",
      "public health",
      "rural Tennessee",
      "healthcare access",
    ],
    checkFrequency: "Biweekly",
    lastCheckedDate: "2026-05-13",
    reliability: "High",
    connectionStatus: "Future Public Page Parser",
    currentStatus: "Active Watch",
    usefulFor:
      "Tennessee public-health funding signals, program priorities, and health opportunities.",
    recommendedStaffAction:
      "Review public funding pages for notices, program priorities, and grant links relevant to CRCF.",
    notes:
      "Public page monitor candidate; no scraping or source-system updates in CRCF 0.8.",
  },
  {
    id: "src-hrsa",
    name: "HRSA / Federal Office of Rural Health Policy",
    tier: "Tier 1",
    type: "Federal agency",
    category: "Federal health agency",
    urlReference: "https://www.hrsa.gov/grants",
    accessType: "Public website",
    relatedFundCategories: ["Community Health", "Caring Hands", "Empower UC"],
    relatedProgramCategories: [
      "Rural health",
      "Healthcare access",
      "Workforce",
      "Health-center support",
    ],
    bestKeywordSignals: [
      "rural health",
      "healthcare access",
      "workforce",
      "underserved",
      "capacity building",
    ],
    checkFrequency: "Weekly",
    lastCheckedDate: "2026-05-13",
    reliability: "High",
    connectionStatus: "Future Public Page Parser",
    currentStatus: "Active Watch",
    usefulFor: "Official federal health and rural-health grant opportunities.",
    recommendedStaffAction:
      "Review for rural-health, workforce, and access opportunities; verify applicant eligibility before drafting.",
    notes: "Reference only; no live connector in CRCF 0.8.",
  },
  {
    id: "src-usda-rural-development",
    name: "USDA Rural Development Community Facilities",
    tier: "Tier 6",
    type: "Federal rural development",
    category: "Capital / Facilities",
    urlReference:
      "https://www.rd.usda.gov/programs-services/community-facilities",
    accessType: "Public website",
    relatedFundCategories: ["Community Health", "Home Health", "Empower UC"],
    relatedProgramCategories: [
      "Rural facilities",
      "Community facilities",
      "Equipment",
      "Capacity building",
    ],
    bestKeywordSignals: [
      "community facilities",
      "rural development",
      "equipment",
      "clinic",
      "facility",
    ],
    checkFrequency: "Monthly",
    lastCheckedDate: "2026-05-13",
    reliability: "High",
    connectionStatus: "Manual Check",
    currentStatus: "High Priority",
    usefulFor:
      "Rural community facility, equipment, capital, and capacity-building funding context.",
    recommendedStaffAction:
      "Review for urgent care, rural clinic, equipment, land/building, renovation, and capital stack strategy.",
    notes: "Capital/facility source; leadership review required before action.",
  },
  {
    id: "src-sam-assistance-listings",
    name: "SAM.gov Assistance Listings",
    tier: "Tier 1",
    type: "Federal listings",
    category: "Federal assistance listings",
    urlReference: "https://sam.gov/content/assistance-listings",
    accessType: "Public website",
    relatedFundCategories: ["Community Health", "Caring Hands", "Empower UC"],
    relatedProgramCategories: [
      "Assistance listings",
      "Federal eligibility research",
      "Program mapping",
    ],
    bestKeywordSignals: [
      "assistance listings",
      "eligibility",
      "federal program",
      "health",
      "rural",
    ],
    checkFrequency: "Monthly",
    lastCheckedDate: "2026-05-13",
    reliability: "High",
    connectionStatus: "Static Reference Only",
    currentStatus: "Manual Check",
    usefulFor: "Federal program context and eligibility research.",
    recommendedStaffAction:
      "Use as a reference when staff need federal assistance-listing context for a potential lead.",
    notes: "No login/session capture or automated query.",
  },
  {
    id: "src-arc",
    name: "Appalachian Regional Commission",
    tier: "Tier 6",
    type: "Regional federal-state commission",
    category: "Capital / Facilities",
    urlReference: "https://www.arc.gov/grants-and-opportunities/",
    accessType: "Public website",
    relatedFundCategories: ["Community Health", "Empower UC"],
    relatedProgramCategories: [
      "Regional infrastructure",
      "Workforce",
      "Rural development",
      "Capital projects",
    ],
    bestKeywordSignals: [
      "Appalachian",
      "infrastructure",
      "workforce",
      "rural",
      "capital",
    ],
    checkFrequency: "Monthly",
    lastCheckedDate: "2026-05-13",
    reliability: "High",
    connectionStatus: "Manual Check",
    currentStatus: "High Priority",
    usefulFor:
      "Regional infrastructure, workforce, and community development funding relevant to rural healthcare access.",
    recommendedStaffAction:
      "Review county eligibility and capital/facility fit with leadership before any action.",
    notes: "Partner/leadership review source.",
  },
  {
    id: "src-foundationsearch",
    name: "FoundationSearch",
    tier: "Tier 3",
    type: "Subscription prospect research",
    category: "Foundation prospect research",
    urlReference: "https://www.foundationsearch.com/",
    accessType: "Subscription",
    relatedFundCategories: ["Community Health", "Caring Hands", "Empower UC"],
    relatedProgramCategories: [
      "Foundation prospecting",
      "Private foundation research",
      "Giving-history context",
    ],
    bestKeywordSignals: [
      "foundation",
      "health",
      "community benefit",
      "giving history",
      "prospect",
    ],
    checkFrequency: "Monthly if subscribed",
    lastCheckedDate: "2026-05-13",
    reliability: "Medium",
    connectionStatus: "Subscription Source",
    currentStatus: "Subscription Required",
    usefulFor:
      "Foundation prospect research and lead context requiring staff verification.",
    recommendedStaffAction:
      "Use approved subscription access only; export/import only if allowed by subscription terms.",
    notes:
      "No automated login scraping, private donor data, or credential capture.",
  },
  {
    id: "src-grantstation",
    name: "GrantStation",
    tier: "Tier 3",
    type: "Subscription lead source",
    category: "Subscription grant leads",
    urlReference: "https://grantstation.com/",
    accessType: "Subscription",
    relatedFundCategories: ["Community Health", "Empower UC", "Caring Hands"],
    relatedProgramCategories: [
      "Grant prospecting",
      "Foundation leads",
      "Federal/state summaries",
    ],
    bestKeywordSignals: [
      "grant prospecting",
      "health",
      "capacity building",
      "rural",
      "foundation",
    ],
    checkFrequency: "Weekly if subscribed",
    lastCheckedDate: "2026-05-13",
    reliability: "Medium",
    connectionStatus: "Subscription Source",
    currentStatus: "Subscription Required",
    usefulFor:
      "Subscription-based prospecting and manually screened lead generation.",
    recommendedStaffAction:
      "Use only with approved staff access; capture no credentials and verify leads manually.",
    notes: "Static registry entry only.",
  },
  {
    id: "src-grantwatch",
    name: "GrantWatch",
    tier: "Tier 3",
    type: "Subscription lead source",
    category: "Subscription grant leads",
    urlReference: "https://www.grantwatch.com/",
    accessType: "Subscription",
    relatedFundCategories: [
      "Community Health",
      "Cancer Patient Assistance",
      "Hospice Patient Assistance",
      "Caring Hands",
    ],
    relatedProgramCategories: [
      "Grant lead discovery",
      "Health grants",
      "Community benefit",
    ],
    bestKeywordSignals: [
      "health grants",
      "community health",
      "cancer",
      "hospice",
      "patient assistance",
    ],
    checkFrequency: "Weekly if subscribed",
    lastCheckedDate: "2026-05-13",
    reliability: "Medium",
    connectionStatus: "Subscription Source",
    currentStatus: "Subscription Required",
    usefulFor:
      "Potential lead discovery when staff manually verify primary sources.",
    recommendedStaffAction:
      "Do not rely on listing alone; verify any potential lead against the funder or official source.",
    notes: "Subscription source only; no credentials or scraping.",
  },
  {
    id: "src-corporate-foundation-pages",
    name: "Corporate foundation pages",
    tier: "Tier 4",
    type: "Corporate funder pages",
    category: "Corporate foundation pages",
    urlReference:
      "Staff-maintained list of approved corporate foundation pages",
    accessType: "Public websites",
    relatedFundCategories: [
      "Community Health",
      "Heart Patient Assistance",
      "Home Health",
      "Empower UC",
    ],
    relatedProgramCategories: [
      "Corporate giving",
      "Community benefit",
      "Sponsorship",
      "Employee giving",
    ],
    bestKeywordSignals: [
      "corporate giving",
      "community benefit",
      "sponsorship",
      "wellness",
      "employee giving",
    ],
    checkFrequency: "Monthly",
    lastCheckedDate: "2026-05-13",
    reliability: "Medium",
    connectionStatus: "Future Public Page Parser",
    currentStatus: "Manual Check",
    usefulFor:
      "Corporate giving windows, sponsorship criteria, and community-benefit themes.",
    recommendedStaffAction:
      "Review manually before events or campaign planning; confirm restrictions with staff.",
    notes: "No automated outreach or source updates.",
  },
  {
    id: "src-private-local-funders",
    name: "Private/local funders",
    tier: "Tier 4",
    type: "Local funder references",
    category: "Private/local funders",
    urlReference: "Staff-maintained local funder reference list",
    accessType: "Public/reference only",
    relatedFundCategories: [
      "Caring Hands",
      "Hospice Patient Assistance",
      "Pediatric Patient Assistance",
      "Community Health",
    ],
    relatedProgramCategories: [
      "Local trusts",
      "Civic giving",
      "Family foundations",
      "Private local leads",
    ],
    bestKeywordSignals: [
      "local giving",
      "family foundation",
      "trust",
      "hospice",
      "basic needs",
    ],
    checkFrequency: "Monthly",
    lastCheckedDate: "2026-05-13",
    reliability: "Medium",
    connectionStatus: "Manual Check",
    currentStatus: "Active Watch",
    usefulFor:
      "Local trust, family foundation, civic, and private funding leads in aggregate only.",
    recommendedStaffAction:
      "Collect eligibility and restrictions for staff review; do not use private donor records.",
    notes: "Aggregate/source-reference context only.",
  },
  {
    id: "src-community-foundations",
    name: "Community foundations",
    tier: "Tier 4",
    type: "Community foundation references",
    category: "Community foundations",
    urlReference: "Staff-maintained community foundation reference list",
    accessType: "Public/reference only",
    relatedFundCategories: ["Community Health", "Caring Hands", "Empower UC"],
    relatedProgramCategories: [
      "Community grants",
      "Regional funds",
      "Donor-advised public opportunities",
    ],
    bestKeywordSignals: [
      "community foundation",
      "community grants",
      "regional",
      "Upper Cumberland",
      "health",
    ],
    checkFrequency: "Monthly",
    lastCheckedDate: "2026-05-13",
    reliability: "Medium",
    connectionStatus: "Manual Check",
    currentStatus: "Active Watch",
    usefulFor:
      "Regional community foundation grant cycles and public program-fit research.",
    recommendedStaffAction:
      "Check monthly for public application cycles and eligibility notes.",
    notes: "No donor-advised fund records or private donor data imported.",
  },
  {
    id: "src-donorperfect-reference",
    name: "DonorPerfect",
    tier: "Tier 5",
    type: "Internal donor CRM reference",
    category: "Internal CRM reference",
    urlReference: "Internal CRM reference only",
    accessType: "Internal system - not connected",
    relatedFundCategories: ["Community Health", "Caring Hands"],
    relatedProgramCategories: [
      "Internal donor CRM context",
      "Human-reviewed strategy",
    ],
    bestKeywordSignals: [
      "internal CRM",
      "donor context",
      "relationship review",
    ],
    checkFrequency: "As directed by staff",
    lastCheckedDate: "2026-05-13",
    reliability: "High for internal staff context",
    connectionStatus: "Not Connected",
    currentStatus: "Needs Setup",
    usefulFor:
      "Internal donor CRM context only when staff review records outside this app.",
    recommendedStaffAction:
      "Keep disconnected; never paste exports or private donor records into the app.",
    notes:
      "Reference only; no DonorPerfect writes, reads, imports, exports, or API calls.",
  },
  {
    id: "src-donorsearch-reference",
    name: "DonorSearch",
    tier: "Tier 5",
    type: "Future prospect research reference",
    category: "Prospect research reference",
    urlReference: "Future prospect research reference only",
    accessType: "Not connected",
    relatedFundCategories: ["Community Health", "Empower UC"],
    relatedProgramCategories: [
      "Prospect research",
      "Advisor network context",
      "Aggregate market intelligence",
    ],
    bestKeywordSignals: [
      "prospect research",
      "wealth screening",
      "advisor network",
      "planned giving",
    ],
    checkFrequency: "Future review",
    lastCheckedDate: "2026-05-13",
    reliability: "Not assessed",
    connectionStatus: "Future Integration Candidate",
    currentStatus: "Needs Setup",
    usefulFor:
      "Future prospect research reference only after governance approval.",
    recommendedStaffAction:
      "Do not connect in MVP; evaluate governance and data-minimization first.",
    notes: "No private donor records in CRCF 0.8.",
  },
  {
    id: "src-onecause-reference",
    name: "OneCause",
    tier: "Tier 5",
    type: "Historical/event platform context",
    category: "Historical event context",
    urlReference: "Historical/event platform context only",
    accessType: "Not connected",
    relatedFundCategories: ["Community Health"],
    relatedProgramCategories: [
      "Event history",
      "Sponsorship context",
      "Campaign planning",
    ],
    bestKeywordSignals: [
      "event",
      "sponsorship",
      "campaign",
      "auction",
      "historical",
    ],
    checkFrequency: "Future review",
    lastCheckedDate: "2026-05-13",
    reliability: "Not assessed",
    connectionStatus: "Not Connected",
    currentStatus: "Low Priority",
    usefulFor:
      "Historical event and sponsorship context only if staff consult the source separately.",
    recommendedStaffAction:
      "Keep disconnected; do not import participant, donor, or payment records.",
    notes: "No event-platform integration, outreach, or record updates.",
  },
];

const countSourcesBy = (
  field: "tier" | "connectionStatus" | "currentStatus",
  value: string,
) => sourceRegistry.filter((source) => source[field] === value).length;

export const sourceManagerSnapshot = {
  trackedSources: sourceRegistry.length,
  tierOneSources: countSourcesBy("tier", "Tier 1"),
  manualCheckSources: sourceRegistry.filter(
    (source) =>
      source.connectionStatus === "Manual Check" ||
      source.currentStatus === "Manual Check",
  ).length,
  futureApiCandidates: countSourcesBy(
    "connectionStatus",
    "Future API Candidate",
  ),
  nextRecommendedSourceReview:
    "Weekly Tier 1 review: Grants.gov and HRSA; capital/facility review: USDA, ARC, and rural urgent care sources.",
};

const activeFundingOpportunities = fundingOpportunities.filter(
  (opportunity) => opportunity.status !== "Archived",
);
const deadlineSoonOpportunities = activeFundingOpportunities.filter(
  (opportunity) => opportunity.deadlineRisk === "Deadline Soon",
);
const bestCurrentMatch =
  activeFundingOpportunities[0] ??
  ({
    title: "No live opportunities loaded yet",
    fundingType: "N/A",
    sourceName: "Connected sources pending",
    sourceTier: "N/A",
    sourceCategory: "N/A",
    deadline: "N/A",
    deadlineRisk: "N/A",
    status: "Needs Eligibility Review",
    fundMatch: "N/A",
    programMatch: "Use Proposal Scanner, Funding Search, or connected sources to find real opportunities.",
    geographyFit: "N/A",
    confidence: "Insufficient Data",
    estimatedEffort: "N/A",
    matchRequirement: "N/A",
    recommendedAction: "Paste a real opportunity notice or proposal text to begin.",
    shortMatchExplanation: "Coming soon: this area will show real source-backed opportunities after connected sources return results.",
    keywordSignals: [],
    keywordGroupMatches: [],
    lastCheckedDate: "N/A"
  } satisfies FundingOpportunity);

export const dashboardCards = [
  {
    title: "Find Funding Matches",
    metric: "Match-first",
    detail:
      "Search source-backed results with fit buckets and Grants.gov forecast/non-actionable routing.",
    href: "/funding-search",
  },
  {
    title: "Source Pilots",
    metric: "Read-only posture",
    detail:
      "View TDH/CFMT source-pilot and service-area validation posture via Source Database and pilot API.",
    href: "/source-database",
  },
  {
    title: "Source Database",
    metric: `${sourceDatabaseSnapshot.totalSources} tracked`,
    detail:
      "Manage connected, readiness, manual, state/private, and evidence source coverage.",
    href: "/source-database",
  },
  {
    title: "Review Queue",
    metric: "Server-only posture",
    detail:
      "Review internal queue posture for source-backed items with fail-closed handling when Firebase env is missing.",
    href: "/review-queue",
  },
  {
    title: "Evidence + Need Proof",
    metric: "Advisory readiness",
    detail:
      "Evidence sources support readiness and narrative context only; no fake stats and no external actions.",
    href: "/evidence-intelligence",
  },
  {
    title: "Past Awards / Funder Intelligence",
    metric: "Advisor-only",
    detail:
      "Use USAspending and advisor intelligence for past-award/funder context, not open application submission.",
    href: "/past-awards",
  },
];

export const fundClassReferences = [
  {
    name: "Cancer Patient Assistance",
    compactUse:
      "Screenings, treatment support, transportation, and cancer-related relief.",
    keywordHints: ["cancer support", "screenings", "Pink Ribbon", "prevention"],
    sampleExplanation:
      "Strong fit when an opportunity funds cancer prevention, screening, navigation, or patient-assistance costs.",
  },
  {
    name: "Community Health",
    compactUse:
      "Community benefit, prevention, equipment access, and rural health needs.",
    keywordHints: [
      "community health",
      "rural health",
      "medical equipment",
      "DME",
    ],
    sampleExplanation:
      "Use for broad health-access opportunities that improve regional community outcomes.",
  },
  {
    name: "Pediatric Patient Assistance",
    compactUse:
      "Children, families, pediatric patients, and child-centered health support.",
    keywordHints: ["pediatric health", "children", "family support"],
    sampleExplanation:
      "Good fit for child health, pediatric care access, or family relief connected to care.",
  },
  {
    name: "Heart Patient Assistance",
    compactUse:
      "Cardiac care support, prevention education, CPR, and heart-health access.",
    keywordHints: [
      "heart health",
      "CPR training",
      "cardiac",
      "A Woman's Heart",
    ],
    sampleExplanation:
      "Match when heart-health education, cardiac patient support, or CPR capacity is central.",
  },
  {
    name: "Hospice Patient Assistance",
    compactUse:
      "Hospice, end-of-life comfort, caregiver support, and family assistance.",
    keywordHints: ["hospice", "caregiver support", "end-of-life"],
    sampleExplanation:
      "Use for compassionate-care opportunities serving hospice patients or caregivers.",
  },
  {
    name: "Mental Health Patient Assistance",
    compactUse:
      "Behavioral health access, crisis support, and mental-health assistance.",
    keywordHints: [
      "mental health",
      "behavioral health",
      "vulnerable populations",
    ],
    sampleExplanation:
      "Applies when the funding purpose centers mental-health access or support services.",
  },
  {
    name: "Diabetes Patient Assistance",
    compactUse:
      "Diabetes education, supplies, prevention, and chronic-disease support.",
    keywordHints: ["diabetes", "chronic disease", "prevention"],
    sampleExplanation:
      "Use when an opportunity targets diabetes care, education, prevention, or supplies.",
  },
  {
    name: "Home Health",
    compactUse:
      "Home health, aging in place, mobility, and safe recovery support.",
    keywordHints: ["home health", "aging in place", "mobility aid"],
    sampleExplanation:
      "Fits grants that help residents receive safe care or support at home.",
  },
  {
    name: "Caring Hands",
    compactUse: "Flexible patient assistance and urgent charitable relief.",
    keywordHints: [
      "patient assistance",
      "charitable relief",
      "healthcare access",
    ],
    sampleExplanation:
      "Use when the need is direct assistance and does not belong to a narrower class.",
  },
  {
    name: "Empower UC",
    compactUse:
      "Regional capacity, workforce, and durable community-health initiatives.",
    keywordHints: ["Upper Cumberland", "capacity building", "workforce"],
    sampleExplanation:
      "Best for regional capacity-building work that advances healthier communities.",
  },
];

export const keywordHints = [
  "healthcare access",
  "rural health",
  "Upper Cumberland",
  "patient assistance",
  "community health",
  "prevention",
  "screenings",
  "medical equipment",
  "CPR training",
  "caregiver support",
  "capital facilities",
  "workforce capacity",
  "telehealth",
  "corporate giving",
  "urgent care",
  "clinic expansion",
  "coalition funding",
];

export const scannerSample = {
  pastedText: "Paste a real opportunity notice or proposal text to begin.",
  extractedNeeds: [],
  fundClasses: [],
  suggestedKeywords: [],
  recommendedAction: "Paste a real opportunity notice or proposal text to begin.",
};

export const proposalScannerExamples = [
  {
    label: "Start with real opportunity text",
    text: "Paste a real opportunity notice or proposal text to begin.",
  },
];

export const marketSignals = [
  {
    market: "Professional advisor networks",
    focus: "CPAs, estate attorneys, financial advisors, trust officers",
    use: "Planned-giving education and referral pathways",
  },
  {
    market: "Regional employers",
    focus: "Workforce, wellness, sponsorship, employee giving",
    use: "Aggregate sponsor strategy",
  },
  {
    market: "Healthcare-adjacent businesses",
    focus: "Senior care, medical suppliers, insurance, clinics",
    use: "Mission-aligned partnership themes",
  },
  {
    market: "Civic and community groups",
    focus: "Chambers, clubs, local events, service organizations",
    use: "Community awareness and event support",
  },
];

export const fundingRadarSnapshot = {
  activeLeadCount: activeFundingOpportunities.length,
  deadlineSoonCount: deadlineSoonOpportunities.length,
  bestCurrentMatch: bestCurrentMatch.title,
  nextReviewAction:
    "No live opportunities loaded yet. Use Proposal Scanner, Funding Search, or connected sources to find real opportunities.",
};

export const sampleReports = [
  {
    title: "Unified Funding Search Snapshot",
    body: "Unified Funding Search Snapshot: Staff can search connected source-backed opportunities from one page. Grants.gov is the first connected source; future sources will appear only after approved connector work. No fake opportunity results are displayed.",
  },
  {
    title: "Daily Funding Brief Snapshot",
    body: "Daily Funding Brief Snapshot: Future daily briefs will summarize new source-backed opportunities, deadline-soon items, reapplication watches, and evidence needs. No fake results are shown.",
  },
  {
    title: "Next Action Report",
    body: "Review structured Grants.gov-style rural health opportunities for eligibility and geography; monitor capital/facility sources for rural urgent care gaps; validate cancer screening deadline and match requirements.",
  },
  {
    title: "Proposal Scan Summary",
    body: "Sample pasted need: equipment closet and durable medical equipment support. Local scan result: likely Community Health fund match, Equipment Closet program match, corporate giving/community benefit and local trust source categories, and Funding Radar search terms such as medical equipment, DME, mobility, equipment closet, home recovery, and corporate giving.",
  },
  {
    title: "Proposal-to-Grants Match Summary",
    body: "Staff pasted a proposal concept, generated local search terms, searched Grants.gov live, reviewed ranked matches, and optionally built a read-only deep synopsis. No results were saved or submitted.",
  },
  {
    title: "Deep Synopsis Summary",
    body: "Staff selected a Grants.gov match, fetched read-only detail data, reviewed eligibility, likely CRCF role, research/delivery posture, source links, and recommended human next step. No results were saved or submitted.",
  },
  {
    title: "Opportunity Notice Scan Summary",
    body: "Pasted public opportunity notice text should extract title, number, agency, deadline, estimated funding, award ceiling/floor, match requirement, eligibility, likely CRCF role, and a draft Opportunity Database record. Human review remains required.",
  },
  {
    title: "Opportunity Database Snapshot",
    body: `${opportunityDatabaseSnapshot.totalOpportunities} local/static opportunity records are available, including ${opportunityDatabaseSnapshot.strategicGrowthLeads} strategic growth lead(s), ${opportunityDatabaseSnapshot.deadlineSoonItems} deadline-soon item(s), and ${opportunityDatabaseSnapshot.futureLiveApiPlaceholders} future live/API placeholder(s).`,
  },
  {
    title: "Funding Need Model Snapshot",
    body: "Funding Need Model Snapshot: CRCF funding lanes, bad-fit reasons, likely roles, review-priority labels, and source-depth levels help staff understand why an opportunity should be reviewed, ignored, or moved to partner-only review.",
  },
  {
    title: "Source Database Snapshot",
    body: "CRCF tracks connected, planned, parser, download, and manual/subscription funding sources with direct links, confidence labels, and human next steps. Grants.gov feeds Funding Search as the first connected source.",
  },
  {
    title: "Advisor Intelligence Snapshot",
    body: "Advisor Intelligence Snapshot: Intelligence sources help explain past funding patterns, community need evidence, recipient types, program context, and research-heavy fit. These sources support recommendation quality but are not application sources.",
  },
  {
    title: "Evidence Intelligence Snapshot",
    body: "Evidence Intelligence Snapshot: Need-proof and healthcare-burden sources help explain why opportunities may matter to CRCF/CRMC and the Upper Cumberland region. These sources improve narrative context and recommendation quality but are not application sources.",
  },
];

export const governanceRules = [
  "Unified Funding Search is read-only and for internal source review only.",
  "Unified Funding Search only shows real source-backed results from connected sources.",
  "Coming-soon sources in Unified Funding Search do not return fake data.",
  "Daily Funding Brief is read-only and does not apply, submit, email, contact funders, or write to source systems.",
  "The system does not apply, submit, email, contact funders, or write to source systems.",
  "No PHI, patient names, SSNs, private medical details, private donor records, QuickBooks exports, or DonorPerfect exports.",
  "This project does not use patient data; it is grant, funding, source, proposal, and donor-market intelligence only.",
  "Source Manager is a public/source-reference registry only; it stores static source metadata and does not crawl, scrape, or write to source systems.",
  "Source Database is a read-only planning registry. It does not connect, crawl, scrape, log in, submit, email, or write to any source system.",
  "Advisor Intelligence Sources are not application sources.",
  "USAspending is public-record intelligence only and is not an application source.",
  "Past-award intelligence is public/reference data only.",
  "Lack of a USAspending match does not mean no grant existed.",
  "USAspending matches may appear under related entities or partners.",
  "Public award matches must be human-verified.",
  "The system does not contact funders, apply, submit, or write to external systems.",
  "Parser/manual Source Database records are leads only and must be verified on the source page; direct Grants.gov, agency, NOFO, package, and attachment links should be preserved wherever available.",
  "No crawling, scraping, unapproved external APIs, login/session capture, Firebase, Firestore, source-system writes, or credential storage; approved read-only live API paths are Grants.gov Search, Grants.gov Detail Enrichment, and USAspending public award lookup.",
  "Proposal-to-Grants Match Engine uses local scanner output and read-only Grants.gov API calls only. Detail enrichment does not save data, submit applications, email anyone, write to external systems, or replace human review.",
  "Additional public APIs may be connected only in approved future phases. Public pages may be parsed read-only only after explicit approval.",
  "Authorized subscription/non-public sources require user review or approved export/import unless explicit permission/API exists.",
  "The system may return links and recommended search terms. It must not bypass logins, defeat access controls, scrape restricted databases, submit forms, send outreach, or write to external systems.",
  "DonorPerfect, DonorSearch, and OneCause are reference-only entries; no private records are imported or connected.",
  "Proposal Scanner accepts non-sensitive grant ideas, program descriptions, public opportunity text, and internal funding concepts only.",
  "Proposal Scanner is paste-only and local-first; only staff-triggered match and deep-synopsis buttons call approved read-only Grants.gov API routes.",
  "Opportunity Database is local/static code data only; it is not a live database service.",
  "Funding fit confidence is not a probability of award; it is a review-priority signal only.",
  "Matching output is a staff-review aid only and does not replace human eligibility review.",
  "Funding Radar, Opportunity Database, and Grants.gov deep synopses are staff review aids, not application systems, outreach systems, eligibility determinations, or source-of-record updaters.",
  "Grants.gov Detail Enrichment is read-only. It does not persist synopses, save results, submit applications, email funders, write to source systems, or remove the requirement for human verification on source pages.",
  "No automated outreach, public community-facing pages, grant submissions, or binding decisions.",
  "Human owner/staff review is required before any external, persistent, public-facing, source-system, outreach, or grant-submission action.",
  "Advisor intelligence sources are not application sources.",
  "Public award intelligence must be verified by humans.",
  "Evidence sources support narratives but do not guarantee eligibility or award outcomes.",
  "Public evidence/intelligence must be reviewed by humans.",
  "Internal references are informational only unless verified by staff.",
  "No evidence source performs outreach, applications, submissions, emails, source-system writes, database writes, or external actions.",
  "Evidence sources support narratives but do not prove eligibility.",
  "No source creates automatic applications, outreach, submissions, or external actions.",
  "Future learning loops must be structured, explainable, auditable, and human-reviewed.",
  "Learning Loop is an architecture shell only: no database writes, persistent storage, Firebase/Firestore, source-system writes, outreach, emails, or automatic grant submissions.",
];
