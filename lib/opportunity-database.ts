export const opportunityStatuses = [
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
  "Archived"
] as const;

export const opportunityOriginTypes = [
    "manual",
  "scanner-generated",
  "future-api",
  "public-page-monitor",
  "subscription-export",
  "staff-entered"
] as const;

export type OpportunityStatus = (typeof opportunityStatuses)[number];
export type OpportunityOriginType = (typeof opportunityOriginTypes)[number];

export type OpportunityRecord = {
  id: string;
  title: string;
  shortSummary: string;
  sourceId: string;
  sourceName: string;
  sourceTier: string;
  sourceCategory: string;
  sourceReference: string;
  originType: OpportunityOriginType;
  fundingType: string;
  fundingCategory: string;
  strategicGrowthCategory: string;
  currentAssistanceFit: string;
  expansionGrowthFit: string;
  fundMatch: string;
  programMatch: string;
  geographyFit: string;
  keywordGroupMatches: string[];
  keywordSignals: string[];
  deadline: string;
  deadlineRisk: string;
  status: OpportunityStatus;
  confidence: string;
  estimatedEffort: string;
  estimatedFundingScale: string;
  awardCeiling: string;
  awardFloor: string;
  expectedNumberOfAwards: string;
  matchRequirement: string;
  eligibilitySummary: string;
  recommendedCrcfRole: string;
  staffOwner: string;
  recommendedAction: string;
  nextReviewDate: string;
  lastUpdated: string;
  reviewNotes: string;
  whyMatched: string;
  governanceFlag: string;
  humanReviewRequired: boolean;
};

export const opportunityDatabase: OpportunityRecord[] = [];

export const opportunityDatabaseSnapshot = {
  totalOpportunities: opportunityDatabase.length,
  activeReviewOpportunities: opportunityDatabase.filter((opportunity) => opportunity.status !== "Archived").length,
  strategicGrowthLeads: opportunityDatabase.filter((opportunity) =>
    ["Strategic Growth Lead", "Facility / Urgent Care Candidate", "Capital Stack Candidate", "Coalition Funding Candidate"].includes(
      opportunity.status
    )
  ).length,
  deadlineSoonItems: opportunityDatabase.filter((opportunity) => opportunity.deadlineRisk === "Deadline Soon").length,
  futureLiveApiPlaceholders: opportunityDatabase.filter((opportunity) => opportunity.originType === "future-api").length,
  nextRecommendedReview:
    "No live opportunities loaded yet. Use Proposal Scanner, Funding Search, or connected sources to find real opportunities."
};

export const opportunityDatabaseByStatus = opportunityStatuses.map((status) => ({
  status,
  count: opportunityDatabase.filter((opportunity) => opportunity.status === status).length
}));

export const opportunityDatabaseByOriginType = opportunityOriginTypes.map((originType) => ({
  originType,
  count: opportunityDatabase.filter((opportunity) => opportunity.originType === originType).length
}));
