export type ConnectorHealthLevel = "connected" | "ready" | "env_required" | "manual" | "unavailable";

export type ConnectorHealthStatus = {
  sourceId: string;
  sourceName: string;
  status: ConnectorHealthLevel;
  lastChecked: string;
  message: string;
  requiresEnv: string[];
  envConfigured: boolean;
  canFetch: boolean;
  canNormalize: boolean;
  canPersist: boolean;
  notes: string;
};

export type NormalizedFundingSourceResult = {
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
  confidenceLevel: string;
  humanReviewRequired: boolean;
  canSendToReviewQueue: boolean;
  sourceProofPresent: boolean;
  fetchedAt: string;
  badFitReasons: string[];
  researchFlag?: string;
};

export type FederalOpportunityRecord = NormalizedFundingSourceResult & {
  opportunityNumber: string;
  descriptionSummary: string;
};

export type FederalProgramRecord = NormalizedFundingSourceResult & {
  programNumber: string;
  assistanceListingNumber: string;
};

export type FederalAwardRecord = NormalizedFundingSourceResult & {
  awardId: string;
  recipientName: string;
  recipientLocation: string;
  agency: string;
  subAgency: string;
  awardAmount: string;
  awardDate: string;
  awardType: string;
  assistanceListingNumber: string;
  relevanceSummary: string;
};

export type SourceConnectorResult<T> = {
  sourceName: string;
  sourceRole: string;
  connectorType: string;
  records: T[];
  fetchedAt: string;
  readOnly: true;
  humanReviewRequired: true;
  automaticPersistenceEnabled: false;
};

export function isoNow() {
  return new Date().toISOString();
}
