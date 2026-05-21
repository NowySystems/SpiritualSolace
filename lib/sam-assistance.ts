import { isoNow, type ConnectorHealthStatus, type FederalProgramRecord, type SourceConnectorResult } from "@/lib/federal-connectors";

const SAM_ENV_KEY = "SAM_GOV_API_KEY";

export function getSamAssistanceConnectorHealth(): ConnectorHealthStatus {
  const envConfigured = Boolean(process.env[SAM_ENV_KEY]);

  return {
    sourceId: "sam-assistance",
    sourceName: "SAM.gov Assistance Listings",
    status: envConfigured ? "ready" : "env_required",
    lastChecked: new Date().toISOString().slice(0, 10),
    message: envConfigured
      ? "API key configured. Connector is read-only and ready for controlled fetch wiring."
      : "SAM.gov Assistance Listings API key is not configured.",
    requiresEnv: [SAM_ENV_KEY],
    envConfigured,
    canFetch: envConfigured,
    canNormalize: true,
    canPersist: false,
    notes: "Program catalog/context source only. Not treated as open opportunity application feed.",
  };
}

export function getSamAssistanceUnavailableResult(): SourceConnectorResult<FederalProgramRecord> {
  return {
    sourceName: "SAM.gov Assistance Listings",
    sourceRole: "Program Catalog Source",
    connectorType: "API",
    records: [],
    fetchedAt: isoNow(),
    readOnly: true,
    humanReviewRequired: true,
    automaticPersistenceEnabled: false,
  };
}
