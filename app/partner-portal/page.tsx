import { ChurchWorkAccessGate } from "@/components/ChurchWorkAccessGate";
import { ChurchWorkGuidedPortalDashboard } from "@/components/ChurchWorkGuidedPortalDashboard";

export default function PartnerPortalPage() {
  return (
    <ChurchWorkAccessGate>
      <ChurchWorkGuidedPortalDashboard portal="partner" />
    </ChurchWorkAccessGate>
  );
}
