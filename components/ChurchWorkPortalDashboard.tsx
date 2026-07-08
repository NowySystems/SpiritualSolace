"use client";

import { ChurchWorkAwesomeGuidedPortalDashboard } from "@/components/ChurchWorkAwesomeGuidedPortalDashboard";

type PortalKind = "requester" | "facility" | "partner";

type ChurchWorkPortalDashboardProps = {
  portal: PortalKind;
};

export function ChurchWorkPortalDashboard({ portal }: ChurchWorkPortalDashboardProps) {
  return <ChurchWorkAwesomeGuidedPortalDashboard portal={portal} />;
}
