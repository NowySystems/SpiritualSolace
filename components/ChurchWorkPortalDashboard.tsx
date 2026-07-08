"use client";

import { ChurchWorkGuidedPortalDashboard } from "@/components/ChurchWorkGuidedPortalDashboard";

type PortalKind = "requester" | "facility" | "partner";

type ChurchWorkPortalDashboardProps = {
  portal: PortalKind;
};

export function ChurchWorkPortalDashboard({ portal }: ChurchWorkPortalDashboardProps) {
  return <ChurchWorkGuidedPortalDashboard portal={portal} />;
}
