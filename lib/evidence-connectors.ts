export const evidenceMetricCategories = [
  "demographics",
  "poverty_income",
  "rural_status",
  "health_outcomes",
  "chronic_disease",
  "prevention_screenings",
  "mental_health",
  "substance_use",
  "aging_disability",
  "healthcare_workforce",
  "provider_shortage",
  "facility_access",
  "transportation_access",
  "mortality",
  "social_drivers",
  "labor_workforce",
  "county_comparison",
  "eligibility_preference",
] as const;

export const evidenceGeographyLevels = ["national", "state", "county", "city", "tract", "zip_zcta", "service_area", "custom_region"] as const;
export const evidenceVerificationStatuses = ["verified_source", "staff_verify_before_use", "needs_context", "possibly_outdated", "unavailable"] as const;

export type EvidenceMetricCategory = (typeof evidenceMetricCategories)[number];
export type EvidenceGeographyLevel = (typeof evidenceGeographyLevels)[number];
export type EvidenceVerificationStatus = (typeof evidenceVerificationStatuses)[number];

export type EvidenceSourceRecord = {
  sourceId: string;
  sourceName: string;
  sourceRole: string;
  connectorType: "API" | "Public Page Parser Readiness" | "Download / Bulk File" | "Manual / Staff Verification" | "Human Review Required";
  sourceUrl: string;
  directUrl: string;
  title: string;
  summary: string;
  evidenceCategory: string;
  metricCategories: EvidenceMetricCategory[];
  geography: string;
  geographyLevel: EvidenceGeographyLevel;
  updateFrequency: string;
  lastKnownUpdate: string;
  dataAccessMethod: string;
  healthFocusAreas: string[];
  ruralRelevance: string;
  crcFitRationale: string;
  verificationStatus: EvidenceVerificationStatus;
  confidenceLevel: "high" | "medium" | "staff_verification_required";
  humanReviewRequired: true;
  canSupportGrantNarrative: true;
  canSendToReviewQueue: false;
  sourceProofPresent: true;
  fetchedAt: string;
  notes: string;
};

export type EvidenceConnectorHealth = {
  sourceId: string;
  sourceName: string;
  status: "ready" | "manual" | "future_parser";
  lastChecked: string;
  message: string;
  requiresEnv: false;
  envConfigured: false;
  canFetch: boolean;
  canNormalize: true;
  canPersist: false;
  notes: string;
};

const defaultChecked = "2026-05-19";

export const evidenceSourceRecords: EvidenceSourceRecord[] = [
  { sourceId: "evidence-census-acs", sourceName: "Census ACS", sourceRole: "Evidence / Need-Proof Source", connectorType: "API", sourceUrl: "https://www.census.gov/programs-surveys/acs/", directUrl: "https://www.census.gov/programs-surveys/acs/data/data-via-api.html", title: "American Community Survey (ACS)", summary: "Population, poverty, income, age, disability, household, and county/service-area demographics for need narratives.", evidenceCategory: "demographics", metricCategories: ["demographics", "poverty_income", "aging_disability"], geography: "US, state, county, tract", geographyLevel: "county", updateFrequency: "annual", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public API / tables", healthFocusAreas: ["social drivers", "access barriers"], ruralRelevance: "Supports rural county/population context.", crcFitRationale: "Strengthens burden and service-area context before grant narrative drafting.", verificationStatus: "staff_verify_before_use", confidenceLevel: "high", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "Readiness model only; no live pull in CRCF 2.8." },
  { sourceId: "evidence-cdc-places", sourceName: "CDC PLACES", sourceRole: "Evidence / Need-Proof Source", connectorType: "Download / Bulk File", sourceUrl: "https://www.cdc.gov/places/", directUrl: "https://www.cdc.gov/places/tools/data-portal.html", title: "CDC PLACES indicators", summary: "County/place/ZCTA chronic disease and prevention indicators.", evidenceCategory: "chronic_disease", metricCategories: ["chronic_disease", "mental_health", "prevention_screenings"], geography: "County, place, ZCTA", geographyLevel: "zip_zcta", updateFrequency: "annual", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public datasets", healthFocusAreas: ["chronic burden", "prevention"], ruralRelevance: "Supports rural chronic burden comparisons.", crcFitRationale: "Advisory context for prevention and rural health priorities.", verificationStatus: "staff_verify_before_use", confidenceLevel: "medium", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "Distinct from CDC grant opportunity pages." },
  { sourceId: "evidence-hrsa-hpsa-mua", sourceName: "HRSA HPSA / MUA / MUP", sourceRole: "Evidence / Need-Proof Source", connectorType: "API", sourceUrl: "https://data.hrsa.gov/", directUrl: "https://data.hrsa.gov/topics/health-workforce/shortage-areas", title: "Shortage and underserved designations", summary: "Primary care, dental, and mental health shortage context plus MUA/MUP indicators.", evidenceCategory: "provider_shortage", metricCategories: ["provider_shortage", "healthcare_workforce", "eligibility_preference"], geography: "National/state/county/service area", geographyLevel: "service_area", updateFrequency: "rolling", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public tools and downloads", healthFocusAreas: ["workforce", "access"], ruralRelevance: "Critical for rural eligibility preference narratives.", crcFitRationale: "Supports documented shortage context and eligibility framing.", verificationStatus: "staff_verify_before_use", confidenceLevel: "high", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "Must verify designation date and geography before use." },
  { sourceId: "evidence-county-health-rankings", sourceName: "County Health Rankings", sourceRole: "Evidence / Need-Proof Source", connectorType: "Download / Bulk File", sourceUrl: "https://www.countyhealthrankings.org/", directUrl: "https://www.countyhealthrankings.org/health-data/methodology-and-sources/data-documentation", title: "County health outcomes and factors", summary: "County comparisons for health outcomes, factors, and social drivers.", evidenceCategory: "county_comparison", metricCategories: ["county_comparison", "health_outcomes", "social_drivers"], geography: "County", geographyLevel: "county", updateFrequency: "annual", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public downloads", healthFocusAreas: ["outcomes", "social drivers"], ruralRelevance: "Supports rural county comparison narratives.", crcFitRationale: "Useful for county burden framing in proposals.", verificationStatus: "staff_verify_before_use", confidenceLevel: "medium", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "No live connector yet." },
  { sourceId: "evidence-cdc-wonder", sourceName: "CDC WONDER", sourceRole: "Evidence / Need-Proof Source", connectorType: "Manual / Staff Verification", sourceUrl: "https://wonder.cdc.gov/", directUrl: "https://wonder.cdc.gov/", title: "Mortality and disease burden query system", summary: "Mortality and public health trend evidence for burden narratives.", evidenceCategory: "mortality", metricCategories: ["mortality", "health_outcomes"], geography: "National/state/county", geographyLevel: "county", updateFrequency: "varies", lastKnownUpdate: "Readiness only", dataAccessMethod: "Manual query / exports", healthFocusAreas: ["mortality", "burden"], ruralRelevance: "Can support rural mortality trend context.", crcFitRationale: "Evidence support for burden severity.", verificationStatus: "staff_verify_before_use", confidenceLevel: "medium", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "Manual verified extraction posture only." },
  { sourceId: "evidence-cms-data", sourceName: "CMS Data", sourceRole: "Evidence / Need-Proof Source", connectorType: "Download / Bulk File", sourceUrl: "https://data.cms.gov/", directUrl: "https://data.cms.gov/", title: "CMS public datasets", summary: "Provider, facility, utilization, and Medicare context.", evidenceCategory: "facility_access", metricCategories: ["facility_access", "healthcare_workforce"], geography: "National/state/county", geographyLevel: "state", updateFrequency: "varies", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public datasets and APIs", healthFocusAreas: ["health system capacity"], ruralRelevance: "Supports rural facility access context.", crcFitRationale: "Adds healthcare system context evidence.", verificationStatus: "staff_verify_before_use", confidenceLevel: "medium", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "No automated persistence." },
  { sourceId: "evidence-ahrf", sourceName: "AHRF — Area Health Resources Files", sourceRole: "Evidence / Need-Proof Source", connectorType: "Download / Bulk File", sourceUrl: "https://data.hrsa.gov/data/download", directUrl: "https://data.hrsa.gov/data/download", title: "Area Health Resources Files", summary: "Workforce and resource availability by geography.", evidenceCategory: "healthcare_workforce", metricCategories: ["healthcare_workforce", "facility_access"], geography: "County/state", geographyLevel: "county", updateFrequency: "annual", lastKnownUpdate: "Readiness only", dataAccessMethod: "Bulk files", healthFocusAreas: ["workforce", "facilities"], ruralRelevance: "Supports rural workforce constraint evidence.", crcFitRationale: "Useful for staffing/facility gap rationale.", verificationStatus: "staff_verify_before_use", confidenceLevel: "medium", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "Readiness only." },
  { sourceId: "evidence-rhib", sourceName: "Rural Health Information Hub", sourceRole: "Advisor Intelligence Source", connectorType: "Human Review Required", sourceUrl: "https://www.ruralhealthinfo.org/", directUrl: "https://www.ruralhealthinfo.org/", title: "Rural health context and guides", summary: "Rural topic guides and evidence summaries for context/discovery.", evidenceCategory: "rural_status", metricCategories: ["rural_status", "social_drivers"], geography: "US rural", geographyLevel: "custom_region", updateFrequency: "ongoing", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public pages/manual review", healthFocusAreas: ["rural access", "program context"], ruralRelevance: "Directly rural-focused.", crcFitRationale: "Supports staff context and discovery.", verificationStatus: "needs_context", confidenceLevel: "staff_verification_required", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "Context source; verify citations before proposal use." },
  { sourceId: "evidence-usda-ers-rural", sourceName: "USDA ERS Rural Atlas / county data", sourceRole: "Evidence / Need-Proof Source", connectorType: "Download / Bulk File", sourceUrl: "https://www.ers.usda.gov/data-products/", directUrl: "https://www.ers.usda.gov/data-products/county-level-data-sets/", title: "Rural county socioeconomic indicators", summary: "Rurality and county socioeconomic context.", evidenceCategory: "rural_status", metricCategories: ["rural_status", "poverty_income", "county_comparison"], geography: "County", geographyLevel: "county", updateFrequency: "varies", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public datasets", healthFocusAreas: ["rural economy"], ruralRelevance: "Core rural indicator source.", crcFitRationale: "Supports rural burden and context evidence.", verificationStatus: "staff_verify_before_use", confidenceLevel: "medium", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "No parser in this phase." },
  { sourceId: "evidence-bls-census-labor", sourceName: "BLS / Census labor and workforce data", sourceRole: "Evidence / Need-Proof Source", connectorType: "API", sourceUrl: "https://www.bls.gov/", directUrl: "https://www.bls.gov/developers/", title: "Labor and workforce indicators", summary: "Employment, wages, labor pressure, and workforce availability context.", evidenceCategory: "labor_workforce", metricCategories: ["labor_workforce", "healthcare_workforce", "poverty_income"], geography: "National/state/county/metro", geographyLevel: "state", updateFrequency: "monthly", lastKnownUpdate: "Readiness only", dataAccessMethod: "Public APIs and tables", healthFocusAreas: ["workforce pressure"], ruralRelevance: "Supports rural workforce challenges.", crcFitRationale: "Adds labor context for staffing-related asks.", verificationStatus: "staff_verify_before_use", confidenceLevel: "medium", humanReviewRequired: true, canSupportGrantNarrative: true, canSendToReviewQueue: false, sourceProofPresent: true, fetchedAt: defaultChecked, notes: "Read-only readiness in CRCF 2.8." },
];

export const evidenceConnectorHealth: EvidenceConnectorHealth[] = evidenceSourceRecords.map((s) => ({
  sourceId: s.sourceId,
  sourceName: s.sourceName,
  status: s.connectorType === "Manual / Staff Verification" || s.connectorType === "Human Review Required" ? "manual" : "ready",
  lastChecked: defaultChecked,
  message: "Readiness model only. Human verification required before grant narrative use.",
  requiresEnv: false,
  envConfigured: false,
  canFetch: false,
  canNormalize: true,
  canPersist: false,
  notes: "No live fetch, no autosave, no external actions.",
}));
