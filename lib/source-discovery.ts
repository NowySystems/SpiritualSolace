export const SOURCE_DISCOVERY_AGENT_LABEL = "Read-only Public Source Discovery Agent" as const;

export const sourceLeadStatuses = [
  "new_lead",
  "needs_review",
  "likely_useful",
  "low_confidence",
  "duplicate",
  "rejected",
  "promoted_to_registry",
  "restricted_manual_only",
] as const;

export const sourceLeadCategories = [
  "Federal Agency",
  "State / Local Government",
  "Foundation",
  "Corporate Giving",
  "Rural Health / Resource",
  "Community Foundation",
  "Public Funding List",
  "Press Release / Award Notice",
] as const;

export type SourceLeadStatus = (typeof sourceLeadStatuses)[number];
export type SourceLeadCategory = (typeof sourceLeadCategories)[number];

export type SourceLeadRecord = {
  id: string;
  sourceName: string;
  sourceUrl: string;
  discoveredFrom: string;
  sourceCategory: SourceLeadCategory;
  sourceRole: string;
  connectorType: string;
  accessMethod: string;
  geography: string;
  possibleFundingCategories: string[];
  crcFitRationale: string;
  riskNotes: string;
  termsRisk: "Low" | "Medium" | "High" | "Restricted";
  confidenceLevel: "Low" | "Medium" | "High";
  humanReviewRequired: true;
  recommendedStatus: SourceLeadStatus;
  discoveredAt: string;
  lastCheckedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewDecision: string | null;
  promotedSourceId: string | null;
};

export const sourceDiscoveryGovernance = {
  mode: "read_only_advisory",
  liveCrawlerEnabled: false,
  autoPromotionEnabled: false,
  externalActionsEnabled: false,
  requiresHumanReview: true,
  notes:
    "Design/readiness model only. The Source Discovery Agent can recommend leads for review and cannot approve, activate, contact, apply, submit, or write externally.",
} as const;
