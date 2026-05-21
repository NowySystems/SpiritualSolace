import { getSamAssistanceConnectorHealth } from "@/lib/sam-assistance";
import { getHealthcareRuralConnectorHealth } from "@/lib/healthcare-rural-connectors";
import type { ConnectorHealthStatus } from "@/lib/federal-connectors";

export function getFederalConnectorHealth(): ConnectorHealthStatus[] {
  return [
    ...getHealthcareRuralConnectorHealth(),
    {
      sourceId: "grants-gov",
      sourceName: "Grants.gov",
      status: "connected",
      lastChecked: "2026-05-19",
      message: "Live read-only opportunity search is connected.",
      requiresEnv: [],
      envConfigured: true,
      canFetch: true,
      canNormalize: true,
      canPersist: false,
      notes: "Opportunity source only. Human review required.",
    },
    getSamAssistanceConnectorHealth(),
    {
      sourceId: "usaspending",
      sourceName: "USAspending.gov",
      status: "connected",
      lastChecked: "2026-05-19",
      message: "Live read-only past-award intelligence lookup is connected.",
      requiresEnv: [],
      envConfigured: true,
      canFetch: true,
      canNormalize: true,
      canPersist: false,
      notes: "Past-award/advisor intelligence only. Not an application source.",
    },
  ];
}
