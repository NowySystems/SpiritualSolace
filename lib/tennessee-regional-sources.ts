export const tnRegionalSourceRoles = [
  "Opportunity Source",
  "Community Foundation Source",
  "Private Foundation Source",
  "Corporate Giving Source",
  "Regional / Local Public Source",
  "State Funding Source",
  "Appropriations / Political Giving Source",
  "Manual / Human Review Required Source",
  "Advisor Intelligence Source",
] as const;

export const tnRegionalConnectorTypes = [
  "Public Page Parser Readiness",
  "Manual / Staff Verification",
  "API if available",
  "Download / Bulk File",
  "Foundation / Public Grant Page",
  "Corporate Giving Page",
  "Human Review Required",
] as const;

export type TennesseeRegionalSourceRecord = {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceRole: (typeof tnRegionalSourceRoles)[number];
  connectorType: (typeof tnRegionalConnectorTypes)[number];
  sourceCategory: string;
  geography: string;
  tennesseeRelevance: "High" | "Medium" | "Targeted";
  upperCumberlandRelevance: "High" | "Potential" | "Limited";
  possibleFundingCategories: string[];
  applicantEligibilityNotes: string;
  crmcfFitRationale: string;
  partnerNeededReason?: string;
  serviceAreaValidationNotes: string;
  applicationComplexityEstimate?: "Low" | "Medium" | "High";
  deadlinePattern?: string;
  publicGrantPageAvailable: boolean;
  authRequired: boolean;
  termsRisk: "low" | "medium" | "high";
  humanReviewRequired: boolean;
  confidenceLevel: "verified" | "likely_useful" | "needs_review";
  sourceProofPresent: boolean;
  canFetch: boolean;
  canNormalize: boolean;
  canPersist: boolean;
  notes: string;
};

const base = {
  humanReviewRequired: true,
  sourceProofPresent: true,
  canFetch: false,
  canNormalize: true,
  canPersist: false,
} as const;

export const tennesseeRegionalSourceRecords: TennesseeRegionalSourceRecord[] = [
  { id: "tn-health", sourceName: "Tennessee Department of Health", sourceUrl: "https://www.tn.gov/health", sourceRole: "State Funding Source", connectorType: "Public Page Parser Readiness", sourceCategory: "Tennessee State Sources", geography: "Tennessee", tennesseeRelevance: "High", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["community health", "rural healthcare access", "cancer / screening / prevention"], applicantEligibilityNotes: "Varies by notice; nonprofit/provider/public partnerships are common.", crmcfFitRationale: "Strong community-health and prevention alignment.", serviceAreaValidationNotes: "Validate county/service-area limits on each notice.", applicationComplexityEstimate: "Medium", deadlinePattern: "Rolling + periodic cycles", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "likely_useful", notes: "Readiness model only; no live parser in 3.1.", ...base },
  { id: "tn-mhsas", sourceName: "TN Department of Mental Health & Substance Abuse Services", sourceUrl: "https://www.tn.gov/behavioral-health", sourceRole: "State Funding Source", connectorType: "Public Page Parser Readiness", sourceCategory: "Tennessee State Sources", geography: "Tennessee", tennesseeRelevance: "High", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["mental health / substance use", "community health"], applicantEligibilityNotes: "Often provider-network or county-administered.", crmcfFitRationale: "Strong behavioral-health alignment.", partnerNeededReason: "May require county/provider lead partner.", serviceAreaValidationNotes: "Do not assume statewide notices include Upper Cumberland awards.", applicationComplexityEstimate: "Medium", deadlinePattern: "Notice-based", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "likely_useful", notes: "Manual verification required per notice.", ...base },
  { id: "tn-dhs", sourceName: "Tennessee Department of Human Services", sourceUrl: "https://www.tn.gov/humanservices", sourceRole: "State Funding Source", connectorType: "Manual / Staff Verification", sourceCategory: "Tennessee State Sources", geography: "Tennessee", tennesseeRelevance: "High", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["patient assistance", "pediatrics / family support", "social drivers of health"], applicantEligibilityNotes: "Eligibility and program mechanisms vary by division.", crmcfFitRationale: "Useful for wraparound support and access pathways.", serviceAreaValidationNotes: "Validate eligible entities and subcontract rules.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "needs_review", notes: "Manual readiness until stable grant pages are identified.", ...base },
  { id: "tn-finance-admin", sourceName: "Tennessee Department of Finance and Administration", sourceUrl: "https://www.tn.gov/finance", sourceRole: "Appropriations / Political Giving Source", connectorType: "Human Review Required", sourceCategory: "Tennessee State Sources", geography: "Tennessee", tennesseeRelevance: "Medium", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["capital / facilities", "nonprofit capacity"], applicantEligibilityNotes: "Often appropriations/budget policy context, not direct open grants.", crmcfFitRationale: "Useful for human-reviewed appropriations intelligence.", serviceAreaValidationNotes: "Appropriations pathways are politically scoped and require staff validation.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "medium", confidenceLevel: "needs_review", notes: "Human-review only source.", ...base },
  { id: "ucdd", sourceName: "Upper Cumberland Development District", sourceUrl: "https://www.ucdd.org", sourceRole: "Regional / Local Public Source", connectorType: "Manual / Staff Verification", sourceCategory: "Regional / Local Public Sources", geography: "Upper Cumberland", tennesseeRelevance: "High", upperCumberlandRelevance: "High", possibleFundingCategories: ["transportation access", "capital / facilities", "community health"], applicantEligibilityNotes: "Program-specific and often partnership-led.", crmcfFitRationale: "High-value local source for practical regional pathways.", serviceAreaValidationNotes: "Strong local relevance; still validate program-by-program eligibility.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "likely_useful", notes: "Manual verification required.", ...base },
  { id: "uchra", sourceName: "UCHRA", sourceUrl: "https://www.uchra.com", sourceRole: "Regional / Local Public Source", connectorType: "Manual / Staff Verification", sourceCategory: "Regional / Local Public Sources", geography: "Upper Cumberland", tennesseeRelevance: "High", upperCumberlandRelevance: "High", possibleFundingCategories: ["patient assistance", "housing/community support", "food insecurity"], applicantEligibilityNotes: "Commonly partnership/service-delivery aligned.", crmcfFitRationale: "Strong local social-driver fit.", serviceAreaValidationNotes: "Regional fit is strong; eligibility still program specific.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "likely_useful", notes: "No auto-persistence.", ...base },
  { id: "cookeville-putnam", sourceName: "City of Cookeville / Putnam County", sourceUrl: "https://www.cookeville-tn.gov", sourceRole: "Regional / Local Public Source", connectorType: "Manual / Staff Verification", sourceCategory: "Regional / Local Public Sources", geography: "Putnam/Cookeville", tennesseeRelevance: "High", upperCumberlandRelevance: "High", possibleFundingCategories: ["transportation access", "emergency response", "capital / facilities"], applicantEligibilityNotes: "Government-led opportunities may require nonprofit partner role.", crmcfFitRationale: "Local partnership pathways with high practical relevance.", partnerNeededReason: "Government often serves as primary applicant.", serviceAreaValidationNotes: "Explicitly local service area.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "needs_review", notes: "Human review required.", ...base },
  { id: "cfmt", sourceName: "Community Foundation of Middle Tennessee", sourceUrl: "https://www.cfmt.org", sourceRole: "Community Foundation Source", connectorType: "Foundation / Public Grant Page", sourceCategory: "Community Foundation Sources", geography: "Middle Tennessee", tennesseeRelevance: "High", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["community health", "patient assistance", "nonprofit capacity"], applicantEligibilityNotes: "Varies by fund and grant cycle.", crmcfFitRationale: "Strong philanthropic mission alignment when geography matches.", serviceAreaValidationNotes: "Do not assume all funds include Upper Cumberland.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "likely_useful", notes: "Service-area validation required.", ...base },
  { id: "east-tn-foundation", sourceName: "East Tennessee Foundation", sourceUrl: "https://easttennesseefoundation.org", sourceRole: "Community Foundation Source", connectorType: "Foundation / Public Grant Page", sourceCategory: "Community Foundation Sources", geography: "East Tennessee", tennesseeRelevance: "Medium", upperCumberlandRelevance: "Limited", possibleFundingCategories: ["community health", "aging / disability"], applicantEligibilityNotes: "Geography-driven fund eligibility.", crmcfFitRationale: "Useful when target communities overlap fund coverage.", serviceAreaValidationNotes: "Coverage is county/fund dependent; verify Upper Cumberland overlap.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "needs_review", notes: "Readiness only.", ...base },
  { id: "healing-trust", sourceName: "The Healing Trust", sourceUrl: "https://www.thehealingtrust.org", sourceRole: "Private Foundation Source", connectorType: "Foundation / Public Grant Page", sourceCategory: "Private Foundation / Prospect Research Sources", geography: "Tennessee", tennesseeRelevance: "High", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["community health", "mental health / substance use", "social drivers of health"], applicantEligibilityNotes: "Program and geographic filters apply.", crmcfFitRationale: "Strong health-equity/community-health fit.", serviceAreaValidationNotes: "Validate whether current cycles include Upper Cumberland.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "likely_useful", notes: "No automation.", ...base },
  { id: "bcbst-foundation", sourceName: "BlueCross BlueShield of Tennessee Foundation", sourceUrl: "https://www.bcbst.com/foundation", sourceRole: "Private Foundation Source", connectorType: "Foundation / Public Grant Page", sourceCategory: "Private Foundation / Prospect Research Sources", geography: "Tennessee", tennesseeRelevance: "High", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["community health", "pediatrics / family support"], applicantEligibilityNotes: "Program-specific requirements and timelines.", crmcfFitRationale: "Good potential fit for community benefit priorities.", serviceAreaValidationNotes: "Statewide brand does not guarantee Upper Cumberland eligibility.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "low", confidenceLevel: "likely_useful", notes: "Service-area check required before high-fit scoring.", ...base },
  { id: "cvs-foundation", sourceName: "CVS Health Foundation", sourceUrl: "https://www.cvshealth.com/social-responsibility/philanthropy.html", sourceRole: "Corporate Giving Source", connectorType: "Corporate Giving Page", sourceCategory: "Corporate Giving Sources", geography: "US", tennesseeRelevance: "Medium", upperCumberlandRelevance: "Limited", possibleFundingCategories: ["community health", "mental health / substance use"], applicantEligibilityNotes: "Corporate cycles and invitation/open windows vary.", crmcfFitRationale: "Potential national corporate health philanthropy fit.", serviceAreaValidationNotes: "Validate if open opportunities include Tennessee and rural geographies.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "medium", confidenceLevel: "needs_review", notes: "Manual verification due to changing corporate program structures.", ...base },
  { id: "walmart-foundation", sourceName: "Walmart Foundation", sourceUrl: "https://www.walmart.org", sourceRole: "Corporate Giving Source", connectorType: "Corporate Giving Page", sourceCategory: "Corporate Giving Sources", geography: "US", tennesseeRelevance: "Medium", upperCumberlandRelevance: "Potential", possibleFundingCategories: ["food insecurity", "community health", "nonprofit capacity"], applicantEligibilityNotes: "Program-specific and often region/store linked.", crmcfFitRationale: "Potential practical fit for community support projects.", serviceAreaValidationNotes: "Must validate local-store/community grant availability in Upper Cumberland.", publicGrantPageAvailable: true, authRequired: false, termsRisk: "medium", confidenceLevel: "likely_useful", notes: "Human-review required source.", ...base },
];

export const tennesseeRegionalConnectorHealth = tennesseeRegionalSourceRecords.map((source) => ({
  sourceId: source.id,
  sourceName: source.sourceName,
  status: source.canFetch ? "ready" : "manual",
  message: source.canFetch
    ? "Public endpoint appears suitable for controlled fetch once approved."
    : "Manual/staff verification in CRCF 3.1; no live connector execution.",
}));
