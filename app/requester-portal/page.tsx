import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkGuidedPortalDashboard } from "@/components/ChurchWorkGuidedPortalDashboard";

export default function RequesterPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkGuidedPortalDashboard portal="requester" />
    </ChurchWorkAccessGate>
  );
}
