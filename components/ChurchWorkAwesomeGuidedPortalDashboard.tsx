"use client";

import { ChurchWorkCareLedgerDashboard } from "@/components/ChurchWorkCareLedgerDashboard";

type PortalKind = "requester" | "facility" | "partner";

export type ChurchWorkAwesomeGuidedPortalDashboardProps = {
  portal: PortalKind;
};

export function ChurchWorkAwesomeGuidedPortalDashboard({ portal }: ChurchWorkAwesomeGuidedPortalDashboardProps) {
  return <ChurchWorkCareLedgerDashboard portal={portal} />;
}
