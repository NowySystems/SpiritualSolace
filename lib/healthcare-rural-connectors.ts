import { isoNow, type ConnectorHealthLevel, type SourceConnectorResult } from "@/lib/federal-connectors";

export type HealthRuralFundingCategory =
  | "rural_health_access"
  | "hospital_capacity"
  | "community_health"
  | "prevention_screenings"
  | "cancer"
  | "diabetes"
  | "heart"
  | "mental_health"
  | "substance_use"
  | "aging_disability"
  | "caregivers"
  | "healthcare_workforce"
  | "facilities_equipment"
  | "emergency_response"
  | "transportation_access"
  | "health_equity";

export type PartnerRequirementFlag = "none" | "possible" | "likely";

export type HealthcareRuralSourceRecord = {
  id: string;
  sourceName: string;
  sourceRole: string;
  connectorType: string;
  sourceUrl: string;
  directUrl: string;
  title: string;
  summary: string;
  agencyOrFunder: string;
  deadline: string;
  amountSummary: string;
  eligibilitySummary: string;
  geography: string;
  fundingCategories: string[];
  healthFocusAreas: HealthRuralFundingCategory[];
  ruralRelevance: string;
  crcFitRationale: string;
  researchFlag: string;
  partnerNeeded: PartnerRequirementFlag;
  confidenceLevel: string;
  humanReviewRequired: true;
  canSendToReviewQueue: false;
  sourceProofPresent: boolean;
  fetchedAt: string;
  notes: string;
};

export type HealthcareRuralConnectorResult = SourceConnectorResult<HealthcareRuralSourceRecord>;

export type HealthcareRuralConnectorHealth = {
  sourceId: string;
  sourceName: string;
  status: ConnectorHealthLevel;
  lastChecked: string;
  message: string;
  requiresEnv: string[];
  envConfigured: boolean;
  canFetch: boolean;
  canNormalize: boolean;
  canPersist: false;
  notes: string;
};

const checkedDate = "2026-05-19";

export function getHealthcareRuralConnectorHealth(): HealthcareRuralConnectorHealth[] {
  return [
    {
      sourceId: "hrsa-forhp",
      sourceName: "HRSA / FORHP",
      status: "ready",
      lastChecked: checkedDate,
      message: "Readiness mapping available for rural health, workforce, and access programs.",
      requiresEnv: [],
      envConfigured: true,
      canFetch: false,
      canNormalize: true,
      canPersist: false,
      notes: "Official-source mapping only; do not represent as open grant unless source-backed.",
    },
    {
      sourceId: "samhsa",
      sourceName: "SAMHSA",
      status: "manual",
      lastChecked: checkedDate,
      message: "Official source mapping is defined for behavioral health funding review.",
      requiresEnv: [],
      envConfigured: true,
      canFetch: false,
      canNormalize: true,
      canPersist: false,
      notes: "Mental health/substance use source mapping. Human verification required.",
    },
    {
      sourceId: "cdc",
      sourceName: "CDC",
      status: "manual",
      lastChecked: checkedDate,
      message: "Readiness model distinguishes CDC opportunities from CDC evidence/data pages.",
      requiresEnv: [],
      envConfigured: true,
      canFetch: false,
      canNormalize: true,
      canPersist: false,
      notes: "Public health/prevention source mapping only. No fake opportunity fallback.",
    },
    {
      sourceId: "acl",
      sourceName: "ACL",
      status: "ready",
      lastChecked: checkedDate,
      message: "Readiness mapping available for aging, disability, caregiver, and independent living programs.",
      requiresEnv: [],
      envConfigured: true,
      canFetch: false,
      canNormalize: true,
      canPersist: false,
      notes: "Read-only source mapping for future controlled connector implementation.",
    },
    {
      sourceId: "usda-rd-community-facilities",
      sourceName: "USDA Rural Development / Community Facilities",
      status: "ready",
      lastChecked: checkedDate,
      message: "Readiness mapping includes Community Facilities Direct Loan & Grant context.",
      requiresEnv: [],
      envConfigured: true,
      canFetch: false,
      canNormalize: true,
      canPersist: false,
      notes: "Distinguishes loan/grant/program-catalog context from active application windows.",
    },
  ];
}

export function getHealthcareRuralReadinessResult(): HealthcareRuralConnectorResult {
  return {
    sourceName: "Healthcare / Rural Federal Connectors",
    sourceRole: "Opportunity + Evidence Readiness",
    connectorType: "Readiness Mapping",
    records: [
      {
        id: "hrsa-forhp-readiness",
        sourceName: "HRSA / FORHP",
        sourceRole: "Opportunity Source",
        connectorType: "Public Page Parser",
        sourceUrl: "https://www.hrsa.gov/rural-health",
        directUrl: "https://www.hrsa.gov/rural-health",
        title: "HRSA/FORHP Rural Health Readiness Mapping",
        summary: "Tracks rural health access, workforce, facility, and community-based program relevance.",
        agencyOrFunder: "HRSA / FORHP",
        deadline: "Varies by official notice",
        amountSummary: "See source-backed notice details",
        eligibilitySummary: "Eligibility varies by program; verify official HRSA/Grants.gov listing.",
        geography: "US (rural priority)",
        fundingCategories: ["Federal opportunity", "Rural healthcare", "Healthcare workforce"],
        healthFocusAreas: ["rural_health_access", "healthcare_workforce", "community_health", "facilities_equipment"],
        ruralRelevance: "High",
        crcFitRationale: "Direct fit for rural healthcare access and community facility capacity goals.",
        researchFlag: "Research terms possible; verify delivery vs research role.",
        partnerNeeded: "possible",
        confidenceLevel: "likely_useful",
        humanReviewRequired: true,
        canSendToReviewQueue: false,
        sourceProofPresent: true,
        fetchedAt: isoNow(),
        notes: "Readiness-only record. Not represented as a live open grant without source-backed listing.",
      },
    ],
    fetchedAt: isoNow(),
    readOnly: true,
    humanReviewRequired: true,
    automaticPersistenceEnabled: false,
  };
}
